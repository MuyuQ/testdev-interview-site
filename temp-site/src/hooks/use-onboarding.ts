"use client";

import { useCallback, useState } from "react";
import { readStorage, writeStorage } from "@/lib/client/storage";

const STORAGE_KEY = "testdev:onboarding-dismissed";

export function useOnboarding() {
  const [isDismissed, setIsDismissed] = useState<boolean>(() =>
    readStorage<boolean>(STORAGE_KEY, false),
  );

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    writeStorage(STORAGE_KEY, true);
  }, []);

  const reset = useCallback(() => {
    setIsDismissed(false);
    writeStorage(STORAGE_KEY, false);
  }, []);

  return {
    isDismissed,
    dismiss,
    reset,
  };
}
