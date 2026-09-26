// 场景类型模块学习路径
import type { CategoryPath } from "./types";

const scenarioPath: CategoryPath = {
  id: "scenario",
  title: "场景类型七步走",
  description:
    "从最高频的登录鉴权出发，经支付回调、异步任务、数据迁移，再到分布式事务、库存扣减和订单取消，练的是把典型场景拆成可验证用例的能力。",
  audience: "会写单接口用例，但遇到复杂业务场景就漏测的测试开发",
  steps: [
    {
      slug: "login-auth",
      goal: "把最常用的登录鉴权拆成正常、异常、安全的完整用例集。",
      output: "写出登录鉴权用例表，覆盖token过期、越权、爆破三场景。",
    },
    {
      slug: "payment-callback",
      goal: "在支付回调里处理异步通知、重复通知与签名校验。",
      output: "画出回调处理时序图，并列出重复通知的幂等处理验证点。",
    },
    {
      slug: "async-task",
      goal: "在异步任务场景里设计状态流转、超时与补偿的测试。",
      output: "写出异步任务状态机用例，能讲清失败重试与最终一致性。",
    },
    {
      slug: "data-migration",
      goal: "在数据迁移场景里保证存量与增量数据的一致与可追溯。",
      output: "写出迁移核对清单，能对比新旧库抽样数据并定位差异。",
    },
    {
      slug: "distributed-transaction",
      goal: "用失败注入矩阵验证跨服务补偿与最终一致性。",
      output: "写出部分失败补偿矩阵用例，讲清对账兜底与一致性时间窗。",
    },
    {
      slug: "inventory-deduction",
      goal: "用并发守恒断言验证库存不超卖、不少卖。",
      output: "写出并发扣减守恒脚本，能对比行锁与预扣方案的验证差异。",
    },
    {
      slug: "order-cancel",
      goal: "用状态机矩阵和竞态用例验证订单取消的完整性。",
      output: "画出取消状态机迁移矩阵，验证回补守恒与取消支付竞态。",
    },
  ],
};

export default scenarioPath;
