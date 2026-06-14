import Link from 'next/link';
import { Card } from '@/src/components/ui/Card';
import { createClient } from '@/src/lib/supabase/server';
import { Item, ITEM_STATUS_LABEL } from '@/src/lib/types/items';
import { ItemStatusBadge } from '@/src/components/public/ItemStatusBadge';
import { formatCurrency } from '@/src/lib/utils/format-currency';
import { DeleteItemButton } from '../../DeleteItemButton';

export const dynamic = 'force-dynamic';

async function getAdminItems() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Errore getAdminItems:', error);

    return [];
  }

  return (data ?? []) as Item[];
}

export default async function AdminItemsPage() {
  const items = await getAdminItems();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
            Item
          </p>

          <h1 className="mt-2 text-4xl font-black text-white">
            Gestione item
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Crea, modifica, elimina e aggiorna lo stato degli item pubblicati.
          </p>
        </div>

        <Link
          href="/admin/items/new"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
        >
          + Nuovo item
        </Link>
      </div>

      {items.length === 0 ? (
        <Card className="p-6">
          <p className="text-slate-300">
            Non hai ancora creato item.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="grid gap-4 p-4 lg:grid-cols-[140px_1fr_auto] lg:items-center">
                <div className="overflow-hidden rounded-xl bg-slate-950">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
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
                    <ItemStatusBadge status={item.status} />

                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                      {ITEM_STATUS_LABEL[item.status]}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-white">
                      {item.title}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  <p className="text-lg font-black text-white">
                    {formatCurrency(Number(item.price))}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                  <Link
                    href={`/items/${item.slug}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    Vedi pubblico
                  </Link>

                  <Link
                    href={`/admin/items/${item.id}/edit`}
                    className="inline-flex min-h-10 items-center justify-center rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
                  >
                    Modifica
                  </Link>

                  <DeleteItemButton itemId={item.id} itemTitle={item.title} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}