"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "citynexa-shortlist";

interface ShortlistContextValue {
  shortlistedIds: string[];
  toggleShortlist: (id: string) => void;
  isShortlisted: (id: string) => boolean;
  clearShortlist: () => void;
}

const ShortlistContext = createContext<ShortlistContextValue | undefined>(
  undefined,
);

function readFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    setShortlistedIds(readFromStorage());
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever the list changes (after hydration)
  useEffect(() => {
    if (hydrated) {
      writeToStorage(shortlistedIds);
    }
  }, [shortlistedIds, hydrated]);

  const toggleShortlist = useCallback((id: string) => {
    setShortlistedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const isShortlisted = useCallback(
    (id: string) => shortlistedIds.includes(id),
    [shortlistedIds],
  );

  const clearShortlist = useCallback(() => {
    setShortlistedIds([]);
  }, []);

  return (
    <ShortlistContext.Provider
      value={{ shortlistedIds, toggleShortlist, isShortlisted, clearShortlist }}
    >
      {children}
    </ShortlistContext.Provider>
  );
}

export function useShortlist(): ShortlistContextValue {
  const context = useContext(ShortlistContext);
  if (!context) {
    throw new Error("useShortlist must be used within a ShortlistProvider");
  }
  return context;
}
