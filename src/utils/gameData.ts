import loc1 from "../assets/locations/loc1.jpg";
import loc2 from "../assets/locations/loc2.jpg";
import loc3 from "../assets/locations/loc3.jpg";
import loc4 from "../assets/locations/loc4.jpg";
import loc5 from "../assets/locations/loc5.jpg";
import loc1fs from "../assets/locations/loc1fs.jpg";
import loc2fs from "../assets/locations/loc2fs.jpg";

export interface RoundData {
  image: string;
  name: string;
  coords: google.maps.LatLngLiteral;
}

// --- STANDARD MODE ROUNDS (Knudsen Smebye) ---
const game1Rounds: RoundData[] = [
  {
    image: loc1,
    name: "Torggata Botaniske, Oslo",
    coords: { lat: 59.91612047, lng: 10.7521237229 },
  },
  {
    image: loc2,
    name: "Manneken Pis, Brüssel",
    coords: { lat: 50.844998, lng: 4.349953 },
  },
  {
    image: loc3,
    name: "Lews Castle, Isle of Lewis",
    coords: { lat: 58.210883, lng: -6.393268 },
  },
  {
    image: loc4,
    name: "Gløshaugen, Trondheim",
    coords: { lat: 63.4181673, lng: 10.402834817 },
  },
  {
    image: loc5,
    name: "A-brug, Groningen",
    coords: { lat: 53.21795612115, lng: 6.55878995 },
  },
];

const game2Rounds: RoundData[] = [
  {
    image: loc1,
    name: "Torggata Botaniske, Oslo",
    coords: { lat: 59.91612047, lng: 10.7521237229 },
  },
  {
    image: loc2,
    name: "Manneken Pis, Brüssel",
    coords: { lat: 50.844998, lng: 4.349953 },
  },
  {
    image: loc3,
    name: "Lews Castle, Isle of Lewis",
    coords: { lat: 58.210883, lng: -6.393268 },
  },
  {
    image: loc4,
    name: "Gløshaugen, Trondheim",
    coords: { lat: 63.4181673, lng: 10.402834817 },
  },
  {
    image: loc5,
    name: "A-brug, Groningen",
    coords: { lat: 53.21795612115, lng: 6.55878995 },
  },
];

// --- SECRET MODE ROUNDS (Fuglestrand Smebye) ---

const fsGame1: RoundData[] = [
  {
    image: loc1fs,
    name: "Edinburgh Castle, Edinburgh",
    coords: { lat: 55.9486766284, lng: -3.19797211111 }, // 55.948676628497594, -3.1979721111187653
  },
  {
    image: loc2fs,
    name: "Dunrobin Castle, Sutherland",
    coords: { lat: 57.982358395, lng: -3.945859393 }, // 57.982358395008674, -3.945859393064197
  },
  {
    image: loc4,
    name: "Gløshaugen, Trondheim",
    coords: { lat: 63.4181673, lng: 10.402834817 },
  },
  {
    image: loc4,
    name: "Gløshaugen, Trondheim",
    coords: { lat: 63.4181673, lng: 10.402834817 },
  },
  {
    image: loc4,
    name: "Gløshaugen, Trondheim",
    coords: { lat: 63.4181673, lng: 10.402834817 },
  },
  // ...
];

// --- EXPORTS ---

// Used for "Knudsen Smebye Mode"
export const defaultGames = [game1Rounds];

// Used for "Fuglestrand Smebye Mode"
export const fuglesmedGames = [fsGame1];
