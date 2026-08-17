import { AdminRoute } from "@/components/auth/admin-route";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRoute>{children}</AdminRoute>;
}