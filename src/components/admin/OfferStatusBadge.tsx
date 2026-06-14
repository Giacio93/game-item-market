import { OFFER_STATUS_LABEL, OfferStatus } from '@/src/lib/types/offer';
import { cn } from '@/src/lib/utils/cn';

type OfferStatusBadgeProps = {
  status: OfferStatus;
};

const statusClasses: Record<OfferStatus, string> = {
  NEW: 'border-blue-400/30 bg-blue-400/10 text-blue-300',
  NEGOTIATION: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  ACCEPTED: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  REJECTED: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
};

export function OfferStatusBadge({ status }: OfferStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold',
        statusClasses[status],
      )}
    >
      {OFFER_STATUS_LABEL[status]}
    </span>
  );
}