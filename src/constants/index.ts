/** @format */

// ============================================
// APPLICATION CONSTANTS
// ============================================

export const AUTO_ADVANCE_DELAY_MS = 1000;
export const NAV_GROUP_SIZE = 20;

// Search debounce delay
export const SEARCH_DEBOUNCE_MS = 150;

// Result thresholds for emoji feedback
export const RESULT_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  AVERAGE: 50,
} as const;

// Animation durations
export const ANIMATION = {
  MODAL_FOCUS_DELAY: 120,
} as const;
