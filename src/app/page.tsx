import { TempWorkCalculator } from '@/components/temp-work-calculator';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center mb-8">
          Kalkulator Limitu Pracy Tymczasowej 18/36
        </h1>
        <TempWorkCalculator />
      </div>
    </main>
  );
}
