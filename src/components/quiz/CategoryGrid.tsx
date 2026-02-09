/** @format */

// ============================================
// CATEGORY GRID COMPONENT
// ============================================

"use client";

import { categories } from "../../data/categoryMeta";
import { questionBank, type CategoryKey } from "../../data/questions";
import { Card, Badge } from "../ui";

interface CategoryGridProps {
  onSelectCategory: (category: CategoryKey) => void;
  onOpenSearch: () => void;
  totalQuestions: number;
}

export function CategoryGrid({
  onSelectCategory,
  onOpenSearch,
  totalQuestions,
}: CategoryGridProps) {
  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <header className="text-center space-y-3">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
          <span>📚</span>
          <span>Jami {totalQuestions} ta savol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Malaka Oshirish Testi
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Kategoriyani tanlang va bilimlaringizni sinab ko&apos;ring
        </p>
      </header>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => {
          const questionCount = questionBank[category.key].length;

          return (
            <Card
              key={category.key}
              variant="elevated"
              hover
              padding="lg"
              className="group flex flex-col items-start text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => onSelectCategory(category.key)}
            >
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-3xl shadow-inner transition-transform group-hover:scale-110">
                {category.icon}
              </div>

              {/* Title */}
              <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {category.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm text-slate-500 line-clamp-2 flex-1">
                {category.description}
              </p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between w-full">
                <Badge variant="primary">{questionCount} ta savol</Badge>
                <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                  Boshlash →
                </span>
              </div>
            </Card>
          );
        })}

        {/* Search Card */}
        <Card
          variant="outlined"
          padding="lg"
          hover
          className="flex flex-col items-start text-left cursor-pointer bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-blue-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100"
          onClick={onOpenSearch}
        >
          {/* Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white text-2xl shadow-lg shadow-blue-500/30">
            🔍
          </div>

          {/* Title */}
          <h3 className="mt-4 text-lg font-bold text-blue-900">
            Javob qidirish
          </h3>

          {/* Description */}
          <p className="mt-2 text-sm text-blue-700/70 flex-1">
            Kalit so&apos;z bo&apos;yicha barcha kategoriyalardan javob toping
          </p>

          {/* Footer */}
          <div className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-medium">
            <span>Qidirish</span>
            <span>→</span>
          </div>
        </Card>
      </div>
    </section>
  );
}
