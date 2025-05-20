"use client";

import React, { useRef, useEffect, useState } from 'react';

// Starfall background
function Starscape({ speed }: { speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const starsRef = useRef<
    { x: number; y: number; r: number; v: number }[]
  >([]);

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only regenerate stars when dimensions change
  useEffect(() => {
    const numStars = 120;
    starsRef.current = Array.from({ length: numStars }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      r: Math.random() * 1.2 + 0.5,
      v: Math.random() * 0.7 + 0.3,
    }));
  }, [dimensions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      for (const star of starsRef.current) { // <-- changed from 'let' to 'const'
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 0.8;
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        star.y += star.v * speed;
        if (star.y > dimensions.height) {
          star.x = Math.random() * dimensions.width;
          star.y = 0;
          star.r = Math.random() * 1.2 + 0.5;
          star.v = Math.random() * 0.7 + 0.3;
        }
      }
      animationId = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [dimensions, speed]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        display: 'block',
        background: 'black',
      }}
    />
  );
}

// Matrix code rain background
function MatrixRain({ speed }: { speed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const columnsRef = useRef<number[]>([]);

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Setup columns for matrix rain
  useEffect(() => {
    const fontSize = 18;
    const columns = Math.floor(dimensions.width / fontSize);
    columnsRef.current = Array.from({ length: columns }, () =>
      Math.random() * dimensions.height
    );
  }, [dimensions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 18;
    const columns = Math.floor(dimensions.width / fontSize);
    const chars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let animationId: number;

    function draw() {
      if (!ctx) return;
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = "#00FF41";
      ctx.shadowColor = "#00FF41";
      ctx.shadowBlur = 8;

      for (let i = 0; i < columns; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = columnsRef.current[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > dimensions.height && Math.random() > 0.975) {
          columnsRef.current[i] = 0;
        } else {
          columnsRef.current[i] += speed * 0.5;
        }
      }
      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [dimensions, speed]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        display: 'block',
        background: 'black',
      }}
    />
  );
}

export default function Home() {
  const [speed, setSpeed] = useState(1);
  const [background, setBackground] = useState<'starfall' | 'matrix'>('starfall');

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Background */}
      {background === 'starfall' ? (
        <Starscape speed={speed} />
      ) : (
        <MatrixRain speed={speed} />
      )}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-center mb-8 text-white drop-shadow-lg">
          Hello, Abhi’s first AI-coded site!
        </h1>
        <a
          href="https://chat.openai.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition mb-8"
        >
          Go to ChatGPT
        </a>
        {/* Toggle Switch */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-white font-medium">Starfall</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={background === 'matrix'}
              onChange={() =>
                setBackground(bg => (bg === 'starfall' ? 'matrix' : 'starfall'))
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-600 transition-all"></div>
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></span>
          </label>
          <span className="text-green-400 font-medium">Matrix</span>
        </div>
        {/* Speed Slider */}
        <div className="flex flex-col items-center gap-2 bg-black/60 rounded-lg px-4 py-2">
          <label htmlFor="speed" className="text-white font-medium">
            {background === 'starfall'
              ? `Starfall Speed: ${speed.toFixed(1)}x`
              : `Matrix Code Speed: ${speed.toFixed(1)}x`}
          </label>
          <input
            id="speed"
            type="range"
            min={0.2}
            max={4}
            step={0.1}
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="w-48 accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
