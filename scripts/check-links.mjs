// 构建产物链接检查:
// 1. 扫描 dist 里所有 HTML 的 href,校验站内路径真实存在
// 2. 扫描 markdown 源文件里的相对链接,校验目标 slug 真实存在
// 发现损坏链接时以非零码退出,可被 CI 和 npm scripts 直接使用
import fs from "fs";
import path from "path";

const BASE = "/testdev-interview-site";

// ---------- 收集 dist 下的 HTML ----------
const htmlFiles = [];
function walkDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const f = path.join(dir, item);
    if (fs.statSync(f).isDirectory()) walkDir(f);
    else if (item.endsWith(".html")) htmlFiles.push(f);
  }
}
walkDir("dist");

// ---------- 构建有效路径集合 ----------
const distFiles = new Set();
for (const file of htmlFiles) {
  const rel = file.replace(/^dist/, "").replace(/\\/g, "/");
  const pagePath = rel.endsWith("/index.html")
    ? rel.replace("/index.html", "/")
    : rel.replace(/\.html$/, "");
  distFiles.add(BASE + pagePath);
  if (pagePath.endsWith("/")) distFiles.add(BASE + pagePath.slice(0, -1));
}

// 静态资源:favicon/sitemap 等根文件 + _astro 产物
for (const f of fs.readdirSync("dist")) {
  if (f.endsWith(".svg") || f.endsWith(".xml")) distFiles.add(`${BASE}/${f}`);
  if (f === "_astro") {
    for (const af of fs.readdirSync(path.join("dist", f))) {
      distFiles.add(`${BASE}/_astro/${af}`);
    }
  }
}

// ---------- 检查 HTML 里的链接 ----------
const linkRegex = /href="([^"]+)"/g;
const allLinks = new Set();
const linkSources = new Map();

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, "utf-8");
  linkRegex.lastIndex = 0;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("/@") &&
      !href.startsWith("data:")
    ) {
      allLinks.add(href);
      if (!linkSources.has(href)) linkSources.set(href, []);
      const relFile = file.replace(/^dist/, "").replace(/\\/g, "/");
      linkSources.get(href).push(relFile);
    }
  }
}

console.log("=== 内部链接检查 ===\n");
console.log("总链接数:", allLinks.size);
console.log("有效路径数:", distFiles.size);

const broken = [];
const working = [];

for (const link of [...allLinks].sort()) {
  if (link.startsWith("/")) {
    // 去掉 fragment 和 query 后再比对路径
    const purePath = link.split("#")[0].split("?")[0];
    const candidate = purePath === "" ? BASE + "/" : purePath;
    if (distFiles.has(candidate) || distFiles.has(link)) {
      working.push(link);
    } else {
      broken.push(link);
    }
  } else {
    // 外部链接与相对链接交由 Starlight/浏览器处理,这里跳过
    working.push(link);
  }
}

console.log("\n有效链接:", working.length);
console.log("损坏链接:", broken.length);

if (broken.length > 0) {
  console.log("\n=== 损坏链接详情 ===");
  for (const link of broken) {
    const sources = [...new Set(linkSources.get(link) || [])].slice(0, 2);
    console.log(`  BROKEN: ${link}  (in ${sources.join(", ")})`);
  }
}

// ---------- 检查 markdown 源文件里的链接 ----------
console.log("\n=== Markdown 源文件链接检查 ===\n");
const mdFiles = [];
function walkMdDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const f = path.join(dir, item);
    if (fs.statSync(f).isDirectory()) walkMdDir(f);
    else if (item.endsWith(".md") || item.endsWith(".mdx")) mdFiles.push(f);
  }
}
walkMdDir("src/content/docs");

const mdLinkRegex = /\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g;
const mdBroken = [];
const mdValidSlugs = new Set();

for (const file of mdFiles) {
  const rel = file.replace(/^src\/content\/docs\//, "").replace(/\\/g, "/");
  const slug = rel.replace(/\.mdx?$/, "").replace(/\/index$/, "");
  mdValidSlugs.add(slug);
}

for (const file of mdFiles) {
  const content = fs.readFileSync(file, "utf-8");
  const relFile = file.replace(/^src\/content\/docs\//, "").replace(/\\/g, "/");
  mdLinkRegex.lastIndex = 0;
  let match;
  while ((match = mdLinkRegex.exec(content)) !== null) {
    const href = match[2];
    if (
      href.startsWith("http") ||
      href.startsWith("#") ||
      href.startsWith("mailto:")
    ) {
      continue;
    }
    // 解析成相对于 docs 根目录的 slug(去掉 fragment/query/末尾斜杠/.md)
    let target = href.split("#")[0].split("?")[0];
    if (target.startsWith("/")) {
      // 绝对链接(可能带 BASE 前缀):相对 docs 根目录
      if (target.startsWith(BASE + "/")) target = target.slice(BASE.length);
      target = target.replace(/^\//, "").replace(/\/$/, "");
    } else {
      // 相对链接:Starlight 按页面 URL 目录解析,即把文件 slug 本身当作一层目录
      // 例: beginner-course/pytest-first-test.md 里的 ../http-api-basics/ → beginner-course/http-api-basics
      let baseDir = relFile.replace(/\.mdx?$/, "");
      baseDir = baseDir.replace(/\/index$/, "");
      target = path.posix
        .normalize(path.posix.join(baseDir, target))
        .replace(/\/$/, "");
    }
    target = target.replace(/\.mdx?$/, "");
    if (target && !mdValidSlugs.has(target)) {
      mdBroken.push({ file: relFile, link: href, target });
    }
  }
}

console.log("Markdown 有效 slug:", mdValidSlugs.size);
console.log("Markdown 损坏链接:", mdBroken.length);
if (mdBroken.length > 0) {
  for (const b of mdBroken) {
    console.log(`  BROKEN: ${b.link}  (in ${b.file}, target: ${b.target})`);
  }
}

// ---------- 汇总退出码 ----------
if (broken.length > 0 || mdBroken.length > 0) {
  console.log("\n链接检查未通过。");
  process.exit(1);
}
console.log("\n所有链接都有效!");
