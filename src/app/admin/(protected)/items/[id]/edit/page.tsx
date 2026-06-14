import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/server';
import { Item } from '@/src/lib/types/items';
import { Card } from '@/src/components/ui/Card';
import { ItemForm } from '@/src/components/admin/ItemForm';

export const dynamic = 'force-dynamic';

type EditItemPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getItem(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Errore getItem admin edit:', error);

    return null;
  }

  return data as Item | null;
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/items"
          className="text-sm font-semibold text-blue-300 transition hover:text-blue-200"
        >
          ← Torna agli item
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-300">
          Modifica item
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          {item.title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Aggiorna dati, prezzo, immagine e stato dell’item.
        </p>
      </div>

      <Card className="p-6">
        <ItemForm mode="edit" item={item} />
      </Card>
    </div>
  );
}