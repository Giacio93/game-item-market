'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
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
    const mobileFiltersRef = useRef<HTMLDetailsElement>(null);

    function scrollToItemsList() {
        window.setTimeout(() => {
            document.getElementById('items-list')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 150);
    }

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

        if (mobileFiltersRef.current) {
            mobileFiltersRef.current.open = false;
        }

        router.push(queryString ? `/items?${queryString}#items-list` : '/items#items-list');

        scrollToItemsList();
    }

    function handleReset() {
        setQuery('');
        setRace('');
        setType('');
        if (mobileFiltersRef.current) {
            mobileFiltersRef.current.open = false;
        }

        router.push('/items#items-list');

        scrollToItemsList();
    }

    const activeFiltersCount = [query.trim(), race, type].filter(Boolean).length;

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.05] p-2.5 shadow-xl shadow-black/20 sm:rounded-3xl sm:p-4"
        >
            {/* MOBILE */}
            <div className="space-y-2 lg:hidden">
                <div className="flex gap-2">
                    <Input
                        id="q-mobile"
                        name="q"
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Cerca item..."
                        className="min-w-0 flex-1"
                    />

                    <Button type="submit" className="shrink-0 px-3">
                        Cerca
                    </Button>
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-2">
                    <details
                        ref={mobileFiltersRef}
                        className="rounded-xl border border-white/10 bg-slate-950/60"
                    >
                        <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-2 px-3 text-sm font-bold text-white">
                            <span>Filtri</span>

                            {activeFiltersCount > 0 ? (
                                <span className="flex items-center gap-1.5">
                                    <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-black text-white">
                                        {activeFiltersCount}
                                    </span>

                                    <button
                                        type="button"
                                        aria-label="Rimuovi filtri"
                                        className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs font-black text-white transition hover:bg-rose-500"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            handleReset();
                                        }}
                                    >
                                        ×
                                    </button>
                                </span>
                            ) : (
                                <span className="text-xs text-slate-500">Razza / Tipo</span>
                            )}
                        </summary>

                        <div className="space-y-2 border-t border-white/10 p-2.5">
                            <Select
                                id="race-mobile"
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

                            <Select
                                id="type-mobile"
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

                            <div className="grid grid-cols-2 gap-2">
                                <Button type="submit" className="min-h-10">
                                    Applica
                                </Button>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="min-h-10"
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </details>
                </div>

                {hasActiveSearch ? (
                    <p className="px-1 text-xs text-slate-400">
                        Risultati:{' '}
                        <span className="font-bold text-white">{items.length}</span>
                    </p>
                ) : null}
            </div>

            {/* DESKTOP */}
            <div className="hidden gap-4 lg:grid lg:grid-cols-[1fr_220px_220px_auto] lg:items-end">
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