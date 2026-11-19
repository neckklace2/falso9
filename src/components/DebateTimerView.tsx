'use client';

import React, { useEffect } from 'react';
import { RoomData } from '@/types/game';
import { Play, Pause, RotateCcw, Plus, Mic, CheckCircle2 } from 'lucide-react';
import { sounds } from '@/lib/sound';

interface DebateTimerViewProps {
  room: RoomData;
  currentPlayerId: string;
  onToggleTimer: (isRunning: boolean) => void;
  onUpdateTimer: (seconds: number) => void;
  onRevealResult: () => void;
}

export function DebateTimerView({
  room,
  currentPlayerId,
  onToggleTimer,
  onUpdateTimer,
  onRevealResult,
}: DebateTimerViewProps) {
  const isHost = room.hostId === currentPlayerId;
  const timerSeconds = room.round.timerSeconds ?? 180;
  const isRunning = room.round.isTimerRunning ?? false;

  // Localização do jogador sorteado para começar falando
  const firstSpeaker = room.round.firstSpeakerPlayerId
    ? room.players[room.round.firstSpeakerPlayerId]
    : null;

  // Tick local sincronizado no Host
  useEffect(() => {
    if (!isRunning || timerSeconds <= 0) return;

    const timer = setInterval(() => {
      if (isHost) {
        onUpdateTimer(Math.max(0, timerSeconds - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timerSeconds, isHost, onUpdateTimer]);

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isLowTime = timerSeconds <= 30 && timerSeconds > 0;

  const handleAdd30s = () => {
    sounds.playClick();
    onUpdateTimer(timerSeconds + 30);
  };

  const handleResetTimer = () => {
    sounds.playClick();
    onUpdateTimer(room.settings.roundTimeSeconds || 180);
  };

  return (
    <div className="bg-pitch-850/90 border border-pitch-700/80 rounded-3xl p-4 shadow-xl space-y-4">
      {/* Quem Começa Falando */}
      {firstSpeaker && (
        <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-r from-pitch-900 via-pitch-800 to-pitch-900 border border-pitch-700/70 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-trophy-500/20 text-trophy-400 flex items-center justify-center shrink-0">
            <Mic size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Vez de Iniciar o Debate
            </div>
            <div className="text-xs font-black text-white truncate">
              {firstSpeaker.name} {firstSpeaker.id === currentPlayerId ? '(Você!)' : ''}
            </div>
          </div>
        </div>
      )}

      {/* Cronômetro Central */}
      <div className="text-center py-2">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
          Tempo de Debate & Acusação
        </div>
        <div
          className={`text-5xl font-black font-mono tracking-wider transition ${
            isLowTime
              ? 'text-impostor-400 animate-pulse'
              : timerSeconds === 0
              ? 'text-gray-500'
              : 'text-white'
          }`}
        >
          {formattedTime}
        </div>
      </div>

      {/* Controles do Host para o Cronômetro */}
      {isHost ? (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onToggleTimer(!isRunning);
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 ${
                isRunning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-turf-500 text-pitch-950 font-black hover:bg-turf-400'
              }`}
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              {isRunning ? 'Pausar' : 'Iniciar'}
            </button>

            <button
              onClick={handleAdd30s}
              title="Adicionar 30 segundos"
              className="py-2.5 px-3 rounded-xl bg-pitch-800 hover:bg-pitch-750 border border-pitch-700 text-xs font-semibold text-gray-200 transition active:scale-95 flex items-center gap-1"
            >
              <Plus size={14} /> 30s
            </button>

            <button
              onClick={handleResetTimer}
              title="Reiniciar cronômetro"
              className="p-2.5 rounded-xl bg-pitch-800 hover:bg-pitch-750 border border-pitch-700 text-gray-400 hover:text-white transition active:scale-95"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Botão de Revelar Resultado */}
          <button
            onClick={() => {
              sounds.playClick();
              if (confirm('Deseja encerrar o debate e revelar o resultado para todos?')) {
                onRevealResult();
              }
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-trophy-500 to-amber-500 hover:from-trophy-400 hover:to-amber-400 text-pitch-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
          >
            <CheckCircle2 size={16} />
            Revelar Quem é o Impostor!
          </button>
        </div>
      ) : (
        <div className="text-center text-[11px] text-gray-400 pt-1">
          Debata com a galera! O Host revelará o resultado quando o grupo entrar em consenso ou o tempo acabar.
        </div>
      )}
    </div>
  );
}
