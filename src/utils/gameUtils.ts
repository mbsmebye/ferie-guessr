/* src/utils/gameUtils.ts */

// 1. Calculate Distance (Haversine Formula) - Returns meters
export const getDistance = (
  p1: google.maps.LatLngLiteral,
  p2: google.maps.LatLngLiteral
) => {
  const R = 6371e3; // Earth radius in meters
  const rad = (x: number) => (x * Math.PI) / 180;

  const lat1 = rad(p1.lat);
  const lat2 = rad(p2.lat);
  const dLat = rad(p2.lat - p1.lat);
  const dLng = rad(p2.lng - p1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// 2. Calculate Score (GeoGuessr Style) - Returns 0 to 5000
export const calculateScore = (distanceInMeters: number) => {
  // 1. Stricter limit for full score (20 meters)
  if (distanceInMeters <= 20) return 5000;

  // 2. Exponential decay curve
  // A smaller denominator (e.g., 500,000) makes the scoring much stricter.
  // With 500,000:
  // - 10km error  = ~4900 points
  // - 100km error = ~4090 points
  // - 500km error = ~1840 points
  // - 1000km error = ~670 points
  const decayConstant = 500000;
  const score = 5000 * Math.exp(-distanceInMeters / decayConstant);

  return Math.round(Math.max(0, score));
};

// 3. Format Distance for display (e.g. "1,200 km" or "500 m")
export const formatDistance = (distanceInMeters: number) => {
  if (distanceInMeters >= 1000) {
    return `${Math.round(distanceInMeters / 1000).toLocaleString()} km`;
  }
  return `${Math.round(distanceInMeters)} m`;
};
