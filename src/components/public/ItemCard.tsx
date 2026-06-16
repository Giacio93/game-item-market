import Link from 'next/link';
import {
  ITEM_RACE_LABEL,
  ITEM_TYPE_LABEL,
  type Item,
} from '@/src/lib/types/items';
import { formatCurrency } from '@/src/lib/utils/format-currency';
import { Card } from '@/src/components/ui/Card';
import { ItemStatusBadge } from './ItemStatusBadge';

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  const hasHighestOffer =
    item.highest_offer_price !== null &&
    item.highest_offer_price !== undefined &&
    Number(item.highest_offer_price) > 0;

  const raceLabels = item.races?.map((race) => ITEM_RACE_LABEL[race]) ?? [];

  return (
    <Card className="group h-full overflow-hidden">
      <Link href={`/items/${item.slug}`} className="block h-full">
        {/* MOBILE: card orizzontale compatta */}
        <article className="flex gap-3 p-2 sm:hidden">
          <div className="h-full w-28 shrink-0 overflow-hidden rounded-xl bg-slate-900">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-2 text-center text-[11px] text-slate-500">
                Nessuna immagine
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-1 scale-[0.78] origin-left">
              <ItemStatusBadge status={item.status} />
            </div>

            <h3 className="line-clamp-2 text-sm font-black leading-5 text-white">
              {item.title}
            </h3>

            <div className="mt-1 flex flex-wrap gap-1">
              <span className="rounded-full border border-violet-400/40 bg-violet-400/15 px-2 py-0.5 text-[10px] font-bold text-violet-100">
                {ITEM_TYPE_LABEL[item.item_type]}
              </span>

              {raceLabels.length > 0 ? (
                raceLabels.slice(0, 1).map((race) => (
                  <span
                    key={race}
                    className="rounded-full border border-emerald-400/40 bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold text-emerald-100"
                  >
                    {race}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-sky-400/40 bg-sky-400/15 px-2 py-0.5 text-[10px] font-bold text-sky-100">
                  Tutte
                </span>
              )}

              {raceLabels.length > 1 ? (
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  +{raceLabels.length - 1}
                </span>
              ) : null}
            </div>

            <p className="line-clamp-2 text-xs leading-6 text-slate-400">
                {item.description}
              </p>

            <div className="mt-auto pt-2">
              {hasHighestOffer ? (
                <div className="mb-1 rounded-lg border border-amber-400/20 bg-amber-400/10 px-2 py-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-amber-200">
                    Offerta più alta
                  </p>
                  <p className="text-sm font-black text-white">
                    {formatCurrency(Number(item.highest_offer_price))}
                  </p>
                </div>
              ) : null}

              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    Richiesto
                  </p>
                  <p className="text-base font-black text-white">
                    {formatCurrency(Number(item.price))}
                  </p>
                </div>

                <span className="rounded-lg bg-blue-500 px-2.5 py-1.5 text-xs font-bold text-white">
                  Offerta
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* DESKTOP/TABLET: card verticale come prima */}
        <article className="hidden h-full flex-col sm:flex">
          <div className="aspect-[4/3] overflow-hidden bg-slate-900">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-slate-500">
                Nessuna immagine disponibile
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col space-y-4 p-5">
            <ItemStatusBadge status={item.status} />

            <div className="space-y-2">
              <h3 className="line-clamp-2 text-lg font-bold text-white">
                {item.title}
              </h3>

              <p className="line-clamp-2 text-sm leading-6 text-slate-400">
                {item.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-violet-400/40 bg-violet-400/15 px-3 py-1 text-xs font-bold text-violet-100 shadow-sm shadow-violet-950/30">
                {ITEM_TYPE_LABEL[item.item_type]}
              </span>

              {raceLabels.length > 0 ? (
                raceLabels.map((race) => (
                  <span
                    key={race}
                    className="rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-100 shadow-sm shadow-emerald-950/30"
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

            <div className="mt-auto space-y-4 pt-2">
              {hasHighestOffer ? (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-200">
                    Offerta più alta ricevuta
                  </p>

                  <p className="mt-1 text-2xl font-black text-white">
                    {formatCurrency(Number(item.highest_offer_price))}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-100/80">
                    Puoi comunque inviare una proposta migliore.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-700/50 bg-slate-700/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Nessuna offerta ricevuta
                  </p>
                </div>
              )}

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Prezzo richiesto
                  </p>
                  <p className="text-xl font-black text-white">
                    {formatCurrency(Number(item.price))}
                  </p>
                </div>

                <span className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white transition group-hover:bg-blue-500">
                  Fai un&apos;offerta
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </Card>
  );
}