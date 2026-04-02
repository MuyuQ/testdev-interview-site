import type { TopicSelfTests } from "./types";

export const selfTestData: TopicSelfTests[] = [
  {
    topicSlug: "api-assertion",
    questions: [
      {
        id: "api-assertion-1",
        topicSlug: "api-assertion",
        question: "接口断言只校验 HTTP 状态码 200 是否足够？",
        options: [
          "足够，200 表示请求成功",
          "不够，还需要校验响应体字段和业务副作用",
          "足够，其他校验是多余的",
          "看情况，有时足够有时不够",
        ],
        correctIndex: 1,
        explanation: "HTTP 200 只表示请求到达服务器并返回成功，不代表业务逻辑正确。真正的断言要覆盖响应体字段、数据库状态、消息投递等多层副作用。",
      },
      {
        id: "api-assertion-2",
        topicSlug: "api-assertion",
        question: "断言分层设计中，'链路断言'主要校验什么？",
        options: [
          "HTTP 状态码和响应结构",
          "响应体字段值",
          "数据库状态、缓存、消息投递等副作用",
          "接口响应时间",
        ],
        correctIndex: 2,
        explanation: "链路断言校验数据库状态、缓存一致性、消息队列投递、外部调用记录等跨系统的副作用，是断言分层的第三层。",
      },
      {
        id: "api-assertion-3",
        topicSlug: "api-assertion",
        question: "遇到响应结构经常变化时，如何保证断言稳定？",
        options: [
          "每次变化都修改断言代码",
          "只断言关键业务字段，用字段路径访问",
          "不做断言，只检查状态码",
          "使用固定数组下标访问字段",
        ],
        correctIndex: 1,
        explanation: "只断言关键业务字段、使用字段路径（如 JSONPath）而非固定位置、用 schema 校验替代字段逐个断言，可以让断言与具体结构解耦。",
      },
    ],
  },
  {
    topicSlug: "idempotency",
    questions: [
      {
        id: "idempotency-1",
        topicSlug: "idempotency",
        question: "支付回调为什么必须做幂等？",
        options: [
          "为了提高性能",
          "防止网络重试导致重复扣款或发货",
          "满足审计要求",
          "简化代码逻辑",
        ],
        correctIndex: 1,
        explanation: "支付网关发送回调后，如果没收到确认响应会自动重试。如果回调不做幂等，重复回调会导致重复扣款、重复发货，造成资损。",
      },
      {
        id: "idempotency-2",
        topicSlug: "idempotency",
        question: "以下哪个最适合作为幂等键？",
        options: [
          "用户 ID",
          "订单号或支付流水号",
          "当前时间戳",
          "随机字符串",
        ],
        correctIndex: 1,
        explanation: "幂等键需要具备业务唯一性和跨系统一致性。订单号、支付流水号是业务生成的全局唯一标识，天然适合做幂等键。",
      },
      {
        id: "idempotency-3",
        topicSlug: "idempotency",
        question: "消息重复消费的测试，主要验证什么？",
        options: [
          "消息能否被消费",
          "消息消费速度",
          "重复消费时数据不重复写入、状态不重复变更",
          "消息格式是否正确",
        ],
        correctIndex: 2,
        explanation: "消息幂等测试核心是验证重复消费时副作用是否可控：数据库记录不重复、状态不重复变更、外部调用只发生一次。",
      },
    ],
  },
  {
    topicSlug: "fixture",
    questions: [
      {
        id: "fixture-1",
        topicSlug: "fixture",
        question: "Pytest 中 session 级和 function 级 Fixture 的主要区别是什么？",
        options: [
          "session 级更快，function 级更慢",
          "session 级整个测试会话只初始化一次，function 级每个测试都初始化",
          "session 级只能用于数据库，function 级通用",
          "没有区别，只是名称不同",
        ],
        correctIndex: 1,
        explanation: "session 级 Fixture 整个测试会话只初始化一次，适合高成本的共享资源；function 级每个测试都重新初始化，适合需要隔离的测试数据。",
      },
      {
        id: "fixture-2",
        topicSlug: "fixture",
        question: "Fixture 嵌套过深会导致什么问题？",
        options: [
          "运行速度变快",
          "依赖关系难以追踪，阅读成本高",
          "测试结果更准确",
          "内存占用减少",
        ],
        correctIndex: 1,
        explanation: "Fixture 嵌套层级过多会让依赖关系难以追踪，代码阅读和维护成本高。建议控制嵌套深度在 2-3 层。",
      },
      {
        id: "fixture-3",
        topicSlug: "fixture",
        question: "Fixture 应该专注于什么？",
        options: [
          "复杂的业务逻辑处理",
          "环境准备和资源管理",
          "测试结果断言",
          "测试报告生成",
        ],
        correctIndex: 1,
        explanation: "Fixture 应专注于环境准备和资源管理（如登录态、数据库连接、浏览器实例），不混入业务逻辑，业务数据准备放在测试代码或 helper 函数中。",
      },
    ],
  },
  {
    topicSlug: "smoke-testing",
    questions: [
      {
        id: "smoke-1",
        topicSlug: "smoke-testing",
        question: "冒烟测试的主要目的是什么？",
        options: [
          "发现所有 Bug",
          "验证基本功能可用，快速判断版本是否可测",
          "测试性能指标",
          "测试安全性",
        ],
        correctIndex: 1,
        explanation: "冒烟测试的目的是快速验证基本功能是否可用，判断版本是否具备可测性，而不是发现所有 Bug。它是发布前的第一道门槛。",
      },
      {
        id: "smoke-2",
        topicSlug: "smoke-testing",
        question: "冒烟测试用例应该覆盖什么？",
        options: [
          "所有功能点",
          "核心业务主流程和关键路径",
          "边缘场景和异常情况",
          "UI 样式细节",
        ],
        correctIndex: 1,
        explanation: "冒烟测试用例应覆盖核心业务主流程和关键路径，如登录、下单、支付等主流程，不追求覆盖所有功能点。",
      },
    ],
  },
  {
    topicSlug: "regression-testing",
    questions: [
      {
        id: "regression-1",
        topicSlug: "regression-testing",
        question: "回归测试的主要目的是什么？",
        options: [
          "测试新功能",
          "验证修改后的代码没有影响原有功能",
          "测试性能",
          "测试用户体验",
        ],
        correctIndex: 1,
        explanation: "回归测试的目的是验证代码修改后，原有功能仍然正常工作，确保新改动没有引入新的问题（回归 Bug）。",
      },
      {
        id: "regression-2",
        topicSlug: "regression-testing",
        question: "如何提高回归测试的效率？",
        options: [
          "每次都执行全部测试用例",
          "只测试新功能",
          "自动化测试 + 按风险选择测试范围",
          "减少测试用例数量",
        ],
        correctIndex: 2,
        explanation: "提高回归效率的方法包括：自动化测试覆盖高频场景、按风险选择回归范围（关联功能优先）、分层回归（核心流程全量、其他抽样）。",
      },
    ],
  },
  {
    topicSlug: "pytest",
    questions: [
      {
        id: "pytest-1",
        topicSlug: "pytest",
        question: "Pytest 相比 unittest 的核心优势是什么？",
        options: [
          "Pytest 运行速度更快",
          "Pytest 无需继承 TestCase 类，用普通函数和 assert 语句即可写测试",
          "Pytest 只支持 Python 3.x，unittest 支持 Python 2.x",
          "Pytest 有官方支持，unittest 是社区维护",
        ],
        correctIndex: 1,
        explanation: "Pytest 的核心理念是「简单优先」，不需要继承任何基类，普通的 assert 语句就能自动生成详细的失败报告。相比 unittest，代码量通常减少 30%-50%，可读性更高。",
      },
      {
        id: "pytest-2",
        topicSlug: "pytest",
        question: "测试用例需要覆盖多组参数组合时，应该用什么方式实现？",
        options: [
          "写多个测试函数，每个函数测一组参数",
          "在测试函数内部用 for 循环遍历参数",
          "使用 @pytest.mark.parametrize 装饰器实现参数化",
          "使用 unittest 的 subTest 机制",
        ],
        correctIndex: 2,
        explanation: "@pytest.mark.parametrize 是 Pytest 内置的参数化机制，一行代码就能生成多组用例，每组参数独立执行、独立报告结果。相比 for 循环，参数化用例失败时能定位到具体哪组参数出错。",
      },
      {
        id: "pytest-3",
        topicSlug: "pytest",
        question: "conftest.py 文件应该放在什么位置？它的作用是什么？",
        options: [
          "放在项目根目录，只用于配置 pytest.ini",
          "放在 tests 目录下，用于定义共享 Fixture，子目录可自动继承",
          "放在任意位置，用命令行参数指定路径",
          "放在每个测试文件同级目录，只对当前文件生效",
        ],
        correctIndex: 1,
        explanation: "conftest.py 放在 tests 目录下，定义的 Fixture 对该目录及子目录下的所有测试生效，无需显式导入。这是 Pytest 的共享机制，适合存放登录态、数据库连接等公共资源初始化。",
      },
    ],
  },
  {
    topicSlug: "playwright",
    questions: [
      {
        id: "playwright-1",
        topicSlug: "playwright",
        question: "Playwright 相比 Selenium 的核心优势是什么？",
        options: [
          "Playwright 支持更多浏览器类型",
          "Playwright 内置自动等待机制，元素可操作时才执行，无需手动处理等待",
          "Playwright 是 Google 开发的，更权威",
          "Playwright 只支持 JavaScript，学习成本更低",
        ],
        correctIndex: 1,
        explanation: "Playwright 内置自动等待解决了 UI 自动化最头疼的元素不稳定问题，减少 80% 以上的显式等待代码。它直接与浏览器通信而非依赖 WebDriver 协议，因此更快更稳定。",
      },
      {
        id: "playwright-2",
        topicSlug: "playwright",
        question: "Page Object 模式中，方法命名应该遵循什么原则？",
        options: [
          "用底层操作命名，如 fillUsername()、clickButton()",
          "用业务动作命名，如 login()、addToCart()、checkout()",
          "用 CSS 选择器命名，如 clickSubmitBtn()",
          "用测试用例编号命名，如 step1()、step2()",
        ],
        correctIndex: 1,
        explanation: "Page Object 的方法是业务动作而非底层操作，用 login() 而不是 fillUsername() + fillPassword()。这样测试用例只关心业务流程，不关心实现细节，选择器变化只需修改 Page Object 一处。",
      },
      {
        id: "playwright-3",
        topicSlug: "playwright",
        question: "处理异步场景（如文件上传后等待处理完成）时，推荐什么等待策略？",
        options: [
          "使用固定 sleep 等待足够长时间",
          "无限循环等待直到结果出现",
          "监听 API 响应（page.waitForResponse）或等待 UI 状态变化",
          "不做等待，直接断言结果",
        ],
        correctIndex: 2,
        explanation: "Playwright 的自动等待只覆盖元素可见可点击，业务层面的状态需要显式等待。推荐监听 API 响应（page.waitForResponse）或等待 UI 状态变化（进度条消失、成功提示出现），比 sleep 更稳定更快。",
      },
    ],
  },
  {
    topicSlug: "api-testing",
    questions: [
      {
        id: "api-testing-1",
        topicSlug: "api-testing",
        question: "接口断言只验证 HTTP 状态码 200 是否足够？",
        options: [
          "足够，200 表示业务成功",
          "不够，需要覆盖响应体字段、数据库状态等业务结果",
          "看情况，有时足够有时不够",
          "足够，状态码是接口测试的核心",
        ],
        correctIndex: 1,
        explanation: "HTTP 200 只代表请求到达服务器并被处理，不代表业务逻辑正确。真正的断言要分层：协议层（状态码、响应结构）、业务层（字段值、状态流转）、链路层（数据库、缓存、消息队列等副作用）。",
      },
      {
        id: "api-testing-2",
        topicSlug: "api-testing",
        question: "异步接口（如提交退款申请后异步处理）的测试应该怎么验证？",
        options: [
          "只验证同步响应返回成功即可",
          "验证同步响应后，轮询查询最终状态或监听回调通知",
          "不需要测试异步接口",
          "用 sleep 等待足够时间后直接断言",
        ],
        correctIndex: 1,
        explanation: "异步接口返回成功只代表「请求已接收」，不代表「处理已完成」。需要验证同步响应正确后，通过轮询查询或监听回调验证最终状态（数据库状态更新、通知发送等）。",
      },
      {
        id: "api-testing-3",
        topicSlug: "api-testing",
        question: "接口自动化项目应该采用什么分层结构？",
        options: [
          "全部代码写在一个文件，简单直接",
          "三层结构：接口层（封装请求）、业务层（封装业务逻辑）、用例层（测试流程）",
          "按功能模块分文件，不做层级区分",
          "只分测试文件和配置文件",
        ],
        correctIndex: 1,
        explanation: "推荐三层结构：接口层封装请求细节（路径、参数、鉴权）；业务层封装业务逻辑（登录、下单、支付）；用例层只写测试流程和断言。分层后维护更简单，接口变更只需修改接口层。",
      },
    ],
  },
  {
    topicSlug: "async-api-testing",
    questions: [
      {
        id: "async-api-testing-1",
        topicSlug: "async-api-testing",
        question: "异步接口测试的核心挑战是什么？",
        options: [
          "请求参数构造复杂",
          "无法立即验证最终结果，需要等待异步处理完成",
          "异步接口响应速度慢",
          "异步接口不支持自动化测试",
        ],
        correctIndex: 1,
        explanation: "异步接口的难点在于最终结果验证，不是发起调用。调用返回成功只代表请求已接收，需要设计等待策略（轮询、回调监听）验证业务是否正确处理、数据是否正确落库。",
      },
      {
        id: "async-api-testing-2",
        topicSlug: "async-api-testing",
        question: "回调接口测试应该覆盖哪些关键场景？",
        options: [
          "只测试正常回调场景",
          "正常回调、重复回调（幂等）、乱序回调、超时回调",
          "只测试回调参数是否正确",
          "只测试回调响应速度",
        ],
        correctIndex: 1,
        explanation: "回调测试要覆盖：正常回调验证参数解析和业务处理；重复回调验证幂等处理；乱序回调验证状态机正确推进；超时回调验证补偿机制。幂等是回调场景的核心质量要求。",
      },
      {
        id: "async-api-testing-3",
        topicSlug: "async-api-testing",
        question: "轮询等待策略应该如何设计超时和间隔？",
        options: [
          "固定间隔 1 秒，无限等待直到成功",
          "根据业务 SLA 设置最大等待时间，使用指数退避减少轮询开销",
          "间隔越短越好，提高检测速度",
          "等待时间越长越好，避免误判",
        ],
        correctIndex: 1,
        explanation: "超时设计要考虑业务 SLA：设置合理的最大等待时间（如 30 秒），超时后标记失败。轮询间隔采用指数退避（1s, 2s, 4s...），避免频繁查询对系统造成压力。",
      },
    ],
  },
  {
    topicSlug: "ci-cd",
    questions: [
      {
        id: "ci-cd-1",
        topicSlug: "ci-cd",
        question: "质量门禁的核心作用是什么？",
        options: [
          "提高测试执行速度",
          "在关键节点阻断有问题的代码，防止发布到生产环境",
          "生成漂亮的测试报告",
          "减少人工测试工作量",
        ],
        correctIndex: 1,
        explanation: "没有门禁的 CI 只是「好看的报告」，不能真正阻止有问题的代码上线。门禁设计三要素：触发条件（代码提交、合并请求、发布前）、检查项（测试通过率、覆盖率）、处理策略（阻断、警告、人工确认）。",
      },
      {
        id: "ci-cd-2",
        topicSlug: "ci-cd",
        question: "CI 流水线执行时间过长时，应该如何优化？",
        options: [
          "减少测试用例数量",
          "分层执行：快速反馈层（smoke）高频触发，全量回归层夜间触发",
          "只运行失败的用例",
          "不做优化，等待时间不重要",
        ],
        correctIndex: 1,
        explanation: "分层执行策略：快速反馈层（5-10 分钟）高频触发；完整回归层（30 分钟-1 小时）合并请求触发；全量验证层（2-4 小时）夜间定时执行。反馈越慢，问题修复成本越高。",
      },
      {
        id: "ci-cd-3",
        topicSlug: "ci-cd",
        question: "CI 失败时，如何区分环境问题和代码问题？",
        options: [
          "全部认为是代码问题，通知开发者修复",
          "分析失败特征：同一用例时好时坏可能是环境问题，断言失败是代码问题",
          "不做区分，直接重新执行",
          "全部认为是环境问题，等待自动恢复",
        ],
        correctIndex: 1,
        explanation: "区分技巧：同一用例在多次执行中时好时坏，大概率是环境问题；用例失败但开发环境能通过，可能是环境配置差异；失败时查看日志，如果报错是服务不可用或超时，是环境问题。",
      },
    ],
  },
];

export function getSelfTestsForTopic(slug: string): TopicSelfTests | undefined {
  return selfTestData.find((t) => t.topicSlug === slug);
}
