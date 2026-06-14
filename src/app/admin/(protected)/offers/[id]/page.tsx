import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/server';
import { OfferWithItem } from '@/src/lib/types/offer';
import { Card } from '@/src/components/ui/Card';
import { OfferStatusBadge } from '@/src/components/admin/OfferStatusBadge';
import { formatDateTime } from '@/src/lib/utils/format-date';
import { formatCurrency } from '@/src/lib/utils/format-currency';
import { OfferStatusForm } from '@/src/components/admin/OfferStatusForm';
import { ItemStatusBadge } from '@/src/components/public/ItemStatusBadge';

export const dynamic = 'force-dynamic';

type OfferDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getOffer(id: string) {
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
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Errore getOffer:', error);

    return null;
  }

  return data as OfferWithItem | null;
}

export default async function OfferDetailPage({
  params,
}: OfferDetailPageProps) {
  const { id } = await params;
  const offer = await getOffer(id);

  if (!offer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/offers"
          className="text-sm font-semibold text-blue-300 transition hover:text-blue-200"
        >
          ← Torna alle offerte
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-300">
          Dettaglio offerta
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          Offerta di {offer.nickname}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Ricevuta il {formatDateTime(offer.created_at)}.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Stato offerta
                </p>

                <div className="mt-3">
                  <OfferStatusBadge status={offer.status} />
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Importo offerto
                </p>

                <p className="mt-2 text-4xl font-black text-white">
                  {formatCurrency(Number(offer.amount))}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-black text-white">
              Dati contatto
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Nickname / nome
                </p>

                <p className="mt-2 text-lg font-bold text-white">
                  {offer.nickname}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Discord / WhatsApp
                </p>

                <p className="mt-2 break-words text-lg font-bold text-white">
                  {offer.contact}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-black text-white">
              Messaggio
            </h2>

            {offer.message ? (
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-300">
                {offer.message}
              </p>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Nessun messaggio inserito.
              </p>
            )}
          </Card>
        </section>

        <aside className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-black text-white">
              Cambia stato
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Aggiorna lo stato dell’offerta in base alla trattativa.
            </p>

            <div className="mt-5">
              <OfferStatusForm
                offerId={offer.id}
                currentStatus={offer.status}
              />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="bg-slate-950">
              {offer.item?.image_url ? (
                <img
                  src={offer.item.image_url}
                  alt={offer.item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-slate-500">
                  Nessuna immagine item
                </div>
              )}
            </div>

            <div className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                {offer.item ? (
                  <ItemStatusBadge status={offer.item.status} />
                ) : null}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Item collegato
                </p>

                <h2 className="mt-2 text-xl font-black text-white">
                  {offer.item?.title ?? 'Item eliminato'}
                </h2>
              </div>

              {offer.item ? (
                <>
                  <p className="text-lg font-black text-white">
                    Prezzo richiesto:{' '}
                    {formatCurrency(Number(offer.item.price))}
                  </p>

                  <div className="grid gap-2">
                    <Link
                      href={`/items/${offer.item.slug}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                    >
                      Vedi item pubblico
                    </Link>

                    <Link
                      href={`/admin/items/${offer.item.id}/edit`}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
                    >
                      Modifica item
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}