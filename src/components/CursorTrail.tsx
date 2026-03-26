import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function CursorTrail() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{x: number, y: number, id: number}[]>([]);

  useEffect(() => {
    let idCounter = 0;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: idCounter++ }];
        if (newTrail.length > 15) newTrail.shift();
        return newTrail;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.length > 0 ? prev.slice(1) : prev);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Main Cursor Glow */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[100] mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,255,0.8) 0%, rgba(0,255,255,0) 70%)',
          boxShadow: '0 0 20px #0ff, 0 0 40px #f0f'
        }}
        animate={{
          x: mousePos.x - 16,
          y: mousePos.y - 16,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      
      {/* Trail */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed top-0 left-0 w-2 h-2 bg-magenta-500 pointer-events-none z-[99]"
          style={{
            backgroundColor: index % 2 === 0 ? '#0ff' : '#f0f',
            boxShadow: `0 0 10px ${index % 2 === 0 ? '#0ff' : '#f0f'}`,
          }}
          initial={{ opacity: 0.8, scale: 1, x: point.x - 4, y: point.y - 4 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </>
  );
}
