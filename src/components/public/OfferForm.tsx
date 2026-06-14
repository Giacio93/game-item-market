'use client';

import { createOfferAction } from '@/src/lib/actions/offer.actions';
import { useActionState, useEffect, useMemo, useRef } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { ItemStatus } from '@/src/lib/types/items';
import { initialCreateOfferState } from '@/src/lib/actions/offer.state';


type OfferFormProps = {
  itemId: string;
  itemStatus: ItemStatus;
};

function getFieldError(
  errors: Record<string, string[] | undefined> | undefined,
  field: string,
) {
  return errors?.[field]?.[0];
}

export function OfferForm({ itemId, itemStatus }: OfferFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useMemo(() => Date.now(), []);
  const [state, formAction, isPending] = useActionState(
    createOfferAction,
    initialCreateOfferState,
  );

  const isSold = itemStatus === 'SOLD';

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  if (isSold) {
    return (
      <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5">
        <h2 className="text-lg font-bold text-white">Item venduto</h2>
        <p className="mt-2 text-sm leading-6 text-rose-100/80">
          Questo item risulta già venduto, quindi al momento non è possibile
          inviare nuove offerte.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <input type="hidden" name="item_id" value={itemId} />
      <input type="hidden" name="started_at" value={startedAt} />

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Sito web</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="nickname" className="text-sm font-semibold text-white">
          Nickname in gioco o nome reale
        </label>
        <Input
          id="nickname"
          name="nickname"
          type="text"
          placeholder="Es. PlayerRoma"
          disabled={isPending}
          required
        />
        {getFieldError(state.errors, 'nickname') ? (
          <p className="text-sm text-rose-300">
            {getFieldError(state.errors, 'nickname')}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact" className="text-sm font-semibold text-white">
          Contatto Discord o WhatsApp
        </label>
        <Input
          id="contact"
          name="contact"
          type="text"
          placeholder="Es. @nickname Discord oppure numero WhatsApp"
          disabled={isPending}
          required
        />
        {getFieldError(state.errors, 'contact') ? (
          <p className="text-sm text-rose-300">
            {getFieldError(state.errors, 'contact')}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-semibold text-white">
          Importo offerta
        </label>
        <Input
          id="amount"
          name="amount"
          type="number"
          inputMode="decimal"
          min="1"
          step="0.01"
          placeholder="Es. 120"
          disabled={isPending}
          required
        />
        {getFieldError(state.errors, 'amount') ? (
          <p className="text-sm text-rose-300">
            {getFieldError(state.errors, 'amount')}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold text-white">
          Messaggio opzionale
        </label>
        <Textarea
          id="message"
          name="message"
          maxLength={500}
          placeholder="Scrivi eventuali dettagli sulla tua offerta..."
          disabled={isPending}
        />
        {getFieldError(state.errors, 'message') ? (
          <p className="text-sm text-rose-300">
            {getFieldError(state.errors, 'message')}
          </p>
        ) : (
          <p className="text-xs text-slate-500">Massimo 500 caratteri.</p>
        )}
      </div>

      {state.message ? (
        <div
          className={
            state.ok
              ? 'rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200'
              : 'rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200'
          }
        >
          {state.message}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Invio in corso...' : 'Invia offerta'}
      </Button>
    </form>
  );
}