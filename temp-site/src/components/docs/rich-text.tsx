import { Fragment } from "react";
import type { GlossaryLookup, RichTextToken } from "@/content/types";
import { GlossaryPopover } from "@/components/client/glossary-popover";

type RichTextProps = {
  tokens: RichTextToken[];
  glossaryLookup: GlossaryLookup;
};

export function RichText({ tokens, glossaryLookup }: RichTextProps) {
  return (
    <>
      {tokens.map((token, index) => {
        if (token.type === "text") {
          return <Fragment key={`${token.content}-${index}`}>{token.content}</Fragment>;
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
