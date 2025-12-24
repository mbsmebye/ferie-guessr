import loc1 from "../assets/locations/loc1.jpg";
import loc2 from "../assets/locations/loc2.jpg";
import loc3 from "../assets/locations/loc3.jpg";
import loc4 from "../assets/locations/loc4.jpg";
import loc5 from "../assets/locations/loc5.jpg";
import loc6 from "../assets/locations/loc6.jpg";
import loc7 from "../assets/locations/loc7.jpg";
import loc8 from "../assets/locations/loc8.jpg";
import loc9 from "../assets/locations/loc9.jpg";
import loc10 from "../assets/locations/loc10.jpg";
import loc11 from "../assets/locations/loc11.jpg";
import loc12 from "../assets/locations/loc12.jpg";
import loc13 from "../assets/locations/loc13.jpg";
import loc14 from "../assets/locations/loc14.jpg";
import loc15 from "../assets/locations/loc15.jpg";
import loc1fs from "../assets/locations/loc1fs.jpg";
import loc2fs from "../assets/locations/loc2fs.jpg";
import loc3fs from "../assets/locations/loc3fs.jpg";
import loc4fs from "../assets/locations/loc4fs.jpg";
import loc5fs from "../assets/locations/loc5fs.jpg";

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
    image: loc6,
    name: "Flisingstu, Overhalla",
    coords: { lat: 59.91612047, lng: 10.7521237229 }, // 64.41228671408413, 11.712845995064413
  },
  {
    image: loc7,
    name: "Mikkelier Bar, Berlin", // 52.52956222385185, 13.403891838081195
    coords: { lat: 52.5295622238518, lng: 13.403891838081195 },
  },
  {
    image: loc8,
    name: "Maridalen Velhus, Oslo",
    coords: { lat: 60.0052056739743, lng: 10.7731434507 }, //60.0052056739743, 10.773143450733613
  },
  {
    image: loc9,
    name: "St. Hanshaugen, Oslo",
    coords: { lat: 59.925359968182, lng: 10.739489933836 },
  },
  {
    image: loc10,
    name: "Ingierstrand, Oslo",
    coords: { lat: 59.818585673473, lng: 10.748726521863 }, // 59.81858567347393, 10.748726521863341
  },
];

const game3Rounds: RoundData[] = [
  {
    image: loc11,
    name: "Trænstaven, Sørsanna",
    coords: { lat: 66.5114727545968, lng: 12.047639779756 }, // 66.51147275459688, 12.047639779756562
  },
  {
    image: loc12,
    name: "Fosse, Strandebarm",
    coords: { lat: 60.2711564813, lng: 6.034696655864 },
  },
  {
    image: loc13,
    name: "Jiehkkevárri, Lyngen",
    coords: { lat: 69.469269990387, lng: 10.7731434507 }, //69.46926999038729, 19.87760958704683
  },
  {
    image: loc14,
    name: "Kollbanen, Oslo",
    coords: { lat: 59.965528035914, lng: 10.74053469694 }, // 59.965528035914886, 10.74053469694477
  },
  {
    image: loc15,
    name: "Ullevål Sykehus, Oslo",
    coords: { lat: 59.93735383448, lng: 10.7405812244815 }, // 59.93735383448613, 10.740581224481575
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
    image: loc3fs,
    name: "Fuglemyrhytta, Oslo",
    coords: { lat: 59.97821665573956, lng: 10.6952438985167 }, // 59.978216655739566, 10.695243898516868
  },
  {
    image: loc4fs,
    name: "Ølakademiet, Oslo",
    coords: { lat: 59.92118699829, lng: 10.75897450363 }, // 59.92118699829443, 10.758974503639672
  },
  {
    image: loc5fs,
    name: "Torre dell'Orologio, Venezia",
    coords: { lat: 45.43458680881, lng: 12.33908484741 }, // 45.43458680881612, 12.339084847412774
  },
  // ...
];

// --- EXPORTS ---

// Used for "Knudsen Smebye Mode"
export const defaultGames = [game1Rounds, game2Rounds, game3Rounds];

// Used for "Fuglestrand Smebye Mode"
export const fuglesmedGames = [fsGame1];
