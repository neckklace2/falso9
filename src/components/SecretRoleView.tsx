'use client';

import React, { useState } from 'react';
import { PlayerCard, PlayerRole } from '@/types/game';
import { Eye, EyeOff, ShieldCheck, Flame, Info, Sparkles } from 'lucide-react';
import { sounds } from '@/lib/sound';

interface SecretRoleViewProps {
  role: PlayerRole;
  selectedPlayer: PlayerCard | null;
  clueEnabled: boolean;
}

export function SecretRoleView({
  role,
  selectedPlayer,
  clueEnabled,
}: SecretRoleViewProps) {
  // Modo de privacidade anti-olhares: permite esconder o papel caso alguém esteja olhando a tela do celular
  const [isRevealed, setIsRevealed] = useState(false);

  const isImpostor = role === 'impostor';

  const toggleReveal = () => {
    sounds.playClick();
    if (!isRevealed) {
      if (isImpostor) {
        sounds.playImpostorReveal();
      } else {
        sounds.playRevealSuccess();
      }
    }
    setIsRevealed(!isRevealed);
  };

  return (
    <div className="w-full space-y-3">
      {/* Botão de Privacidade / Proteção contra "Espiadas" */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Sua Tela Secreta
        </span>
        <button
          onClick={toggleReveal}
          className="flex items-center gap-1.5 text-xs font-semibold py-1 px-3 rounded-full bg-pitch-800 hover:bg-pitch-750 text-gray-300 border border-pitch-700 transition"
        >
          {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
          {isRevealed ? 'Ocultar da tela' : 'Tocar para revelar'}
        </button>
      </div>

      {/* Cartão de Papel Secreto */}
      {!isRevealed ? (
        /* Estado Oculto (Anti-Espiada) */
        <div
          onClick={toggleReveal}
          className="bg-pitch-850 border-2 border-dashed border-pitch-700 hover:border-turf-500/50 rounded-3xl p-8 text-center cursor-pointer transition active:scale-[0.99] shadow-lg flex flex-col items-center justify-center min-h-[220px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-pitch-900 border border-pitch-700 flex items-center justify-center text-2xl mb-3 shadow-inner">
            🔒
          </div>
          <h3 className="text-base font-black text-white mb-1">
            Papel Secreto Protegido
          </h3>
          <p className="text-xs text-gray-400 max-w-[220px] mb-4">
            Garanta que ninguém ao seu lado esteja olhando para a sua tela.
          </p>
          <span className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-turf-500 text-pitch-950 font-bold text-xs shadow-md">
            <Eye size={14} /> Toque para Revelar Seu Papel
          </span>
        </div>
      ) : isImpostor ? (
        /* ================================================================== */
        /* TELA EXCLUSIVA DO IMPOSTOR                                         */
        /* ================================================================== */
        <div className="bg-gradient-to-b from-impostor-950/80 via-pitch-850 to-pitch-900 border-2 border-impostor-500/80 rounded-3xl p-5 text-left shadow-[0_0_35px_rgba(239,68,68,0.2)] animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-impostor-500/30">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-impostor-500/20 text-impostor-400">
                <Flame size={20} />
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-impostor-400 block">
                  Identidade Secreta
                </span>
                <h3 className="text-xl font-black text-white tracking-wide">
                  VOCÊ É O IMPOSTOR! 🕵️‍♂️
                </h3>
              </div>
            </div>
            <button
              onClick={toggleReveal}
              title="Ocultar tela"
              className="p-1.5 rounded-lg bg-pitch-900/80 text-gray-400 hover:text-white"
            >
              <EyeOff size={16} />
            </button>
          </div>

          {/* Dica Calibrada de Dedução */}
          {clueEnabled && selectedPlayer?.clue ? (
            <div className="bg-pitch-950/90 border border-trophy-500/40 rounded-2xl p-3.5 space-y-2 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-trophy-400 flex items-center gap-1.5">
                  <Sparkles size={12} />
                  Dica Calibrada de Dedução
                </span>
                <span className="text-[9px] text-gray-400 font-mono">
                  Transfermarkt / SofaScore
                </span>
              </div>
              <p className="text-xs font-medium text-gray-200 leading-relaxed bg-pitch-900/70 p-2.5 rounded-xl border border-pitch-800">
                &ldquo;{selectedPlayer.clue}&rdquo;
              </p>
              <p className="text-[10px] text-gray-400 italic">
                *Gancho tático para te ajudar a blefar e participar da conversa sem entregar que não sabe o nome exato.
              </p>
            </div>
          ) : (
            <div className="bg-pitch-950/80 border border-pitch-800 rounded-2xl p-3 text-xs text-gray-300">
              <span className="font-bold text-amber-400 block mb-0.5">
                Sem Dica Ativada!
              </span>
              Preste atenção máxima nas perguntas e adjetivos dos outros jogadores para descobrir quem é o jogador antes que te descubram.
            </div>
          )}

          {/* Orientação Tática de Blefe */}
          <div className="bg-pitch-900/80 border border-pitch-800 rounded-2xl p-3 flex items-start gap-2 text-xs text-gray-300">
            <Info size={16} className="text-impostor-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">
                Estratégia do Impostor:
              </span>
              Concorde com opiniões gerais sobre estilo de jogo ou ligas, faça perguntas de volta e tente jogar a suspeita para outro amigo!
            </div>
          </div>
        </div>
      ) : (
        /* ================================================================== */
        /* TELA EXCLUSIVA DO JOGADOR DO TIME (FUTEBOLISTA)                    */
        /* ================================================================== */
        <div className="bg-gradient-to-b from-pitch-850 via-pitch-850 to-pitch-900 border-2 border-turf-500/80 rounded-3xl p-5 text-left shadow-[0_0_35px_rgba(16,185,129,0.18)] animate-fade-in space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-turf-500/30">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-turf-500/20 text-turf-400">
                <ShieldCheck size={20} />
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-turf-400 block">
                  Identidade Secreta
                </span>
                <h3 className="text-xl font-black text-white tracking-wide">
                  VOCÊ É DA EQUIPE! ⚽
                </h3>
              </div>
            </div>
            <button
              onClick={toggleReveal}
              title="Ocultar tela"
              className="p-1.5 rounded-lg bg-pitch-900/80 text-gray-400 hover:text-white"
            >
              <EyeOff size={16} />
            </button>
          </div>

          {/* Destaque do Jogador Sorteado */}
          <div className="bg-pitch-950/90 border border-turf-500/40 rounded-2xl p-4 text-center shadow-inner">
            <span className="text-[10px] uppercase font-bold tracking-widest text-turf-400 mb-1 block">
              O JOGADOR SORTEADO É:
            </span>
            <div className="text-2xl font-black text-white tracking-tight mb-2">
              {selectedPlayer?.name || 'Aguardando Sorteio...'}
            </div>

            {/* Badges de Apoio (País, Posição, Clubes) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-pitch-850 border border-pitch-700 text-gray-200 font-semibold flex items-center gap-1">
                <span>{selectedPlayer?.flag}</span>
                <span>{selectedPlayer?.nationality}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-pitch-850 border border-pitch-700 text-gray-200 font-semibold">
                {selectedPlayer?.position}
              </span>
              {selectedPlayer?.clubs && selectedPlayer.clubs.length > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-pitch-850 border border-pitch-700 text-gray-300 font-mono text-[11px]">
                  {selectedPlayer.clubs.join(' • ')}
                </span>
              )}
            </div>
          </div>

          {/* Orientação Rápida */}
          <div className="bg-pitch-900/80 border border-pitch-800 rounded-2xl p-3 flex items-start gap-2 text-xs text-gray-300">
            <Info size={16} className="text-turf-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">
                Orientação da Rodada:
              </span>
              Fale de características táticas, momentos marcantes ou títulos sem entregar o nome ou o time atual de graça. Quem enrolar demais é o impostor!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
