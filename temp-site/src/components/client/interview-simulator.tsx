"use client";

import { useState } from "react";
import { getAllInterviewChains, getInterviewChain } from "@/content/interview-chains";
import { getAllTopics } from "@/content/data";
import type { InterviewChain } from "@/content/types";

type SimulationPhase = "selection" | "interview" | "results";

type StepRating = "good" | "normal" | "poor" | null;

type StepResult = {
  stepIndex: number;
  question: string;
  slug: string;
  rating: StepRating;
};

export function InterviewSimulator() {
  const chains = getAllInterviewChains();
  const allTopics = getAllTopics();

  // 查找主题的 answerHints
  const findAnswerHints = (slug: string): string[] => {
    const topic = allTopics.find((t) => t.slug === slug);
    if (topic && "answerHints" in topic) {
      return topic.answerHints || [];
    }
    return [];
  };

  // 状态
  const [phase, setPhase] = useState<SimulationPhase>("selection");
  const [currentChain, setCurrentChain] = useState<InterviewChain | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [stepResults, setStepResults] = useState<StepResult[]>([]);

  // 开始模拟
  const handleStartChain = (chainId: string) => {
    const chain = getInterviewChain(chainId);
    if (chain) {
      setCurrentChain(chain);
      setCurrentStepIndex(0);
      setShowHint(false);
      setStepResults([]);
      setPhase("interview");
    }
  };

  // 显示答案提示
  const handleReady = () => {
    setShowHint(true);
  };

  // 自我评分
  const handleRating = (rating: StepRating) => {
    const currentStep = currentChain!.steps[currentStepIndex];
    const newResult: StepResult = {
      stepIndex: currentStepIndex,
      question: currentStep.question,
      slug: currentStep.slug,
      rating,
    };

    setStepResults((prev) => {
      const filtered = prev.filter((r) => r.stepIndex !== currentStepIndex);
      return [...filtered, newResult];
    });
  };

  // 下一题
  const handleNext = () => {
    if (currentStepIndex < currentChain!.steps.length - 1) {
      setCurrentStepIndex((i) => i + 1);
      setShowHint(false);
    } else {
      setPhase("results");
    }
  };

  // 重新开始当前链
  const handleRestart = () => {
    if (currentChain) {
      setCurrentStepIndex(0);
      setShowHint(false);
      setStepResults([]);
      setPhase("interview");
    }
  };

  // 选择其他链
  const handleSelectOther = () => {
    setCurrentChain(null);
    setCurrentStepIndex(0);
    setShowHint(false);
    setStepResults([]);
    setPhase("selection");
  };

  // 计算统计数据
  const getStats = () => {
    const good = stepResults.filter((r) => r.rating === "good").length;
    const normal = stepResults.filter((r) => r.rating === "normal").length;
    const poor = stepResults.filter((r) => r.rating === "poor").length;
    return { good, normal, poor, total: stepResults.length };
  };

  // 当前步骤
  const currentStep = currentChain?.steps[currentStepIndex];
  const currentHints = currentStep ? findAnswerHints(currentStep.slug) : [];

  // 阶段 1: 选择追问链
  if (phase === "selection") {
    return (
      <div className="interview-simulator">
        <div className="simulator-header">
          <h2>模拟面试</h2>
          <p>选择一条追问链，开始模拟面试练习</p>
        </div>

        <div className="chains-grid">
          {chains.map((chain) => (
            <div key={chain.id} className="chain-card">
              <div className="chain-header">
                <h3>{chain.title}</h3>
                <span className="chain-category">{chain.category}</span>
              </div>
              <p className="chain-description">{chain.description}</p>
              <div className="chain-meta">
                <span className="step-count">共 {chain.steps.length} 步追问</span>
              </div>
              <button
                type="button"
                className="button-primary"
                onClick={() => handleStartChain(chain.id)}
              >
                开始模拟
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 阶段 2: 面试进行中
  if (phase === "interview" && currentChain && currentStep) {
    const currentResult = stepResults.find((r) => r.stepIndex === currentStepIndex);
    const hasRating = currentResult?.rating !== undefined && currentResult?.rating !== null;

    return (
      <div className="interview-simulator">
        <div className="simulator-progress">
          <div className="progress-info">
            <span>{currentChain.title}</span>
            <span>
              第 {currentStepIndex + 1} / {currentChain.steps.length} 步
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentStepIndex + 1) / currentChain.steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="interview-content">
          <h3 className="question-title">{currentStep.question}</h3>

          {!showHint ? (
            <button
              type="button"
              className="button-secondary"
              onClick={handleReady}
            >
              我准备好了
            </button>
          ) : (
            <div className="hint-section">
              <div className="hint-title">参考答案提示</div>
              {currentHints.length > 0 ? (
                <ul className="hint-list">
                  {currentHints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              ) : (
                <p className="hint-placeholder">
                  暂无标准答案提示，请结合你的理解和经验回答
                </p>
              )}

              <div className="rating-section">
                <span className="rating-label">请评价你的回答：</span>
                <div className="rating-buttons">
                  <button
                    type="button"
                    className={`rating-button ${currentResult?.rating === "good" ? "rating-good selected" : "rating-good"}`}
                    onClick={() => handleRating("good")}
                  >
                    答得好
                  </button>
                  <button
                    type="button"
                    className={`rating-button ${currentResult?.rating === "normal" ? "rating-normal selected" : "rating-normal"}`}
                    onClick={() => handleRating("normal")}
                  >
                    一般
                  </button>
                  <button
                    type="button"
                    className={`rating-button ${currentResult?.rating === "poor" ? "rating-poor selected" : "rating-poor"}`}
                    onClick={() => handleRating("poor")}
                  >
                    不好
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="button-primary next-button"
                onClick={handleNext}
                disabled={!hasRating}
              >
                {currentStepIndex < currentChain.steps.length - 1 ? "下一题" : "完成模拟"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 阶段 3: 结果展示
  if (phase === "results" && currentChain) {
    const stats = getStats();

    return (
      <div className="interview-simulator">
        <div className="results-header">
          <h2>{currentChain.title}</h2>
          <p className="completion-status">模拟完成</p>
        </div>

        <div className="results-stats">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">总题数</span>
          </div>
          <div className="stat-card stat-good">
            <span className="stat-number">{stats.good}</span>
            <span className="stat-label">答得好</span>
          </div>
          <div className="stat-card stat-normal">
            <span className="stat-number">{stats.normal}</span>
            <span className="stat-label">一般</span>
          </div>
          <div className="stat-card stat-poor">
            <span className="stat-number">{stats.poor}</span>
            <span className="stat-label">需复习</span>
          </div>
        </div>

        <div className="results-details">
          <h3>详细记录</h3>
          {stepResults.map((result, index) => (
            <div key={index} className="result-item">
              <div className="result-step">
                <span className="step-number">第 {result.stepIndex + 1} 步</span>
                <span className={`result-rating rating-${result.rating}`}>
                  {result.rating === "good" ? "答得好" : result.rating === "normal" ? "一般" : "需复习"}
                </span>
              </div>
              <p className="result-question">{result.question}</p>
            </div>
          ))}
        </div>

        <div className="results-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={handleRestart}
          >
            重新开始
          </button>
          <button
            type="button"
            className="button-primary"
            onClick={handleSelectOther}
          >
            选择其他追问链
          </button>
        </div>
      </div>
    );
  }

  return null;
}
