import type {
  AILearningGuide,
  ContentTopic,
  GlossaryLookup,
  GlossaryTerm,
  PracticeTemplate,
  RichTextToken,
  SearchRecord,
  StandardTopic,
  TopicCategory,
} from "./types";

const text = (content: string): RichTextToken[] => [{ type: "text", content }];

const term = (slug: string, label: string): RichTextToken => ({
  type: "term",
  slug,
  label,
});

export const glossaryTopics: GlossaryTerm[] = [
  {
    slug: "api-assertion",
    title: "接口断言",
    term: "接口断言",
    summary: "判断接口是否真正满足业务预期，而不只是返回 200。",
    category: "glossary",
    tags: ["接口测试", "断言", "自动化"],
    difficulty: "beginner",
    interviewWeight: 3,
    shortDefinition: "对响应状态、字段、业务含义和副作用进行校验的动作。",
    definition:
      "接口断言不是只看 HTTP 状态码，而是结合响应体字段、数据库状态、消息投递和幂等等业务结果，证明接口行为是正确的。",
    whyItMatters:
      "面试中常见追问是“你怎么判断接口通过”。如果只回答看 code=0 或 status=200，会被认为测试深度不够。",
    commonMistakes: [
      "只校验状态码，不校验关键字段和业务副作用。",
      "把所有断言都写在一个函数里，导致失败定位困难。",
      "忽略时间、金额、分页等边界字段。",
    ],
    confusingTerms: [
      {
        slug: "check-point",
        term: "检查点",
        difference: "检查点偏向测试设计层面的关注项，断言是代码里真正执行的校验动作。",
      },
      {
        slug: "validation",
        term: "参数校验",
        difference: "参数校验是服务端逻辑的一部分，断言是测试方用来验证接口输出与副作用是否符合预期。",
      },
    ],
    frequentQuestions: [
      "接口自动化里你通常怎么设计断言层？",
      "遇到响应结构经常变化时，你怎么保证断言稳定？",
      "你怎么验证异步接口的最终结果？",
    ],
    answerHints: [
      "先讲分层：通用断言、业务断言、链路断言。",
      "强调不仅看响应，还看数据库、缓存、消息和日志。",
      "补一句失败信息要可读，方便快速定位。",
    ],
    relatedSlugs: ["retry-mechanism", "fixture-strategy"],
    usedInSlugs: ["api-testing", "payment-project"],
  },
  {
    slug: "idempotency",
    title: "幂等",
    term: "幂等",
    summary: "同一个请求重复执行，多次结果应保持一致或可控。",
    category: "glossary",
    tags: ["支付", "接口测试", "分布式"],
    difficulty: "interview",
    interviewWeight: 3,
    shortDefinition: "重复请求不会造成重复扣款、重复下单或状态紊乱的能力。",
    definition:
      "幂等强调对重复触发有防重能力，尤其常见于支付回调、重试机制、消息消费和分布式接口场景。",
    whyItMatters:
      "幂等是支付、订单、消息队列等高风险业务的高频面试词。如果不会讲，项目深度很容易被质疑。",
    commonMistakes: [
      "把“接口返回一样”当成幂等，忽略了数据库和外部系统副作用。",
      "只在客户端做去重，没有服务端幂等设计。",
      "没有讲清幂等键、状态机和重试窗口。",
    ],
    confusingTerms: [
      {
        slug: "deduplication",
        term: "去重",
        difference: "去重偏向识别重复数据，幂等强调重复操作对系统状态的影响可控。",
      },
      {
        slug: "retry",
        term: "重试",
        difference: "重试是调用策略，幂等是系统承受重试的安全保证。",
      },
    ],
    frequentQuestions: [
      "支付回调为什么一定要做幂等？",
      "你们项目里用什么做幂等键？",
      "如果消息重复消费，你怎么设计测试用例？",
    ],
    answerHints: [
      "先给业务场景，再讲服务端状态机和唯一键。",
      "说明测试会覆盖并发重复回调和超时重试。",
      "最后补充日志与告警用于追踪异常重复请求。",
    ],
    relatedSlugs: ["api-assertion", "payment-callback"],
  },
  {
    slug: "fixture",
    title: "Fixture",
    term: "Fixture",
    summary: "为测试准备和回收环境、数据、依赖对象的机制。",
    category: "glossary",
    tags: ["Pytest", "测试框架", "自动化"],
    difficulty: "beginner",
    interviewWeight: 2,
    shortDefinition: "测试前置和后置逻辑的可复用组织方式。",
    definition:
      "Fixture 用于统一管理测试依赖，例如登录态、数据库连接、环境准备、浏览器实例和测试数据回收。",
    whyItMatters:
      "面试官常用 Fixture 判断候选人是否真正做过框架建设，而不只是会写脚本。",
    commonMistakes: [
      "所有 Fixture 都做成 function 级别，导致执行慢。",
      "Fixture 嵌套太深，阅读成本高。",
      "混入大量业务逻辑，难以复用。",
    ],
    confusingTerms: [
      {
        slug: "setup-teardown",
        term: "setup/teardown",
        difference: "setup/teardown 更偏流程概念，Fixture 是可组合、可注入、可设作用域的实现机制。",
      },
    ],
    frequentQuestions: [
      "Pytest 里你怎么设计通用 Fixture？",
      "session 级和 function 级 Fixture 怎么取舍？",
    ],
    answerHints: [
      "讲作用域、依赖注入和复用。",
      "举登录态、浏览器、测试数据准备的例子。",
    ],
    relatedSlugs: ["pytest", "fixture-strategy"],
  },
  {
    slug: "quality-gate",
    title: "质量门禁",
    term: "质量门禁",
    summary: "把测试、扫描和指标变成发布前必须通过的自动规则。",
    category: "glossary",
    tags: ["CI/CD", "发布", "质量保障"],
    difficulty: "interview",
    interviewWeight: 2,
    shortDefinition: "阻止高风险变更直接进入测试、预发或生产环境的自动化检查规则。",
    definition:
      "质量门禁通常包含单测通过率、接口自动化、静态扫描、构建结果、性能阈值和阻断策略等多个检查点。",
    whyItMatters:
      "它能体现测试开发是否从“执行测试”走向“设计质量机制”。这是中高级面试常见区分点。",
    commonMistakes: [
      "门禁指标太多但没有分级，结果经常被整体跳过。",
      "只在生产前卡口，没有前移到提测和合并阶段。",
      "失败原因不可定位，团队逐渐忽视门禁。",
    ],
    confusingTerms: [
      {
        slug: "pipeline",
        term: "流水线",
        difference: "流水线是执行载体，质量门禁是其中用于判定是否放行的规则。",
      },
    ],
    frequentQuestions: [
      "你们 CI 里什么条件会阻断发布？",
      "质量门禁如何平衡速度和稳定性？",
    ],
    answerHints: [
      "先讲分层门禁，再讲失败反馈链路。",
      "补充灰度与人工兜底，显示工程权衡能力。",
    ],
    relatedSlugs: ["ci-cd", "ci-quality-gates"],
  },
];

export const techTopics: StandardTopic[] = [
  {
    slug: "python",
    title: "Python 在测试开发里的高频能力",
    summary: "围绕脚本组织、数据处理、异常控制和工程化表达 Python 能力。",
    category: "tech",
    tags: ["Python", "脚本", "测试框架"],
    difficulty: "beginner",
    interviewWeight: 3,
    relatedSlugs: ["retry-mechanism", "fixture-strategy"],
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "在测试开发岗位里，Python 不是单纯刷语法，而是用来快速搭框架、封装工具、处理数据、做接口编排和平台脚本。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你在自动化框架里封装过哪些公共能力？",
          "装饰器、生成器、上下文管理器在项目里怎么用过？",
          "你如何组织配置、日志、断言和数据驱动？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "封装请求客户端、鉴权、重试和通用断言。",
          "用 dataclass 或 TypedDict 组织测试数据结构。",
          "通过脚本清洗日志、导出报表和构建回归任务。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "只讲语法点，不讲它们为框架可维护性带来的收益。",
          "说会面向对象，但拿不出实际抽象案例。",
          "对异常处理和日志链路没有工程化经验。",
        ],
      },
    ],
  },
  {
    slug: "pytest",
    title: "Pytest 框架设计与答题重点",
    summary: "围绕 Fixture、参数化、标记体系和报告能力讲清框架建设。",
    category: "tech",
    tags: ["Pytest", "自动化", "框架"],
    difficulty: "interview",
    interviewWeight: 3,
    relatedSlugs: ["fixture", "fixture-strategy"],
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: [
          { type: "text", content: "Pytest 是 Python 生态里主流测试框架，优势在于 " },
          term("fixture", "Fixture"),
          { type: "text", content: "、参数化、插件机制和可读性。" },
        ],
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "qa-list",
        items: [
          {
            question: "你如何设计 conftest 和目录结构？",
            answer: "按领域拆分 Fixture，并把通用能力沉淀到 base fixture 或 helper 层，避免全局膨胀。",
          },
          {
            question: "参数化和数据驱动如何做？",
            answer: "把测试数据和断言策略解耦，参数化只负责输入组合，断言负责业务结果解释。",
          },
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "统一封装环境、账号、数据和 token 准备逻辑。",
          "通过 mark 区分 smoke、regression、payment 等场景。",
          "把失败截图、日志和报告链接进 CI 流水线。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "只会写简单用例，不会讲框架可扩展性。",
          "把 Fixture 写成脚本堆叠，没有作用域和依赖管理。",
          "忽略失败定位信息和报告可读性。",
        ],
      },
    ],
  },
  {
    slug: "playwright",
    title: "Playwright 新一代自动化实践",
    summary: "突出稳定性、并发能力和现代 Web 自动化设计思路。",
    category: "tech",
    tags: ["Playwright", "Web 自动化", "E2E"],
    difficulty: "interview",
    interviewWeight: 3,
    relatedSlugs: ["playwright-template", "selenium-compare"],
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "Playwright 是面向现代浏览器的自动化框架，内置自动等待、多浏览器支持、上下文隔离和稳定的元素定位能力。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "为什么 Playwright 相比 Selenium 更适合新项目？",
          "你怎么处理页面异步加载和元素稳定性问题？",
          "自动化回归中你如何控制用例执行时间？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "基于 page object 或按业务流封装动作层。",
          "把登录状态和测试账号拆到测试上下文，减少重复登录成本。",
          "结合截图、trace、视频和网络日志提升失败定位效率。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "把自动等待说成万能，不会解释什么情况下还要显式等待。",
          "只讲录制脚本，没有讲选择器策略和维护成本。",
          "不会比较 Playwright 和 Selenium 在工程实践上的差异。",
        ],
      },
    ],
  },
  {
    slug: "api-testing",
    title: "接口测试设计与分层",
    summary: "从协议、业务、副作用和链路验证四层组织接口测试回答。",
    category: "tech",
    tags: ["接口测试", "自动化", "业务验证"],
    difficulty: "interview",
    interviewWeight: 3,
    relatedSlugs: ["api-assertion", "payment-callback"],
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: [
          { type: "text", content: "接口测试关注的不仅是协议返回，还包括 " },
          term("api-assertion", "接口断言"),
          { type: "text", content: "、上下游链路和业务副作用。" },
        ],
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你怎么划分接口测试层次？",
          "异步接口和回调接口怎么验证最终状态？",
          "参数组合很多时如何控制用例规模？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "把协议层、鉴权层、业务层断言拆开。",
          "对核心接口增加数据库、缓存、MQ 和日志检查。",
          "通过标签或优先级区分 smoke 与深回归场景。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "只会枚举功能点，不会讲测试策略。",
          "忽略异常流、重试流和幂等验证。",
          "接口用例全部依赖前置接口，导致链路脆弱。",
        ],
      },
    ],
  },
  {
    slug: "ci-cd",
    title: "CI/CD 与质量门禁自动化",
    summary: "把提测、回归、发布前卡口和告警反馈讲成一条闭环。",
    category: "tech",
    tags: ["CI/CD", "发布", "质量门禁"],
    difficulty: "interview",
    interviewWeight: 2,
    relatedSlugs: ["quality-gate", "ci-quality-gates"],
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "CI/CD 在测试开发语境里不只是自动构建，而是让提测、回归、门禁、报告和发布反馈形成闭环。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你们流水线里测试阶段怎么切分？",
          "哪些门禁失败会阻断发布？",
          "如何缩短回归时长同时保证覆盖率？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "合并前跑轻量 smoke，夜间跑深回归。",
          "把失败日志、截图和报告地址回传到群通知。",
          "关键业务引入发布前强制门禁和回滚预案。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "只会说 Jenkins/GitLab CI 名字，不会讲链路设计。",
          "门禁过严导致流程经常绕过，却没提分级策略。",
        ],
      },
    ],
  },
];

export const projectTopics: StandardTopic[] = [
  {
    slug: "ecommerce-project",
    title: "电商项目怎么讲业务流、风险点和测试策略",
    summary: "围绕商品、下单、履约、营销和售后构建面试表达。",
    category: "project",
    tags: ["电商", "订单", "营销"],
    difficulty: "interview",
    interviewWeight: 3,
    sections: [
      {
        id: "flow",
        title: "业务流程",
        kind: "list",
        items: [
          "商品浏览与搜索。",
          "购物车、下单、库存锁定与支付。",
          "履约发货、售后退款与营销核销。",
        ],
      },
      {
        id: "risks",
        title: "风险点",
        kind: "list",
        items: [
          "库存与订单状态不一致。",
          "优惠叠加、价格计算和边界金额错误。",
          "高并发活动下超卖、重复下单和回调延迟。",
        ],
      },
      {
        id: "strategy",
        title: "测试策略",
        kind: "list",
        items: [
          "核心链路做接口回归，前台关键页面做少量 UI 回归。",
          "营销和价格相关规则做数据驱动组合测试。",
          "下单支付链路增加日志与数据库双重校验。",
        ],
      },
      {
        id: "outcome",
        title: "可讲成果",
        kind: "list",
        items: [
          "核心下单回归从人工 3 小时缩到 25 分钟。",
          "通过门禁阻断多次高风险价格配置上线。",
          "补齐库存和支付异常链路后，线上重复单率下降。",
        ],
      },
    ],
  },
  {
    slug: "payment-project",
    title: "支付项目怎么讲测试深度",
    summary: "重点体现资金安全、状态一致性和幂等验证能力。",
    category: "project",
    tags: ["支付", "回调", "资金安全"],
    difficulty: "interview",
    interviewWeight: 3,
    relatedSlugs: ["idempotency", "payment-callback"],
    sections: [
      {
        id: "flow",
        title: "业务流程",
        kind: "list",
        items: [
          "支付单创建、渠道下单、用户支付、回调通知、订单落账。",
          "退款、撤销、补单与对账。",
        ],
      },
      {
        id: "risks",
        title: "风险点",
        kind: "list",
        items: [
          "重复回调导致重复扣款或重复发货。",
          "渠道成功但业务单状态未更新。",
          "金额、币种、手续费和退款状态不一致。",
        ],
      },
      {
        id: "strategy",
        title: "测试策略",
        kind: "list",
        items: [
          "回调链路覆盖重放、乱序、延迟和重复通知。",
          "关键接口验证签名、鉴权、金额精度和幂等键。",
          "引入对账数据比对和异常告警检查。",
        ],
      },
      {
        id: "outcome",
        title: "可讲成果",
        kind: "list",
        items: [
          "支付回调自动化后，核心回归覆盖明显提升。",
          "通过异常补单链路测试，提前发现状态机缺口。",
          "构建支付专项门禁，减少高风险版本直接上线。",
        ],
      },
    ],
  },
  {
    slug: "admin-platform",
    title: "后台管理项目的讲法",
    summary: "把复杂权限、配置正确性和操作可追踪性讲清楚。",
    category: "project",
    tags: ["后台管理", "权限", "配置平台"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "flow",
        title: "业务流程",
        kind: "list",
        items: ["角色授权、菜单访问、配置发布、数据导出、审批流。"],
      },
      {
        id: "risks",
        title: "风险点",
        kind: "list",
        items: [
          "越权访问与按钮级权限遗漏。",
          "配置变更影响线上功能但无审计。",
          "复杂筛选和导出结果不一致。",
        ],
      },
      {
        id: "strategy",
        title: "测试策略",
        kind: "list",
        items: [
          "权限矩阵按角色和资源做最小覆盖。",
          "关键配置加预览、灰度和回滚验证。",
          "导出与列表结果做字段级比对。",
        ],
      },
      {
        id: "outcome",
        title: "可讲成果",
        kind: "list",
        items: [
          "沉淀角色权限回归清单，减少发布后越权问题。",
          "配置发布流程加入门禁与审计后，可追踪性明显提升。",
        ],
      },
    ],
  },
];

export const scenarioTopics: StandardTopic[] = [
  {
    slug: "payment-callback",
    title: "支付回调场景题回答骨架",
    summary: "从业务目标、风险点、测试策略、监控兜底四段式作答。",
    category: "scenario",
    tags: ["支付", "回调", "幂等"],
    difficulty: "interview",
    interviewWeight: 3,
    relatedSlugs: ["payment-project", "idempotency"],
    sections: [
      {
        id: "framework",
        title: "标准回答框架",
        kind: "list",
        items: [
          "先描述目标：确保支付状态正确落账且不会重复处理。",
          "再讲风险：重复回调、乱序回调、金额篡改、渠道超时。",
          "然后讲测试：签名校验、幂等、状态机、补单、日志与告警。",
          "最后补监控与兜底：对账、异常重试、人工处理流程。",
        ],
      },
      {
        id: "high-frequency",
        title: "高频追问",
        kind: "qa-list",
        items: [
          {
            question: "怎么验证重复回调不会重复发货？",
            answer: "通过同一幂等键反复回放回调，检查订单状态、履约消息和数据库操作次数是否保持单次有效。",
          },
          {
            question: "渠道回调成功但业务更新失败怎么办？",
            answer: "补单链路要可触发，并能通过对账发现异常订单；测试要覆盖补偿逻辑和重复执行安全性。",
          },
        ],
      },
    ],
  },
  {
    slug: "login-auth",
    title: "登录鉴权场景题回答骨架",
    summary: "围绕认证、授权、风控和会话管理来组织答案。",
    category: "scenario",
    tags: ["登录", "鉴权", "安全"],
    difficulty: "interview",
    interviewWeight: 3,
    sections: [
      {
        id: "framework",
        title: "标准回答框架",
        kind: "list",
        items: [
          "认证层：账号密码、验证码、多因素、第三方登录。",
          "授权层：接口权限、角色资源映射、越权校验。",
          "风控层：暴力破解、异常设备、IP 限制。",
          "会话层：token 生命周期、刷新、登出和失效。",
        ],
      },
      {
        id: "high-frequency",
        title: "高频追问",
        kind: "qa-list",
        items: [
          {
            question: "你怎么测 token 失效和续期？",
            answer: "覆盖正常续期、过期后访问、登出后访问、跨端登录和并发刷新 token 冲突场景。",
          },
          {
            question: "后台系统权限怎么测？",
            answer: "按角色矩阵验证菜单、按钮、接口和数据权限四层，不只停留在页面可见性。",
          },
        ],
      },
    ],
  },
  {
    slug: "automation-platform",
    title: "自动化平台搭建场景题",
    summary: "回答重点是解决了什么效率问题，以及架构如何可扩展。",
    category: "scenario",
    tags: ["平台建设", "自动化", "工程化"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "framework",
        title: "标准回答框架",
        kind: "list",
        items: [
          "先讲痛点：用例散落、回归成本高、失败不可追踪。",
          "再讲平台能力：任务编排、环境管理、报告、通知、权限。",
          "最后讲收益：回归提速、门禁可接入、质量数据可见。",
        ],
      },
      {
        id: "high-frequency",
        title: "高频追问",
        kind: "qa-list",
        items: [
          {
            question: "平台化和脚本化的边界是什么？",
            answer: "当多人协作、环境编排、权限和历史任务管理变复杂时，就值得平台化。",
          },
        ],
      },
    ],
  },
];

export const codingTopics: StandardTopic[] = [
  {
    slug: "retry-mechanism",
    title: "请求重试封装题",
    summary: "要讲清可重试条件、退避策略、幂等风险和日志。",
    category: "coding",
    tags: ["重试", "封装", "稳定性"],
    difficulty: "interview",
    interviewWeight: 3,
    sections: [
      {
        id: "core-points",
        title: "回答要点",
        kind: "list",
        items: [
          "区分网络异常、限流、超时和业务错误，不是所有错误都能重试。",
          "引入指数退避和最大重试次数，防止雪崩。",
          "如果请求有副作用，必须先说明幂等保障。",
          "记录每次重试原因和最终结果，方便排障。",
        ],
      },
      {
        id: "pitfalls",
        title: "常见失分点",
        kind: "list",
        items: [
          "一上来就写 while 循环，没有讲策略。",
          "忽略请求超时和中断控制。",
          "不区分同步重试和异步补偿。",
        ],
      },
    ],
  },
  {
    slug: "assertion-wrapper",
    title: "断言封装题",
    summary: "重点展示断言分层、失败信息和可维护性，而不是只会写 assert。",
    category: "coding",
    tags: ["断言", "封装", "接口测试"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "core-points",
        title: "回答要点",
        kind: "list",
        items: [
          "通用断言处理状态码、字段存在性和 schema。",
          "业务断言处理订单状态、金额、优惠和异步结果。",
          "失败信息要包含实际值、预期值和上下文。",
        ],
      },
      {
        id: "pitfalls",
        title: "常见失分点",
        kind: "list",
        items: [
          "把所有断言逻辑揉成一个函数。",
          "没有考虑链式调用和失败可读性。",
        ],
      },
    ],
  },
  {
    slug: "fixture-strategy",
    title: "Fixture 设计题",
    summary: "答题重点是作用域、复用层次和前后置管理。",
    category: "coding",
    tags: ["Fixture", "Pytest", "框架设计"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "core-points",
        title: "回答要点",
        kind: "list",
        items: [
          "按登录态、环境、数据、浏览器等职责拆分。",
          "合理使用 session、module、function 作用域平衡速度和隔离性。",
          "通过 yield 或清理函数处理资源回收。",
        ],
      },
      {
        id: "pitfalls",
        title: "常见失分点",
        kind: "list",
        items: [
          "Fixture 太万能，导致可维护性下降。",
          "依赖关系不透明，阅读成本高。",
        ],
      },
    ],
  },
];

export const roadmapTopics: StandardTopic[] = [
  {
    slug: "3-day-interview-map",
    title: "3 天速记版路线",
    summary: "优先扫高频术语、核心链路和标准化答题骨架，先保证能说清。",
    category: "roadmap",
    tags: ["学习路线", "3 天", "速记"],
    difficulty: "beginner",
    interviewWeight: 3,
    sections: [
      {
        id: "day-plan",
        title: "按天安排",
        kind: "list",
        items: [
          "第 1 天：术语体系 + 接口测试 + Pytest + 幂等。",
          "第 2 天：支付/电商项目 + 支付回调 + 登录鉴权场景题。",
          "第 3 天：编码题模板 + 自我介绍 + 项目描述 + AI 时代成长表达。",
        ],
      },
      {
        id: "usage",
        title: "使用建议",
        kind: "list",
        items: [
          "每个主题先看摘要和高频问题，再补细节。",
          "把答题骨架写成自己的口语版。",
          "优先准备能证明做过的 2 个项目故事。",
        ],
      },
    ],
  },
  {
    slug: "7-day-interview-plan",
    title: "7 天面试版路线",
    summary: "在速记基础上补齐项目深度、编码封装和质量体系表达。",
    category: "roadmap",
    tags: ["学习路线", "7 天", "面试"],
    difficulty: "interview",
    interviewWeight: 3,
    sections: [
      {
        id: "day-plan",
        title: "按天安排",
        kind: "list",
        items: [
          "Day1-2：术语、技术专题和高频项目类型。",
          "Day3-4：场景题与编码题，整理回答模板。",
          "Day5：CI/CD、质量门禁和平台化经验。",
          "Day6：AI 时代成长模块与新技术落地。",
          "Day7：全真模拟，自我介绍、项目问答和追问演练。",
        ],
      },
      {
        id: "usage",
        title: "使用建议",
        kind: "list",
        items: [
          "每天都输出一版口头表达，不只看内容。",
          "把项目指标、收益和取舍讲出来，避免空话。",
        ],
      },
    ],
  },
  {
    slug: "self-introduction-template",
    title: "自我介绍模板",
    summary: "按经历背景、核心项目、技术能力和求职方向四段组织。",
    category: "roadmap",
    tags: ["自我介绍", "模板", "表达"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "structure",
        title: "结构建议",
        kind: "list",
        items: [
          "一句话背景：目前方向和年限。",
          "两段项目：业务场景、职责、成果。",
          "技术关键词：自动化、接口、平台、质量门禁。",
          "求职方向：想解决的问题和下一步成长计划。",
        ],
      },
    ],
  },
];

export const aiLearningTopics: AILearningGuide[] = [
  {
    slug: "ai-api-testing",
    title: "AI 辅助接口测试",
    summary: "把 AI 用在用例生成、请求构造、日志解释和回归分析，而不是盲目替代人。",
    category: "ai-learning",
    tags: ["AI", "接口测试", "效率"],
    difficulty: "interview",
    interviewWeight: 3,
    learningGoal: "建立“AI 能辅助什么、不能替代什么”的清晰判断，并把它落到接口测试流程里。",
    whyNow: "接口测试的输入输出结构清晰，最适合率先接入 AI 辅助生成和分析能力。",
    learningSteps: [
      "先让 AI 帮你整理接口文档、枚举异常输入和边界条件。",
      "再用 AI 生成初版断言和数据构造脚本，但必须人工复核业务语义。",
      "最后把 AI 接到失败日志分析和回归结果聚类上，提升排障效率。",
    ],
    practicalUseCases: [
      "根据 OpenAPI 或抓包结果生成接口用例草稿。",
      "对失败日志做聚类，快速定位环境问题和业务缺陷。",
      "结合历史 bug 反推补测场景。",
    ],
    commonMistakes: [
      "把 AI 生成的断言直接上线，不做业务复核。",
      "只把 AI 当写代码工具，没有嵌进测试流程。",
      "没有定义输出模板，导致结果不可复用。",
    ],
    interviewTalkingPoints: [
      "强调 AI 辅助的是效率和覆盖面，不是替代测试判断。",
      "举一个实际场景说明 AI 如何缩短用例设计或排障时间。",
      "补一句你如何控制 hallucination 和错误建议风险。",
    ],
    relatedSlugs: ["api-testing"],
  },
  {
    slug: "llm-boundaries",
    title: "LLM 在测试用例生成与日志分析中的应用边界",
    summary: "重点讲清 LLM 擅长模式归纳，不擅长替你定义业务正确性。",
    category: "ai-learning",
    tags: ["LLM", "日志分析", "测试用例"],
    difficulty: "interview",
    interviewWeight: 2,
    learningGoal: "知道什么工作可以交给 LLM 做首轮处理，什么必须由测试开发兜底判断。",
    whyNow: "很多团队已经把 LLM 用在提效场景，但面试官更关心你是否有边界意识。",
    learningSteps: [
      "先拆分任务：生成、归纳、解释、决策四类。",
      "把 LLM 先用于生成候选结果和归纳异常模式。",
      "保留人工或规则系统做最终业务判定。",
    ],
    practicalUseCases: [
      "批量总结失败日志中的共同特征。",
      "把需求变更拆成测试关注点初稿。",
      "从用例库中召回相似场景做补测建议。",
    ],
    commonMistakes: [
      "让 LLM 直接给出最终测试结论。",
      "没有脱敏就把生产日志输入外部模型。",
      "忽略提示词模板和上下文约束。",
    ],
    interviewTalkingPoints: [
      "你理解 LLM 更像高效助手，而不是质量裁判。",
      "在真实项目里你会保留规则校验、人工复核或评审兜底。",
    ],
  },
  {
    slug: "cloud-native-for-testdev",
    title: "测试开发如何学习云原生、容器化和可观测性",
    summary: "从能跑环境、能看日志、能追问题三步切入，不追平台全栈。",
    category: "ai-learning",
    tags: ["云原生", "容器", "可观测性"],
    difficulty: "interview",
    interviewWeight: 2,
    learningGoal: "建立足够支持测试环境部署、问题排查和质量平台建设的云原生基础。",
    whyNow: "很多测试环境已经建立在容器、K8s 和日志/指标平台之上，不懂这些会影响问题定位深度。",
    learningSteps: [
      "先学 Docker 基础，能把服务、本地依赖和测试工具容器化。",
      "再学 Kubernetes 基本对象，至少看懂 Pod、Deployment、ConfigMap、Ingress。",
      "最后补日志、指标、链路追踪，形成定位闭环。",
    ],
    practicalUseCases: [
      "在临时环境中拉起回归依赖服务。",
      "通过监控指标判断性能回归点。",
      "通过链路追踪定位跨服务异常。",
    ],
    commonMistakes: [
      "上来就啃复杂平台原理，没有结合测试工作场景。",
      "只会命令，不理解环境隔离和资源限制。",
    ],
    interviewTalkingPoints: [
      "突出你学这些技术是为了更好地做环境管理和问题定位。",
      "可以结合 AI 辅助查阅文档和解释日志，说明学习提效方式。",
    ],
  },
];

export const practiceTemplateTopics: PracticeTemplate[] = [
  {
    slug: "api-automation-template",
    title: "Python + Pytest 接口自动化项目模板",
    summary: "适合练手接口框架结构、断言层、数据驱动和报告输出。",
    category: "practice-template",
    tags: ["模板", "Pytest", "接口自动化"],
    difficulty: "beginner",
    interviewWeight: 3,
    templateType: "engineering",
    targetScenario: "用一个最小可运行项目把登录、下单、查询、断言、报告和 CI 串起来。",
    includes: [
      "配置管理、请求客户端、鉴权封装。",
      "分层断言与测试数据组织。",
      "Pytest Fixture、mark 与报告集成。",
    ],
    howToUse: [
      "先选一个公开 API 或自建 mock 服务作为练习目标。",
      "按登录态、业务能力和断言层逐步补功能。",
      "最后接入 CI，把 smoke 用例跑起来。",
    ],
    extensionIdeas: [
      "补缓存、重试、签名和异步回调验证。",
      "加入失败截图或日志聚合能力。",
    ],
  },
  {
    slug: "playwright-template",
    title: "Playwright Web 自动化项目模板",
    summary: "适合练习页面对象、稳定定位、trace 和并发执行。",
    category: "practice-template",
    tags: ["模板", "Playwright", "Web 自动化"],
    difficulty: "interview",
    interviewWeight: 2,
    templateType: "engineering",
    targetScenario: "围绕登录、搜索、提交流程搭一个可持续维护的 Web 自动化骨架。",
    includes: [
      "测试分层、选择器策略和上下文复用。",
      "trace、截图和失败录像。",
      "并发执行和环境参数切换。",
    ],
    howToUse: [
      "先只覆盖 2 到 3 条关键业务流。",
      "把页面动作和业务断言分开，控制维护成本。",
      "在 CI 环境验证 Headless 稳定性。",
    ],
    extensionIdeas: [
      "加入 mock、网络拦截和权限账号矩阵。",
      "设计简单的回归任务入口页。",
    ],
  },
  {
    slug: "project-story-template",
    title: "项目介绍模板",
    summary: "把背景、职责、方案、成果和复盘串成一套可复述表达。",
    category: "practice-template",
    tags: ["模板", "项目表达", "面试"],
    difficulty: "beginner",
    interviewWeight: 3,
    templateType: "interview",
    targetScenario: "用于 1 到 2 分钟内把一个测试开发项目讲清楚，并能承接追问。",
    includes: [
      "业务背景和项目目标。",
      "你的职责与技术动作。",
      "方案亮点、指标结果和复盘。",
    ],
    howToUse: [
      "每个部分控制在 1 到 2 句。",
      "尽量用结果和变化描述，而不是罗列工作内容。",
      "提前准备一版简述版和一版深挖版。",
    ],
    extensionIdeas: [
      "补充故障案例和取舍说明。",
      "增加 AI 辅助、质量门禁或平台化亮点。",
    ],
  },
];

export const allTopics: ContentTopic[] = [
  ...glossaryTopics,
  ...techTopics,
  ...projectTopics,
  ...scenarioTopics,
  ...codingTopics,
  ...roadmapTopics,
  ...aiLearningTopics,
  ...practiceTemplateTopics,
];

export function getAllTopics(): ContentTopic[] {
  return allTopics;
}

export function getTopicsByCategory(category: TopicCategory): ContentTopic[] {
  return allTopics.filter((topic) => topic.category === category);
}

export function getTopic(category: TopicCategory, slug: string): ContentTopic | undefined {
  return allTopics.find((topic) => topic.category === category && topic.slug === slug);
}

export function getPopularTopics(): ContentTopic[] {
  return allTopics.filter((topic) => topic.interviewWeight === 3).slice(0, 9);
}

export function getRoadmapHighlights(): ContentTopic[] {
  return roadmapTopics.slice(0, 2);
}

export function getSearchIndex(): SearchRecord[] {
  return allTopics.map((topic) => ({
    slug: topic.slug,
    title: topic.title,
    summary: topic.summary,
    category: topic.category,
    tags: topic.tags,
    difficulty: topic.difficulty,
    interviewWeight: topic.interviewWeight,
  }));
}

export function getGlossaryLookup(): GlossaryLookup {
  return Object.fromEntries(
    glossaryTopics.map((item) => [
      item.slug,
      { term: item.term, shortDefinition: item.shortDefinition },
    ]),
  );
}

