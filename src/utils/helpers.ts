/** @format */

// ============================================
// UTILITY FUNCTIONS
// ============================================

import type { Question } from "../data/questions";

/**
 * Fisher-Yates shuffle algorithm
 * Creates a new shuffled array without mutating the original
 */
export function shuffle<T>(items: T[]): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

/**
 * Escapes special regex characters in a string
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Calculates percentage with proper rounding
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Prepares questions for a quiz by shuffling both questions and their options
 */
export function prepareQuestions(questions: Question[]): Question[] {
  return shuffle(questions).map((question) => ({
    ...question,
    options: shuffle(question.options),
  }));
}

/**
 * Gets result emoji based on percentage score
 */
export function getResultEmoji(percentage: number): string {
  if (percentage >= 90) return "🎉";
  if (percentage >= 70) return "👍";
  if (percentage >= 50) return "🙂";
  return "😔";
}

/**
 * Gets result message based on percentage score
 */
export function getResultMessage(percentage: number): string {
  if (percentage >= 90) return "A'lo natija!";
  if (percentage >= 70) return "Yaxshi natija!";
  if (percentage >= 50) return "Qoniqarli natija";
  return "Qayta urinib ko'ring";
}
