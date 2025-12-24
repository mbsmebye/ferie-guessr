/* src/types.ts */
export interface RoundResult {
  roundNumber: number;
  locationName: string;
  distance: number;
  score: number;
  isTimeout?: boolean; // Add this
}
