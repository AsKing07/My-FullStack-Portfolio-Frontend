import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/providers/theme_provider";
import { Toaster } from "sonner";
import ClientLayout from "@/app/ClientLayout";
import { Analytics } from "@vercel/analytics/next"


import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import Script from "next/script";

// PAS de usePathname ici, ni de "use client"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://charbelsnn.com'),
  
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  
  title: {
    default: 'Charbel SONON | Portfolio - Développeur Full Stack',
    template: '%s | Charbel SONON'
  },
  
  description: 'Portfolio de Charbel SONON, développeur full stack spécialisé en Angular, React, Next.js, Node.js, Java, TypeScript et plein d\' autres technologies modernes. Découvrez mes projets, expériences et compétences.',
  
  keywords: [
    'charbel sonon', 'portfolio', 'développeur full stack', 'développeur web',
    'react', 'nextjs', 'angular', 'nodejs', 'typescript', 'javascript', 'java',
    'web development', 'frontend', 'backend', 'freelance', 'développeur france',
    'applications web', 'sites web responsives', 'api rest', 'mongodb', 'mysql'
  ],
  
  authors: [{ name: 'Charbel SONON', url: process.env.NEXT_PUBLIC_APP_URL }],
  creator: 'Charbel SONON',
  publisher: 'Charbel SONON',
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Charbel SONON | Portfolio - Développeur Full Stack',
    description: 'Portfolio de Charbel SONON, développeur full stack spécialisé en technologies web modernes. Projets, expériences et expertise en développement.',
    siteName: 'Portfolio - Charbel SONON',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Charbel SONON - Portfolio Développeur Full Stack',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Charbel SONON | Portfolio - Développeur Full Stack',
    description: 'Portfolio de Charbel SONON, développeur full stack spécialisé en React, Next.js, Node.js et TypeScript.',
    creator: '@charbel_sonon',
    images: ['/logo.png'],
  },
  
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    // Ajouter vos codes de vérification ici
    // google: 'votre-code-google',
    // yandex: 'votre-code-yandex',
    // yahoo: 'votre-code-yahoo',
    // other: {
    //   'msvalidate.01': 'votre-code-bing',
    // },
  },
  
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
  
  other: {
    'theme-color': '#0ea5e9',
    'color-scheme': 'light dark',
  },
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
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
              <Analytics />
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

