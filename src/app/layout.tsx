import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/providers/theme_provider";
import { Toaster } from "sonner";
import ClientLayout from "@/app/ClientLayout";

import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import Script from "next/script";

// PAS de usePathname ici, ni de "use client"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {

  icons: {
    icon: '/logo.png',
  },
  title: {
    default: 'Charbel SONON | Portfolio - Développeur Full Stack',
    template: '%s | Portfolio'
  },
  description: 'Portfolio de Charbel SONON? développeur full stack spécialisé en React, Next.js, Node.js et TypeScript.',
  keywords: ['portfolio', 'développeur', 'full stack', 'react', 'nextjs', 'nodejs', 'typescript'],
  authors: [{ name: 'Charbel SONON' }],
  creator: 'Charbel SONON',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Charbel SONON | Portfolio - Développeur Full Stack',
    description: 'Portfolio de développeur full stack spécialisé en React, Next.js, Node.js et TypeScript.',
    siteName: 'Portfolio - Charbel SONON',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio - Développeur Full Stack',
    description: 'Portfolio de Charbel SONON, développeur full stack spécialisé en React, Next.js, Node.js et TypeScript.',
    creator: '@charbel_asking',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Theme className="dark:bg-slate-950 bg-slate-50">
            <ClientLayout> {children}</ClientLayout>
            <Toaster richColors position="top-right" />
          </Theme>
        </ThemeProvider>
        <Script
          src={process.env.NEXT_PUBLIC_FONT_AWESOME_KIT_URL}
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}

