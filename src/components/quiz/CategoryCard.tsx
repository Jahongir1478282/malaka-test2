/** @format */

// ============================================
// CATEGORY CARD COMPONENT
// ============================================

import { Card, Badge } from "../ui";
import { questionBank } from "../../data/questions";
import type { CategoryMeta } from "../../data/categoryMeta";

interface CategoryCardProps {
  category: CategoryMeta;
  onClick: () => void;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const questionCount = questionBank[category.key].length;

  return (
    <Card
      variant="elevated"
      hover
      className="group flex flex-col items-start text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      onClick={onClick}
    >
      {/* Icon with background */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-3xl shadow-inner transition-transform group-hover:scale-110">
        {category.icon}
      </div>

      {/* Title */}
      <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
        {category.title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm text-slate-500 line-clamp-2">
        {category.description}
      </p>

      {/* Question count badge */}
      <div className="mt-auto pt-4 flex items-center justify-between w-full">
        <Badge variant="primary">{questionCount} ta savol</Badge>

        <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
          Boshlash →
        </span>
      </div>
    </Card>
  );
}
