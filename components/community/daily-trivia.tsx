"use client";

import { useState } from "react";
import { quizQuestions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Brain, CheckCircle2, XCircle, Zap, RotateCcw } from "lucide-react";

export function DailyTrivia() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    new Array(quizQuestions.length).fill(null)
  );
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[currentQuestion];
  const isCorrect = selected === question.correctAnswer;
  const hasAnswered = selected !== null;

  function handleSelect(index: number) {
    if (hasAnswered) return;
    setSelected(index);
    const correct = index === question.correctAnswer;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = correct;
    setAnswers(newAnswers);
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  }

  function handleNext() {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((c) => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }

  function handleRestart() {
    setCurrentQuestion(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setAnswers(new Array(quizQuestions.length).fill(null));
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mb-2 text-3xl font-black uppercase text-foreground">
          Quiz Complete!
        </h2>
        <p className="mb-6 text-lg text-muted-foreground">
          You scored{" "}
          <span className="font-black text-primary">
            {score}/{quizQuestions.length}
          </span>{" "}
          ({pct}%)
        </p>

        {/* Results grid */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {answers.map((correct, i) => (
            <div
              key={`result-${i}`}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold",
                correct
                  ? "bg-green-500/20 text-green-600"
                  : "bg-destructive/20 text-destructive"
              )}
            >
              {correct ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" />
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase text-foreground">
              Daily Trivia
            </h2>
            <p className="text-xs text-muted-foreground">
              {question.category}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {streak > 1 && (
            <div className="flex items-center gap-1 rounded-lg bg-amber/20 px-3 py-1">
              <Zap className="h-4 w-4 text-amber" />
              <span className="text-sm font-black text-amber">
                {streak} streak
              </span>
            </div>
          )}
          <span className="text-sm font-bold text-muted-foreground">
            {currentQuestion + 1}/{quizQuestions.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${((currentQuestion + (hasAnswered ? 1 : 0)) / quizQuestions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <div className="p-6">
        <h3 className="mb-6 text-xl font-black leading-tight text-foreground">
          {question.question}
        </h3>

        <div className="flex flex-col gap-3">
          {question.options.map((option, i) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(i)}
              disabled={hasAnswered}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                hasAnswered
                  ? i === question.correctAnswer
                    ? "border-green-500 bg-green-500/10"
                    : i === selected
                      ? "border-destructive bg-destructive/10"
                      : "border-border opacity-50"
                  : "cursor-pointer border-border hover:border-primary hover:bg-primary/5"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-black",
                  hasAnswered
                    ? i === question.correctAnswer
                      ? "bg-green-600 text-white"
                      : i === selected
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-secondary text-muted-foreground"
                    : "bg-secondary text-foreground"
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span
                className={cn(
                  "text-sm font-bold",
                  hasAnswered
                    ? i === question.correctAnswer
                      ? "text-green-600"
                      : i === selected
                        ? "text-destructive"
                        : "text-muted-foreground"
                    : "text-foreground"
                )}
              >
                {option}
              </span>
              {hasAnswered && i === question.correctAnswer && (
                <CheckCircle2 className="ml-auto h-5 w-5 text-green-600" />
              )}
              {hasAnswered &&
                i === selected &&
                i !== question.correctAnswer && (
                  <XCircle className="ml-auto h-5 w-5 text-destructive" />
                )}
            </button>
          ))}
        </div>

        {/* Feedback + Next */}
        {hasAnswered && (
          <div className="mt-6 flex items-center justify-between">
            <p
              className={cn(
                "text-sm font-bold",
                isCorrect ? "text-green-600" : "text-destructive"
              )}
            >
              {isCorrect ? "Correct! Nice work." : "Incorrect. Better luck next time."}
            </p>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
            >
              {currentQuestion < quizQuestions.length - 1
                ? "Next Question"
                : "See Results"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
