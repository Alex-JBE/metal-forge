"use client";

import { useState, useEffect } from "react";

export type HistoryEntry = {
  id: string;
  subgenre: string;
  type: string;
  language: string;
  preview: string;
  content: string;
  createdAt: string;
};

const STORAGE_KEY = "metal-forge-history";
const MAX_ENTRIES = 10;

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  function addEntry(entry: Omit<HistoryEntry, "id" | "createdAt">) {
    if (!mounted) return;
    const newEntry: HistoryEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setHistory((prev) => {
      const updated = [newEntry, ...prev].slice(0, MAX_ENTRIES);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }

  function clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setHistory([]);
  }

  return { history, addEntry, clearHistory, mounted };
}
