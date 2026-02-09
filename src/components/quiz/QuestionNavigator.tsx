/** @format */

// ============================================
// QUESTION NAVIGATOR COMPONENT
// ============================================

import type { NavState } from "../../types";

interface QuestionNavigatorProps {
  navIndices: number[];
  currentIndex: number;
  navPage: number;
  navPageCount: number;
  navRangeLabel: string;
  getNavState: (index: number) => NavState;
  onGoTo: (index: number) => void;
  onChangeNavPage: (direction: -1 | 1) => void;
}

export function QuestionNavigator({
  navIndices,
  currentIndex,
  navPage,
  navPageCount,
  navRangeLabel,
  getNavState,
  onGoTo,
  onChangeNavPage,
}: QuestionNavigatorProps) {
  const getButtonClasses = (state: NavState, isActive: boolean) => {
    const base =
      "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

    if (state === "pending") {
      return `${base} border-2 border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:bg-blue-50 ${
        isActive ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50" : ""
      }`;
    }

    if (state === "correct") {
      return `${base} bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 ${
        isActive ? "ring-2 ring-emerald-300 ring-offset-2" : ""
      }`;
    }

    return `${base} bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30 ${
      isActive ? "ring-2 ring-rose-300 ring-offset-2" : ""
    }`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-slate-700">
          📋 {navRangeLabel}
        </span>

        {navPageCount > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onChangeNavPage(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40"
              disabled={navPage === 0}
            >
              ◀
            </button>
            <span className="text-xs text-slate-500 px-2">
              {navPage + 1}/{navPageCount}
            </span>
            <button
              onClick={() => onChangeNavPage(1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40"
              disabled={navPage >= navPageCount - 1}
            >
              ▶
            </button>
          </div>
        )}
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
        {navIndices.map((index) => {
          const state = getNavState(index);
          const isActive = index === currentIndex;

          return (
            <button
              key={index}
              onClick={() => onGoTo(index)}
              className={getButtonClasses(state, isActive)}
              title={`Savol ${index + 1}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-3 h-3 rounded bg-slate-200"></span>
          <span>Kutilmoqda</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-3 h-3 rounded bg-emerald-500"></span>
          <span>To&apos;g&apos;ri</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-3 h-3 rounded bg-rose-500"></span>
          <span>Noto&apos;g&apos;ri</span>
        </div>
      </div>
    </div>
  );
}
