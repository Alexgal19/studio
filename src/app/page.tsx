
"use client";

import { TempWorkCalculator } from '@/components/temp-work-calculator';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { t, ready } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !ready) {
    return (
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Card className="overflow-hidden shadow-lg p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-96 w-full" />
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <>
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center mb-8">
            {t('appTitle')}
          </h1>
          <TempWorkCalculator />
        </>
      </div>
    </main>
  );
}
