/* src/utils/firebase.ts */
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";

// --- PASTE YOUR CONFIG HERE ---
// (You find this in Project Settings > General > Your Apps in Firebase Console)

const firebaseConfig = {
  apiKey: "AIzaSyC82f8vtwwujQbx0M4Vpx4tjYpH7Pse3pI",
  authDomain: "pictureguessr-8c2b7.firebaseapp.com",
  projectId: "pictureguessr-8c2b7",
  storageBucket: "pictureguessr-8c2b7.firebasestorage.app",
  messagingSenderId: "702938565860",
  appId: "1:702938565860:web:32ead5d4453e2531a130f1",
  measurementId: "G-9GKRGBJ6NP",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- COLLECTION 1: USER STATE (Persisting Progress) ---

/**
 * Saves the current state for a specific user in a specific mode.
 * The ID is a combination of username and mode to ensure uniqueness.
 */
/* src/utils/firebase.ts */

/**
 * Retrieves the state for a specific user and mode.
 */
// Inside src/utils/firebase.ts

// --- COLLECTION 2: ROUND SCORES (Historical Results) ---

/**
 * Saves a single round result.
 */

/**
 * ENDPOINT 1: Get every score for a specific round across all players.
 */
/* Inside src/utils/firebase.ts */

export const getScoresForSpecificRound = async (
  mode: string,
  game: number,
  round: number
) => {
  const q = query(
    collection(db, "roundScores"),
    where("mode", "==", mode),
    where("game", "==", game),
    where("round", "==", round),
    orderBy("score", "desc")
  );

  const querySnapshot = await getDocs(q);
  // FIX: Explicitly pull the document ID here!
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * ENDPOINT 2: Get every score for every round for a certain game within a mode.
 */
export const getScoresForEntireGame = async (mode: string, game: number) => {
  const q = query(
    collection(db, "roundScores"),
    where("mode", "==", mode),
    where("game", "==", game),
    orderBy("round", "asc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id, // <--- IMPORTANT
    ...doc.data(),
  }));
};

/* src/utils/firebase.ts snippet */

// 1. Updated saveRoundScore to include history reconstruction data
export const saveRoundScore = async (
  userName: string,
  mode: string,
  game: number,
  round: number,
  score: number,
  distance: number,
  locationName: string
) => {
  const docRef = await addDoc(collection(db, "roundScores"), {
    userName,
    mode,
    game,
    round,
    score,
    distance,
    locationName,
    timestamp: serverTimestamp(),
  });
  return docRef.id;
};

// 2. Updated saveUserState to include the page/view
/* src/utils/firebase.ts */

// 3. New helper to rebuild history
export const getScoresForSpecificGameUser = async (
  username: string,
  mode: string,
  game: number
) => {
  const q = query(
    collection(db, "roundScores"),
    where("userName", "==", username),
    where("mode", "==", mode),
    where("game", "==", game),
    orderBy("round", "asc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};

/* src/utils/firebase.ts */

// Helper to ensure the ID is ALWAYS the same
const getStateId = (username: string, mode: string) =>
  `${username.toLowerCase().trim()}_${mode}`;

export const saveUserState = async (
  username: string,
  mode: string,
  gameIndex: number,
  roundIndex: number,
  gameState: string,
  userGuess?: google.maps.LatLngLiteral | null
) => {
  const stateId = getStateId(username, mode);
  const docRef = doc(db, "userStates", stateId);

  await setDoc(
    docRef,
    {
      username: username.trim(),
      mode,
      gameIndex,
      roundIndex,
      gameState,
      userGuess: userGuess || null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const getUserState = async (username: string, mode: string) => {
  const stateId = getStateId(username, mode);
  const docRef = doc(db, "userStates", stateId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};
