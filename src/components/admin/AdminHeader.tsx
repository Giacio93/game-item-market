import Link from 'next/link';
import { logoutAction } from '@/src/lib/actions/auth.actions';

type AdminHeaderProps = {
  email: string;
};

export function AdminHeader({ email }: AdminHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Link href="/admin" className="text-lg font-black text-white">
            Game Item Market Admin
          </Link>

          <p className="mt-1 text-xs text-slate-500">
            Accesso: {email}
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/items"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Item
          </Link>

          <Link
            href="/admin/offers"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Offerte
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Logout
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}