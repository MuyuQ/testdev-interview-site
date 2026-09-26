// 项目类型模块学习路径
import type { CategoryPath } from "./types";

const projectPath: CategoryPath = {
  id: "project",
  title: "项目类型四步走",
  description:
    "从通用电商到权限后台、多端 App，再到强一致的支付场景，练的是按业务复杂度选型测试策略的能力。",
  audience: "做过功能测试，但拿到新项目不知道从哪切入的测试开发",
  steps: [
    {
      slug: "ecommerce-project",
      goal: "用最典型的电商链路摸清项目测试的切入点与优先级。",
      output: "画出下单到支付的端到端链路图，并标出三个高风险节点。",
    },
    {
      slug: "admin-platform",
      goal: "在带权限和角色的系统中练权限矩阵与越权用例设计。",
      output: "写出后台角色权限矩阵，并列出至少五条越权测试点。",
    },
    {
      slug: "mobile-app-project",
      goal: "在多端 App 场景里处理兼容性、弱网与安装升级测试。",
      output: "整理一份移动端兼容性清单，覆盖机型、系统、弱网三维度。",
    },
    {
      slug: "payment-project",
      goal: "在强一致要求的支付场景里设计对账、幂等与资损用例。",
      output: "写出支付对账用例集，能讲清幂等键和重复扣款如何验证。",
    },
  ],
};

export default projectPath;
