import Link from 'next/link';
import { createClient } from '@/src/lib/supabase/server';
import { Card } from '@/src/components/ui/Card';
import { OfferWithItem } from '@/src/lib/types/offer';
import { OfferStatusBadge } from '@/src/components/admin/OfferStatusBadge';
import { formatDateTime } from '@/src/lib/utils/format-date';
import { formatCurrency } from '@/src/lib/utils/format-currency';
import { OfferStatusForm } from '@/src/components/admin/OfferStatusForm';


export const dynamic = 'force-dynamic';

async function getOffers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('offers')
    .select(
      `
      *,
      item:items (
        id,
        title,
        slug,
        image_url,
        status,
        price
      )
    `,
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Errore getOffers:', error);

    return [];
  }

  return (data ?? []) as OfferWithItem[];
}

export default async function AdminOffersPage() {
  const offers = await getOffers();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
          Offerte
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          Offerte ricevute
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Visualizza le offerte inviate dagli utenti e aggiorna lo stato della
          trattativa.
        </p>
      </div>

      {offers.length === 0 ? (
        <Card className="p-6">
          <p className="text-slate-300">
            Non hai ancora ricevuto offerte.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden">
              <div className="grid gap-4 p-4 lg:grid-cols-[120px_1fr_280px] lg:items-center">
                <div className="overflow-hidden rounded-xl bg-slate-950">
                  {offer.item?.image_url ? (
                    <img
                      src={offer.item.image_url}
                      alt={offer.item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-slate-500">
                      Nessuna immagine
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <OfferStatusBadge status={offer.status} />

                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                      {formatDateTime(offer.created_at)}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-white">
                      {offer.item?.title ?? 'Item eliminato'}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Offerta da{' '}
                      <span className="font-semibold text-white">
                        {offer.nickname}
                      </span>
                      {' '}— contatto:{' '}
                      <span className="font-semibold text-white">
                        {offer.contact}
                      </span>
                    </p>
                  </div>

                  <p className="text-2xl font-black text-white">
                    {formatCurrency(Number(offer.amount))}
                  </p>

                  {offer.message ? (
                    <p className="line-clamp-2 text-sm leading-6 text-slate-400">
                      “{offer.message}”
                    </p>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <OfferStatusForm
                    offerId={offer.id}
                    currentStatus={offer.status}
                    compact
                  />

                  <div className="grid gap-2">
                    <Link
                      href={`/admin/offers/${offer.id}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
                    >
                      Dettaglio
                    </Link>

                    {offer.item ? (
                      <Link
                        href={`/items/${offer.item.slug}`}
                        className="inline-flex min-h-10 items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                      >
                        Vedi item
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}