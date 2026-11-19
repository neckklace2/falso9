'use client';

import React, { useEffect, useState } from 'react';
import { RoomData } from '@/types/game';
import { Trophy, Flame, RotateCw, History, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '@/lib/sound';

interface ResultRevealViewProps {
  room: RoomData;
  currentPlayerId: string;
  onStartNextRound: () => void;
  onResetUsedHistory: () => void;
}

export function ResultRevealView({
  room,
  currentPlayerId,
  onStartNextRound,
  onResetUsedHistory,
}: ResultRevealViewProps) {
  const isHost = room.hostId === currentPlayerId;
  const [showHistory, setShowHistory] = useState(false);

  const selectedPlayer = room.round.selectedPlayer;
  const roles = room.round.roles || {};
  const players = room.players || {};

  // Descobre quem eram os impostores
  const impostorPlayers = Object.entries(roles)
    .filter(([, role]) => role === 'impostor')
    .map(([playerId]) => players[playerId])
    .filter(Boolean);

  useEffect(() => {
    sounds.playRevealSuccess();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
      });
    } catch {
      // Ignora erro de confetti em ambientes headless
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col p-4 pb-8 space-y-4 animate-fade-in">
      {/* Cabeçalho do Resultado */}
      <div className="text-center py-2">
        <span className="text-3xl mb-1 inline-block animate-bounce">🏆</span>
        <h2 className="text-xl font-black text-white tracking-wide">
          Resultado da Rodada #{room.round.roundNumber || 1}
        </h2>
        <p className="text-xs text-gray-400">
          Vejam quem era o impostor e confiram o atleta sorteado!
        </p>
      </div>

      {/* Cartão do Jogador Sorteado */}
      <div className="bg-gradient-to-b from-pitch-850 to-pitch-900 border-2 border-turf-500/70 rounded-3xl p-5 shadow-xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-turf-500/20 text-turf-300 border border-turf-500/40 text-[10px] font-extrabold uppercase tracking-wider">
          <Trophy size={12} />
          Atleta Sorteado
        </div>

        <div className="text-2xl font-black text-white tracking-tight">
          {selectedPlayer?.name || 'Desconhecido'}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-pitch-800 border border-pitch-700 text-gray-200 font-semibold flex items-center gap-1">
            <span>{selectedPlayer?.flag}</span>
            <span>{selectedPlayer?.nationality}</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-pitch-800 border border-pitch-700 text-gray-200 font-semibold">
            {selectedPlayer?.position}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-pitch-800 border border-pitch-700 text-gray-300 font-mono text-[11px]">
            {selectedPlayer?.difficulty?.toUpperCase()}
          </span>
        </div>

        {/* Clubes Transfermarkt */}
        {selectedPlayer?.clubs && selectedPlayer.clubs.length > 0 && (
          <div className="text-xs text-gray-400 font-medium pt-1">
            Clubes: <span className="text-gray-200 font-semibold">{selectedPlayer.clubs.join(' • ')}</span>
          </div>
        )}

        {/* Dica que foi entregue */}
        {selectedPlayer?.clue && room.settings.clueEnabled && (
          <div className="bg-pitch-950/80 border border-pitch-800 rounded-2xl p-3 text-left space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-trophy-400 flex items-center gap-1">
              <Sparkles size={11} />
              Dica Calibrada que o Impostor Recebeu
            </span>
            <p className="text-xs text-gray-300 italic">
              &ldquo;{selectedPlayer.clue}&rdquo;
            </p>
          </div>
        )}

        {/* Destaque SofaScore / Transfermarkt */}
        {selectedPlayer?.statsHighlight && (
          <div className="text-[10px] text-gray-400 font-mono">
            {selectedPlayer.statsHighlight}
          </div>
        )}
      </div>

      {/* Cartão dos Impostores */}
      <div className="bg-gradient-to-b from-impostor-950/40 via-pitch-850 to-pitch-900 border-2 border-impostor-500/60 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-impostor-500/20 text-impostor-400 flex items-center justify-center">
            <Flame size={16} />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-impostor-400">
              Revelação dos Blefadores
            </div>
            <h3 className="text-base font-black text-white">
              Quem era o Impostor?
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1">
          {impostorPlayers.length > 0 ? (
            impostorPlayers.map((imp) => (
              <div
                key={imp.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-pitch-950/90 border border-impostor-500/40 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-impostor-500/20 border border-impostor-500/40 flex items-center justify-center text-xl shrink-0">
                  {imp.avatar || '🕵️‍♂️'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-black text-white truncate">
                    {imp.name}
                  </div>
                  <div className="text-[10px] text-impostor-400 font-bold">
                    O IMPOSTOR DA RODADA
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400 text-center py-2">
              Nenhum impostor registrado nesta rodada.
            </div>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      {isHost ? (
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onStartNextRound();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-turf-500 via-turf-400 to-emerald-400 hover:from-turf-400 hover:to-emerald-300 text-pitch-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition active:scale-95 shadow-turf-500/20"
          >
            <RotateCw size={18} />
            Próxima Rodada (Novo Jogador)
          </button>

          <div className="flex items-center justify-between px-2 pt-1">
            <button
              onClick={() => {
                sounds.playClick();
                setShowHistory(!showHistory);
              }}
              className="text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1.5 transition"
            >
              <History size={13} />
              {showHistory ? 'Ocultar Histórico' : 'Ver Jogadores Anteriores'} ({room.usedPlayerIds?.length || 0})
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                if (confirm('Deseja zerar o histórico de jogadores já sorteados para esta sala?')) {
                  onResetUsedHistory();
                }
              }}
              className="text-[11px] font-semibold text-amber-400/80 hover:text-amber-300 transition"
            >
              Resetar Histórico
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-3 text-xs text-gray-400">
          Aguardando o Host iniciar a próxima rodada...
        </div>
      )}

      {/* Lista de Histórico Anti-Repetição */}
      {showHistory && (
        <div className="bg-pitch-900 border border-pitch-800 rounded-2xl p-3 space-y-2 text-xs animate-fade-in">
          <div className="flex items-center gap-1.5 font-bold text-gray-300 pb-1 border-b border-pitch-800">
            <Shield size={12} className="text-turf-400" />
            Atletas já jogados nesta sessão (sem repetições):
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1 text-gray-400 font-mono text-[11px]">
            {room.usedPlayerIds && room.usedPlayerIds.length > 0 ? (
              room.usedPlayerIds.map((id, index) => (
                <div key={id} className="flex justify-between py-0.5 border-b border-pitch-850">
                  <span>#{index + 1} {id}</span>
                  <span className="text-turf-400">OK</span>
                </div>
              ))
            ) : (
              <div>Nenhum jogador registrado no histórico ainda.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
