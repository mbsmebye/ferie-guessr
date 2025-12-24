/* src/App.tsx */
import React, { useState, useMemo } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { GuessPage } from "./pages/GuessPage";
import { ResultPage } from "./pages/ResultPage";
import { GameOverPage } from "./pages/GameOverPage";
import { IntroPage } from "./pages/IntroPage";
import { TopBar } from "./components/TopBar";
import { calculateScore, getDistance } from "./utils/gameUtils";
import type { RoundResult } from "./types";
import { defaultGames, fuglesmedGames } from "./utils/gameData";
import { useGame } from "./utils/GameContext";
import {
  saveUserState,
  getUserState,
  saveRoundScore,
  getScoresForSpecificGameUser,
} from "./utils/firebase";
import "./App.css";

const App = () => {
  const { playerName, gameMode } = useGame();

  const [gameState, setGameState] = useState<
    "intro" | "guessing" | "result" | "finished"
  >("intro");
  const [gameIndex, setGameIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [lastSavedScoreId, setLastSavedScoreId] = useState<string | null>(null);
  const [sessionScoreIds, setSessionScoreIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [userGuess, setUserGuess] = useState<google.maps.LatLngLiteral | null>(
    null
  );

  const activeGameList = useMemo(() => {
    const modeMapping: Record<string, any> = {
      default: defaultGames,
      fuglesmed: fuglesmedGames,
    };
    return modeMapping[gameMode] || defaultGames;
  }, [gameMode]);

  const activeRounds = activeGameList[gameIndex] || activeGameList[0];
  const currentRound = activeRounds[roundIndex] || activeRounds[0];
  const currentScore = history.reduce((acc, curr) => acc + curr.score, 0);

  // --- HANDLERS ---

  const handleStartGame = async (nameFromIntro: string) => {
    try {
      const saved = await getUserState(nameFromIntro, gameMode);
      if (saved && saved.gameState && saved.gameState !== "intro") {
        const previousScores = await getScoresForSpecificGameUser(
          nameFromIntro,
          gameMode,
          saved.gameIndex
        );
        const reconstructedHistory: RoundResult[] = previousScores.map(
          (s: any) => ({
            roundNumber: s.round,
            locationName: s.locationName || "Sted",
            distance: s.distance || 0,
            score: s.score,
          })
        );

        setHistory(reconstructedHistory);
        setGameIndex(Number(saved.gameIndex));
        setRoundIndex(Number(saved.roundIndex));
        setUserGuess(saved.userGuess || null);
        setGameState(saved.gameState as any);
      } else {
        setGameState("guessing");
      }
    } catch (err) {
      console.error("Critical error in handleStartGame:", err);
      setGameState("guessing");
    }
  };

  /**
   * UPDATED: handleGuessConfirmed now accepts null (for timeouts)
   */
  const handleGuessConfirmed = async (
    location: google.maps.LatLngLiteral | null
  ) => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      let dist = 0;
      let score = 0;

      // If location is provided, calculate normally. If null, score remains 0.
      if (location) {
        dist = getDistance(location, currentRound.coords);
        score = calculateScore(dist);
      }

      const newResult: RoundResult = {
        roundNumber: roundIndex + 1,
        locationName: currentRound.name,
        distance: dist,
        score: score,
      };

      setHistory((prev) => [...prev, newResult]);
      setUserGuess(location);

      const docId = await saveRoundScore(
        playerName,
        gameMode,
        gameIndex,
        roundIndex + 1,
        score,
        dist,
        currentRound.name
      );

      // Save user state with the location (which might be null)
      await saveUserState(
        playerName,
        gameMode,
        gameIndex,
        roundIndex,
        "result",
        location
      );

      setLastSavedScoreId(docId);
      setSessionScoreIds((prev) => [...prev, docId]);
      setGameState("result");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextRound = async () => {
    const nextIndex = roundIndex + 1;
    if (nextIndex < activeRounds.length) {
      setRoundIndex(nextIndex);
      setUserGuess(null);
      setLastSavedScoreId(null);
      await saveUserState(
        playerName,
        gameMode,
        gameIndex,
        nextIndex,
        "guessing",
        null
      );
      setGameState("guessing");
    } else {
      await saveUserState(
        playerName,
        gameMode,
        gameIndex,
        roundIndex,
        "finished",
        null
      );
      setGameState("finished");
    }
  };

  const handleRestartGame = async () => {
    const nextGameIdx =
      gameIndex < activeGameList.length - 1 ? gameIndex + 1 : 0;
    setGameIndex(nextGameIdx);
    setRoundIndex(0);
    setHistory([]);
    setUserGuess(null);
    setSessionScoreIds([]);
    await saveUserState(playerName, gameMode, nextGameIdx, 0, "guessing", null);
    setGameState("guessing");
  };

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}
      libraries={["geometry"]}
    >
      {(gameState === "guessing" || gameState === "result") && (
        <TopBar
          currentRound={roundIndex + 1}
          totalRounds={activeRounds.length}
          score={currentScore}
        />
      )}

      {gameState === "intro" && (
        <IntroPage onStart={(name) => handleStartGame(name)} />
      )}

      {gameState === "guessing" && currentRound && (
        <GuessPage
          currentImage={currentRound.image}
          onGuessConfirmed={handleGuessConfirmed}
          roundNumber={roundIndex + 1}
          totalRounds={activeRounds.length}
        />
      )}

      {gameState === "result" && (
        <ResultPage
          guess={userGuess} // Passing the null-safe guess
          answer={currentRound.coords}
          image={currentRound.image}
          history={history}
          onPlayAgain={handleNextRound}
          gameIndex={gameIndex}
          roundIndex={roundIndex + 1}
          currentScoreId={lastSavedScoreId}
        />
      )}

      {gameState === "finished" && (
        <GameOverPage
          history={history}
          onRestart={handleRestartGame}
          isLastGame={gameIndex === activeGameList.length - 1}
          gameIndex={gameIndex}
          sessionScoreIds={sessionScoreIds}
        />
      )}
    </APIProvider>
  );
};

export default App;
