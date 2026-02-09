/** @format */

// ============================================
// SEARCH MODAL COMPONENT - Optimized Professional Design
// ============================================

"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { Modal, Input, Badge, Card, Button } from "../ui";
import { TextHighlight } from "../common";
import { categories } from "../../data/categoryMeta";
import type {
  SearchFilter,
  SearchItem,
  SearchModalPlacement,
} from "../../types";

interface SearchModalProps {
  open: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  filter: SearchFilter;
  onFilterChange: (filter: SearchFilter) => void;
  results: SearchItem[];
  filterCounts: Map<SearchFilter, number>;
  onClose: () => void;
  placement: SearchModalPlacement;
}

export function SearchModal({
  open,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  results,
  filterCounts,
  onClose,
  placement,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Focus input on open
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, [open]);

  // Group results by category for better organization
  const groupedResults = useMemo(() => {
    const groups = new Map<string, SearchItem[]>();

    results.forEach((item) => {
      const key = item.categoryTitle;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    });

    return groups;
  }, [results]);

  const totalResults = filterCounts.get("all") ?? 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size={placement === "drawer" ? "xl" : "xl"}
      position={placement === "drawer" ? "right" : "center"}
      title="🔍 Javob qidirish"
      subtitle="Kalit so'z bo'yicha barcha kategoriyalardan natija toping"
    >
      <div className="flex flex-col h-full">
        {/* Search Input Area */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 p-4 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
              🔎
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Savol yoki javobni qidiring..."
              className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 pl-12 pr-4 py-4 text-base outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"
            />
            {query && (
              <button
                onClick={() => onQueryChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={results.length > 0 ? "success" : "default"}>
                {results.length} ta natija
              </Badge>
              {query && (
                <span className="text-sm text-slate-500">
                  &quot;{query}&quot; uchun
                </span>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showFilters || filter !== "all"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>🏷️</span>
              <span>Filtr</span>
              {filter !== "all" && (
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              )}
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <button
                onClick={() => onFilterChange("all")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  filter === "all"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                Barchasi ({totalResults})
              </button>

              {categories.map((category) => {
                const count = filterCounts.get(category.key) ?? 0;
                const isActive = filter === category.key;

                return (
                  <button
                    key={category.key}
                    onClick={() => onFilterChange(category.key)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                    } ${count === 0 ? "opacity-50" : ""}`}
                    disabled={count === 0}
                  >
                    {category.icon} {category.title} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100 p-4">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-700">
                {query ? "Hech narsa topilmadi" : "Qidiruvni boshlang"}
              </h3>
              <p className="mt-2 text-slate-500 max-w-sm">
                {query
                  ? "Boshqa kalit so'z bilan qidirib ko'ring"
                  : "Savol yoki javob bo'yicha qidiring"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((item, index) => (
                <article
                  key={`${item.category}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Header with category and question number */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="primary" size="sm">
                      {item.categoryTitle}
                    </Badge>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                      #{item.originalIndex}
                    </span>
                  </div>

                  {/* Question */}
                  <h3 className="text-base font-semibold text-slate-900 leading-relaxed">
                    <TextHighlight text={item.question} query={query} />
                  </h3>

                  {/* Options */}
                  <div className="mt-4 space-y-2">
                    {item.options.map((option, optIndex) => {
                      const isCorrect = option === item.correct;

                      return (
                        <div
                          key={optIndex}
                          className={`flex items-start gap-3 rounded-xl px-4 py-3 ${
                            isCorrect
                              ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200"
                              : "bg-slate-50"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                              isCorrect
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {isCorrect
                              ? "✓"
                              : String.fromCharCode(65 + optIndex)}
                          </span>
                          <span
                            className={`text-sm ${
                              isCorrect
                                ? "text-emerald-800 font-medium"
                                : "text-slate-600"
                            }`}
                          >
                            <TextHighlight text={option} query={query} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
