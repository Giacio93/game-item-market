import { cn } from '@/src/lib/utils/cn';
import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20 backdrop-blur',
        className,
      )}
      {...props}
    />
  );
}