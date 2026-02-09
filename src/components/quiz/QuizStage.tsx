/** @format */

// ============================================
// QUIZ STAGE COMPONENT - Main Quiz Interface
// ============================================

"use client";

import { Card } from "../ui";
import { StatsDisplay } from "../common";
import { QuizHeader } from "./QuizHeader";
import { QuestionDisplay } from "./QuestionDisplay";
import { QuestionNavigator } from "./QuestionNavigator";
import { QuizNavigation } from "./QuizNavigation";
import type { CategoryMeta } from "../../data/categoryMeta";
import type { Question } from "../../data/questions";
import type { Answer, NavState, StatsSnapshot } from "../../types";

interface QuizStageProps {
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
}

export function QuizStage({
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
  onChangeNavPage,
}: QuizStageProps) {
  const activeQuestion = questions[currentIndex];
  if (!activeQuestion) return null;

  return (
    <Card
      variant="elevated"
      padding="lg"
      className="flex flex-col gap-5 h-full overflow-hidden"
    >
      {/* Header */}
      <QuizHeader
        category={category}
        onBack={onBack}
        onSearch={onSearch}
        onFinish={onFinish}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-5 overflow-hidden lg:flex-row">
        {/* Left: Question Area */}
        <div className="flex-1 flex flex-col gap-5 overflow-y-auto">
          <QuestionDisplay
            question={activeQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={answers[currentIndex]}
            onSelectAnswer={(option) => onSelectAnswer(currentIndex, option)}
          />

          <QuizNavigation
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            onPrev={onPrev}
            onNext={onNext}
          />
        </div>

        {/* Right: Sidebar */}
        <aside className="w-full lg:w-80 flex flex-col gap-4">
          {/* Stats */}
          <StatsDisplay stats={stats} answeredCount={answeredCount} />

          {/* Navigator */}
          <QuestionNavigator
            navIndices={navIndices}
            currentIndex={currentIndex}
            navPage={navPage}
            navPageCount={navPageCount}
            navRangeLabel={navRangeLabel}
            getNavState={getNavState}
            onGoTo={onGoTo}
            onChangeNavPage={onChangeNavPage}
          />
        </aside>
      </div>
    </Card>
  );
}
