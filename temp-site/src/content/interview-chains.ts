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
];

export function getInterviewChain(id: string): InterviewChain | undefined {
  return interviewChains.find((chain) => chain.id === id);
}

export function getAllInterviewChains(): InterviewChain[] {
  return interviewChains;
}
