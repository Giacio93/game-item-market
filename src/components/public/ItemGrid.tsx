import { Item } from '@/src/lib/types/items';
import { ItemCard } from './ItemCard';

type ItemGridProps = {
  items: Item[];
};

export function ItemGrid({ items }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <h3 className="text-lg font-bold text-white">Nessun item trovato</h3>
        <p className="mt-2 text-sm text-slate-400">
          Al momento non ci sono item con questi filtri.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}