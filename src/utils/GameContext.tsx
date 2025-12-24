/* src/utils/GameContext.tsx */
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useRef,
  useEffect,
} from "react";
// IMPORT YOUR AUDIO FILES HERE
import defaultTrackUrl from "../assets/happy.mp3";
import secretTrackUrl from "../assets/fuglesmed-theme.mp3";

interface GameContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  gameMode: "default" | "fuglesmed";
  setGameMode: (mode: "default" | "fuglesmed") => void;

  // Audio Controls
  isMuted: boolean;
  toggleMute: () => void;
  audioEnabled: boolean; // Has the user clicked the button yet?
  enableAudio: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [playerName, setPlayerName] = useState("");
  const [gameMode, setGameMode] = useState<"default" | "fuglesmed">("default");

  // Audio State
  const [isMuted, setIsMuted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false); // Tracks if user has interacted

  // Refs for the two audio objects
  const defaultAudio = useRef<HTMLAudioElement | null>(null);
  const secretAudio = useRef<HTMLAudioElement | null>(null);

  // 1. INITIALIZE AUDIO OBJECTS ON MOUNT
  useEffect(() => {
    defaultAudio.current = new Audio(defaultTrackUrl);
    defaultAudio.current.loop = true;
    defaultAudio.current.volume = 0.3;

    secretAudio.current = new Audio(secretTrackUrl);
    secretAudio.current.loop = true;
    secretAudio.current.volume = 0.3;

    // Cleanup
    return () => {
      defaultAudio.current?.pause();
      secretAudio.current?.pause();
    };
  }, []);

  // 2. HANDLE MODE SWITCHING (Immediate Effect)
  useEffect(() => {
    // Only play if the user has already enabled audio
    if (!audioEnabled) return;

    if (gameMode === "default") {
      secretAudio.current?.pause();
      if (secretAudio.current) secretAudio.current.currentTime = 0; // Reset secret
      if (!isMuted)
        defaultAudio.current?.play().catch((e) => console.log("Play error", e));
    } else {
      defaultAudio.current?.pause();
      if (defaultAudio.current) defaultAudio.current.currentTime = 0; // Reset default
      if (!isMuted)
        secretAudio.current?.play().catch((e) => console.log("Play error", e));
    }
  }, [gameMode, audioEnabled, isMuted]);

  // 3. HANDLE MUTE TOGGLE
  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);

    if (defaultAudio.current) defaultAudio.current.muted = newMuteState;
    if (secretAudio.current) secretAudio.current.muted = newMuteState;
  };

  // 4. ENABLE AUDIO (The "Skru på lyd" action)
  const enableAudio = () => {
    setAudioEnabled(true);

    // Immediately try to play the correct track based on current mode
    if (gameMode === "default") {
      defaultAudio.current
        ?.play()
        .catch((e) => console.log("User interaction required", e));
    } else {
      secretAudio.current
        ?.play()
        .catch((e) => console.log("User interaction required", e));
    }
  };

  return (
    <GameContext.Provider
      value={{
        playerName,
        setPlayerName,
        gameMode,
        setGameMode,
        isMuted,
        toggleMute,
        audioEnabled,
        enableAudio,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
