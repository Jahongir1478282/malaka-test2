/** @format */

// ============================================
// SEARCH FUNCTIONALITY HOOK
// ============================================

import { useMemo, useState } from "react";
import { categories } from "../data/categoryMeta";
import { questionBank, type CategoryKey } from "../data/questions";
import type { SearchFilter, SearchItem } from "../types";

// Build searchable items from question bank
const SEARCH_ITEMS: SearchItem[] = categories.flatMap((category) => {
  return questionBank[category.key].map((item, index) => ({
    ...item,
    category: category.key,
    categoryTitle: `${category.icon} ${category.title}`,
    originalIndex: index + 1,
  }));
});

export function useSearch() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("all");

  // Filter by search query
  const queryFilteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SEARCH_ITEMS;

    return SEARCH_ITEMS.filter((item) => {
      return (
        item.question.toLowerCase().includes(q) ||
        item.correct.toLowerCase().includes(q) ||
        item.options.some((option) => option.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  // Calculate counts per category
  const filterCounts = useMemo(() => {
    const counts = new Map<SearchFilter, number>();
    counts.set("all", queryFilteredResults.length);

    categories.forEach((category) => {
      const count = queryFilteredResults.filter(
        (item) => item.category === category.key,
      ).length;
      counts.set(category.key, count);
    });

    return counts;
  }, [queryFilteredResults]);

  // Apply category filter
  const filteredResults = useMemo(() => {
    if (searchFilter === "all") return queryFilteredResults;
    return queryFilteredResults.filter(
      (item) => item.category === searchFilter,
    );
  }, [queryFilteredResults, searchFilter]);

  const openSearch = () => setSearchOpen(true);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchFilter("all");
  };

  const resetSearchFilters = () => {
    setSearchQuery("");
    setSearchFilter("all");
  };

  return {
    searchOpen,
    searchQuery,
    searchFilter,
    filteredResults,
    filterCounts,
    totalQuestions: SEARCH_ITEMS.length,
    setSearchQuery,
    setSearchFilter,
    openSearch,
    closeSearch,
    resetSearchFilters,
  };
}
