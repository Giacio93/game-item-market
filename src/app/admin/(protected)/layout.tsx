import { AdminHeader } from '@/src/components/admin/AdminHeader';
import { requireAdmin } from '@/src/lib/auth/admin';


export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { admin } = await requireAdmin();

  return (
    <div className="min-h-screen">
      <AdminHeader email={admin.email} />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}