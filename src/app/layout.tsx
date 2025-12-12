
"use client";

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PWAInstaller } from '@/components/pwa-installer';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <title>TempWork Limit Calculator</title>
        <meta name="description" content="Kalkulator Limitu Pracy Tymczasowej 18/36" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#4CAF50" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <script src="https://www.google.com/recaptcha/enterprise.js?render=6LcgQCksAAAAAG8tVwKA82fTPvBvvyZAyZK_u7Pg"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('SW registered: ', registration);
                  }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="font-body antialiased">
        <I18nextProvider i18n={i18n}>
          <PWAInstaller>
            {children}
          </PWAInstaller>
        </I18nextProvider>
        <Toaster />
      </body>
    </html>
  );
}
