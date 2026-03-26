import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';

const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

type Point = { x: number, y: number };
type Particle = { x: number, y: number, vx: number, vy: number, life: number, maxLife: number, color: string };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START');

  const snake = useRef<Point[]>([{x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12}]);
  const direction = useRef<Point>({x: 0, y: -1});
  const nextDirection = useRef<Point>({x: 0, y: -1});
  const food = useRef<Point>({x: 5, y: 5});
  const particles = useRef<Particle[]>([]);
  const shake = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const moveAccumulator = useRef<number>(0);
  const reqRef = useRef<number>(0);

  const spawnFood = () => {
    let newFood = { x: 0, y: 0 };
    let valid = false;
    while (!valid) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      // eslint-disable-next-line no-loop-func
      valid = !snake.current.some(s => s.x === newFood.x && s.y === newFood.y);
    }
    food.current = newFood;
  };

  const spawnParticles = (x: number, y: number, color: string, count: number = 15) => {
    for(let i=0; i<count; i++) {
      particles.current.push({
        x: x * CELL_SIZE + CELL_SIZE/2,
        y: y * CELL_SIZE + CELL_SIZE/2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 0,
        maxLife: Math.random() * 20 + 10,
        color
      });
    }
  };

  const reset = () => {
    snake.current = [{x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12}];
    direction.current = {x: 0, y: -1};
    nextDirection.current = {x: 0, y: -1};
    setScore(0);
    spawnFood();
    setGameState('PLAYING');
    shake.current = 0;
    particles.current = [];
  };

  const update = (dt: number) => {
    if (gameState !== 'PLAYING') return;

    // Update particles
    for (let i = particles.current.length - 1; i >= 0; i--) {
      let p = particles.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      if (p.life >= p.maxLife) particles.current.splice(i, 1);
    }

    if (shake.current > 0) shake.current -= dt * 0.05;
    if (shake.current < 0) shake.current = 0;

    moveAccumulator.current += dt;
    const speed = Math.max(50, 150 - score * 1.5);

    if (moveAccumulator.current >= speed) {
      moveAccumulator.current -= speed;
      direction.current = nextDirection.current;

      const head = snake.current[0];
      const newHead = { x: head.x + direction.current.x, y: head.y + direction.current.y };

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameState('GAME_OVER');
        shake.current = 20;
        spawnParticles(head.x, head.y, '#0ff', 40);
        return;
      }

      // Self collision
      if (snake.current.some(s => s.x === newHead.x && s.y === newHead.y)) {
        setGameState('GAME_OVER');
        shake.current = 20;
        spawnParticles(head.x, head.y, '#0ff', 40);
        return;
      }

      snake.current.unshift(newHead);

      // Food collision
      if (newHead.x === food.current.x && newHead.y === food.current.y) {
        setScore(s => s + 10);
        shake.current = 8;
        spawnParticles(food.current.x, food.current.y, '#f0f', 20);
        spawnFood();
      } else {
        snake.current.pop();
      }
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.save();
    if (shake.current > 0) {
      const dx = (Math.random() - 0.5) * shake.current;
      const dy = (Math.random() - 0.5) * shake.current;
      ctx.translate(dx, dy);
    }

    // Draw Grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for(let i=0; i<=GRID_SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i*CELL_SIZE, 0); ctx.lineTo(i*CELL_SIZE, CANVAS_SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i*CELL_SIZE); ctx.lineTo(CANVAS_SIZE, i*CELL_SIZE); ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#f0f';
    ctx.shadowColor = '#f0f';
    ctx.shadowBlur = 15;
    ctx.fillRect(food.current.x * CELL_SIZE + 2, food.current.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

    // Draw Snake
    snake.current.forEach((s, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#ffffff' : '#0ff';
      ctx.shadowColor = isHead ? '#ffffff' : '#0ff';
      ctx.shadowBlur = isHead ? 15 : 5;
      
      ctx.fillRect(s.x * CELL_SIZE + 1, s.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    // Draw Particles
    ctx.shadowBlur = 0;
    particles.current.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 1 - (p.life / p.maxLife);
      ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1;

    ctx.restore();

    // Glitch overlay effect randomly
    if (Math.random() < 0.03) {
      ctx.fillStyle = Math.random() > 0.5 ? '#0ff2' : '#f0f2';
      ctx.fillRect(0, Math.random() * CANVAS_SIZE, CANVAS_SIZE, Math.random() * 50);
    }
  };

  const loop = (time: number) => {
    if (!lastTime.current) lastTime.current = time;
    const dt = time - lastTime.current;
    lastTime.current = time;
    
    update(dt);
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) draw(ctx);
    }
    reqRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    reqRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqRef.current);
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
      
      if (e.key === ' ' && gameState !== 'PLAYING') {
        reset();
        return;
      }

      const dir = direction.current;
      switch (e.key) {
        case 'ArrowUp': case 'w': if (dir.y !== 1) nextDirection.current = {x: 0, y: -1}; break;
        case 'ArrowDown': case 's': if (dir.y !== -1) nextDirection.current = {x: 0, y: 1}; break;
        case 'ArrowLeft': case 'a': if (dir.x !== 1) nextDirection.current = {x: -1, y: 0}; break;
        case 'ArrowRight': case 'd': if (dir.x !== -1) nextDirection.current = {x: 1, y: 0}; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div className="glass-card p-6 w-full max-w-[460px] relative overflow-hidden flex flex-col items-center font-mono screen-tear">
      <div className="w-full flex justify-between items-center mb-6 px-2">
        <div className="flex flex-col">
          <span className="text-xs text-cyan-600 font-medium uppercase tracking-widest">SCORE</span>
          <span className="text-3xl font-display font-bold text-cyan-400 tracking-tight">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-magenta-600 font-medium uppercase tracking-widest">STATUS</span>
          <span className="text-sm font-medium text-magenta-400 uppercase tracking-widest">
            {gameState === 'PLAYING' ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden bg-black border-2 border-cyan-500 shadow-[0_0_15px_#0ff] w-full aspect-square">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_SIZE} 
          height={CANVAS_SIZE} 
          className="w-full h-full block bg-black"
        />
        
        <AnimatePresence>
          {gameState !== 'PLAYING' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20"
            >
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-display font-bold mb-6 text-white tracking-tight glitch-text uppercase"
                data-text={gameState === 'START' ? 'INITIALIZE' : 'SYS_FAILURE'}
              >
                {gameState === 'START' ? 'INITIALIZE' : 'SYS_FAILURE'}
              </motion.h2>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="flex items-center gap-2 px-8 py-4 bg-black border-2 border-magenta-500 text-magenta-500 font-semibold tracking-wide shadow-[0_0_15px_#f0f] btn-glitch uppercase"
              >
                {gameState === 'START' ? <Play className="w-5 h-5 fill-current" /> : <RotateCcw className="w-5 h-5" />}
                {gameState === 'START' ? 'EXECUTE' : 'REBOOT'}
              </motion.button>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-sm text-cyan-400 font-medium uppercase animate-pulse"
              >
                PRESS [SPACE] TO EXECUTE
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

