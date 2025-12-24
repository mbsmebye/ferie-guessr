/* src/components/GameMap.tsx */
import React, { useEffect } from "react";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import type { MapMouseEvent } from "@vis.gl/react-google-maps";
import familyPinImg from "../assets/family-pin.png";

interface GameMapProps {
  onMapClick: (e: MapMouseEvent) => void;
  guess: google.maps.LatLngLiteral | null;
  // CHANGE: Now accepts a number (1, 2, 3)
  mapSize: number;
}

export const GuessGameMap = ({ onMapClick, guess, mapSize }: GameMapProps) => {
  const map = useMap();

  // Trigger a resize event when mapSize changes so tiles reload correctly
  useEffect(() => {
    if (map) {
      google.maps.event.trigger(map, "resize");
    }
  }, [map, mapSize]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Map
        defaultCenter={{ lat: 0, lng: 0 }}
        defaultZoom={1}
        mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
        onClick={onMapClick}
        disableDefaultUI={true}
        gestureHandling={"greedy"}
        clickableIcons={false}
        draggableCursor="crosshair"
        style={{ width: "100%", height: "100%" }}
      >
        {guess && (
          <AdvancedMarker position={guess}>
            <div
              style={{
                width: "60px",
                height: "60px",
                transform: "translateY(50%)",
                borderRadius: "50%",
                border: "3px solid white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                overflow: "hidden",
                cursor: "pointer",
                background: "white",
              }}
            >
              <img
                src={familyPinImg}
                alt="Guess"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </AdvancedMarker>
        )}
      </Map>
    </div>
  );
};
