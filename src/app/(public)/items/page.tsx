import Link from 'next/link';
import { createClient } from '@/src/lib/supabase/client';
import { ItemStatus, ITEM_STATUS_LABEL, Item } from '@/src/lib/types/items';
import { ItemGrid } from '@/src/components/public/ItemGrid';
import { cn } from '@/src/lib/utils/cn';


export const dynamic = 'force-dynamic';

type ItemsPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

const allowedStatuses: ItemStatus[] = ['AVAILABLE', 'NEGOTIATION', 'SOLD'];

function getValidStatus(status?: string): ItemStatus | null {
  if (!status) {
    return null;
  }

  if (allowedStatuses.includes(status as ItemStatus)) {
    return status as ItemStatus;
  }

  return null;
}

async function getItems(status: ItemStatus | null) {
  const supabase = await createClient();

  let query = supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Errore Supabase getItems:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as Item[];
}

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentStatus = getValidStatus(resolvedSearchParams.status);
  const items = await getItems(currentStatus);

  const filters: Array<{
    label: string;
    href: string;
    active: boolean;
  }> = [
    {
      label: 'Tutti',
      href: '/items',
      active: currentStatus === null,
    },
    ...allowedStatuses.map((status) => ({
      label: ITEM_STATUS_LABEL[status],
      href: `/items?status=${status}`,
      active: currentStatus === status,
    })),
  ];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-4">
        <Link
          href="/"
          className="text-sm font-semibold text-blue-300 transition hover:text-blue-200"
        >
          ← Torna alla homepage
        </Link>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
            Catalogo
          </p>

          <h1 className="text-4xl font-black tracking-tight text-white">
            Tutti gli item
          </h1>

          <p className="max-w-2xl text-base leading-7 text-slate-400">
            Sfoglia gli item disponibili, in trattativa o già venduti. Apri una
            scheda per inviare un’offerta.
          </p>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label="Filtra item per stato">
        {filters.map((filter) => (
          <Link
            key={filter.href}
            href={filter.href}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition',
              filter.active
                ? 'border-blue-400 bg-blue-400/15 text-blue-200'
                : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]',
            )}
          >
            {filter.label}
          </Link>
        ))}
      </nav>

      <ItemGrid items={items} />
    </main>
  );
}