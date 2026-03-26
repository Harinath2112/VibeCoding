import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Search } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "ERR_01: NEON_DRIVE.wav", artist: "AI Synth", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "ERR_02: CYBER_CITY.wav", artist: "AI Synth", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "ERR_03: SYNTH_DREAM.wav", artist: "AI Synth", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="glass-card p-6 w-full max-w-[420px] relative overflow-hidden group font-mono screen-tear">
      {/* Search Input with Focus Animation */}
      <div className="relative mb-6">
        <div className="relative flex items-center bg-black border-2 border-cyan-500/50 px-4 py-2 transition-all duration-300 input-glow">
          <Search className="w-4 h-4 text-cyan-400 mr-2" />
          <input 
            type="text" 
            placeholder="SEARCH_TRACKS..." 
            className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-cyan-700 uppercase"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-14 h-14 bg-black flex items-center justify-center border-2 border-magenta-500 shadow-[0_0_15px_#f0f]"
        >
          <Music className="text-magenta-400 w-6 h-6" />
        </motion.div>
        <div>
          <h2 className="text-xl font-display font-bold text-cyan-400 tracking-wide uppercase">AUDIO_SUBSYSTEM</h2>
          <p className="text-magenta-400 text-sm font-medium uppercase">{currentTrack.title}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-black p-5 border-2 border-cyan-500 relative">
          <div className="absolute -top-3 -left-2 bg-black px-2 text-magenta-500 text-sm border border-magenta-500">
            STATUS: {isPlaying ? 'ACTIVE' : 'IDLE'}
          </div>
          <div className="flex justify-between items-center mb-2 mt-2">
            <span className="text-xs text-cyan-600 font-medium tracking-wider uppercase">TRACK {currentTrackIndex + 1}/{TRACKS.length}</span>
            <span className="text-xs text-magenta-400 font-medium tracking-wider uppercase flex items-center gap-2">
              {isPlaying && (
                <span className="flex gap-1">
                  <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-magenta-400 block"></motion.span>
                  <motion.span animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-magenta-400 block"></motion.span>
                  <motion.span animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-magenta-400 block"></motion.span>
                </span>
              )}
            </span>
          </div>
          <div className="text-xl font-display font-semibold text-white truncate uppercase">{currentTrack.title}</div>
          <div className="text-sm text-cyan-400 truncate mt-1 uppercase">{currentTrack.artist}</div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevTrack} 
            className="p-3 text-cyan-400 hover:text-magenta-400 transition-colors btn-glitch border border-transparent hover:border-magenta-500"
          >
            <SkipBack className="w-6 h-6" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay} 
            className="p-5 bg-black text-magenta-500 border-2 border-magenta-500 shadow-[0_0_15px_#f0f] btn-glitch"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextTrack} 
            className="p-3 text-cyan-400 hover:text-magenta-400 transition-colors btn-glitch border border-transparent hover:border-magenta-500"
          >
            <SkipForward className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t-2 border-cyan-500/30">
          <button onClick={() => setIsMuted(!isMuted)} className="text-cyan-400 hover:text-magenta-400 transition-colors btn-glitch p-2">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <div className="relative w-full h-2 group/slider cursor-pointer flex items-center">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-2 bg-black border border-cyan-500 overflow-hidden">
              <motion.div 
                className="h-full bg-magenta-500"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                layout
              />
            </div>
            <motion.div 
              className="absolute h-4 w-2 bg-cyan-400 shadow-[0_0_10px_#0ff] pointer-events-none"
              style={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 4px)` }}
              whileHover={{ scale: 1.5 }}
              animate={{ scale: 1 }}
            />
          </div>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={nextTrack}
        preload="metadata"
      />
    </div>
  );
}

