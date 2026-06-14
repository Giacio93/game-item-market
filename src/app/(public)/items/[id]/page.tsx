import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/src/components/ui/Card';
import { ItemStatusBadge } from '@/src/components/public/ItemStatusBadge';
import { OfferForm } from '@/src/components/public/OfferForm';
import { formatCurrency } from '@/src/lib/utils/format-currency';
import { Item } from '@/src/lib/types/items';
import { createClient } from '@/src/lib/supabase/server';

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
            <div className="aspect-[4/3] bg-slate-900">
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
            <div className="space-y-4">
              <ItemStatusBadge status={item.status} />

              <div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {item.title}
                </h1>

                <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-300">
                  {item.description}
                </p>
              </div>

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