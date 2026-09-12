// 实战模板模块学习路径
import type { CategoryPath } from './types';

const practiceTemplatePath: CategoryPath = {
  id: 'practice-template',
  title: '实战模板三步走',
  description:
    '先隔离依赖建 Mock，再搭接口自动化骨架，最后把项目沉淀成可讲的故事，练的是把经验变成可展示成果的能力。',
  audience: '有项目但讲不清、缺可演示作品的测试开发',
  steps: [
    {
      slug: 'mock-service-template',
      goal: '用 Mock 服务把不稳定的外部依赖先隔离出来。',
      output: '起一个 Mock 服务，能返回预设响应让用例脱离真实依赖跑通。',
    },
    {
      slug: 'api-automation-template',
      goal: '在稳定桩上搭一套可复用的接口自动化骨架。',
      output: '搭出自动化骨架，能一键跑通一条接口用例并产出报告。',
    },
    {
      slug: 'project-story-template',
      goal: '把做过的事整理成简历与面试都能用的项目故事。',
      output: '写出项目故事稿，能用 STAR 法讲清背景、动作与量化结果。',
    },
  ],
};

export default practiceTemplatePath;
