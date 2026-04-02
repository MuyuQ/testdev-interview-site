import type { InterviewChain } from './types';

const interviewChains: InterviewChain[] = [
  {
    id: 'payment-scenario',
    title: '支付场景链',
    description: '从支付功能测试到支付系统架构的完整追问链路',
    category: 'scenario',
    steps: [
      {
        slug: 'payment-flow-test',
        question: '如何测试一个支付功能？你需要考虑哪些测试场景？',
        followUpHint: '可以从正常流程、异常流程、边界值等角度回答',
      },
      {
        slug: 'payment-security',
        question: '支付系统中的安全性测试要点有哪些？如何保证支付数据的安全？',
        followUpHint: '考虑数据加密、传输安全、防重放攻击等方面',
      },
      {
        slug: 'payment-architecture',
        question: '请描述一个典型的支付系统架构，包括核心模块和它们之间的交互关系',
      },
      {
        slug: 'payment-troubleshooting',
        question: '如果用户反馈支付成功了但订单状态未更新，你如何排查这个问题？',
        followUpHint: '从日志、数据库、消息队列、接口调用等角度分析',
      },
    ],
  },
  {
    id: 'test-framework',
    title: '测试框架链',
    description: '从测试框架使用到框架设计原理的深度追问',
    category: 'tech',
    steps: [
      {
        slug: 'framework-selection',
        question: '你常用的测试框架有哪些？选择测试框架的标准是什么？',
        followUpHint: '可以从项目类型、团队技术栈、社区支持等方面回答',
      },
      {
        slug: 'framework-design-pattern',
        question: '请解释 POM（Page Object Model）设计模式的核心思想和优势',
        followUpHint: '说明页面对象的封装、复用、维护成本等方面',
      },
      {
        slug: 'framework-extension',
        question: '如何基于现有测试框架进行二次开发，满足项目的特殊需求？',
      },
      {
        slug: 'framework-comparison',
        question: '对比pytest和unittest，它们各自的优劣势是什么？在什么场景下选择哪一个？',
        followUpHint: '从语法简洁性、fixture 机制、参数化、插件生态等角度对比',
      },
    ],
  },
  {
    id: 'api-testing-chain',
    title: '接口测试链',
    description: '从接口测试基础到接口自动化体系的完整追问',
    category: 'tech',
    steps: [
      {
        slug: 'api-test-basics',
        question: '接口测试的核心要点有哪些？如何设计一个完整的接口测试用例？',
        followUpHint: '考虑请求参数、响应验证、异常场景、边界条件等',
      },
      {
        slug: 'api-test-automation',
        question: '如何搭建接口自动化测试框架？需要解决哪些关键问题？',
        followUpHint: '从框架选型、数据驱动、报告生成、持续集成等方面回答',
      },
      {
        slug: 'api-mock-service',
        question: '在接口测试中，什么情况下需要使用 Mock？如何设计一个 Mock 服务？',
      },
      {
        slug: 'api-contract-test',
        question: '什么是接口契约测试？它在微服务架构中的价值是什么？',
        followUpHint: '从服务间依赖、接口变更、消费者驱动等角度回答',
      },
    ],
  },
  {
    id: 'performance-testing-chain',
    title: '性能测试链',
    description: '从性能测试执行到性能优化方案的完整追问',
    category: 'tech',
    steps: [
      {
        slug: 'performance-test-plan',
        question: '如何制定一个性能测试计划？需要明确哪些关键指标？',
        followUpHint: '考虑并发用户数、响应时间、吞吐量、资源利用率等',
      },
      {
        slug: 'performance-test-tool',
        question: '你用过哪些性能测试工具？它们的适用场景和优缺点是什么？',
      },
      {
        slug: 'performance-bottleneck',
        question: '发现性能瓶颈后，你如何定位问题根因？请描述你的分析思路',
        followUpHint: '从系统监控、日志分析、代码 profiling、数据库查询等角度回答',
      },
      {
        slug: 'performance-optimization',
        question: '请分享一个你参与的性能优化案例，包括问题发现、分析过程和最终方案',
      },
    ],
  },
  {
    id: 'ui-automation-chain',
    title: 'UI 自动化链',
    description: '从 UI 自动化实践到自动化策略的深度追问',
    category: 'tech',
    steps: [
      {
        slug: 'ui-automation-selection',
        question: 'UI 自动化测试适用于什么场景？如何判断一个项目是否需要 UI 自动化？',
        followUpHint: '从项目稳定性、投入产出比、维护成本等角度回答',
      },
      {
        slug: 'ui-locator-strategy',
        question: '在 UI 自动化中，如何选择稳定的元素定位策略？有哪些最佳实践？',
      },
      {
        slug: 'ui-automation-stability',
        question: 'UI 自动化测试不稳定（flaky test）的常见原因有哪些？如何解决？',
        followUpHint: '从等待机制、环境因素、数据依赖、元素变化等方面分析',
      },
      {
        slug: 'ui-automation-strategy',
        question: '如何制定一个合理的 UI 自动化测试策略？自动化测试在测试金字塔中的位置是什么？',
      },
    ],
  },
  {
    id: 'ecommerce-order-chain',
    title: '电商订单链',
    description: '从订单创建到履约完成的完整业务场景追问链路',
    category: 'scenario',
    steps: [
      {
        slug: 'ecommerce-project',
        question: '请描述电商订单系统的核心业务流程，以及你在测试中关注的关键点',
        followUpHint: '从订单创建、库存扣减、支付、发货等环节展开',
      },
      {
        slug: 'flash-sale',
        question: '秒杀场景下的订单系统测试有哪些特殊挑战？如何设计测试方案？',
        followUpHint: '考虑高并发、库存超卖、限流降级等场景',
      },
      {
        slug: 'payment-callback',
        question: '支付回调异常导致订单状态不一致，如何设计测试用例覆盖这些场景？',
        followUpHint: '从幂等性、超时重试、状态机设计等角度分析',
      },
      {
        slug: 'data-migration',
        question: '电商系统订单数据迁移时，如何保证数据一致性和业务连续性？',
        followUpHint: '考虑双写方案、数据校验、回滚机制等',
      },
    ],
  },
  {
    id: 'coding-practice-chain',
    title: '编码实战链',
    description: '从基础工具实现到工程化封装的编码能力深度追问',
    category: 'coding',
    steps: [
      {
        slug: 'retry-mechanism',
        question: '请实现一个通用的重试机制，需要考虑哪些因素？',
        followUpHint: '从重试次数、间隔策略、异常类型、最大超时等角度回答',
      },
      {
        slug: 'assertion-wrapper',
        question: '如何设计一个灵活的断言封装，支持多种断言方式和自定义断言？',
        followUpHint: '考虑链式调用、软断言、断言失败继续执行等特性',
      },
      {
        slug: 'fixture-strategy',
        question: '设计一个 Fixture 管理策略，如何处理测试数据的准备和清理？',
        followUpHint: '从数据隔离、并行执行、性能优化等角度回答',
      },
      {
        slug: 'logging-wrapper',
        question: '如何设计测试框架的日志系统，便于问题定位和报告生成？',
        followUpHint: '考虑日志级别、格式化、上下文信息、性能影响等',
      },
      {
        slug: 'test-data-generator',
        question: '请设计一个测试数据生成器，支持多种数据类型和自定义规则',
        followUpHint: '从数据模板、随机策略、边界数据、数据关联等角度回答',
      },
    ],
  },
  {
    id: 'ai-testing-chain',
    title: 'AI辅助测试链',
    description: '从AI工具使用到AI能力边界的认知追问链路',
    category: 'ai-learning',
    steps: [
      {
        slug: 'testdev-ai-tools',
        question: '你用过哪些AI辅助测试工具？它们在哪些环节最有价值？',
        followUpHint: '从用例生成、代码审查、缺陷预测等角度分享经验',
      },
      {
        slug: 'ai-api-testing',
        question: '如何利用AI提升接口测试的效率和覆盖率？有哪些实践经验？',
        followUpHint: '考虑接口文档解析、用例自动生成、响应断言等场景',
      },
      {
        slug: 'ai-testcase-design',
        question: 'AI生成测试用例的质量如何保证？如何与人工设计互补？',
        followUpHint: '从用例审查、边界场景、业务逻辑等角度分析',
      },
      {
        slug: 'llm-boundaries',
        question: '大语言模型在测试领域有哪些局限性？如何正确认识和使用AI？',
        followUpHint: '考虑幻觉问题、上下文限制、领域知识、数据安全等',
      },
    ],
  },
  {
    id: 'senior-testdev-chain',
    title: '资深测试开发链',
    description: '从测试策略制定到团队建设的资深能力深度追问',
    category: 'tech',
    steps: [
      {
        slug: 'test-pyramid',
        question: '如何根据项目特点制定合理的测试策略？测试金字塔在实践中有哪些变体？',
        followUpHint: '从单元测试、接口测试、UI测试的比例和投入角度回答',
      },
      {
        slug: 'quality-gate',
        question: '如何在CI/CD流水线中设计有效的质量门禁？有哪些关键指标？',
        followUpHint: '考虑代码覆盖率、自动化通过率、性能基准等指标',
      },
      {
        slug: 'test-coverage',
        question: '测试覆盖率越高越好吗？如何设定合理的覆盖率目标？',
        followUpHint: '从投入产出比、关键路径覆盖、增量覆盖率等角度分析',
      },
      {
        slug: 'pipeline',
        question: '如何建设测试基础设施，支撑团队的持续交付能力？',
        followUpHint: '从环境管理、数据准备、测试执行、报告分析等角度回答',
      },
      {
        slug: 'microservice-architecture-project',
        question: '作为资深测试开发，如何推动团队测试能力和质量的持续提升？',
        followUpHint: '从技术分享、流程优化、工具建设、人才培养等角度展开',
      },
    ],
  },
];

export function getInterviewChain(id: string): InterviewChain | undefined {
  return interviewChains.find((chain) => chain.id === id);
}

export function getAllInterviewChains(): InterviewChain[] {
  return interviewChains;
}
