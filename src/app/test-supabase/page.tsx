import { createClient } from "@/src/lib/supabase/server";

export default async function TestSupabasePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('items').select('*');

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-white">Test Supabase</h1>

      <pre className="mt-4 overflow-auto rounded-xl bg-black p-4 text-sm text-white">
        {JSON.stringify({ data, error }, null, 2)}
      </pre>
    </main>
  );
}