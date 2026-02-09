/** @format */

// ============================================
// QUIZ STATE MANAGEMENT HOOK
// ============================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  questionBank,
  type CategoryKey,
  type Question,
} from "../data/questions";
import { categories } from "../data/categoryMeta";
import { AUTO_ADVANCE_DELAY_MS, NAV_GROUP_SIZE } from "../constants";
import { prepareQuestions, calculatePercentage } from "../utils/helpers";
import type { Answer, NavState, StatsSnapshot } from "../types";

export function useQuizState() {
  const [currentCategory, setCurrentCategory] = useState<CategoryKey | null>(
    null,
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finished, setFinished] = useState(false);
  const [navPage, setNavPage] = useState(0);

  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
    };
  }, []);

  // Sync nav page with current question
  useEffect(() => {
    if (!questions.length) return;
    const pageIndex = Math.floor(currentIndex / NAV_GROUP_SIZE);
    setNavPage(pageIndex);
  }, [currentIndex, questions.length]);

  // Calculate statistics
  const stats = useMemo<StatsSnapshot>(() => {
    const total = questions.length;
    if (total === 0) {
      return { total: 0, correct: 0, percentage: 0 };
    }
    const correct = questions.reduce((count, question, index) => {
      return count + (answers[index] === question.correct ? 1 : 0);
    }, 0);
    return {
      total,
      correct,
      percentage: calculatePercentage(correct, total),
    };
  }, [answers, questions]);

  const answeredCount = useMemo(
    () => answers.filter((answer) => answer !== null).length,
    [answers],
  );

  // Navigation calculations
  const navPageCount = Math.max(
    1,
    Math.ceil(questions.length / NAV_GROUP_SIZE),
  );
  const navStart = navPage * NAV_GROUP_SIZE;
  const navEnd = Math.min(questions.length, navStart + NAV_GROUP_SIZE);

  const navIndices = useMemo(() => {
    return Array.from(
      { length: Math.max(0, navEnd - navStart) },
      (_, index) => navStart + index,
    );
  }, [navEnd, navStart]);

  const navRangeLabel = questions.length
    ? `${navStart + 1}-${navEnd} / ${questions.length}`
    : "Savollar";

  // Get current category metadata
  const categoryMeta = currentCategory
    ? (categories.find((item) => item.key === currentCategory) ?? null)
    : null;

  // Timer management
  const resetTimer = useCallback(() => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
    }
  }, []);

  // Reset all state
  const resetState = useCallback(() => {
    resetTimer();
    setCurrentCategory(null);
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setFinished(false);
    setNavPage(0);
  }, [resetTimer]);

  // Start a new quiz
  const startCategory = useCallback(
    (category: CategoryKey) => {
      const source = questionBank[category];
      const prepared = prepareQuestions(source);
      resetTimer();
      setCurrentCategory(category);
      setQuestions(prepared);
      setAnswers(new Array(prepared.length).fill(null));
      setCurrentIndex(0);
      setFinished(false);
      setNavPage(0);
    },
    [resetTimer],
  );

  // Handle answer selection
  const handleSelect = useCallback(
    (index: number, option: string) => {
      if (answers[index] !== null) return;

      const updated = [...answers];
      updated[index] = option;
      setAnswers(updated);

      resetTimer();
      autoAdvanceRef.current = setTimeout(() => {
        setCurrentIndex((prev) => {
          if (prev < questions.length - 1) {
            return prev + 1;
          }
          setFinished(true);
          return prev;
        });
      }, AUTO_ADVANCE_DELAY_MS);
    },
    [answers, questions.length, resetTimer],
  );

  // Navigation functions
  const goTo = useCallback(
    (index: number) => {
      resetTimer();
      setCurrentIndex(index);
    },
    [resetTimer],
  );

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      goTo(currentIndex + 1);
    }
  }, [currentIndex, goTo, questions.length]);

  const prevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      goTo(currentIndex - 1);
    }
  }, [currentIndex, goTo]);

  const finishTest = useCallback(() => {
    setFinished(true);
  }, []);

  const changeNavPage = useCallback(
    (direction: -1 | 1) => {
      setNavPage((prev) => {
        const next = prev + direction;
        return Math.min(navPageCount - 1, Math.max(0, next));
      });
    },
    [navPageCount],
  );

  const getNavState = useCallback(
    (index: number): NavState => {
      const answer = answers[index];
      if (answer === null) return "pending";
      return answer === questions[index].correct ? "correct" : "incorrect";
    },
    [answers, questions],
  );

  return {
    // State
    currentCategory,
    questions,
    currentIndex,
    answers,
    finished,
    stats,
    answeredCount,
    categoryMeta,

    // Navigation
    navPage,
    navPageCount,
    navIndices,
    navRangeLabel,

    // Actions
    startCategory,
    resetState,
    handleSelect,
    goTo,
    nextQuestion,
    prevQuestion,
    finishTest,
    changeNavPage,
    getNavState,
    setFinished,
  };
}
