export interface ShareButtonOptions {
  getTitle?: () => string;
  getUrl?: () => string;
}

function getShareUrl(options?: ShareButtonOptions): string {
  return options?.getUrl?.() ?? window.location.href;
}

function getShareTitle(options?: ShareButtonOptions): string {
  return options?.getTitle?.() ?? document.title;
}

async function copyShareUrl(
  button: HTMLButtonElement,
  options?: ShareButtonOptions,
): Promise<void> {
  const url = getShareUrl(options);
  const original = button.innerHTML;

  await navigator.clipboard.writeText(url);
  button.innerHTML = "✓";
  window.setTimeout(() => {
    button.innerHTML = original;
  }, 2000);
}

function shareToTwitter(options?: ShareButtonOptions): void {
  const url = getShareUrl(options);
  const title = getShareTitle(options);

  window.open(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    "_blank",
  );
}

export function attachShareButtons(
  root: ParentNode = document,
  options?: ShareButtonOptions,
): void {
  root.querySelectorAll(".share-buttons").forEach((group) => {
    if (!(group instanceof HTMLElement) || group.dataset.bound === "true") {
      return;
    }

    const twitterButton = group.querySelector<HTMLButtonElement>(
      ".share-btn.twitter",
    );
    const copyButton = group.querySelector<HTMLButtonElement>(".share-btn.copy");

    twitterButton?.addEventListener("click", () => {
      shareToTwitter(options);
    });

    copyButton?.addEventListener("click", () => {
      void copyShareUrl(copyButton, options);
    });

    group.dataset.bound = "true";
  });
}
