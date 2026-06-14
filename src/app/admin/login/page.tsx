import { LoginForm } from '@/src/components/admin/LoginForm';
import Link from 'next/link';

type AdminLoginPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
    error?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const resolvedSearchParams = await searchParams;

  const isUnauthorized = resolvedSearchParams.error === 'unauthorized';

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="mb-6 space-y-3">
          <Link
            href="/"
            className="text-sm font-semibold text-blue-300 transition hover:text-blue-200"
          >
            ← Torna al sito
          </Link>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
              Area privata
            </p>

            <h1 className="mt-2 text-3xl font-black text-white">
              Login admin
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Accedi per gestire item, immagini e offerte ricevute.
            </p>
          </div>
        </div>

        {isUnauthorized ? (
          <div className="mb-5 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
            Non hai i permessi admin per accedere a questa sezione.
          </div>
        ) : null}

        <LoginForm redirectTo={resolvedSearchParams.redirectTo} />
      </section>
    </main>
  );
}