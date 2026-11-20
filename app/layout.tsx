import type {Metadata} from 'next';
import {Inter, Plus_Jakarta_Sans} from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Zapline — Trade Smarter, Faster, Safer',
  description:
    'Zapline — The first fully integrated on-chain trading experience. Trade directly from your favorite DeFi apps and terminals.',
  openGraph: {
    title: 'Zapline — Trade Smarter, Faster, Safer',
    description:
      'Zapline — The first fully integrated on-chain trading experience. Trade directly from your favorite DeFi apps and terminals.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zapline — Trade Smarter, Faster, Safer',
    description:
      'Zapline — The first fully integrated on-chain trading experience. Trade directly from your favorite DeFi apps and terminals.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} dark`}>
      <body className="bg-black text-[#f7f7f8] antialiased selection:bg-[#9312ff]/40 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
