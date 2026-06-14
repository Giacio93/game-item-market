'use client';

import { useTransition } from 'react';
import { deleteItemAction } from '@/src/lib/actions/item.actions';

type DeleteItemButtonProps = {
  itemId: string;
  itemTitle: string;
};

export function DeleteItemButton({
  itemId,
  itemTitle,
}: DeleteItemButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        const confirmed = window.confirm(
          `Vuoi davvero eliminare "${itemTitle}"? Verranno eliminate anche le offerte collegate.`,
        );

        if (!confirmed) {
          return;
        }

        startTransition(async () => {
          await deleteItemAction(itemId);
        });
      }}
      className="inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? 'Elimino...' : 'Elimina'}
    </button>
  );
}