import Link from 'next/link';
import { Card } from '@/src/components/ui/Card';
import { createClient } from '@/src/lib/supabase/server';
import { requireAdmin } from '@/src/lib/auth/admin';

export const dynamic = 'force-dynamic';

async function getDashboardStats() {
  const supabase = await createClient();

  const [
    itemsResult,
    offersResult,
    newOffersResult,
    soldItemsResult,
  ] = await Promise.all([
    supabase.from('items').select('*', { count: 'exact', head: true }),
    supabase.from('offers').select('*', { count: 'exact', head: true }),
    supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'NEW'),
    supabase
      .from('items')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'SOLD'),
  ]);

  return {
    totalItems: itemsResult.count ?? 0,
    totalOffers: offersResult.count ?? 0,
    newOffers: newOffersResult.count ?? 0,
    soldItems: soldItemsResult.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const { admin } = await requireAdmin();
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
            Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-white">
            Ciao, {admin.email}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Da qui puoi gestire item, immagini, prezzi, stati e offerte
            ricevute dagli utenti pubblici.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/items/new"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            + Nuovo item
          </Link>

          <Link
            href="/admin/offers"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Vedi offerte
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-400">Item totali</p>
          <p className="mt-3 text-4xl font-black text-white">
            {stats.totalItems}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-400">
            Offerte totali
          </p>
          <p className="mt-3 text-4xl font-black text-white">
            {stats.totalOffers}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-400">
            Offerte nuove
          </p>
          <p className="mt-3 text-4xl font-black text-white">
            {stats.newOffers}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-400">Item venduti</p>
          <p className="mt-3 text-4xl font-black text-white">
            {stats.soldItems}
          </p>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-black text-white">Gestione item</h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Crea nuovi item, modifica prezzo, descrizione, immagine e stato.
          </p>

          <Link
            href="/admin/items"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Vai agli item
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-white">Gestione offerte</h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Visualizza le offerte ricevute e aggiorna lo stato: nuova, in
            trattativa, accettata o rifiutata.
          </p>

          <Link
            href="/admin/offers"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            Vai alle offerte
          </Link>
        </Card>
      </section>
    </div>
  );
}