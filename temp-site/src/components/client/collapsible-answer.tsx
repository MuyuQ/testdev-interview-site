"use client";

import { useState } from "react";

type CollapsibleAnswerProps = {
  answer: string;
};

export function CollapsibleAnswer({ answer }: CollapsibleAnswerProps) {
  const [folded, setFolded] = useState(true);

  return (
    <div className="collapsible-answer" data-folded={folded}>
      {folded ? null : <p className="collapsible-content">{answer}</p>}
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