/* src/pages/SummaryPage.tsx */
import React, { useEffect, useState } from "react";
import type { RoundResult } from "../types";
import { Gift, AlertCircle, Trophy, RefreshCcw } from "lucide-react"; // Added Refresh icon
import { getScoresForEntireGame } from "../utils/firebase";
import { useGame } from "../utils/GameContext";

interface SummaryPageProps {
  history: RoundResult[];
  totalScore: number;
  pointsToPrize: number;
  onRestart: () => void;
  onShowPrize: () => void;
  isLastGame: boolean;
  gameIndex: number;
  sessionScoreIds: string[];
}

interface PlayerGridRow {
  name: string;
  rounds: number[];
  roundIds: string[];
  total: number;
}

export const SummaryPage = ({
  history,
  totalScore,
  pointsToPrize,
  onRestart,
  onShowPrize,
  isLastGame,
  gameIndex,
  sessionScoreIds,
}: SummaryPageProps) => {
  const { gameMode, playerName } = useGame();
  const [globalGrid, setGlobalGrid] = useState<PlayerGridRow[]>([]);

  // 1. Authorization & Mode Logic
  const authorizedUsers = ["elias", "elise", "helge", "jon", "martin"];
  const isAuthorizedForPrize = authorizedUsers.includes(
    playerName.toLowerCase().trim()
  );

  const isSecretMode = gameMode !== "default";
  const maxScore = history.length * 5000;
  const isPerfectScore = totalScore === maxScore;

  /**
   * CAN CLAIM PRIZE LOGIC:
   * - If Secret Mode: Must be Perfect Score. No pity prize.
   * - If Default Mode: Perfect Score OR Last Game (Pity).
   */
  const canClaimPrize =
    isAuthorizedForPrize && (isPerfectScore || (!isSecretMode && isLastGame));

  useEffect(() => {
    const fetchAndProcessScores = async () => {
      const rawScores = await getScoresForEntireGame(gameMode, gameIndex);
      const playerMap: Record<string, PlayerGridRow> = {};

      rawScores.forEach((entry: any) => {
        const name = entry.userName;
        if (!playerMap[name]) {
          playerMap[name] = {
            name: name,
            rounds: [0, 0, 0, 0, 0],
            roundIds: [],
            total: 0,
          };
        }

        const rIdx = entry.round - 1;
        if (rIdx >= 0 && rIdx < 5) {
          playerMap[name].rounds[rIdx] = entry.score;
          if (entry.id) playerMap[name].roundIds.push(entry.id);
        }
      });

      const sorted = Object.values(playerMap)
        .map((p) => ({ ...p, total: p.rounds.reduce((a, b) => a + b, 0) }))
        .sort((a, b) => b.total - a.total);

      setGlobalGrid(sorted);
    };
    fetchAndProcessScores();
  }, [gameMode, gameIndex]);

  return (
    <div className="result-page-container">
      <h1 className="summary-title">{"Spillet er over"}</h1>

      <div style={{ textAlign: "center" }}>
        <p className="summary-score-label">Din poengsum</p>
        <div
          className={`score-number summary-score-value ${
            isPerfectScore ? "perfect-text" : ""
          }`}
        >
          {totalScore.toLocaleString()}
        </div>
        <p className="summary-score-max">/ {maxScore.toLocaleString()}</p>
      </div>

      {/* 2. Status Banners */}
      {isAuthorizedForPrize ? (
        <>
          {isPerfectScore ? (
            <div className="status-banner success">
              <Gift size={20} />{" "}
              <span>Fantastisk! Du klarte 25.000 poeng!</span>
            </div>
          ) : isSecretMode ? (
            <div className="status-banner fail">
              <AlertCircle size={20} />
              <span>
                Du manglet{" "}
                <strong>{pointsToPrize.toLocaleString()} poeng</strong> for
                premie. Heldigvis kan man prøve flere ganger!
              </span>
            </div>
          ) : isLastGame ? (
            <div className="status-banner pity">
              <AlertCircle size={24} style={{ flexShrink: 0 }} />
              <span>Siden det er Jul blir det premie uansett :)</span>
            </div>
          ) : (
            <div className="status-banner fail">
              Du manglet <strong>{pointsToPrize.toLocaleString()} poeng</strong>{" "}
              for premie.
            </div>
          )}
        </>
      ) : (
        <div className="status-banner generic">
          Takk for at du spilte! Sjekk topplisten under.
        </div>
      )}

      {/* LEADERBOARD GRID */}
      <div className="leaderboard-card summary-leaderboard">
        <div className="leaderboard-header">
          <Trophy size={24} color="#fbbf24" />
          <h2 style={{ margin: 0, fontSize: "24px" }}>Resultater</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="leaderboard-table">
            <thead>
              <tr className="leaderboard-label-row">
                <th style={{ padding: "12px" }}>Bruker</th>
                <th>R1</th>
                <th>R2</th>
                <th>R3</th>
                <th>R4</th>
                <th>R5</th>
                <th style={{ textAlign: "right", padding: "12px" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {globalGrid.map((player, idx) => {
                const isMe = player.roundIds.some((id) =>
                  sessionScoreIds.includes(id)
                );
                return (
                  <tr
                    key={idx}
                    className={`leaderboard-row ${isMe ? "is-me" : ""}`}
                  >
                    <td className="player-name" style={{ padding: "12px" }}>
                      {player.name}
                    </td>
                    {player.rounds.map((s, i) => (
                      <td
                        key={i}
                        className="round-score-cell"
                        style={{ opacity: s > 0 ? 1 : 0.3 }}
                      >
                        {s > 0 ? s.toLocaleString() : "-"}
                      </td>
                    ))}
                    <td
                      className="player-score"
                      style={{ padding: "12px", textAlign: "right" }}
                    >
                      {player.total.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Actions */}
      <div
        className="summary-actions"
        style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          paddingBottom: "40px",
          width: "100%",
        }}
      >
        {canClaimPrize ? (
          <button
            onClick={onShowPrize}
            className="guess-btn prize-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "0 40px",
              width: "auto",
              background: "#fbbf24", // Golden prize color
              color: "#000", // Black text for contrast
            }}
          >
            <Gift size={20} />
            <span style={{ fontWeight: "800" }}>{"SE PREMIE"}</span>
          </button>
        ) : (
          <button
            onClick={onRestart}
            className="guess-btn restart-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "0 40px",
              width: "auto",
              background: "#10b981", // Standard green
            }}
          >
            <RefreshCcw size={20} />
            <span style={{ fontWeight: "800" }}>{"PRØV PÅ NYTT"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
