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
    const next = Math.round(p * 40) / 40;
    if (next === lastProgress.current) return;
    lastProgress.current = next;
    setProgressState(next);
  }, []);

  return (
    <HeroScrollContext.Provider
      value={{
        progress,
        sidebarVisible: progress > 0.06,
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
