// 技术栈模块学习路径
import type { CategoryPath } from "./types";

const techPath: CategoryPath = {
  id: "tech",
  title: "技术栈八步通",
  description:
    "从 Python 与 pytest 打底，到接口、数据库、UI 自动化，最后用容器与 CI 把测试工程化。",
  audience: "会一点代码、但还没把测试技术串成工程化能力链的测试开发",
  steps: [
    {
      slug: "python",
      goal: "补齐写测试脚本必备的 Python 语法与常用标准库。",
      output: "能写出一个读取 CSV 并做断言的脚本，用到函数、文件与异常处理。",
    },
    {
      slug: "pytest",
      goal: "用 pytest 组织用例、参数化与收集测试结果。",
      output: "能跑通一个含参数化用例和 fixture 的 pytest 小套件并看懂报告。",
    },
    {
      slug: "api-testing",
      goal: "把接口文档变成可执行、可断言的接口测试用例。",
      output: "能用一个 HTTP 客户端写出登录到下单的接口用例并校验响应。",
    },
    {
      slug: "database-testing",
      goal: "验证数据落库、事务与一致性，而不只是看接口返回。",
      output: "能写用例核对一条业务操作前后数据库的记录变化与约束。",
    },
    {
      slug: "mock-framework",
      goal: "用 mock 框架在单元层隔离外部依赖、构造异常场景。",
      output: "能用 mock 框架模拟一个超时接口，并验证代码的降级分支。",
    },
    {
      slug: "playwright",
      goal: "用 Playwright 写出稳定可维护的端到端 UI 自动化。",
      output: "能写出一个登录到下单的端到端脚本，并带显式等待避免 flaky。",
    },
    {
      slug: "docker-testing",
      goal: "把测试环境容器化，保证本地与 CI 环境一致。",
      output: "能写一个 Dockerfile 或 compose，一键拉起含被测服务的测试环境。",
    },
    {
      slug: "ci-cd",
      goal: "把前面所有测试接进流水线，实现提交即测、门禁卡发布。",
      output: "能配出一条 CI 流水线，在 PR 触发时跑测试并在失败时阻断合并。",
    },
  ],
};

export default techPath;
