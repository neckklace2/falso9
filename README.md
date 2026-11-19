# ⚽ Impostor FC Multiplayer

Aplicação web completa, responsiva e **mobile-first** para partidas multiplayer em tempo real do jogo **Impostor FC**, pronta para deploy na **Vercel**. Cada jogador joga no seu próprio celular via link ou código de sala!

---

## 📱 Destaques e Funcionalidades

1. **Cada Jogador no Seu Próprio Celular**:
   - Criação de sala instantânea com código curto (ex: `GOL24`, `FLA10`) e link de convite direto para WhatsApp.
   - Sincronização em tempo real entre todos os dispositivos.
   - Modo de privacidade anti-olhares ("Toque para revelar seu papel") para evitar espiadas de quem está sentado ao lado.

2. **Lobby em Tempo Real & Painel do Host**:
   - Lista instantânea de jogadores conectados indicando o Host 👑.
   - Ajuste de **Modalidade / Categoria**:
     - *Aleatório (Todos os temas)*
     - *Jogadores Brasileiros (Brasileirão e Seleção)*
     - *Campeões de Copa do Mundo*
     - *Jogadores Internacionais (Champions League, Premier League, La Liga, etc.)*
     - *Vencedores / Destaques da Bola de Ouro*
   - Ajuste de **Dificuldade**: *Misto*, *Fácil*, *Médio*, *Difícil*.
   - Quantidade de Impostores automática ou customizável.
   - Toggle de **Dica para o Impostor**: *Ativada* ou *Desativada*.

3. **Contagem Regressiva Sincronizada (3... 2... 1...)**:
   - O apito do árbitro e o contador 3D disparam simultaneamente em todos os celulares da sala.

4. **Dicas Calibradas de Dedução (Transfermarkt / SofaScore)**:
   - Chega de dicas óbvias como *"ganhou Copa e tem Bola de Ouro"* (que todo mundo sabe que é o Messi)!
   - As dicas foram escritas e estruturadas com ganchos táticos reais: estilo de jogo, pé dominante, histórico de ligas, troféus continentais, transferências marcantes e números de jogos. Permite ao impostor blefar com inteligência sem entregar o nome de bandeja.

5. **Regra Estrita Anti-Repetição (Nunca Repete Jogador)**:
   - A sala mantém registro de todos os IDs sorteados na sessão (`usedPlayerIds`).
   - Mesmo alternando modalidades ou dificuldades, o mesmo atleta nunca se repetirá durante a partida. O Host tem a opção de resetar o histórico se desejar.

6. **Base de 10.000+ Atletas Profissionais**:
   - Contém estrelas históricas e atuais calibradas à mão (`src/data/curatedPlayers.ts`) somadas a um gerador determinístico de alto desempenho (`src/data/playerDatabase.ts`) cobrindo mais de 10.000 profissionais com estatísticas e dados de clubes do Transfermarkt, Flashscore e SofaScore.
   - **Facilidade para atualizar mês a mês**: você pode simplesmente abrir o arquivo `src/data/curatedPlayers.ts` e colar novos jogadores manualmente quando quiser, sem precisar alterar nada no restante da aplicação.

7. **Debate & Cronômetro**:
   - Sorteio automático de quem começa falando no debate 🎙️.
   - Cronômetro sincronizado com pausa, acréscimo de +30s e alerta sonoro/visual.
   - Botão de Revelação de Resultado com chuva de confetes e botão de **Nova Rodada**.

8. **Áudio Sintetizado Web Audio API**:
   - Efeitos sonoros reais (bipes da contagem, apito de juiz, som dramático do impostor e fanfarra de revelação) sintetizados diretamente no navegador, funcionando instantaneamente em iPhones e Androids sem requisições externas de MP3.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/) + React 18 + TypeScript
- **Estilização**: Tailwind CSS (tema estádio noturno, responsivo para telas de 360px a 430px)
- **Tempo Real**: [Firebase Realtime Database](https://firebase.google.com/) (com simulador local automático para testes sem configuração prévia)
- **Ícones**: Lucide React
- **Animações e Efeitos**: Canvas Confetti + Web Audio API

---

## 🚀 Como Rodar Localmente

### 1. Pré-requisitos
Certifique-se de ter o **Node.js** (versão 18 ou superior) instalado em sua máquina.

### 2. Instalação das Dependências
Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

O comando irá instalar automaticamente as seguintes bibliotecas listadas no `package.json`:
- `next`, `react`, `react-dom`
- `firebase`
- `lucide-react`
- `canvas-confetti` e `@types/canvas-confetti`
- `clsx`, `tailwind-merge`
- `tailwindcss`, `postcss`, `autoprefixer`, `typescript`

### 3. Rodar o Servidor de Desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

> **Dica para Testar Imediatamente:** O projeto possui um **simulador local embutido** via `BroadcastChannel` e `localStorage`. Você pode abrir 2 ou 3 abas anônimas ou janelas diferentes no seu computador, criar uma sala em uma delas e entrar com o código nas outras para testar o fluxo completo antes mesmo de configurar o Firebase!

---

## 🌐 Configuração do Firebase Realtime Database (Multiplayer Online Entre Celulares)

Para que amigos em celulares diferentes em qualquer lugar do mundo (conectados via 4G ou Wi-Fi) possam jogar juntos, o projeto utiliza o **Firebase Realtime Database** (plano Spark **100% gratuito**, sem necessidade de cartão de crédito).

### Passo a passo rápido (leva menos de 3 minutos):

1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e faça login com sua conta Google.
2. Clique em **"Adicionar projeto"** (ou "Criar projeto") e dê um nome (ex: `impostor-fc`).
3. No menu lateral esquerdo, vá em **Criação (Build)** ➔ **Realtime Database**.
4. Clique em **"Criar banco de dados"**, escolha uma região (ex: `Estados Unidos us-central1`) e avance.
5. Selecione **"Iniciar no modo de teste"** (isso permite que seus amigos leiam e escrevam o estado da sala sem login complexo):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
6. Vá nas **Configurações do Projeto** (ícone de engrenagem no topo esquerdo) ➔ aba **Geral**.
7. Na seção *"Seus aplicativos"*, clique no ícone da Web (`</>`), digite um apelido para o app e clique em registrar.
8. Copie as credenciais fornecidas e crie um arquivo chamado `.env.local` na raiz do projeto com o seguinte formato:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://seu-projeto-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

---

## ☁️ Como Fazer Deploy na Vercel

O projeto foi construído sob medida para a Vercel, sem servidores persistentes pesados.

### Opção 1: Pelo Painel Web da Vercel (Recomendado)
1. Suba esta pasta para um repositório no seu **GitHub** ou **GitLab**.
2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New"** ➔ **"Project"**.
3. Importe o repositório do `impostor-fc-multiplayer`.
4. Em **Environment Variables**, adicione as mesmas variáveis do seu `.env.local` (as chaves do Firebase listadas acima).
5. Clique em **"Deploy"**.
6. Em cerca de 1 minuto, a Vercel gerará o link da sua aplicação (ex: `https://impostor-fc.vercel.app`).
7. Compartilhe o link com a galera e joguem à vontade!

### Opção 2: Pela CLI da Vercel
```bash
npm install -g vercel
vercel
```

---

## 📝 Como Adicionar Novos Jogadores Todo Mês (Sem Precisar de Servidor)

Você pode enriquecer a base com novas contratações do Transfermarkt, artilheiros do SofaScore ou revelações do mês de forma extremamente simples:

1. Abra o arquivo [src/data/curatedPlayers.ts](src/data/curatedPlayers.ts).
2. Adicione seu novo jogador à lista `CURATED_PLAYERS` seguindo este modelo:

```typescript
{
  id: 'estevao-willian',
  name: 'Estêvão',
  nationality: 'Brasil',
  flag: '🇧🇷',
  position: 'Atacante',
  difficulty: 'facil',
  categories: ['brasileiros', 'internacionais'],
  clubs: ['Palmeiras', 'Chelsea'],
  clue: 'Ponta canhoto de arrancada desconcertante revelado no futebol paulista que quebrou recordes de participações em gols antes dos 18 anos.',
  statsHighlight: 'Transfermarkt: Mais de 20 participações em gols na Série A aos 17 anos e venda milionária para a Premier League.',
  isPro: true,
},
```

Pronto! Ao salvar o arquivo, o jogador passará a ser sorteado imediatamente nas rodadas, integrado ao sistema anti-repetição.

---

## ⚽ Bom Jogo!
Divirta-se descobrindo quem é o impostor do futebol no seu grupo de amigos!
