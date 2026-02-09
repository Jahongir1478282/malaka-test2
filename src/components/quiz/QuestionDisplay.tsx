/** @format */

// ============================================
// QUESTION DISPLAY COMPONENT
// ============================================

import type { Question } from "../../data/questions";
import type { Answer } from "../../types";

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: Answer;
  onSelectAnswer: (option: string) => void;
}

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}: QuestionDisplayProps) {
  const isAnswered = selectedAnswer !== null;

  const getOptionClasses = (option: string) => {
    const base =
      "relative w-full rounded-xl border-2 px-5 py-4 text-left text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

    if (!isAnswered) {
      return `${base} border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 hover:shadow-md cursor-pointer`;
    }

    if (option === question.correct) {
      return `${base} border-emerald-500 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800`;
    }

    if (option === selectedAnswer) {
      return `${base} border-rose-500 bg-gradient-to-r from-rose-50 to-rose-100 text-rose-800`;
    }

    return `${base} border-slate-200 bg-slate-50 text-slate-400 opacity-60`;
  };

  const getOptionIcon = (option: string) => {
    if (!isAnswered) return null;

    if (option === question.correct) {
      return (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs">
          ✓
        </span>
      );
    }

    if (option === selectedAnswer && option !== question.correct) {
      return (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white text-xs">
          ✕
        </span>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Question Number Badge - ADDED ON TOP */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
          <span className="text-2xl font-bold">{questionNumber}</span>
          <span className="text-blue-200">/</span>
          <span className="text-blue-100">{totalQuestions}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <button
            key={option}
            onClick={() => !isAnswered && onSelectAnswer(option)}
            className={getOptionClasses(option)}
            disabled={isAnswered}
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-xs font-bold text-slate-600 mr-3">
              {String.fromCharCode(65 + index)}
            </span>
            {option}
            {getOptionIcon(option)}
          </button>
        ))}
      </div>

      {/* Correct Answer Feedback */}
      {isAnswered && (
        <div
          className={`rounded-2xl p-4 ${
            selectedAnswer === question.correct
              ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200"
              : "bg-gradient-to-r from-rose-50 to-amber-50 border border-amber-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {selectedAnswer === question.correct ? "🎉" : "💡"}
            </span>
            <div>
              <p className="font-semibold text-slate-800">
                {selectedAnswer === question.correct
                  ? "To'g'ri javob!"
                  : "To'g'ri javob:"}
              </p>
              {selectedAnswer !== question.correct && (
                <p className="mt-1 text-sm text-emerald-700 font-medium">
                  {question.correct}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
