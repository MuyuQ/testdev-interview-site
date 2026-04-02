"use client";

import { useState, useCallback } from "react";
import { getAllTopics } from "@/content";
import type { TopicCategory, ContentTopic, GlossaryTerm, StandardTopic } from "@/content/types";
import { useQuizHistory } from "@/hooks/use-quiz-history";
import { categoryConfig } from "@/lib/site-config";

type ScopeOption = "all" | TopicCategory;
type DifficultyOption = "all" | "beginner" | "interview";
type QuizCount = 5 | 10 | 20;
type Rating = "good" | "average" | "poor";

type QuizItem = {
  topicSlug: string;
  topicTitle: string;
  category: TopicCategory;
  question: string;
  answerHint: string;
};

type QuizPhase = "config" | "quiz" | "results";

type RatingStats = {
  good: number;
  average: number;
  poor: number;
};

export function RandomQuiz({ onClose }: { onClose?: () => void }) {
  const { saveSession } = useQuizHistory();

  // 配置阶段状态
  const [scope, setScope] = useState<ScopeOption>("all");
  const [difficulty, setDifficulty] = useState<DifficultyOption>("all");
  const [count, setCount] = useState<QuizCount>(5);
  const [phase, setPhase] = useState<QuizPhase>("config");

  // 抽题阶段状态
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);

  // 从所有 Topics 中筛选并随机抽取问题
  const filterAndSelectQuestions = useCallback(() => {
    const allTopics = getAllTopics();

    // 按范围（分类）筛选
    let filtered = allTopics.filter((topic): topic is GlossaryTerm | StandardTopic => {
      // 只选择有 frequentQuestions 和 answerHints 的内容
      const hasQuizContent =
        "frequentQuestions" in topic &&
        Array.isArray(topic.frequentQuestions) &&
        topic.frequentQuestions.length > 0 &&
        "answerHints" in topic &&
        Array.isArray(topic.answerHints) &&
        topic.answerHints.length > 0;

      if (!hasQuizContent) return false;

      // 按范围筛选
      if (scope !== "all" && topic.category !== scope) return false;

      // 按难度筛选
      if (difficulty !== "all" && topic.difficulty !== difficulty) return false;

      return true;
    });

    // 收集所有可选的问题
    const allQuizItems: QuizItem[] = [];
    filtered.forEach((topic) => {
      const glossaryTopic = topic as GlossaryTerm;
      glossaryTopic.frequentQuestions.forEach((question, index) => {
        const answerHint = glossaryTopic.answerHints[index] || "暂无参考答案";
        allQuizItems.push({
          topicSlug: topic.slug,
          topicTitle: topic.title,
          category: topic.category,
          question,
          answerHint,
        });
      });
    });

    // 随机打乱并选择 N 道题
    const shuffled = allQuizItems.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, [scope, difficulty, count]);

  // 开始抽题
  const handleStart = () => {
    const selected = filterAndSelectQuestions();
    if (selected.length === 0) {
      alert("当前筛选条件下没有找到合适的题目，请调整筛选条件。");
      return;
    }
    setQuizItems(selected);
    setCurrentIndex(0);
    setRatings([]);
    setShowAnswer(false);
    setPhase("quiz");
  };

  // 显示答案
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  // 自我评分
  const handleRating = (rating: Rating) => {
    const newRatings = [...ratings, rating];
    setRatings(newRatings);

    if (currentIndex < quizItems.length - 1) {
      // 还有下一题
      setCurrentIndex((i) => i + 1);
      setShowAnswer(false);
    } else {
      // 最后一题，进入结果页面
      setPhase("results");
      // 保存会话到历史记录
      const session = {
        id: `quiz-${Date.now()}`,
        scope: scope === "all" ? "全站" : categoryConfig[scope].title,
        count: quizItems.length,
        results: quizItems.map((item, index) => ({
          topicSlug: item.topicSlug,
          question: item.question,
          rating: newRatings[index],
          timestamp: new Date().toISOString(),
        })),
        completedAt: new Date().toISOString(),
      };
      saveSession(session);
    }
  };

  // 下一题（跳过评分）
  const handleNext = () => {
    if (currentIndex < quizItems.length - 1) {
      setCurrentIndex((i) => i + 1);
      setShowAnswer(false);
    } else {
      setPhase("results");
      // 未评分的题目计为"一般"
      const finalRatings = [...ratings, ...new Array(quizItems.length - ratings.length).fill("average" as Rating)];
      const session = {
        id: `quiz-${Date.now()}`,
        scope: scope === "all" ? "全站" : categoryConfig[scope].title,
        count: quizItems.length,
        results: quizItems.map((item, index) => ({
          topicSlug: item.topicSlug,
          question: item.question,
          rating: finalRatings[index],
          timestamp: new Date().toISOString(),
        })),
        completedAt: new Date().toISOString(),
      };
      saveSession(session);
    }
  };

  // 重新抽题
  const handleReset = () => {
    setPhase("config");
    setQuizItems([]);
    setCurrentIndex(0);
    setRatings([]);
    setShowAnswer(false);
  };

  // 计算统计数据
  const stats: RatingStats = {
    good: ratings.filter((r) => r === "good").length,
    average: ratings.filter((r) => r === "average").length,
    poor: ratings.filter((r) => r === "poor").length,
  };

  // 渲染配置阶段
  if (phase === "config") {
    return (
      <div className="random-quiz-panel">
        <div className="random-quiz-header">
          <h2>随机抽题</h2>
          <p>自定义抽题范围和数量，进行面试自测练习。</p>
        </div>

        <div className="random-quiz-config">
          <div className="config-group">
            <label className="config-label">出题范围</label>
            <div className="config-options">
              <button
                type="button"
                className={`config-btn ${scope === "all" ? "active" : ""}`}
                onClick={() => setScope("all")}
              >
                全站
              </button>
              <button
                type="button"
                className={`config-btn ${scope === "glossary" ? "active" : ""}`}
                onClick={() => setScope("glossary")}
              >
                术语
              </button>
              <button
                type="button"
                className={`config-btn ${scope === "tech" ? "active" : ""}`}
                onClick={() => setScope("tech")}
              >
                技术专题
              </button>
              <button
                type="button"
                className={`config-btn ${scope === "project" ? "active" : ""}`}
                onClick={() => setScope("project")}
              >
                项目
              </button>
              <button
                type="button"
                className={`config-btn ${scope === "scenario" ? "active" : ""}`}
                onClick={() => setScope("scenario")}
              >
                场景题
              </button>
              <button
                type="button"
                className={`config-btn ${scope === "coding" ? "active" : ""}`}
                onClick={() => setScope("coding")}
              >
                编码题
              </button>
            </div>
          </div>

          <div className="config-group">
            <label className="config-label">难度级别</label>
            <div className="config-options">
              <button
                type="button"
                className={`config-btn ${difficulty === "all" ? "active" : ""}`}
                onClick={() => setDifficulty("all")}
              >
                全部
              </button>
              <button
                type="button"
                className={`config-btn ${difficulty === "beginner" ? "active" : ""}`}
                onClick={() => setDifficulty("beginner")}
              >
                入门
              </button>
              <button
                type="button"
                className={`config-btn ${difficulty === "interview" ? "active" : ""}`}
                onClick={() => setDifficulty("interview")}
              >
                面试
              </button>
            </div>
          </div>

          <div className="config-group">
            <label className="config-label">题目数量</label>
            <div className="config-options">
              <button
                type="button"
                className={`config-btn ${count === 5 ? "active" : ""}`}
                onClick={() => setCount(5)}
              >
                5 题
              </button>
              <button
                type="button"
                className={`config-btn ${count === 10 ? "active" : ""}`}
                onClick={() => setCount(10)}
              >
                10 题
              </button>
              <button
                type="button"
                className={`config-btn ${count === 20 ? "active" : ""}`}
                onClick={() => setCount(20)}
              >
                20 题
              </button>
            </div>
          </div>

          <div className="config-actions">
            <button type="button" className="button-primary" onClick={handleStart}>
              开始抽题
            </button>
            {onClose && (
              <button type="button" className="button-secondary" onClick={onClose}>
                关闭
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 渲染抽题阶段
  if (phase === "quiz") {
    const currentItem = quizItems[currentIndex];

    return (
      <div className="random-quiz-panel">
        <div className="random-quiz-header">
          <div className="quiz-progress">
            <span className="progress-text">
              第 {currentIndex + 1} 题 / 共 {quizItems.length} 题
            </span>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${((currentIndex + 1) / quizItems.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="random-quiz-question">
          <div className="question-meta">
            <span className="category-tag">{categoryConfig[currentItem.category].navLabel}</span>
            <span className="topic-title">{currentItem.topicTitle}</span>
          </div>

          <h3 className="question-text">{currentItem.question}</h3>

          {!showAnswer ? (
            <div className="answer-section">
              <button type="button" className="button-secondary" onClick={handleShowAnswer}>
                显示答案
              </button>
            </div>
          ) : (
            <div className="answer-section revealed">
              <div className="answer-content">
                <strong>参考答案：</strong>
                <p>{currentItem.answerHint}</p>
              </div>

              <div className="rating-section">
                <p className="rating-label">你觉得答得怎么样？</p>
                <div className="rating-buttons">
                  <button
                    type="button"
                    className="rating-btn good"
                    onClick={() => handleRating("good")}
                  >
                    ✓ 答得好
                  </button>
                  <button
                    type="button"
                    className="rating-btn average"
                    onClick={() => handleRating("average")}
                  >
                    ~ 一般
                  </button>
                  <button
                    type="button"
                    className="rating-btn poor"
                    onClick={() => handleRating("poor")}
                  >
                    ✗ 不好
                  </button>
                </div>
              </div>

              {currentIndex < quizItems.length - 1 && (
                <div className="next-section">
                  <button type="button" className="button-primary" onClick={handleNext}>
                    跳过 → 下一题
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 渲染结果阶段
  if (phase === "results") {
    const total = ratings.length;
    const goodRate = total > 0 ? Math.round((stats.good / total) * 100) : 0;
    const averageRate = total > 0 ? Math.round((stats.average / total) * 100) : 0;
    const poorRate = total > 0 ? Math.round((stats.poor / total) * 100) : 0;

    return (
      <div className="random-quiz-panel">
        <div className="random-quiz-results">
          <h2>抽题完成</h2>
          <p className="results-summary">
            完成 {quizItems.length} 道题目，答得好 {stats.good} 题（{goodRate}%）
          </p>

          <div className="stats-grid">
            <div className="stat-card good">
              <span className="stat-number">{stats.good}</span>
              <span className="stat-label">答得好</span>
              <span className="stat-rate">{goodRate}%</span>
            </div>
            <div className="stat-card average">
              <span className="stat-number">{stats.average}</span>
              <span className="stat-label">一般</span>
              <span className="stat-rate">{averageRate}%</span>
            </div>
            <div className="stat-card poor">
              <span className="stat-number">{stats.poor}</span>
              <span className="stat-label">不好</span>
              <span className="stat-rate">{poorRate}%</span>
            </div>
          </div>

          <div className="results-actions">
            <button type="button" className="button-primary" onClick={handleReset}>
              重新抽题
            </button>
            {onClose && (
              <button type="button" className="button-secondary" onClick={onClose}>
                关闭
              </button>
            )}
          </div>

          <div className="results-note">
            <p>本次抽题记录已保存到本地，可在抽题历史中查看。</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
