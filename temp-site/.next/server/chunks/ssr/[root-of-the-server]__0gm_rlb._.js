module.exports=[49002,a=>{a.v({className:"noto_sans_sc_86ca4c34-module__5MYOGa__className",variable:"noto_sans_sc_86ca4c34-module__5MYOGa__variable"})},23142,a=>{a.v({className:"jetbrains_mono_9a2f2d6c-module__wsyXyG__className",variable:"jetbrains_mono_9a2f2d6c-module__wsyXyG__variable"})},27572,a=>{"use strict";var b=a.i(7997),c=a.i(49002);let d={className:c.default.className,style:{fontFamily:"'Noto Sans SC', 'Noto Sans SC Fallback'",fontStyle:"normal"}};null!=c.default.variable&&(d.variable=c.default.variable);var e=a.i(23142);let f={className:e.default.className,style:{fontFamily:"'JetBrains Mono', 'JetBrains Mono Fallback'",fontStyle:"normal"}};null!=e.default.variable&&(f.variable=e.default.variable);let g=`
(() => {
  try {
    const storageKey = "testdev:theme";
    const storedTheme = localStorage.getItem(storageKey);
    const theme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {}
})();
`,h={metadataBase:new URL("https://testdev-map.local"),title:{default:"测试开发面试速成站",template:"%s | 测试开发面试速成站"},description:"面向测试开发岗位的中文结构化内容站，覆盖术语、技术专题、项目类型、场景题、编码题、学习路线与 AI 时代成长指南。"};a.s(["default",0,function({children:a}){return(0,b.jsxs)("html",{lang:"zh-CN",suppressHydrationWarning:!0,className:`${d.variable} ${f.variable} h-full antialiased`,children:[(0,b.jsx)("head",{children:(0,b.jsx)("script",{dangerouslySetInnerHTML:{__html:g}})}),(0,b.jsx)("body",{className:"min-h-full flex flex-col",children:a})]})},"metadata",0,h],27572)},50645,a=>{a.n(a.i(27572))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0gm_rlb._.js.map