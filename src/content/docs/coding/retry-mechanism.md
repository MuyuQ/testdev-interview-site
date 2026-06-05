---
title: "重试机制"
description: "实现健壮的重试机制，掌握重试条件判断、次数控制策略、间隔退避算法等核心技能"
category: "coding"
difficulty: "interview"
interviewWeight: 3
tags: ["重试", "容错", "异步", "设计模式"]
relatedSlugs: ["tech/api-testing", "glossary/api-assertion", "coding/promise-concurrency"]
selfTests:
  - id: "retry-mechanism-q1"
    question: "重试机制中，指数退避策略的主要目的是什么？"
    options: ["避免对服务端造成过大压力", "让重试更快成功", "减少代码复杂度", "节省内存"]
    correctIndex: 0
    explanation: "指数退避通过逐渐增加重试间隔，避免在服务端刚恢复时被大量重试请求再次打垮，是分布式系统的重要容错策略。"
  - id: "retry-mechanism-q2"
    question: "以下哪种情况不应该触发重试？"
    options: ["网络超时", "HTTP 500 错误", "HTTP 400 业务参数错误", "服务端限流 429"]
    correctIndex: 2
    explanation: "HTTP 400 表示客户端请求参数错误，重试同样的请求不会有不同结果，属于不可恢复错误，不应重试。"
---

## 1. 题目描述

设计并实现一个通用的异步重试函数 `retry(fn, options)`，能够对失败的异步操作进行自动重试。要求支持配置重试次数、重试间隔、重试条件判断，并实现指数退避策略。

**核心需求**：
- 支持异步函数的自动重试
- 可配置最大重试次数
- 支持固定间隔和指数退避两种策略
- 提供重试条件判断能力（哪些错误需要重试）
- 返回最终结果或抛出最后一次错误

## 2. 考察点

| 考察维度 | 具体内容 | 重要性 |
|---------|---------|--------|
| 异步编程 | Promise、async/await、错误处理 | ★★★★★ |
| 设计模式 | 策略模式（间隔策略）、工厂模式 | ★★★★☆ |
| 函数式编程 | 高阶函数、纯函数、函数组合 | ★★★★☆ |
| 容错设计 | 幂等性、重试风暴防护、熔断意识 | ★★★★★ |
| 代码质量 | 可配置性、可测试性、可扩展性 | ★★★★☆ |

## 3. 输入输出

**输入参数**：

```typescript
interface RetryOptions {
  maxAttempts?: number;      // 最大尝试次数，默认 3
  delay?: number;            // 基础延迟毫秒数，默认 1000
  backoff?: 'fixed' | 'exponential';  // 退避策略，默认 exponential
  retryIf?: (error: Error) => boolean; // 重试条件判断函数
  onRetry?: (attempt: number, error: Error) => void; // 重试回调
}

function retry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T>
```

**输出行为**：
- 成功时返回异步函数的结果
- 失败时抛出最后一次尝试的错误
- 重试过程中可通过 `onRetry` 回调监控

## 4. 约束边界

**必须处理**：
- 异步函数执行失败时的重试
- 网络类错误（超时、连接重置）
- 服务端临时故障（5xx 错误）

**不应重试的场景**：
- 业务逻辑错误（如参数校验失败 400）
- 认证授权错误（401、403）
- 资源不存在（404）
- 明确的不可恢复错误

**边界条件**：
- `maxAttempts = 1` 时等于不重试
- 延迟时间不应超过合理上限（如 30 秒）
- 总重试时间应可控

## 5. 设计思路

**核心流程**：

```
执行 fn() ──成功──→ 返回结果
    │
   失败
    │
    ↓
判断是否满足重试条件 ──不满足──→ 抛出错误
    │
   满足
    │
    ↓
判断是否达到最大次数 ──达到──→ 抛出最后一次错误
    │
   未达到
    │
    ↓
计算延迟时间 → 等待 → 再次执行 fn()
```

**关键设计决策**：

1. **重试条件抽象**：通过 `retryIf` 函数让调用方决定哪些错误值得重试
2. **退避策略分离**：将延迟计算逻辑抽离，支持扩展更多策略
3. **透明包装**：重试函数返回类型与原函数一致，对调用方透明

## 6. 最小实现

```typescript
// 延迟工具函数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 计算退避延迟
const calculateDelay = (
  attempt: number,
  baseDelay: number,
  backoff: 'fixed' | 'exponential'
): number => {
  if (backoff === 'fixed') return baseDelay;
  // 指数退避：delay * 2^(attempt-1)，上限 30s
  return Math.min(baseDelay * Math.pow(2, attempt - 1), 30000);
};

// 默认重试条件：网络错误和 5xx 错误
const defaultRetryIf = (error: any): boolean => {
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') return true;
  if (error.status >= 500 && error.status < 600) return true;
  return false;
};

async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 'exponential',
    retryIf = defaultRetryIf,
    onRetry
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // 最后一次尝试不再重试
      if (attempt === maxAttempts) break;

      // 判断是否应该重试
      if (!retryIf(error)) break;

      // 计算延迟并等待
      const waitTime = calculateDelay(attempt, delay, backoff);
      onRetry?.(attempt, error);
      await sleep(waitTime);
    }
  }

  throw lastError;
}
```

## 7. 测试用例

```typescript
describe('retry', () => {
  // 测试：成功场景不重试
  it('应直接返回成功结果', async () => {
    const fn = jest.fn().mockResolvedValue('success');
    const result = await retry(fn, { maxAttempts: 3 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // 测试：失败后重试成功
  it('应在重试后成功', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');
    const result = await retry(fn, { maxAttempts: 2 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  // 测试：达到最大重试次数
  it('应在达到最大次数后抛出错误', async () => {
    const error = new Error('persist');
    error.code = 'ETIMEDOUT';
    const fn = jest.fn().mockRejectedValue(error);

    await expect(retry(fn, { maxAttempts: 3, delay: 10 }))
      .rejects.toThrow('persist');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  // 测试：不满足重试条件
  it('应在不满足条件时立即失败', async () => {
    const error = new Error('Bad Request');
    error.status = 400;
    const fn = jest.fn().mockRejectedValue(error);
    const retryIf = (e: any) => e.status >= 500;

    await expect(retry(fn, { maxAttempts: 3, retryIf }))
      .rejects.toThrow('Bad Request');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // 测试：指数退避
  it('应使用指数退避策略', async () => {
    const error = new Error('fail');
    error.code = 'ETIMEDOUT';
    const fn = jest.fn().mockRejectedValue(error);
    const delays: number[] = [];
    const onRetry = (_, __) => delays.push(Date.now());

    await retry(fn, { maxAttempts: 3, delay: 100, backoff: 'exponential', onRetry })
      .catch(() => {});

    // 第一次重试延迟约 100ms，第二次约 200ms
    expect(delays.length).toBe(2);
  });
});
```

## 8. 可扩展点

1. **更多退避策略**：
   - 随机抖动（Jitter）：避免重试风暴同步
   - 等差数列退避：每次固定增加
   - 可配置上限策略

2. **熔断集成**：
   - 连续失败达到阈值后快速失败
   - 半开状态探测恢复

3. **可观测性**：
   - 重试指标上报（次数、耗时、错误率）
   - 日志追踪集成

4. **取消机制**：
   - 支持 AbortSignal 取消正在进行的重试
   - 与 fetch API 深度集成

5. **装饰器模式**：
   - 提供类方法的装饰器版本
   - 支持配置继承和覆盖

## 9. 面试讲解

**开场**：重试机制是分布式系统中提升可用性的重要手段，核心是"在合理的条件下，以合理的策略，重试合理的次数"。

**讲解要点**：

1. **为什么需要重试**：网络不稳定、服务临时过载都是常态，合理的重试能显著提升成功率

2. **重试的代价**：
   - 增加响应延迟
   - 可能加重服务端负担
   - 需要幂等性保证

3. **指数退避的原理**：首次失败后短时间重试，如果持续失败则逐渐拉长间隔，给服务端恢复时间

4. **幂等性要求**：重试的前提是操作幂等，GET 天然幂等，POST 需要业务层设计（如幂等键）

**一句话总结**："重试机制的关键是在'快速恢复'和'避免重试风暴'之间找到平衡，指数退避加抖动是业界最佳实践。"

## 10. 追问

| 追问 | 参考回答要点 |
|-----|-------------|
| 如何避免重试风暴？ | 加随机抖动（Jitter）、限制并发重试数、熔断器保护 |
| GET 和 POST 重试有什么区别？ | GET 幂等可安全重试；POST 非幂等需业务幂等键设计 |
| 重试和熔断如何配合？ | 熔断在持续失败后快速失败，重试在单次失败后重试；熔断保护服务端，重试保护客户端 |
| 如何处理超时和重试的关系？ | 单次请求有超时，总时间 = 超时 × 重试次数 + 延迟累计；需设置合理的总超时 |

## 11. 关联

- **[API 测试](/tech/api-testing)**：理解接口测试中的超时和重试场景
- **[断言机制](/glossary/api-assertion)**：重试后的结果验证
- **[Promise 并发控制](/coding/promise-concurrency)**：批量请求时的重试策略
- **[错误处理](/coding/error-handling)**：统一的错误分类和处理
- **[设计模式]：策略模式在退避策略中的应用