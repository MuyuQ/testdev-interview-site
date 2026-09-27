// 面试路线图模块学习路径
import type { CategoryPath } from "./types";

const roadmapPath: CategoryPath = {
  id: "roadmap",
  title: "路线图三步走",
  description:
    "从单点击破的自我介绍到三天速记，再到七天系统计划，练的是由点到面排兵布阵的备考能力。",
  audience: "零基础或临阵磨枪、不知道先准备哪块的测试开发求职者",
  steps: [
    {
      slug: "self-introduction-template",
      goal: "把一分钟自我介绍打磨成能张口就来的开场钩子。",
      output: "写出一份 1 分钟自我介绍逐字稿，能对着镜子流畅背出并点出亮点。",
    },
    {
      slug: "3-day-interview-map",
      goal: "用三天把高频考点快速过一遍，建立全局印象。",
      output: "整理出一张三天速记清单，能复述每个考点的核心关键词。",
    },
    {
      slug: "7-day-interview-plan",
      goal: "把零散复习串成七天可执行、有节奏的冲刺计划。",
      output: "排出一张七天日程表，能说出每天主线任务与当日自测方式。",
    },
  ],
};

export default roadmapPath;
