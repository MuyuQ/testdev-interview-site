---
title: "请求重试封装题"
description: "要讲清可重试条件、退避策略、幂等风险和日志。"
category: "coding"
difficulty: "interview"
interviewWeight: 3
tags: ["重试", "封装", "稳定性"]
selfTests:
  - id: "retry-error-classification"
    question: "哪些错误应该被归类为可重试错误？"
    options:
      - "所有错误都应该重试"
      - "网络超时、连接异常、5xx 服务端错误"
      - "4xx 客户端错误、业务异常"
      - "认证失败"
    correctIndex: 1
    explanation: "可重试错误包括网络超时、连接异常、5xx 服务端错误。4xx 客户端错误、业务异常（如余额不足）、认证失败通常不可重试。"
  - id: "retry-idempotency-risk"
    question: "对支付、下单等写操作重试时需要注意什么？"
    options:
      - "直接重试，不需要考虑副作用"
      - "确认幂等性，使用幂等键或服务端去重机制"
      - "写操作不应该重试"
      - "增加重试次数"
    correctIndex: 1
    explanation: "写操作重试前必须确认幂等性，否则第一次请求可能已成功，重试导致重复扣款或重复下单。方案：使用幂等键、服务端去重、或改用异步补偿机制。"
  - id: "retry-backoff-strategy"
    question: "为什么重试需要使用退避策略？"
    options:
      - "退避策略让代码更复杂"
      - "立即重试能更快恢复"
      - "避免重试风暴，服务可能在恢复中，立即重试会加剧压力"
      - "退避策略没有实际作用"
    correctIndex: 2
    explanation: "使用指数退避策略（如 100ms → 200ms → 400ms），加上随机抖动避免惊群效应。服务可能正在恢复中，立即重试会加剧压力，大量请求同时重试可能造成雪崩。"
---

## 题目背景

理解面试官出这道题的意图

这道题主要考察三个能力：系统稳定性意识、工程化思维和边界处理能力。系统稳定性意识体现在是否理解分布式系统的不确定性——网络抖动、服务限流、依赖超时都是常态，重试是提升可用性的基础手段。工程化思维体现在能否将重试抽象为可配置、可观测、可控制的模块，而不是写死在业务代码里。边界处理能力体现在是否考虑了幂等性、超时控制、熔断机制、日志追踪等生产环境必备的保障措施。题目类型属于设计类+实现类：先要讲清楚设计思路（什么情况下重试、怎么重试、重试几次），再给出核心实现逻辑。面试官通常不会要求完整代码，更看重你能否讲清楚关键决策点。

## 解题思路

错误分类→策略选择→退避设计→边界处理

- 第一步：错误分类——把错误分为可重试和不可重试两类。

网络超时、连接异常、5xx 服务端错误通常可重试。4xx 客户端错误、业务异常（如余额不足）通常不可重试。

- 第二步：策略选择——根据业务场景选择重试策略。

读操作可以放心重试，写操作需要考虑幂等性。同步重试适合快速恢复，异步补偿适合最终一致性场景。

- 第三步：退避设计——设计退避间隔避免重试风暴。固定间隔简单但可能造成拥塞，指数退避更合理，可加随机抖动避免惊群效应。
- 第四步：边界处理——设置最大重试次数、总体超时时间、熔断阈值。记录每次重试的上下文信息，方便排查问题。
- 设计权衡：重试次数多→恢复概率大但延迟增加。退避间隔短→响应快但可能加剧拥塞。同步重试→逻辑简单但阻塞线程。异步补偿→解耦但复杂度高。

## 示例代码：重试机制封装

```python
# utils/retry.py - 重试机制封装
import time
import random
import logging
from typing import Callable, Any, Type
from functools import wraps

logger = logging.getLogger(__name__)

# 可重试的异常类型
RETRYABLE_EXCEPTIONS = (ConnectionError, TimeoutError, OSError)

def retry(
    max_attempts: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 30.0,
    retryable_exceptions: tuple[Type[Exception], ...] = RETRYABLE_EXCEPTIONS,
):
    """重试装饰器 - 支持指数退避和随机抖动"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            last_exception = None
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except retryable_exceptions as e:
                    last_exception = e
                    if attempt == max_attempts:
                        logger.error(
                            f"{func.__name__} 重试 {max_attempts} 次后失败: {e}"
                        )
                        raise

                    # 指数退避 + 随机抖动
                    delay = min(base_delay * (2 ** (attempt - 1)), max_delay)
                    jitter = random.uniform(0, delay * 0.1)
                    sleep_time = delay + jitter

                    logger.warning(
                        f"{func.__name__} 第 {attempt} 次失败: {e}, "
                        f"{sleep_time:.2f}s 后重试..."
                    )
                    time.sleep(sleep_time)

            raise last_exception  # type: ignore
        return wrapper
    return decorator

# 使用示例
@retry(max_attempts=3, base_delay=1.0)
def fetch_data(url: str) -> dict:
    """获取数据，自动重试"""
    import requests
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    return resp.json()
```

```python
# 使用 tenacity 库（生产推荐）
from tenacity import (
    retry, stop_after_attempt, wait_exponential,
    retry_if_exception_type, before_log, after_log,
)
import logging

logger = logging.getLogger(__name__)

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=10),
    retry=retry_if_exception_type((ConnectionError, TimeoutError)),
    before=before_log(logger, logging.WARNING),
    after=after_log(logger, logging.INFO),
)
def call_api(url: str) -> dict:
    """使用 tenacity 的重试装饰器"""
    import requests
    return requests.get(url, timeout=10).json()
```

## 代码逻辑

核心流程描述，不展示完整代码

【整体流程】入口函数接收请求参数 → 调用执行器执行请求 → 捕获异常 → 判断是否可重试 → 可重试则计算退避时间并等待 → 再次执行 → 达到上限或成功则返回 → 记录完整日志。【核心步骤详解】1. 可重试判断器：接收异常对象，根据异常类型和状态码返回是否可重试。\n\n例如：连接超时返回 true，认证失败返回 false。2. 退避策略器：接收当前重试次数，返回等待时间。指数退避公式：base \* 2^attempt，加上随机抖动避免同步重试。3. 重试执行器：循环执行请求，每次失败后调用判断器和策略器，成功或达到上限则退出。总体超时控制在外层包装。4. 日志记录器：每次重试记录时间戳、重试次数、异常类型、退避时间、最终结果。输出结构化日志便于检索分析。【关键接口定义】RetryConfig：包含最大次数、初始间隔、最大间隔、可重试异常列表。RetryContext：包含当前次数、总耗时、上次异常、请求参数。RetryResult：包含最终状态、总次数、总耗时、失败原因链。

## 常见失分点

面试中最容易丢分的 5 个问题

### 失分点 1：不分错误类型，全部重试

错误做法：捕获所有异常后直接重试，不区分错误原因。

为什么不好：业务错误（如余额不足）重试会重复扣款。认证错误重试毫无意义且可能触发风控。

如何改进：建立错误分类器，根据异常类型和状态码判断是否可重试。

常见规则：网络层异常可重试，业务层异常不重试。

### 失分点 2：没有退避策略，立即重试

错误做法：失败后立即重试，循环执行。

为什么不好：服务可能正在恢复中，立即重试会加剧压力。大量请求同时重试可能造成雪崩。

如何改进：使用指数退避策略，每次重试间隔翻倍。

例如：100ms → 200ms → 400ms → 800ms，加上随机抖动。

### 失分点 3：忽略幂等性风险

错误做法：对支付、下单等写操作直接重试，不考虑副作用。

为什么不好：第一次请求可能已成功，重试导致重复扣款或重复下单。

如何改进：写操作重试前必须确认幂等性。

方案：使用幂等键（idempotency key）、服务端去重、或改用异步补偿机制。

### 失分点 4：没有超时控制

错误做法：只设置重试次数，不控制总体超时时间。

为什么不好：极端情况下重试累积时间可能超过业务可接受范围，用户等待超时。

如何改进：设置总体超时时间，超时后终止重试并返回错误。

总体超时 = 单次超时 + 重试次数 × 最大退避时间。

### 失分点 5：没有日志和可观测性

错误做法：重试过程无日志，只在最后返回成功或失败。

为什么不好：生产问题排查时无法知道重试了几次、每次是什么错误、退避了多久。

如何改进：每次重试记录结构化日志，包含：时间戳、重试次数、异常类型、退避时间、请求标识。

可接入监控系统统计重试率和成功率。

## 进阶讨论

展示技术深度和系统思维

【性能考虑】重试对系统的影响是双面的。正向看，重试提高了请求成功率，减少了因瞬时故障导致的业务失败。负向看，重试增加了后端压力，特别是故障恢复期可能形成重试风暴。

生产环境建议：限制单机并发重试数、配合熔断器快速失败、重要接口降级到异步队列。【扩展性设计】可配置的重试策略让系统更灵活。核心配置项：最大重试次数、退避策略类型（固定/线性/指数）、初始间隔、最大间隔、可重试异常列表、总体超时时间。

配置方式：代码默认值 + 配置文件覆盖 + 动态调整（结合配置中心）。

不同接口可有不同策略，例如支付接口重试次数少但间隔短，数据同步接口重试次数多但间隔长。【方案对比】同步重试 vs 异步补偿：同步重试适用于快速恢复场景，用户等待但逻辑简单。异步补偿适用于最终一致性场景，用户无感知但需要消息队列和状态机。内置重试 vs 框架重试：内置重试可控性强但需要自己实现。框架重试（如 tenacity、resilience4j）功能完善但需要理解框架机制。单机重试 vs 分布式重试：单机重试简单但重启后丢失。分布式重试（消息队列）可靠但复杂度高。
