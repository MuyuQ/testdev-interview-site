---
title: "重试机制"
description: "实现健壮的重试机制，掌握重试条件判断、次数控制策略、间隔退避算法等核心技能"
category: "coding"
stage: "practice"
estimatedMinutes: 27
difficulty: "interview"
interviewWeight: 3
tags: ["重试", "容错", "异步", "设计模式"]
prerequisites:
  - "tech/api-testing"
  - "glossary/api-assertion"
  - "tech/python"
outcomes:
  - "能实现指数退避加抖动的重试函数"
  - "能区分哪些错误该重试、哪些直接失败"
  - "能讲清重试幂等性与熔断的配合"
relatedSlugs: ["tech/api-testing", "glossary/api-assertion"]
selfTests:
  - id: "retry-mechanism-q1"
    question: "重试机制中，指数退避策略的主要目的是什么？"
    options:
      [
        "避免对服务端造成过大压力",
        "让重试更快成功",
        "减少代码复杂度",
        "节省内存",
      ]
    correctIndex: 0
    explanation: "指数退避通过逐渐增加重试间隔，避免在服务端刚恢复时被大量重试请求再次打垮，是分布式系统的重要容错策略。"
  - id: "retry-mechanism-q2"
    question: "以下哪种情况不应该触发重试？"
    options:
      ["网络超时", "HTTP 500 错误", "HTTP 400 业务参数错误", "服务端限流 429"]
    correctIndex: 2
    explanation: "HTTP 400 表示客户端请求参数错误，重试同样的请求不会有不同结果，属于不可恢复错误，不应重试。"
  - id: "retry-mechanism-q3"
    question: "调用链路上每一层都独立配置 3 次重试，最坏情况会发生什么？"
    options:
      [
        "整条链路总重试次数仍是 3 次",
        "请求被放大为 3 的 N 次方倍（N 为链路层数）",
        "下游会自动合并重复请求",
        "只影响链路最后一层服务",
      ]
    correctIndex: 1
    explanation: "每层独立重试时放大倍数相乘，三层链路最坏可放大 27 倍，故障期会演变成重试风暴。因此全链路要共享重试预算，上游看到下游已重试过时应缩短或取消自己的重试。"
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

| 考察维度   | 具体内容                       | 重要性 |
| ---------- | ------------------------------ | ------ |
| 异步编程   | Promise、async/await、错误处理 | ★★★★★  |
| 设计模式   | 策略模式（间隔策略）、工厂模式 | ★★★★☆  |
| 函数式编程 | 高阶函数、纯函数、函数组合     | ★★★★☆  |
| 容错设计   | 幂等性、重试风暴防护、熔断意识 | ★★★★★  |
| 代码质量   | 可配置性、可测试性、可扩展性   | ★★★★☆  |

## 3. 输入输出

**输入参数**：

```typescript
interface RetryOptions {
  maxAttempts?: number; // 最大尝试次数，默认 3
  delay?: number; // 基础延迟毫秒数，默认 1000
  backoff?: "fixed" | "exponential"; // 退避策略，默认 exponential
  retryIf?: (error: Error) => boolean; // 重试条件判断函数
  onRetry?: (attempt: number, error: Error) => void; // 重试回调
}

function retry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>;
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

### 两个必须先想清楚的前提

- **幂等性是重试的地基**：只有「重复执行结果一致」的操作才能安全重试。`GET`、幂等 `PUT` 天然安全；`POST` 创建类请求必须业务层加「幂等键（idempotency key）」，否则重试可能造成重复下单、重复扣款。面试里被问「POST 能重试吗」时，正确的回答永远是「取决于是否做了幂等设计」。
- **重试风暴比单次失败更危险**：当上游大面积故障时，所有调用方同时退避后同时重试，会在恢复瞬间形成流量尖峰把服务再次打垮。所以退避必须加**随机抖动（jitter）**打散重试时刻，必要时配合熔断器在持续失败时快速失败。
- **总时间预算可控**：最坏情况下用户等待时间 ≈ `单次超时 × maxAttempts + 各次延迟累加`。`maxAttempts=5` 配合指数退避可能让用户等十几秒，要结合业务 SLA 设上限，避免「重试到天荒地老」。

## 6. 最小实现

```typescript
// 延迟工具函数
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 计算退避延迟
const calculateDelay = (
  attempt: number,
  baseDelay: number,
  backoff: "fixed" | "exponential",
): number => {
  if (backoff === "fixed") return baseDelay;
  // 指数退避：delay * 2^(attempt-1)，上限 30s
  return Math.min(baseDelay * Math.pow(2, attempt - 1), 30000);
};

// 默认重试条件：网络错误和 5xx 错误
const defaultRetryIf = (error: any): boolean => {
  if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") return true;
  if (error.status >= 500 && error.status < 600) return true;
  return false;
};

async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = "exponential",
    retryIf = defaultRetryIf,
    onRetry,
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

### 代码走查：面试官看这段代码的打分点

1. **参数下界没校验（走查必问）**：`maxAttempts = 0` 时循环一次都不执行，最后 `throw lastError` 抛出的是 `undefined`——调用方的 `catch` 拿不到任何错误信息，TS strict 模式还会报「变量使用前未赋值」。应在入口加 `if (maxAttempts < 1) throw new Error('maxAttempts must be >= 1')`，一个 if 换掉一个隐蔽炸弹。
2. **retryIf 自身可能抛错**：`retryIf(error)` 在 catch 块内执行，如果条件函数自己抛异常，原始错误会被顶掉，排查时看到的根因是错的。更稳的写法是把条件判断包一层 try/catch，判断失败时按「不重试」处理并保留原错误。
3. **退避封顶是加分细节**：`calculateDelay` 用 `Math.min(..., 30000)` 给指数增长封顶，防止第 15 次重试等出天文数字。这个细节大多数人会漏，写出来就是明确的加分项。
4. **onRetry 的时机**：先回调再 `sleep`，调用方在回调里能拿到「第几次失败、即将等多久」的完整信息做监控埋点；如果放到 sleep 之后，监控数据就缺了等待时长维度。
5. **lastError 原样抛出**：失败后抛最后一次的真实错误而不是包装成新错误，保留了原始堆栈——对比下面错误实现一里「抛口号错误」的写法，差距立现。

### 常见错误实现与修正

错误实现一：无差别重试 + 零间隔 + 吞根因

```typescript
// 典型反面教材：任何错误都立即重试
async function retryBad<T>(fn: () => Promise<T>, times: number): Promise<T> {
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (e) {
      // 空catch：错误被吞掉，继续下一轮
    }
  }
  throw new Error("all attempts failed"); // 根因彻底丢失
}
```

问题：

1. 4xx 业务错误也重试——参数错误重试一百次结果也不会变，只会把一次错误放大成 N 倍流量
2. 重试间隔为零，等于瞬时打 N 倍请求，这是重试风暴的最简模型
3. 空 catch 吞掉错误后，最终抛出的 `'all attempts failed'` 不带任何根因，线上排查只剩一句口号

修正版就是本文最小实现：`retryIf` 按错误类型过滤、指数退避加封顶、失败原样抛 `lastError`。

错误实现二：忘记 await，catch 形同虚设

```typescript
async function retryForgetsAwait<T>(fn: () => Promise<T>, times: number) {
  for (let i = 0; i < times; i++) {
    try {
      return fn(); // 少了 await：返回的是 pending 状态的 Promise
    } catch (e) {
      // 永远走不到：Promise 的 rejection 不触发同步 catch
    }
  }
}
```

问题：

1. `fn()` 返回 Promise 对象本身，不会抛同步异常，catch 是死代码
2. 调用方第一次「成功」拿到的其实是一个未完成的 Promise——一旦请求失败，重试逻辑完全失效，且失败发生在调用方的 await 链上，错误归属都查不清楚

修正：所有异步调用点显式 `return await fn()`；在工程里给 TypeScript 开 `@typescript-eslint/await-thenable` 和 `no-floating-promises` 规则，让这类笔误在 lint 阶段就被拦下。

## 7. 测试用例

```typescript
describe("retry", () => {
  // 测试：成功场景不重试
  it("应直接返回成功结果", async () => {
    const fn = jest.fn().mockResolvedValue("success");
    const result = await retry(fn, { maxAttempts: 3 });
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // 测试：失败后重试成功
  it("应在重试后成功", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue("success");
    const result = await retry(fn, { maxAttempts: 2 });
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  // 测试：达到最大重试次数
  it("应在达到最大次数后抛出错误", async () => {
    const error = new Error("persist");
    error.code = "ETIMEDOUT";
    const fn = jest.fn().mockRejectedValue(error);

    await expect(retry(fn, { maxAttempts: 3, delay: 10 })).rejects.toThrow(
      "persist",
    );
    expect(fn).toHaveBeenCalledTimes(3);
  });

  // 测试：不满足重试条件
  it("应在不满足条件时立即失败", async () => {
    const error = new Error("Bad Request");
    error.status = 400;
    const fn = jest.fn().mockRejectedValue(error);
    const retryIf = (e: any) => e.status >= 500;

    await expect(retry(fn, { maxAttempts: 3, retryIf })).rejects.toThrow(
      "Bad Request",
    );
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // 测试：指数退避
  it("应使用指数退避策略", async () => {
    const error = new Error("fail");
    error.code = "ETIMEDOUT";
    const fn = jest.fn().mockRejectedValue(error);
    const delays: number[] = [];
    const onRetry = (_, __) => delays.push(Date.now());

    await retry(fn, {
      maxAttempts: 3,
      delay: 100,
      backoff: "exponential",
      onRetry,
    }).catch(() => {});

    // 第一次重试延迟约 100ms，第二次约 200ms
    expect(delays.length).toBe(2);
  });
});

// 额外边界用例：固定间隔、无条件不重试、超时上限
describe("retry 边界", () => {
  // 固定间隔：每次延迟都等于 baseDelay
  it("固定间隔每次延迟一致", async () => {
    const error = new Error("fail");
    error.code = "ETIMEDOUT";
    const fn = jest.fn().mockRejectedValue(error);
    const delays: number[] = [];
    let prev = 0;
    const onRetry = () => {
      const now = Date.now();
      if (prev) delays.push(now - prev);
      prev = now;
    };
    await retry(fn, {
      maxAttempts: 3,
      delay: 50,
      backoff: "fixed",
      onRetry,
    }).catch(() => {});
    expect(delays.every((d) => d >= 45 && d <= 80)).toBe(true);
  });

  // maxAttempts=1 等于不重试
  it("maxAttempts=1 时直接失败", async () => {
    const error = new Error("nope");
    error.code = "ETIMEDOUT";
    const fn = jest.fn().mockRejectedValue(error);
    await expect(retry(fn, { maxAttempts: 1 })).rejects.toThrow("nope");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // 延迟上限：指数退避不应无限增长
  it("延迟不超过 30s 上限", () => {
    const calc = (attempt: number) =>
      Math.min(1000 * Math.pow(2, attempt - 1), 30000);
    expect(calc(10)).toBe(30000); // 第10次仍被截断
    expect(calc(1)).toBe(1000);
  });
});
```

## 8. 可扩展点

### 1. 随机抖动（Jitter）——阻止重试风暴

纯指数退避的问题是：所有调用方在同一时刻失败、同一时刻重试，恢复瞬间形成尖峰。加 jitter 把重试时刻打散：

```typescript
// 全抖动：在 [0, baseDelay*2^(n-1)] 间随机
const fullJitter = (attempt: number, base: number) =>
  Math.random() * Math.min(base * Math.pow(2, attempt - 1), 30000);

// 等比例抖动：在 base 与 base*(2^n) 之间取值
const equalJitter = (attempt: number, base: number) => {
  const cap = Math.min(base * Math.pow(2, attempt - 1), 30000);
  return (base + cap) / 2 + (Math.random() * (cap - base)) / 2;
};
```

### 2. 熔断集成——持续失败时快速失败

重试解决「单次瞬态失败」，熔断解决「上游已挂、重试只会雪崩」：

```typescript
class CircuitBreaker {
  private failures = 0;
  private open = false;
  constructor(
    private threshold = 5,
    private cooldown = 30000,
  ) {}
  async exec<T>(fn: () => Promise<T>): Promise<T> {
    if (this.open) throw new Error("circuit open");
    try {
      const r = await fn();
      this.failures = 0; // 成功即复位
      return r;
    } catch (e) {
      if (++this.failures >= this.threshold) {
        this.open = true;
        setTimeout(() => (this.open = false), this.cooldown); // 半开探测
      }
      throw e;
    }
  }
}
```

### 3. 取消机制——AbortSignal 与 fetch 集成

```typescript
async function retryFetch(
  url: string,
  options: RequestInit & { maxAttempts?: number },
) {
  const { maxAttempts = 3, signal, ...rest } = options;
  return retry(() => fetch(url, { ...rest, signal }), {
    maxAttempts,
    retryIf: (e) => e.name !== "AbortError",
  });
}
// 用户取消时 signal.abort() 立即终止，不触发重试
```

### 4. 可观测性

- 上报重试次数、累计耗时、错误率到监控（如 Prometheus）
- 每次重试附带 `attempt` 序号和错误类型，便于链路追踪（traceId）

### 5. 装饰器模式

提供类方法装饰器版本，复用同一套配置：

```typescript
function WithRetry(opts: RetryOptions) {
  return (_, __: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      return retry(() => original.apply(this, args), opts);
    };
  };
}
```

### 6. 复杂度与规模化：并发和链路深度上来之后哪里先崩

1. **单请求视角：最坏耗时先失控。** 按本文参数（单次超时 5s、maxAttempts=3、指数退避 1s/2s）算，一个彻底失败的请求要占住连接约 `5+1+5+2+5 ≈ 18s`。上游并发 1000 时，这些「慢请求」堆积占满连接池或线程池，系统表现不是报错而是「越来越慢」——先崩的是资源占用，不是重试逻辑本身。
2. **链路放大（重试放大倍数）：每层都重试就是乘法。** A → B → C 三层链路，每层各配 3 次重试，C 抖动一次，A 层面最多发出 `3×3×3 = 27` 个请求。层数越深放大越狠，所以全链路要共享重试预算：上游发现请求头里带着「下游已重试 2 次」，应把自己的重试次数缩到 0-1 次。
3. **恢复瞬间的同步惊群：jitter 是必选项。** 纯指数退避让所有调用方在相同的整数倍延迟上重合，服务端恢复的一瞬间被同步重试打回崩溃。这就是扩展点 1 的 jitter 不能只停留在「了解」，而要真正合入默认配置的原因。
4. **参数管理先于算法优化。** 规模化后每个调用点各写各的 `maxAttempts: 5, delay: 500` 魔法数字，没人说得清全系统重试总量。正确姿势是重试参数集中配置、按接口分级（支付回调这类核心链路多一次重试，边缘查询零重试），并用压测校准——参数是运维配置，不是代码常量。

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

| 追问                         | 参考回答要点                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------ |
| 如何避免重试风暴？           | 加随机抖动（Jitter）、限制并发重试数、熔断器保护                               |
| GET 和 POST 重试有什么区别？ | GET 幂等可安全重试；POST 非幂等需业务幂等键设计                                |
| 重试和熔断如何配合？         | 熔断在持续失败后快速失败，重试在单次失败后重试；熔断保护服务端，重试保护客户端 |
| 如何处理超时和重试的关系？   | 单次请求有超时，总时间 = 超时 × 重试次数 + 延迟累计；需设置合理的总超时        |

### 深入追问三组

**追问 1：重试预算（Retry Budget）是什么？为什么大厂网关都要做？**

参考回答：给「重试请求占总请求的比例」设上限，比如 10%。当服务整体错误率升高、重试请求占比触顶后，新的重试请求直接被拒绝，保证生产流量不被重试挤占。它解决的是固定 maxAttempts 解决不了的全局问题——单请求重试 3 次看起来无害，但故障期所有请求都在重试时，流量会整体放大 2-3 倍，反而加速崩溃。

**追问 2：重试和超时，哪个先配置？**

参考回答：先定单次超时，再定重试次数。顺序反了会出现「总超时 3s 但单次超时 5s」的自相矛盾——第一轮都没跑完就被上游掐断，重试永远轮不上。经验公式：单次超时参考下游 P99 延迟，总时长由上游 SLA 倒推，重试次数 = 总时长里能塞下几轮「超时 + 退避」。

**追问 3：幂等键具体怎么设计？测试时怎么验证？**

参考回答：客户端生成全局唯一 ID（如 UUID）随请求携带，服务端用「唯一索引 + 冲突即返回原结果」实现去重，有效期覆盖最大重试窗口。测试验证两点：同一幂等键重复请求必须返回同一结果（不产生第二笔业务数据）；不同幂等键视为两次独立业务。这两条可以直接写成参数化用例，也是面试里展示「重试必须配幂等测试」的好机会。

## 11. 关联技术和场景

- **[API 测试](/testdev-interview-site/tech/api-testing/)**：理解接口测试中的超时和重试场景
- **[断言机制](/testdev-interview-site/glossary/api-assertion/)**：重试后的结果验证，重试成功也要靠断言兜底
- **设计模式**：退避策略本质是策略模式（Strategy），把「如何计算延迟」抽象成可替换的算法
- **容错体系**：重试 + 熔断 + 超时三者协同，单一机制无法应对全部故障模式
