'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import {
  ITEM_RACE_LABEL,
  ITEM_TYPE_LABEL,
  type Item,
  type ItemRace,
  type ItemType,
} from '@/src/lib/types/items';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';

const raceOptions: ItemRace[] = [
  'WARRIOR',
  'SURA',
  'SHAMAN',
  'NINJA',
  'LYCAN',
];

const typeOptions: ItemType[] = [
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

type ItemsSearchProps = {
  hasActiveSearch: boolean;
  items: Item[];
};

export function ItemsSearch({ hasActiveSearch, items }: ItemsSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState('');
  const [race, setRace] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
    setRace(searchParams.get('race') ?? '');
    setType(searchParams.get('type') ?? '');
  }, [searchParams]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (query.trim()) {
      params.set('q', query.trim());
    }

    if (race) {
      params.set('race', race);
    }

    if (type) {
      params.set('type', type);
    }

    const queryString = params.toString();

    router.push(queryString ? `/items?${queryString}` : '/items');
  }

  function handleReset() {
    setQuery('');
    setRace('');
    setType('');

    router.push('/items');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px_auto] lg:items-end">
        <div className="space-y-2">
          <label htmlFor="q" className="text-sm font-semibold text-white">
            Cerca item
          </label>

          <Input
            id="q"
            name="q"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cerca per nome o descrizione..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="race" className="text-sm font-semibold text-white">
            Razza
          </label>

          <Select
            id="race"
            name="race"
            value={race}
            onChange={(event) => setRace(event.target.value)}
          >
            <option value="">Tutte le razze</option>

            {raceOptions.map((raceOption) => (
              <option key={raceOption} value={raceOption}>
                {ITEM_RACE_LABEL[raceOption]}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-semibold text-white">
            Tipologia
          </label>

          <Select
            id="type"
            name="type"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="">Tutte le tipologie</option>

            {typeOptions.map((typeOption) => (
              <option key={typeOption} value={typeOption}>
                {ITEM_TYPE_LABEL[typeOption]}
              </option>
            ))}
          </Select>
        </div>

        <div>
          {hasActiveSearch ? (
            <p className="mb-2 flex w-full justify-end text-sm text-slate-300">
              Risultati trovati:{' '}
              <span className="ml-2 font-bold text-white">{items.length}</span>
            </p>
          ) : null}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1 lg:flex-none">
              Cerca
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="flex-1 lg:flex-none"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}