import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Search, Cpu } from 'lucide-react';
import { aiService } from '../services/aiService';
import { useGamification } from '../context/GamificationContext';

const DEFAULT_TRACKS = [
  { id: 1, title: "ERR_01: NEON_DRIVE.wav", artist: "AI Synth", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "ERR_02: CYBER_CITY.wav", artist: "AI Synth", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "ERR_03: SYNTH_DREAM.wav", artist: "AI Synth", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [tracks, setTracks] = useState<any[]>(DEFAULT_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // AI States
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGeneratingPlaylist, setIsGeneratingPlaylist] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { addXp, unlockAchievement } = useGamification();

  const currentTrack = tracks[currentTrackIndex];

  // Debounced AI Search Suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        const results = await aiService.getTrackSuggestions(searchQuery);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleGeneratePlaylist = async () => {
    if (!searchQuery) return;
    setIsGeneratingPlaylist(true);
    try {
      const newTracks = await aiService.generatePlaylist(searchQuery);
      if (newTracks.length > 0) {
        setTracks(newTracks);
        setCurrentTrackIndex(0);
        setIsPlaying(true);
        setSearchQuery("");
        setSuggestions([]);
        unlockAchievement('AI_DJ');
        addXp(20, 'PLAYLIST_GENERATED');
      }
    } catch (error) {
      console.error("Failed to generate playlist", error);
    } finally {
      setIsGeneratingPlaylist(false);
    }
  };

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

  const togglePlay = () => {
    if (!isPlaying) {
      unlockAchievement('MUSIC_PLAY');
      addXp(5, 'AUDIO_STREAM_ACTIVE');
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
    addXp(5, 'AUDIO_STREAM_ACTIVE');
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
    addXp(5, 'AUDIO_STREAM_ACTIVE');
  };

  return (
    <div className="glass-card p-6 w-full max-w-[420px] relative overflow-hidden group font-mono screen-tear">
      {/* Search Input with Focus Animation */}
      <div className="relative mb-6">
        <div className="relative flex items-center bg-black border-2 border-cyan-500/50 px-4 py-2 transition-all duration-300 input-glow">
          <Search className="w-4 h-4 text-cyan-400 mr-2" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="INPUT_MOOD_OR_QUERY..." 
            className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-cyan-700 uppercase"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
          <button 
            onClick={handleGeneratePlaylist}
            disabled={isGeneratingPlaylist || !searchQuery}
            className="ml-2 text-magenta-500 hover:text-cyan-400 transition-colors disabled:opacity-50"
          >
            <Cpu className={`w-5 h-5 ${isGeneratingPlaylist ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        {/* AI Suggestions Dropdown */}
        <AnimatePresence>
          {isFocused && suggestions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-20 w-full mt-1 bg-black border border-cyan-500 shadow-[0_0_10px_#0ff] p-2"
            >
              <div className="text-[10px] text-magenta-500 mb-2 uppercase tracking-widest">AI_PREDICTIONS</div>
              {suggestions.map((sug, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSearchQuery(sug)}
                  className="text-xs text-cyan-400 p-2 hover:bg-cyan-900/30 cursor-pointer uppercase truncate"
                >
                  &gt; {sug}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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
            <span className="text-xs text-cyan-600 font-medium tracking-wider uppercase">TRACK {currentTrackIndex + 1}/{tracks.length}</span>
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

