"use client";

import { Fragment, useState } from "react";

type CollapsibleAnswerProps = {
  answer: string;
};

// 处理换行符，保留段落层次感
function renderWithLineBreaks(text: string) {
  // 先按双换行分割成段落
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((paragraph, pIndex) => (
    <Fragment key={pIndex}>
      {pIndex > 0 && <br />}
      {/* 段落内的单换行 */}
      {paragraph.split("\n").map((line, lineIndex, arr) => (
        <Fragment key={lineIndex}>
          {line}
          {lineIndex < arr.length - 1 && <br />}
        </Fragment>
      ))}
    </Fragment>
  ));
}

export function CollapsibleAnswer({ answer }: CollapsibleAnswerProps) {
  const [folded, setFolded] = useState(true);

  return (
    <div className="collapsible-answer" data-folded={folded}>
      {folded ? null : (
        <p className="collapsible-content">{renderWithLineBreaks(answer)}</p>
      )}
      <button
        type="button"
        className="collapsible-trigger button-reset"
        onClick={() => setFolded(!folded)}
      >
        {folded ? "展开答案" : "折叠答案"}
      </button>
    </div>
  );
}