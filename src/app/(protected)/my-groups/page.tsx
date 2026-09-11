"use client";

import { Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listMyGroups, MyGroupResponse } from "@/services/member-portal";

export default function MyGroupsPage() {
  const [groups, setGroups] = useState<MyGroupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setGroups(await listMyGroups());
    } catch {
      setError("Não foi possível carregar seus grupos.");
      toast.error("Não foi possível carregar seus grupos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Meus Grupos</h1>
        <p className="mt-1 text-sm text-slate-600">
          Grupos em que você participa.
        </p>
      </div>

      {error && (
        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-6 text-sm text-red-600">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchGroups}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((item) => (
            <Card key={item}>
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-slate-600">
            Você ainda não participa de nenhum grupo.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline">Grupo</Badge>
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-base">{group.name}</CardTitle>
                <CardDescription>
                  {group.description || "Grupo sem descrição cadastrada."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>Líder: {group.leader?.name ?? "Não informado"}</p>
                <p>{group.courses.length} curso(s) vinculado(s)</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
