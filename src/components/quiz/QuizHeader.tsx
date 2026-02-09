/** @format */

// ============================================
// QUIZ HEADER COMPONENT
// ============================================

import { Button, Badge } from "../ui";
import type { CategoryMeta } from "../../data/categoryMeta";

interface QuizHeaderProps {
  category: CategoryMeta;
  onBack: () => void;
  onSearch: () => void;
  onFinish: () => void;
}

export function QuizHeader({
  category,
  onBack,
  onSearch,
  onFinish,
}: QuizHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Button variant="danger" size="sm" onClick={onBack}>
          ← Chiqish
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-2xl">{category.icon}</span>
          <span className="font-semibold text-slate-800">{category.title}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" onClick={onSearch}>
          🔍 Qidirish
        </Button>
        <Button variant="warning" size="sm" onClick={onFinish}>
          Yakunlash 🏁
        </Button>
      </div>
    </header>
  );
}
