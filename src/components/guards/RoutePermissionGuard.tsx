"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  can,
  getDefaultAuthenticatedPath,
  permissionForPath,
} from "@/utils/permissions";

export function RoutePermissionGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const permission = permissionForPath(pathname);
  const allowed = !permission || can(user, permission);

  useEffect(() => {
    if (!loading && user && !allowed) {
      router.replace(getDefaultAuthenticatedPath(user));
    }
  }, [allowed, loading, router, user]);

  if (loading || !allowed) {
    return null;
  }

  return <>{children}</>;
}
