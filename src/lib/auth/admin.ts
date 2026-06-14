import { redirect } from 'next/navigation';
import { createClient } from '../supabase/server';

export type AdminUser = {
  user_id: string;
  email: string;
  is_active: boolean;
};

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: adminUser, error } = await supabase
    .from('admin_users')
    .select('user_id, email, is_active')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !adminUser) {
    redirect('/admin/login?error=unauthorized');
  }

  return {
    user,
    admin: adminUser as AdminUser,
  };
}