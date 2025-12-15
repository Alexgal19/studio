import { TempWorkCalculator } from '@/components/temp-work-calculator';

export default async function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary text-center flex-grow">
            Kalkulator Limitu Pracy Tymczasowej
          </h1>
        </div>
        <TempWorkCalculator />
      </div>
    </main>
  );
}
