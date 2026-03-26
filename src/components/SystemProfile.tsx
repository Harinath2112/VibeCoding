import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  useGamification,
  ACHIEVEMENTS_DB,
} from "../context/GamificationContext";
import {
  ShieldAlert,
  Zap,
  Award,
  TerminalSquare,
  Edit2,
  Check,
} from "lucide-react";
import ShareTerminal from "./ShareTerminal";

export default function SystemProfile() {
  const { xp, level, streak, achievements } = useGamification();
  const profileRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState("SYS.USER");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("SYS_USERNAME");
    if (savedName) setUsername(savedName);
  }, []);

  const handleSaveName = () => {
    localStorage.setItem("SYS_USERNAME", username);
    setIsEditing(false);
    if (typeof (window as any).neuralSpeak === "function") {
      (window as any).neuralSpeak(`Identity updated to ${username}`);
    }
  };

  // Calculate XP required for next level
  const currentLevelXp = (level - 1) ** 2 * 100;
  const nextLevelXp = level ** 2 * 100;
  const xpProgress =
    ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <div className="flex flex-col gap-4 w-full max-w-[460px]">
      <div
        ref={profileRef}
        className="glass-card p-6 w-full relative overflow-hidden flex flex-col font-mono screen-tear bg-black/80"
      >
        <div className="flex items-center justify-between mb-4 border-b-2 border-cyan-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black border-2 border-magenta-500 flex items-center justify-center shadow-[0_0_10px_#f0f]">
              <TerminalSquare className="w-6 h-6 text-magenta-400" />
            </div>
            <div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9._-]/g, "")
                          .slice(0, 12),
                      )
                    }
                    className="bg-black border border-cyan-500 text-cyan-400 font-display font-bold text-xl uppercase tracking-widest px-2 py-1 w-32 outline-none focus:shadow-[0_0_10px_#0ff]"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  />
                  <button
                    onClick={handleSaveName}
                    className="text-cyan-400 hover:text-white"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 group cursor-pointer"
                  onClick={() => setIsEditing(true)}
                >
                  <h2
                    className="text-xl font-display font-bold text-white tracking-widest uppercase glitch-text"
                    data-text={username}
                  >
                    {username}
                  </h2>
                  <Edit2 className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                </div>
              )}
              <div className="text-xs text-cyan-400 font-medium tracking-widest uppercase flex items-center gap-1 mt-1">
                <ShieldAlert className="w-3 h-3" /> CLEARANCE_LVL: {level}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-magenta-500 font-medium uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
              <Zap className="w-3 h-3" /> SYNC_STREAK
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {streak} <span className="text-sm text-gray-500">CYCLES</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-cyan-600 font-medium uppercase tracking-widest mb-2">
            <span>DATA_FRAGMENTS</span>
            <span>
              {xp} / {nextLevelXp}
            </span>
          </div>
          <div className="h-4 bg-black border border-cyan-500/50 w-full relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-cyan-500 shadow-[0_0_10px_#0ff]"
            />
            {/* Glitch overlay on progress bar */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSI0IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay"></div>
          </div>
        </div>

        <div>
          <div className="text-xs text-magenta-500 font-medium uppercase tracking-widest mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" /> DECRYPTED_ARCHIVES (
            {achievements.length}/{ACHIEVEMENTS_DB.length})
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ACHIEVEMENTS_DB.map((ach) => {
              const isUnlocked = achievements.some((a) => a.id === ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-2 border ${isUnlocked ? "border-cyan-500 bg-cyan-900/20" : "border-gray-800 bg-black/50"} flex flex-col gap-1 transition-all duration-300`}
                >
                  <div
                    className={`text-[10px] font-bold uppercase truncate ${isUnlocked ? "text-cyan-400" : "text-gray-600"}`}
                  >
                    {ach.title}
                  </div>
                  <div
                    className={`text-[9px] leading-tight ${isUnlocked ? "text-cyan-600" : "text-gray-700"}`}
                  >
                    {isUnlocked ? ach.description : "ENCRYPTED_DATA"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ShareTerminal targetRef={profileRef} />
    </div>
  );
}
