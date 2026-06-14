export default function LoadingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center shadow-2xl shadow-black/30">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-blue-400" />

        <p className="mt-4 text-sm font-semibold text-slate-300">
          Caricamento...
        </p>
      </div>
    </main>
  );
}