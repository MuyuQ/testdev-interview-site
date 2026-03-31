import type {
  AILearningGuide,
  ContentTopic,
  GlossaryLookup,
  GlossaryTerm,
  HomeQuestionGuide,
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
      {
        title: "只校验状态码，不校验关键字段和业务副作用",
        detail: "HTTP 200 只表示请求到达服务器，不代表业务逻辑正确。真正的断言要覆盖响应体字段、数据库状态、消息投递等多层副作用。例如下单接口返回成功，但如果订单状态未变更、库存未锁定、履约消息未投递，都属于业务失败。面试时要强调：断言要分层设计，覆盖协议层、业务层和副作用层。"
      },
      {
        title: "把所有断言都写在一个函数里，导致失败定位困难",
        detail: "断言函数过于臃肿会让失败定位变成大海捞针。好的做法是按层级拆分：通用断言（状态码、结构校验）、业务断言（字段值、状态流转）、链路断言（数据库、缓存、消息）。这样失败时能快速知道是哪一层出问题，而非在几百行断言代码里逐行排查。面试回答要体现你对断言分层和失败定位效率的理解。"
      },
      {
        title: "忽略时间、金额、分页等边界字段",
        detail: "边界字段往往是线上事故的高发区。时间要校验时区、精度和范围；金额要校验精度、币种和边界值（如 0、负数、超限）；分页要校验空页、边界页和总数一致性。面试时要举一个边界字段引发线上问题的案例，说明你不会只测 happy path。"
      },
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
      {
        title: "把接口返回一样当成幂等",
        detail: "接口返回相同不代表幂等。真正的幂等要验证数据库状态、外部系统调用是否重复。例如支付回调，即使接口返回相同，但若数据库写入重复订单、外部通知发送多次，就不是幂等。面试时要强调：幂等验证要覆盖数据库、消息队列、外部通知等多层副作用。"
      },
      {
        title: "只在客户端做去重",
        detail: "客户端去重无法保证服务端幂等，因为请求可能从不同客户端发起。面试表达时要指出：服务端必须设计幂等键（如订单号、requestId），配合数据库唯一索引或 Redis 锁来保证重复请求不会产生副作用。"
      },
      {
        title: "没有讲清幂等键、状态机和重试窗口",
        detail: "幂等键是防重的核心字段（如支付流水号），状态机用于判断订单是否可推进，重试窗口控制何时可安全重试。面试回答要把这三点串起来，展示你对业务流程和风险点的理解。"
      },
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
      {
        title: "所有 Fixture 都做成 function 级别",
        detail: "所有 Fixture 都设为 function 作用域会导致每个测试都重新初始化，执行时间大幅增加。好的做法是：根据资源成本和隔离需求选择作用域，登录态用 session、数据库连接用 module、测试数据用 function。面试时要讲清作用域选择原则和性能权衡。"
      },
      {
        title: "Fixture 嵌套太深",
        detail: "Fixture 嵌套层级过多会让依赖关系难以追踪，阅读成本高。好的做法是：控制嵌套深度在 2-3 层，复杂依赖拆成多个独立 Fixture 并通过参数注入组合。面试时要举一个 Fixture 依赖设计的具体案例。"
      },
      {
        title: "混入大量业务逻辑",
        detail: "Fixture 应专注于环境准备和资源管理，如果混入业务逻辑会导致难以复用和维护。好的做法是：Fixture 只做环境层（登录态、数据库、浏览器），业务数据准备放在测试代码或 helper 函数。面试时要讲清 Fixture 与业务逻辑的边界划分。"
      },
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
      {
        title: "门禁指标太多但没有分级",
        detail: "门禁规则如果太多且没有优先级区分，结果经常被整体跳过或绕过。好的做法是：按风险分级，核心门禁（单测、关键接口）阻断发布，次要门禁（静态扫描、覆盖率）仅警告。面试时要讲清门禁分级策略和阻断准则。"
      },
      {
        title: "只在生产前卡口",
        detail: "门禁如果只在生产发布前检查，问题发现太晚，修复成本高。好的做法是：前移到合并阶段和提测阶段，让问题在最小影响范围时就被拦截。面试时要讲清门禁前移策略和与 CI 流水线的配合。"
      },
      {
        title: "失败原因不可定位",
        detail: "门禁失败如果只显示红灯而没有详细信息，团队会逐渐忽视门禁。好的做法是：失败信息要包含具体检查项、失败原因和修复建议。面试时要讲清门禁反馈机制和失败定位支持。"
      },
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
  {
    slug: "mock-stub",
    title: "Mock 与 Stub",
    term: "Mock 与 Stub",
    summary: "Mock 模拟行为可验证交互，Stub 仅返回固定数据，两者在测试隔离中扮演不同角色。",
    category: "glossary",
    tags: ["测试隔离", "单元测试", "Mock", "Stub"],
    difficulty: "beginner",
    interviewWeight: 2,
    shortDefinition: "Mock 是可验证调用的模拟对象，Stub 是只返回预设值的替身对象。",
    definition:
      "Mock 和 Stub 都是测试替身技术，用于隔离被测代码对外部依赖的调用。Mock 不仅返回预设值，还能记录调用次数、参数等行为，用于验证交互；Stub 只是被动返回固定数据，不关心调用方式。理解两者的区别有助于在单元测试和集成测试中选择合适的隔离策略。",
    whyItMatters:
      '面试中常问「你怎么做单元测试隔离」，如果只说「用 Mock」却不区分 Mock 与 Stub，会被认为对测试替身概念理解不清。',
    commonMistakes: [
      {
        title: "把 Mock 和 Stub 概念混为一谈",
        detail: '很多人说「我用 Mock 做隔离」，实际用的是 Stub（只返回固定值）。面试时要讲清：Mock 用于验证交互（如「支付服务被调用了一次」），Stub 用于提供数据（如「返回一个成功响应」）。举例说明两者的使用场景差异。'
      },
      {
        title: "过度 Mock 导致测试失去意义",
        detail: "如果连业务逻辑本身都 Mock 了，测试就变成验证 Mock 配置而非验证真实代码。好的做法是只 Mock 外部依赖（数据库、网络、第三方服务），业务逻辑保持真实。面试时要强调 Mock 的边界原则。"
      },
      {
        title: "忽略 Mock 的维护成本",
        detail: "Mock 配置与真实实现不一致时，测试会通过但生产环境失败。面试时要说明：Mock 要与真实接口保持同步，可通过契约测试或接口定义文件自动生成 Mock 配置来降低维护成本。"
      },
    ],
    confusingTerms: [
      {
        slug: "fake",
        term: "Fake",
        difference: "Fake 是一个可工作的简化实现（如内存数据库），Mock 和 Stub 是不提供真实功能的替身。"
      },
      {
        slug: "spy",
        term: "Spy",
        difference: "Spy 是在真实对象上记录调用信息的包装器，Mock 是完全模拟的假对象。"
      },
    ],
    frequentQuestions: [
      "单元测试里你什么时候用 Mock，什么时候用 Stub？",
      "过度 Mock 有什么问题，怎么避免？",
      "Mock 和真实测试环境怎么配合？",
    ],
    answerHints: [
      "先讲定义差异：Mock 验证行为，Stub 提供数据。",
      "再讲场景：验证交互用 Mock，单纯隔离数据用 Stub。",
      "补充 Mock 维护原则：只隔离外部依赖，不 Mock 业务逻辑。"
    ],
    relatedSlugs: ["unit-testing", "test-isolation"],
  },
  {
    slug: "data-driven-testing",
    title: "数据驱动测试",
    term: "数据驱动测试",
    summary: "把测试数据和测试逻辑分离，通过参数化实现同一逻辑覆盖多组输入。",
    category: "glossary",
    tags: ["自动化", "参数化", "测试设计"],
    difficulty: "beginner",
    interviewWeight: 2,
    shortDefinition: "通过外部数据源驱动测试执行，一条测试逻辑可覆盖多组输入输出组合。",
    definition:
      "数据驱动测试的核心思想是将测试数据（输入参数、预期结果）与测试代码分离。测试逻辑只写一次，通过读取外部数据文件（CSV、JSON、Excel、数据库）来驱动多组测试场景。这种方式特别适合需要覆盖大量参数组合的场景，如边界值测试、规则校验和表单验证。",
    whyItMatters:
      '面试官常问「你怎么处理大量参数组合」，数据驱动测试是标准答案。能讲清数据与逻辑分离、参数化设计才算真正理解。',
    commonMistakes: [
      {
        title: "数据与逻辑分离后不加校验",
        detail: "数据驱动后，测试数据本身可能出错（如字段缺失、格式错误）。好的做法是：在数据加载阶段做 schema 校验，确保数据结构正确再执行测试。面试时要说明你对数据质量的把控措施。"
      },
      {
        title: "所有测试都做成数据驱动",
        detail: "不是所有测试都适合数据驱动。只有输入输出组合多、逻辑重复性高的场景才值得。面试时要讲清选择原则：数据驱动适合边界值、规则校验等场景，流程性测试用普通用例更清晰。"
      },
      {
        title: "数据文件散落，版本管理混乱",
        detail: "数据文件如果不统一管理，会导致多版本、多环境数据不一致。好的做法是：数据文件与代码同仓库管理，按环境或模块分类组织。面试时要体现你对数据版本和环境的协调能力。"
      },
    ],
    confusingTerms: [
      {
        slug: "keyword-driven",
        term: "关键字驱动",
        difference: "关键字驱动是把操作步骤也抽象成关键字，数据驱动只分离输入输出数据。"
      },
      {
        slug: "parameterization",
        term: "参数化",
        difference: "参数化是数据驱动测试的技术实现手段，数据驱动是整体设计思想。"
      },
    ],
    frequentQuestions: [
      "什么场景适合数据驱动测试？",
      "数据驱动测试的数据怎么管理？",
      "数据驱动的测试失败怎么定位？",
    ],
    answerHints: [
      "先讲核心思想：数据与逻辑分离。",
      "再讲适用场景：边界值、规则校验、表单验证。",
      "补充维护要点：数据版本管理和校验机制。"
    ],
    relatedSlugs: ["pytest", "boundary-value-analysis"],
  },
  {
    slug: "test-pyramid",
    title: "测试金字塔",
    term: "测试金字塔",
    summary: "单元测试最多、集成测试适中、端到端测试最少，形成成本与收益的分层平衡。",
    category: "glossary",
    tags: ["测试策略", "分层测试", "质量体系"],
    difficulty: "beginner",
    interviewWeight: 3,
    shortDefinition: "测试数量应从底层单元测试向上递减，形成金字塔结构以平衡成本与覆盖。",
    definition:
      '测试金字塔是测试分层策略的经典模型，主张底层单元测试数量最多（成本低、反馈快），中间集成测试适中（覆盖模块交互），顶层端到端测试最少（成本高、维护难）。金字塔结构确保整体测试体系既高效又全面，避免「倒金字塔」（大量 UI 测试、少量单元测试）的高成本低效率问题。',
    whyItMatters:
      "面试官必问测试策略，测试金字塔是回答的框架。能从金字塔角度讲清分层原则，体现你对测试体系的系统性理解。",
    commonMistakes: [
      {
        title: "倒金字塔：大量 UI 测试，少量单元测试",
        detail: "如果 80% 是 UI 自动化，只有少量单元测试，会导致回归成本极高、失败定位困难。好的做法是：从底层补齐单元测试，让金字塔底部厚实。面试时要分析现状并提出改进策略。"
      },
      {
        title: "只知道金字塔形状，不讲实际落地原则",
        detail: "面试时只画金字塔图，却说不清各层比例如何确定。好的做法是：按团队能力和业务阶段设定比例，如初期 50% 单测、30% 接口、20% UI，后续逐步优化。面试时要结合项目讲具体比例和调整思路。"
      },
      {
        title: "忽略金字塔各层的测试重点",
        detail: "金字塔不只是数量比例，各层测试重点也不同：单元测试关注逻辑正确性，集成测试关注模块交互，端到端测试关注用户流程。面试时要讲清各层的测试目标和设计原则。"
      },
    ],
    confusingTerms: [
      {
        slug: "test-trophy",
        term: "测试奖杯",
        difference: "测试奖杯更强调集成测试的重要性，认为集成测试比单元测试更能验证真实业务场景。"
      },
      {
        slug: "test-diamond",
        term: "测试菱形",
        difference: "测试菱形主张集成测试占比最大，单元和端到端测试占比较少，与金字塔重心相反。"
      },
    ],
    frequentQuestions: [
      "你们项目的测试金字塔是什么样的？",
      "怎么从倒金字塔逐步调整？",
      "单元测试和集成测试的边界怎么划分？",
    ],
    answerHints: [
      "先画金字塔结构，讲清数量比例和成本逻辑。",
      "再分析现状问题（如 UI 测试太多）和改进方向。",
      "补充各层测试重点和落地执行策略。"
    ],
    relatedSlugs: ["unit-testing", "integration-testing"],
  },
  {
    slug: "regression-testing",
    title: "回归测试",
    term: "回归测试",
    summary: "代码变更后重新运行已有测试，确保新改动没有破坏原有功能。",
    category: "glossary",
    tags: ["回归测试", "自动化", "发布保障"],
    difficulty: "beginner",
    interviewWeight: 3,
    shortDefinition: "在代码修改后执行已有测试用例，验证原有功能未受新改动影响。",
    definition:
      "回归测试是变更后质量保障的核心环节，目的是验证新代码、配置或环境调整没有引入新的缺陷或破坏已有功能。回归测试可以手动执行，但更常见的是通过自动化套件定期运行。有效的回归策略需要区分全量回归（覆盖全部用例）和增量回归（只跑受影响模块），并配合冒烟测试、门禁机制来控制回归成本。",
    whyItMatters:
      '回归测试是测试开发日常工作的核心内容，面试官必问「你们回归怎么跑」。能讲清回归策略、自动化覆盖和门禁机制才算有实战经验。',
    commonMistakes: [
      {
        title: "每次变更都跑全量回归",
        detail: "全量回归成本极高，每次变更都跑会导致发布周期变长。好的做法是：按变更范围做增量回归，核心模块变更跑深度回归，小改动跑冒烟回归。面试时要讲清回归分级策略。"
      },
      {
        title: "回归失败后不定位就重跑",
        detail: "回归失败如果只是重跑而不分析原因，问题可能被掩盖。好的做法是：失败后先定位根因（环境问题、代码问题、测试本身问题），再决定是修复后重跑还是跳过。面试时要体现你的问题定位思路。"
      },
      {
        title: "回归用例只覆盖功能，不覆盖性能和兼容",
        detail: "回归测试不只是功能验证，性能回归、兼容性回归、安全回归同样重要。面试时要说明：关键业务会加入性能基线检查，前端发布会加入浏览器兼容回归。"
      },
    ],
    confusingTerms: [
      {
        slug: "smoke-testing",
        term: "冒烟测试",
        difference: "冒烟测试是快速验证基本可运行性的轻量测试，回归测试是验证变更不影响已有功能的深度测试。"
      },
      {
        slug: "sanity-testing",
        term: "健全测试",
        difference: "健全测试针对特定功能做快速验证，回归测试覆盖更广范围验证整体功能稳定性。"
      },
    ],
    frequentQuestions: [
      "你们回归测试怎么分级执行？",
      "回归失败后你怎么处理？",
      "怎么控制回归时间和覆盖率平衡？",
    ],
    answerHints: [
      "先讲回归目的：验证变更不影响已有功能。",
      "再讲分级策略：全量、增量、冒烟三级回归。",
      "补充自动化覆盖和门禁机制。"
    ],
    relatedSlugs: ["smoke-testing", "quality-gate", "ci-cd"],
  },
  {
    slug: "smoke-testing",
    title: "冒烟测试",
    term: "冒烟测试",
    summary: "快速验证系统基本功能可运行，作为深度测试的前置关卡。",
    category: "glossary",
    tags: ["冒烟测试", "快速验证", "发布"],
    difficulty: "beginner",
    interviewWeight: 2,
    shortDefinition: "轻量级测试用于验证系统基本功能正常，确保后续测试有意义。",
    definition:
      "冒烟测试源自硬件测试传统——通电后看是否冒烟。在软件测试中，冒烟测试是发布或提测后的首轮快速验证，覆盖核心路径和关键功能（如登录、下单、支付）。如果冒烟测试失败，后续深度测试就没有意义，需要先修复基础问题。冒烟测试通常自动化执行，在 CI 流水线中作为合并前或发布前的门禁。",
    whyItMatters:
      '冒烟测试是 CI/CD 门禁的核心环节，面试常问「你们的 smoke 包含什么」。能讲清冒烟范围、执行时机和阻断策略才算理解门禁设计。',
    commonMistakes: [
      {
        title: "冒烟测试范围太大或太小",
        detail: "范围太大（如包含全部功能）会导致执行时间长、门禁响应慢；范围太小（只测登录）会导致关键问题漏过。好的做法是：冒烟覆盖核心业务路径（如登录→浏览→下单→支付），控制在 5-10 分钟内。面试时要讲清冒烟范围设计原则。"
      },
      {
        title: "冒烟失败后继续做深度测试",
        detail: "冒烟失败说明基础功能有问题，继续深度测试浪费资源且大量失败难以定位。好的做法是：冒烟失败立即阻断后续测试，先修复基础问题再继续。面试时要强调冒烟的阻断作用。"
      },
      {
        title: "冒烟测试不纳入 CI 门禁",
        detail: "如果冒烟只是手动跑而不作为门禁，问题可能在合并后才被发现。好的做法是：冒烟自动化后纳入合并前或发布前门禁，失败阻断流程。面试时要说明冒烟与 CI 的配合。"
      },
    ],
    confusingTerms: [
      {
        slug: "regression-testing",
        term: "回归测试",
        difference: "回归测试验证变更不影响已有功能，冒烟测试验证基本功能可运行，前者深度后者轻量。"
      },
      {
        slug: "sanity-testing",
        term: "健全测试",
        difference: "健全测试针对特定功能验证，冒烟测试覆盖整体基本功能，两者范围和目的不同。"
      },
    ],
    frequentQuestions: [
      "你们冒烟测试包含哪些场景？",
      "冒烟测试失败后怎么处理？",
      "冒烟测试和回归测试怎么配合？",
    ],
    answerHints: [
      "先讲目的：快速验证基本可运行性。",
      "再讲范围：核心业务路径，控制在 5-10 分钟。",
      "补充 CI 门禁阻断策略。"
    ],
    relatedSlugs: ["regression-testing", "quality-gate", "ci-cd"],
  },
  {
    slug: "performance-testing-terms",
    title: "性能测试术语",
    term: "性能测试术语",
    summary: "性能测试、负载测试、压力测试、稳定性测试各有不同目标和指标。",
    category: "glossary",
    tags: ["性能测试", "负载测试", "压力测试"],
    difficulty: "interview",
    interviewWeight: 2,
    shortDefinition: "性能测试验证系统在不同负载下的响应时间、吞吐量和资源消耗。",
    definition:
      "性能测试术语体系包括多个细分类型：性能测试（验证系统是否满足性能指标）、负载测试（验证系统在预期负载下的表现）、压力测试（验证系统在超负载下的极限和恢复能力）、稳定性测试（验证系统长时间运行的稳定性）。关键指标包括响应时间、吞吐量（TPS/QPS）、并发数、错误率和资源利用率（CPU、内存、IO）。",
    whyItMatters:
      '性能测试是专项测试的高频考点，面试常问「你们做过哪些性能测试」。能区分各类型性能测试并讲清指标才算有专项能力。',
    commonMistakes: [
      {
        title: '把所有性能相关测试统称为「性能测试」',
        detail: '面试时如果只说「我做性能测试」，会被追问具体类型。好的做法是：明确区分性能测试（达标验证）、负载测试（预期负载）、压力测试（极限测试）和稳定性测试（长时间运行），并各举一个场景。面试时要体现你对性能测试类型的细分理解。'
      },
      {
        title: "只关注响应时间，忽略吞吐量和资源",
        detail: "响应时间只是用户体验指标，吞吐量体现系统处理能力，资源利用率体现系统瓶颈。面试时要说明：性能测试需要综合分析响应时间、吞吐量和资源利用率，不能只看单一指标。"
      },
      {
        title: "性能测试与生产环境脱节",
        detail: "测试环境性能数据不能直接映射到生产环境，因为硬件、数据量、网络条件不同。面试时要说明：性能测试数据要结合环境差异分析，关键指标要留安全余量。"
      },
    ],
    confusingTerms: [
      {
        slug: "load-testing",
        term: "负载测试",
        difference: "负载测试验证预期负载下的表现，压力测试验证超负载下的极限表现。"
      },
      {
        slug: "stress-testing",
        term: "压力测试",
        difference: "压力测试关注系统极限和崩溃恢复，负载测试关注系统在正常负载下的稳定表现。"
      },
    ],
    frequentQuestions: [
      "你们做过哪些类型的性能测试？",
      "性能测试关注哪些关键指标？",
      "性能测试数据怎么映射到生产环境？",
    ],
    answerHints: [
      "先分类：性能、负载、压力、稳定性四类。",
      "再讲指标：响应时间、吞吐量、并发、资源利用率。",
      "补充测试环境与生产环境的映射分析。"
    ],
    relatedSlugs: ["performance-baseline", "capacity-planning"],
  },
  {
    slug: "page-object-pattern",
    title: "页面对象模式",
    term: "页面对象模式",
    summary: "把页面元素和操作封装成对象，让测试代码与页面结构解耦。",
    category: "glossary",
    tags: ["UI 自动化", "Playwright", "Selenium", "设计模式"],
    difficulty: "beginner",
    interviewWeight: 3,
    shortDefinition: "将 Web 页面的元素定位和操作封装成独立类，实现测试逻辑与页面结构的解耦。",
    definition:
      "页面对象模式（Page Object Pattern）是 UI 自动化测试的经典设计模式，核心思想是把每个页面抽象成一个类，封装该页面的元素定位、操作方法和业务逻辑。测试代码只调用页面对象的方法，不直接操作元素。这样当页面结构变化时，只需修改页面对象类，测试代码不受影响，大大降低维护成本。",
    whyItMatters:
      '页面对象是 UI 自动化必问的设计模式，面试官常问「你怎么组织 UI 测试代码」。能讲清 PO 模式的好处和实现才算有框架设计能力。',
    commonMistakes: [
      {
        title: '在页面对象里写断言',
        detail: '页面对象应该只封装元素定位和操作，断言应该放在测试代码里。如果在页面对象里写断言，会导致职责混乱、测试逻辑分散。面试时要强调：页面对象做「动作」，测试代码做「验证」，职责分离。'
      },
      {
        title: "页面对象过度细分或过度聚合",
        detail: "过度细分（每个按钮一个类）会导致类太多、维护复杂；过度聚合（整个系统一个类）会导致职责不清。好的做法是：按页面或业务模块划分，一个页面对象包含该页面的主要元素和操作。面试时要讲清划分原则。"
      },
      {
        title: "页面对象与页面结构耦合太紧",
        detail: "如果页面对象直接依赖具体选择器（如 xpath://div[3]/span[2]），页面结构变化会大量失效。好的做法是：使用稳定的选择器策略（如 data-testid、语义化标签），减少对具体结构的依赖。面试时要说明选择器稳定性策略。"
      },
    ],
    confusingTerms: [
      {
        slug: "screenplay-pattern",
        term: "Screenplay 模式",
        difference: 'Screenplay 模式更强调「用户任务」而非「页面」，以用户视角组织测试代码，PO 模式以页面视角组织。'
      },
      {
        slug: "component-object",
        term: "组件对象",
        difference: "组件对象封装可复用的 UI 组件（如对话框、表单），页面对象封装整个页面的结构和操作。"
      },
    ],
    frequentQuestions: [
      "页面对象模式有什么好处？",
      "页面对象里应该包含哪些内容？",
      "页面结构变化时怎么维护页面对象？",
    ],
    answerHints: [
      "先讲核心：封装页面元素和操作，测试代码与页面解耦。",
      "再讲职责分离：页面对象做动作，测试代码做验证。",
      "补充选择器稳定性策略和划分原则。"
    ],
    relatedSlugs: ["playwright", "selenium", "ui-automation"],
  },
  {
    slug: "test-environment-management",
    title: "测试环境管理",
    term: "测试环境管理",
    summary: "测试环境、预发环境、生产环境各司其职，环境隔离和数据管理是关键。",
    category: "glossary",
    tags: ["环境管理", "测试环境", "DevOps"],
    difficulty: "interview",
    interviewWeight: 2,
    shortDefinition: "对开发、测试、预发、生产等多套环境的隔离、配置、数据管理和一致性保障。",
    definition:
      "测试环境管理涉及多套环境的规划、搭建、维护和切换。典型环境分层包括开发环境（开发自测）、测试环境（功能测试）、预发环境（发布前验证）、生产环境（真实用户）。环境管理的关键挑战包括环境隔离（避免互相干扰）、数据管理（测试数据与生产数据隔离）、配置一致性（环境间配置同步）和环境快速恢复（问题后快速重建）。",
    whyItMatters:
      '环境管理是测试开发的基础能力，面试常问「你们有几套环境，怎么管理」。能讲清环境分层、隔离策略和数据管理才算有工程化经验。',
    commonMistakes: [
      {
        title: '多团队共用一套测试环境',
        detail: '共用一套环境会导致互相干扰、测试结果不稳定、问题定位困难。好的做法是：按团队或项目隔离测试环境，或使用动态环境（每次测试临时创建）。面试时要说明环境隔离策略。'
      },
      {
        title: '测试环境与生产环境配置不一致',
        detail: '配置不一致会导致「测试通过、生产失败」的问题。好的做法是：通过配置模板或配置中心统一管理，测试环境配置与生产保持同步。面试时要强调配置一致性保障机制。'
      },
      {
        title: "测试环境数据与生产数据混乱",
        detail: "如果测试环境直接使用生产数据或数据格式不一致，会导致测试结果不可控。好的做法是：测试数据独立管理，通过数据工厂或数据脚本生成可控测试数据。面试时要说明数据管理策略。"
      },
    ],
    confusingTerms: [
      {
        slug: "staging-environment",
        term: "预发环境",
        difference: "预发环境是发布前的最后一道验证环境，配置和数据尽量接近生产，测试环境是日常功能测试环境。"
      },
      {
        slug: "sandbox",
        term: "沙箱环境",
        difference: "沙箱环境是完全隔离的测试环境，通常用于高风险操作验证（如支付测试），不与主测试环境交互。"
      },
    ],
    frequentQuestions: [
      "你们有几套环境，各套环境的作用是什么？",
      "测试环境怎么保持与生产环境一致？",
      "测试环境数据怎么管理？",
    ],
    answerHints: [
      "先讲环境分层：开发、测试、预发、生产。",
      "再讲隔离策略：按团队/项目隔离或动态环境。",
      "补充配置同步和数据管理机制。"
    ],
    relatedSlugs: ["ci-cd", "cloud-native-for-testdev"],
  },
  {
    slug: "bug-lifecycle",
    title: "Bug 生命周期",
    term: "Bug 生命周期",
    summary: "Bug 从发现到关闭经历新建、确认、修复、验证等多个状态流转。",
    category: "glossary",
    tags: ["缺陷管理", "Bug", "流程"],
    difficulty: "beginner",
    interviewWeight: 2,
    shortDefinition: "缺陷从发现、分析、修复、验证到关闭的完整状态流转过程。",
    definition:
      "Bug 生命周期描述缺陷从发现到关闭的完整流转过程。典型状态包括：新建（测试发现）、确认（开发确认）、修复中（开发处理）、待验证（修复完成）、验证通过（测试确认修复）、关闭（问题解决）。可能还有拒绝（非缺陷）、延迟处理（优先级低）、 reopened（验证失败重新打开）等状态。规范的 Bug 生命周期确保缺陷可追踪、不遗漏、责任清晰。",
    whyItMatters:
      'Bug 生命周期是测试工作的基本流程，面试常问「Bug 状态怎么流转」。能讲清各状态含义和流转条件才算有规范的缺陷管理经验。',
    commonMistakes: [
      {
        title: "Bug 状态流转不规范",
        detail: "如果 Bug 状态随意跳转（如新建直接关闭），会导致问题遗漏或责任不清。好的做法是：严格按照流程流转，每个状态变更要有明确原因记录。面试时要说明你们团队的 Bug 流程规范。"
      },
      {
        title: "验证通过后 Bug 还不关闭",
        detail: "验证通过后应该及时关闭 Bug，否则 Bug 系统会积累大量已解决问题。面试时要说明：关闭 Bug 是测试的责任，关闭时要记录验证方法和结论。"
      },
      {
        title: "reopen 的 Bug 不追溯根因",
        detail: "如果 Bug reopen 后只是再次修复，可能掩盖更深层问题。好的做法是：reopen 的 Bug 要追溯根因（修复不彻底、理解偏差、回归问题），并记录教训。面试时要体现你的根因分析意识。"
      },
    ],
    confusingTerms: [
      {
        slug: "issue-tracking",
        term: "问题追踪",
        difference: "问题追踪是整个管理系统，Bug 生命周期是其中缺陷的状态流转模型。"
      },
      {
        slug: "defect-severity",
        term: "缺陷严重程度",
        difference: "严重程度是 Bug 的属性分级，Bug 生命周期是 Bug 的状态流转过程，两者是不同维度。"
      },
    ],
    frequentQuestions: [
      "Bug 从发现到关闭怎么流转？",
      "什么情况下 Bug 会 reopen？",
      "你怎么判断 Bug 可以关闭？",
    ],
    answerHints: [
      "先画状态流转图：新建→确认→修复→待验证→验证通过→关闭。",
      "再讲特殊状态：拒绝、延迟、reopen。",
      "补充流程规范和根因分析意识。"
    ],
    relatedSlugs: ["defect-management", "quality-metrics"],
  },
  {
    slug: "test-coverage",
    title: "测试覆盖率",
    term: "测试覆盖率",
    summary: "代码覆盖率、功能覆盖率、场景覆盖率各有不同计算方式和应用价值。",
    category: "glossary",
    tags: ["覆盖率", "质量指标", "测试度量"],
    difficulty: "interview",
    interviewWeight: 3,
    shortDefinition: "衡量测试覆盖程度的指标，包括代码覆盖率、功能覆盖率、场景覆盖率等。",
    definition:
      '测试覆盖率是衡量测试完整性的关键指标，主要类型包括：代码覆盖率（语句、分支、条件覆盖）、功能覆盖率（需求/功能点覆盖比例）、场景覆盖率（业务流程/用户路径覆盖比例）。代码覆盖率可工具自动统计，功能覆盖率和场景覆盖率需要人工设计和维护。覆盖率不是越高越好，要结合风险成本平衡，追求「关键路径高覆盖、次要路径适度覆盖」。',
    whyItMatters:
      '覆盖率是面试必问的质量指标，面试官常问「你们的覆盖率是多少，怎么衡量」。能区分各类型覆盖率并讲清覆盖率策略才算有度量思维。',
    commonMistakes: [
      {
        title: "只追求代码覆盖率数字",
        detail: "代码覆盖率高不代表测试质量好，可能只是执行了代码路径但没做有效断言。面试时要强调：覆盖率只是参考指标，更重要的是测试质量和关键路径覆盖。举例说明高覆盖率但低质量的场景。"
      },
      {
        title: "忽略功能覆盖率和场景覆盖率",
        detail: "代码覆盖率只看代码执行，功能覆盖率看需求覆盖，场景覆盖率看业务流程覆盖。面试时要说明：完整的覆盖率体系需要三者结合，不能只依赖代码覆盖率。"
      },
      {
        title: "覆盖率目标一刀切",
        detail: "不同模块的覆盖率目标应该不同：核心业务高覆盖率（如 80%+），辅助功能适度覆盖（如 50%）。面试时要说明：覆盖率目标要按风险分级设定，而非统一标准。"
      },
    ],
    confusingTerms: [
      {
        slug: "code-coverage",
        term: "代码覆盖率",
        difference: "代码覆盖率是测试覆盖率的一种，专注代码执行路径覆盖；测试覆盖率是更广义的概念。"
      },
      {
        slug: "branch-coverage",
        term: "分支覆盖率",
        difference: "分支覆盖率是代码覆盖率的一种，关注条件分支是否都被覆盖；语句覆盖率只看代码行执行。"
      },
    ],
    frequentQuestions: [
      "你们项目的覆盖率是多少，怎么衡量的？",
      "代码覆盖率高就说明测试好吗？",
      "你怎么设定覆盖率目标？",
    ],
    answerHints: [
      "先分类：代码覆盖、功能覆盖、场景覆盖三种。",
      "再讲策略：关键路径高覆盖，次要路径适度覆盖。",
      "补充覆盖率只是参考，更重要的是测试质量。"
    ],
    relatedSlugs: ["quality-metrics", "test-pyramid"],
  },
  {
    slug: "boundary-value-analysis",
    title: "边界值分析",
    term: "边界值分析",
    summary: "边界附近是最容易出现缺陷的区域，测试要重点覆盖边界值及其相邻值。",
    category: "glossary",
    tags: ["测试设计", "边界值", "黑盒测试"],
    difficulty: "beginner",
    interviewWeight: 3,
    shortDefinition: "针对输入输出的边界条件及其相邻值设计测试用例的方法。",
    definition:
      '边界值分析是黑盒测试的经典设计方法，核心思想是「缺陷多发生在边界附近」。测试时重点覆盖边界值（如最小值、最大值）和边界相邻值（如边界-1、边界+1）。典型边界包括数值范围（0、-1、最大值、最大值+1）、字符串长度（空、满、超长）、时间范围（最早、最晚）、列表索引（首、尾、越界）等。边界值分析适合与等价类划分配合使用。',
    whyItMatters:
      '边界值分析是测试设计方法的高频考点，面试常问「你怎么设计测试用例」。能举边界值例子并讲清与等价类划分的配合才算有设计方法论。',
    commonMistakes: [
      {
        title: "只测边界值，不测边界相邻值",
        detail: "边界值分析不只是测边界本身，更要测边界相邻值（边界-1、边界+1）。很多缺陷发生在边界附近而非边界本身。面试时要说明：边界值测试要覆盖边界、边界-1、边界+1 三个点。"
      },
      {
        title: "忽略隐含边界",
        detail: "显式边界容易识别（如输入框最大长度），隐含边界容易被忽略（如数据库字段长度、缓存过期时间、分页边界）。面试时要说明：边界值分析要找出所有隐含边界，并举隐含边界导致问题的案例。"
      },
      {
        title: "边界值分析与等价类划分割裂使用",
        detail: "边界值分析通常与等价类划分配合：等价类划分确定测试范围，边界值分析在边界附近深入测试。面试时要说明两者的配合使用方式。"
      },
    ],
    confusingTerms: [
      {
        slug: "equivalence-class-partition",
        term: "等价类划分",
        difference: "等价类划分把输入分成若干等价类，边界值分析重点覆盖边界和相邻值，两者配合使用。"
      },
      {
        slug: "edge-case",
        term: "边缘情况",
        difference: "边缘情况是泛指极端场景，边界值分析是系统化的测试设计方法，有明确的测试点定义。"
      },
    ],
    frequentQuestions: [
      "边界值分析怎么设计测试用例？",
      "举一个边界值导致线上问题的例子？",
      "边界值分析和等价类划分怎么配合？",
    ],
    answerHints: [
      "先讲核心：缺陷多在边界附近，重点覆盖边界和相邻值。",
      "再举例：数值范围、字符串长度、时间、分页等典型边界。",
      "补充隐含边界识别和与等价类配合。"
    ],
    relatedSlugs: ["equivalence-class-partition", "test-design"],
  },
  {
    slug: "equivalence-class-partition",
    title: "等价类划分",
    term: "等价类划分",
    summary: "把输入域分成若干等价类，每个等价类选一个代表值测试，缩减用例数量。",
    category: "glossary",
    tags: ["测试设计", "等价类", "黑盒测试"],
    difficulty: "beginner",
    interviewWeight: 3,
    shortDefinition: "将输入域划分为若干等价类，每类选代表性值测试，假设同类结果一致。",
    definition:
      "等价类划分是黑盒测试的经典设计方法，核心思想是把输入域分成若干等价类，每个等价类中的值对测试目的等效。测试时只需从每个等价类选一个代表值，假设该类其他值结果相同。等价类分为有效等价类（符合规范输入）和无效等价类（不符合规范输入）。等价类划分能有效缩减用例数量，避免冗余测试。",
    whyItMatters:
      '等价类划分是测试设计方法的高频考点，面试常问「你怎么控制用例数量」。能讲清等价类划分原理并举例子才算有设计方法论。',
    commonMistakes: [
      {
        title: '等价类划分太粗糙',
        detail: '如果等价类划分太粗（如「所有整数」一个类），会遗漏重要测试场景。好的做法是：按业务逻辑细分等价类，如「正整数」、「零」、「负整数」、「超限整数」各为独立类。面试时要说明等价类细分的必要性。'
      },
      {
        title: '忽略无效等价类',
        detail: '很多人只划分有效等价类，忽略无效等价类（非法输入）。面试时要强调：无效等价类同样重要，要覆盖非法输入的处理逻辑（如错误提示、拒绝处理）。'
      },
      {
        title: '等价类假设不验证',
        detail: '等价类划分基于假设「同类结果一致」，但实际可能有例外。面试时要说明：关键等价类要多个值验证假设，不能只依赖一个代表值。'
      },
    ],
    confusingTerms: [
      {
        slug: "boundary-value-analysis",
        term: "边界值分析",
        difference: "边界值分析重点覆盖边界，等价类划分把输入域分成若干等效类，两者配合使用覆盖更全面。"
      },
      {
        slug: "decision-table",
        term: "判定表",
        difference: "判定表处理多条件组合的逻辑场景，等价类划分处理单输入域的等效分组，适用场景不同。"
      },
    ],
    frequentQuestions: [
      "等价类划分怎么设计？",
      "有效等价类和无效等价类怎么划分？",
      "等价类划分和边界值分析怎么配合？",
    ],
    answerHints: [
      "先讲原理：同类值等效，每类选一个代表。",
      "再分类：有效等价类（合规输入）和无效等价类（非法输入）。",
      "补充与边界值分析配合，覆盖更全面。"
    ],
    relatedSlugs: ["boundary-value-analysis", "test-design", "data-driven-testing"],
  },
  {
    slug: "error-guessing",
    title: "错误猜测法",
    term: "错误猜测法",
    summary: "基于经验和直觉猜测可能的缺陷位置和类型，补充正式设计方法遗漏。",
    category: "glossary",
    tags: ["测试设计", "经验测试", "缺陷预测"],
    difficulty: "beginner",
    interviewWeight: 2,
    shortDefinition: "凭经验和直觉推测易出错的区域，针对性设计测试用例。",
    definition:
      "错误猜测法是基于测试经验和领域知识推测易出错区域的测试方法。测试人员根据历史缺陷、开发习惯、业务复杂度等因素，猜测可能的缺陷类型和位置，针对性设计测试用例。错误猜测法不是正式的测试设计方法，但能有效补充等价类划分、边界值分析等方法遗漏的异常场景。",
    whyItMatters:
      '错误猜测法体现测试人员的经验和直觉，面试常问「你怎么发现那些没想到的问题」。能举错误猜测的例子才算有实战经验。',
    commonMistakes: [
      {
        title: "把错误猜测法作为主要设计方法",
        detail: "错误猜测法是补充方法，不应替代正式设计方法（等价类、边界值、场景法）。面试时要强调：正式方法保基础覆盖，错误猜测法补充经验场景。"
      },
      {
        title: "错误猜测没有沉淀",
        detail: "每次错误猜测如果只是凭直觉不沉淀，经验无法传承。好的做法是：把猜测到的缺陷类型记录成检查清单，逐步形成团队经验库。面试时要说明经验沉淀的方法。"
      },
      {
        title: "错误猜测范围太窄",
        detail: "只关注自己熟悉的错误类型，忽略其他易错区域。面试时要说明：错误猜测要结合历史缺陷数据、开发习惯、业务复杂度等多维度分析。"
      },
    ],
    confusingTerms: [
      {
        slug: "exploratory-testing",
        term: "探索性测试",
        difference: "探索性测试是系统化的随机测试方法，错误猜测法是凭经验针对性推测，两者思路不同。"
      },
      {
        slug: "defect-based-testing",
        term: "基于缺陷的测试",
        difference: "基于缺陷的测试是根据历史缺陷模式系统化设计，错误猜测法是凭直觉推测，后者更依赖个人经验。"
      },
    ],
    frequentQuestions: [
      "错误猜测法怎么用？",
      "你怎么猜测可能的缺陷？",
      "错误猜测和正式方法怎么配合？",
    ],
    answerHints: [
      "先讲定位：补充正式方法的经验方法。",
      "再讲依据：历史缺陷、开发习惯、业务复杂度。",
      "补充经验沉淀成检查清单。"
    ],
    relatedSlugs: ["exploratory-testing", "test-design"],
  },
  {
    slug: "state-transition-testing",
    title: "状态转换测试",
    term: "状态转换测试",
    summary: "验证系统在状态流转过程中的正确性和异常处理能力。",
    category: "glossary",
    tags: ["测试设计", "状态机", "流程测试"],
    difficulty: "interview",
    interviewWeight: 2,
    shortDefinition: "基于系统状态转换图设计测试用例，验证状态流转的正确性。",
    definition:
      "状态转换测试是针对有状态流转的系统（如订单、支付、工单）的测试方法。核心是绘制状态转换图，明确所有状态、转换条件和转换路径，然后设计测试覆盖正常流转、异常流转和非法转换。测试要点包括：状态推进正确性、状态回退正确性、非法转换拦截、并发状态冲突和状态持久化。",
    whyItMatters:
      '状态转换是业务系统的核心逻辑，面试常问「订单状态怎么测」。能讲清状态转换图和测试覆盖才算有业务测试深度。',
    commonMistakes: [
      {
        title: "只测正常状态流转，忽略异常流转",
        detail: "正常流转容易想到，异常流转（如取消、失败、超时）容易被忽略。面试时要强调：状态转换测试要覆盖所有流转路径，包括正常推进、异常回退和非法转换拦截。"
      },
      {
        title: "忽略并发状态冲突",
        detail: "并发操作可能导致状态冲突（如同时取消和支付），测试要覆盖并发场景。面试时要说明：状态转换测试要考虑并发操作，验证状态一致性。"
      },
      {
        title: "状态转换图与实现不一致",
        detail: "如果测试用的状态图与代码实现不一致，测试会遗漏或多余。面试时要说明：状态转换图要与开发对齐，作为测试和开发的共同参考。"
      },
    ],
    confusingTerms: [
      {
        slug: "flow-testing",
        term: "流程测试",
        difference: "流程测试关注业务流程完整性，状态转换测试关注状态流转的正确性，两者角度不同。"
      },
      {
        slug: "scenario-testing",
        term: "场景测试",
        difference: "场景测试以用户场景为主线，状态转换测试以状态流转为主线，适用场景不同。"
      },
    ],
    frequentQuestions: [
      "状态转换测试怎么设计？",
      "举一个状态转换导致问题的例子？",
      "并发操作怎么影响状态转换？",
    ],
    answerHints: [
      "先画状态转换图，明确状态和转换条件。",
      "再覆盖：正常流转、异常流转、非法转换。",
      "补充并发状态冲突和状态一致性验证。"
    ],
    relatedSlugs: ["payment-callback", "idempotency", "test-design"],
  },
  {
    slug: "exploratory-testing",
    title: "探索性测试",
    term: "探索性测试",
    summary: "边学习边设计边执行，通过自由探索发现预设用例遗漏的问题。",
    category: "glossary",
    tags: ["探索性测试", "敏捷测试", "自由测试"],
    difficulty: "interview",
    interviewWeight: 2,
    shortDefinition: "测试人员边探索边设计边执行，灵活发现预设测试未覆盖的缺陷。",
    definition:
      "探索性测试是一种强调测试人员自主性和灵活性的测试方法。测试人员边学习产品边设计测试边执行，不预先编写详细用例。探索性测试特别适合快速迭代、需求变化频繁或测试时间紧张的场景。有效执行需要测试人员有较强经验和系统化探索思维，常用方法包括角色探索、特性探索、场景探索和数据探索。",
    whyItMatters:
      '探索性测试是敏捷测试的重要方法，面试常问「你们怎么做探索性测试」。能讲清探索性测试方法和价值才算有敏捷测试经验。',
    commonMistakes: [
      {
        title: "把探索性测试等同于随意测试",
        detail: "探索性测试不是随意测试，而是有方法、有目标的系统化探索。面试时要强调：探索性测试要设定探索目标、记录发现、总结经验，而非随意点击。"
      },
      {
        title: "探索性测试没有记录",
        detail: "探索性测试如果只探索不记录，发现的问题和经验无法沉淀。面试时要说明：探索性测试要记录发现的缺陷、探索路径和经验总结。"
      },
      {
        title: "完全依赖探索性测试",
        detail: "探索性测试不能替代预设测试（自动化回归、场景测试），而是作为补充。面试时要说明：探索性测试与预设测试配合，前者发现新问题，后者保障已知功能。"
      },
    ],
    confusingTerms: [
      {
        slug: "ad-hoc-testing",
        term: "临时测试",
        difference: "临时测试是完全没有计划的随机测试，探索性测试是有方法、有目标的系统化探索。"
      },
      {
        slug: "error-guessing",
        term: "错误猜测法",
        difference: "错误猜测法是凭经验针对性推测，探索性测试是边学习边探索边发现的灵活方法。"
      },
    ],
    frequentQuestions: [
      "探索性测试怎么执行？",
      "探索性测试和预设测试怎么配合？",
      "探索性测试怎么保证覆盖？",
    ],
    answerHints: [
      "先讲定位：边学习边设计边执行的灵活测试。",
      "再讲方法：角色探索、特性探索、场景探索。",
      "补充：设定目标、记录发现、与预设测试配合。"
    ],
    relatedSlugs: ["error-guessing", "agile-testing", "test-design"],
  },
  {
    slug: "ab-testing",
    title: "A/B 测试",
    term: "A/B 测试",
    summary: "对比两组用户对不同方案的反应，用数据验证产品决策。",
    category: "glossary",
    tags: ["A/B 测试", "数据驱动", "产品验证"],
    difficulty: "interview",
    interviewWeight: 2,
    shortDefinition: "随机分配用户到不同方案组，对比关键指标验证方案优劣。",
    definition:
      "A/B 测试是将用户随机分配到不同方案组（如 A 组看旧版本、B 组看新版本），对比关键指标（如转化率、留存率、点击率）验证方案效果。A/B 测试是数据驱动产品决策的核心方法，需要科学的分组策略、指标定义、样本量计算和结果分析。测试开发在 A/B 测试中通常负责实验设计、数据验证和结果可信度保障。",
    whyItMatters:
      'A/B 测试是产品迭代的重要方法，面试可能问「你们怎么做 A/B 测试」。能讲清实验设计、分组策略和数据分析才算有数据驱动经验。',
    commonMistakes: [
      {
        title: "分组不随机或不均匀",
        detail: "如果分组不随机或特征分布不均匀，会导致结果偏差。面试时要说明：A/B 测试要确保随机分组，各组的用户特征分布一致，避免选择性偏差。"
      },
      {
        title: "样本量太小，结果不可信",
        detail: "样本量太小会导致统计显著性不足，结果可能只是随机波动。面试时要说明：A/B 测试要有足够的样本量，通过统计显著性检验验证结论可靠性。"
      },
      {
        title: "同时做多个 A/B 测试互相干扰",
        detail: "多个实验同时进行可能互相干扰结果。面试时要说明：多实验要设计互不干扰的分层实验框架，或串行执行避免干扰。"
      },
    ],
    confusingTerms: [
      {
        slug: "multivariate-testing",
        term: "多变量测试",
        difference: "多变量测试同时测试多个变量的组合效果，A/B 测试只测试单一变量的两个版本。"
      },
      {
        slug: "canary-release",
        term: "灰度发布",
        difference: "灰度发布是逐步放开新版本范围的技术手段，A/B 测试是对比方案效果的实验方法，两者目的不同。"
      },
    ],
    frequentQuestions: [
      "A/B 测试怎么设计？",
      "怎么保证 A/B 测试结果可信？",
      "A/B 测试和灰度发布怎么配合？",
    ],
    answerHints: [
      "先讲原理：随机分组，对比关键指标。",
      "再讲保障：随机分组、样本量、统计显著性。",
      "补充多实验干扰问题和分层实验框架。"
    ],
    relatedSlugs: ["data-driven-testing", "canary-release"],
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
  {
    slug: "mock-framework",
    title: "Mock 框架实践",
    summary: "围绕依赖隔离、请求拦截和响应控制讲清 Mock 在测试中的应用。",
    category: "tech",
    tags: ["Mock", "依赖隔离", "接口测试", "自动化"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "Mock 是测试中隔离外部依赖的技术，通过模拟服务响应来控制测试环境，减少对真实服务的依赖。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你在自动化测试里怎么处理第三方服务依赖？",
          "Mock 和真实服务测试怎么取舍？",
          "有哪些 Mock 框架或工具你用过？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "用 Mock Server 模拟支付回调、短信通知等外部服务。",
          "在接口测试中拦截请求，覆盖异常返回和超时场景。",
          "结合 Playwright 或 Cypress 的网络拦截能力做前端 Mock。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "只说会 Mock，不会讲何时该用真实服务验证。",
          "忽略 Mock 和真实服务行为不一致的风险。",
          "不会讲 Mock 数据如何管理和维护。",
        ],
      },
    ],
  },
  {
    slug: "data-driven-testing",
    title: "数据驱动与参数化",
    summary: "把测试数据和测试逻辑解耦，用数据组合驱动用例执行。",
    category: "tech",
    tags: ["数据驱动", "参数化", "自动化", "Pytest"],
    difficulty: "beginner",
    interviewWeight: 2,
    relatedSlugs: ["pytest", "fixture-strategy"],
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "数据驱动测试是把输入数据、预期结果和测试逻辑分离，通过参数化机制批量生成测试用例。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你怎么做接口参数组合测试？",
          "数据文件和测试代码怎么组织？",
          "数据驱动测试的维护成本怎么控制？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "用 CSV、JSON 或 YAML 存储测试数据，与测试脚本分离。",
          "通过 Pytest parametrize 或自定义装饰器实现参数化。",
          "对边界值、异常组合和业务规则场景做数据驱动覆盖。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "参数组合爆炸，导致用例数量失控。",
          "数据文件和代码版本不匹配，维护混乱。",
          "只覆盖 happy path，忽略异常和边界数据。",
        ],
      },
    ],
  },
  {
    slug: "performance-testing-intro",
    title: "性能测试入门",
    summary: "从指标、场景设计和工具选择切入，讲清性能测试基础。",
    category: "tech",
    tags: ["性能测试", "压测", "响应时间", "吞吐量"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "性能测试关注系统在一定负载下的响应时间、吞吐量、资源占用和稳定性，常用工具包括 JMeter、Locust 和 k6。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你做过哪些性能测试场景？",
          "性能指标有哪些，怎么判断系统是否达标？",
          "压测时怎么设计并发和数据量？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "对核心接口做单接口基准压测和并发压测。",
          "模拟真实业务场景做链路级混合压测。",
          "结合监控平台分析瓶颈点，输出性能报告和优化建议。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "只说压测数字，不会讲场景设计和指标意义。",
          "忽略测试环境与生产环境的差异。",
          "不会讲性能问题定位和调优思路。",
        ],
      },
    ],
  },
  {
    slug: "docker-testing",
    title: "Docker 测试应用",
    summary: "用容器化技术隔离测试环境，提升环境准备效率和一致性。",
    category: "tech",
    tags: ["Docker", "容器化", "环境管理", "测试环境"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "Docker 在测试中用于快速拉起依赖服务、隔离测试环境和统一环境配置，减少环境准备成本。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你怎么用 Docker 管理测试环境？",
          "Docker Compose 在自动化测试里怎么用？",
          "容器化测试环境的优缺点是什么？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "用 Docker Compose 一键拉起数据库、Redis、MQ 等依赖服务。",
          "在 CI 流水线中用容器做隔离的测试环境。",
          "把测试工具和脚本也容器化，统一执行环境。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "只说会用 Docker，不会讲与测试场景的结合。",
          "忽略容器网络、数据持久化和资源限制问题。",
          "不会讲 Docker 与 K8s 在测试中的定位差异。",
        ],
      },
    ],
  },
  {
    slug: "logging-observability",
    title: "日志与可观测性",
    summary: "把日志、指标和链路追踪作为测试定位和问题验证的核心能力。",
    category: "tech",
    tags: ["日志", "监控", "可观测性", "排障"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "可观测性包括日志、指标和链路追踪三要素，用于定位系统行为、性能瓶颈和异常原因。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "测试失败时你怎么通过日志定位问题？",
          "你对监控指标和告警规则有什么了解？",
          "链路追踪在测试中有什么用？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "自动化失败时自动抓取关键日志片段辅助定位。",
          "结合监控平台验证性能指标是否符合预期。",
          "在跨服务场景用链路追踪验证调用链和数据流转。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "只会看日志输出，不会讲日志结构和检索能力。",
          "忽略监控指标与测试结果的关联分析。",
          "不会讲如何在测试中主动触发和验证告警。",
        ],
      },
    ],
  },
  {
    slug: "git-collaboration",
    title: "Git 版本协作",
    summary: "把分支管理、冲突解决和协作规范作为团队开发基础能力。",
    category: "tech",
    tags: ["Git", "分支管理", "协作", "版本控制"],
    difficulty: "beginner",
    interviewWeight: 1,
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "Git 是团队协作的版本控制基础，测试开发需要掌握分支管理、代码合并、冲突解决和协作规范。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你们团队的 Git 分支策略是什么？",
          "自动化代码怎么和业务代码协作管理？",
          "遇到冲突时你怎么处理？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "按功能或迭代分支管理自动化脚本和配置。",
          "通过 PR 机制做代码评审和合并。",
          "把测试用例和数据文件纳入版本控制。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "只会基本命令，不会讲分支策略和协作规范。",
          "忽略自动化代码和业务代码的版本对齐问题。",
          "不会讲 CI 中 Git 触发和分支过滤机制。",
        ],
      },
    ],
  },
  {
    slug: "database-testing",
    title: "数据库测试基础",
    summary: "围绕数据准备、状态验证和数据一致性组织数据库测试回答。",
    category: "tech",
    tags: ["数据库", "SQL", "数据验证", "一致性"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "数据库测试关注数据准备、查询验证、状态一致性和数据边界场景，是业务测试的重要补充。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你怎么验证接口操作后的数据库状态？",
          "测试数据怎么准备和清理？",
          "数据库边界场景有哪些？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "在接口测试后查询数据库验证业务状态。",
          "通过 Fixture 或脚本准备和清理测试数据。",
          "覆盖空值、边界值、重复数据和关联约束场景。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "只会简单查询，不会讲状态验证策略。",
          "忽略数据清理和环境隔离问题。",
          "不会讲数据库事务和并发场景测试。",
        ],
      },
    ],
  },
  {
    slug: "redis-testing",
    title: "Redis 缓存测试",
    summary: "围绕缓存读写、过期策略和一致性验证组织 Redis 测试回答。",
    category: "tech",
    tags: ["Redis", "缓存", "性能", "一致性"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "Redis 测试关注缓存读写、过期策略、数据一致性和缓存失效场景，是高并发业务测试的关键。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你怎么验证缓存和数据库的一致性？",
          "缓存过期和失效场景怎么测？",
          "Redis 在你项目里承担什么角色？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "在接口测试中验证缓存读写结果和过期时间。",
          "覆盖缓存穿透、缓存雪崩和缓存击穿场景。",
          "结合数据库变更验证缓存更新和失效逻辑。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "只说会用 Redis，不会讲缓存测试场景。",
          "忽略缓存与数据库的一致性验证。",
          "不会讲缓存失效对业务的影响。",
        ],
      },
    ],
  },
  {
    slug: "message-queue-testing",
    title: "消息队列测试",
    summary: "围绕消息投递、消费确认和异常补偿组织消息队列测试回答。",
    category: "tech",
    tags: ["消息队列", "MQ", "异步", "可靠性"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "消息队列测试关注消息投递可靠性、消费确认、重复消费和异常补偿场景。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你怎么验证消息是否成功投递和消费？",
          "消息重复消费怎么测？",
          "消息积压和消费失败场景怎么处理？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "验证生产者投递成功和消费者确认机制。",
          "覆盖消息重复、顺序、延迟和丢失场景。",
          "结合业务状态验证消息消费后的副作用。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "只关注投递，忽略消费确认和幂等。",
          "不会讲消息积压和消费异常的补偿机制。",
          "忽略跨服务消息链路的验证。",
        ],
      },
    ],
  },
  {
    slug: "test-report-design",
    title: "测试报告设计",
    summary: "把结果呈现、失败定位和指标追踪作为报告设计的核心能力。",
    category: "tech",
    tags: ["测试报告", "报告", "可视化", "CI"],
    difficulty: "beginner",
    interviewWeight: 1,
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "测试报告是测试结果的呈现载体，需要清晰展示执行结果、失败原因、覆盖指标和趋势数据。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你们项目的测试报告怎么生成和分发？",
          "报告里哪些信息对团队最有价值？",
          "失败定位信息怎么设计？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "自动生成 HTML 或 Allure 报告并上传到服务器。",
          "报告包含执行统计、失败详情、截图和日志链接。",
          "把报告地址推送到群通知，方便快速查看。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "报告信息太少，不足以定位失败。",
          "报告格式混乱，阅读成本高。",
          "不会讲报告与门禁和趋势追踪的结合。",
        ],
      },
    ],
  },
  {
    slug: "async-api-testing",
    title: "异步接口测试",
    summary: "把轮询、回调、超时和最终状态验证作为异步测试核心能力。",
    category: "tech",
    tags: ["异步接口", "回调", "轮询", "接口测试"],
    difficulty: "interview",
    interviewWeight: 3,
    relatedSlugs: ["api-testing", "idempotency"],
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "异步接口测试关注接口调用后的最终状态验证，包括轮询等待、回调处理、超时控制和结果追踪。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "qa-list",
        items: [
          {
            question: "你怎么验证异步接口的最终结果？",
            answer: "通过轮询查询接口或监听回调通知，验证业务状态、数据库记录和副作用是否符合预期。",
          },
          {
            question: "回调接口怎么测？",
            answer: "覆盖正常回调、重复回调、乱序回调、超时回调和签名校验，验证幂等和状态推进。",
          },
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "设计等待策略：固定轮询、指数退避或事件触发。",
          "验证超时后的补偿机制和人工处理入口。",
          "结合日志和数据库做最终状态双重验证。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "只测发起调用，忽略最终结果验证。",
          "等待时间设计不合理，导致测试不稳定。",
          "忽略回调重复和幂等验证。",
        ],
      },
    ],
  },
  {
    slug: "test-data-management",
    title: "测试数据管理",
    summary: "围绕数据准备、隔离、清理和复用组织测试数据管理回答。",
    category: "tech",
    tags: ["测试数据", "数据管理", "Fixture", "环境隔离"],
    difficulty: "interview",
    interviewWeight: 2,
    relatedSlugs: ["fixture", "fixture-strategy"],
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "测试数据管理关注数据准备方式、环境隔离、数据清理和数据复用策略，是自动化稳定性的基础。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你们项目的测试数据怎么准备和管理？",
          "如何保证测试数据不影响其他环境？",
          "数据复用和数据隔离怎么取舍？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "通过接口、数据库或配置文件准备测试数据。",
          "用独立数据库或命名空间隔离测试环境。",
          "每个测试后自动清理或标记回收数据。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "数据散落各处，没有统一管理策略。",
          "数据残留导致后续测试干扰或失败。",
          "不会讲数据版本与环境版本的对齐。",
        ],
      },
    ],
  },
  {
    slug: "api-document-contract",
    title: "接口文档与契约测试",
    summary: "把接口定义、契约验证和文档一致性作为接口治理核心能力。",
    category: "tech",
    tags: ["接口文档", "契约测试", "OpenAPI", "接口治理"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "what",
        title: "是什么",
        kind: "paragraph",
        content: text(
          "接口文档是团队协作的约定，契约测试用于验证接口实现是否符合文档定义，常用 OpenAPI 或 Pact。",
        ),
      },
      {
        id: "interview",
        title: "面试怎么问",
        kind: "list",
        items: [
          "你们项目怎么维护接口文档？",
          "接口变更时怎么保证文档和实现一致？",
          "契约测试是什么，怎么用？",
        ],
      },
      {
        id: "project-usage",
        title: "项目里怎么用",
        kind: "list",
        items: [
          "用 OpenAPI 或 Swagger 定义接口规范。",
          "在 CI 中做契约测试，拦截不兼容变更。",
          "文档变更时同步更新测试用例和断言。",
        ],
      },
      {
        id: "pitfalls",
        title: "容易答错什么",
        kind: "list",
        items: [
          "文档和实现脱节，维护成本高。",
          "不会讲契约测试和功能测试的区别。",
          "忽略接口版本管理和兼容性策略。",
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
  {
    slug: "finance-project",
    title: "金融项目怎么讲合规、风控和资金安全",
    summary: "重点体现对账、审批流、合规校验和资金链路验证能力。",
    category: "project",
    tags: ["金融", "对账", "风控", "合规"],
    difficulty: "interview",
    interviewWeight: 3,
    sections: [
      {
        id: "flow",
        title: "业务流程",
        kind: "list",
        items: [
          "账户开户、资金转入转出、余额变动。",
          "交易审批、限额校验、风控拦截。",
          "日终对账、清算结算和监管报送。",
        ],
      },
      {
        id: "risks",
        title: "风险点",
        kind: "list",
        items: [
          "资金错账、重复入账和余额不一致。",
          "审批流程绕过或权限失控。",
          "合规字段缺失、报送数据错误。",
        ],
      },
      {
        id: "strategy",
        title: "测试策略",
        kind: "list",
        items: [
          "资金类接口做数据库与日志双重校验。",
          "审批链路覆盖正向、逆向和异常中断。",
          "对账流程做全量比对和异常告警。",
        ],
      },
      {
        id: "outcome",
        title: "可讲成果",
        kind: "list",
        items: [
          "资金对账自动化后，日终核对时间缩短。",
          "审批链路回归覆盖后，绕权问题明显下降。",
          "监管报送字段校验集成到门禁，上线合规风险降低。",
        ],
      },
    ],
  },
  {
    slug: "social-content-project",
    title: "社交/内容项目怎么讲互动、审核和流量分发",
    summary: "围绕内容发布、互动链路、审核机制和推荐分发构建表达。",
    category: "project",
    tags: ["社交", "内容", "审核", "推荐"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "flow",
        title: "业务流程",
        kind: "list",
        items: [
          "内容发布、审核、上架与下架。",
          "点赞、评论、分享、收藏等互动。",
          "推荐分发、流量控制和热点聚合。",
        ],
      },
      {
        id: "risks",
        title: "风险点",
        kind: "list",
        items: [
          "审核漏放敏感内容或误拦正常内容。",
          "互动计数不一致、刷量与恶意请求。",
          "推荐结果偏差、热点误判和流量倾斜。",
        ],
      },
      {
        id: "strategy",
        title: "测试策略",
        kind: "list",
        items: [
          "审核链路覆盖关键词、图片、视频多模态。",
          "互动接口做防刷、幂等和计数一致性校验。",
          "推荐效果做 A/B 回归和流量分发验证。",
        ],
      },
      {
        id: "outcome",
        title: "可讲成果",
        kind: "list",
        items: [
          "审核漏放率下降，审核回归自动化覆盖核心规则。",
          "互动防刷验证上线后，异常刷量被及时拦截。",
          "推荐回归形成标准化对比报告，支持迭代决策。",
        ],
      },
    ],
  },
  {
    slug: "saas-platform-project",
    title: "SaaS 平台项目怎么讲租户隔离和配置扩展",
    summary: "重点体现多租户架构、个性化配置和租户间数据隔离能力。",
    category: "project",
    tags: ["SaaS", "多租户", "配置", "隔离"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "flow",
        title: "业务流程",
        kind: "list",
        items: [
          "租户开通、套餐购买、功能授权。",
          "租户内用户管理、角色配置、业务操作。",
          "租户数据导出、账单生成、续费与停用。",
        ],
      },
      {
        id: "risks",
        title: "风险点",
        kind: "list",
        items: [
          "租户间数据越权访问或泄露。",
          "套餐变更后功能权限与数据边界不一致。",
          "个性化配置冲突、升级后功能丢失。",
        ],
      },
      {
        id: "strategy",
        title: "测试策略",
        kind: "list",
        items: [
          "租户隔离做跨租户数据访问校验。",
          "套餐变更覆盖升级、降级、续费和停用。",
          "配置继承与覆盖做场景组合验证。",
        ],
      },
      {
        id: "outcome",
        title: "可讲成果",
        kind: "list",
        items: [
          "租户隔离自动化后，跨租户越权问题零上线。",
          "套餐变更回归形成标准化清单，支持快速迭代。",
          "配置冲突检测集成到门禁，减少升级故障。",
        ],
      },
    ],
  },
  {
    slug: "mobile-app-project",
    title: "移动端 App 项目怎么讲兼容、性能和推送",
    summary: "围绕设备兼容、网络环境、推送链路和版本升级构建表达。",
    category: "project",
    tags: ["移动端", "兼容性", "推送", "性能"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "flow",
        title: "业务流程",
        kind: "list",
        items: [
          "App 安装、登录、核心业务操作。",
          "推送接收、消息展示、点击跳转。",
          "版本升级、数据迁移和缓存清理。",
        ],
      },
      {
        id: "risks",
        title: "风险点",
        kind: "list",
        items: [
          "机型适配问题、系统版本兼容和屏幕适配。",
          "弱网环境下的超时、重试和状态同步。",
          "推送漏发、重复推送和跳转链路错误。",
        ],
      },
      {
        id: "strategy",
        title: "测试策略",
        kind: "list",
        items: [
          "核心机型做兼容性覆盖，关键功能做真机验证。",
          "弱网场景做超时、重试和降级测试。",
          "推送链路做端到端验证和状态同步检查。",
        ],
      },
      {
        id: "outcome",
        title: "可讲成果",
        kind: "list",
        items: [
          "核心机型兼容性回归后，用户投诉明显下降。",
          "弱网场景验证覆盖后，超时重试机制更稳定。",
          "推送链路自动化后，漏发和重复推送问题减少。",
        ],
      },
    ],
  },
  {
    slug: "data-platform-project",
    title: "数据平台项目怎么讲数据质量与链路稳定性",
    summary: "重点体现数据采集、加工、校验和消费全链路质量保障能力。",
    category: "project",
    tags: ["数据平台", "数据质量", "ETL", "链路"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "flow",
        title: "业务流程",
        kind: "list",
        items: [
          "数据采集、清洗、加工和入库。",
          "数据校验、去重、关联和聚合。",
          "数据消费、报表生成和 API 输出。",
        ],
      },
      {
        id: "risks",
        title: "风险点",
        kind: "list",
        items: [
          "数据丢失、重复入库和字段缺失。",
          "加工链路中断、任务超时和数据倾斜。",
          "报表数据与源数据不一致。",
        ],
      },
      {
        id: "strategy",
        title: "测试策略",
        kind: "list",
        items: [
          "采集链路做数据完整性、格式和时序校验。",
          "加工链路做任务执行、依赖和异常恢复验证。",
          "消费层做报表比对和 API 输出一致性检查。",
        ],
      },
      {
        id: "outcome",
        title: "可讲成果",
        kind: "list",
        items: [
          "数据完整性校验自动化后，入库异常及时发现。",
          "加工链路回归覆盖后，任务中断率下降。",
          "报表比对集成到门禁，数据质量问题上线前拦截。",
        ],
      },
    ],
  },
  {
    slug: "marketing-activity-project",
    title: "营销活动项目怎么讲时间窗口和高并发",
    summary: "围绕活动配置、时间窗口、奖品发放和流量承载构建表达。",
    category: "project",
    tags: ["营销活动", "高并发", "时间窗口", "奖品"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "flow",
        title: "业务流程",
        kind: "list",
        items: [
          "活动创建、规则配置、奖品设置。",
          "活动上线、用户参与、奖品发放。",
          "活动结束、数据统计和奖品补发。",
        ],
      },
      {
        id: "risks",
        title: "风险点",
        kind: "list",
        items: [
          "活动时间窗口配置错误、提前或延后。",
          "高并发下奖品超发、重复发放和库存不一致。",
          "活动规则配置冲突、参与条件遗漏。",
        ],
      },
      {
        id: "strategy",
        title: "测试策略",
        kind: "list",
        items: [
          "时间窗口做边界值、跨时区和续期验证。",
          "奖品发放做幂等、库存扣减和并发压力测试。",
          "活动规则做条件组合和边界场景覆盖。",
        ],
      },
      {
        id: "outcome",
        title: "可讲成果",
        kind: "list",
        items: [
          "活动回归形成标准化模板，上线周期缩短。",
          "奖品发放幂等验证后，超发问题零上线。",
          "高并发压测常态化后，活动承载能力可量化。",
        ],
      },
    ],
  },
  {
    slug: "third-party-integration-project",
    title: "第三方集成项目怎么讲接口契约和异常兜底",
    summary: "重点体现外部接口对接、契约验证、异常处理和补偿能力。",
    category: "project",
    tags: ["第三方集成", "接口契约", "异常处理", "补偿"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "flow",
        title: "业务流程",
        kind: "list",
        items: [
          "接口对接、契约确认、联调测试。",
          "正常调用、响应处理、状态同步。",
          "异常重试、补偿调用、对账核对。",
        ],
      },
      {
        id: "risks",
        title: "风险点",
        kind: "list",
        items: [
          "接口契约变更、字段不兼容和版本不一致。",
          "调用超时、限流拒绝和服务不可用。",
          "响应异常、状态丢失和对账差异。",
        ],
      },
      {
        id: "strategy",
        title: "测试策略",
        kind: "list",
        items: [
          "接口契约做字段比对、版本兼容和变更预警。",
          "异常场景做超时、限流、错误码和降级验证。",
          "补偿链路做重试、补单和对账闭环。",
        ],
      },
      {
        id: "outcome",
        title: "可讲成果",
        kind: "list",
        items: [
          "接口契约校验自动化后，变更对接风险降低。",
          "异常场景回归覆盖后，外部服务故障影响可控。",
          "对账自动化后，第三方数据差异及时发现。",
        ],
      },
    ],
  },
  {
    slug: "microservice-architecture-project",
    title: "微服务架构项目怎么讲链路追踪和服务依赖",
    summary: "围绕服务拆分、链路追踪、依赖管理和故障传播构建表达。",
    category: "project",
    tags: ["微服务", "链路追踪", "服务依赖", "故障传播"],
    difficulty: "interview",
    interviewWeight: 3,
    sections: [
      {
        id: "flow",
        title: "业务流程",
        kind: "list",
        items: [
          "服务拆分、接口定义、依赖梳理。",
          "服务调用、链路追踪、日志聚合。",
          "服务故障、熔断降级、链路恢复。",
        ],
      },
      {
        id: "risks",
        title: "风险点",
        kind: "list",
        items: [
          "服务依赖隐藏、调用链路不透明。",
          "单服务故障导致链路级传播。",
          "版本升级后接口兼容性和依赖冲突。",
        ],
      },
      {
        id: "strategy",
        title: "测试策略",
        kind: "list",
        items: [
          "核心链路做调用链追踪和依赖关系验证。",
          "故障注入做熔断、降级和链路恢复测试。",
          "版本升级做接口兼容性和回归覆盖。",
        ],
      },
      {
        id: "outcome",
        title: "可讲成果",
        kind: "list",
        items: [
          "链路追踪可视化后，问题定位时间缩短。",
          "故障注入常态化后，服务降级策略验证充分。",
          "依赖关系文档化后，升级影响范围可控。",
        ],
      },
    ],
  },
  {
    slug: "legacy-system-refactor-project",
    title: "遗留系统改造项目怎么讲迁移策略和兼容性",
    summary: "重点体现渐进式迁移、兼容性保障、回滚能力和数据同步。",
    category: "project",
    tags: ["遗留系统", "迁移", "兼容性", "回滚"],
    difficulty: "interview",
    interviewWeight: 3,
    sections: [
      {
        id: "flow",
        title: "业务流程",
        kind: "list",
        items: [
          "遗留系统分析、功能梳理、依赖识别。",
          "新旧系统并行、流量切换、数据同步。",
          "遗留系统退服、数据归档、监控收尾。",
        ],
      },
      {
        id: "risks",
        title: "风险点",
        kind: "list",
        items: [
          "新旧系统数据不一致、功能缺失。",
          "流量切换失败、回滚不完整。",
          "遗留依赖遗漏、接口兼容性断裂。",
        ],
      },
      {
        id: "strategy",
        title: "测试策略",
        kind: "list",
        items: [
          "新旧系统做功能对比和数据一致性验证。",
          "流量切换做灰度、回滚和异常恢复测试。",
          "遗留依赖做接口兼容性和回归覆盖。",
        ],
      },
      {
        id: "outcome",
        title: "可讲成果",
        kind: "list",
        items: [
          "新旧系统对比自动化后，迁移差异及时发现。",
          "灰度切换回归形成模板，切换周期缩短。",
          "回滚验证充分后，切换失败影响可控。",
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
  {
    slug: "flash-sale",
    title: "高并发抢购场景题回答骨架",
    summary: "围绕库存一致、限流防刷、订单不超卖和降级兜底组织答案。",
    category: "scenario",
    tags: ["高并发", "抢购", "库存", "限流"],
    difficulty: "interview",
    interviewWeight: 3,
    sections: [
      {
        id: "framework",
        title: "标准回答框架",
        kind: "list",
        items: [
          "先讲业务目标：高并发下库存准确、订单不超卖、用户体验可接受。",
          "再讲风险点：超卖、重复下单、库存与订单不一致、接口超时、缓存穿透。",
          "然后讲测试策略：预热数据校验、并发压测、边界库存场景、降级与回滚验证。",
          "最后补监控兜底：实时库存监控、订单对账、异常告警和补货机制。",
        ],
      },
      {
        id: "high-frequency",
        title: "高频追问",
        kind: "qa-list",
        items: [
          {
            question: "你怎么验证不会超卖？",
            answer: "构造并发请求数量大于库存数量的场景，验证最终订单数不超过库存，且库存扣减一致。",
          },
          {
            question: "缓存库存和数据库库存不一致怎么办？",
            answer: "测试要覆盖预热同步、扣减时一致性检查、异常回滚和定时同步机制，确保最终一致。",
          },
        ],
      },
    ],
  },
  {
    slug: "data-migration",
    title: "数据迁移场景题回答骨架",
    summary: "围绕数据完整性、迁移过程可控、回滚预案和验证闭环组织答案。",
    category: "scenario",
    tags: ["数据迁移", "完整性", "回滚", "验证"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "framework",
        title: "标准回答框架",
        kind: "list",
        items: [
          "先讲迁移目标：数据完整、结构正确、业务无感知或可控停服。",
          "再讲风险点：数据丢失、格式错误、主键冲突、迁移中断、新旧数据不一致。",
          "然后讲测试策略：抽样校验、全量比对、增量迁移验证、回滚演练。",
          "最后补监控兜底：迁移进度监控、异常数据告警、双写验证和灰度切流。",
        ],
      },
      {
        id: "high-frequency",
        title: "高频追问",
        kind: "qa-list",
        items: [
          {
            question: "你怎么验证迁移数据完整性？",
            answer: "按字段级做新旧数据比对，核心字段全量校验，次要字段抽样校验，并补充总数一致性检查。",
          },
          {
            question: "迁移中途失败怎么办？",
            answer: "要有断点续传机制和回滚预案，测试要覆盖中断后重启、部分数据回滚和新旧系统切换。",
          },
        ],
      },
    ],
  },
  {
    slug: "multi-device-sync",
    title: "多端同步场景题回答骨架",
    summary: "围绕数据一致性、冲突处理、同步延迟和离线场景组织答案。",
    category: "scenario",
    tags: ["多端同步", "一致性", "冲突处理", "离线"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "framework",
        title: "标准回答框架",
        kind: "list",
        items: [
          "先讲同步目标：多端数据一致、操作不丢失、冲突可控。",
          "再讲风险点：并发修改冲突、同步延迟、离线操作丢失、版本不一致。",
          "然后讲测试策略：多端并发操作、离线后同步、版本回退、数据覆盖校验。",
          "最后补监控兜底：同步状态监控、冲突告警、版本追踪和人工干预机制。",
        ],
      },
      {
        id: "high-frequency",
        title: "高频追问",
        kind: "qa-list",
        items: [
          {
            question: "多端同时修改同一条数据怎么测？",
            answer: "构造两端同时修改的场景，验证冲突策略（时间戳优先、用户选择、服务端裁决）是否正确执行。",
          },
          {
            question: "离线操作同步后数据错乱怎么办？",
            answer: "测试要覆盖离线增删改同步后的数据完整性，重点校验版本号、时间戳和冲突合并逻辑。",
          },
        ],
      },
    ],
  },
  {
    slug: "config-change",
    title: "配置变更场景题回答骨架",
    summary: "围绕变更可控、生效验证、影响评估和回滚机制组织答案。",
    category: "scenario",
    tags: ["配置变更", "生效验证", "回滚", "影响评估"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "framework",
        title: "标准回答框架",
        kind: "list",
        items: [
          "先讲变更目标：配置正确生效、业务影响可控、可快速回滚。",
          "再讲风险点：配置格式错误、生效范围不一致、变更导致业务异常、灰度发布问题。",
          "然后讲测试策略：配置校验、预发布验证、灰度观察、全量比对。",
          "最后补监控兜底：变更审计、生效监控、异常告警和快速回滚机制。",
        ],
      },
      {
        id: "high-frequency",
        title: "高频追问",
        kind: "qa-list",
        items: [
          {
            question: "你怎么验证配置正确生效？",
            answer: "通过接口查询配置值、日志检查加载结果、业务行为验证和灰度环境比对等多层校验。",
          },
          {
            question: "配置变更导致业务异常怎么快速定位？",
            answer: "要有配置变更时间线、影响范围追踪和业务指标对比，结合日志和告警快速定位问题配置。",
          },
        ],
      },
    ],
  },
  {
    slug: "async-task",
    title: "异步任务场景题回答骨架",
    summary: "围绕任务状态、超时处理、失败重试和结果一致性组织答案。",
    category: "scenario",
    tags: ["异步任务", "状态追踪", "重试", "一致性"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "framework",
        title: "标准回答框架",
        kind: "list",
        items: [
          "先讲任务目标：任务可追踪、结果正确、失败可重试、状态可查询。",
          "再讲风险点：任务丢失、超时无响应、重复执行、状态不一致、消费者异常。",
          "然后讲测试策略：任务生命周期验证、超时重试、失败补偿、并发任务处理。",
          "最后补监控兜底：任务状态监控、积压告警、死信处理和人工补偿机制。",
        ],
      },
      {
        id: "high-frequency",
        title: "高频追问",
        kind: "qa-list",
        items: [
          {
            question: "你怎么验证异步任务最终执行成功？",
            answer: "通过任务状态查询、数据库结果比对、消息投递检查和回调验证，确保任务最终状态正确。",
          },
          {
            question: "任务队列积压怎么处理？",
            answer: "测试要覆盖积压场景下的消费能力、超时处理和告警机制，验证扩容和降级策略有效性。",
          },
        ],
      },
    ],
  },
  {
    slug: "permission-change",
    title: "权限变更场景题回答骨架",
    summary: "围绕权限正确生效、无越权、影响可控和审计追踪组织答案。",
    category: "scenario",
    tags: ["权限变更", "越权", "角色管理", "审计"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "framework",
        title: "标准回答框架",
        kind: "list",
        items: [
          "先讲变更目标：权限正确分配、无越权访问、变更可追溯。",
          "再讲风险点：权限遗漏、越权访问、角色混乱、缓存不一致。",
          "然后讲测试策略：权限矩阵校验、角色切换验证、缓存刷新、边界权限测试。",
          "最后补监控兜底：权限变更审计、越权告警、权限校验日志和异常追踪。",
        ],
      },
      {
        id: "high-frequency",
        title: "高频追问",
        kind: "qa-list",
        items: [
          {
            question: "你怎么验证权限变更后不会越权？",
            answer: "按角色矩阵验证菜单、按钮、接口和数据权限，覆盖变更前后对比和边界角色场景。",
          },
          {
            question: "权限缓存和数据库不一致怎么办？",
            answer: "测试要覆盖缓存刷新时机、缓存失效后重新加载，验证权限变更的实时生效机制。",
          },
        ],
      },
    ],
  },
  {
    slug: "third-party-failure",
    title: "第三方服务故障场景题回答骨架",
    summary: "围绕降级策略、熔断机制、补偿流程和用户体验组织答案。",
    category: "scenario",
    tags: ["第三方服务", "降级", "熔断", "补偿"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "framework",
        title: "标准回答框架",
        kind: "list",
        items: [
          "先讲处理目标：业务不中断、用户感知可控、故障可恢复。",
          "再讲风险点：服务超时、响应错误、熔断触发、数据不一致。",
          "然后讲测试策略：故障注入、超时降级、熔断恢复、补偿重试。",
          "最后补监控兜底：服务健康监控、熔断状态告警、补偿队列和人工干预。",
        ],
      },
      {
        id: "high-frequency",
        title: "高频追问",
        kind: "qa-list",
        items: [
          {
            question: "第三方服务超时你怎么测降级逻辑？",
            answer: "通过模拟超时和错误响应，验证降级策略是否正确触发、用户体验是否可控。",
          },
          {
            question: "熔断恢复后数据不一致怎么办？",
            answer: "测试要覆盖熔断期间数据补偿、恢复后数据比对和人工修复机制，确保最终一致。",
          },
        ],
      },
    ],
  },
  {
    slug: "search-function",
    title: "搜索功能场景题回答骨架",
    summary: "围绕搜索准确性、性能、边界条件和用户体验组织答案。",
    category: "scenario",
    tags: ["搜索", "准确性", "性能", "边界条件"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "framework",
        title: "标准回答框架",
        kind: "list",
        items: [
          "先讲搜索目标：结果准确、响应快速、边界场景可控。",
          "再讲风险点：结果不匹配、排序错误、空结果处理、性能瓶颈、特殊字符。",
          "然后讲测试策略：关键字匹配、排序验证、边界条件、性能压测。",
          "最后补监控兜底：搜索耗时监控、结果分布分析、异常关键字告警。",
        ],
      },
      {
        id: "high-frequency",
        title: "高频追问",
        kind: "qa-list",
        items: [
          {
            question: "你怎么验证搜索结果准确性？",
            answer: "通过已知数据构造搜索关键字，验证结果匹配度、排序正确性和相关性评分。",
          },
          {
            question: "搜索性能下降怎么定位？",
            answer: "结合搜索耗时监控、索引状态检查和查询日志分析，定位是索引问题还是查询逻辑问题。",
          },
        ],
      },
    ],
  },
  {
    slug: "report-export",
    title: "报表导出场景题回答骨架",
    summary: "围绕数据完整性、导出性能、格式正确和边界条件组织答案。",
    category: "scenario",
    tags: ["报表导出", "完整性", "性能", "格式"],
    difficulty: "beginner",
    interviewWeight: 1,
    sections: [
      {
        id: "framework",
        title: "标准回答框架",
        kind: "list",
        items: [
          "先讲导出目标：数据完整、格式正确、性能可控、边界处理。",
          "再讲风险点：数据丢失、格式错误、大文件超时、并发导出冲突。",
          "然后讲测试策略：数据比对、格式验证、大文件导出、并发导出。",
          "最后补监控兜底：导出耗时监控、失败告警、文件完整性校验。",
        ],
      },
      {
        id: "high-frequency",
        title: "高频追问",
        kind: "qa-list",
        items: [
          {
            question: "你怎么验证导出数据与页面展示一致？",
            answer: "通过字段级比对导出文件与页面数据，验证总数、字段值和格式是否一致。",
          },
          {
            question: "大文件导出超时怎么办？",
            answer: "测试要覆盖分批导出、异步导出和导出进度查询机制，验证超时恢复和用户通知。",
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
  {
    slug: "logging-wrapper",
    title: "日志封装题",
    summary: "答题重点是日志分层、上下文完整性和失败定位效率。",
    category: "coding",
    tags: ["日志", "封装", "排障", "自动化"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "core-points",
        title: "回答要点",
        kind: "list",
        items: [
          "日志分层：请求层、业务层、断言层、异常层，每层有清晰的字段设计。",
          "上下文必须包含请求 ID、用例名、环境、时间戳和关键参数。",
          "失败日志要能直接定位问题，不需要二次排查。",
          "日志输出要可切换级别，生产环境不泄露敏感信息。",
        ],
      },
      {
        id: "pitfalls",
        title: "常见失分点",
        kind: "list",
        items: [
          "只写 print 或随意拼接字符串，没有结构化设计。",
          "日志信息不足，失败后需要重新复现才能定位。",
          "敏感数据直接输出到日志文件。",
        ],
      },
    ],
  },
  {
    slug: "data-cleaning",
    title: "数据清洗题",
    summary: "重点展示数据校验、异常处理和结果可追溯性。",
    category: "coding",
    tags: ["数据清洗", "数据处理", "脚本", "测试数据"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "core-points",
        title: "回答要点",
        kind: "list",
        items: [
          "先定义清洗规则：缺失值、异常值、重复值和格式不一致的处理策略。",
          "每条清洗操作要有日志记录，方便追溯数据流向。",
          "异常数据要分类处理：丢弃、修正、标记或人工复核。",
          "清洗结果要有校验步骤，确保输出符合预期格式和约束。",
        ],
      },
      {
        id: "pitfalls",
        title: "常见失分点",
        kind: "list",
        items: [
          "清洗逻辑写在一大段代码里，没有拆分和注释。",
          "没有保留原始数据和清洗日志，出问题无法回溯。",
          "异常数据直接丢弃，不做统计和分析。",
        ],
      },
    ],
  },
  {
    slug: "config-reader",
    title: "配置读取题",
    summary: "答题重点是环境切换、配置校验和敏感信息保护。",
    category: "coding",
    tags: ["配置管理", "环境切换", "封装", "自动化"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "core-points",
        title: "回答要点",
        kind: "list",
        items: [
          "配置按环境拆分：dev、test、staging、production，通过参数或环境变量切换。",
          "配置加载时要做格式校验和必填项检查，避免运行时才发现问题。",
          "敏感配置（密码、密钥）不从代码读取，通过环境变量或密钥管理服务注入。",
          "配置变更要有日志记录，方便追踪环境问题。",
        ],
      },
      {
        id: "pitfalls",
        title: "常见失分点",
        kind: "list",
        items: [
          "配置写死在代码里，无法切换环境。",
          "敏感信息直接写在配置文件。",
          "配置读取失败时没有明确报错，用默认值掩盖问题。",
        ],
      },
    ],
  },
  {
    slug: "test-data-generator",
    title: "测试数据生成题",
    summary: "重点展示数据结构设计、边界覆盖和可复用性。",
    category: "coding",
    tags: ["测试数据", "数据生成", "边界值", "自动化"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "core-points",
        title: "回答要点",
        kind: "list",
        items: [
          "数据生成要支持正向、边界、异常和特殊场景多种模式。",
          "边界数据要覆盖空值、极值、溢出、特殊字符和格式错误。",
          "生成逻辑要参数化，支持批量生成和单条定制。",
          "数据结构用 dataclass 或 TypedDict 定义，保证字段一致性。",
        ],
      },
      {
        id: "pitfalls",
        title: "常见失分点",
        kind: "list",
        items: [
          "只生成正向数据，忽略边界和异常场景。",
          "数据结构不固定，每次手动拼接字段。",
          "生成逻辑写死，无法扩展或复用。",
        ],
      },
    ],
  },
  {
    slug: "report-generator",
    title: "报告生成题",
    summary: "答题重点是报告结构、失败定位信息和可读性设计。",
    category: "coding",
    tags: ["报告", "测试报告", "自动化", "CI/CD"],
    difficulty: "beginner",
    interviewWeight: 1,
    sections: [
      {
        id: "core-points",
        title: "回答要点",
        kind: "list",
        items: [
          "报告要分层：概览层（通过率、耗时）、详情层（失败用例）、日志层（失败上下文）。",
          "失败用例要包含：用例名、输入、预期、实际、错误信息和截图/日志链接。",
          "报告格式要支持 HTML、JSON 或 Markdown，方便 CI 集成和归档。",
          "关键指标（通过率、耗时、失败分布）要可视化展示。",
        ],
      },
      {
        id: "pitfalls",
        title: "常见失分点",
        kind: "list",
        items: [
          "报告只列出通过/失败，没有失败原因和上下文。",
          "报告格式混乱，不支持 CI 集成或历史对比。",
          "失败信息不完整，需要人工二次排查。",
        ],
      },
    ],
  },
  {
    slug: "mock-tool-wrapper",
    title: "Mock 工具封装题",
    summary: "重点展示 Mock 场景划分、响应控制和依赖隔离能力。",
    category: "coding",
    tags: ["Mock", "依赖隔离", "接口测试", "封装"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "core-points",
        title: "回答要点",
        kind: "list",
        items: [
          "Mock 要区分场景：外部依赖不可用、异常响应模拟、性能测试和特定业务状态。",
          "响应控制要支持延迟、错误码、异常结构和字段缺失。",
          "Mock 规则要参数化，支持按请求参数匹配不同响应。",
          "Mock 状态要可查询和清理，避免污染后续测试。",
        ],
      },
      {
        id: "pitfalls",
        title: "常见失分点",
        kind: "list",
        items: [
          "Mock 只模拟正常响应，不覆盖异常和边界场景。",
          "Mock 规则写死，无法适配不同测试用例。",
          "Mock 没有清理机制，导致测试之间相互干扰。",
        ],
      },
    ],
  },
  {
    slug: "async-wait-wrapper",
    title: "异步等待封装题",
    summary: "答题重点是等待策略、超时控制、轮询设计和状态判定。",
    category: "coding",
    tags: ["异步", "等待", "超时", "接口测试"],
    difficulty: "interview",
    interviewWeight: 3,
    sections: [
      {
        id: "core-points",
        title: "回答要点",
        kind: "list",
        items: [
          "区分轮询等待和回调等待两种模式，按业务场景选择。",
          "超时和间隔要可配置，防止无限等待或过于频繁轮询。",
          "等待判定要明确成功、失败和超时三种状态。",
          "等待过程中要有日志输出，方便定位卡顿或延迟问题。",
        ],
      },
      {
        id: "pitfalls",
        title: "常见失分点",
        kind: "list",
        items: [
          "用固定 sleep 等待异步结果，不区分场景和超时。",
          "轮询间隔过短导致资源浪费，过长导致效率低下。",
          "等待失败没有明确状态，用超时掩盖业务异常。",
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
  {
    slug: "common-follow-up-questions",
    title: "面试常见追问整理",
    summary: "整理高频追问方向，提前准备应对策略，避免现场卡壳。",
    category: "roadmap",
    tags: ["追问", "面试技巧", "高频问题", "准备策略"],
    difficulty: "interview",
    interviewWeight: 3,
    sections: [
      {
        id: "project-deep-dive",
        title: "项目深挖类追问",
        kind: "qa-list",
        items: [
          {
            question: "这个项目最大的技术难点是什么？",
            answer: "准备一个具体问题、分析过程、解决方案和验证结果的完整故事。",
          },
          {
            question: "如果让你重新设计，会有什么改进？",
            answer: "准备 2-3 个可改进点，说明原因和预期收益，体现反思深度。",
          },
          {
            question: "项目中遇到的最大失败是什么？",
            answer: "选择一个可控的失败案例，强调复盘和改进措施。",
          },
        ],
      },
      {
        id: "tech-challenge",
        title: "技术挑战类追问",
        kind: "qa-list",
        items: [
          {
            question: "你提到的这个技术方案有什么缺点？",
            answer: "诚实说明局限性，同时补充取舍原因或改进方向。",
          },
          {
            question: "如果数据量翻倍，你的方案会有什么问题？",
            answer: "提前准备扩展性分析，说明瓶颈点和应对策略。",
          },
          {
            question: "为什么选 A 方案而不是 B 方案？",
            answer: "从成本、团队能力、时间窗口、风险等多维度对比说明。",
          },
        ],
      },
      {
        id: "behavioral-questions",
        title: "行为类追问",
        kind: "qa-list",
        items: [
          {
            question: "你如何处理和开发的分歧？",
            answer: "准备一个具体案例，强调数据驱动、沟通技巧和结果导向。",
          },
          {
            question: "你如何推动质量改进？",
            answer: "说明问题发现、方案设计、利益相关方沟通和落地的完整过程。",
          },
          {
            question: "你最大的成长是什么？",
            answer: "选择一个有具体变化的成长点，说明触发原因、学习过程和实际应用。",
          },
        ],
      },
    ],
  },
  {
    slug: "interview-expression-training",
    title: "面试表达训练指南",
    summary: "把知识转化成能说出来的话，避免知道但说不清的尴尬。",
    category: "roadmap",
    tags: ["表达训练", "面试技巧", "沟通", "自我展示"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "expression-principles",
        title: "表达原则",
        kind: "list",
        items: [
          "结构优先：先说结论再说原因，先说整体再说细节。",
          "故事化：用背景、问题、方案、结果四段式组织表达。",
          "数据化：用数字、比例、对比强化说服力。",
          "口语化：提前练习口述，避免书面语堆砌。",
        ],
      },
      {
        id: "training-methods",
        title: "训练方法",
        kind: "list",
        items: [
          "录音复盘：录下自己的回答，听 3 遍，每次找一个改进点。",
          "模拟追问：每准备一个回答，预想 3 个追问并准备回应。",
          "限时练习：用手机计时，控制每个问题 1-2 分钟内讲完。",
          "同伴互问：找朋友扮演面试官，体验真实压力。",
        ],
      },
      {
        id: "common-problems",
        title: "常见问题与修正",
        kind: "qa-list",
        items: [
          {
            question: "回答太长、跑题怎么办？",
            answer: "每个问题准备一个 30 秒精简版和一个 2 分钟展开版。",
          },
          {
            question: "临时忘词怎么办？",
            answer: "准备过渡语：\"这个问题我分三点来说...\"，给自己思考时间。",
          },
          {
            question: "被追问时紧张怎么办？",
            answer: "承认不确定：\"这个细节我需要确认，但我理解的是...\"，诚实比乱编好。",
          },
        ],
      },
    ],
  },
  {
    slug: "resume-key-points",
    title: "简历要点提炼",
    summary: "把经历转化成有说服力的简历内容，提高面试邀请率。",
    category: "roadmap",
    tags: ["简历", "求职", "自我展示", "面试准备"],
    difficulty: "beginner",
    interviewWeight: 2,
    sections: [
      {
        id: "resume-structure",
        title: "简历结构建议",
        kind: "list",
        items: [
          "个人信息：姓名、联系方式、求职意向，控制 3 行以内。",
          "技能摘要：列出 5-8 项核心技能，与岗位 JD 匹配。",
          "工作经历：按时间倒序，每家公司 2-4 条核心产出。",
          "项目经历：选择 2-3 个重点项目，突出职责和成果。",
        ],
      },
      {
        id: "project-description",
        title: "项目描述要点",
        kind: "list",
        items: [
          "用 STAR 法则：背景、任务、行动、结果四段描述。",
          "量化成果：用百分比、数量、时间等数据支撑。",
          "突出个人贡献：避免团队成果和个人贡献混为一谈。",
          "技术关键词：埋入面试想被问到的技术点。",
        ],
      },
      {
        id: "avoid-mistakes",
        title: "常见错误",
        kind: "list",
        items: [
          "堆砌关键词：写了但被问倒，不如不写。",
          "空泛描述：\"参与测试\" 无法体现价值，改成具体产出。",
          "格式混乱：字体、间距、对齐保持一致，体现专业性。",
          "过时信息：3 年以上的项目一笔带过，聚焦近期成果。",
        ],
      },
    ],
  },
  {
    slug: "mock-interview-process",
    title: "模拟面试流程",
    summary: "通过模拟面试发现盲点，提前适应面试节奏和压力。",
    category: "roadmap",
    tags: ["模拟面试", "面试准备", "练习", "实战演练"],
    difficulty: "interview",
    interviewWeight: 2,
    sections: [
      {
        id: "mock-steps",
        title: "模拟面试步骤",
        kind: "list",
        items: [
          "准备阶段：整理目标岗位 JD，列出 10-15 个可能被问到的问题。",
          "执行阶段：找一个朋友或同事扮演面试官，严格按真实流程走。",
          "记录阶段：请模拟面试官记录回答中的卡顿、遗漏和逻辑问题。",
          "复盘阶段：针对薄弱点补充准备，形成改进清单。",
        ],
      },
      {
        id: "mock-types",
        title: "模拟形式选择",
        kind: "list",
        items: [
          "同行互问：技术深度够，能发现盲点，但可能不够严格。",
          "前辈指导：经验丰富，能给出职业建议，资源较难获取。",
          "录音自测：成本低，可反复练习，但缺少压力模拟。",
          "AI 模拟：随时可用，可覆盖多领域问题，但交互体验有限。",
        ],
      },
      {
        id: "focus-areas",
        title: "模拟重点",
        kind: "list",
        items: [
          "自我介绍：控制在 1-2 分钟，内容与岗位相关。",
          "项目讲解：准备一个核心项目的完整讲述，能应对追问。",
          "技术问答：覆盖简历上提到的技术栈，确保能展开说明。",
          "行为问题：准备 2-3 个团队协作、冲突处理的案例。",
        ],
      },
    ],
  },
  {
    slug: "interview-review-method",
    title: "面试复盘方法",
    summary: "把每次面试变成学习机会，持续优化表现，提高通过率。",
    category: "roadmap",
    tags: ["复盘", "面试技巧", "持续改进", "经验积累"],
    difficulty: "beginner",
    interviewWeight: 1,
    sections: [
      {
        id: "review-timing",
        title: "复盘时机",
        kind: "list",
        items: [
          "即时复盘：面试结束后立即记录，趁记忆清晰写下关键问题。",
          "当日复盘：当天晚上整理笔记，补充细节和情绪记录。",
          "周期复盘：每周或每两周回顾所有面试记录，找共同问题。",
        ],
      },
      {
        id: "review-dimensions",
        title: "复盘维度",
        kind: "list",
        items: [
          "问题记录：把没答好或没答上来的问题记下来。",
          "回答分析：哪些回答可以更简洁，哪些可以更深入。",
          "状态评估：紧张程度、语速控制、眼神交流等软技能。",
          "面试官反馈：注意面试官的追问方向和表情变化。",
        ],
      },
      {
        id: "improvement-actions",
        title: "改进行动",
        kind: "list",
        items: [
          "建立问题库：把每次面试的问题整理成清单，持续更新答案。",
          "针对性补强：对薄弱知识点专项学习，补充到知识体系。",
          "迭代表达：优化讲不清楚的部分，形成标准回答模板。",
          "心态调整：分析紧张原因，下次提前做好心理准备。",
        ],
      },
      {
        id: "review-template",
        title: "复盘记录模板",
        kind: "list",
        items: [
          "公司/岗位/日期：基础信息记录。",
          "面试轮次：一面/二面/HR 面，标注重点问题。",
          "表现自评：1-5 分打分，标注亮点和失分点。",
          "待改进项：具体的行动计划，优先级排序。",
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
  {
    slug: "ai-testcase-design",
    title: "AI 辅助用例设计",
    summary: "用 AI 扩展思维边界、发现遗漏场景，但最终用例质量由测试人员把关。",
    category: "ai-learning",
    tags: ["AI", "用例设计", "测试思维", "效率"],
    difficulty: "interview",
    interviewWeight: 3,
    learningGoal: "学会用 AI 辅助头脑风暴、边界挖掘和场景覆盖，同时建立人工复核机制。",
    whyNow: "用例设计是测试核心能力，AI 能帮你跳出惯性思维，发现遗漏场景。",
    learningSteps: [
      "把需求文档或接口定义输入 AI，让它列出可能的测试维度。",
      "用 AI 生成边界值、异常组合和场景矩阵，作为人工补充的起点。",
      "建立用例评审检查清单，确保 AI 建议都经过业务判断。",
    ],
    practicalUseCases: [
      "根据 PRD 自动生成功能点检查清单。",
      "输入接口参数，AI 反推异常输入组合。",
      "对现有用例集做覆盖分析，找出薄弱点。",
    ],
    commonMistakes: [
      "把 AI 输出的用例直接当最终版本，不做业务过滤。",
      "只用 AI 生成正向场景，忽略异常和边界。",
      "没有保存提示词模板，导致结果不可复现。",
    ],
    interviewTalkingPoints: [
      "强调 AI 是用例设计的放大器，不是替代品。",
      "举例说明 AI 帮你发现过一个容易被遗漏的边界场景。",
      "说明你如何用规则或检查清单来约束 AI 输出质量。",
    ],
  },
  {
    slug: "ai-code-review",
    title: "AI 辅助代码 Review",
    summary: "让 AI 做第一轮静态扫描和规范检查，把深度逻辑问题留给人工。",
    category: "ai-learning",
    tags: ["AI", "代码审查", "质量门禁", "效率"],
    difficulty: "interview",
    interviewWeight: 2,
    learningGoal: "把 AI 接入代码评审流程，提效基础问题发现，同时保留人工判断核心逻辑。",
    whyNow: "代码量增长快，人工 Review 精力有限，AI 能帮扫掉大量低级问题。",
    learningSteps: [
      "配置 AI 做命名规范、注释完整性和简单逻辑扫描。",
      "定义 AI Review 的输出模板，区分建议和必须修复。",
      "在 CI 流水线中先跑 AI 检查，通过后再进入人工评审。",
    ],
    practicalUseCases: [
      "自动检查测试代码的断言完整性和命名规范。",
      "扫描测试框架中的硬编码数据和重复代码。",
      "对公共工具函数做文档完整性检查。",
    ],
    commonMistakes: [
      "把 AI 评价当成最终评审结论。",
      "没有过滤敏感信息就把代码发给外部 AI。",
      "AI Review 结果堆积太多，团队不再关注。",
    ],
    interviewTalkingPoints: [
      "说明你把 AI 用于第一轮基础检查，人工专注于业务逻辑和设计问题。",
      "举例 AI 发现过的一个有效问题和一次误报。",
      "强调数据安全和敏感代码的处理方式。",
    ],
  },
  {
    slug: "ai-doc-generation",
    title: "AI 辅助文档生成",
    summary: "用 AI 生成文档初稿，人工精修结构和关键表述，降低文档维护负担。",
    category: "ai-learning",
    tags: ["AI", "文档", "知识管理", "效率"],
    difficulty: "beginner",
    interviewWeight: 2,
    learningGoal: "学会用 AI 加速文档创建和更新，同时保持文档的准确性和可读性。",
    whyNow: "测试文档更新频繁但优先级常被压后，AI 能显著降低维护成本。",
    learningSteps: [
      "用 AI 根据代码注释、测试用例或会话记录生成文档初稿。",
      "人工审核业务术语、流程描述和关键结论。",
      "建立文档模板和更新流程，确保 AI 输出符合团队规范。",
    ],
    practicalUseCases: [
      "从测试用例自动生成测试计划和测试报告。",
      "根据 API 定义生成交互文档和示例。",
      "从会议纪要提取行动项并生成跟踪文档。",
    ],
    commonMistakes: [
      "直接发布 AI 生成的文档不做审核。",
      "文档风格不统一，缺乏团队模板约束。",
      "只生成不更新，文档很快过时。",
    ],
    interviewTalkingPoints: [
      "强调 AI 是文档提效工具，不是免责借口。",
      "说明你如何定义文档模板和质量标准。",
      "举例 AI 帮你快速完成过一次文档更新任务。",
    ],
  },
  {
    slug: "ai-performance-testing",
    title: "AI 在性能测试中的应用",
    summary: "用 AI 辅助场景建模、结果分析和瓶颈定位，提升性能测试效率。",
    category: "ai-learning",
    tags: ["AI", "性能测试", "瓶颈分析", "效率"],
    difficulty: "interview",
    interviewWeight: 2,
    learningGoal: "掌握 AI 在性能测试各环节的辅助用法，从场景设计到结果解读。",
    whyNow: "性能测试场景复杂、数据量大，AI 能帮助快速定位规律和异常。",
    learningSteps: [
      "用 AI 根据业务模型生成压测场景配置初稿。",
      "让 AI 分析性能监控数据，识别异常模式和瓶颈迹象。",
      "建立 AI 辅助报告，但由人工给出最终优化建议。",
    ],
    practicalUseCases: [
      "根据业务峰值预测生成压测参数组合。",
      "对响应时间分布做聚类分析，快速定位异常请求。",
      "从历史性能报告总结回归趋势。",
    ],
    commonMistakes: [
      "把 AI 的瓶颈判断当最终结论，不做人工验证。",
      "忽略性能测试特有的数据敏感性和隐私问题。",
      "对 AI 输出过度依赖，不学习性能分析基础技能。",
    ],
    interviewTalkingPoints: [
      "说明你用 AI 加速了哪些性能测试环节。",
      "举一个 AI 帮你发现性能规律的真实案例。",
      "强调性能问题最终需要人工结合架构来判断。",
    ],
    relatedSlugs: ["performance-testing"],
  },
  {
    slug: "testdev-ai-tools",
    title: "测试开发学习 AI 工具推荐",
    summary: "精选测试开发日常工作中的 AI 工具场景，从提效到能力拓展。",
    category: "ai-learning",
    tags: ["AI", "工具", "学习路径", "效率"],
    difficulty: "beginner",
    interviewWeight: 1,
    learningGoal: "建立测试开发场景下的 AI 工具地图，知道什么场景用什么工具。",
    whyNow: "AI 工具层出不穷，需要聚焦与测试开发工作直接相关的场景。",
    learningSteps: [
      "先用通用 AI 助手（如 Claude、ChatGPT）辅助文档、代码和测试场景设计。",
      "探索测试专用 AI 工具：用例生成、日志分析、缺陷预测等。",
      "建立个人 AI 工具清单，记录每个工具的适用场景和局限性。",
    ],
    practicalUseCases: [
      "用 AI 助手解释陌生框架代码或编写测试脚本片段。",
      "用 AI 日志分析工具快速定位失败原因聚类。",
      "用 AI 代码补全加速测试工具开发。",
    ],
    commonMistakes: [
      "追新工具不追效果，工具箱太多反而低效。",
      "只把 AI 当搜索引擎用，没有嵌进工作流。",
      "忽略工具的数据隐私和合规要求。",
    ],
    interviewTalkingPoints: [
      "列举 2 到 3 个你实际用过的 AI 工具和效果。",
      "说明你如何选择 AI 工具：场景匹配、团队协作、数据安全。",
      "表达对新工具的学习态度，但强调以解决问题为导向。",
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
  {
    slug: "mock-service-template",
    title: "Mock 服务搭建模板",
    summary: "适合练习独立 Mock 服务设计、契约测试和服务虚拟化能力。",
    category: "practice-template",
    tags: ["模板", "Mock", "服务虚拟化", "接口测试"],
    difficulty: "beginner",
    interviewWeight: 2,
    templateType: "engineering",
    targetScenario: "搭建一个可供前后端并行开发、测试隔离的 Mock 服务，支持动态响应和状态管理。",
    includes: [
      "路由配置、请求匹配规则和响应模板。",
      "状态管理与场景切换机制。",
      "契约校验与文档同步方案。",
    ],
    howToUse: [
      "选一个熟悉业务域，定义 5 到 10 个核心接口。",
      "从静态响应开始，逐步加入延迟模拟、异常场景。",
      "接入团队项目，验证前后端联调效率提升。",
    ],
    extensionIdeas: [
      "加入请求记录和回放功能。",
      "支持 WebSocket 或 GraphQL Mock。",
      "与 CI 流水线集成，实现自动化契约测试。",
    ],
  },
  {
    slug: "performance-test-template",
    title: "性能测试项目模板",
    summary: "适合练习性能测试策略设计、脚本编写和结果分析全流程。",
    category: "practice-template",
    tags: ["模板", "性能测试", "JMeter", "压测"],
    difficulty: "interview",
    interviewWeight: 3,
    templateType: "engineering",
    targetScenario: "从需求分析到报告输出，完成一个完整的性能测试项目骨架。",
    includes: [
      "性能需求分析与测试策略模板。",
      "脚本结构设计、数据参数化和场景编排。",
      "监控采集、指标分析和报告输出框架。",
    ],
    howToUse: [
      "选择一个有公开 API 的系统或自建服务作为压测目标。",
      "先覆盖基准测试和负载测试两种场景。",
      "重点关注瓶颈定位和优化建议的表达。",
    ],
    extensionIdeas: [
      "加入容量规划和风险预警机制。",
      "设计自动化性能回归流程。",
      "结合 APM 工具做深度根因分析。",
    ],
  },
  {
    slug: "test-data-factory-template",
    title: "测试数据工厂模板",
    summary: "适合练习测试数据管理策略、工厂模式设计和数据隔离方案。",
    category: "practice-template",
    tags: ["模板", "测试数据", "数据工厂", "自动化"],
    difficulty: "beginner",
    interviewWeight: 2,
    templateType: "engineering",
    targetScenario: "构建一套可复用、易维护的测试数据生产和管理体系。",
    includes: [
      "数据模型抽象与工厂类设计。",
      "预置数据、动态生成和清理策略。",
      "多环境数据隔离与版本控制。",
    ],
    howToUse: [
      "梳理测试中需要的数据实体和关联关系。",
      "从 Builder 模式入手，封装常用数据构造方法。",
      "在自动化脚本中验证数据准备和清理链路。",
    ],
    extensionIdeas: [
      "引入数据池和复用机制减少创建开销。",
      "支持数据快照和回滚能力。",
      "与 Mock 服务联动，实现端到端数据仿真。",
    ],
  },
  {
    slug: "interview-answer-skeleton-template",
    title: "面试回答骨架模板",
    summary: "帮助把零散知识点串成有结构、有亮点的回答表达。",
    category: "practice-template",
    tags: ["模板", "面试技巧", "表达结构", "自我介绍"],
    difficulty: "beginner",
    interviewWeight: 3,
    templateType: "interview",
    targetScenario: "用于组织技术面试中的常见题型回答，确保逻辑清晰、亮点突出。",
    includes: [
      "开场定义：一句话概括核心概念。",
      "展开说明：原理、场景和关键细节。",
      "举例落地：项目中的实际应用。",
      "总结升华：踩过的坑或改进思考。",
    ],
    howToUse: [
      "选一个高频问题，按骨架填空形成初版回答。",
      "计时练习，控制在 1 到 2 分钟内说完。",
      "根据追问场景准备扩展点。",
    ],
    extensionIdeas: [
      "针对不同难度问题准备简版和详版。",
      "增加数据支撑和指标量化。",
      "补充团队协作和软技能维度。",
    ],
  },
  {
    slug: "project-difficulty-template",
    title: "项目难点表达模板",
    summary: "帮助把技术挑战、解决思路和成果串成完整故事线。",
    category: "practice-template",
    tags: ["模板", "项目表达", "面试", "技术难点"],
    difficulty: "interview",
    interviewWeight: 3,
    templateType: "interview",
    targetScenario: "用于面试中描述项目难点，展示问题分析和解决能力。",
    includes: [
      "难点背景：什么场景下遇到的问题。",
      "挑战点：技术复杂度或约束条件。",
      "分析思路：排查过程和备选方案。",
      "解决路径：最终方案和实施步骤。",
      "结果复盘：收益指标和经验沉淀。",
    ],
    howToUse: [
      "从真实项目中提炼 2 到 3 个有深度的难点。",
      "每个难点控制在 2 分钟内讲完核心逻辑。",
      "准备数据支撑和技术细节的追问应对。",
    ],
    extensionIdeas: [
      "增加技术选型的权衡说明。",
      "补充团队协作和沟通推进维度。",
      "与面试官形成技术讨论而非单方面输出。",
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

// 首页高频问题引导数据
const homeQuestionGuides: HomeQuestionGuide[] = [
  {
    slug: "api-testing",
    ask: "接口测试到底测什么，怎么证明你测得够深？",
    answerLead: "先讲分层思路：协议层、业务层、副作用层，再结合幂等、重试、对账讲具体案例。",
  },
  {
    slug: "payment-callback",
    ask: "支付回调一出问题就紧张，你怎么设计测试用例让它稳得住？",
    answerLead: "先讲幂等键和状态推进，再讲重复回放、超时重发和异常补偿的验证覆盖。",
  },
  {
    slug: "pytest",
    ask: "Pytest 不只是写脚本，你怎么用它搭起可维护的自动化体系？",
    answerLead: "先讲 Fixture 作用域和依赖管理，再讲参数化、钩子和分层目录组织。",
  },
  {
    slug: "playwright",
    ask: "Playwright 好上手，但你怎么用它搭起真正落地的 UI 自动化？",
    answerLead: "先讲 Page Object 设计和稳定性策略，再讲与 CI 集成和失败定位效率。",
  },
  {
    slug: "idempotency",
    ask: "幂等到底在防什么，测试时怎么证明它真的生效？",
    answerLead: "先给支付或消息重复消费场景，再讲唯一键、状态推进和重复请求回放验证。",
  },
  {
    slug: "ci-cd",
    ask: "CI/CD 在测试开发里不只是跑脚本，那你们的质量门禁怎么设计？",
    answerLead: "先讲提测、合并、发布前三层门禁，再讲失败反馈、分级阻断和灰度兜底。",
  },
];

export function getHomeQuestionGuides(): HomeQuestionGuide[] {
  return homeQuestionGuides;
}

