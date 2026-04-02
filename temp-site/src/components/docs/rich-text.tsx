import { Fragment } from "react";
import type { GlossaryLookup, RichTextToken } from "@/content/types";
import { GlossaryPopover } from "@/components/client/glossary-popover";

type RichTextProps = {
  tokens: RichTextToken[];
  glossaryLookup: GlossaryLookup;
};

// 识别【xxx】格式的标题并加粗显示，同时处理换行符
function renderTextWithFormatting(content: string) {
  // 先处理换行符，把 \n\n 转为段落分隔
  const paragraphs = content.split(/\n\n+/);

  return paragraphs.map((paragraph, pIndex) => (
    <Fragment key={pIndex}>
      {pIndex > 0 && (
        <>
          <br />
          <br />
        </>
      )}
      {/* 匹配【标题】格式 */}
      {paragraph.split(/(【[^】]+】)/g).map((part, index) => {
        if (part.startsWith("【") && part.endsWith("】")) {
          return (
            <strong key={index} className="text-heading">
              {part}
            </strong>
          );
        }
        // 处理单个换行符
        return part.split("\n").map((line, lineIndex, arr) => (
          <Fragment key={`${index}-${lineIndex}`}>
            {line}
            {lineIndex < arr.length - 1 && <br />}
          </Fragment>
        ));
      })}
    </Fragment>
  ));
}

export function RichText({ tokens, glossaryLookup }: RichTextProps) {
  return (
    <>
      {tokens.map((token, index) => {
        if (token.type === "text") {
          // 空内容渲染为段落分隔
          if (!token.content) {
            return <br key={`empty-${index}`} />;
          }
          return (
            <Fragment key={`${token.content}-${index}`}>
              {renderTextWithFormatting(token.content)}
            </Fragment>
          );
        }

        const glossaryItem = glossaryLookup[token.slug];

        if (!glossaryItem) {
          return <Fragment key={`${token.slug}-${index}`}>{token.label}</Fragment>;
        }

        return (
          <GlossaryPopover
            key={`${token.slug}-${index}`}
            slug={token.slug}
            label={token.label}
            shortDefinition={glossaryItem.shortDefinition}
            definition={glossaryItem.definition}
            example={glossaryItem.popoverExample}
          />
        );
      })}
    </>
  );
}
