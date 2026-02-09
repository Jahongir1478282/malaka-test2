/** @format */

// ============================================
// QUIZ NAVIGATION BUTTONS COMPONENT
// ============================================

import { Button } from "../ui";

interface QuizNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  onPrev: () => void;
  onNext: () => void;
}

export function QuizNavigation({
  currentIndex,
  totalQuestions,
  onPrev,
  onNext,
}: QuizNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
      <Button
        variant="secondary"
        onClick={onPrev}
        disabled={currentIndex === 0}
      >
        ← Avvalgi
      </Button>

      <Button
        variant="primary"
        onClick={onNext}
        disabled={currentIndex === totalQuestions - 1}
      >
        Keyingi →
      </Button>
    </div>
  );
}
