
"use client";

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Upload, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SavedSession } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from './ui/skeleton';

interface SessionManagerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  sessions: SavedSession[];
  onSave: (name: string) => void;
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
}

export function SessionManager({
  isOpen,
  onOpenChange,
  sessions,
  onSave,
  onLoad,
  onDelete,
}: SessionManagerProps) {
  const { t, ready } = useTranslation();
  const [sessionName, setSessionName] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSave = () => {
    if (sessionName.trim()) {
      onSave(sessionName.trim());
      setSessionName('');
    }
  };

  if (!isClient || !ready) {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col">
                 <SheetHeader>
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                </SheetHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 flex-grow" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </div>
                </div>
                <div className="flex-grow flex flex-col min-h-0">
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-24 flex-grow" />
                </div>
            </SheetContent>
        </Sheet>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{t('sessionManagerTitle')}</SheetTitle>
          <SheetDescription>{t('sessionManagerDescription')}</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="session-name">{t('sessionName')}</Label>
            <div className="flex gap-2">
              <Input
                id="session-name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder={t('sessionNamePlaceholder')}
              />
              <Button onClick={handleSave} disabled={!sessionName.trim()}>
                <Upload className="mr-2 h-4 w-4" /> {t('save')}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-grow flex flex-col min-h-0">
          <h3 className="text-lg font-semibold mb-2">{t('savedSessions')}</h3>
          <ScrollArea className="flex-grow">
            <div className="space-y-2 pr-4">
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t('noSavedSessions')}</p>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.name}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex-grow">
                      <p className="font-medium">{session.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.savedAt).toLocaleString('pl-PL')}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onLoad(session.name)} aria-label={t('load')}>
                        <Download className="h-4 w-4" />
                      </Button>
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label={t('delete')}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('confirmDeleteTitle')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('confirmDeleteDescription', { sessionName: session.name })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDelete(session.name)} className="bg-destructive hover:bg-destructive/90">
                                {t('confirm')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
