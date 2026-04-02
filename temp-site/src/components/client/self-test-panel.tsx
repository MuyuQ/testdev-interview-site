"use client";

import { useState } from "react";
import { useSelfTest } from "@/hooks/use-selftest";
import type { TopicSelfTests } from "@/content/types";

type SelfTestPanelProps = {
  topicSlug: string;
  tests: TopicSelfTests;
};

export function SelfTestPanel({ topicSlug, tests }: SelfTestPanelProps) {
  const { saveRecord, getRecord } = useSelfTest();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const currentQuestion = tests.questions[currentIndex];
  const totalQuestions = tests.questions.length;
  const lastRecord = getRecord(topicSlug);

  const handleStart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setIsComplete(false);
    setCorrectCount(0);
    setAnswers(new Array(totalQuestions).fill(null));
  };

  const handleSelectOption = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setShowResult(true);
  };

  const handleNext = () => {
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;

    if (currentIndex < totalQuestions - 1) {
      setCorrectCount(newCorrectCount);
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      const finalScore = newCorrectCount;
      setCorrectCount(finalScore);
      saveRecord(topicSlug, finalScore, totalQuestions);
      setIsComplete(true);
    }
  };

  // 初始状态：显示开始按钮
  if (currentIndex === 0 && !showResult && selectedOption === null && !isComplete) {
    return (
      <div className="self-test-panel">
        <div className="self-test-intro">
          <h3>自测练习</h3>
          <p>共 {totalQuestions} 题，检验你对本内容的理解程度。</p>
          {lastRecord && (
            <p className="last-score">
              上次得分：{lastRecord.score}/{lastRecord.total}
            </p>
          )}
          <button type="button" className="button-primary" onClick={handleStart}>
            开始自测
          </button>
        </div>
      </div>
    );
  }

  // 完成状态
  if (isComplete) {
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="self-test-panel">
        <div className="self-test-complete">
          <h3>测试完成</h3>
          <div className="score-display">
            <span className="score-number">{correctCount}/{totalQuestions}</span>
            <span className="score-percentage">{percentage}%</span>
          </div>
          <p className={percentage >= 80 ? "score-good" : "score-needs-work"}>
            {percentage >= 80 ? "掌握良好！" : "建议复习后再次测试。"}
          </p>
          <button type="button" className="button-secondary" onClick={handleStart}>
            重新测试
          </button>
        </div>
      </div>
    );
  }

  // 答题状态
  return (
    <div className="self-test-panel">
      <div className="self-test-header">
        <span className="question-progress">
          第 {currentIndex + 1} 题 / 共 {totalQuestions} 题
        </span>
      </div>

      <div className="self-test-question">
        <p className="question-text">{currentQuestion.question}</p>

        <div className="options-list">
          {currentQuestion.options.map((option, index) => {
            let optionClass = "option-item";
            if (showResult) {
              if (index === currentQuestion.correctIndex) {
                optionClass += " option-correct";
              } else if (index === selectedOption) {
                optionClass += " option-wrong";
              }
            } else if (index === selectedOption) {
              optionClass += " option-selected";
            }

            return (
              <button
                key={index}
                type="button"
                className={optionClass}
                onClick={() => handleSelectOption(index)}
                disabled={showResult}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className="result-section">
          <div className={selectedOption === currentQuestion.correctIndex ? "result-correct" : "result-wrong"}>
            {selectedOption === currentQuestion.correctIndex ? "✓ 回答正确" : "✗ 回答错误"}
          </div>
          <div className="explanation">
            <strong>解析：</strong>
            {currentQuestion.explanation}
          </div>
          <button type="button" className="button-primary" onClick={handleNext}>
            {currentIndex < totalQuestions - 1 ? "下一题" : "查看结果"}
          </button>
        </div>
      )}

      {!showResult && (
        <button
          type="button"
          className="button-primary"
          onClick={handleSubmit}
          disabled={selectedOption === null}
        >
          提交答案
        </button>
      )}
    </div>
  );
}
