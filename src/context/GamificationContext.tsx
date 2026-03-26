import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlockedAt?: number;
};

export const ACHIEVEMENTS_DB: Achievement[] = [
  { id: 'INIT', title: 'SYS.INIT', description: 'Boot up the system.' },
  { id: 'SNAKE_DEATH', title: 'BIOMASS_REJECTED', description: 'Fail the snake simulation.' },
  { id: 'SNAKE_50', title: 'ADAPTIVE_ROUTING', description: 'Score 50+ in snake.' },
  { id: 'AI_DJ', title: 'GHOST_IN_THE_MACHINE', description: 'Generate an AI playlist.' },
  { id: 'MUSIC_PLAY', title: 'AUDIO_STREAM_ACTIVE', description: 'Play a track.' },
];

export type ToastMessage = {
  id: string;
  title: string;
  message: string;
  type: 'xp' | 'achievement';
  value?: number;
};

interface GamificationContextType {
  xp: number;
  level: number;
  streak: number;
  achievements: Achievement[];
  toasts: ToastMessage[];
  addXp: (amount: number, reason: string) => void;
  unlockAchievement: (id: string) => void;
  removeToast: (id: string) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(1);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from local storage
  useEffect(() => {
    const savedXp = localStorage.getItem('sys_xp');
    const savedAchievements = localStorage.getItem('sys_achievements');
    const lastLogin = localStorage.getItem('sys_last_login');

    if (savedXp) setXp(parseInt(savedXp, 10));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));

    const now = new Date().toDateString();
    if (lastLogin) {
      if (lastLogin !== now) {
        // Simple streak logic: if it's a new day, increment streak (ignoring missed days for simplicity in this demo)
        setStreak(s => s + 1);
        localStorage.setItem('sys_last_login', now);
      }
    } else {
      localStorage.setItem('sys_last_login', now);
    }

    // Unlock INIT achievement on first load
    unlockAchievement('INIT');
  }, []);

  // Calculate level based on XP
  useEffect(() => {
    const newLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      addToast('LEVEL_UP', 'CLEARANCE_UPGRADED', 'xp', newLevel);
    }
  }, [xp, level]);

  const addToast = (title: string, message: string, type: 'xp' | 'achievement', value?: number) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, title, message, type, value }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addXp = (amount: number, reason: string) => {
    setXp(prev => {
      const newXp = prev + amount;
      localStorage.setItem('sys_xp', newXp.toString());
      return newXp;
    });
    addToast(`+${amount} DATA_FRAGMENTS`, reason, 'xp', amount);
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      if (prev.some(a => a.id === id)) return prev; // Already unlocked
      
      const achievementDef = ACHIEVEMENTS_DB.find(a => a.id === id);
      if (!achievementDef) return prev;

      const newAchievement = { ...achievementDef, unlockedAt: Date.now() };
      const newAchievements = [...prev, newAchievement];
      localStorage.setItem('sys_achievements', JSON.stringify(newAchievements));
      
      addToast('ARCHIVE_DECRYPTED', achievementDef.title, 'achievement');
      addXp(50, 'ACHIEVEMENT_BONUS');
      
      return newAchievements;
    });
  };

  return (
    <GamificationContext.Provider value={{ xp, level, streak, achievements, toasts, addXp, unlockAchievement, removeToast }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
