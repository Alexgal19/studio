import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PWAInstaller } from '@/components/pwa-installer';

export const metadata: Metadata = {
  title: 'TempWork Limit Calculator',
  description: 'Kalkulator Limitu Pracy Tymczasowej 18/36',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#5ea162" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.pwaInstallHandler = {};
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.pwaInstallHandler.event = e;
                document.body.classList.add('install-ready');
                window.dispatchEvent(new CustomEvent('pwa-install-ready'));
              });

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
        <PWAInstaller>
          {children}
        </PWAInstaller>
        <Toaster />
      </body>
    </html>
  );
}
