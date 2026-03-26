/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="scanlines"></div>
      
      <header className="mb-12 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-mono uppercase glitch-text" data-text="NEON_SNAKE.EXE">
          NEON_SNAKE.EXE
        </h1>
        <p className="text-fuchsia-500 mt-4 tracking-[0.5em] uppercase text-sm font-mono animate-pulse">
          [UNAUTHORIZED ACCESS DETECTED]
        </p>
      </header>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-12 items-center justify-center relative z-10">
        <div className="flex justify-center w-full lg:w-auto">
          <SnakeGame />
        </div>
        <div className="flex justify-center w-full lg:w-auto">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}
