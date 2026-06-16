import type { Item } from '@/src/lib/types/items';
import { ItemCard } from './ItemCard';

type ItemGridProps = {
  items: Item[];
};

export function ItemGrid({ items }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <h2 className="text-xl font-black text-white">Nessun item trovato</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Prova a modificare la ricerca o torna più tardi: nuovi item verranno
          caricati appena disponibili.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}