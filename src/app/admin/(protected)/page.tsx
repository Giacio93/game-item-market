import Link from 'next/link';
import { createClient } from '@/src/lib/supabase/server';
import { requireAdmin } from '@/src/lib/auth/admin';
import { formatCurrency } from '@/src/lib/utils/format-currency';
import { Card } from '@/src/components/ui/Card';

export const dynamic = 'force-dynamic';

type DashboardItem = {
  id: string;
  title: string;
  price: number | string;
  status: 'AVAILABLE' | 'NEGOTIATION' | 'SOLD';
};

type DashboardOffer = {
  id: string;
  item_id: string;
  amount: number | string;
  status: 'NEW' | 'NEGOTIATION' | 'ACCEPTED' | 'REJECTED';
};

type SiteVisit = {
  visitor_id: string;
};

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function getTotalItemsValue(items: DashboardItem[]) {
  return items
    .filter((item) => item.status !== 'SOLD')
    .reduce((total, item) => total + toNumber(item.price), 0);
}

function getBestOffersTotal(offers: DashboardOffer[]) {
  const bestOfferByItem = new Map<string, number>();

  offers
    .filter((offer) => offer.status !== 'REJECTED')
    .forEach((offer) => {
      const amount = toNumber(offer.amount);
      const currentBestOffer = bestOfferByItem.get(offer.item_id) ?? 0;

      if (amount > currentBestOffer) {
        bestOfferByItem.set(offer.item_id, amount);
      }
    });

  return Array.from(bestOfferByItem.values()).reduce(
    (total, amount) => total + amount,
    0,
  );
}

function getItemsWithOffers(offers: DashboardOffer[]) {
  const itemIds = new Set(
    offers
      .filter((offer) => offer.status !== 'REJECTED')
      .map((offer) => offer.item_id),
  );

  return itemIds.size;
}

function getUniqueVisitors(visits: SiteVisit[]) {
  return new Set(visits.map((visit) => visit.visitor_id)).size;
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <Card className="p-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="text-3xl font-black text-white">{value}</p>

        <p className="text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  await requireAdmin();

  const supabase = await createClient();

  const [itemsResult, offersResult, visitsResult] = await Promise.all([
    supabase
      .from('items')
      .select('id, title, price, status')
      .order('created_at', { ascending: false }),

    supabase
      .from('offers')
      .select('id, item_id, amount, status')
      .order('created_at', { ascending: false }),

    supabase.from('site_visits').select('visitor_id'),
  ]);

  if (itemsResult.error) {
    console.error('Errore dashboard items:', itemsResult.error);
    throw new Error(itemsResult.error.message);
  }

  if (offersResult.error) {
    console.error('Errore dashboard offers:', offersResult.error);
    throw new Error(offersResult.error.message);
  }

  if (visitsResult.error) {
    console.error('Errore dashboard visits:', visitsResult.error);
    throw new Error(visitsResult.error.message);
  }

  const items = (itemsResult.data ?? []) as DashboardItem[];
  const offers = (offersResult.data ?? []) as DashboardOffer[];
  const visits = (visitsResult.data ?? []) as SiteVisit[];

  const availableItems = items.filter((item) => item.status !== 'SOLD');
  const uniqueVisitors = getUniqueVisitors(visits);
  const totalItemsValue = getTotalItemsValue(items);
  const bestOffersTotal = getBestOffersTotal(offers);
  const itemsWithOffers = getItemsWithOffers(offers);

  return (
    <main className="space-y-8">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
            Dashboard admin
          </p>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Panoramica mercato
          </h1>

          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Qui trovi un riepilogo veloce del sito: visite, valore degli item e
            andamento delle offerte ricevute.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/items/new"
            className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-400"
          >
            Nuovo item
          </Link>

          <Link
            href="/admin/offers"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
          >
            Vedi offerte
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Visitatori unici"
          value={String(uniqueVisitors)}
          description="Stima basata sui browser che hanno visitato il sito pubblico."
        />

        <StatCard
          label="Valore articoli in vendita"
          value={formatCurrency(totalItemsValue)}
          description={`${availableItems.length} item ancora disponibili o in trattativa.`}
        />

        <StatCard
          label="Valore migliori offerte"
          value={formatCurrency(bestOffersTotal)}
          description="Somma della migliore offerta ricevuta per ogni item."
        />

        <StatCard
          label="Item con offerte"
          value={String(itemsWithOffers)}
          description="Numero di item che hanno ricevuto almeno una proposta valida."
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-white">
                Stato catalogo
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Riepilogo veloce degli item caricati.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <p className="text-sm font-semibold text-emerald-200">
                  Disponibili
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {
                    items.filter((item) => item.status === 'AVAILABLE')
                      .length
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                <p className="text-sm font-semibold text-amber-200">
                  In trattativa
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {
                    items.filter((item) => item.status === 'NEGOTIATION')
                      .length
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-slate-500/20 bg-slate-500/10 p-4">
                <p className="text-sm font-semibold text-slate-300">
                  Venduti
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {items.filter((item) => item.status === 'SOLD').length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-white">
                Offerte ricevute
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Totale proposte arrivate dal sito.
              </p>
            </div>

            <p className="text-5xl font-black text-white">
              {offers.length}
            </p>

            <Link
              href="/admin/offers"
              className="inline-flex rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Gestisci offerte
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}