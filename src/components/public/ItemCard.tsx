import Link from 'next/link';
import { ItemStatusBadge } from './ItemStatusBadge';
import { Item } from '@/src/lib/types/items';
import { Card } from '../ui/Card';
import { formatCurrency } from '@/src/lib/utils/format-currency';

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="group overflow-hidden">
      <Link href={`/items/${item.slug}`} className="block">
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

        <div className="space-y-4 p-5">
          <ItemStatusBadge status={item.status} />

          <div className="space-y-2">
            <h3 className="line-clamp-2 text-lg font-bold text-white">
              {item.title}
            </h3>

            <p className="line-clamp-2 text-sm leading-6 text-slate-400">
              {item.description}
            </p>
          </div>

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
              Dettaglio
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}