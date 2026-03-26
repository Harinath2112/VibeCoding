/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { GamificationProvider } from "./context/GamificationContext";
import GlitchToastContainer from "./components/GlitchToast";
import GlitchErrorBoundary from "./components/ErrorBoundary";
import NeuralAudio from "./components/NeuralAudio";
import ThemeSwitcher from "./components/ThemeSwitcher";
import BackgroundEffects from "./components/BackgroundEffects";
import CursorTrail from "./components/CursorTrail";
import Particles from "./components/Particles";

// Lazy load heavy components
const SnakeGame = lazy(() => import("./components/SnakeGame"));
const MusicPlayer = lazy(() => import("./components/MusicPlayer"));
const SystemProfile = lazy(() => import("./components/SystemProfile"));
const Dashboard = lazy(() => import("./components/Dashboard"));

const LoadingFallback = () => (
  <div className="w-full h-64 flex flex-col items-center justify-center font-mono text-cyan-500 gap-4">
    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#0ff]"></div>
    <div className="text-sm tracking-widest uppercase animate-pulse">
      DECRYPTING_MODULES...
    </div>
  </div>
);

export default function App() {
  const { scrollY } = useScroll();
  const [activeTab, setActiveTab] = useState<"SIMULATION" | "TELEMETRY">(
    "SIMULATION",
  );

  // Subtle parallax for background blobs
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 100]);

  useEffect(() => {
    const handleVoiceCommand = (e: any) => {
      if (e.detail === "TELEMETRY") {
        setActiveTab("TELEMETRY");
      } else if (e.detail === "SIMULATION") {
        setActiveTab("SIMULATION");
      }
    };

    window.addEventListener("VOICE_COMMAND", handleVoiceCommand);
    return () =>
      window.removeEventListener("VOICE_COMMAND", handleVoiceCommand);
  }, []);

  return (
    <GlitchErrorBoundary>
      <GamificationProvider>
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden font-sans selection:bg-magenta-500/30">
          <ThemeSwitcher />
          <GlitchToastContainer />
          <NeuralAudio />
          <div className="static-noise"></div>
          <CursorTrail />
          <Particles />
          <BackgroundEffects />

          {/* Animated Parallax Background Gradients */}
          <motion.div
            style={{ y: y1 }}
            className="bg-blob w-[40rem] h-[40rem] bg-cyan-600/20 top-[-10%] left-[-10%]"
          ></motion.div>
          <motion.div
            style={{ y: y2, animationDelay: "2s" }}
            className="bg-blob w-[35rem] h-[35rem] bg-magenta-600/20 bottom-[-10%] right-[-10%]"
          ></motion.div>
          <motion.div
            style={{ y: y3, animationDelay: "4s" }}
            className="bg-blob w-[30rem] h-[30rem] bg-cyan-600/20 top-[30%] left-[30%]"
          ></motion.div>

          <AnimatePresence mode="wait">
            <motion.main
              key="main-content"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center z-10"
            >
              <header className="mb-8 md:mb-12 text-center screen-tear">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="text-5xl md:text-7xl font-display font-extrabold tracking-tight glitch-text"
                  data-text="SYS.INIT()"
                >
                  SYS.INIT()
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-cyan-400 mt-3 tracking-widest uppercase text-xs md:text-sm font-medium"
                >
                  // Establishing connection...
                </motion.p>
              </header>

              <div className="flex gap-4 mb-8 z-20">
                <button
                  onClick={() => setActiveTab("SIMULATION")}
                  className={`px-4 py-2 font-display tracking-widest text-sm uppercase transition-all ${activeTab === "SIMULATION" ? "bg-cyan-500/20 border border-cyan-500 text-cyan-400 shadow-[0_0_10px_#0ff]" : "text-gray-500 hover:text-cyan-400"}`}
                >
                  [ SIMULATION ]
                </button>
                <button
                  onClick={() => setActiveTab("TELEMETRY")}
                  className={`px-4 py-2 font-display tracking-widest text-sm uppercase transition-all ${activeTab === "TELEMETRY" ? "bg-magenta-500/20 border border-magenta-500 text-magenta-400 shadow-[0_0_10px_#f0f]" : "text-gray-500 hover:text-magenta-400"}`}
                >
                  [ TELEMETRY ]
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "SIMULATION" ? (
                  <motion.div
                    key="simulation"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.3,
                        ease: "easeOut",
                      }}
                      className="w-full lg:w-auto flex flex-col gap-8 justify-center"
                    >
                      <Suspense fallback={<LoadingFallback />}>
                        <SystemProfile />
                        <MusicPlayer />
                      </Suspense>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.5,
                        ease: "easeOut",
                      }}
                      className="w-full lg:w-auto flex justify-center"
                    >
                      <Suspense fallback={<LoadingFallback />}>
                        <SnakeGame />
                      </Suspense>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="telemetry"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-7xl"
                  >
                    <Suspense fallback={<LoadingFallback />}>
                      <Dashboard />
                    </Suspense>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.main>
          </AnimatePresence>
        </div>
      </GamificationProvider>
    </GlitchErrorBoundary>
  );
}
