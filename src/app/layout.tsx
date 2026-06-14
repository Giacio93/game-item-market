import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'Game Item Market',
  description: 'Marketplace pubblico per offerte su item di gioco.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}