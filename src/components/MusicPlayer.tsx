import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "ERR_01: NEON_DRIVE.wav", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "ERR_02: CYBER_CITY.wav", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "ERR_03: SYNTH_DREAM.wav", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (playing) {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [playing, idx]);

  return (
    <div className="border-4 border-fuchsia-500 bg-black p-6 shadow-[0_0_20px_#f0f] font-mono text-cyan-400 uppercase relative overflow-hidden w-full max-w-[420px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 animate-pulse"></div>
      <h2 className="text-3xl mb-6 text-fuchsia-500 glitch-text" data-text="AUDIO_SUBSYSTEM">AUDIO_SUBSYSTEM</h2>
      
      <div className="border-2 border-cyan-500 p-4 mb-6 bg-cyan-950/30 relative">
        <div className="absolute -top-3 -left-2 bg-black px-2 text-fuchsia-500 text-sm">STATUS: {playing ? 'ACTIVE' : 'IDLE'}</div>
        <p className="text-sm text-fuchsia-400 mb-2 mt-2">CURRENT_TRACK // {idx + 1}</p>
        <p className="text-xl truncate">{TRACKS[idx].title}</p>
        <div className="h-4 w-full bg-black border-2 border-fuchsia-500 mt-4 overflow-hidden relative">
          <div className={`h-full bg-cyan-500 ${playing ? 'animate-[pulse_1s_ease-in-out_infinite]' : 'w-0'}`} style={{width: playing ? '100%' : '0%'}}></div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <button onClick={() => setIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length)} className="flex-1 border-2 border-cyan-500 py-3 hover:bg-cyan-500 hover:text-black transition-colors text-lg">
          &lt;&lt; PRV
        </button>
        <button onClick={() => setPlaying(!playing)} className="flex-1 border-2 border-fuchsia-500 py-3 hover:bg-fuchsia-500 hover:text-black transition-colors text-fuchsia-500 hover:text-black text-lg font-bold">
          {playing ? 'HALT' : 'EXEC'}
        </button>
        <button onClick={() => setIdx((i) => (i + 1) % TRACKS.length)} className="flex-1 border-2 border-cyan-500 py-3 hover:bg-cyan-500 hover:text-black transition-colors text-lg">
          NXT &gt;&gt;
        </button>
      </div>
      <audio ref={audioRef} src={TRACKS[idx].url} onEnded={() => setIdx((i) => (i + 1) % TRACKS.length)} />
    </div>
  );
}
