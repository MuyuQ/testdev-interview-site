// 新手教程路径元数据
// 定义 8 节课的顺序、目标、产出和时间

export interface BeginnerLesson {
  day: number;
  slug: string;
  title: string;
  goal: string;
  output: string;
  minutes: number;
}

export interface BeginnerPath {
  id: 'beginner-7-day-api';
  title: string;
  description: string;
  audience: string;
  lessons: BeginnerLesson[];
}

// 7 天新手入门路径
export const beginnerPath: BeginnerPath = {
  id: 'beginner-7-day-api',
  title: '7 天测试开发新手入门',
  description:
    '用 7 天理解测试开发基础，写出第一个 Pytest 接口自动化小项目，并学会用面试语言表达。',
  audience: '功能测试、零基础或刚开始学习自动化测试的用户',
  lessons: [
    {
      day: 1,
      slug: 'start-here',
      title: '从零开始：测试开发学习路线',
      goal: '理解这条路线怎么学，以及学完能获得什么。',
      output: '写下自己的 7 天学习目标和每天练习时间。',
      minutes: 25,
    },
    {
      day: 2,
      slug: 'testdev-role-map',
      title: '测试开发是什么：岗位能力地图',
      goal: '理解测试开发和功能测试、自动化测试、开发的区别。',
      output: '用 3 句话讲清测试开发的职责。',
      minutes: 35,
    },
    {
      day: 3,
      slug: 'python-testing-minimum',
      title: 'Python 测试最小基础',
      goal: '掌握写测试需要的最小 Python 知识。',
      output: '能读懂函数、字典、列表、条件判断和 assert。',
      minutes: 50,
    },
    {
      day: 4,
      slug: 'pytest-first-test',
      title: 'Pytest 第一个测试用例',
      goal: '写出第一个可运行的 Pytest 测试。',
      output: '运行一个通过用例和一个失败用例。',
      minutes: 50,
    },
    {
      day: 5,
      slug: 'http-api-basics',
      title: 'HTTP 和接口测试基础',
      goal: '理解请求、响应、状态码、JSON 和接口断言。',
      output: '能解释一次接口调用发生了什么。',
      minutes: 55,
    },
    {
      day: 6,
      slug: 'pytest-api-first-case',
      title: '用 Pytest 写第一个接口测试',
      goal: '用代码请求接口并断言返回结果。',
      output: '写出一个最小接口测试用例。',
      minutes: 60,
    },
    {
      day: 7,
      slug: 'mock-login-mini-project',
      title: '小项目：模拟登录接口测试',
      goal: '把前面知识串成一个小项目。',
      output: '完成登录成功、密码错误、缺少参数 3 条用例。',
      minutes: 90,
    },
    {
      day: 8,
      slug: 'interview-expression-for-first-project',
      title: '面试表达：如何讲第一个接口自动化项目',
      goal: '把练习项目转成可面试表达。',
      output: '准备一段 2 分钟项目介绍。',
      minutes: 45,
    },
  ],
};

// 根据 slug 查找课程
export function getBeginnerLessonBySlug(
  slug: string
): BeginnerLesson | undefined {
  return beginnerPath.lessons.find((lesson) => lesson.slug === slug);
}

// 获取下一节课（用于页面底部导航）
export function getNextBeginnerLesson(
  slug: string
): BeginnerLesson | undefined {
  const index = beginnerPath.lessons.findIndex(
    (lesson) => lesson.slug === slug
  );
  return index >= 0 ? beginnerPath.lessons[index + 1] : undefined;
}

// 获取总预计时间
export function getTotalMinutes(): number {
  return beginnerPath.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
}