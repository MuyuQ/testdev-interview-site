// 面试追问链模块学习路径
import type { CategoryPath } from "./types";

const interviewChainsPath: CategoryPath = {
  id: "interview-chains",
  title: "追问链三步走",
  description:
    "从最通用的接口测试追问，到框架设计追问，再到电商订单综合场景，练的是被连问时还能条理作答的应对能力。",
  audience: "基础过关、但怕被连环追问问到卡壳的测试开发",
  steps: [
    {
      slug: "api-testing-chain",
      goal: "把接口测试的常考点串成一条可层层展开的追问链。",
      output: "列出一条接口测试追问链，能就任意一环连续往下答三问不卡。",
    },
    {
      slug: "test-framework",
      goal: "从框架设计视角组织追问，讲清取舍与扩展思路。",
      output: "画出框架追问脉络，能解释关键模块的选型理由与权衡。",
    },
    {
      slug: "ecommerce-order-chain",
      goal: "把接口、框架知识压进电商下单的综合业务场景。",
      output: "梳理出订单链路追问清单，能结合业务讲清异常与补偿。",
    },
  ],
};

export default interviewChainsPath;
