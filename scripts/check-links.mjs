import fs from 'fs';
import path from 'path';

const htmlFiles = [];
function walkDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const f = path.join(dir, item);
    if (fs.statSync(f).isDirectory()) walkDir(f);
    else if (item.endsWith('.html')) htmlFiles.push(f);
  }
}
walkDir('dist');

// 从 _astro 目录收集 CSS/JS 资源
const assetFiles = new Set();
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const cssRegex = /href="\/testdev-interview-site\/(_astro\/[^"]+)"/g;
  let m;
  while ((m = cssRegex.exec(content)) !== null) {
    assetFiles.add('/testdev-interview-site/' + m[1]);
  }
}

// 收集所有 dist 下的文件路径（带 base path）
const BASE = '/testdev-interview-site';
const distFiles = new Set();
for (const file of htmlFiles) {
  const rel = file.replace('dist', '').replace(/\\/g, '/');
  // HTML 文件作为页面路径
  const pagePath = rel.endsWith('/index.html') ? rel.replace('/index.html', '/') : rel.replace('.html', '');
  distFiles.add(BASE + pagePath);
  if (pagePath.endsWith('/')) distFiles.add(BASE + pagePath.slice(0, -1));
}

// 添加静态资源
const publicDir = 'dist';
for (const f of fs.readdirSync(publicDir)) {
  if (f.endsWith('.svg') || f.endsWith('.xml')) {
    distFiles.add(BASE + '/' + f);
  }
  if (f === '_astro') {
    const astroDir = path.join(publicDir, f);
    if (fs.statSync(astroDir).isDirectory()) {
      for (const af of fs.readdirSync(astroDir)) {
        distFiles.add(BASE + '/_astro/' + af);
      }
    }
  }
}

const linkRegex = /href="([^"]+)"/g;
const allLinks = new Set();
const linkSources = new Map();

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('/@') && !href.startsWith('data:')) {
      allLinks.add(href);
      if (!linkSources.has(href)) linkSources.set(href, []);
      const relFile = file.replace('dist', '').replace(/\\/g, '/');
      linkSources.get(href).push(relFile);
    }
  }
}

console.log('=== 内部链接检查 ===\n');
console.log('总链接数:', allLinks.size);
console.log('有效路径数:', distFiles.size);

const broken = [];
const working = [];

for (const link of [...allLinks].sort()) {
  // 相对链接需要解析
  if (link.startsWith('/')) {
    if (distFiles.has(link)) {
      working.push(link);
    } else {
      broken.push(link);
    }
  } else if (link.startsWith('http')) {
    working.push(link); // 外部链接跳过
  } else {
    // 相对链接 - 不检查（Starlight 处理）
    working.push(link);
  }
}

console.log('\n有效链接:', working.length);
console.log('损坏链接:', broken.length);

if (broken.length > 0) {
  console.log('\n=== 损坏链接详情 ===');
  for (const link of broken) {
    const sources = linkSources.get(link) || [];
    console.log('  BROKEN: ' + link);
    console.log('    Found in: ' + [...new Set(sources)].slice(0, 2).join(', '));
  }
} else {
  console.log('\n所有链接都有效!');
}

// 额外：检查 markdown 源文件中的链接
console.log('\n=== Markdown 源文件链接检查 ===\n');
const mdFiles = [];
function walkMdDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    const f = path.join(dir, item);
    if (fs.statSync(f).isDirectory()) walkMdDir(f);
    else if (item.endsWith('.md') || item.endsWith('.mdx')) mdFiles.push(f);
  }
}
walkMdDir('src/content/docs');

const mdLinkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
const mdBroken = [];
const mdValidSlugs = new Set();

// 收集所有有效的 slug
for (const file of mdFiles) {
  const rel = file.replace('src/content/docs/', '').replace(/\\/g, '/');
  const slug = rel.replace(/\.mdx?$/, '').replace(/\/index$/, '');
  mdValidSlugs.add(slug);
}

for (const file of mdFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const relFile = file.replace('src/content/docs/', '').replace(/\\/g, '/');
  let match;
  while ((match = mdLinkRegex.exec(content)) !== null) {
    const href = match[2];
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('/src/')) continue;
    // 解析链接目标
    let target = href;
    if (target.startsWith('/testdev-interview-site/')) {
      target = target.replace('/testdev-interview-site/', '');
    }
    if (target.startsWith('/')) {
      target = target.slice(1);
    }
    target = target.replace(/\/$/, '');
    if (target && !target.includes('..') && !mdValidSlugs.has(target)) {
      mdBroken.push({ file: relFile, link: href, target });
    }
  }
}

console.log('Markdown 有效 slug:', mdValidSlugs.size);
console.log('Markdown 损坏链接:', mdBroken.length);
if (mdBroken.length > 0) {
  for (const b of mdBroken) {
    console.log('  BROKEN: ' + b.link + ' (in ' + b.file + ')');
  }
}