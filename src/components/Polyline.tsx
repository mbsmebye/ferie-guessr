import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

interface PolylineProps {
  path: google.maps.LatLngLiteral[];
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
}

export const Polyline = ({
  path,
  strokeColor = "#FF0000",
  strokeWeight = 3,
  strokeOpacity = 1.0,
}: PolylineProps) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        path,
        strokeColor,
        strokeWeight,
        strokeOpacity,
        geodesic: true,
        map,
      });
    }

    polylineRef.current.setOptions({
      path,
      strokeColor,
      strokeWeight,
      strokeOpacity,
    });

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, path, strokeColor, strokeWeight, strokeOpacity]);

  return null;
};
