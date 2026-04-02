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
];

export function getSelfTestsForTopic(slug: string): TopicSelfTests | undefined {
  return selfTestData.find((t) => t.topicSlug === slug);
}
