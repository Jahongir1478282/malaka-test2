/** @format */

// ============================================
// STATS DISPLAY COMPONENT
// ============================================

import { Badge } from "../ui";
import type { StatsSnapshot } from "../../types";

interface StatsDisplayProps {
  stats: StatsSnapshot;
  answeredCount: number;
  compact?: boolean;
}

export function StatsDisplay({
  stats,
  answeredCount,
  compact = false,
}: StatsDisplayProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <Badge variant="success" size="sm">
          ✓ {stats.correct}
        </Badge>
        <span className="text-slate-500">
          / {stats.total} ({stats.percentage.toFixed(0)}%)
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-5 border border-slate-200">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-lg">📊</span>
        Statistika
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Jami savollar</span>
          <span className="font-semibold text-slate-800">{stats.total}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Javob berilgan</span>
          <span className="font-semibold text-blue-600">{answeredCount}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">
            To&apos;g&apos;ri javoblar
          </span>
          <span className="font-semibold text-emerald-600">
            {stats.correct}
          </span>
        </div>

        <div className="h-px bg-slate-200 my-2" />

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-700">Natija</span>
          <Badge
            variant={
              stats.percentage >= 70
                ? "success"
                : stats.percentage >= 50
                  ? "warning"
                  : "danger"
            }
          >
            {stats.percentage.toFixed(1)}%
          </Badge>
        </div>
      </div>
    </div>
  );
}
