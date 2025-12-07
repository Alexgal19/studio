
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Define an interface for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Extend the Window interface to include our custom property
declare global {
  interface Window {
    pwaInstallHandler: {
      event?: BeforeInstallPromptEvent;
    };
  }
}

interface PWAInstallerContextType {
    installPrompt: BeforeInstallPromptEvent | null;
    handleInstallClick: () => void;
}

const PWAInstallerContext = createContext<PWAInstallerContextType | null>(null);

export const usePWAInstaller = () => {
    const context = useContext(PWAInstallerContext);
    if (!context) {
        throw new Error("usePWAInstaller must be used within a PWAInstaller provider");
    }
    return context;
}

export const PWAInstaller = ({ children }: { children: React.ReactNode }) => {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    const handleInstallPrompt = useCallback((e: Event) => {
        e.preventDefault();
        // Stash the event so it can be triggered later.
        setInstallPrompt(e as BeforeInstallPromptEvent);
        // Update the global handler for other potential uses, though direct state is better.
        if (window.pwaInstallHandler) {
          window.pwaInstallHandler.event = e as BeforeInstallPromptEvent;
        }
    }, []);


    useEffect(() => {
        window.addEventListener('beforeinstallprompt', handleInstallPrompt);

        // Also listen for the appinstalled event to clear the prompt
        window.addEventListener('appinstalled', () => {
            setInstallPrompt(null);
            if (window.pwaInstallHandler) {
              window.pwaInstallHandler.event = undefined;
            }
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
        };
    }, [handleInstallPrompt]);

    const handleInstallClick = () => {
        if (!installPrompt) return;

        installPrompt.prompt();
        installPrompt.userChoice.then(() => {
            setInstallPrompt(null);
            if (window.pwaInstallHandler) {
              window.pwaInstallHandler.event = undefined;
            }
        });
    };

    return (
        <PWAInstallerContext.Provider value={{ installPrompt, handleInstallClick }}>
            {children}
        </PWAInstallerContext.Provider>
    );
};
