
"use client";

import { TempWorkCalculator } from '@/components/temp-work-calculator';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';

export default function Home() {
  const { t, ready } = useTranslation();

  if (!ready) {
    return <Card className="overflow-hidden shadow-lg p-6">{t('loadingData')}</Card>;
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center mb-8">
          {t('appTitle')}
        </h1>
        <TempWorkCalculator />
      </div>
    </main>
  );
}
