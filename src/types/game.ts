export type GameCategory =
  | 'todos'
  | 'brasileiros'
  | 'campeoes_copa'
  | 'internacionais'
  | 'bola_de_ouro';

export type GameDifficulty = 'misto' | 'facil' | 'medio' | 'dificil';

export type GameStatus = 'lobby' | 'countdown' | 'playing' | 'revealed';

export type PlayerRole = 'team' | 'impostor';

export interface PlayerCard {
  id: string;
  name: string;
  nationality: string;
  flag: string;
  position: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  categories: GameCategory[];
  clue: string;
  clubs: string[];
  statsHighlight?: string;
  isPro: true;
}

export interface RoomPlayer {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  joinedAt: number;
}

export interface RoomSettings {
  category: GameCategory;
  difficulty: GameDifficulty;
  impostorCount: number;
  clueEnabled: boolean;
  roundTimeSeconds: number;
}

export interface RoundState {
  status: GameStatus;
  countdownStartAt?: number;
  roundStartedAt?: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  selectedPlayer: PlayerCard | null;
  roles: Record<string, PlayerRole>;
  firstSpeakerPlayerId: string | null;
  roundNumber: number;
}

export interface RoomData {
  code: string;
  createdAt: number;
  hostId: string;
  settings: RoomSettings;
  players: Record<string, RoomPlayer>;
  round: RoundState;
  usedPlayerIds: string[];
}
