import { beforeEach, describe, expect, it, vi } from "vitest";
import { attachShareButtons } from "../../src/lib/share-buttons";

describe("attachShareButtons", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="share-buttons">
        <button class="share-btn twitter" type="button">twitter-1</button>
        <button class="share-btn copy" type="button">copy-1</button>
      </div>
      <div class="share-buttons">
        <button class="share-btn twitter" type="button">twitter-2</button>
        <button class="share-btn copy" type="button">copy-2</button>
      </div>
    `;
  });

  it("should bind copy and share handlers for each share button group", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const open = vi.fn();

    Object.assign(navigator, {
      clipboard: {
        writeText,
      },
    });

    Object.assign(window, {
      open,
    });

    attachShareButtons(document, {
      getUrl: () => "https://example.com/topic",
      getTitle: () => "测试开发面试速成站",
    });

    const groups = document.querySelectorAll(".share-buttons");
    const secondGroup = groups[1] as HTMLElement;
    const secondCopyButton = secondGroup.querySelector(
      ".share-btn.copy",
    ) as HTMLButtonElement;
    const secondTwitterButton = secondGroup.querySelector(
      ".share-btn.twitter",
    ) as HTMLButtonElement;

    secondTwitterButton.click();
    expect(open).toHaveBeenCalledTimes(1);

    secondCopyButton.click();
    await Promise.resolve();

    expect(writeText).toHaveBeenCalledWith("https://example.com/topic");
    expect(secondCopyButton.textContent).toBe("✓");
  });
});
