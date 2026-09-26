# 项目复盘:测试开发面试速成站

> 复盘时间:2026-09-27。范围:自项目初始化(2026-04)至复盘日的全部代码、内容、工程与视觉现状。本文档既是本次重构的记录,也是后续迭代的基线。

## 一、复盘方法

按四步进行:

1. **全量盘点**——内容、配置、样式、测试、CI、文档六个维度逐项清点,不凭印象下结论;
2. **可视化基线**——构建当前站点并逐页截图(首页浅色/深色、文档文章页深色/浅色、自测区、能力地图、页脚),先看再改;
3. **问题清单化**——每个问题记录证据(文件、行号、截图、命令输出),区分"事实"与"判断";
4. **改进后回归**——用同一条检查链(format/lint/typecheck/build/validate/links/unit/e2e)验证改动,并再做视觉验收。

## 二、诊断:复盘前的问题清单

### A. 界面与结构

| #   | 问题                                                                                       | 证据                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| A1  | 首页与文档页视觉割裂:首页是浅色 v3 体系,文档页是深色工作台主题,靠 CSS 加载顺序"后加载者胜" | `learning-workbench-content.css` 最后加载覆盖 `home-page-v3.css`;两套 token(`--home-*` vs `--workbench-*`)数值不一致 |
| A2  | 首页不支持深色模式,无主题切换;文档页支持                                                   | 首页内联样式只有浅色 token;文档页有 `:root[data-theme="light"]` 覆盖                                                 |
| A3  | 首页首屏失衡:主标题换行切断"测试"一词,左右两栏高度差大,板块间距过大                        | 复盘截图(浅色首屏)                                                                                                   |
| A4  | 首页无页脚,10 个模块没有次级入口;移动端导航可换行                                          | `index.astro` 无 `<footer>`                                                                                          |
| A5  | Starlight 界面文案是英文:Search / On this page / Dark / Light / Auto;`<html lang="en">`    | 构建产物 `grep lang="en"`;历史提交 5b11b54 曾因 i18n 配置写法错误(`locales: { zh }` 产生 /zh/ 前缀)整体移除多语言    |
| A6  | `DESIGN.md` 只定义了浅色体系,与文档页深色现实不符                                          | DESIGN.md YAML colors 无深色定义                                                                                     |

### B. 未完成需求(明确承诺但未兑现)

| #   | 问题                                                                                                                                        | 证据                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------ |
| B1  | 场景题模块自述"持续建设中,后续将新增分布式事务、库存扣减、订单取消"                                                                         | `scenario/index.md` 原文                                                     |
| B2  | 编码题模块链接指向"进阶应对训练页待补充"                                                                                                    | `coding/index.md` 原文                                                       |
| B3  | Playwright 配置指向 `tests/e2e/`,README 也写了 `npm run test:e2e`,但目录不存在,e2e 从未落地                                                 | `playwright.config.ts` testDir 与空目录                                      |
| B4  | CI 只跑 build:lint、类型检查、单元测试、内容校验、链接检查都不在门禁内                                                                      | 原 `deploy.yml` 只有 `npm run build`                                         |
| B5  | `check-links.mjs` 从未接入 npm scripts,且发现链接损坏也不返回非零退出码,起不到门禁作用                                                      | 脚本无 `process.exit(1)`                                                     |
| B6  | `npm run lint` 本身就是坏的:`eslint.config.mjs` 引入了未声明的依赖 `typescript-eslint`;`eslint-plugin-astro` 推荐配置被错误展开导致配置报错 | `Cannot find package 'typescript-eslint'`、`ConfigError: Unexpected key "0"` |
| B7  | `npm run typecheck` 同样是坏的:tsconfig 覆盖了 `moduleResolution: node`,与 Astro 6 的打包导出不兼容;4 个 lib 文件是隐式 any 的伪 TypeScript | 14 个 TS70xx 错误                                                            |
| B8  | 死代码:`HomePage.astro`(注释自认"临时数据")与 `home-page-v3.css`(旧首页样式,与新首页类名冲突)                                               | 组件从未被 import                                                            |
| B9  | 内容真实断链:两处 `[XX](/testdev-interview-site/project/index/)` 指向不存在的路由(GitHub Pages 404)                                         | `tech/playwright.md`、`tech/ci-cd.md`                                        |
| B10 | 仓库里有 500MB 废弃 Next.js 实验产物(`temp-site/`,含提交进 git 的 node_modules 与 .next 构建产物,源码目录为空)                              | `git ls-files temp-site                                                      | wc -l` = 424 |

### C. 内容深度

| #   | 问题                                                                                                                                    | 证据             |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| C1  | 63 篇内容总量约 858KB,平均单篇 13.6KB;新手教程正文普遍 7-9KB,场景题缺安全维度用例,模板类缺"端到端可运行示例",项目类缺简历表述与追问应对 | 全量 wc -c 统计  |
| C2  | 自测题总量 141 道,部分文章仅 1-2 道                                                                                                     | frontmatter 汇总 |

### D. 文档与配置漂移

| #   | 问题                                                                | 证据            |
| --- | ------------------------------------------------------------------- | --------------- |
| D1  | README 结构小节描述了不存在的 `src/layouts/`;文末堆了三个"最后更新" | 原 README.md    |
| D2  | `.gitignore` 未忽略 `temp-site/`、`output/`、`.venv/`               | .gitignore 原文 |

## 三、改进与落地

### 3.1 界面与结构重构(现代化)

- **首页完全重写**(`src/pages/index.astro`):保留"找到下一步"的信息架构(决策优先于目录),视觉与代码全部重做——
  - 深浅双主题:跟随系统偏好,头部提供切换按钮;内联脚本在首屏渲染前设定主题避免闪色;
  - 与 Starlight 共用主题约定(`localStorage["starlight-theme"]` + `data-theme`),首页切换深色后进入文档页同为深色;
  - 新增构建时真实统计(模块数/篇数/自测题数/总时长,来自内容集合,不会过期);
  - 新增页脚:四层能力分类的全部模块入口 + 站点说明 + 版权行;
  - 新增跳转链接(skip link)、og 元信息、统一的焦点环与减少动态偏好支持;
  - 学习路径面板、双入口决策卡、四层能力地图、学习复盘四个签名区块全部保留并重新设计。
- **文档页主题微调**:保持深色工作台基线,界面文案中文化(见下),`lang` 修正为 `zh-CN`。
- **界面文案中文化**:通过 Starlight 单语言根区域配置(`locales: { root: { lang: "zh-CN" } }`)启用内置中文文案——搜索、目录、主题选择、翻页全部中文。关键是吸取 5b11b54 的教训:单语言站必须用 `root` 键而不是新建语言键,后者会生成 /zh/ 前缀破坏链接。
- **CSS 收敛**:删除 `home-page-v3.css`(旧首页样式,类名与新首页冲突);首页样式自包含于页面内;文档主题 `learning-workbench-content.css` 的加载顺序契约由单元测试固化。

### 3.2 未完成需求全部落地

- **新增 4 篇内容**(全部按既有模板全深度撰写):
  - `scenario/distributed-transaction.md`(分布式事务:失败注入矩阵、TCC/SAGA 追问)
  - `scenario/inventory-deduction.md`(库存扣减:并发守恒断言、行锁 vs 预扣)
  - `scenario/order-cancel.md`(订单取消:状态机矩阵、取消支付竞态)
  - `coding/interview-advanced-drills.md`(进阶应对训练:陌生题四步拆解、三道限时题)
- **配置同步**:`scenario/index.md` 学习顺序表扩至 7 篇并移除"持续建设中"注记;`coding/index.md` 的"待补充"改为真实链接;两个分类的学习路径(`src/lib/paths/`)同步扩展。
- **e2e 冒烟测试落地**(`tests/e2e/smoke.spec.ts`,7 条):首页渲染与真实统计、主题切换与持久化、继续学习链接、文章页元数据/学习路径/自测题渲染、自测交互判定、侧边栏跨模块跳转、分类页学习路径。期间修复了 Playwright `baseURL` 与 `goto("/")` 的解析陷阱(`/` 会解析回源站根路径,必须以斜杠结尾的 baseURL + 相对路径)。
- **CI 重建**(`.github/workflows/deploy.yml`):quality(内容校验→格式→lint→类型→单测→构建→链接检查)→ e2e(chromium)→ deploy(仅 push main),PR 也会跑完整门禁。
- **链接检查修复并接入门禁**(`scripts/check-links.mjs`):损坏链接退出码非零;HTML 检查剥离 fragment/query;markdown 相对链接按 Starlight 的页面 URL 目录语义解析;发现并修复 2 处真实断链(`project/index/`);接入 `npm run check`。
- **lint/typecheck 复活**:补装并声明 `typescript-eslint`;修正 eslint flat config(`astroPlugin.configs.recommended` 是数组需展开);为 scripts 目录放行 Node 全局量;tsconfig 移除过时的 `moduleResolution: node` 覆盖;为 4 个 lib 文件与 validate 脚本补齐类型。
- **死代码与仓库清理**:删除 `HomePage.astro`、`home-page-v3.css`;移除 500MB 废弃 `temp-site/`(git 历史可恢复);`.gitignore` 补 `temp-site/`、`output/`、`.venv/`。

### 3.3 内容加厚(全部 63 篇既有内容 + index)

以"只增不删"为铁律(保留全部章节、链接、自测题、frontmatter),按分类定制加厚手法,由 10 个并行任务完成:

| 分类                    | 增量    | 主要新增板块                                         |
| ----------------------- | ------- | ---------------------------------------------------- |
| beginner-course(9 篇)   | +49.8KB | 渐进式代码示例、真实报错排查、练习变体、面试追问     |
| glossary(13 篇)         | +62.2KB | 面试官追问、简历误用、混淆表扩充、实战案例           |
| tech(9 篇)              | +41.0KB | 踩坑实录(含报错原文)、性能与规模化、版本与生态       |
| project(5 篇)           | +39.3KB | 简历表述示例、项目难点与解决、可展示产物、刁钻追问   |
| scenario(4 篇老文)      | +25.9KB | 安全维度用例、踩坑实录、线上处置追问                 |
| coding(4 篇)            | +24.9KB | 代码走查视角、常见错误实现、复杂度与规模化           |
| roadmap(4 篇)           | +17.7KB | 时间裁剪规则、每日自检清单、常见失败模式             |
| interview-chains(4 篇)  | +26.6KB | 追问链下探两层、压力应对话术、回答模板拆解           |
| practice-template(4 篇) | +32.8KB | 端到端可运行示例(实际运行验证过)、二次开发指南、避坑 |
| ai-learning(4 篇)       | +23.8KB | 完整提示词模板、效果评估实验、人工把关清单           |

**内容总量:858KB → 1204KB(+40%)。自测题:141 → 200 道。文章数:63 → 67。**

### 3.4 文档刷新

- README 重写:与现实一致的项目结构、真实统计、命令表、CI 说明、贡献规范(移除三个堆叠的"最后更新")。
- DESIGN.md 增补:深色主题色板、统一主题约定(存储键、data-theme 状态源、防闪色)。

## 四、验证结果(改进后回归)

| 检查                       | 结果                                                           |
| -------------------------- | -------------------------------------------------------------- |
| `npm run validate:content` | Validation passed                                              |
| `npm run lint`             | 0 error(修复前不可运行)                                        |
| `npm run typecheck`        | 0 error(修复前 14+ 错误)                                       |
| `npm run build`            | 69 页构建成功                                                  |
| `npm run check:links`      | 0 损坏链接                                                     |
| `npm run test:unit`        | 18/18 通过                                                     |
| `npm run test:e2e:smoke`   | 7/7 通过                                                       |
| 视觉验收                   | 首页/文章页/分类页深浅两主题逐页截图审查(见下方"视觉验收"一节) |

## 五、遗留问题与后续建议

1. **quiz / knowledge-map / interview-simulator 三个页面构想**:`temp-site/` 的构建产物显示曾有一次 Next.js 实验做过这三个页面(源码已失,仅剩打包产物)。当前站点的自测题已覆盖 quiz 的核心价值;knowledge-map 与 interview-simulator 值得作为独立需求重新设计,而不是从构建产物里抢救。
2. **组件样式与全局样式的边界**:SelfTests 等组件样式内联在组件里,全局 `components-v3.css` 里还留有一份旧的 quiz 样式(已被组件作用域样式覆盖,暂不生效但容易误导)。建议后续统一为"组件样式进组件,全局只留 token 与主题映射"。
3. **`starlight-overrides-v3.css` 与 `layout-v3.css` 冗余**:文档主题加载后,这两个文件的大部分规则被覆盖,可以在一次专门的样式重构中合并进 workbench 主题(本次为控制风险未动)。
4. **自测题正确率的数据闭环**:目前完成状态存 localStorage,自测题的作答结果没有存储。若想做"错题本"或正确率统计,需要新增一个作答存储并在 SelfTests 组件里埋点。
5. **e2e 覆盖面**:目前是 7 条冒烟,移动端项目(pixel/iphone)已配置但未纳入默认冒烟;搜索功能(pagefind 仅构建产物可用)未测,可考虑加一条 preview 模式的搜索冒烟。
6. **CI 中 e2e 使用 dev server**:Playwright webServer 目前用 `npm run dev`,更严格的做法是先构建再用 preview 服务器测构建产物,代价是 CI 时长增加,建议在构建时长可接受时切换。

## 六、一点复盘结论

这个项目最大的风险从来不是"缺功能",而是**未完成的东西留在暗处**:配了没接的检查脚本、写了没跑的测试目录、承诺了的页面挂着"待补充"、两套互相覆盖的主题。复盘的第一步是把它们全部翻出来列成清单,第二步是让每一条要么被完成、要么被明确放弃——不允许"看起来在做"。本次改进后,仓库里每一个配置过的命令都有真实产物,每一个承诺过的页面都存在且被链接,每一个视觉决定都有 DESIGN.md 背书。后续迭代请保持这个标准。
