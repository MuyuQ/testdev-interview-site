// 术语体系模块学习路径
import type { CategoryPath } from "./types";

const glossaryPath: CategoryPath = {
  id: "glossary",
  title: "术语体系 12 步",
  description:
    "从单元测试到质量门禁，把测试开发的核心概念串成一条能解释给别人听的知识线。",
  audience: "概念零散、说不清术语之间关系的测试开发入门者",
  steps: [
    {
      slug: "unit-testing",
      goal: "分清单元、集成、端到端测试的边界，从最小可测单元写起。",
      output: "能说清一个函数该不该拆成单元测试，并写出一个可独立运行的用例。",
    },
    {
      slug: "api-assertion",
      goal: '把"接口返回对不对"翻译成可执行的断言表达式。',
      output: "能针对一个 JSON 响应写出状态、字段、业务规则三层断言。",
    },
    {
      slug: "test-pyramid",
      goal: "建立测试分层的比例直觉，避免端到端用例堆成灾。",
      output: "能画出自己项目的测试金字塔，并指出哪层用例过多要瘦身。",
    },
    {
      slug: "test-design",
      goal: '用等价类、边界值等方法把"测什么"讲清楚。',
      output: "能为一个输入框列出等价类和边界值，并给出对应用例清单。",
    },
    {
      slug: "fixture",
      goal: "把测试前置数据和环境准备从用例里抽出来统一管理。",
      output: "能描述一套 fixture 的生命周期，并说出它和硬编码数据的区别。",
    },
    {
      slug: "mock-stub",
      goal: "用替身隔离外部依赖，让用例跑得稳、跑得快。",
      output: "能区分 mock 与 stub，并举例说明何时该打桩而非连真服务。",
    },
    {
      slug: "integration-testing",
      goal: "验证多个模块协同时的数据与接口是否真打通。",
      output: "能设计一条跨模块的集成用例，并说明它与单元测试的差异。",
    },
    {
      slug: "smoke-testing",
      goal: '在提测后先用最小用例集判断系统是否"能跑"。',
      output: "能列出一份冒烟用例清单，覆盖核心主流程且可在 5 分钟内跑完。",
    },
    {
      slug: "regression-testing",
      goal: "用回归集守住老功能，避免修一处坏一片。",
      output: "能定义哪些用例进回归集，并讲清每次发版前如何挑选用例。",
    },
    {
      slug: "bug-lifecycle",
      goal: "理清缺陷从发现到关闭的状态流转与责任边界。",
      output: "能画出缺陷状态流转图，并说清每个状态该由谁来推进。",
    },
    {
      slug: "page-object-pattern",
      goal: "把页面操作和用例分离，让 UI 自动化可维护。",
      output: "能画出一个 PO 类的结构，并重构一段混在用例里的页面操作。",
    },
    {
      slug: "quality-gate",
      goal: "把前面所有测试成果收敛成发布前的一道准入红线。",
      output: "能定义一套质量门禁规则，并说清哪类失败应直接卡住发布。",
    },
  ],
};

export default glossaryPath;
