// 编码题模块学习路径
import type { CategoryPath } from './types';

const codingPath: CategoryPath = {
  id: 'coding',
  title: '编码题三步走',
  description:
    '从夹具设计到断言封装再到重试机制，练的是把测试工程问题写成可维护代码的能力。',
  audience: '能写基础 Python，但面试现场写框架代码没思路的测试开发',
  steps: [
    {
      slug: 'fixture-strategy',
      goal: '把测试数据的准备和清理从用例里剥离出来。',
      output: '写出带作用域和 yield 清理的 fixture，能解释四种作用域的差别。',
    },
    {
      slug: 'assertion-wrapper',
      goal: '把散落的 assert 收敛成可复用、报错信息可读的断言封装。',
      output: '实现一个断言工具类，能让失败信息直接指出期望值与实际值。',
    },
    {
      slug: 'retry-mechanism',
      goal: '在稳定与不过度等待之间设计重试策略，并保证幂等。',
      output: '写出带退避和次数上限的重试装饰器，并说明哪些请求不能重试。',
    },
  ],
};

export default codingPath;
