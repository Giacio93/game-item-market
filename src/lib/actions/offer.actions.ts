'use server';

import { revalidatePath } from 'next/cache';
import { createOfferSchema, updateOfferStatusSchema } from '../validators/offer.schema';
import { createClient } from '../supabase/server';
import { requireAdmin } from '../auth/admin';
import { CreateOfferState, UpdateOfferStatusState } from './offer.state';

const MIN_FORM_SECONDS = 3;

export async function createOfferAction(
  _prevState: CreateOfferState,
  formData: FormData,
): Promise<CreateOfferState> {
  const rawData = {
    item_id: formData.get('item_id'),
    nickname: formData.get('nickname'),
    contact: formData.get('contact'),
    amount: formData.get('amount'),
    message: formData.get('message'),
    website: formData.get('website'),
    started_at: formData.get('started_at'),
  };

  const parsed = createOfferSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Controlla i campi inseriti.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const elapsedSeconds = (Date.now() - parsed.data.started_at) / 1000;

  if (elapsedSeconds < MIN_FORM_SECONDS) {
    return {
      ok: false,
      message: 'Invio troppo rapido. Riprova tra qualche secondo.',
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('offers').insert({
    item_id: parsed.data.item_id,
    nickname: parsed.data.nickname,
    contact: parsed.data.contact,
    amount: parsed.data.amount,
    message: parsed.data.message || null,
    status: 'NEW',
  });

  if (error) {
    console.error('Errore Supabase createOfferAction:', error);

    return {
      ok: false,
      message:
        'Non sono riuscito a salvare la tua offerta. Riprova più tardi.',
    };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/offers');

  return {
    ok: true,
    message:
      'Offerta inviata correttamente. Ti contatterò su Discord o WhatsApp se interessato.',
  };
}

export async function updateOfferStatusAction(
  _prevState: UpdateOfferStatusState,
  formData: FormData,
): Promise<UpdateOfferStatusState> {
  await requireAdmin();

  const rawData = {
    id: formData.get('id'),
    status: formData.get('status'),
  };

  const parsed = updateOfferStatusSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Stato offerta non valido.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('offers')
    .update({
      status: parsed.data.status,
    })
    .eq('id', parsed.data.id);

  if (error) {
    console.error('Errore updateOfferStatusAction:', error);

    return {
      ok: false,
      message: 'Non sono riuscito ad aggiornare lo stato dell’offerta.',
    };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/offers');
  revalidatePath(`/admin/offers/${parsed.data.id}`);

  return {
    ok: true,
    message: 'Stato offerta aggiornato correttamente.',
  };
}