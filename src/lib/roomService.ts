import { ref, set, update, onValue, get } from 'firebase/database';
import { db, isFirebaseConfigured } from './firebase';
import { RoomData, RoomPlayer, RoomSettings, PlayerRole } from '@/types/game';
import { getRandomPlayer } from '@/data/playerDatabase';

// Código de sala aleatório de 5 caracteres amigável para futebol
export function generateRoomCode(): string {
  const prefixes = ['GOL', 'HEXA', 'FLA', 'FUT', 'BOLA', 'TIME', 'CAMI', 'PENTA'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(10 + Math.random() * 89);
  return `${prefix}${num}`;
}

export function generatePlayerId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

// ============================================================================
// SIMULADOR LOCAL / FALLBACK CASO O USUÁRIO AINDA NÃO TENHA CONFIGURADO O FIREBASE
// Permite testar o jogo abrindo múltiplas abas no mesmo computador imediatamente!
// ============================================================================
const localRoomSubscribers: Record<string, Set<(data: RoomData | null) => void>> = {};
let localBroadcastChannel: BroadcastChannel | null = null;

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  localBroadcastChannel = new BroadcastChannel('impostor_fc_multiplayer_sync');
  localBroadcastChannel.onmessage = (event) => {
    if (event.data?.type === 'ROOM_UPDATED') {
      const roomCode = event.data.roomCode;
      const data = getLocalRoom(roomCode);
      notifyLocalSubscribers(roomCode, data);
    }
  };
}

function getLocalRoom(roomCode: string): RoomData | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(`impostor_room_${roomCode.toUpperCase()}`);
  return raw ? JSON.parse(raw) : null;
}

function setLocalRoom(roomCode: string, data: RoomData | null) {
  if (typeof window === 'undefined') return;
  const key = `impostor_room_${roomCode.toUpperCase()}`;
  if (data === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(data));
  }
  localBroadcastChannel?.postMessage({ type: 'ROOM_UPDATED', roomCode: roomCode.toUpperCase() });
  notifyLocalSubscribers(roomCode.toUpperCase(), data);
}

function notifyLocalSubscribers(roomCode: string, data: RoomData | null) {
  const code = roomCode.toUpperCase();
  const subs = localRoomSubscribers[code];
  if (subs) {
    subs.forEach((cb) => cb(data));
  }
}

// ============================================================================
// SERVIÇO PRINCIPAL DE SALAS (FIREBASE COM FALLBACK AUTOMÁTICO)
// ============================================================================

export const RoomService = {
  // Criar uma nova sala
  async createRoom(
    hostName: string,
    hostAvatar: string,
    initialSettings?: Partial<RoomSettings>
  ): Promise<{ roomCode: string; hostId: string }> {
    const roomCode = generateRoomCode();
    const hostId = generatePlayerId();

    const hostPlayer: RoomPlayer = {
      id: hostId,
      name: hostName.trim() || 'Técnico',
      avatar: hostAvatar || '⚽',
      isHost: true,
      joinedAt: Date.now(),
    };

    const defaultSettings: RoomSettings = {
      category: 'todos',
      difficulty: 'misto',
      impostorCount: 1,
      clueEnabled: true,
      roundTimeSeconds: 180,
      ...initialSettings,
    };

    const newRoom: RoomData = {
      code: roomCode,
      createdAt: Date.now(),
      hostId,
      settings: defaultSettings,
      players: {
        [hostId]: hostPlayer,
      },
      round: {
        status: 'lobby',
        timerSeconds: defaultSettings.roundTimeSeconds,
        isTimerRunning: false,
        selectedPlayer: null,
        roles: {},
        firstSpeakerPlayerId: null,
        roundNumber: 1,
      },
      usedPlayerIds: [],
    };

    // Salva sempre no fallback local para garantir entrada instantânea
    setLocalRoom(roomCode, newRoom);

    if (isFirebaseConfigured && db) {
      try {
        // Tenta gravar no Firebase com timeout de 2 segundos para não travar o usuário
        const firebasePromise = set(ref(db, `rooms/${roomCode}`), newRoom);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firebase timeout')), 2500)
        );
        await Promise.race([firebasePromise, timeoutPromise]);
      } catch (err) {
        console.warn('[Falso 9] Falha ao sincronizar com Firebase, usando local:', err);
      }
    }

    return { roomCode, hostId };
  },

  // Entrar em uma sala existente
  async joinRoom(
    roomCode: string,
    playerName: string,
    playerAvatar: string
  ): Promise<{ success: boolean; playerId?: string; error?: string }> {
    const code = roomCode.trim().toUpperCase();
    const playerId = generatePlayerId();

    const newPlayer: RoomPlayer = {
      id: playerId,
      name: playerName.trim() || 'Camisa 10',
      avatar: playerAvatar || '⚽',
      isHost: false,
      joinedAt: Date.now(),
    };

    if (isFirebaseConfigured && db) {
      try {
        const roomRef = ref(db, `rooms/${code}`);
        const snapshot = await get(roomRef);

        if (snapshot.exists()) {
          const roomData = snapshot.val() as RoomData;
          if (roomData.round.status !== 'lobby') {
            return { success: false, error: 'A partida desta sala já está em andamento.' };
          }

          await update(ref(db, `rooms/${code}/players/${playerId}`), newPlayer);
          return { success: true, playerId };
        }
      } catch (err) {
        console.warn('[Falso 9] Firebase join falhou, tentando fallback local:', err);
      }
    }

    // Local Fallback
      const roomData = getLocalRoom(code);
      if (!roomData) {
        return { success: false, error: 'Sala não encontrada. Verifique o código digitado.' };
      }
      if (roomData.round.status !== 'lobby') {
        return { success: false, error: 'A partida desta sala já está em andamento.' };
      }

      roomData.players[playerId] = newPlayer;
      setLocalRoom(code, roomData);
      return { success: true, playerId };
    }
  },

  // Escuta em tempo real atualizações da sala
  subscribeToRoom(
    roomCode: string,
    onUpdate: (data: RoomData | null) => void,
    onError?: (error: Error) => void
  ): () => void {
    const code = roomCode.trim().toUpperCase();

    // Sempre entrega o dado local imediatamente se existir para evitar qualquer tela de loading infinita!
    const localData = getLocalRoom(code);
    if (localData) {
      onUpdate(localData);
    }

    if (isFirebaseConfigured && db) {
      const roomRef = ref(db, `rooms/${code}`);
      const unsubscribe = onValue(
        roomRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val() as RoomData;
            setLocalRoom(code, data);
            onUpdate(data);
          } else if (!localData) {
            onUpdate(null);
          }
        },
        (error) => {
          console.error('[Falso 9] Erro ao sincronizar sala:', error);
          if (onError) onError(error);
          if (localData) onUpdate(localData);
        }
      );
      return () => unsubscribe();
    } else {
      // Local sync
      if (!localRoomSubscribers[code]) {
        localRoomSubscribers[code] = new Set();
      }
      localRoomSubscribers[code].add(onUpdate);

      // Emite valor inicial
      const current = getLocalRoom(code);
      onUpdate(current);

      return () => {
        localRoomSubscribers[code]?.delete(onUpdate);
      };
    }
  },

  // Atualizar configurações da sala (Apenas Host)
  async updateSettings(roomCode: string, settings: Partial<RoomSettings>) {
    const code = roomCode.trim().toUpperCase();

    if (isFirebaseConfigured && db) {
      await update(ref(db, `rooms/${code}/settings`), settings);
    } else {
      const current = getLocalRoom(code);
      if (current) {
        current.settings = { ...current.settings, ...settings };
        setLocalRoom(code, current);
      }
    }
  },

  // Iniciar contagem regressiva sincronizada (3... 2... 1...)
  async startCountdown(roomCode: string) {
    const code = roomCode.trim().toUpperCase();
    const countdownStartAt = Date.now();

    const updatePayload = {
      'round/status': 'countdown',
      'round/countdownStartAt': countdownStartAt,
    };

    if (isFirebaseConfigured && db) {
      await update(ref(db, `rooms/${code}`), updatePayload);
    } else {
      const current = getLocalRoom(code);
      if (current) {
        current.round.status = 'countdown';
        current.round.countdownStartAt = countdownStartAt;
        setLocalRoom(code, current);
      }
    }
  },

  // Sorteia jogador (sem repetir) e papéis secretos, iniciando o debate
  async assignRolesAndStart(roomCode: string) {
    const code = roomCode.trim().toUpperCase();

    let roomData: RoomData | null = null;
    if (isFirebaseConfigured && db) {
      const snapshot = await get(ref(db, `rooms/${code}`));
      if (snapshot.exists()) {
        roomData = snapshot.val() as RoomData;
      }
    } else {
      roomData = getLocalRoom(code);
    }

    if (!roomData) return;

    const playersList = Object.values(roomData.players);
    const playerCount = playersList.length;

    // 1. Regra Estrita Anti-Repetição: sorteia da base de 10.000+ excluindo usedPlayerIds
    const usedIds = roomData.usedPlayerIds || [];
    const { player, poolExhausted } = getRandomPlayer(
      roomData.settings.category,
      roomData.settings.difficulty,
      usedIds
    );

    if (!player || poolExhausted) {
      throw new Error('O pool de jogadores para esta categoria/dificuldade se esgotou! O Host pode reiniciar o histórico no painel.');
    }

    // 2. Definir quantidade de impostores (calibrado conforme players)
    let impostorCount = roomData.settings.impostorCount;
    if (impostorCount >= playerCount) {
      impostorCount = Math.max(1, Math.floor(playerCount / 2));
    }

    // Embaralhar jogadores para sortear impostores
    const shuffledPlayerIds = [...playersList.map((p) => p.id)].sort(() => Math.random() - 0.5);
    const impostorIds = new Set(shuffledPlayerIds.slice(0, impostorCount));

    const roles: Record<string, PlayerRole> = {};
    playersList.forEach((p) => {
      roles[p.id] = impostorIds.has(p.id) ? 'impostor' : 'team';
    });

    // 3. Sorteia quem começa falando no debate
    const firstSpeakerIndex = Math.floor(Math.random() * playersList.length);
    const firstSpeaker = playersList[firstSpeakerIndex].id;

    const updatedUsedIds = [...usedIds, player.id];

    const newRoundPayload = {
      status: 'playing' as const,
      roundStartedAt: Date.now(),
      timerSeconds: roomData.settings.roundTimeSeconds || 180,
      isTimerRunning: true,
      selectedPlayer: player,
      roles,
      firstSpeakerPlayerId: firstSpeaker,
      roundNumber: roomData.round.roundNumber || 1,
    };

    if (isFirebaseConfigured && db) {
      await update(ref(db, `rooms/${code}`), {
        round: newRoundPayload,
        usedPlayerIds: updatedUsedIds,
      });
    } else {
      roomData.round = newRoundPayload;
      roomData.usedPlayerIds = updatedUsedIds;
      setLocalRoom(code, roomData);
    }
  },

  // Controle de Cronômetro
  async updateTimer(roomCode: string, seconds: number, isRunning: boolean) {
    const code = roomCode.trim().toUpperCase();
    const payload = {
      'round/timerSeconds': seconds,
      'round/isTimerRunning': isRunning,
    };

    if (isFirebaseConfigured && db) {
      await update(ref(db, `rooms/${code}`), payload);
    } else {
      const current = getLocalRoom(code);
      if (current) {
        current.round.timerSeconds = seconds;
        current.round.isTimerRunning = isRunning;
        setLocalRoom(code, current);
      }
    }
  },

  // Revelar resultado da partida (impostor e jogador)
  async revealResult(roomCode: string) {
    const code = roomCode.trim().toUpperCase();
    const payload = {
      'round/status': 'revealed',
      'round/isTimerRunning': false,
    };

    if (isFirebaseConfigured && db) {
      await update(ref(db, `rooms/${code}`), payload);
    } else {
      const current = getLocalRoom(code);
      if (current) {
        current.round.status = 'revealed';
        current.round.isTimerRunning = false;
        setLocalRoom(code, current);
      }
    }
  },

  // Nova Rodada mantendo a sala e jogadores
  async startNextRound(roomCode: string) {
    const code = roomCode.trim().toUpperCase();

    let roomData: RoomData | null = null;
    if (isFirebaseConfigured && db) {
      const snap = await get(ref(db, `rooms/${code}`));
      if (snap.exists()) roomData = snap.val() as RoomData;
    } else {
      roomData = getLocalRoom(code);
    }

    if (!roomData) return;

    const nextRoundNumber = (roomData.round.roundNumber || 1) + 1;
    const resetRoundPayload = {
      status: 'lobby' as const,
      timerSeconds: roomData.settings.roundTimeSeconds || 180,
      isTimerRunning: false,
      selectedPlayer: null,
      roles: {},
      firstSpeakerPlayerId: null,
      roundNumber: nextRoundNumber,
    };

    if (isFirebaseConfigured && db) {
      await update(ref(db, `rooms/${code}`), {
        round: resetRoundPayload,
      });
    } else {
      roomData.round = resetRoundPayload;
      setLocalRoom(code, roomData);
    }
  },

  // Limpar histórico de jogadores utilizados (apenas Host)
  async resetUsedPlayersHistory(roomCode: string) {
    const code = roomCode.trim().toUpperCase();
    if (isFirebaseConfigured && db) {
      await update(ref(db, `rooms/${code}`), { usedPlayerIds: [] });
    } else {
      const current = getLocalRoom(code);
      if (current) {
        current.usedPlayerIds = [];
        setLocalRoom(code, current);
      }
    }
  },

  // Sair da sala
  async leaveRoom(roomCode: string, playerId: string) {
    const code = roomCode.trim().toUpperCase();
    if (isFirebaseConfigured && db) {
      await set(ref(db, `rooms/${code}/players/${playerId}`), null);
    } else {
      const current = getLocalRoom(code);
      if (current && current.players[playerId]) {
        delete current.players[playerId];
        setLocalRoom(code, current);
      }
    }
  },
};
