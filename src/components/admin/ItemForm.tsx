'use client';

import { useActionState } from 'react';
import { createItemAction, updateItemAction } from '@/src/lib/actions/item.actions';
import { initialItemActionState } from '@/src/lib/actions/item.state';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Item, ItemRace, ItemType, ITEM_STATUS_LABEL, ITEM_RACE_LABEL, ITEM_TYPE_LABEL } from '@/src/lib/types/items';
import { slugify } from '@/src/lib/utils/slugify';
import { Button } from '../ui/Button';

type ItemFormProps = {
  mode: 'create' | 'edit';
  item?: Item;
};

function getFieldError(
  errors: Record<string, string[] | undefined> | undefined,
  field: string,
) {
  return errors?.[field]?.[0];
}

export function ItemForm({ mode, item }: ItemFormProps) {
  const action = mode === 'create' ? createItemAction : updateItemAction;

  const [state, formAction, isPending] = useActionState(
    action,
    initialItemActionState,
  );

  const selectedRaces = item?.races ?? [];

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

  return (
    <form action={formAction} className="space-y-6">
      {item ? (
        <>
          <input type="hidden" name="id" value={item.id} />
          <input
            type="hidden"
            name="existing_image_url"
            value={item.image_url ?? ''}
          />
        </>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-semibold text-white">
            Nome item
          </label>
          <Input
            id="title"
            name="title"
            type="text"
            defaultValue={item?.title ?? ''}
            placeholder="Es. Spada leggendaria +9"
            disabled={isPending}
            required
          />
          {getFieldError(state.errors, 'title') ? (
            <p className="text-sm text-rose-300">
              {getFieldError(state.errors, 'title')}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-semibold text-white">
            Slug URL
          </label>
          <Input
            id="slug"
            name="slug"
            type="text"
            defaultValue={item?.slug ?? ''}
            placeholder="Lascia vuoto per generarlo automaticamente"
            disabled={isPending}
            onBlur={(event) => {
              if (!event.currentTarget.value) {
                const form = event.currentTarget.form;
                const title = form?.elements.namedItem('title');

                if (title instanceof HTMLInputElement) {
                  event.currentTarget.value = slugify(title.value);
                }
              }
            }}
          />
          {getFieldError(state.errors, 'slug') ? (
            <p className="text-sm text-rose-300">
              {getFieldError(state.errors, 'slug')}
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Verrà usato nell’URL pubblico dell’item.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-semibold text-white"
        >
          Descrizione
        </label>
        <Textarea
          id="description"
          name="description"
          defaultValue={item?.description ?? ''}
          placeholder="Descrivi item, bonus, dettagli utili e condizioni..."
          disabled={isPending}
          required
        />
        {getFieldError(state.errors, 'description') ? (
          <p className="text-sm text-rose-300">
            {getFieldError(state.errors, 'description')}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <span className="text-sm font-semibold text-white">
            Razza
          </span>

          <details className="group rounded-xl border border-white/10 bg-slate-950/70">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 py-2.5 text-sm text-white">
              <span>
                {selectedRaces.length > 0
                  ? selectedRaces.map((race) => ITEM_RACE_LABEL[race]).join(', ')
                  : 'Seleziona una o più razze'}
              </span>

              <span className="text-slate-500 transition group-open:rotate-180">
                ↓
              </span>
            </summary>

            <div className="space-y-2 border-t border-white/10 p-4">
              {raceOptions.map((race) => (
                <label
                  key={race}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-300 transition hover:bg-white/5"
                >
                  <input
                    type="checkbox"
                    name="races"
                    value={race}
                    defaultChecked={selectedRaces.includes(race)}
                    disabled={isPending}
                    className="h-4 w-4 rounded border-white/20 bg-slate-950"
                  />

                  <span>{ITEM_RACE_LABEL[race]}</span>
                </label>
              ))}
            </div>
          </details>

          {getFieldError(state.errors, 'races') ? (
            <p className="text-sm text-rose-300">
              {getFieldError(state.errors, 'races')}
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Puoi selezionare più razze. Lascia vuoto se l’item è valido per tutte.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="item_type" className="text-sm font-semibold text-white">
            Tipologia
          </label>

          <Select
            id="item_type"
            name="item_type"
            defaultValue={item?.item_type ?? 'OBJECTS'}
            disabled={isPending}
            required
          >
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {ITEM_TYPE_LABEL[type]}
              </option>
            ))}
          </Select>

          {getFieldError(state.errors, 'item_type') ? (
            <p className="text-sm text-rose-300">
              {getFieldError(state.errors, 'item_type')}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-semibold text-white">
            Prezzo richiesto
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={item?.price ?? ''}
            placeholder="Es. 150"
            disabled={isPending}
            required
          />
          {getFieldError(state.errors, 'price') ? (
            <p className="text-sm text-rose-300">
              {getFieldError(state.errors, 'price')}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="highest_offer_price"
            className="text-sm font-semibold text-white"
          >
            Prezzo offerto
          </label>
          <Input
            id="highest_offer_price"
            name="highest_offer_price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={item?.highest_offer_price ?? ''}
            placeholder="Es. 120"
            disabled={isPending}
          />
          {getFieldError(state.errors, 'highest_offer_price') ? (
            <p className="text-sm text-rose-300">
              {getFieldError(state.errors, 'highest_offer_price')}
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Inseriscilo manualmente in base all’offerta più alta ricevuta.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-semibold text-white">
            Stato
          </label>
          <Select
            id="status"
            name="status"
            defaultValue={item?.status ?? 'AVAILABLE'}
            disabled={isPending}
          >
            <option value="AVAILABLE">{ITEM_STATUS_LABEL.AVAILABLE}</option>
            <option value="NEGOTIATION">
              {ITEM_STATUS_LABEL.NEGOTIATION}
            </option>
            <option value="SOLD">{ITEM_STATUS_LABEL.SOLD}</option>
          </Select>
          {getFieldError(state.errors, 'status') ? (
            <p className="text-sm text-rose-300">
              {getFieldError(state.errors, 'status')}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="image_file" className="text-sm font-semibold text-white">
          Immagine item
        </label>

        {item?.image_url ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
            <img
              src={item.image_url}
              alt={item.title}
              className="max-h-72 w-full object-cover"
            />
          </div>
        ) : null}

        <input
          id="image_file"
          name="image_file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={isPending}
          className="block w-full cursor-pointer rounded-xl border border-white/10 bg-slate-950/70 text-sm text-slate-300 file:mr-4 file:min-h-11 file:border-0 file:bg-white/10 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-white/15"
        />

        <p className="text-xs text-slate-500">
          Formati supportati: JPG, PNG, WEBP. Dimensione massima: 5MB.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="image_url" className="text-sm font-semibold text-white">
          URL immagine manuale opzionale
        </label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={item?.image_url ?? ''}
          placeholder="Puoi lasciare vuoto se carichi un file"
          disabled={isPending}
        />
        {getFieldError(state.errors, 'image_url') ? (
          <p className="text-sm text-rose-300">
            {getFieldError(state.errors, 'image_url')}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
          {state.message}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? 'Salvataggio...'
            : mode === 'create'
              ? 'Crea item'
              : 'Salva modifiche'}
        </Button>
      </div>
    </form>
  );
}