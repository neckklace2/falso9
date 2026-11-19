import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Impostor FC Multiplayer | O Jogo da Galera',
  description: 'Descubra quem é o impostor do futebol em tempo real com seus amigos! Cada um no seu celular.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Impostor FC',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0a0f18',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased selection:bg-turf-500 selection:text-white">
        <div className="flex flex-col min-h-[100dvh] max-w-md mx-auto relative shadow-2xl bg-pitch-900 border-x border-pitch-800">
          {children}
        </div>
      </body>
    </html>
  );
}
