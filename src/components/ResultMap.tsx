/* src/components/ResultMap.tsx */
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import familyPinImg from "../assets/family-pin.png";
import { PicturePin } from "./PicturePin";

interface ResultMapProps {
  // Now allows null for timeouts
  guess: google.maps.LatLngLiteral | null;
  answer: google.maps.LatLngLiteral;
  image: string;
}

export const ResultMap = ({ guess, answer, image }: ResultMapProps) => {
  const map = useMap();
  const [showLine, setShowLine] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // 1. CALCULATE MIDPOINT (Null-safe)
  const initialCenter = useMemo(() => {
    if (!guess) return answer; // Center on answer if no guess exists
    return {
      lat: (guess.lat + answer.lat) / 2,
      lng: (guess.lng + answer.lng) / 2,
    };
  }, [guess, answer]);

  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  // --- CAMERA ANIMATION ---
  useEffect(() => {
    if (!map || !answer) return;

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(answer);
    if (guess) bounds.extend(guess);

    const listener = google.maps.event.addListenerOnce(map, "idle", () => {
      const startZoom = map.getZoom() || 3;
      const startCenter = map.getCenter();
      if (!startCenter) return;

      let targetZoom: number;
      let targetCenter: google.maps.LatLng;

      // Handle branching target logic
      if (guess) {
        map.fitBounds(bounds, 100);
        const fitZoom = map.getZoom() || 3;
        const fitCenter = map.getCenter();

        if (fitCenter && window.google?.maps?.geometry) {
          targetCenter = window.google.maps.geometry.spherical.interpolate(
            fitCenter,
            answer,
            0.2
          );
        } else {
          targetCenter = fitCenter!;
        }
        targetZoom = fitZoom;
      } else {
        // TIMEOUT: Fly directly to answer
        targetCenter = new google.maps.LatLng(answer.lat, answer.lng);
        targetZoom = 14;
      }

      map.setCenter(startCenter);
      map.setZoom(startZoom);

      const duration = 2500;
      const startTime = performance.now();

      const animateCamera = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutQuad(progress);

        const currentZoom =
          startZoom + (targetZoom - startZoom) * easedProgress;

        if (window.google?.maps?.geometry) {
          const currentCenter =
            window.google.maps.geometry.spherical.interpolate(
              startCenter,
              targetCenter,
              easedProgress
            );

          map.moveCamera({ center: currentCenter, zoom: currentZoom });
        }

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateCamera);
        } else {
          // If no guess, skip line drawing and show answer immediately
          if (guess) {
            setShowLine(true);
          } else {
            setShowAnswer(true);
          }
        }
      };
      animationFrameRef.current = requestAnimationFrame(animateCamera);
    });

    return () => {
      google.maps.event.removeListener(listener);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [map, guess, answer]);

  // --- LINE DRAWING LOGIC ---
  useEffect(() => {
    if (!map || !guess || !showLine) {
      // If no line or no guess, clear existing polyline
      if (polylineRef.current) polylineRef.current.setMap(null);
      return;
    }

    const lineSymbol = {
      path: "M -1,-2 L 1,-2 L 1,2 L -1,2 Z",
      fillColor: "#000000",
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 2,
    };

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        path: [guess, guess],
        strokeOpacity: 0,
        icons: [{ icon: lineSymbol, offset: "0", repeat: "20px" }],
        geodesic: true,
        map: map,
      });
    }

    let progress = 0;
    const speed = 0.015;

    const animateLine = () => {
      progress += speed;
      if (progress > 1) progress = 1;

      if (window.google?.maps?.geometry) {
        const nextPoint = window.google.maps.geometry.spherical.interpolate(
          guess,
          answer,
          progress
        );
        polylineRef.current?.setPath([guess, nextPoint]);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateLine);
      } else {
        setShowAnswer(true);
      }
    };
    animateLine();

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, showLine, guess, answer]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Map
        defaultCenter={initialCenter}
        defaultZoom={3}
        mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
        disableDefaultUI={true}
        gestureHandling={"none"}
        clickableIcons={false}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Only show User Pin if guess exists */}
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
                background: "white",
              }}
            >
              <img
                src={familyPinImg}
                alt="My Guess"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </AdvancedMarker>
        )}

        {showAnswer && (
          <AdvancedMarker position={answer} zIndex={2}>
            <PicturePin image={image} color="#10b981" />
          </AdvancedMarker>
        )}
      </Map>
    </div>
  );
};
