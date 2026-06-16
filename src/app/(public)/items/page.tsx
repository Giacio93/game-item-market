import Link from 'next/link';
import { createClient } from '@/src/lib/supabase/server';
import {
  ITEM_RACE_LABEL,
  ITEM_TYPE_LABEL,
  type Item,
  type ItemRace,
  type ItemType,
} from '@/src/lib/types/items';
import { ItemGrid } from '@/src/components/public/ItemGrid';
import { ItemsSearch } from '@/src/components/public/ItemsSearch';

export const dynamic = 'force-dynamic';

type ItemsPageProps = {
  searchParams: Promise<{
    q?: string;
    race?: string;
    type?: string;
  }>;
};

const allowedRaces: ItemRace[] = [
  'WARRIOR',
  'SURA',
  'SHAMAN',
  'NINJA',
  'LYCAN',
];

const allowedTypes: ItemType[] = [
  'WEAPONS',
  'ARMORS',
  'SHIELDS',
  'BRACELETS',
  'NECKLACES',
  'EARRINGS',
  'TALISMANS',
  'BELTS',
  'HELMETS',
  'SHOES',
  'GLOVES',
  'SASHES',
  'AURA_OUTFITS',
  'COSTUMES',
  'OBJECTS',
  'PETS',
];

function getValidRace(race?: string): ItemRace | null {
  if (!race) {
    return null;
  }

  if (allowedRaces.includes(race as ItemRace)) {
    return race as ItemRace;
  }

  return null;
}

function getValidType(type?: string): ItemType | null {
  if (!type) {
    return null;
  }

  if (allowedTypes.includes(type as ItemType)) {
    return type as ItemType;
  }

  return null;
}

function normalizeSearch(value?: string) {
  return value?.trim().toLowerCase() ?? '';
}

function filterItems(params: {
  items: Item[];
  query: string;
  race: ItemRace | null;
  type: ItemType | null;
}) {
  const { items, query, race, type } = params;

  return items.filter((item) => {
    const matchesQuery = query
      ? [
        item.title,
        item.description,
        item.slug,
        ITEM_TYPE_LABEL[item.item_type],
        ...(item.races ?? []).map((itemRace) => ITEM_RACE_LABEL[itemRace]),
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
      : true;

    const matchesRace = race
      ? item.races.length === 0 || item.races.includes(race)
      : true;

    const matchesType = type ? item.item_type === type : true;

    return matchesQuery && matchesRace && matchesType;
  });
}

async function getItems() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .neq('status', 'SOLD')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Errore Supabase getItems:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as Item[];
}

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  const resolvedSearchParams = await searchParams;

  const query = normalizeSearch(resolvedSearchParams.q);
  const race = getValidRace(resolvedSearchParams.race);
  const type = getValidType(resolvedSearchParams.type);

  const allItems = await getItems();
  const items = filterItems({
    items: allItems,
    query,
    race,
    type,
  });

  const hasActiveSearch = Boolean(query || race || type);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-4">
        <Link
          href="/"
          className="text-sm font-semibold text-blue-300 transition hover:text-blue-200"
        >
          ← Torna alla home
        </Link>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
            Catalogo item
          </p>

          <h1 className="text-4xl font-black tracking-tight text-white">
            Trova l’item giusto per il tuo personaggio
          </h1>

          <p className="max-w-3xl text-base leading-7 text-slate-400">
            Cerca per nome, descrizione, razza o tipologia. Gli item venduti non
            vengono mostrati: qui trovi solo oggetti ancora acquistabili o in
            trattativa.
          </p>

          <div className="max-w-3xl rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
            <p className="text-sm leading-6 text-amber-100">
              <span className="font-bold text-white">
                Nota sugli item in trattativa:
              </span>{' '}
              significa che sto già valutando una proposta, ma non ho ancora
              accettato nessuna offerta. Se l’item ti interessa, puoi comunque
              inviare la tua proposta.
            </p>
          </div>
        </div>
      </header>


      <ItemsSearch hasActiveSearch={hasActiveSearch} items={items} />

      <section id="items-list" className="scroll-mt-4 lg:scroll-mt-8">
        <ItemGrid items={items} />
      </section>
    </main>
  );
}