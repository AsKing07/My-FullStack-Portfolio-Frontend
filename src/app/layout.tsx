import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/providers/theme_provider";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"
import { headers } from "next/headers";

import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import Script from "next/script";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://charbelsnn.com'),

  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  other: {
    'theme-color': '#0ea5e9',
    'color-scheme': 'light dark',
  },
};

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const headersList = await headers();
  const locale = headersList.get('X-NEXT-INTL-LOCALE') ?? 'en';

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Theme className="dark:bg-slate-950 bg-slate-50">
            {children}
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
