'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '../supabase/server';
import { ItemActionState } from './item.state';
import { requireAdmin } from '../auth/admin';
import { itemFormSchema } from '../validators/item.schema';
import { slugify } from '../utils/slugify';


const IMAGE_BUCKET = 'item-images';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function getFieldValue(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === 'string' ? value : '';
}

function getImageExtension(type: string) {
  if (type === 'image/png') {
    return 'png';
  }

  if (type === 'image/webp') {
    return 'webp';
  }

  return 'jpg';
}

function isImageFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

function getStoragePathFromPublicUrl(publicUrl: string) {
  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

async function uploadItemImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageFile: File,
) {
  if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
    return {
      publicUrl: null,
      error: 'Formato immagine non valido. Usa JPG, PNG o WEBP.',
    };
  }

  if (imageFile.size > MAX_IMAGE_SIZE) {
    return {
      publicUrl: null,
      error: 'Immagine troppo grande. Dimensione massima: 5MB.',
    };
  }

  const extension = getImageExtension(imageFile.type);
  const filePath = `items/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(filePath, imageFile, {
      contentType: imageFile.type,
      upsert: false,
    });

  if (uploadError) {
    return {
      publicUrl: null,
      error: 'Upload immagine non riuscito.',
    };
  }

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(filePath);

  return {
    publicUrl: data.publicUrl,
    error: null,
  };
}

async function removeItemImageIfManaged(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageUrl: string | null,
) {
  if (!imageUrl) {
    return;
  }

  const storagePath = getStoragePathFromPublicUrl(imageUrl);

  if (!storagePath) {
    return;
  }

  await supabase.storage.from(IMAGE_BUCKET).remove([storagePath]);
}

export async function createItemAction(
  _prevState: ItemActionState,
  formData: FormData,
): Promise<ItemActionState> {
  await requireAdmin();

  const rawData = {
    title: getFieldValue(formData, 'title'),
    slug: getFieldValue(formData, 'slug'),
    description: getFieldValue(formData, 'description'),
    price: getFieldValue(formData, 'price'),
    image_url: getFieldValue(formData, 'image_url'),
    status: getFieldValue(formData, 'status'),
  };

  const parsed = itemFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Controlla i campi inseriti.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const imageFile = formData.get('image_file');

  let imageUrl = parsed.data.image_url || null;

  if (isImageFile(imageFile)) {
    const uploadResult = await uploadItemImage(supabase, imageFile);

    if (uploadResult.error) {
      return {
        ok: false,
        message: uploadResult.error,
      };
    }

    imageUrl = uploadResult.publicUrl;
  }

  const slug = parsed.data.slug || slugify(parsed.data.title);

  const { error } = await supabase.from('items').insert({
    title: parsed.data.title,
    slug,
    description: parsed.data.description,
    price: parsed.data.price,
    image_url: imageUrl,
    status: parsed.data.status,
  });

  if (error) {
    if (imageUrl) {
      await removeItemImageIfManaged(supabase, imageUrl);
    }

    if (error.code === '23505') {
      return {
        ok: false,
        message: 'Esiste già un item con questo slug. Modifica lo slug.',
      };
    }

    console.error('Errore createItemAction:', error);

    return {
      ok: false,
      message: 'Non sono riuscito a creare l’item.',
    };
  }

  revalidatePath('/');
  revalidatePath('/items');
  revalidatePath('/admin');
  revalidatePath('/admin/items');

  redirect('/admin/items');
}

export async function updateItemAction(
  _prevState: ItemActionState,
  formData: FormData,
): Promise<ItemActionState> {
  await requireAdmin();

  const itemId = getFieldValue(formData, 'id');
  const existingImageUrl = getFieldValue(formData, 'existing_image_url') || null;

  if (!itemId) {
    return {
      ok: false,
      message: 'Item non valido.',
    };
  }

  const rawData = {
    title: getFieldValue(formData, 'title'),
    slug: getFieldValue(formData, 'slug'),
    description: getFieldValue(formData, 'description'),
    price: getFieldValue(formData, 'price'),
    image_url: getFieldValue(formData, 'image_url'),
    status: getFieldValue(formData, 'status'),
  };

  const parsed = itemFormSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Controlla i campi inseriti.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const imageFile = formData.get('image_file');

  let imageUrl = parsed.data.image_url || existingImageUrl;

  if (isImageFile(imageFile)) {
    const uploadResult = await uploadItemImage(supabase, imageFile);

    if (uploadResult.error) {
      return {
        ok: false,
        message: uploadResult.error,
      };
    }

    imageUrl = uploadResult.publicUrl;
  }

  const slug = parsed.data.slug || slugify(parsed.data.title);

  const { error } = await supabase
    .from('items')
    .update({
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      price: parsed.data.price,
      image_url: imageUrl,
      status: parsed.data.status,
    })
    .eq('id', itemId);

  if (error) {
    if (imageUrl && imageUrl !== existingImageUrl) {
      await removeItemImageIfManaged(supabase, imageUrl);
    }

    if (error.code === '23505') {
      return {
        ok: false,
        message: 'Esiste già un item con questo slug. Modifica lo slug.',
      };
    }

    console.error('Errore updateItemAction:', error);

    return {
      ok: false,
      message: 'Non sono riuscito a modificare l’item.',
    };
  }

  if (imageUrl && imageUrl !== existingImageUrl) {
    await removeItemImageIfManaged(supabase, existingImageUrl);
  }

  revalidatePath('/');
  revalidatePath('/items');
  revalidatePath(`/items/${slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/items');

  redirect('/admin/items');
}

export async function deleteItemAction(itemId: string) {
  await requireAdmin();

  const supabase = await createClient();

  const { data: item } = await supabase
    .from('items')
    .select('image_url')
    .eq('id', itemId)
    .maybeSingle();

  const { error } = await supabase.from('items').delete().eq('id', itemId);

  if (error) {
    console.error('Errore deleteItemAction:', error);
    redirect('/admin/items?error=delete');
  }

  await removeItemImageIfManaged(supabase, item?.image_url ?? null);

  revalidatePath('/');
  revalidatePath('/items');
  revalidatePath('/admin');
  revalidatePath('/admin/items');

  redirect('/admin/items');
}