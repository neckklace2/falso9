'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RoomData, RoomSettings } from '@/types/game';
import { Header } from '@/components/Header';
import { LobbyView } from '@/components/LobbyView';
import { CountdownView } from '@/components/CountdownView';
import { SecretRoleView } from '@/components/SecretRoleView';
import { DebateTimerView } from '@/components/DebateTimerView';
import { ResultRevealView } from '@/components/ResultRevealView';
import { QRCodeModal } from '@/components/QRCodeModal';
import { RoomService } from '@/lib/roomService';
import { sounds } from '@/lib/sound';
import { LogIn, AlertCircle } from 'lucide-react';

const AVATARS = ['⚽', '🏆', '🧤', '👟', '🇧🇷', '⚡', '👑', '🎯', '🦁', '🪄'];

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = String(params?.code || '').toUpperCase();

  const [room, setRoom] = useState<RoomData | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [nicknameInput, setNicknameInput] = useState('');
  const [avatarInput, setAvatarInput] = useState('⚽');
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedId = sessionStorage.getItem(`impostor_player_${roomCode}`);
    if (savedId) {
      setPlayerId(savedId);
    }

    const savedNick = localStorage.getItem('impostor_fc_nickname');
    const savedAvatar = localStorage.getItem('impostor_fc_avatar');
    if (savedNick) setNicknameInput(savedNick);
    if (savedAvatar) setAvatarInput(savedAvatar);
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode) return;

    // Timeout de segurança: se o Firebase demorar mais de 3.5s, para o loading
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 3500);

    const unsubscribe = RoomService.subscribeToRoom(roomCode, (data) => {
      console.log('[Falso 9] Dados recebidos da sala:', data);
      clearTimeout(safetyTimer);
      setRoom(data);
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, [roomCode]);

  const handleDirectJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');

    if (!nicknameInput.trim()) {
      setJoinError('Por favor, digite seu apelido.');
      return;
    }

    sounds.playClick();
    localStorage.setItem('impostor_fc_nickname', nicknameInput.trim());
    localStorage.setItem('impostor_fc_avatar', avatarInput);

    try {
      const result = await RoomService.joinRoom(roomCode, nicknameInput, avatarInput);
      if (result.success && result.playerId) {
        sessionStorage.setItem(`impostor_player_${roomCode}`, result.playerId);
        setPlayerId(result.playerId);
      } else {
        setJoinError(result.error || 'Não foi possível entrar na sala.');
      }
    } catch (err: unknown) {
      console.error(err);
      setJoinError('Erro ao conectar à sala.');
    }
  };

  const handleUpdateSettings = useCallback(
    (settings: Partial<RoomSettings>) => {
      RoomService.updateSettings(roomCode, settings);
    },
    [roomCode]
  );

  const handleStartGame = useCallback(() => {
    RoomService.startCountdown(roomCode);
  }, [roomCode]);

  const handleFinishCountdown = useCallback(() => {
    RoomService.assignRolesAndStart(roomCode);
  }, [roomCode]);

  const handleToggleTimer = useCallback(
    (isRunning: boolean) => {
      if (!room) return;
      RoomService.updateTimer(roomCode, room.round.timerSeconds, isRunning);
    },
    [roomCode, room]
  );

  const handleUpdateTimer = useCallback(
    (seconds: number) => {
      if (!room) return;
      RoomService.updateTimer(roomCode, seconds, room.round.isTimerRunning);
    },
    [roomCode, room]
  );

  const handleRevealResult = useCallback(() => {
    RoomService.revealResult(roomCode);
  }, [roomCode]);

  const handleStartNextRound = useCallback(() => {
    RoomService.startNextRound(roomCode);
  }, [roomCode]);

  const handleResetUsedHistory = useCallback(() => {
    RoomService.resetUsedPlayersHistory(roomCode);
  }, [roomCode]);

  const handleLeaveRoom = useCallback(async () => {
    if (playerId) {
      await RoomService.leaveRoom(roomCode, playerId);
      sessionStorage.removeItem(`impostor_player_${roomCode}`);
    }
    router.push('/');
  }, [roomCode, playerId, router]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-full border-4 border-turf-500 border-t-transparent animate-spin" />
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Conectando à Sala {roomCode}...
        </p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-red-500/20 text-red-400 flex items-center justify-center text-3xl">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-lg font-bold text-white">Sala Não Encontrada</h2>
        <p className="text-xs text-gray-400 max-w-xs">
          O código <span className="font-mono text-white">{roomCode}</span> não existe ou a partida já foi encerrada.
        </p>
        <button
          onClick={() => router.push('/')}
          className="py-3 px-6 rounded-2xl bg-pitch-800 hover:bg-pitch-750 text-white font-bold text-xs"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  const isPlayerRegistered = playerId && room.players && room.players[playerId];

  if (!isPlayerRegistered) {
    return (
      <div className="flex-1 flex flex-col p-4 pb-8 space-y-5 animate-fade-in">
        <Header roomCode={roomCode} />

        <div className="text-center pt-2 space-y-1">
          <span className="text-3xl">👋</span>
          <h2 className="text-2xl font-black text-white">Entrar na Partida</h2>
          <p className="text-xs text-gray-400">
            Você foi convidado para a sala <span className="text-turf-400 font-mono font-bold">{roomCode}</span>!
          </p>
        </div>

        <div className="bg-pitch-850/90 border border-pitch-700/80 rounded-3xl p-5 shadow-2xl space-y-4">
          <form onSubmit={handleDirectJoin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Escolha seu Apelido
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Artilheiro..."
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  maxLength={20}
                  className="flex-1 px-4 py-3 rounded-2xl bg-pitch-900 border border-pitch-700 text-white placeholder-gray-500 text-sm font-semibold focus:outline-none focus:border-turf-500 transition"
                />
                <div className="w-12 h-12 rounded-2xl bg-pitch-900 border border-pitch-700 flex items-center justify-center text-xl shrink-0">
                  {avatarInput}
                </div>
              </div>

              <div className="flex items-center justify-between gap-1 pt-1 overflow-x-auto py-1">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setAvatarInput(avatar);
                    }}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition shrink-0 ${
                      avatarInput === avatar
                        ? 'bg-turf-500 text-white scale-110 shadow-md'
                        : 'bg-pitch-800 text-gray-400 hover:bg-pitch-750'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {joinError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold text-center">
                {joinError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-turf-500 via-turf-400 to-emerald-400 hover:from-turf-400 hover:to-emerald-300 text-pitch-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-turf-500/20 transition active:scale-95"
            >
              <LogIn size={18} />
              Entrar no Lobby
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isHost = room.hostId === playerId;
  const status = room.round.status;
  const playerRole = (room.round.roles && room.round.roles[playerId]) || 'team';

  return (
    <div className="flex-1 flex flex-col">
      <Header
        roomCode={roomCode}
        roundNumber={room.round.roundNumber}
        onLeave={handleLeaveRoom}
      />

      {status === 'lobby' && (
        <LobbyView
          room={room}
          currentPlayerId={playerId}
          onUpdateSettings={handleUpdateSettings}
          onStartGame={handleStartGame}
          onOpenInvite={() => setShowInviteModal(true)}
        />
      )}

      {status === 'countdown' && (
        <CountdownView
          countdownStartAt={room.round.countdownStartAt}
          isHost={isHost}
          onFinishCountdown={handleFinishCountdown}
        />
      )}

      {status === 'playing' && (
        <div className="flex-1 flex flex-col p-4 pb-8 space-y-4 animate-fade-in">
          <SecretRoleView
            role={playerRole}
            selectedPlayer={room.round.selectedPlayer}
            clueEnabled={room.settings.clueEnabled}
          />

          <DebateTimerView
            room={room}
            currentPlayerId={playerId}
            onToggleTimer={handleToggleTimer}
            onUpdateTimer={handleUpdateTimer}
            onRevealResult={handleRevealResult}
          />
        </div>
      )}

      {status === 'revealed' && (
        <ResultRevealView
          room={room}
          currentPlayerId={playerId}
          onStartNextRound={handleStartNextRound}
          onResetUsedHistory={handleResetUsedHistory}
        />
      )}

      <QRCodeModal
        roomCode={roomCode}
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </div>
  );
}
