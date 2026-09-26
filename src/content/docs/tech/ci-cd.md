---
title: "CI/CD"
description: "持续集成与持续部署：自动化构建、测试、部署流水线，实现代码提交到生产发布的全流程自动化"
category: "tech"
stage: "practice"
estimatedMinutes: 24
difficulty: "interview"
interviewWeight: 3
tags: ["工程化", "DevOps", "自动化", "质量门禁", "流水线"]
prerequisites:
  - "beginner-course/pytest-first-test"
  - "tech/pytest"
  - "glossary/quality-gate"
outcomes:
  - "能配置 push 触发自动跑 pytest 的流水线"
  - "能设置覆盖率低于阈值即阻断的质量门禁"
  - "面试时能讲清 CI 与 CD 的区别与价值"
relatedSlugs:
  ["tech/docker-testing", "coding/assertion-wrapper", "glossary/api-assertion"]
selfTests:
  - id: "ci-cd-q1"
    question: "CI/CD 的核心价值是什么？"
    options:
      [
        "减少代码量",
        "自动化构建、测试、部署，提升交付效率和质量",
        "替代人工测试",
        "只用于生产环境",
      ]
    correctIndex: 1
    explanation: "CI/CD 通过自动化流水线，将代码提交自动流转到生产发布，减少人工错误，提升交付效率和质量保障。"
  - id: "ci-cd-q2"
    question: "GitHub Actions 中 workflow 的触发条件通常有哪些？"
    options:
      [
        "只能手动触发",
        "push、pull_request、schedule 等事件",
        "只能定时触发",
        "只能通过 API 触发",
      ]
    correctIndex: 1
    explanation: "GitHub Actions 支持多种触发方式，包括 push、pull_request、schedule、workflow_dispatch 等，灵活适应不同场景。"
  - id: "ci-cd-q3"
    question: "什么是质量门禁（Quality Gate）？"
    options:
      [
        "代码审查工具",
        "一组质量指标阈值，不达标则阻断流水线",
        "测试报告生成器",
        "部署策略",
      ]
    correctIndex: 1
    explanation: "质量门禁定义了代码质量、测试覆盖率等指标的最低要求，不满足条件时自动阻断流水线，防止劣质代码进入下一阶段。"
  - id: "ci-cd-q4"
    question: "Jenkins Pipeline 与 GitHub Actions 的主要区别是什么？"
    options:
      [
        "没有区别",
        "Jenkins 需自建服务器，GitHub Actions 云端托管",
        "GitHub Actions 功能更少",
        "Jenkins 只能用于 Java 项目",
      ]
    correctIndex: 1
    explanation: "Jenkins 需要自建服务器维护，灵活性高；GitHub Actions 是云托管的 CI/CD 服务，开箱即用，与 GitHub 深度集成。"
  - id: "ci-cd-q5"
    question: "流水线里某条测试用例偶发失败（本地无法复现），最合理的处理方式是？"
    options:
      [
        "反复手动重跑直到变绿",
        "标记隔离并记录，排查根因后修复或删除",
        "直接删除该用例",
        "把重试次数调到 10",
      ]
    correctIndex: 1
    explanation: "偶发失败（flaky test）会快速消耗团队对流水线的信任，正确做法是先隔离（如 quarantine 标记单独跑、不阻断主干），再排查根因：环境依赖、时序问题或用例设计缺陷，修复后再回归主干。盲目重跑或调大重试只是掩盖问题。"
---

## 1. 这项技术解决什么问题

CI/CD 解决的是软件开发交付过程中的核心痛点：

- **手工部署易出错**：人工执行部署步骤，遗漏配置、环境差异导致线上故障
- **集成地狱**：长期不集成，合并代码时大量冲突和兼容性问题
- **反馈周期长**：问题发现太晚，修复成本指数级增长
- **质量不可控**：缺少自动化质量检查，问题代码流入生产环境
- **重复劳动多**：构建、测试、部署流程重复繁琐，浪费开发时间

CI/CD 通过自动化流水线，将代码提交后的构建、测试、部署流程标准化、自动化，实现"提交即测试，通过即部署"的理想状态。

## 2. 面试为什么会问

面试官考察 CI/CD，背后的意图是：

- **工程化思维**：是否理解自动化流水线的价值，而非仅关注测试用例编写
- **实践经验**：是否真正搭建过 CI/CD 流水线，解决过实际问题
- **质量意识**：是否将质量门禁作为开发流程的一部分
- **技术选型能力**：能否根据团队情况选择合适的 CI/CD 工具

这个问题能区分出"只会写测试"和"能搭建测试基础设施"的候选人，是考察测试开发能力的关键指标。

## 3. 学习前置条件

开始学习 CI/CD 前，建议掌握：

- **版本控制基础**：Git 基本操作、分支管理、Pull Request 流程
- **测试基础**：单元测试、集成测试概念，测试框架使用
- **命令行基础**：Shell 脚本、环境变量、进程管理
- **YAML 语法**：流水线配置文件格式
- **容器基础**：Docker 镜像、容器概念（用于容器化构建环境）

如果对 Git 完全陌生，建议先学习 Git 基础操作。

## 4. 核心概念拆解

### 4.1 持续集成（CI）

开发人员频繁地将代码集成到主干分支，每次集成都通过自动化构建和测试验证：

- **代码提交**：触发流水线的起点
- **自动构建**：编译代码、安装依赖、打包产物
- **自动化测试**：运行单元测试、集成测试、静态代码检查
- **结果反馈**：成功则进入下一阶段，失败则通知开发者修复

### 4.2 持续部署（CD）

将通过测试的代码自动部署到各个环境：

- **部署环境**：开发、测试、预发布、生产等多环境管理
- **部署策略**：蓝绿部署、金丝雀发布、滚动更新
- **回滚机制**：部署失败时自动回滚到稳定版本

### 4.3 GitHub Actions 核心

GitHub Actions 是 GitHub 原生的 CI/CD 服务：

```yaml
# .github/workflows/test.yml
name: Test Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov

      - name: Run tests
        run: pytest --cov=src --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v4
```

### 4.4 Jenkins Pipeline 核心

Jenkins 是经典的 CI/CD 工具，灵活性高：

```groovy
// Jenkinsfile
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }

        stage('Test') {
            steps {
                sh 'pytest --junitxml=report.xml'
            }
            post {
                always {
                    junit 'report.xml'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    def coverage = sh(
                        script: 'pytest --cov=src --cov-report=term | grep TOTAL | awk \'{print $4}\'',
                        returnStdout: true
                    ).trim().replace('%', '') as Integer

                    if (coverage < 80) {
                        error "Coverage ${coverage}% is below threshold 80%"
                    }
                }
            }
        }
    }
}
```

### 4.5 质量门禁（Quality Gate）

质量门禁定义了代码进入下一阶段的最低标准：

- **代码覆盖率**：单元测试覆盖率不低于阈值（如 80%）
- **静态代码分析**：SonarQube 扫描无严重问题
- **安全扫描**：无高危漏洞
- **测试通过率**：所有测试用例必须通过
- **代码审查**：PR 必须经过审查通过

### 4.6 触发器设计与并发控制

触发策略决定了"什么时候跑什么"，配置不当要么浪费时间要么漏测：

```yaml
on:
  push:
    branches: [main, develop]
    paths-ignore:
      - "**.md" # 文档改动不触发测试
      - "docs/**"
  pull_request:
    branches: [main]
  workflow_dispatch: # 支持手动触发，可传参
    inputs:
      test_level:
        description: "测试层级"
        default: "smoke"

# 同一分支新提交自动取消旧的运行，省资源
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

三个要点：

- `paths-ignore` 过滤纯文档改动，避免"改个 README 也跑 20 分钟流水线"
- `concurrency` 让同一 PR 的新提交取消未完成的旧构建，高频提交场景能省一半 runner 资源
- 手动触发（`workflow_dispatch`）用于发布前按需补跑全量回归，通过输入参数控制跑哪一层

## 5. 最小可运行例子

创建一个完整的 GitHub Actions 测试流水线示例：

**项目结构**：

```
demo/
├── .github/
│   └── workflows/
│       └── test.yml
├── src/
│   └── calculator.py
├── tests/
│   └── test_calculator.py
└── requirements.txt
```

**src/calculator.py**：

```python
def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b
```

**tests/test_calculator.py**：

```python
import pytest
from src.calculator import add, divide

def test_add():
    assert add(1, 2) == 3

def test_divide():
    assert divide(6, 2) == 3

def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(1, 0)
```

**.github/workflows/test.yml**：

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install pytest pytest-cov
          pip install -r requirements.txt

      - name: Run tests with coverage
        run: pytest --cov=src --cov-fail-under=80

      - name: Quality Gate - Check coverage
        run: |
          coverage=$(pytest --cov=src --cov-report=term | grep TOTAL | awk '{print $4}')
          echo "Coverage: ${coverage}"
          if [ "${coverage%\%}" -lt 80 ]; then
            echo "Quality gate failed: coverage below 80%"
            exit 1
          fi
```

## 6. 在项目中怎么落地

### 6.1 分阶段实施策略

**第一阶段：基础 CI**

- 配置自动触发测试
- 运行单元测试和集成测试
- 测试失败通知开发者

**第二阶段：质量门禁**

- 添加代码覆盖率检查
- 集成静态代码分析（SonarQube/CodeClimate）
- 配置安全扫描（Snyk/Dependabot）

**第三阶段：持续部署**

- 自动部署到测试环境
- 手动审批后部署到生产环境
- 实现蓝绿部署或金丝雀发布

### 6.2 多环境流水线

```yaml
# 完整的 CI/CD 流水线示例
name: Full Pipeline

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: pytest

  quality-gate:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - name: Coverage check
        run: pytest --cov=src --cov-fail-under=80

  deploy-staging:
    runs-on: ubuntu-latest
    needs: quality-gate
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to staging
        run: echo "Deploying to staging..."

  deploy-production:
    runs-on: ubuntu-latest
    needs: quality-gate
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to production
        run: echo "Deploying to production..."
```

### 6.3 Jenkins 与 GitHub Actions 对比

| 特性        | Jenkins          | GitHub Actions               |
| ----------- | ---------------- | ---------------------------- |
| 部署方式    | 自建服务器       | 云托管                       |
| 维护成本    | 高（需专人维护） | 低（GitHub 托管）            |
| 灵活性      | 极高             | 中等                         |
| GitHub 集成 | 需配置           | 原生集成                     |
| 费用        | 免费（自建）     | 公开仓库免费，私有仓库有额度 |
| 插件生态    | 丰富的插件市场   | Actions Marketplace          |

## 7. 常见坑和排查方法

### 坑1：流水线中的秘密泄露

**现象**：敏感信息（API Key、密码）出现在日志中

**原因**：直接使用环境变量或 echo 输出敏感信息

**解决**：

```yaml
env:
  API_KEY: ${{ secrets.API_KEY }} # 使用 GitHub Secrets

steps:
  - name: Use secret safely
    run: |
      # 不要直接 echo，使用文件传递
      echo "${{ secrets.API_KEY }}" > ~/.api_key
      # 在后续步骤中使用文件
```

### 坑2：测试环境不一致

**现象**：本地测试通过，CI 中失败

**排查**：

```yaml
- name: Debug environment
  run: |
    python --version
    pip list
    echo "PYTHONPATH=$PYTHONPATH"
```

**解决**：使用 Docker 容器保证环境一致性

### 坑3：并发构建冲突

**现象**：多个 PR 同时构建时互相干扰

**解决**：

```yaml
# 使用矩阵并行测试
strategy:
  matrix:
    python-version: ["3.9", "3.10", "3.11"]
    os: [ubuntu-latest, windows-latest]
```

### 坑4：缓存失效导致构建慢

**现象**：每次构建都要重新安装依赖，耗时很长

**解决**：

```yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-
```

## 8. 面试追问与回答骨架

### Q1：你们团队的 CI/CD 流程是怎样的？

回答骨架：

1. 开发者提交 PR，自动触发 CI 流水线
2. 运行单元测试、集成测试，检查代码覆盖率
3. 静态代码分析和安全扫描
4. 代码审查通过后合并到主干
5. 自动部署到测试环境验证
6. 手动审批后部署到生产环境

### Q2：如何处理 CI/CD 中的故障？

回答骨架：

1. 查看流水线日志定位失败步骤
2. 区分是代码问题还是环境问题
3. 本地复现问题进行调试
4. 修复后重新触发流水线
5. 记录问题和解决方案，避免重复

### Q3：如何平衡 CI/CD 的速度和质量？

回答骨架：

1. 分层测试：快速单元测试先行，耗时集成测试后置
2. 并行执行：利用矩阵策略并行运行测试
3. 增量测试：只运行受影响代码的测试
4. 缓存优化：缓存依赖减少安装时间
5. 质量门禁设置合理阈值，避免过严影响效率

### Q4：流水线里的 flaky 用例怎么治理？

回答骨架：

1. 先统计：从流水线日志聚合每条用例的重跑率，列出高抖动清单
2. 再隔离：quarantine 标记单独执行，失败不阻断主干
3. 后根治：逐条分析根因——时序依赖、共享数据、外部依赖抖动，修一条回归一条
4. 定红线：quarantine 列表只减不增，新增必须说明理由

### Q5：流水线总耗时超过 30 分钟，你怎么把它压下来？

回答骨架：

1. 分层触发：PR 只跑 smoke 和单元测试，全量放合并后或夜间
2. 并行拆分：xdist 多进程 + 矩阵策略按模块分片
3. 缓存命中：pip 缓存、Docker 层缓存，依赖安装从几分钟压到十几秒
4. 取消无效构建：concurrency 取消过期运行
5. 慢用例分析：`pytest --durations` 找出 Top 10 慢用例，该 mock 的 mock、该并行的并行

## 9. 练习任务

1. **基础练习**：为一个 Python 项目配置 GitHub Actions，实现 push 时自动运行测试

2. **进阶练习**：添加代码覆盖率检查，要求覆盖率低于 80% 时流水线失败

3. **综合练习**：配置完整的 CI/CD 流水线，包含测试、质量门禁、自动部署到测试环境

4. **挑战练习**：使用 Jenkins 搭建本地 CI/CD 服务，配置 Pipeline 实现多环境部署

## 性能与规模化

流水线速度是工程化能力的直观指标，规模化阶段重点做四件事：

**1. 分层触发策略**

| 触发时机 | 运行范围              | 目标耗时       |
| -------- | --------------------- | -------------- |
| PR 提交  | smoke + 单元测试      | 5 分钟内       |
| 合并主干 | 全量接口回归          | 20 分钟内      |
| 夜间定时 | 集成 + E2E + 性能采样 | 不限时，出报告 |

**2. 依赖与构建缓存**

```yaml
- uses: actions/setup-python@v5
  with:
    python-version: "3.11"
    cache: "pip" # 一行开启 pip 缓存，命中后安装只需几秒
```

**3. 测试分片**

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - run: pytest --splits 4 --group ${{ matrix.shard }}
    # pytest-split 插件按历史耗时均衡分组，避免某一片特别慢
```

**4. 制品管理**：测试报告、日志、覆盖率文件统一按 `retention-days: 7` 归档，失败时从制品定位而不是重跑复现；超大日志先截断再上传，避免存储和下载拖慢排查。

原则：先测出瓶颈在哪一段（依赖安装、用例收集、执行、报告上传），再针对性优化；没有数据支撑的优化往往白做。

## 10. 关联内容

- **Docker 测试环境**：CI/CD 中使用容器化环境保证一致性
- **测试框架**：pytest、JUnit 等测试框架的 CI 集成
- **代码质量**：SonarQube 静态代码分析与质量门禁
- **安全测试**：SAST/DAST 安全扫描集成到流水线
- **性能测试**：将性能测试纳入 CI/CD 流程

## 11. 下一步

搭好流水线后，建议往"质量可观测、交付可回滚"演进：

1. **环境一致性**：用 [Docker 测试](/testdev-interview-site/tech/docker-testing/) 容器化构建与测试环境，消除"本地能跑"
2. **测试分层**：把 [接口测试](/testdev-interview-site/tech/api-testing/)、[数据库测试](/testdev-interview-site/tech/database-testing/) 分阶段接入流水线
3. **报告闭环**：接 Allure / JUnit 报告，让失败用例可一键定位
4. **工程实战**：参考 [项目模块](/testdev-interview-site/project/) 把流水线包装成可展示的项目成果

面试冲刺讲清"如何平衡速度与质量""并发构建冲突怎么解"。
