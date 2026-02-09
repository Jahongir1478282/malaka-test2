/** @format */

// ============================================
// TEST APP - Main Application Component
// ============================================
// Clean architecture with separated concerns:
// - Hooks for state management
// - UI components for presentation
// - Feature components for business logic
// ============================================

"use client";

import { useQuizState, useSearch } from "../hooks";
import { CategoryGrid, QuizStage, ResultOverlay } from "./quiz";
import { SearchModal } from "./search";

export function TestApp() {
  // Quiz State Management
  const {
    currentCategory,
    questions,
    currentIndex,
    answers,
    finished,
    stats,
    answeredCount,
    categoryMeta,
    navPage,
    navPageCount,
    navIndices,
    navRangeLabel,
    startCategory,
    resetState,
    handleSelect,
    goTo,
    nextQuestion,
    prevQuestion,
    finishTest,
    changeNavPage,
    getNavState,
  } = useQuizState();

  // Search State Management
  const {
    searchOpen,
    searchQuery,
    searchFilter,
    filteredResults,
    filterCounts,
    totalQuestions,
    setSearchQuery,
    setSearchFilter,
    openSearch,
    closeSearch,
    resetSearchFilters,
  } = useSearch();

  // Handle category selection with search reset
  const handleStartCategory = (category: typeof currentCategory) => {
    if (category) {
      startCategory(category);
      resetSearchFilters();
    }
  };

  // Handle restart
  const handleRestart = () => {
    if (currentCategory) {
      startCategory(currentCategory);
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-6 overflow-hidden">
      {/* Home Screen - Category Selection */}
      {!currentCategory && (
        <CategoryGrid
          onSelectCategory={handleStartCategory}
          onOpenSearch={openSearch}
          totalQuestions={totalQuestions}
        />
      )}

      {/* Quiz Screen */}
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
          onSearch={openSearch}
          onFinish={finishTest}
          onSelectAnswer={handleSelect}
          onGoTo={goTo}
          onPrev={prevQuestion}
          onNext={nextQuestion}
          onChangeNavPage={changeNavPage}
        />
      )}

      {/* Result Overlay */}
      <ResultOverlay
        visible={finished}
        stats={stats}
        category={categoryMeta}
        onRestart={handleRestart}
        onBackToMenu={resetState}
      />

      {/* Search Modal */}
      <SearchModal
        open={searchOpen}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        filter={searchFilter}
        onFilterChange={setSearchFilter}
        results={filteredResults}
        filterCounts={filterCounts}
        onClose={closeSearch}
        placement={currentCategory ? "drawer" : "center"}
      />
    </div>
  );
}
