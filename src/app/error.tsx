'use client';

import { Button } from '@/src/components/ui/Button';

export default function GlobalErrorPage({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  console.error(error);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center shadow-2xl shadow-black/30">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-300">
          Errore
        </p>

        <h1 className="mt-3 text-3xl font-black text-white">
          Qualcosa è andato storto
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Si è verificato un errore imprevisto. Riprova tra qualche secondo.
        </p>

        <Button type="button" className="mt-6" onClick={() => reset()}>
          Riprova
        </Button>
      </section>
    </main>
  );
}