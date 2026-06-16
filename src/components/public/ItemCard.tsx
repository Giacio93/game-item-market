import Link from 'next/link';
import type { Item } from '@/src/lib/types/items';
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

  return (
    <Card className="group h-full overflow-hidden">
      <Link href={`/items/${item.slug}`} className="flex h-full flex-col">
        <div className="overflow-hidden bg-slate-900">
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
      </Link>
    </Card>
  );
}