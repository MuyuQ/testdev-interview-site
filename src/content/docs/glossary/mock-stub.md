---
title: "Mock 和 Stub"
description: "两种隔离外部依赖的测试替身技术，Mock验证行为交互，Stub提供预设响应，是单元测试与集成测试分离的核心手段。"
category: "glossary"
difficulty: "beginner"
interviewWeight: 3
tags: ["自动化模式", "单元测试", "测试替身", "依赖隔离", "面试高频"]
relatedSlugs: ["glossary/unit-testing", "glossary/integration-testing", "tech/api-testing"]
selfTests:
  - id: "mock-stub-q1"
    question: "Mock 和 Stub 的核心区别是什么？"
    options: ["Mock验证行为交互，Stub提供预设响应", "Mock和Stub功能完全相同", "Stub验证行为，Mock提供响应", "两者只是命名不同"]
    correctIndex: 0
    explanation: "Mock关注「被调用了吗、怎么调用的」行为验证；Stub关注「返回什么值」状态验证。这是两者的本质区别。"
  - id: "mock-stub-q2"
    question: "以下哪种场景更适合使用 Mock？"
    options: ["验证邮件服务是否被正确调用", "为计算函数提供固定输入值", "模拟数据库返回预设数据", "为纯函数提供测试参数"]
    correctIndex: 0
    explanation: "邮件服务调用是行为交互，需要验证「是否发送、发给谁、发送几次」，这是Mock的典型场景。Stub适合提供预设响应。"
  - id: "mock-stub-q3"
    question: "过度使用 Mock 会带来什么问题？"
    options: ["测试与实现细节强耦合，重构时测试大量失败", "测试运行速度变慢", "无法发现任何bug", "测试代码变得更简洁"]
    correctIndex: 0
    explanation: "Mock验证的是「怎么调用的」，当实现方式改变时（如换了个方法名），Mock测试就会失败，这就是实现细节耦合。"
---

## 一句话定义

**Mock** 和 **Stub** 是两种测试替身（Test Double）技术，用于隔离被测代码的外部依赖：**Stub提供预设响应**（关注返回什么），**Mock验证行为交互**（关注被怎么调用）。

## 为什么重要

1. **测试隔离**：让单元测试不依赖数据库、API、文件系统等不稳定因素，测试变得快速、可靠
2. **降低测试成本**：无需搭建真实环境，节省基础设施和时间
3. **面试高频考点**：Mock/Stub区别、何时用何时不用、与Fake/Spy的关系是测试岗位必问
4. **测试金字塔基础**：理解测试替身才能正确分层测试，避免E2E测试泛滥

## 工作流位置

```
编写测试用例
    ↓
┌─────────────────────────────────────┐
│ 识别外部依赖（数据库、API、文件等）   │
│    ↓                                │
│ 选择测试替身策略                     │
│    ├─ 只需返回值 → Stub              │
│    ├─ 需验证调用 → Mock              │
│    ├─ 简单可复现 → Fake              │
│    └─ 部分监听 → Spy                 │
│    ↓                                │
│ 编写测试代码                         │
└─────────────────────────────────────┘
    ↓
测试执行（毫秒级完成）
```

测试替身位于测试设计阶段，是决定「测什么、怎么测」的关键决策点。

## 最小例子

### Stub 示例：提供预设响应

```javascript
// 被测函数：根据用户ID获取用户信息并计算年龄
function getUserAge(userId, userRepository) {
  const user = userRepository.findById(userId);
  return calculateAge(user.birthDate);
}

// Stub：假装是userRepository，返回预设数据
const userRepoStub = {
  findById: (id) => {
    // 不连接真实数据库，直接返回预设值
    if (id === '123') {
      return { id: '123', name: '张三', birthDate: '1990-05-15' };
    }
    return null;
  }
};

// 测试：用Stub隔离数据库依赖
test('getUserAge应该正确计算年龄', () => {
  const age = getUserAge('123', userRepoStub);
  expect(age).toBe(34);  // 基于预设数据计算
});
```

**Stub的特点**：只提供返回值，不验证`findById`是否被调用、调用几次。

### Mock 示例：验证行为交互

```javascript
// 被测函数：发送订单确认邮件
function sendOrderConfirmation(order, emailService) {
  const email = {
    to: order.customerEmail,
    subject: `订单${order.id}已确认`,
    body: `感谢您的购买...`
  };
  emailService.send(email);
}

// Mock：验证send方法是否被正确调用
const emailServiceMock = {
  send: jest.fn()  // Jest创建Mock函数
};

// 测试：验证行为交互
test('sendOrderConfirmation应该调用邮件服务', () => {
  const order = { id: 'ORD-001', customerEmail: 'test@example.com' };
  sendOrderConfirmation(order, emailServiceMock);

  // Mock断言：验证行为
  expect(emailServiceMock.send).toHaveBeenCalledTimes(1);
  expect(emailServiceMock.send).toHaveBeenCalledWith({
    to: 'test@example.com',
    subject: '订单ORD-001已确认',
    body: expect.stringContaining('感谢')
  });
});
```

**Mock的特点**：验证`send`被调用1次、参数是什么，关注「行为是否正确」。

## 面试怎么说

**面试官问**：「Mock和Stub有什么区别？什么时候用？」

**参考回答**：

> Mock和Stub都是测试替身，核心区别是验证目标不同：
>
> **Stub是状态验证**，提供预设响应让测试能运行。比如我用Stub假装数据库返回固定用户数据，测试`getUserAge`函数的计算逻辑。Stub不关心`findById`是否被调用，只管返回值。
>
> **Mock是行为验证**，验证被测代码「怎么调用」依赖对象。比如我用Mock验证`sendEmail`是否被调用、调用几次、参数对不对。Mock关心的是交互行为。
>
> **何时用Stub**：只需要依赖返回值，测试自己的逻辑。比如测试计算函数、数据转换逻辑。
>
> **何时用Mock**：需要确认与外部系统的交互是否正确。比如验证邮件发送、日志记录、API调用。
>
> **何时不用**：简单纯函数不需要替身；过度Mock会让测试与实现细节耦合，重构时测试全挂。我倾向于优先用真实依赖（集成测试），只在隔离必要时用替身。

## 易错点

### 1. 过度使用Mock

```javascript
// 错误：连简单计算都Mock
const calculatorMock = {
  add: jest.fn().mockReturnValue(5)
};

test('测试业务逻辑', () => {
  const result = processOrder(calculatorMock);
  expect(calculatorMock.add).toHaveBeenCalledWith(2, 3);
});
```

**问题**：`add`是纯函数，Mock它会让测试与实现细节耦合。如果改成用`subtract`，测试就失败了，但业务逻辑可能完全正确。

**正确做法**：纯函数、无副作用逻辑直接用真实代码测试。

### 2. Mock与Stub混用概念不清

```javascript
// 概念混淆：叫Mock但实际是Stub
const mockDatabase = {
  findUser: () => ({ name: '张三' })  // 只返回值，没验证行为
};

// 这实际上是Stub，不是Mock
```

### 3. 只Mock不测真实场景

单元测试用Mock隔离没问题，但完全不测真实集成是危险的。API接口变了、数据库字段变了，Mock测试全通过，上线才发现问题。

**正确做法**：Mock用于单元测试快速反馈，集成测试/E2E测试验证真实协作。

### 4. 验证不相关的行为

```javascript
// 错误：验证了不该关心的行为
expect(loggerMock.log).toHaveBeenCalledWith('开始处理');
expect(loggerMock.log).toHaveBeenCalledWith('处理完成');
```

日志是辅助功能，不应该作为测试断言的核心。除非日志是业务关键要求（如审计日志）。

## 混淆概念

### Mock vs Stub vs Fake vs Spy

| 替身类型 | 核心目的 | 典型场景 | 示例 |
|----------|----------|----------|------|
| **Stub** | 提供预设响应 | 需要依赖返回值但不关心交互 | 假数据库返回固定用户 |
| **Mock** | 验证行为交互 | 需确认调用方式、次数、参数 | 验证邮件发送调用 |
| **Fake** | 简化版真实实现 | 有完整功能但简化实现 | 内存数据库替代MySQL |
| **Spy** | 部分监听真实对象 | 包装真实对象记录调用信息 | 真实API调用+记录次数 |

**简单判断**：
- 只要返回值，用Stub
- 要验证「调没调、怎么调」，用Mock
- 要简化版真实功能，用Fake
- 要用真实对象但记录行为，用Spy

### Mock框架 vs 手写替身

```javascript
// 手写Stub（简单场景够用）
const stub = {
  findById: () => ({ name: '张三' })
};

// Mock框架（复杂验证更方便）
const mock = jest.fn();
expect(mock).toHaveBeenCalledTimes(2);  // 框架提供丰富断言
```

手写适合简单场景，框架适合需要复杂验证的场景（调用次数、调用顺序、参数匹配）。

## 自测题

### 题目 1：选择合适的替身

测试一个「用户注册后发送欢迎邮件」的功能，需要：
1. 验证用户保存到数据库（字段是否正确）
2. 验证邮件发送给用户（地址、内容）

分别用什么替身？

<details>
<summary>查看答案</summary>

- **数据库**：用Stub，返回预设用户数据让测试继续，或用Fake内存数据库验证保存逻辑
- **邮件服务**：用Mock，验证`sendEmail`被调用、参数正确（地址、内容）

关键：数据库关注「存了什么」可用Stub/Fake；邮件关注「发了没、发给谁」用Mock。
</details>

### 题目 2：判断以下代码用的是Mock还是Stub

```javascript
const paymentService = {
  charge: jest.fn().mockReturnValue({ success: true })
};

test('下单流程', () => {
  placeOrder(order, paymentService);
  expect(paymentService.charge).toHaveBeenCalled();
});
```

<details>
<summary>查看答案</summary>

**是Mock**。虽然有`mockReturnValue`（Stub特征），但核心断言`toHaveBeenCalled`是行为验证，这是Mock的本质。

结论：有行为验证断言的就是Mock，只提供返回值无验证的是Stub。
</details>

### 题目 3：思考题

为什么说「过度Mock会让测试与实现细节耦合」？举一个具体例子。

<details>
<summary>查看答案</summary>

假设代码重构：

```javascript
// 原实现
function sendEmail(to, subject, body) { ... }

// 重构后
function sendEmail(emailObj) { ... }  // 参数改成对象
```

Mock测试验证的是参数格式：
```javascript
expect(mock.sendEmail).toHaveBeenCalledWith('test@example.com', '主题', '内容');
```

重构后参数变了，Mock测试失败，但邮件功能可能完全正常。这就是「测试与实现细节耦合」——测试验证的不是业务结果（邮件是否送达），而是实现方式（参数怎么传）。
</details>

## 关联

- **前置概念**：[单元测试](/glossary/unit-testing) - 理解为什么需要隔离依赖
- **后置概念**：[集成测试](/glossary/integration-testing) - 用真实依赖验证协作
- **同家族术语**：Fake、Spy、Dummy - 其他测试替身类型
- **技术实践**：[API测试](/tech/api-testing) - 接口层面的Mock策略
- **框架工具**：Jest Mock、unittest.mock、Mockito

## 下一步

1. 动手练习：为你的项目写一个Stub和一个Mock，体会区别
2. 深入理解：研究你常用测试框架的Mock API
3. 项目实践：检查现有测试是否过度Mock，识别可简化为Stub的场景