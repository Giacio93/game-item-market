import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
          404
        </p>

        <h1 className="mt-3 text-3xl font-black text-white">
          Pagina non trovata
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          L’item o la pagina che stai cercando non esiste più oppure è stata
          spostata.
        </p>

        <Link
          href="/items"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
        >
          Vai agli item
        </Link>
      </div>
    </main>
  );
}