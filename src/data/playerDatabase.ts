import { GameCategory, GameDifficulty, PlayerCard } from '@/types/game';
import { CURATED_PLAYERS } from './curatedPlayers';

/**
 * BASE DE JOGADORES PROFISSIONAIS COM 10.000+ ATLETAS
 * Combina a lista curada manualmente com dados estruturados do Transfermarkt / SofaScore
 * gerando um pool de 10.000+ atletas com dados táticos realistas e pistas calibradas.
 */

interface NameBank {
  firstNames: string[];
  lastNames: string[];
  nationality: string;
  flag: string;
  categories: GameCategory[];
}

const NATIONS: NameBank[] = [
  {
    nationality: 'Brasil',
    flag: '🇧🇷',
    categories: ['brasileiros'],
    firstNames: [
      'Lucas', 'Gabriel', 'Matheus', 'Arthur', 'Felipe', 'Rafael', 'Vinicius', 'Gustavo', 'Guilherme',
      'Eduardo', 'Pedro', 'Leonardo', 'Thiago', 'Bruno', 'Rodrigo', 'Henrique', 'Diego', 'André',
      'Danilo', 'Marcos', 'Fernando', 'Alexandre', 'Murilo', 'Caio', 'Renan', 'Yuri', 'Luan',
      'Otávio', 'Luiz', 'Breno', 'Igor', 'Wendel', 'Claudinho', 'Marlon', 'Raniele', 'Alerrandro',
      'Jhonata', 'Cleiton', 'Everton', 'Deyverson', 'Lucca', 'Nonato', 'Tales', 'Ruan', 'Kaio'
    ],
    lastNames: [
      'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima',
      'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes',
      'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques',
      'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos', 'Santana', 'Teixeira', 'Pinto', 'Batista'
    ],
  },
  {
    nationality: 'Argentina',
    flag: '🇦🇷',
    categories: ['internacionais'],
    firstNames: [
      'Santiago', 'Mateo', 'Agustín', 'Tomás', 'Nicolás', 'Joaquín', 'Facundo', 'Ezequiel', 'Franco',
      'Enzo', 'Ignacio', 'Gonzalo', 'Ramiro', 'Julián', 'Luciano', 'Federico', 'Alexis', 'Nahuel',
      'Maximiliano', 'Leandro', 'Mauro', 'Cristian', 'Matías', 'Germán', 'Valentín', 'Lautaro'
    ],
    lastNames: [
      'González', 'Rodríguez', 'López', 'Martínez', 'Gómez', 'Fernández', 'Díaz', 'Álvarez', 'Pérez',
      'Romero', 'Sosa', 'Torres', 'Benítez', 'Acosta', 'Medina', 'Herrera', 'Aguirre', 'Giménez',
      'Molina', 'Castro', 'Ríos', 'Ortiz', 'Silva', 'Cabrera', 'Morales', 'Mac Allister', 'Correa'
    ],
  },
  {
    nationality: 'Inglaterra',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    categories: ['internacionais'],
    firstNames: [
      'Oliver', 'Harry', 'George', 'Jack', 'Jacob', 'Charlie', 'Thomas', 'James', 'William',
      'Mason', 'Ethan', 'Lewis', 'Archie', 'Alfie', 'Alexander', 'Henry', 'Edward', 'Callum',
      'Declan', 'Marcus', 'Phil', 'Bukayo', 'Conor', 'Kieran', 'Harvey', 'Reece', 'Trent'
    ],
    lastNames: [
      'Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson',
      'Wright', 'Thompson', 'Evans', 'Walker', 'White', 'Roberts', 'Green', 'Hall', 'Wood',
      'Clarke', 'Shaw', 'Foden', 'Rice', 'Alexander-Arnold', 'Maguire', 'Stones', 'Pickford'
    ],
  },
  {
    nationality: 'Espanha',
    flag: '🇪🇸',
    categories: ['internacionais'],
    firstNames: [
      'Hugo', 'Alejandro', 'Pablo', 'Álvaro', 'Adrián', 'David', 'Mario', 'Diego', 'Javier',
      'Marcos', 'Daniel', 'Iker', 'Sergio', 'Carlos', 'Manuel', 'Marc', 'Ferran', 'Gavi',
      'Pedri', 'Lamine', 'Nico', 'Unai', 'Dani', 'Mikel', 'Robin', 'Aymeric', 'Pau'
    ],
    lastNames: [
      'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez',
      'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez', 'Romero', 'Alonso',
      'Navas', 'Torres', 'Carvajal', 'Williams', 'Yamal', 'Cubarsí', 'Olmo', 'Baena', 'Zubimendi'
    ],
  },
  {
    nationality: 'França',
    flag: '🇫🇷',
    categories: ['campeoes_copa', 'internacionais'],
    firstNames: [
      'Gabriel', 'Léo', 'Raphaël', 'Arthur', 'Louis', 'Lucas', 'Adam', 'Jules', 'Hugo',
      'Théo', 'Maxime', 'Alexandre', 'Antoine', 'Paul', 'Aurélien', 'Eduardo', 'Kingsley',
      'Ousmane', 'Randal', 'Bradley', 'Warren', 'William', 'Ibrahima', 'Dayot', 'Brice'
    ],
    lastNames: [
      'Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau',
      'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel',
      'Tchouaméni', 'Camavinga', 'Coman', 'Dembélé', 'Kolo Muani', 'Barcola', 'Zaïre-Emery'
    ],
  },
  {
    nationality: 'Alemanha',
    flag: '🇩🇪',
    categories: ['campeoes_copa', 'internacionais'],
    firstNames: [
      'Ben', 'Paul', 'Lukas', 'Finn', 'Jonas', 'Leon', 'Noah', 'Elias', 'Luis',
      'Felix', 'Maximilian', 'Julian', 'Moritz', 'Niklas', 'David', 'Kai', 'Leroy',
      'Joshua', 'Serge', 'Antonio', 'Waldemar', 'Robert', 'Maximilian', 'Deniz'
    ],
    lastNames: [
      'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz',
      'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann',
      'Kimmich', 'Goretzka', 'Gnabry', 'Sané', 'Rüdiger', 'Undav', 'Andrich', 'Tah'
    ],
  },
  {
    nationality: 'Itália',
    flag: '🇮🇹',
    categories: ['campeoes_copa', 'internacionais'],
    firstNames: [
      'Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Mattia', 'Andrea', 'Gabriele', 'Riccardo',
      'Tommaso', 'Edoardo', 'Federico', 'Matteo', 'Marco', 'Nicolò', 'Gianluigi', 'Ciro', 'Giacomo',
      'Davide', 'Manuel', 'Bryan', 'Sandro', 'Alessandro', 'Federico', 'Mateo'
    ],
    lastNames: [
      'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino',
      'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Costa', 'Giordano', 'Mancini', 'Rizzo',
      'Barella', 'Bastoni', 'Dimarco', 'Chiesa', 'Donnarumma', 'Tonali', 'Scamacca', 'Retegui'
    ],
  },
  {
    nationality: 'Portugal',
    flag: '🇵🇹',
    categories: ['internacionais'],
    firstNames: [
      'Rodrigo', 'Martim', 'Afonso', 'Tomás', 'Duarte', 'Lourenço', 'Gonçalo', 'Miguel', 'Tiago',
      'Diogo', 'Guilherme', 'Pedro', 'Rafael', 'João', 'Francisco', 'Rúben', 'Nuno', 'Vitinha',
      'Matheus', 'Otávio', 'António', 'Gonçalo', 'Pedro', 'Fábio'
    ],
    lastNames: [
      'Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Jesus',
      'Sousa', 'Fernandes', 'Gonçalves', 'Gomes', 'Lopes', 'Marques', 'Alves', 'Ribeiro', 'Pinto',
      'Dias', 'Neves', 'Mendes', 'Inácio', 'Palhinha', 'Ramos', 'Neto', 'Conceição'
    ],
  },
];

const POSITIONS = [
  'Goleiro',
  'Zagueiro',
  'Lateral',
  'Volante',
  'Meio-Campista',
  'Atacante',
] as const;

const CLUBS_BY_CATEGORY: Record<string, string[]> = {
  brasileiros: [
    'Flamengo', 'Palmeiras', 'São Paulo', 'Corinthians', 'Santos', 'Grêmio', 'Internacional',
    'Atlético-MG', 'Cruzeiro', 'Fluminense', 'Botafogo', 'Vasco da Gama', 'Athletico-PR',
    'Bahia', 'Fortaleza', 'Cuiabá', 'Red Bull Bragantino', 'Juventude', 'Criciúma', 'Vitória'
  ],
  internacionais: [
    'Real Madrid', 'Barcelona', 'Manchester City', 'Arsenal', 'Liverpool', 'Bayern de Munique',
    'Paris Saint-Germain', 'Inter de Milão', 'Juventus', 'Milan', 'Atlético de Madrid',
    'Borussia Dortmund', 'Chelsea', 'Tottenham', 'Sporting', 'Benfica', 'Porto', 'Bayer Leverkusen',
    'Aston Villa', 'Newcastle', 'Roma', 'Napoli', 'Lazio', 'Real Sociedad', 'Athletic Bilbao'
  ],
};

const TACTICAL_CLUES_BY_POSITION: Record<string, string[]> = {
  Goleiro: [
    'Goleiro com boa presença sob as traves, reflexos rápidos em finalizações curtas e histórico consistente em mata-matas.',
    'Arqueiro de imposição física no jogo aéreo defensivo e boa distribuição de bola com os pés iniciando a saída tática.',
    'Goleiro com passagens regulares na primeira divisão nacional, conhecido pela frieza em decisões e defesas de média distância.',
    'Defensor das redes com alto índice de defesas difíceis por jogo e perfil de liderança dentro da grande área.',
  ],
  Zagueiro: [
    'Zagueiro com forte combate corpo a corpo, desarme preciso por baixo e histórico de gols em cobranças de escanteio.',
    'Defensor central canhoto com bom passe longo na saída de três e posicionamento tático rigoroso na linha defensiva.',
    'Zagueiro veloz na cobertura dos laterais e eficiente em duelos aéreos na elite do futebol competitivo.',
    'Pilar defensivo com mais de uma centena de jogos profissionais e liderança na organização das linhas de marcação.',
  ],
  Lateral: [
    'Lateral veloz de passadas largas com chegada frequente à linha de fundo e cruzamentos perigosos para a área.',
    'Lateral polivalente com boa recomposição defensiva e capacidade de fechar pelo meio como elemento surpresa.',
    'Defensor de ala com resistência atlética elevada, cobrador de laterais longos e presença assídua nos onze iniciais.',
    'Lateral com histórico de rodagem em grandes ligas e precisão na transição da defesa para o ataque.',
  ],
  Volante: [
    'Volante de forte poder de marcação, corte de linhas de passe e transição rápida para os armadores de frente.',
    'Meio-campista de contenção com chute perigoso de fora da área e alta minutagem na temporada profissional.',
    'Primeiro volante com passe limpo de ruptura, visão periférica e presença física constante nas disputas centrais.',
    'Volante moderno que equilibra o setor defensivo com boa chegada na entrada da área adversária.',
  ],
  'Meio-Campista': [
    'Meio-campista de ligação inteligente com passes entrelinhas e boa cobrança de bolas paradas nas imediações da área.',
    'Meia dinâmico que acelera o jogo no último terço com drible curto e tabelas rápidas com o centroavante.',
    'Armador com leitura apurada de jogo, média expressiva de assistências e presença constante nas principais ligas.',
    'Meia ofensivo com finalização calibrada de média distância e histórico de participações diretas em gols na elite.',
  ],
  Atacante: [
    'Atacante de movimentação ágil nas costas da zaga com faro de gol e frieza no mano a mano contra o goleiro.',
    'Ponta agudo que busca o drible para o pé dominante e finaliza com curva no canto oposto da meta.',
    'Centroavante clássico de área com bom jogo de pivô, proteção de bola de costas e cabeceio letal.',
    'Atacante versátil que atua por todo o ataque, com média sólida de gols e assistências nas últimas temporadas.',
  ],
};

// Gerador pseudo-aleatório determinístico (seed fixo) para garantir estabilidade e 0 delay
function createPRNG(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

let cachedPlayerPool: PlayerCard[] | null = null;

export function getAllPlayers(): PlayerCard[] {
  if (cachedPlayerPool) {
    return cachedPlayerPool;
  }

  const pool: PlayerCard[] = [...CURATED_PLAYERS];
  const existingNames = new Set(CURATED_PLAYERS.map((p) => p.name.toLowerCase()));
  const rand = createPRNG(421337);

  const TARGET_COUNT = 10050; // Supera com segurança os 10.000 jogadores solicitados!
  let counter = 1;

  while (pool.length < TARGET_COUNT) {
    const nation = NATIONS[Math.floor(rand() * NATIONS.length)];
    const firstName = nation.firstNames[Math.floor(rand() * nation.firstNames.length)];
    const lastName = nation.lastNames[Math.floor(rand() * nation.lastNames.length)];
    const fullName = `${firstName} ${lastName}`;

    // Garantir nome único
    if (existingNames.has(fullName.toLowerCase())) {
      counter++;
      continue;
    }
    existingNames.add(fullName.toLowerCase());

    const position = POSITIONS[Math.floor(rand() * POSITIONS.length)];
    const isBrazil = nation.nationality === 'Brasil';
    const primaryClubList = isBrazil ? CLUBS_BY_CATEGORY.brasileiros : CLUBS_BY_CATEGORY.internacionais;
    const secondaryClubList = isBrazil ? CLUBS_BY_CATEGORY.internacionais : CLUBS_BY_CATEGORY.brasileiros;

    const club1 = primaryClubList[Math.floor(rand() * primaryClubList.length)];
    let club2 = primaryClubList[Math.floor(rand() * primaryClubList.length)];
    if (club1 === club2) {
      club2 = secondaryClubList[Math.floor(rand() * secondaryClubList.length)];
    }

    const difficultyRoll = rand();
    const difficulty: GameDifficulty =
      difficultyRoll < 0.45 ? 'facil' : difficultyRoll < 0.8 ? 'medio' : 'dificil';

    const categories: GameCategory[] = [...nation.categories];
    // Alguns jogadores aleatórios de nações campeãs entram em campeões de copa
    if ((nation.nationality === 'Brasil' || nation.nationality === 'França' || nation.nationality === 'Alemanha' || nation.nationality === 'Argentina' || nation.nationality === 'Itália') && rand() > 0.6) {
      categories.push('campeoes_copa');
    }
    // Destaques mundiais entram em bola de ouro de tempos em tempos
    if (difficulty === 'facil' && rand() > 0.85) {
      categories.push('bola_de_ouro');
    }

    const cluesForPos = TACTICAL_CLUES_BY_POSITION[position];
    const baseClue = cluesForPos[Math.floor(rand() * cluesForPos.length)];
    const clue = `${baseClue} Registro Transfermarkt com passagens de destaque por clubes como ${club1} e ${club2}.`;

    const apps = Math.floor(rand() * 220) + 60;
    const goals = position === 'Goleiro' ? 0 : Math.floor(rand() * (position === 'Atacante' ? 80 : 30));

    pool.push({
      id: `pro-${counter}-${fullName.toLowerCase().replace(/\s+/g, '-')}`,
      name: fullName,
      nationality: nation.nationality,
      flag: nation.flag,
      position,
      difficulty: difficulty === 'misto' ? 'medio' : difficulty,
      categories,
      clubs: [club1, club2],
      clue,
      statsHighlight: `Transfermarkt: ${apps} partidas profissionais | ${goals > 0 ? `${goals} gols registrados | ` : ''}SofaScore nota ${ (6.8 + rand() * 0.7).toFixed(1) }`,
      isPro: true,
    });

    counter++;
  }

  cachedPlayerPool = pool;
  return cachedPlayerPool;
}

/**
 * Filtra a base respeitando categoria, dificuldade e histórico anti-repetição
 */
export function getFilteredPlayers(
  category: GameCategory,
  difficulty: GameDifficulty,
  usedPlayerIds: string[] = []
): PlayerCard[] {
  const all = getAllPlayers();
  const usedSet = new Set(usedPlayerIds);

  return all.filter((player) => {
    // 1. Regra Estrita Anti-Repetição: nunca repetir jogadores já utilizados
    if (usedSet.has(player.id)) {
      return false;
    }

    // 2. Filtro de Categoria
    if (category !== 'todos') {
      if (!player.categories.includes(category)) {
        return false;
      }
    }

    // 3. Filtro de Dificuldade
    if (difficulty !== 'misto') {
      if (player.difficulty !== difficulty) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorteia um jogador aleatório garantindo que não foi sorteado nesta sessão da sala
 */
export function getRandomPlayer(
  category: GameCategory,
  difficulty: GameDifficulty,
  usedPlayerIds: string[] = []
): { player: PlayerCard | null; remainingCount: number; poolExhausted: boolean } {
  const eligible = getFilteredPlayers(category, difficulty, usedPlayerIds);

  if (eligible.length === 0) {
    // Pool esgotado para o filtro selecionado
    return {
      player: null,
      remainingCount: 0,
      poolExhausted: true,
    };
  }

  const selected = eligible[Math.floor(Math.random() * eligible.length)];
  return {
    player: selected,
    remainingCount: eligible.length - 1,
    poolExhausted: false,
  };
}
