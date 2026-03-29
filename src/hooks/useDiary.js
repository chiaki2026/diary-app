import { useState, useCallback } from 'react';

const STORAGE_KEY = 'nyansky-diary';

function loadDiary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDiary(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useDiary() {
  const [diary, setDiary] = useState(loadDiary);

  const getEntry = useCallback((dateKey) => {
    return diary[dateKey] || { text: '', weather: '', mood: '' };
  }, [diary]);

  const setEntry = useCallback((dateKey, entry) => {
    setDiary(prev => {
      const next = { ...prev, [dateKey]: { ...prev[dateKey], ...entry } };
      saveDiary(next);
      return next;
    });
  }, []);

  return { diary, getEntry, setEntry };
}
