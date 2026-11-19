'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, QrCode } from 'lucide-react';
import { sounds } from '@/lib/sound';
import { isFirebaseConfigured } from '@/lib/firebase';
import { QRCodeModal } from './QRCodeModal';

interface HeaderProps {
  roomCode?: string;
  roundNumber?: number;
  onLeave?: () => void;
}

export function Header({ roomCode, roundNumber, onLeave }: HeaderProps) {
  const [muted, setMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const toggleSound = () => {
    setMuted(!muted);
  };

  const copyCode = () => {
    if (!roomCode) return;
    sounds.playClick();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-pitch-950/90 backdrop-blur-md border-b border-pitch-800 px-4 py-3 flex items-center justify-between">
        {/* Lado Esquerdo: Logo ou Voltar */}
        <div className="flex items-center gap-2">
          {onLeave ? (
            <button
              onClick={() => {
                sounds.playClick();
                if (confirm('Deseja realmente sair da sala?')) {
                  onLeave();
                }
              }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-pitch-800 hover:bg-pitch-700 text-gray-300 transition"
            >
              Sair
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-xl">⚽</span>
              <span className="font-black text-sm tracking-wide bg-gradient-to-r from-turf-400 via-white to-trophy-400 bg-clip-text text-transparent">
                IMPOSTOR FC
              </span>
            </div>
          )}

          {roundNumber && roundNumber > 1 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-turf-500/20 text-turf-400 border border-turf-500/30">
              R{roundNumber}
            </span>
          )}
        </div>

        {/* Centro / Código da Sala */}
        {roomCode && (
          <div className="flex items-center gap-1">
            <button
              onClick={copyCode}
              title="Clique para copiar o código"
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pitch-850 hover:bg-pitch-800 border border-pitch-700 text-xs font-mono font-bold text-white transition active:scale-95"
            >
              <span className="text-gray-400 text-[10px]">SALA</span>
              <span className="text-turf-400">{roomCode}</span>
              {copied ? <Check size={12} className="text-turf-400" /> : <Copy size={12} className="text-gray-400" />}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setShowQR(true);
              }}
              title="Ver QR Code e link"
              className="p-1.5 rounded-xl bg-pitch-850 hover:bg-pitch-800 border border-pitch-700 text-gray-300 transition"
            >
              <QrCode size={14} />
            </button>
          </div>
        )}

        {/* Lado Direito: Som & Status */}
        <div className="flex items-center gap-1.5">
          {!isFirebaseConfigured && (
            <span
              title="Modo Demonstração Local ativo. Adicione as chaves do Firebase em .env.local para sincronizar entre múltiplos celulares na internet."
              className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 hidden sm:inline-block"
            >
              Demo Local
            </span>
          )}

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-pitch-850 hover:bg-pitch-800 border border-pitch-700 text-gray-300 transition"
            title={muted ? 'Ativar sons' : 'Silenciar'}
          >
            {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </header>

      {roomCode && (
        <QRCodeModal
          roomCode={roomCode}
          isOpen={showQR}
          onClose={() => setShowQR(false)}
        />
      )}
    </>
  );
}
