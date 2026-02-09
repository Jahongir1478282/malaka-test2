/** @format */

// ============================================
// TYPE DEFINITIONS
// ============================================

import type { CategoryKey, Question } from "../data/questions";

export type Answer = string | null;

export type SearchFilter = CategoryKey | "all";

export type SearchItem = Question & {
  category: CategoryKey;
  categoryTitle: string;
  originalIndex: number;
};

export type NavState = "pending" | "correct" | "incorrect";

export type StatsSnapshot = {
  total: number;
  correct: number;
  percentage: number;
};

export type SearchModalPlacement = "center" | "drawer";
