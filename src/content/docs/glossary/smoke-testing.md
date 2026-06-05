---
title: "冒烟测试"
description: "在软件发布前，对核心业务流程进行快速验证，确保主链路畅通的轻量级测试方法"
category: "glossary"
difficulty: "beginner"
interviewWeight: 2
tags: ["测试基础", "CI/CD", "主链路验证", "快速反馈"]
relatedSlugs: ["tech/api-testing", "glossary/regression-testing", "glossary/sanity-testing"]
selfTests:
  - id: "smoke-testing-q1"
    question: "冒烟测试与回归测试的主要区别是什么？"
    options: ["冒烟测试覆盖所有功能，回归测试只测核心", "冒烟测试只验证主链路，回归测试覆盖已测功能", "冒烟测试必须自动化，回归测试必须手动", "两者完全相同，只是叫法不同"]
    correctIndex: 1
    explanation: "冒烟测试聚焦于验证核心业务主链路是否畅通，追求快速反馈；回归测试则关注代码变更是否影响了已有的功能正确性，覆盖范围更广。"
  - id: "smoke-testing-q2"
    question: "在CI/CD流水线中，冒烟测试最合适放在哪个阶段？"
    options: ["在单元测试之前执行", "在部署到生产环境之后执行", "在部署到测试环境后、完整回归测试之前执行", "在所有测试完成后执行"]
    correctIndex: 2
    explanation: "冒烟测试应放在部署到测试环境后、执行完整回归测试之前。这样可以快速发现阻塞性问题，避免浪费时间运行全面测试。"
  - id: "smoke-testing-q3"
    question: "以下哪个场景最适合使用冒烟测试？"
    options: ["验证按钮颜色是否正确", "确认用户登录-浏览-下单-支付主流程能跑通", "检查所有边界条件", "测试所有异常场景"]
    correctIndex: 1
    explanation: "冒烟测试的核心目标是验证主链路畅通，用户登录-浏览-下单-支付是最典型的核心业务主链路，符合冒烟测试的定位。"
---

## 一句话定义

冒烟测试（Smoke Testing）是一种轻量级的测试方法，在软件构建或部署后，快速验证**核心业务主链路**是否正常工作，判断软件是否"值得继续测试"。

## 为什么测试开发要关心它

1. **快速反馈**：几分钟内发现阻塞性缺陷，避免团队在"坏掉"的版本上浪费时间
2. **节省成本**：在执行全面回归测试前，先筛掉明显不可用的版本
3. **CI/CD 守门员**：作为流水线的质量门禁，阻止劣质代码流入后续阶段
4. **团队协作**：开发提测前的自测标准，减少测试人员的无效工作

## 它在真实工作流中的位置

```
代码提交 → 单元测试 → 构建 → 部署到测试环境
                                    ↓
                              【冒烟测试】 ← 快速验证主链路
                                    ↓
                           通过 → 执行完整回归测试
                           失败 → 打回，开发修复后重新提测
```

在 CI/CD 流水线中，冒烟测试通常配置在部署后、完整测试套件前，作为"是否继续"的判断条件。

## 一个最小例子

假设一个电商系统的主链路是：登录 → 搜索商品 → 加入购物车 → 下单 → 支付。

```python
# smoke_test.py - 冒烟测试示例
import pytest
from api_client import APIClient

class TestSmoke:
    """电商系统冒烟测试 - 验证主链路"""

    def test_user_journey_smoke(self):
        """验证用户完整购买流程能否走通"""
        client = APIClient()

        # 1. 用户登录
        login_resp = client.login("test_user", "password123")
        assert login_resp.status_code == 200, "登录失败，主链路中断"

        # 2. 搜索商品
        search_resp = client.search_products("iPhone")
        assert search_resp.status_code == 200, "搜索失败"
        assert len(search_resp.json()["items"]) > 0, "无搜索结果"

        # 3. 加入购物车
        product_id = search_resp.json()["items"][0]["id"]
        cart_resp = client.add_to_cart(product_id, quantity=1)
        assert cart_resp.status_code == 200, "加购失败"

        # 4. 创建订单
        order_resp = client.create_order()
        assert order_resp.status_code == 200, "下单失败"
        order_id = order_resp.json()["order_id"]

        # 5. 支付（测试环境模拟）
        pay_resp = client.mock_payment(order_id)
        assert pay_resp.status_code == 200, "支付失败"

        print("冒烟测试通过，主链路畅通")
```

运行配置（CI/CD 中）：
```yaml
# .gitlab-ci.yml
stages:
  - build
  - smoke
  - regression

smoke_test:
  stage: smoke
  script:
    - pytest tests/smoke/ -v --tb=short
  timeout: 10m  # 冒烟测试必须快速
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

## 面试怎么说

"冒烟测试是我在项目中用来保障版本基本可用性的第一道防线。在 CI/CD 流水线中，我会把它配置在部署后、完整回归测试前，用几分钟快速验证核心业务主链路。比如电商系统，我会验证用户登录、搜索商品、加入购物车、下单支付这个完整链路能否跑通。冒烟测试的核心原则是**快速**和**聚焦主链路**，不追求覆盖边界场景，而是快速判断版本是否值得继续深入测试。"

**可以补充的亮点**：
- 举例说明冒烟测试帮团队拦截了多少次严重问题
- 说明冒烟测试用例的选择标准（主链路、高频功能、历史故障点）
- 提及冒烟测试与监控告警的结合

## 易错点

1. **把冒烟测试写成全面测试**：冒烟测试不是"什么都测"，而是聚焦主链路，控制在 5-15 分钟内完成
2. **忽视失败后的快速反馈**：冒烟测试失败必须立即通知开发，而不是等测试人员发现
3. **用例维护不及时**：核心业务变化后，冒烟测试用例未同步更新，导致漏测或无效测试
4. **过度依赖 UI 层**：冒烟测试可以走 API 层，比 UI 自动化更快更稳定
5. **混淆"冒烟"与"健全"测试**：冒烟测试更粗粒度，健全测试（Sanity Testing）则是对特定功能的深入验证

## 容易混淆的概念

| 概念 | 定义 | 区别要点 |
|------|------|----------|
| **冒烟测试** | 验证主链路是否畅通 | 范围最窄，速度最快，判断"值不值得测" |
| **健全测试** | 验证特定功能模块是否正常 | 范围稍广，针对变更部分深入验证 |
| **回归测试** | 验证变更是否影响已有功能 | 范围最广，覆盖全面，耗时最长 |
| **单元测试** | 验证最小代码单元 | 由开发执行，关注代码逻辑 |

简单记忆：**冒烟 → 健全 → 回归**，范围由窄到宽，时间由短到长。

## 自测题

详见 frontmatter 中的 `selfTests` 字段。核心考察点：
- 冒烟测试的定位和范围
- 在 CI/CD 中的位置选择
- 与回归测试、健全测试的区别

## 关联内容

- [API 测试](/docs/tech/api-testing) - 冒烟测试常用 API 层实现
- [回归测试](/docs/glossary/regression-testing) - 冒烟测试通过后的下一步
- [健全测试](/docs/glossary/sanity-testing) - 容易与冒烟测试混淆
- [CI/CD 流水线设计](/docs/tech/cicd-pipeline) - 冒烟测试在流水线中的配置