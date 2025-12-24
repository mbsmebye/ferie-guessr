/* src/pages/IntroPage.tsx */
import React, { useState, useEffect } from "react";
import { Play, Unlock, User, Volume2, Terminal } from "lucide-react";
import { useGame } from "../utils/GameContext";
import "./IntroPage.css";

interface IntroPageProps {
  onStart: (name: string) => void;
}

export const IntroPage = ({ onStart }: IntroPageProps) => {
  const { setPlayerName, setGameMode, enableAudio, audioEnabled } = useGame();
  const [inputValue, setInputValue] = useState("");
  const [secretName, setSecretName] = useState("");
  const [secretType, setSecretType] = useState<"none" | "dropdown" | "custom">(
    "none"
  );

  const [isGlitching, setIsGlitching] = useState(false);
  const [shouldAnimateText, setShouldAnimateText] = useState(false);

  useEffect(() => {
    const normalized = inputValue.trim().toLowerCase();
    let detected: "none" | "dropdown" | "custom" = "none";

    if (normalized === "kodenavn_fuglesmed") detected = "dropdown";
    else if (normalized === "kodenavn_fuglesmedxxx") detected = "custom";

    if (detected !== "none" && secretType === "none") {
      setIsGlitching(true);
      setShouldAnimateText(false); // Reset animation state

      setTimeout(() => {
        setIsGlitching(false);
        setShouldAnimateText(true); // Start typing after glitch clears
      }, 1000);
    }

    if (detected === "dropdown") {
      setSecretType("dropdown");
      setGameMode("fuglesmed");
    } else if (detected === "custom") {
      setSecretType("custom");
      setGameMode("fuglesmed");
    } else {
      if (secretType !== "none") {
        setSecretType("none");
        setSecretName("");
        setGameMode("default");
        setShouldAnimateText(false);
      }
    }
  }, [inputValue, setGameMode, secretType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = (secretType !== "none" ? secretName : inputValue).trim();
    if (finalName) {
      setPlayerName(finalName);
      if (!audioEnabled) enableAudio();
      onStart(finalName);
    }
  };

  const isReady =
    secretType !== "none" ? !!secretName.trim() : !!inputValue.trim();
  const isSecretActive = secretType !== "none";

  return (
    <div className={`intro-container ${isGlitching ? "glitch-active" : ""}`}>
      {isGlitching && (
        <>
          <div className="glitch-overlay" />
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="glitch-symbol"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              {
                ["$", "@", "#", "&", "Ø", "X", "{", "}", "1", "0"][
                  Math.floor(Math.random() * 10)
                ]
              }
            </div>
          ))}
          <div className="glitch-text-flash">
            <Terminal size={40} className="glitch-icon-spin" />
            <div className="glitch-scanline"></div>
            <span>[ SYSTEM OVERRIDE ]</span>
          </div>
        </>
      )}

      <div className={`intro-brand ${isGlitching ? "glitch-brand-shake" : ""}`}>
        <h1 className="intro-title">
          Ferie & fritids<span style={{ color: "#10b981" }}>GUESSR</span>
        </h1>

        <div
          className={`intro-subtitle ${isSecretActive ? "is-secret" : ""} ${
            shouldAnimateText ? "typewriter-active" : ""
          }`}
        >
          {isSecretActive ? "Fuglestrand Smebye Mode" : "Knudsen Smebye Mode"}
        </div>
      </div>

      {!audioEnabled && (
        <button onClick={enableAudio} className="sound-cta" type="button">
          <Volume2 size={32} strokeWidth={2.5} />
          SKRU PÅ LYD
        </button>
      )}

      <form onSubmit={handleSubmit} className="intro-form">
        <div className="input-group">
          <label className="intro-label">
            {isSecretActive
              ? "Skriv inn aktiveringskode"
              : "Skriv inn navnet ditt"}
          </label>

          <input
            type="text"
            className={`intro-input ${isSecretActive ? "is-secret" : ""}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Navn..."
            autoFocus
          />

          {secretType === "dropdown" && (
            <div className="secret-section">
              <div className="secret-header">
                <Unlock size={16} /> <span>KODE GODKJENT</span>
              </div>
              <select
                className="secret-select"
                onChange={(e) => setSecretName(e.target.value)}
                value={secretName}
              >
                <option value="" disabled>
                  Velg profil...
                </option>
                <option value="Elise">Elise</option>
                <option value="Elias">Elias</option>
              </select>
            </div>
          )}

          {secretType === "custom" && (
            <div className="secret-section">
              <div className="secret-header">
                <Unlock size={16} /> <span>KODE GODKJENT: GJESTEMODUS</span>
              </div>
              <div className="custom-input-wrapper">
                <User size={20} className="custom-icon" />
                <input
                  type="text"
                  className="intro-input custom-secondary"
                  value={secretName}
                  onChange={(e) => setSecretName(e.target.value)}
                  placeholder="Skriv ditt navn her..."
                />
              </div>
            </div>
          )}
        </div>

        <button type="submit" disabled={!isReady} className="intro-button">
          <Play fill="currentColor" size={20} />
          START SPILLET
        </button>
      </form>
    </div>
  );
};
