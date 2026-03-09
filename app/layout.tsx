import type { Metadata } from 'next';
import { DM_Serif_Display, Cormorant_Garamond, Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import ConditionalNavbar from '@/components/ConditionalNavbar';
import CursorGlow from '@/components/CursorGlow';
import ScrollReveal from '@/components/ScrollReveal';
import ClarityScript from '@/components/ClarityScript';
import FeedbackWidget from '@/components/FeedbackWidget';
import { AuthProvider } from '@/context/AuthContext';
import PostHogProvider from '@/components/PostHogProvider';

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-accent',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'NIVARA — Skin Health, Reimagined',
  description: 'NIVARA — Precision skin health technology, indigenously crafted in India.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${cormorant.variable} ${inter.variable}`}>
      <body>
        <PostHogProvider>
          <AuthProvider>
            <ConditionalNavbar />
            {children}
            <CursorGlow />
            <ScrollReveal />
            <ClarityScript />
            <FeedbackWidget />
          </AuthProvider>
        </PostHogProvider>
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-7PDC21ZWW5" />
    </html>
  );
}
