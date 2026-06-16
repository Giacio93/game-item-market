import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/server';
import { formatCurrency } from '@/src/lib/utils/format-currency';
import { Card } from '@/src/components/ui/Card';
import { ItemStatusBadge } from '@/src/components/public/ItemStatusBadge';
import { OfferForm } from '@/src/components/public/OfferForm';
import {
  ITEM_RACE_LABEL,
  ITEM_TYPE_LABEL,
  type Item,
} from '@/src/lib/types/items';

export const dynamic = 'force-dynamic';

type ItemDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function getItem(idOrSlug: string) {
  const supabase = await createClient();

  const column = uuidRegex.test(idOrSlug) ? 'id' : 'slug';

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq(column, idOrSlug)
    .maybeSingle();

  if (error) {
    console.error('Errore Supabase getItem:', error);
    return null;
  }

  return data as Item | null;
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    notFound();
  }

  const hasHighestOffer =
    item.highest_offer_price !== null &&
    item.highest_offer_price !== undefined &&
    Number(item.highest_offer_price) > 0;
  const raceLabels = item.races?.map((race) => ITEM_RACE_LABEL[race]) ?? [];
  const typeLabel = ITEM_TYPE_LABEL[item.item_type];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/items"
          className="text-sm font-semibold text-blue-300 transition hover:text-blue-200"
        >
          ← Torna agli item
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <Card className="overflow-hidden">
            <div className="bg-slate-900">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-6 text-center text-slate-500">
                  Nessuna immagine disponibile
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-5">
              <div className="flex flex-wrap justify-between">
                <ItemStatusBadge status={item.status} />
                <div className="flex flex-wrap gap-2">
                  {typeLabel && (
                    <span className="rounded-full border border-violet-400/40 bg-violet-400/15 px-3 py-1 text-xs font-bold text-violet-100 shadow-sm shadow-violet-950/30">
                      {typeLabel}
                    </span>
                  )}

                  {raceLabels.length > 0 ? (
                    raceLabels.map((race) => (
                      <span
                        key={race}
                        className="rounded-full border border-sky-400/40 bg-sky-400/15 px-3 py-1 text-xs font-bold text-sky-100 shadow-sm shadow-sky-950/30"
                      >
                        {race}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full border border-sky-400/40 bg-sky-400/15 px-3 py-1 text-xs font-bold text-sky-100 shadow-sm shadow-sky-950/30">
                      Tutte le razze
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {item.title}
                </h1>

                <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-300">
                  {item.description}
                </p>
              </div>

              {hasHighestOffer ? (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-200">
                    Offerta più alta ricevuta
                  </p>

                  <p className="mt-2 text-3xl font-black text-white">
                    {formatCurrency(Number(item.highest_offer_price))}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-amber-100/80">
                    Questa è l’offerta più alta che ho ricevuto finora. Non è
                    ancora stata accettata: se l’item ti interessa, puoi
                    comunque inviare una proposta migliore.
                  </p>
                </div>
              ) : null}

              <div className="rounded-2xl bg-slate-950/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Prezzo richiesto
                </p>
                <p className="mt-1 text-3xl font-black text-white">
                  {formatCurrency(Number(item.price))}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <aside>
          <Card className="sticky top-6 p-6">
            <div className="mb-6 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
                Fai la tua proposta
              </p>

              <h2 className="text-2xl font-black text-white">
                Invia un’offerta
              </h2>

              <p className="text-sm leading-6 text-slate-400">
                Non serve registrarsi. Lascia un contatto Discord o WhatsApp:
                ti ricontatterò io se l’offerta è interessante.
              </p>
            </div>

            <OfferForm itemId={item.id} itemStatus={item.status} />
          </Card>
        </aside>
      </div>
    </main>
  );
}