'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../supabase/server';
import { loginSchema } from '../validators/auth.schema';
import { LoginState } from './auth.state';

function getSafeRedirectPath(value?: string) {
  if (!value) {
    return '/admin';
  }

  if (!value.startsWith('/admin')) {
    return '/admin';
  }

  if (value.startsWith('/admin/login')) {
    return '/admin';
  }

  return value;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
    redirectTo: formData.get('redirectTo'),
  };

  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Controlla email e password.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return {
      ok: false,
      message: 'Credenziali non valide.',
    };
  }

  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('user_id, email, is_active')
    .eq('user_id', data.user.id)
    .eq('is_active', true)
    .maybeSingle();

  if (adminError || !adminUser) {
    await supabase.auth.signOut();

    return {
      ok: false,
      message: 'Utente non autorizzato come admin.',
    };
  }

  redirect(getSafeRedirectPath(parsed.data.redirectTo));
}

export async function logoutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect('/admin/login');
}