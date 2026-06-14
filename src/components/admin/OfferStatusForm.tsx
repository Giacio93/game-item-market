'use client';

import { useActionState } from 'react';
import { updateOfferStatusAction } from '@/src/lib/actions/offer.actions';
import { initialUpdateOfferStatusState } from '@/src/lib/actions/offer.state';
import { OFFER_STATUS_LABEL, OfferStatus } from '@/src/lib/types/offer';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

type OfferStatusFormProps = {
  offerId: string;
  currentStatus: OfferStatus;
  compact?: boolean;
};

export function OfferStatusForm({
  offerId,
  currentStatus,
  compact = false,
}: OfferStatusFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateOfferStatusAction,
    initialUpdateOfferStatusState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={offerId} />

      <div className={compact ? 'flex flex-col gap-2 sm:flex-row' : 'space-y-2'}>
        <Select
          name="status"
          defaultValue={currentStatus}
          disabled={isPending}
          aria-label="Stato offerta"
        >
          <option value="NEW">{OFFER_STATUS_LABEL.NEW}</option>
          <option value="NEGOTIATION">{OFFER_STATUS_LABEL.NEGOTIATION}</option>
          <option value="ACCEPTED">{OFFER_STATUS_LABEL.ACCEPTED}</option>
          <option value="REJECTED">{OFFER_STATUS_LABEL.REJECTED}</option>
        </Select>

        <Button
          type="submit"
          variant={compact ? 'secondary' : 'primary'}
          disabled={isPending}
          className={compact ? 'shrink-0' : undefined}
        >
          {isPending ? 'Salvo...' : 'Aggiorna'}
        </Button>
      </div>

      {state.message ? (
        <div
          className={
            state.ok
              ? 'rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200'
              : 'rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200'
          }
        >
          {state.message}
        </div>
      ) : null}
    </form>
  );
}