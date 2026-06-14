import Link from 'next/link';
import { Card } from '@/src/components/ui/Card';
import { ItemForm } from '@/src/components/admin/ItemForm';

export default function NewItemPage() {
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
          Nuovo item
        </p>

        <h1 className="mt-2 text-4xl font-black text-white">
          Creazione item
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Aggiungi un nuovo item pubblico con immagine, prezzo, descrizione e
          stato.
        </p>
      </div>

      <Card className="p-6">
        <ItemForm mode="create" />
      </Card>
    </div>
  );
}