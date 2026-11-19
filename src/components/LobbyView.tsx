'use client';

import React, { useMemo } from 'react';
import { RoomData, GameCategory, GameDifficulty } from '@/types/game';
import { Crown, Users, Play, Sparkles, AlertCircle, Share2, Shield, Flame } from 'lucide-react';
import { sounds } from '@/lib/sound';
import { getFilteredPlayers } from '@/data/playerDatabase';

interface LobbyViewProps {
  room: RoomData;
  currentPlayerId: string;
  onUpdateSettings: (settings: Partial<RoomData['settings']>) => void;
  onStartGame: () => void;
  onOpenInvite: () => void;
}

const CATEGORY_OPTIONS: { id: GameCategory; label: string; icon: string }[] = [
  { id: 'todos', label: 'Aleatório (Todos)', icon: '🎲' },
  { id: 'brasileiros', label: 'Brasileirão & Seleção', icon: '🇧🇷' },
  { id: 'campeoes_copa', label: 'Campeões de Copa', icon: '🏆' },
  { id: 'internacionais', label: 'Internacionais', icon: '🌍' },
  { id: 'bola_de_ouro', label: 'Bola de Ouro', icon: '⭐' },
];

const DIFFICULTY_OPTIONS: { id: GameDifficulty; label: string }[] = [
  { id: 'misto', label: 'Misto' },
  { id: 'facil', label: 'Fácil' },
  { id: 'medio', label: 'Médio' },
  { id: 'dificil', label: 'Difícil' },
];

export function LobbyView({
  room,
  currentPlayerId,
  onUpdateSettings,
  onStartGame,
  onOpenInvite,
}: LobbyViewProps) {
  const isHost = room.hostId === currentPlayerId;
  const playersList = Object.values(room.players || {});
  const playerCount = playersList.length;
  const minPlayers = 3;
  const canStart = playerCount >= minPlayers;

  const availablePoolCount = useMemo(() => {
    const filtered = getFilteredPlayers(
      room.settings.category,
      room.settings.difficulty,
      room.usedPlayerIds || []
    );
    return filtered.length;
  }, [room.settings.category, room.settings.difficulty, room.usedPlayerIds]);

  const recommendedImpostors = playerCount >= 7 ? 2 : 1;

  const handleCategoryChange = (category: GameCategory) => {
    sounds.playClick();
    onUpdateSettings({ category });
  };

  const handleDifficultyChange = (difficulty: GameDifficulty) => {
    sounds.playClick();
    onUpdateSettings({ difficulty });
  };

  const handleClueToggle = () => {
    sounds.playClick();
    onUpdateSettings({ clueEnabled: !room.settings.clueEnabled });
  };

  const handleImpostorChange = (delta: number) => {
    sounds.playClick();
    const newCount = Math.max(1, Math.min(Math.floor(playerCount / 2) || 1, room.settings.impostorCount + delta));
    onUpdateSettings({ impostorCount: newCount });
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-8 space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pitch-850 via-pitch-800 to-pitch-850 border border-pitch-700/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-turf-400">
              Lobby de Espera
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-turf-500/20 text-turf-300">
              {playerCount} {playerCount === 1 ? 'jogador' : 'jogadores'}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {isHost
              ? 'Configure a partida e convide a galera.'
              : 'Aguardando o Host iniciar a partida...'}
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenInvite();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-turf-500 hover:bg-turf-400 text-pitch-950 font-bold text-xs shadow-md transition active:scale-95"
        >
          <Share2 size={14} />
          Convidar
        </button>
      </div>

      {/* Lista de Jogadores */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
            <Users size={14} />
            Jogadores na Sala ({playerCount})
          </div>
          {!canStart && (
            <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
              <AlertCircle size={11} /> Mínimo de 3
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {playersList.map((player) => {
            const isMe = player.id === currentPlayerId;
            return (
              <div
                key={player.id}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border transition ${
                  isMe
                    ? 'bg-pitch-800/90 border-turf-500/60 shadow-sm'
                    : 'bg-pitch-850/60 border-pitch-700/60'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-pitch-900 border border-pitch-700 flex items-center justify-center text-lg shrink-0">
                  {player.avatar || '⚽'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white truncate">
                      {player.name}
                    </span>
                    {player.isHost && (
                      <span className="shrink-0 flex items-center">
                        <Crown size={12} className="text-trophy-400" />
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {isMe ? 'Você' : player.isHost ? 'Host' : 'Conectado'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PAINEL DO HOST */}
      {isHost ? (
        <div className="bg-pitch-850/90 border border-pitch-700 rounded-3xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-pitch-700/60">
            <div className="flex items-center gap-2">
              <Crown size={16} className="text-trophy-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                Painel do Host
              </h3>
            </div>
            <div className="text-[10px] font-mono text-gray-400">
              Pool: <span className="text-turf-400 font-bold">{availablePoolCount}</span> atletas
            </div>
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
              Modalidade / Categoria
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = room.settings.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition border ${
                      isSelected
                        ? 'bg-turf-500/15 border-turf-500 text-white font-bold'
                        : 'bg-pitch-800/40 border-pitch-700/60 text-gray-300 hover:bg-pitch-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                    {isSelected && <Sparkles size={13} className="text-turf-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dificuldade */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
              Dificuldade
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {DIFFICULTY_OPTIONS.map((dif) => {
                const isSelected = room.settings.difficulty === dif.id;
                return (
                  <button
                    key={dif.id}
                    onClick={() => handleDifficultyChange(dif.id)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition border ${
                      isSelected
                        ? 'bg-white text-pitch-950 border-white shadow-sm'
                        : 'bg-pitch-800/50 text-gray-300 border-pitch-700/60 hover:bg-pitch-800'
                    }`}
                  >
                    {dif.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Falsos 9 & Dica */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-pitch-900/60 border border-pitch-700/60 rounded-2xl p-3">
              <div className="text-[10px] font-bold uppercase text-gray-400 mb-1 flex items-center gap-1">
                <Flame size={12} className="text-impostor-400" />
                Falsos 9
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleImpostorChange(-1)}
                  disabled={room.settings.impostorCount <= 1}
                  className="w-7 h-7 rounded-lg bg-pitch-800 hover:bg-pitch-700 text-white font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="text-lg font-black text-white">
                  {room.settings.impostorCount}
                </span>
                <button
                  onClick={() => handleImpostorChange(1)}
                  disabled={room.settings.impostorCount >= Math.max(1, Math.floor(playerCount / 2))}
                  className="w-7 h-7 rounded-lg bg-pitch-800 hover:bg-pitch-700 text-white font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <div className="text-[9px] text-gray-400 text-center mt-1">
                Sugerido: {recommendedImpostors}
              </div>
            </div>

            <div className="bg-pitch-900/60 border border-pitch-700/60 rounded-2xl p-3 flex flex-col justify-between">
              <div className="text-[10px] font-bold uppercase text-gray-400 mb-1 flex items-center gap-1">
                <Shield size={12} className="text-trophy-400" />
                Dica Falso 9
              </div>
              <button
                onClick={handleClueToggle}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                  room.settings.clueEnabled
                    ? 'bg-turf-500/20 text-turf-300 border-turf-500/50'
                    : 'bg-red-500/20 text-red-300 border-red-500/50'
                }`}
              >
                {room.settings.clueEnabled ? 'Ativada 💡' : 'Desativada ❌'}
              </button>
              <div className="text-[9px] text-gray-400 text-center mt-1">
                {room.settings.clueEnabled ? 'Dica tática sutil' : 'Sem dica (hardcore)'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-pitch-850/80 border border-pitch-700 rounded-3xl p-5 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-turf-500/10 border border-turf-500/30 flex items-center justify-center text-2xl">
            ⚽
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">
              Aguardando o Host apitar o início
            </h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Fique de olho na tela! Assim que o Host clicar em Iniciar, a contagem começa.
            </p>
          </div>

          <div className="bg-pitch-900/80 border border-pitch-700/60 rounded-2xl p-3 text-left space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Tema:</span>
              <span className="font-bold text-white capitalize">
                {room.settings.category.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Dificuldade:</span>
              <span className="font-bold text-white capitalize">
                {room.settings.difficulty}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Dica Falso 9:</span>
              <span className="font-bold text-turf-400">
                {room.settings.clueEnabled ? 'Ativada' : 'Desativada'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Badge Anti-Repetição */}
      <div className="text-center px-4">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 bg-pitch-850/50 border border-pitch-800 rounded-full py-1 px-3">
          <Shield size={11} className="text-turf-400" />
          Anti-Repetição: nenhum atleta se repete ({room.usedPlayerIds?.length || 0} já jogados)
        </span>
      </div>

      {/* Botão Iniciar */}
      {isHost && (
        <div className="pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onStartGame();
            }}
            disabled={!canStart || availablePoolCount === 0}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 ${
              canStart && availablePoolCount > 0
                ? 'bg-gradient-to-r from-turf-500 via-turf-400 to-emerald-400 hover:from-turf-400 hover:to-emerald-300 text-pitch-950 shadow-turf-500/20'
                : 'bg-pitch-800 text-gray-500 border border-pitch-700 cursor-not-allowed'
            }`}
          >
            <Play size={18} fill="currentColor" />
            {canStart
              ? 'Iniciar Partida'
              : `Aguardando jogadores (mínimo ${minPlayers})`}
          </button>
        </div>
      )}
    </div>
  );
}
