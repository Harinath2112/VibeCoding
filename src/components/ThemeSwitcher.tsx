import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette, Terminal, AlertCircle } from "lucide-react";

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("cyberpunk");

  useEffect(() => {
    const savedTheme = localStorage.getItem("SYS_THEME") || "cyberpunk";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("SYS_THEME", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setIsOpen(false);

    if (typeof (window as any).neuralSpeak === "function") {
      (window as any).neuralSpeak(`${newTheme} theme activated`);
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-black/80 border-2 border-cyan-500 text-cyan-400 flex items-center justify-center shadow-[0_0_10px_#0ff] hover:bg-cyan-900/30 transition-all"
        title="SYS_THEME_CONFIG"
      >
        <Palette className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            className="absolute top-14 left-0 glass-card p-3 flex flex-col gap-2 w-48"
          >
            <div className="text-[10px] text-magenta-500 font-medium uppercase tracking-widest border-b border-magenta-500/30 pb-2 mb-1">
              // SELECT_UI_THEME
            </div>

            <ThemeOption
              icon={<Terminal className="w-4 h-4" />}
              label="CYBERPUNK"
              isActive={theme === "cyberpunk"}
              onClick={() => changeTheme("cyberpunk")}
            />
            <ThemeOption
              icon={<Terminal className="w-4 h-4" />}
              label="MATRIX"
              isActive={theme === "matrix"}
              onClick={() => changeTheme("matrix")}
            />
            <ThemeOption
              icon={<AlertCircle className="w-4 h-4" />}
              label="ALERT"
              isActive={theme === "alert"}
              onClick={() => changeTheme("alert")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThemeOption({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-2 text-xs font-display tracking-widest uppercase transition-all border ${
        isActive
          ? "bg-cyan-900/40 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(0,255,255,0.3)]"
          : "bg-black/50 border-transparent text-gray-500 hover:border-cyan-500/50 hover:text-cyan-400"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
