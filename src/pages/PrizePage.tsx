/* src/pages/PrizePage.tsx */
import React, { useState } from "react";
import { useGame } from "../utils/GameContext";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { presentData } from "../utils/presentData";

interface PrizePageProps {
  onRestart: () => void;
}

export const PrizePage = ({ onRestart }: PrizePageProps) => {
  const { playerName } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nameKey = playerName.toLowerCase().trim();
  // Get data for player, or fallback to default
  const content = presentData[nameKey] || presentData.default;

  const currentPrize = content.prizes[currentIndex];

  const nextPrize = () =>
    setCurrentIndex((prev) => (prev + 1) % content.prizes.length);
  const prevPrize = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + content.prizes.length) % content.prizes.length
    );

  return (
    <div className="prize-page-container">
      <div className="snow-layer layer1" />
      <div className="snow-layer layer2" />
      <div className="snow-layer layer3" />

      <h1 className="prize-main-title">God Jul!</h1>

      <div className="prize-card">
        <h2 className="prize-recipient">{content.title}</h2>
        <p className="prize-description">{content.description}</p>

        <div className="prize-browser">
          {content.prizes.length > 1 && (
            <button className="nav-arrow left" onClick={prevPrize}>
              <ChevronLeft size={32} />
            </button>
          )}

          <div className="prize-display">
            <div className="prize-image-window">
              <img src={currentPrize.image} alt="Premie" />
            </div>

            <div className="prize-reveal-box">
              <span className="prize-label">
                PREMIE{" "}
                {content.prizes.length > 1
                  ? `${currentIndex + 1} av ${content.prizes.length}`
                  : ""}
              </span>
              <div className="prize-text">{currentPrize.prizeText}</div>

              {currentPrize.webLink && (
                <button
                  onClick={() => window.open(currentPrize.webLink, "_blank")}
                  className="interactive-link-btn"
                >
                  <ExternalLink size={16} />
                  Se interaktiv hilsen
                </button>
              )}
            </div>
          </div>

          {content.prizes.length > 1 && (
            <button className="nav-arrow right" onClick={nextPrize}>
              <ChevronRight size={32} />
            </button>
          )}
        </div>

        <div className="prize-signature">
          Hilsen <span className="signature-name">Martin</span>
        </div>
      </div>

      <button onClick={onRestart} className="prize-restart-btn">
        TILBAKE TIL START
      </button>
    </div>
  );
};
