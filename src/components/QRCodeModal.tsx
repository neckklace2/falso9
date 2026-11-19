'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { sounds } from '@/lib/sound';

interface QRCodeModalProps {
  roomCode: string;
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ roomCode, isOpen, onClose }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const inviteUrl = `${origin}/?room=${roomCode}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Bora jogar Impostor FC! Entra aí na sala *${roomCode}*: ${inviteUrl}`
  )}`;

  const handleCopy = () => {
    sounds.playClick();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xs bg-pitch-850 border border-pitch-700 rounded-3xl p-6 text-center shadow-2xl relative">
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full bg-pitch-800 transition"
        >
          <X size={18} />
        </button>

        <div className="text-3xl mb-2">⚽</div>
        <h3 className="text-xl font-bold text-white mb-1">Convite da Sala</h3>
        <p className="text-xs text-gray-400 mb-4">
          Compartilhe o código ou link com a galera:
        </p>

        {/* Código Gigante */}
        <div className="bg-pitch-950 border border-turf-500/40 rounded-2xl py-3 px-4 mb-4">
          <div className="text-xs uppercase tracking-widest text-turf-400 font-semibold mb-1">
            Código da Sala
          </div>
          <div className="text-3xl font-black tracking-wider text-white font-mono">
            {roomCode}
          </div>
        </div>

        {/* QR Code gerado dinamicamente via Google Chart API rápida e limpa */}
        <div className="bg-white p-3 rounded-2xl mx-auto w-44 h-44 mb-4 flex items-center justify-center shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
              inviteUrl
            )}`}
            alt={`QR Code para entrar na sala ${roomCode}`}
            className="w-full h-full rounded"
          />
        </div>

        {/* Botões de Ação */}
        <div className="space-y-2">
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-pitch-800 hover:bg-pitch-700 text-white font-semibold text-sm transition border border-pitch-700"
          >
            {copied ? <Check size={18} className="text-turf-400" /> : <Copy size={18} />}
            {copied ? 'Link Copiado!' : 'Copiar Link'}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sounds.playClick()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-sm transition"
          >
            <Share2 size={18} />
            Mandar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
