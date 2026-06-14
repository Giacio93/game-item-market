import { ITEM_STATUS_LABEL, ItemStatus } from "@/src/lib/types/items";
import { cn } from "@/src/lib/utils/cn";

type ItemStatusBadgeProps = {
  status: ItemStatus;
};

const statusClasses: Record<ItemStatus, string> = {
  AVAILABLE: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  NEGOTIATION: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  SOLD: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
};

export function ItemStatusBadge({ status }: ItemStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold',
        statusClasses[status],
      )}
    >
      {ITEM_STATUS_LABEL[status]}
    </span>
  );
}