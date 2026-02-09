/** @format */

// ============================================
// BODY SCROLL LOCK HOOK
// ============================================

import { useEffect } from "react";

/**
 * Prevents body scroll when a modal or overlay is active
 */
export function useLockBodyScroll(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}
