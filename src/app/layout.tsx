import type { Metadata } from 'next';
import './global.css';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://game-item-market.vercel.app';

const socialPreviewImage = `${siteUrl}/social-preview-v2.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Game Item Market | Item in vendita',
    template: '%s | Game Item Market',
  },

  description:
    'Catalogo item aggiornato: scegli l’item, guarda i dettagli e lascia un’offerta senza registrarti.',

  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: siteUrl,
    siteName: 'Game Item Market',
    title: 'Game Item Market | Item in vendita',
    description:
      'Catalogo item aggiornato: scegli l’item, guarda i dettagli e lascia un’offerta senza registrarti.',
    images: [
      {
        url: socialPreviewImage,
        width: 1200,
        height: 630,
        alt: 'Game Item Market - item in vendita',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Game Item Market | Item in vendita',
    description:
      'Sfoglia gli item disponibili e fai la tua offerta senza registrarti.',
    images: [socialPreviewImage],
  },

  robots: {
    index: true,
    follow: true,
  },
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