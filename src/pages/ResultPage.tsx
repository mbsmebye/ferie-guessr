/* src/pages/ResultPage.tsx */
import React, { useEffect, useState } from "react";
import { ResultMap } from "../components/ResultMap";
import { formatDistance } from "../utils/gameUtils";
import type { RoundResult } from "../types";
import { useGame } from "../utils/GameContext";
import { getScoresForSpecificRound } from "../utils/firebase";
import { Trophy, Clock } from "lucide-react"; // Added Clock icon

interface ResultPageProps {
  // UPDATED: Now accepts null for timeouts
  guess: google.maps.LatLngLiteral | null;
  answer: google.maps.LatLngLiteral;
  history: RoundResult[];
  image: string;
  onPlayAgain: () => void;
  gameIndex: number;
  roundIndex: number;
  currentScoreId: string | null;
}

export const ResultPage = ({
  guess,
  answer,
  image,
  history,
  onPlayAgain,
  gameIndex,
  roundIndex,
  currentScoreId,
}: ResultPageProps) => {
  const { gameMode } = useGame();
  const [globalScores, setGlobalScores] = useState<any[]>([]);
  const currentResult = history[history.length - 1];

  // Logic to determine if this round was a timeout
  const isTimeout = guess === null;

  useEffect(() => {
    let isMounted = true;

    const fetchLeaderboard = async () => {
      try {
        const scores = await getScoresForSpecificRound(
          gameMode,
          gameIndex,
          roundIndex
        );
        if (isMounted) {
          setGlobalScores(scores);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    };

    fetchLeaderboard();

    return () => {
      isMounted = false;
    };
  }, [gameMode, gameIndex, roundIndex, currentScoreId]);

  return (
    <div className="result-page-container">
      {/* 1. Map Container */}
      <div className="map-result-wrapper">
        <ResultMap guess={guess} answer={answer} image={image} />
      </div>

      {/* 2. Content Grid */}
      <div className="result-grid">
        {/* LEFT: Your Score */}
        <div className={`your-score-card ${isTimeout ? "timeout-card" : ""}`}>
          <div className="location-name">{currentResult.locationName}</div>

          <div className="distance-text">
            {isTimeout ? (
              <span className="timeout-label">
                <Clock size={16} style={{ marginRight: "4px" }} />
                TIDEN GIKK UT!
              </span>
            ) : (
              `Du var ${formatDistance(currentResult.distance)} unna`
            )}
          </div>

          <div className="score-number">
            {currentResult.score.toLocaleString()} Poeng
          </div>

          <button
            className="guess-btn"
            onClick={onPlayAgain}
            style={{ width: "100%", background: "#10b981", marginTop: "10px" }}
          >
            NESTE RUNDE
          </button>
        </div>

        {/* RIGHT: Global Round Leaderboard */}
        <div className="leaderboard-card">
          <div className="leaderboard-header">
            <Trophy size={18} color="#fbbf24" />
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>
              Toppliste denne runden
            </span>
          </div>

          <div className="leaderboard-scroll">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Navn</th>
                  <th style={{ textAlign: "right" }}>Poeng</th>
                </tr>
              </thead>
              <tbody>
                {globalScores.map((entry, index) => {
                  const isMe = entry.id === currentScoreId;

                  return (
                    <tr
                      key={entry.id || index}
                      className={`leaderboard-row ${isMe ? "is-me" : ""}`}
                    >
                      <td style={{ opacity: 0.7 }}>{index + 1}</td>
                      <td className="player-name">{entry.userName}</td>
                      <td
                        className="player-score"
                        style={{ textAlign: "right" }}
                      >
                        {entry.score.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}

                {globalScores.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        opacity: 0.5,
                      }}
                    >
                      Laster resultater...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
