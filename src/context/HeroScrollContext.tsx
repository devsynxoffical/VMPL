"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type HeroScrollContextValue = {
  progress: number;
  /** Sidebar shell should be on-screen (logo mid-dock). */
  sidebarVisible: boolean;
  setProgress: (p: number) => void;
};

const HeroScrollContext = createContext<HeroScrollContextValue>({
  progress: 0,
  sidebarVisible: false,
  setProgress: () => {},
});

export function HeroScrollProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgressState] = useState(0);
  const lastProgress = useRef(-1);

  const setProgress = useCallback((p: number) => {
    // Quantize so React doesn't thrash every scroll frame
    const next = Math.round(p * 50) / 50;
    if (next === lastProgress.current) return;
    lastProgress.current = next;
    setProgressState(next);
  }, []);

  return (
    <HeroScrollContext.Provider
      value={{
        progress,
        // Shell fades in while the wordmark is flying into the header
        sidebarVisible: progress > 0.32,
        setProgress,
      }}
    >
      {children}
    </HeroScrollContext.Provider>
  );
}

export function useHeroScroll() {
  return useContext(HeroScrollContext);
}
