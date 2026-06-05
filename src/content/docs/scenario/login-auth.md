---
title: "登录鉴权"
description: "掌握登录鉴权的风险点识别、测试策略设计、Session/Token 验证机制以及多端登录场景的完整测试方案。"
category: "scenario"
difficulty: "interview"
interviewWeight: 5
tags: ["鉴权测试", "Session管理", "Token验证", "多端登录", "面试场景题", "风险分析"]
relatedSlugs: [
  "project/user-system-test",
  "tech/api-testing",
  "interview-chains/auth-chain",
  "glossary/oauth2"
]
selfTests:
  - id: "login-auth-token-expire"
    question: "用户 Token 过期后，系统应该如何处理？"
    options: [
      "直接跳转登录页，无需提示",
      "返回 Token 过期错误码，前端引导重新登录或刷新 Token",
      "自动延长 Token 有效期",
      "忽略过期继续使用旧 Token"
    ]
    correctIndex: 1
    explanation: "正确做法是返回明确的过期错误码（如 401），前端根据错误码引导用户重新登录或使用 Refresh Token 刷新。直接跳转可能导致用户操作中断且无提示，自动延长存在安全风险，忽略过期则完全违背鉴权设计。"
  - id: "login-auth-multi-device"
    question: "多端登录场景下，用户在设备 A 登出后，设备 B 的 Token 应该如何处理？"
    options: [
      "设备 B 的 Token 继续有效，不受影响",
      "设备 B 的 Token 立即失效，下次请求被拒绝",
      "仅清除设备 A 的本地存储，服务器不做处理",
      "延迟失效，等待一定时间后再拒绝"
    ]
    correctIndex: 1
    explanation: "理想方案是服务器端维护 Token 与设备绑定关系，登出时清除对应 Token 记录。设备 B 使用同一账号的其他 Token 应保持有效，但若设计为'一处登出全部失效'，则所有关联 Token 都应失效。关键是要明确业务规则并测试边界。"
  - id: "login-auth-concurrent-login"
    question: "用户在已登录状态下，用另一台设备再次登录，哪种处理方式更合理？"
    options: [
      "拒绝第二次登录，提示账号已登录",
      "允许第二次登录，踢掉之前的登录 Session",
      "允许多设备同时登录，各自独立 Session",
      "直接报错，不做任何处理"
    ]
    correctIndex: 2
    explanation: "答案取决于业务规则。多数现代应用允许多设备同时登录（方案 C），各 Session 独立管理。支付类敏感应用可能选择方案 B（踢旧 Session）以增强安全性。方案 A 和 D 用户体验较差。测试关键是验证系统对所选策略的一致性执行。"
---

## 场景题原问

面试官问："登录鉴权这个模块，你会怎么测？请从风险点和测试策略角度展开说说。"

---

## 先确认问题边界

回答这类场景题，先不要急着背用例列表。建议先确认三个边界：

1. **登录方式**：是账号密码登录、手机验证码登录，还是第三方 OAuth 登录？
2. **鉴权机制**：用的是 Session-Cookie、JWT Token，还是 OAuth2 / SSO？
3. **业务规则**：允不允许多端同时登录？一处登出是否全部失效？有没有异地登录风控？

确认边界后再展开，避免答非所问。可以用这句话开场：

"我先确认一下，咱们系统的登录方式是账号密码还是手机验证码？鉴权机制用的是 Session 还是 Token？多端登录的业务规则是怎样的？"

---

## 风险分析

登录鉴权是系统安全的第一道门，风险主要集中在四类：

### 1. 身份伪造风险

- 暴力破解：密码错误多次后未限制
- 验证码绕过：短信验证码可重用或未校验手机号归属
- Session/Token 泄露：被中间人攻击截获，或存储在可被 XSS 窃取的位置

### 2. 权限混乱风险

- 权限提升：普通用户拿到管理员 Token 后可访问管理接口
- 权限残留：用户权限变更后，旧 Token 未及时失效
- 越权访问：用户 A 的 Token 可以操作用户 B 的数据

### 3. 状态不一致风险

- 登出后 Token 未失效：用户登出，但服务器端未清除 Token
- 多端登录冲突：设备 A 登出，设备 B 的 Session 状态混乱
- 密码修改后旧 Session 未失效：用户改密码后，旧登录状态仍有效

### 4. 并发和性能风险

- 大量并发登录请求冲击鉴权服务
- Token 校验接口成为性能瓶颈
- Session 存储机制（如 Redis）单点故障

---

## 测试维度

基于上述风险，测试维度可以拆成五个方向：

| 维度 | 核心关注点 |
|------|-----------|
| 功能正确性 | 登录成功/失败、鉴权通过/拒绝的边界 |
| 安全性 | 防破解、防泄露、防越权 |
| 状态一致性 | 登出、改密、权限变更后的 Token 状态 |
| 多端兼容 | 不同设备、不同客户端的登录状态同步 |
| 性能和稳定性 | 高并发登录、Token 校验延迟 |

---

## 核心用例设计

### 1. 登录功能核心用例

```python
# 登录正向流程测试
def test_login_success():
    """正常账号密码登录成功，返回有效 Token"""
    response = api_client.post("/login", {
        "username": "testuser",
        "password": "correct_pwd"
    })
    assert response.status_code == 200
    assert "token" in response.json()
    # 验证 Token 可用
    profile = api_client.get("/profile", headers={"Authorization": response.json()["token"]})
    assert profile.status_code == 200

def test_login_wrong_password():
    """密码错误返回明确错误码，不泄露账号是否存在"""
    response = api_client.post("/login", {
        "username": "testuser",
        "password": "wrong_pwd"
    })
    assert response.status_code == 401
    assert response.json()["code"] == "AUTH_FAILED"
    # 错误信息应模糊，不应区分"账号不存在"和"密码错误"
    assert "不存在" not in response.json()["message"]
```

### 2. 验证码登录用例

```python
def test_sms_code_reuse_attack():
    """验证码不应可重用"""
    # 第一次使用验证码登录成功
    code = get_sms_code("13800138000")
    response1 = api_client.post("/login/sms", {"phone": "13800138000", "code": code})
    assert response1.status_code == 200

    # 同一验证码再次使用应失败
    response2 = api_client.post("/login/sms", {"phone": "13800138000", "code": code})
    assert response2.status_code == 401
    assert response2.json()["code"] == "CODE_EXPIRED_OR_USED"

def test_sms_code_expiry():
    """验证码超时失效"""
    code = get_sms_code("13800138000")
    time.sleep(301)  # 假设验证码有效期 5 分钟
    response = api_client.post("/login/sms", {"phone": "13800138000", "code": code})
    assert response.status_code == 401
    assert response.json()["code"] == "CODE_EXPIRED"
```

### 3. Token 鉴权用例

```python
def test_token_expired_handling():
    """Token 过期后返回明确错误码"""
    expired_token = generate_expired_token(user_id=123)
    response = api_client.get("/profile", headers={"Authorization": expired_token})
    assert response.status_code == 401
    assert response.json()["code"] == "TOKEN_EXPIRED"

def test_token_signature_tampered():
    """Token 签名被篡改应拒绝"""
    valid_token = get_valid_token(user_id=123)
    tampered_token = tamper_token_signature(valid_token)
    response = api_client.get("/profile", headers={"Authorization": tampered_token})
    assert response.status_code == 401
    assert response.json()["code"] == "TOKEN_INVALID"

def test_token_permission_boundary():
    """Token 权限边界：普通用户不能访问管理接口"""
    user_token = get_valid_token(user_id=123, role="user")
    response = api_client.get("/admin/users", headers={"Authorization": user_token})
    assert response.status_code == 403
    assert response.json()["code"] == "PERMISSION_DENIED"
```

### 4. 登出和多端登录用例

```python
def test_logout_token_invalidation():
    """登出后 Token 立即失效"""
    token = login_and_get_token("testuser", "correct_pwd")
    # 登出
    api_client.post("/logout", headers={"Authorization": token})
    # 用同一 Token 请求应失败
    response = api_client.get("/profile", headers={"Authorization": token})
    assert response.status_code == 401

def test_multi_device_login_sync():
    """多端登录状态同步"""
    # 设备 A 登录
    token_a = login_and_get_token("testuser", "correct_pwd", device_id="device_a")
    # 设备 B 登录
    token_b = login_and_get_token("testuser", "correct_pwd", device_id="device_b")
    # 两个 Token 都应有效
    assert api_client.get("/profile", headers={"Authorization": token_a}).status_code == 200
    assert api_client.get("/profile", headers={"Authorization": token_b}).status_code == 200
    # 设备 A 登出
    api_client.post("/logout", headers={"Authorization": token_a})
    # 根据业务规则验证设备 B 状态（此处假设设计为各自独立）
    # 若一处登出全部失效：
    # assert api_client.get("/profile", headers={"Authorization": token_b}).status_code == 401
```

---

## 异常、边界和兼容情况

### 异常场景

| 场景 | 测试点 |
|------|--------|
| 网络中断时登录 | 前端超时提示、后端请求幂等 |
| 验证码发送失败 | 提示重试、限制发送频率 |
| Token 校验服务不可用 | 降级策略（拒绝请求或允许有限访问） |
| 并发重复登录请求 | 只生成一个 Session 或正确处理重复 |

### 边界场景

| 场景 | 测试点 |
|------|--------|
| Token 刚过期瞬间 | 过期判断的毫秒级精度 |
| 密码修改后旧 Token | 应立即失效或设计过渡期 |
| 权限变更后 Token | 权限变更时机与 Token 状态同步 |
| 账号禁用/删除后 | 已登录 Session 如何处理 |

### 兼容场景

| 场景 | 测试点 |
|------|--------|
| Web/App/小程序多端 | 登录状态同步、Token 共享或隔离 |
| 不同浏览器 Cookie 策略 | Session-Cookie 在无 Cookie 环境的替代方案 |
| 低版本客户端 | Token 格式变更后的兼容处理 |

---

## 自动化策略

登录鉴权的核心链路高度适合自动化覆盖：

### 推荐自动化覆盖的部分

- **正向流程**：登录成功返回 Token、Token 校验通过
- **反向流程**：密码错误、Token 过期、签名非法
- **权限边界**：不同角色 Token 的接口访问权限
- **状态失效**：登出后 Token 失效、密码修改后 Token 失效

### 适合手工测试的部分

- **暴力破解防护**：需要观察多次失败后的行为（锁定时间、提示变化）
- **多设备交互**：真实设备上的登录状态同步体验
- **安全渗透**：专业安全测试人员进行的 XSS、CSRF 攻击模拟

```python
# 自动化测试示例：核心链路自动化覆盖
class TestAuthFlow:
    def test_login_logout_cycle(self):
        """完整的登录-使用-登出流程"""
        token = login("testuser", "correct_pwd")
        assert is_token_valid(token)
        logout(token)
        assert not is_token_valid(token)

    def test_permission_isolation(self):
        """权限隔离：用户 A 不能操作用户 B 数据"""
        token_a = login("user_a", "pwd")
        token_b = login("user_b", "pwd")
        # 用户 A 尝试获取用户 B 的订单
        response = api_client.get("/orders/b", headers={"Authorization": token_a})
        assert response.status_code == 403
```

---

## 数据准备和环境依赖

### 测试数据准备

- **账号数据**：准备多种角色账号（普通用户、管理员、VIP）
- **过期 Token**：构造已过期的 JWT 用于过期测试
- **验证码数据**：模拟短信验证码发送和验证环境

### 环境依赖

- **Redis/Session 存储**：确保 Session 存储服务稳定
- **短信网关**：Mock 或真实短信服务（推荐 Mock 提高效率）
- **Token 服务**：独立的 Token 生成和校验服务（若有）

---

## 监控、告警和回滚

### 监控指标

| 指标 | 说明 |
|------|------|
| 登录成功率 | 正常范围 95%+，骤降需告警 |
| Token 校验延迟 | P99 < 50ms，超时影响用户体验 |
| 登录失败原因分布 | 区分密码错误、验证码错误、账号锁定等 |
| 异地登录次数 | 异常飙升可能表示账号被盗 |

### 告警规则

- 登录成功率骤降 10% 以上 → 告警
- Token 校验服务不可用 → 紧急告警
- 同一账号多地同时登录 → 安全告警

### 回滚和兜底

- **Token 服务故障**：临时降级为 Session 鉴权或缓存 Token 校验结果
- **验证码服务故障**：临时切换为账号密码登录
- **Redis 故障**：Session 数据持久化到数据库作为备份

---

## 面试回答骨架

"登录鉴权的测试，我会分五个步骤来回答：

**第一步：确认边界**——登录方式、鉴权机制、多端登录规则。

**第二步：拆风险**——身份伪造、权限混乱、状态不一致、并发性能。

**第三步：定维度**——功能正确性、安全性、状态一致性、多端兼容、性能。

**第四步：讲核心用例**——登录正向/反向、Token 有效/过期/篡改、登出失效、多端同步。

**第五步：讲保障策略**——自动化覆盖核心链路、监控登录成功率、准备降级方案。"

---

## 面试官可能追问

| 追问 | 应答要点 |
|------|---------|
| "Token 和 Session 有什么区别？怎么选？" | Session 服务端存储状态、Token 无状态可扩展；选型看并发规模和微服务架构 |
| "JWT Token 的安全风险有哪些？" | 签名泄露、无法主动失效、payload 明文可见；对策：短有效期、Refresh Token、敏感信息不入 payload |
| "如何防止暴力破解？" | 限制失败次数、账号锁定、验证码、IP 风控、行为分析 |
| "用户改密码后，已登录设备怎么处理？" | 理想方案：全部 Token 失效，强制重新登录；可设计过渡期通知用户 |

---

## 关联内容

- **实战项目**：[用户系统测试实战](/docs/project/user-system-test)——完整的登录鉴权项目测试案例
- **技术深入**：[API 测试](/docs/tech/api-testing)——鉴权接口的自动化测试技术
- **面试追问链**：[鉴权追问链](/docs/interview-chains/auth-chain)——登录鉴权相关的深度追问链路
- **概念补充**：[OAuth2 概念](/docs/glossary/oauth2)——第三方登录鉴权机制详解

---

## 下一步

完成登录鉴权场景题后，建议继续学习：

1. [权限变更测试](/docs/scenario/permission-change)——用户权限变更后的状态一致性测试
2. [支付回调测试](/docs/scenario/payment-callback)——鉴权在支付场景的特殊要求
3. [API 安全测试](/docs/tech/api-security)——深入鉴权接口的安全测试技术