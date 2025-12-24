/* src/pages/GuessPage.tsx */
import React, { useState, useEffect } from "react";
import type { MapMouseEvent } from "@vis.gl/react-google-maps";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { GuessGameMap } from "../components/GuessGameMap";
import { useGame } from "../utils/GameContext";
import {
  Minus,
  Map as MapIcon,
  ArrowUpLeft,
  ArrowDownRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Timer,
} from "lucide-react";

interface GuessPageProps {
  currentImage: string;
  roundNumber: number;
  totalRounds: number;
  onGuessConfirmed: (location: google.maps.LatLngLiteral | null) => void;
}

export const GuessPage = ({
  currentImage,
  roundNumber,
  totalRounds,
  onGuessConfirmed,
}: GuessPageProps) => {
  const { gameMode } = useGame();
  const [guess, setGuess] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapSize, setMapSize] = useState<number>(2);
  const [isHidden, setIsHidden] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // --- TIMER LOGIC ---
  // --- TIMER LOGIC ---
  useEffect(() => {
    if (gameMode === "default") return;

    if (timeLeft <= 0) {
      // If the user has a pin (guess), send it. If not, send null.
      // Explicitly send null instead of letting it be undefined or {0,0}
      onGuessConfirmed(guess || null);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, gameMode, onGuessConfirmed, guess]);

  const handleMapClick = (e: MapMouseEvent) => {
    if (e.detail.latLng) {
      setGuess(e.detail.latLng);
    }
  };

  const handleGuess = () => {
    if (guess) {
      onGuessConfirmed(guess);
    }
  };

  return (
    <div className="game-container">
      {/* 0. TIMER OVERLAY (Hidden in Default Mode) */}
      {gameMode !== "default" && (
        <div className={`timer-overlay ${timeLeft <= 10 ? "timer-low" : ""}`}>
          <Timer size={24} />
          <span>{timeLeft}s</span>
        </div>
      )}

      {/* 1. IMAGE WRAPPER (Zoom/Pan/Pinch) */}
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={4}
        centerOnInit={true}
        wheel={{ step: 0.2 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* 2. ZOOM CONTROLS UI (Bottom Left) */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "20px",
                zIndex: 10,
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                className="control-btn"
                onClick={() => zoomIn()}
                title="Zoom In"
              >
                <ZoomIn size={20} />
              </button>
              <button
                className="control-btn"
                onClick={() => zoomOut()}
                title="Zoom Out"
              >
                <ZoomOut size={20} />
              </button>
              <button
                className="control-btn"
                onClick={() => resetTransform()}
                title="Reset View"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            {/* 3. THE IMAGE COMPONENT */}
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{ width: "100%", height: "100%" }}
            >
              <img
                src={currentImage}
                alt={`Round ${roundNumber}`}
                className="background-image"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* 4. MAP OVERLAY (Floating) */}
      <div
        className={`map-overlay ${
          isHidden ? "map-hidden" : `map-size-${mapSize}`
        }`}
      >
        <div className="map-header">
          {isHidden ? (
            <button
              className="control-btn-wide"
              onClick={() => setIsHidden(false)}
              title="Show Map"
            >
              <MapIcon style={{ marginRight: "8px" }} />
              SHOW MAP
            </button>
          ) : (
            <>
              <button
                className="control-btn"
                onClick={() => setMapSize((s) => Math.min(s + 1, 3))}
                disabled={mapSize === 3}
                title="Expand"
              >
                <ArrowUpLeft />
              </button>
              <button
                className="control-btn"
                onClick={() => setMapSize((s) => Math.max(s - 1, 1))}
                disabled={mapSize === 1}
                title="Shrink"
              >
                <ArrowDownRight />
              </button>

              <div style={{ width: "5px" }} />

              <button
                className="control-btn"
                onClick={() => setIsHidden(true)}
                title="Hide Map"
              >
                <Minus />
              </button>
            </>
          )}
        </div>

        <div
          className="map-content-wrapper"
          style={{ display: isHidden ? "none" : "block" }}
        >
          <GuessGameMap
            onMapClick={handleMapClick}
            guess={guess}
            mapSize={mapSize}
          />
        </div>

        {!isHidden && (
          <button className="guess-btn" disabled={!guess} onClick={handleGuess}>
            GJETT
          </button>
        )}
      </div>
    </div>
  );
};
