/* src/components/TopBar.tsx */
import React from "react";
import { Trophy, MapPin, Volume2, VolumeX } from "lucide-react";
import { useGame } from "../utils/GameContext";

interface TopBarProps {
  currentRound: number;
  totalRounds: number;
  score: number;
}

export const TopBar = ({ currentRound, totalRounds, score }: TopBarProps) => {
  const { gameMode, isMuted, toggleMute } = useGame();

  const subtitle =
    gameMode === "fuglesmed"
      ? "Fuglestrand Smebye Mode"
      : "Knudsen Smebye Mode";

  const subtitleColor =
    gameMode === "fuglesmed" ? "#fbbf24" : "rgba(255,255,255,0.5)";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "80px",
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        boxSizing: "border-box",
        background: "#1a1a1a",
        color: "white",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
      }}
    >
      {/* --- LEFT: ROUND COUNTER --- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "16px",
          fontWeight: "bold",
          width: "220px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "8px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MapPin size={18} />
        </div>
        <span>
          Runde {currentRound}{" "}
          <span style={{ opacity: 0.5 }}>/ {totalRounds}</span>
        </span>
      </div>

      {/* --- CENTER: BRANDING --- */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            fontWeight: "900",
            letterSpacing: "0.5px",
          }}
        >
          Ferie & fritids<span style={{ color: "#10b981" }}>GUESSR</span>
        </div>

        <div
          style={{
            fontSize: "11px",
            color: subtitleColor,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginTop: "4px",
            fontWeight: "bold",
            transition: "color 0.3s ease",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* --- RIGHT: SCORE & AUDIO --- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "15px",
          fontSize: "20px",
          fontWeight: "bold",
          width: "220px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>{score.toLocaleString()}</span>
          <div
            style={{
              background: "#10b981",
              padding: "8px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            }}
          >
            <Trophy size={18} color="white" />
          </div>
        </div>

        <div
          style={{
            width: "1px",
            height: "24px",
            background: "rgba(255,255,255,0.2)",
          }}
        />

        {/* --- FIXED MUTE BUTTON --- */}
        <button
          onClick={toggleMute}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: "50%",
            width: "40px", // Slightly larger click target
            height: "40px",
            padding: 0, // <--- CRITICAL: Resets default browser padding
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            transition: "background 0.2s",
          }}
          title={isMuted ? "Skru på lyd" : "Skru av lyd"}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
          }
        >
          {isMuted ? (
            <VolumeX size={20} color="white" strokeWidth={2.5} />
          ) : (
            <Volume2 size={20} color="white" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
};
