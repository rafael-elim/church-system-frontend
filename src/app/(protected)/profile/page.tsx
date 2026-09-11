"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { isAdmin, isMember, isVisitor } from "@/utils/permissions";

function profileLabel(user: ReturnType<typeof useAuth>["user"]) {
  if (isAdmin(user)) return "Administrador";
  if (isMember(user)) return "Membro";
  if (isVisitor(user)) return "Visitante";
  return "Usuário";
}

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Perfil</h1>
        <p className="mt-1 text-sm text-slate-600">
          Informações da sua conta neste ambiente.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{user?.name ?? "Usuário"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-600">Perfil</span>
            <Badge>{profileLabel(user)}</Badge>
          </div>
          <p>
            <span className="text-slate-600">E-mail:</span> {user?.email}
          </p>
          {user?.memberStatus && (
            <p>
              <span className="text-slate-600">Status de membro:</span>{" "}
              {user.memberStatus === "MEMBER" ? "Membro" : "Visitante"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
