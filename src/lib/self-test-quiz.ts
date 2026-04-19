function getInput(element: Element): HTMLInputElement | null {
  return element.querySelector("input");
}

export function initializeSelfTestQuiz(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-quiz]").forEach((quiz) => {
    if (quiz.dataset.bound === "true") {
      return;
    }

    const questions = quiz.querySelectorAll<HTMLElement>(".quiz-question");
    const summary = quiz.querySelector<HTMLElement>(".quiz-summary");
    const scoreEl = quiz.querySelector<HTMLElement>(".quiz-score");

    if (!summary || !scoreEl) {
      return;
    }

    let answered = 0;
    let correct = 0;

    quiz.querySelectorAll<HTMLButtonElement>(".quiz-check-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const question = btn.closest<HTMLElement>(".quiz-question");
        if (!question) {
          return;
        }

        const correctIndex = Number.parseInt(btn.dataset.correct ?? "", 10);
        const selected = question.querySelector<HTMLInputElement>("input:checked");
        const explanation =
          question.querySelector<HTMLElement>("[data-explanation]");

        if (!selected || !explanation || Number.isNaN(correctIndex)) {
          alert("请选择一个答案");
          return;
        }

        const selectedIndex = Number.parseInt(selected.value, 10);
        const options = question.querySelectorAll<HTMLElement>(".quiz-option");

        options.forEach((opt, index) => {
          opt.classList.toggle("correct", index === correctIndex);
          opt.classList.toggle(
            "wrong",
            index === selectedIndex && index !== correctIndex,
          );

          const input = getInput(opt);
          if (input) {
            input.disabled = true;
          }
        });

        if (selectedIndex === correctIndex) {
          correct += 1;
        }
        answered += 1;

        explanation.hidden = false;
        btn.disabled = true;
        btn.textContent = "已检查";

        if (answered === questions.length) {
          const total = questions.length;
          const percent = Math.round((correct / total) * 100);
          scoreEl.textContent = `答对 ${correct}/${total} 题 (${percent}%)`;
          summary.hidden = false;
          summary.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    const resetButton = quiz.querySelector<HTMLButtonElement>(".quiz-reset-btn");
    resetButton?.addEventListener("click", () => {
      answered = 0;
      correct = 0;
      summary.hidden = true;

      quiz.querySelectorAll<HTMLElement>(".quiz-question").forEach((question) => {
        question.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
          input.checked = false;
          input.disabled = false;
        });

        question.querySelectorAll<HTMLElement>(".quiz-option").forEach((opt) => {
          opt.classList.remove("correct", "wrong");
        });

        const checkButton =
          question.querySelector<HTMLButtonElement>(".quiz-check-btn");
        const explanation =
          question.querySelector<HTMLElement>("[data-explanation]");

        if (checkButton) {
          checkButton.disabled = false;
          checkButton.textContent = "检查答案";
        }

        if (explanation) {
          explanation.hidden = true;
        }
      });
    });

    quiz.dataset.bound = "true";
  });
}
