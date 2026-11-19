'use client';

import React, { useEffect, useState } from 'react';
import { sounds } from '@/lib/sound';

interface CountdownViewProps {
  countdownStartAt?: number;
  isHost: boolean;
  onFinishCountdown: () => void;
}

export function CountdownView({
  countdownStartAt,
  isHost,
  onFinishCountdown,
}: CountdownViewProps) {
  const [secondsLeft, setSecondsLeft] = useState(3);

  useEffect(() => {
    const startTime = countdownStartAt || Date.now();
    const DURATION = 3200; // 3.2 segundos totais

    sounds.playCountdownBeep(440); // Beep inicial 3

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 3 - Math.floor(elapsed / 1000));
      setSecondsLeft(remaining);

      if (remaining === 2) {
        sounds.playCountdownBeep(520);
      } else if (remaining === 1) {
        sounds.playCountdownBeep(660);
      } else if (remaining <= 0) {
        clearInterval(interval);
        sounds.playRefereeWhistle();
        if (isHost) {
          onFinishCountdown();
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [countdownStartAt, isHost, onFinishCountdown]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-pitch-950 p-6 text-center select-none overflow-hidden">
      {/* Luzes de Estádio de Fundo */}
      <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <span className="text-4xl mb-3 animate-bounce">⚽</span>
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-turf-400 mb-6">
          Prepara o Celular!
        </h2>

        {/* Círculo do Contador Pulsante */}
        <div className="relative w-44 h-44 rounded-full flex items-center justify-center bg-pitch-900 border-4 border-turf-500 shadow-[0_0_50px_rgba(16,185,129,0.35)] animate-pulse-fast">
          <span className="text-8xl font-black text-white font-mono tracking-tighter">
            {secondsLeft > 0 ? secondsLeft : 'VAI!'}
          </span>
        </div>

        <p className="mt-8 text-xs text-gray-400 max-w-xs">
          A partida está começando simultaneamente em todos os celulares da sala...
        </p>
      </div>
    </div>
  );
}
