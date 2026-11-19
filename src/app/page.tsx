'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlusCircle, LogIn, Users, Trophy, Shield, Sparkles, HelpCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { RoomService } from '@/lib/roomService';
import { sounds } from '@/lib/sound';

const AVATARS = ['⚽', '🏆', '🧤', '👟', '🇧🇷', '⚡', '👑', '🎯', '🦁', '🪄'];

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('⚽');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  useEffect(() => {
    const codeFromUrl = searchParams.get('room');
    if (codeFromUrl) {
      setRoomCodeInput(codeFromUrl.toUpperCase());
      setActiveTab('join');
    }

    const savedNick = localStorage.getItem('impostor_fc_nickname');
    const savedAvatar = localStorage.getItem('impostor_fc_avatar');
    if (savedNick) setNickname(savedNick);
    if (savedAvatar && AVATARS.includes(savedAvatar)) setSelectedAvatar(savedAvatar);
  }, [searchParams]);

  const saveProfileLocally = () => {
    if (nickname.trim()) {
      localStorage.setItem('impostor_fc_nickname', nickname.trim());
      localStorage.setItem('impostor_fc_avatar', selectedAvatar);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nickname.trim()) {
      setErrorMsg('Por favor, digite seu apelido ou nome de jogador.');
      return;
    }

    setLoading(true);
    sounds.playClick();
    saveProfileLocally();

    try {
      const { roomCode, hostId } = await RoomService.createRoom(nickname, selectedAvatar);
      sessionStorage.setItem(`impostor_player_${roomCode}`, hostId);
      router.push(`/room/${roomCode}`);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Erro ao criar a sala. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nickname.trim()) {
      setErrorMsg('Por favor, digite seu apelido.');
      return;
    }

    if (!roomCodeInput.trim()) {
      setErrorMsg('Por favor, digite o código da sala.');
      return;
    }

    setLoading(true);
    sounds.playClick();
    saveProfileLocally();

    const cleanCode = roomCodeInput.trim().toUpperCase();

    try {
      const result = await RoomService.joinRoom(cleanCode, nickname, selectedAvatar);
      if (result.success && result.playerId) {
        sessionStorage.setItem(`impostor_player_${cleanCode}`, result.playerId);
        router.push(`/room/${cleanCode}`);
      } else {
        setErrorMsg(result.error || 'Não foi possível entrar na sala.');
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Erro ao tentar conectar à sala.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 flex flex-col p-4 pb-8 space-y-6">
        {/* Hero Section */}
        <div className="text-center pt-2 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-turf-500/15 text-turf-400 border border-turf-500/30 text-[11px] font-extrabold uppercase tracking-widest shadow-sm">
            <Sparkles size={12} />
            Multiplayer em Tempo Real
          </div>

          <h1 className="text-4xl font-black text-white tracking-tight leading-none">
            FALSO <span className="text-turf-400">9</span>
          </h1>

          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Cada amigo no seu próprio celular. Descubra quem é o falso 9 blefando na rodada!
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-pitch-850/90 border border-pitch-700/80 rounded-3xl p-5 shadow-2xl space-y-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
              Seu Apelido de Jogador
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: Romário da Zaga, Vini..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                className="flex-1 px-4 py-3 rounded-2xl bg-pitch-900 border border-pitch-700 text-white placeholder-gray-500 text-sm font-semibold focus:outline-none focus:border-turf-500 transition"
              />
              <div className="w-12 h-12 rounded-2xl bg-pitch-900 border border-pitch-700 flex items-center justify-center text-xl shrink-0 shadow-inner">
                {selectedAvatar}
              </div>
            </div>

            <div className="flex items-center justify-between gap-1 pt-1 overflow-x-auto py-1">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedAvatar(avatar);
                  }}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition shrink-0 ${
                    selectedAvatar === avatar
                      ? 'bg-turf-500 text-white scale-110 shadow-md'
                      : 'bg-pitch-800 text-gray-400 hover:bg-pitch-750'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div className="flex rounded-2xl bg-pitch-900 p-1 border border-pitch-700/80">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('create');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'create'
                  ? 'bg-turf-500 text-pitch-950 font-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <PlusCircle size={14} />
              Criar Sala
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('join');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'join'
                  ? 'bg-turf-500 text-pitch-950 font-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LogIn size={14} />
              Entrar na Sala
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {activeTab === 'create' ? (
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div className="bg-pitch-900/60 border border-pitch-800 rounded-2xl p-3 text-xs text-gray-300 space-y-1">
                <span className="font-bold text-white block">
                  👑 Você será o Host:
                </span>
                Poderá escolher a modalidade, dificuldade, quantidade de Falsos 9 e apitar o início pelo seu celular.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-turf-500 via-turf-400 to-emerald-400 hover:from-turf-400 hover:to-emerald-300 text-pitch-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-turf-500/20 transition active:scale-95 disabled:opacity-50"
              >
                <PlusCircle size={18} />
                {loading ? 'Criando Sala...' : 'Criar Nova Sala'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                  Código da Sala
                </label>
                <input
                  type="text"
                  placeholder="Ex: GOL24"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-2xl bg-pitch-900 border border-pitch-700 text-white placeholder-gray-500 text-sm font-mono font-bold uppercase text-center tracking-widest focus:outline-none focus:border-turf-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-turf-500 via-turf-400 to-emerald-400 hover:from-turf-400 hover:to-emerald-300 text-pitch-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-turf-500/20 transition active:scale-95 disabled:opacity-50"
              >
                <LogIn size={18} />
                {loading ? 'Conectando...' : 'Entrar na Sala'}
              </button>
            </form>
          )}
        </div>

        {/* Como Jogar */}
        <div className="bg-pitch-850/60 border border-pitch-700/60 rounded-2xl p-4">
          <button
            onClick={() => {
              sounds.playClick();
              setShowHowToPlay(!showHowToPlay);
            }}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-300"
          >
            <span className="flex items-center gap-2">
              <HelpCircle size={15} className="text-turf-400" />
              Como Funciona o Falso 9?
            </span>
            <span className="text-gray-400">{showHowToPlay ? '▲' : '▼'}</span>
          </button>

          {showHowToPlay && (
            <div className="mt-3 space-y-2 text-xs text-gray-300 border-t border-pitch-800 pt-3">
              <div className="flex gap-2">
                <span className="font-bold text-turf-400">1.</span>
                <span>
                  <strong>Cada um no seu celular:</strong> O Host cria a sala e envia o link/código no WhatsApp.
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-turf-400">2.</span>
                <span>
                  <strong>Revelação secreta:</strong> Os titulares veem o jogador real sorteado. O <strong>Falso 9</strong> vê apenas uma dica tática calibrada (Transfermarkt/SofaScore) para blefar.
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-turf-400">3.</span>
                <span>
                  <strong>Debate & Votação:</strong> Um cronômetro de 3 minutos é iniciado. Façam perguntas e descubram quem está fingindo saber!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400 pt-1">
          <span className="flex items-center gap-1">
            <Trophy size={13} className="text-trophy-400" /> +10.000 Jogadores
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Shield size={13} className="text-turf-400" /> Sem Repetições
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Users size={13} className="text-purple-400" /> Salas Ilimitadas
          </span>
        </div>
      </main>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white">Carregando Falso 9...</div>}>
      <HomeContent />
    </Suspense>
  );
}
