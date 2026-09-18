import type { ReactNode } from "react";
import { useAuth } from "@/store/auth";
import { roleHas, type Permission } from "@/lib/permissions";

export function useCan(perm: Permission): boolean {
  const user = useAuth((s) => s.user);
  if (!user) return false;
  if (user.permissions?.includes('*')) return true;
  if (user.permissions?.includes(perm)) return true;
  return roleHas(user.role, perm);
}

export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const ok = useCan(permission);
  return <>{ok ? children : fallback}</>;
}
