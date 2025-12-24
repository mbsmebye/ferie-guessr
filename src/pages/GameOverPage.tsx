/* src/pages/GameOverPage.tsx */
import React, { useState } from "react";
import type { RoundResult } from "../types";
import { PrizePage } from "./PrizePage";
import { SummaryPage } from "./SummaryPage";

interface GameOverPageProps {
  history: RoundResult[];
  onRestart: () => void;
  isLastGame: boolean;
  gameIndex: number;
  sessionScoreIds: string[]; // <--- New Prop
}

export const GameOverPage = ({
  history,
  onRestart,
  isLastGame,
  gameIndex,
  sessionScoreIds,
}: GameOverPageProps) => {
  const [view, setView] = useState<"summary" | "prize">("summary");

  const totalScore = history.reduce((acc, curr) => acc + curr.score, 0);
  const pointsToPrize = 25000 - totalScore;

  if (view === "prize") {
    return <PrizePage onRestart={onRestart} />;
  }

  return (
    <SummaryPage
      history={history}
      totalScore={totalScore}
      pointsToPrize={pointsToPrize}
      onRestart={onRestart}
      onShowPrize={() => setView("prize")}
      isLastGame={isLastGame}
      gameIndex={gameIndex}
      sessionScoreIds={sessionScoreIds} // <--- Pass down
    />
  );
};
