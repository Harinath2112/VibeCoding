/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import BackgroundEffects from './components/BackgroundEffects';
import CursorTrail from './components/CursorTrail';
import Particles from './components/Particles';

export default function App() {
  const { scrollY } = useScroll();
  
  // Subtle parallax for background blobs
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 100]);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden font-sans selection:bg-magenta-500/30">
      <div className="static-noise"></div>
      <CursorTrail />
      <Particles />
      <BackgroundEffects />
      
      {/* Animated Parallax Background Gradients */}
      <motion.div style={{ y: y1 }} className="bg-blob w-[40rem] h-[40rem] bg-cyan-600/20 top-[-10%] left-[-10%]"></motion.div>
      <motion.div style={{ y: y2, animationDelay: '2s' }} className="bg-blob w-[35rem] h-[35rem] bg-magenta-600/20 bottom-[-10%] right-[-10%]"></motion.div>
      <motion.div style={{ y: y3, animationDelay: '4s' }} className="bg-blob w-[30rem] h-[30rem] bg-cyan-600/20 top-[30%] left-[30%]"></motion.div>

      <AnimatePresence mode="wait">
        <motion.main
          key="main-content"
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
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

          <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="w-full lg:w-auto flex justify-center"
            >
              <SnakeGame />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="w-full lg:w-auto flex justify-center"
            >
              <MusicPlayer />
            </motion.div>
          </div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

