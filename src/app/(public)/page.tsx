import Link from 'next/link';
import { ItemGrid } from '@/src/components/public/ItemGrid';
import { Item } from '@/src/lib/types/items';
import { createClient } from '@/src/lib/supabase/server';

export const dynamic = 'force-dynamic';

async function getLatestItems() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    return [];
  }

  return (data ?? []) as Item[];
}

export default async function HomePage() {
  const latestItems = await getLatestItems();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-200">
            Marketplace item privato
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Vendi e ricevi offerte sui tuoi item di gioco.
            </h1>

            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Guarda gli item disponibili, apri il dettaglio e invia una
              proposta. Non serve registrarsi: basta lasciare nickname, contatto
              Discord o Telegram e importo dell’offerta.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/items"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Vedi tutti gli item
            </Link>

            <a
              href="#latest-items"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Ultimi item
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30">
          <div className="rounded-2xl bg-slate-950/70 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Come funziona
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-white/[0.06] p-4">
                <p className="font-bold text-white">1. Scegli un item</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Consulta prezzo, stato, immagine e descrizione.
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.06] p-4">
                <p className="font-bold text-white">2. Fai un’offerta</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Inserisci nickname, contatto e importo.
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.06] p-4">
                <p className="font-bold text-white">3. Ti ricontatto io</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Nessun pagamento online e nessuna registrazione.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="latest-items" className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
              Ultimi inserimenti
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">
              Item più recenti
            </h2>
          </div>

          <Link
            href="/items"
            className="text-sm font-semibold text-blue-300 transition hover:text-blue-200"
          >
            Vedi lista completa →
          </Link>
        </div>

        <ItemGrid items={latestItems} />
      </section>
    </main>
  );
}