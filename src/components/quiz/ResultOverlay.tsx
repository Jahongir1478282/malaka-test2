/** @format */

// ============================================
// RESULT OVERLAY COMPONENT
// ============================================

"use client";

import { Button, Card, ProgressBar } from "../ui";
import { useLockBodyScroll } from "../../hooks";
import { getResultEmoji, getResultMessage } from "../../utils/helpers";
import type { CategoryMeta } from "../../data/categoryMeta";
import type { StatsSnapshot } from "../../types";

interface ResultOverlayProps {
  visible: boolean;
  stats: StatsSnapshot;
  category: CategoryMeta | null;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export function ResultOverlay({
  visible,
  stats,
  category,
  onRestart,
  onBackToMenu,
}: ResultOverlayProps) {
  useLockBodyScroll(visible);

  if (!visible) return null;

  const emoji = getResultEmoji(stats.percentage);
  const message = getResultMessage(stats.percentage);
  const variant =
    stats.percentage >= 70
      ? "success"
      : stats.percentage >= 50
        ? "warning"
        : "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <Card
        variant="elevated"
        padding="lg"
        className="w-full max-w-md text-center animate-scale-in"
      >
        {/* Emoji */}
        <div className="text-7xl mb-4">{emoji}</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-900">{message}</h2>

        {/* Category */}
        {category && (
          <p className="mt-2 text-sm text-slate-500">
            {category.icon} {category.title}
          </p>
        )}

        {/* Stats */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
          <div className="flex justify-center gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-emerald-600">
                {stats.correct}
              </p>
              <p className="text-xs text-slate-500 mt-1">To&apos;g&apos;ri</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div>
              <p className="text-3xl font-bold text-slate-600">{stats.total}</p>
              <p className="text-xs text-slate-500 mt-1">Jami</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div>
              <p className="text-3xl font-bold text-blue-600">
                {stats.percentage.toFixed(0)}%
              </p>
              <p className="text-xs text-slate-500 mt-1">Foiz</p>
            </div>
          </div>

          <div className="mt-5">
            <ProgressBar value={stats.percentage} variant={variant} size="lg" />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Button variant="primary" fullWidth onClick={onRestart}>
            🔄 Qayta boshlash
          </Button>
          <Button variant="secondary" fullWidth onClick={onBackToMenu}>
            🏠 Menuga qaytish
          </Button>
        </div>
      </Card>
    </div>
  );
}
