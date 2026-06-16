import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/src/lib/supabase/server';

const trackVisitSchema = z.object({
  visitorId: z.string().trim().min(10).max(100),
  path: z.string().trim().min(1).max(300),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = trackVisitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const { visitorId, path } = parsed.data;

    if (!path.startsWith('/') || path.startsWith('/admin')) {
      return NextResponse.json({ ok: true });
    }

    const supabase = await createClient();

    const { error } = await supabase.from('site_visits').insert({
      visitor_id: visitorId,
      path,
    });

    if (error) {
      console.error('Errore track visit:', error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Errore API track-visit:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}