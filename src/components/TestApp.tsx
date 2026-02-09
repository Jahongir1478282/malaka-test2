"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { categories, type CategoryMeta } from "../data/categoryMeta";
import {
  questionBank,
  type CategoryKey,
  type Question
} from "../data/questions";

type Answer = string | null;

type SearchFilter = CategoryKey | "all";

type SearchItem = Question & {
  category: CategoryKey;
  categoryTitle: string;
};

type NavState = "pending" | "correct" | "incorrect";

type StatsSnapshot = {
  total: number;
  correct: number;
  percentage: number;
};

const AUTO_ADVANCE_DELAY_MS = 1000;
const NAV_GROUP_SIZE = 20;

const SEARCH_ITEMS: SearchItem[] = categories.flatMap((category) => {
  return questionBank[category.key].map((item) => ({
    ...item,
    category: category.key,
    categoryTitle: `${category.icon} ${category.title}`
  }));
});

function shuffle<T>(items: T[]): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function prepareQuestions(category: CategoryKey): Question[] {
  const source = questionBank[category];
  return shuffle(source).map((question) => ({
    ...question,
    options: shuffle(question.options)
  }));
}

function highlightText(text: string, rawQuery: string): JSX.Element {
  const query = rawQuery.trim();
  if (!query) {
    return <span>{text}</span>;
  }
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  const target = query.toLowerCase();
  return (
    <span>
      {parts.map((part, index) => {
        const match = part.toLowerCase() === target;
        return match ? (
          <mark key={`match-${index}`} className="rounded bg-yellow-200 px-0.5">
            {part}
          </mark>
        ) : (
          <span key={`text-${index}`}>{part}</span>
        );
      })}
    </span>
  );
}

function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) {
      return;
    }
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

type CategoryGridProps = {
  onSelect: (category: CategoryKey) => void;
  onSearch: () => void;
};

function CategoryGrid({ onSelect, onSearch }: CategoryGridProps) {
  return (
    <section className="grid flex-1 grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const total = questionBank[category.key].length;
        return (
          <button
            key={category.key}
            onClick={() => onSelect(category.key)}
            className="group flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-500 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span className="text-3xl">{category.icon}</span>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">{category.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{category.description}</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              {total} ta savol
            </span>
          </button>
        );
      })}
      <button
        onClick={onSearch}
        className="flex min-h-[180px] flex-col items-start justify-center rounded-2xl border border-dashed border-blue-400 bg-blue-50/80 p-5 text-left text-blue-800 transition hover:border-blue-500 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <span className="text-3xl">🔍</span>
        <h3 className="mt-3 text-lg font-semibold">Javob qidirish</h3>
        <p className="mt-2 text-sm">Kalit so&apos;z bo&apos;yicha barcha kategoriyalardan javob toping</p>
      </button>
    </section>
  );
}

type QuizStageProps = {
  category: CategoryMeta;
  questions: Question[];
  answers: Answer[];
  currentIndex: number;
  stats: StatsSnapshot;
  answeredCount: number;
  navIndices: number[];
  navPage: number;
  navPageCount: number;
  navRangeLabel: string;
  getNavState: (index: number) => NavState;
  onBack: () => void;
  onSearch: () => void;
  onFinish: () => void;
  onSelectAnswer: (questionIndex: number, option: string) => void;
  onGoTo: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onChangeNavPage: (direction: -1 | 1) => void;
};

function QuizStage({
  category,
  questions,
  answers,
  currentIndex,
  stats,
  answeredCount,
  navIndices,
  navPage,
  navPageCount,
  navRangeLabel,
  getNavState,
  onBack,
  onSearch,
  onFinish,
  onSelectAnswer,
  onGoTo,
  onPrev,
  onNext,
  onChangeNavPage
}: QuizStageProps) {
  const activeQuestion = questions[currentIndex];
  if (!activeQuestion) {
    return null;
  }

  const answerForActive = answers[currentIndex];

  function navButtonClass(state: NavState, active: boolean) {
    if (state === "pending") {
      return `border-blue-200 bg-white text-blue-500 hover:bg-blue-50${
        active ? " ring-2 ring-blue-400" : ""
      }`;
    }
    if (state === "correct") {
      return `border-emerald-500 bg-emerald-500 text-white${active ? " ring-2 ring-emerald-300" : ""}`;
    }
    return `border-rose-500 bg-rose-500 text-white${active ? " ring-2 ring-rose-300" : ""}`;
  }

  function optionClass(option: string) {
    if (answerForActive === null) {
      return "border-slate-200 hover:border-blue-400 hover:bg-blue-50";
    }
    if (option === activeQuestion.correct) {
      return "border-emerald-500 bg-emerald-50 text-emerald-700";
    }
    if (option === answerForActive) {
      return "border-rose-500 bg-rose-50 text-rose-700";
    }
    return "border-slate-200 text-slate-400";
  }

  return (
    <section className="flex h-full flex-1 flex-col gap-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex flex-col gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            ← Menuga qaytish
          </button>
          <div className="text-sm text-slate-600">{category.icon} {category.title}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onSearch}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            🔍 Javob qidirish
          </button>
          <button
            onClick={onFinish}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            Yakunlash 🏁
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-5 overflow-hidden lg:flex-row">
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Savol {currentIndex + 1} / {questions.length}
            </p>
            <h2 className="mt-3 text-lg font-medium text-slate-900">{activeQuestion.question}</h2>
          </div>

          <div className="grid flex-1 content-start gap-3">
            {activeQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => onSelectAnswer(currentIndex, option)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${optionClass(
                  option
                )}`}
                disabled={answerForActive !== null}
              >
                {option}
              </button>
            ))}
          </div>

          {answerForActive !== null && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              ✓ To&apos;g&apos;ri javob: <strong>{activeQuestion.correct}</strong>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-600">
              To&apos;g&apos;ri javoblar: {stats.correct} / {stats.total} ({stats.percentage.toFixed(1)}%)
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onPrev}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                disabled={currentIndex === 0}
              >
                ⬅ Avvalgi
              </button>
              <button
                onClick={onNext}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                disabled={currentIndex === questions.length - 1}
              >
                Keyingi ➡
              </button>
            </div>
          </div>
        </div>

        <aside className="flex w-full flex-col gap-4 lg:max-w-xs">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="font-semibold text-slate-900">Umumiy ma&apos;lumot</div>
            <ul className="mt-3 space-y-2">
              <li>Jami savollar: {stats.total}</li>
              <li>Javob berilgan: {answeredCount}</li>
              <li>To&apos;g&apos;ri javoblar: {stats.correct}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {navRangeLabel}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onChangeNavPage(-1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-500 transition hover:border-blue-400 hover:text-blue-500 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  disabled={navPage === 0}
                >
                  ◀
                </button>
                <button
                  onClick={() => onChangeNavPage(1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-500 transition hover:border-blue-400 hover:text-blue-500 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  disabled={navPage >= navPageCount - 1}
                >
                  ▶
                </button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
              {navIndices.map((index) => {
                const state = getNavState(index);
                const base = "flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2";
                const active = index === currentIndex;
                return (
                  <button
                    key={index}
                    onClick={() => onGoTo(index)}
                    className={`${base} ${navButtonClass(state, active)}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

type ResultOverlayProps = {
  visible: boolean;
  stats: StatsSnapshot;
  category: CategoryMeta | null;
  onRestart: () => void;
  onBackToMenu: () => void;
};

function ResultOverlay({ visible, stats, category, onRestart, onBackToMenu }: ResultOverlayProps) {
  useLockBodyScroll(visible);

  if (!visible) {
    return null;
  }

  const emoji = stats.percentage >= 90 ? "🎉" : stats.percentage >= 70 ? "👍" : stats.percentage >= 50 ? "🙂" : "😔";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-xl">
        <h3 className="text-2xl font-semibold text-slate-900">{emoji} Test yakunlandi</h3>
        {category && <p className="mt-2 text-sm text-slate-500">{category.icon} {category.title}</p>}
        <div className="mt-5 space-y-2 text-sm text-slate-600">
          <p>
            To&apos;g&apos;ri javoblar: <span className="font-semibold text-slate-900">{stats.correct}</span> / {stats.total}
          </p>
          <p>
            Foiz: <span className="font-semibold text-slate-900">{stats.percentage.toFixed(1)}%</span>
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Qayta boshlash
          </button>
          <button
            onClick={onBackToMenu}
            className="w-full rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Menuga qaytish
          </button>
        </div>
      </div>
    </div>
  );
}

type SearchModalPlacement = "center" | "drawer";

type SearchModalProps = {
  open: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  filter: SearchFilter;
  onFilterChange: (filter: SearchFilter) => void;
  results: SearchItem[];
  filterCounts: Map<SearchFilter, number>;
  onClose: () => void;
  placement: SearchModalPlacement;
};

function SearchModal({
  open,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  results,
  filterCounts,
  onClose,
  placement
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) {
      return;
    }
    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => {
      clearTimeout(timer);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const isDrawer = placement === "drawer";

  return (
    <div
      className={
        isDrawer
          ? "fixed inset-0 z-50 flex items-stretch justify-end bg-slate-900/30"
          : "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4"
      }
    >
      {isDrawer && (
        <button
          type="button"
          onClick={onClose}
          className="hidden flex-1 cursor-default lg:block"
          aria-label="Panelni yopish"
        />
      )}
      <div
        className={
          isDrawer
            ? "pointer-events-auto relative flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl"
            : "relative flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl"
        }
      >
        <header className="flex flex-col gap-2 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">🔍 Javob qidirish</h2>
            <p className="text-sm text-slate-600">Kalit so&apos;z bo&apos;yicha savollar ichidan natija qidiring</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            aria-label="Yopish"
          >
            ✕
          </button>
        </header>

        <div className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="flex-1">
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Kalit so'z kiriting..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => onFilterChange("all")}
                className={`rounded-full px-4 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                  filter === "all" ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Barcha natijalar ({filterCounts.get("all") ?? results.length})
              </button>
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => onFilterChange(category.key)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
                    filter === category.key ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category.icon} {category.title} ({filterCounts.get(category.key) ?? 0})
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto border-t border-slate-200 bg-slate-50 p-4">
          {results.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              Hech narsa topilmadi
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((item, index) => (
                <article key={`${item.category}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">{item.categoryTitle}</p>
                  <h3 className="mt-2 text-sm font-medium text-slate-900">{highlightText(item.question, query)}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {item.options.map((option) => (
                      <li
                        key={option}
                        className={`rounded-lg border px-3 py-2 ${
                          option === item.correct ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-transparent"
                        }`}
                      >
                        {option === item.correct ? "✅ " : ""}
                        {highlightText(option, query)}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TestApp() {
  const [currentCategory, setCurrentCategory] = useState<CategoryKey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [finished, setFinished] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("all");
  const [navPage, setNavPage] = useState(0);

  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!questions.length) {
      return;
    }
    const pageIndex = Math.floor(currentIndex / NAV_GROUP_SIZE);
    setNavPage(pageIndex);
  }, [currentIndex, questions.length]);

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
      percentage: (correct / total) * 100
    };
  }, [answers, questions]);

  const answeredCount = useMemo(() => answers.filter((answer) => answer !== null).length, [answers]);

  const queryFilteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return SEARCH_ITEMS;
    }
    return SEARCH_ITEMS.filter((item) => {
      return (
        item.question.toLowerCase().includes(q) ||
        item.correct.toLowerCase().includes(q) ||
        item.options.some((option) => option.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const filterCounts = useMemo(() => {
    const counts = new Map<SearchFilter, number>();
    counts.set("all", queryFilteredResults.length);
    categories.forEach((category) => {
      const count = queryFilteredResults.filter((item) => item.category === category.key).length;
      counts.set(category.key, count);
    });
    return counts;
  }, [queryFilteredResults]);

  const filteredResults = useMemo(() => {
    if (searchFilter === "all") {
      return queryFilteredResults;
    }
    return queryFilteredResults.filter((item) => item.category === searchFilter);
  }, [queryFilteredResults, searchFilter]);

  const navPageCount = Math.max(1, Math.ceil(questions.length / NAV_GROUP_SIZE));
  const navStart = navPage * NAV_GROUP_SIZE;
  const navEnd = Math.min(questions.length, navStart + NAV_GROUP_SIZE);
  const navIndices = useMemo(() => {
    return Array.from({ length: Math.max(0, navEnd - navStart) }, (_, index) => navStart + index);
  }, [navEnd, navStart]);

  const navRangeLabel = questions.length
    ? `Savollar ${navStart + 1}-${navEnd} / ${questions.length}`
    : "Savollar";

  const categoryMeta = currentCategory
    ? categories.find((item) => item.key === currentCategory) ?? null
    : null;

  const resetTimer = useCallback(() => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
    }
  }, []);

  const resetState = useCallback(() => {
    resetTimer();
    setCurrentCategory(null);
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setFinished(false);
    setNavPage(0);
  }, [resetTimer]);

  const startCategory = useCallback(
    (category: CategoryKey) => {
      const prepared = prepareQuestions(category);
      resetTimer();
      setCurrentCategory(category);
      setQuestions(prepared);
      setAnswers(new Array(prepared.length).fill(null));
      setCurrentIndex(0);
      setFinished(false);
      setNavPage(0);
      setSearchOpen(false);
      setSearchFilter("all");
      setSearchQuery("");
    },
    [resetTimer]
  );

  const handleSelect = useCallback(
    (index: number, option: string) => {
      if (answers[index] !== null) {
        return;
      }
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
    [answers, questions.length, resetTimer]
  );

  const goTo = useCallback(
    (index: number) => {
      resetTimer();
      setCurrentIndex(index);
    },
    [resetTimer]
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
    [navPageCount]
  );

  const getNavState = useCallback(
    (index: number): NavState => {
      const answer = answers[index];
      if (answer === null) {
        return "pending";
      }
      return answer === questions[index].correct ? "correct" : "incorrect";
    },
    [answers, questions]
  );

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6 overflow-hidden">
      {!currentCategory && (
        <CategoryGrid onSelect={startCategory} onSearch={() => setSearchOpen(true)} />
      )}

      {currentCategory && categoryMeta && (
        <QuizStage
          category={categoryMeta}
          questions={questions}
          answers={answers}
          currentIndex={currentIndex}
          stats={stats}
          answeredCount={answeredCount}
          navIndices={navIndices}
          navPage={navPage}
          navPageCount={navPageCount}
          navRangeLabel={navRangeLabel}
          getNavState={getNavState}
          onBack={resetState}
          onSearch={() => setSearchOpen(true)}
          onFinish={finishTest}
          onSelectAnswer={handleSelect}
          onGoTo={goTo}
          onPrev={prevQuestion}
          onNext={nextQuestion}
          onChangeNavPage={changeNavPage}
        />
      )}

      <ResultOverlay
        visible={finished}
        stats={stats}
        category={categoryMeta}
        onRestart={() => currentCategory && startCategory(currentCategory)}
        onBackToMenu={resetState}
      />

      <SearchModal
        open={searchOpen}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        filter={searchFilter}
        onFilterChange={setSearchFilter}
        results={filteredResults}
        filterCounts={filterCounts}
        onClose={() => setSearchOpen(false)}
        placement={currentCategory ? "drawer" : "center"}
      />
    </div>
  );
}
