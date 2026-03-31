"use client";

import Link from "next/link";
import { useState } from "react";

type GlossaryPopoverProps = {
  slug: string;
  label: string;
  shortDefinition: string;
  definition?: string;
  example?: string;
};

export function GlossaryPopover({
  slug,
  label,
  shortDefinition,
  definition = "",
  example = "",
}: GlossaryPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="glossary-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="glossary-term"
        onClick={() => setOpen((current) => !current)}
      >
        {label}
      </button>
      {open ? (
        <span className="glossary-panel" role="note">
          <strong>{label}</strong>
          <span className="glossary-brief">{shortDefinition}</span>
          <span className="glossary-detail">{definition}</span>
          <span className="glossary-example">
            <b>例子：</b>
            {example}
          </span>
          <Link href={`/glossary/${slug}`}>查看详情</Link>
        </span>
      ) : null}
    </span>
  );
}
