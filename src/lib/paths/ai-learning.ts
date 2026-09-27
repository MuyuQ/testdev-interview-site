// AI 学习模块学习路径
import type { CategoryPath } from "./types";

const aiLearningPath: CategoryPath = {
  id: "ai-learning",
  title: "AI 学习三步走",
  description:
    "先建立能用的工具认知，再学 AI 辅助接口测试和用例设计，练的是把 AI 真正落到测试工作流里。",
  audience: "想用 AI 提效，但只会聊天、不会嵌进测试流程的测试开发",
  steps: [
    {
      slug: "testdev-ai-tools",
      goal: "先把能用的 AI 测试工具盘一遍，建立工具与边界的认知。",
      output: "整理一张工具对照表，写明每款能做什么、不能做什么。",
    },
    {
      slug: "ai-api-testing",
      goal: "用 AI 辅助生成接口测试用例、脚本与断言，并校验质量。",
      output: "让 AI 生成一组接口测试脚本，你能指出其中三处错误并修正。",
    },
    {
      slug: "ai-testcase-design",
      goal: "用 AI 拆解需求并补全边界与异常用例，提升覆盖度。",
      output: "贴一段需求让 AI 出用例，你能补齐它漏掉的边界场景。",
    },
  ],
};

export default aiLearningPath;
