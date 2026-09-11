"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { listMyCourses, listMyGroups, MyCourseResponse, MyGroupResponse } from "@/services/member-portal";

export default function MyDiscipleshipPage() {
  const [groups, setGroups] = useState<MyGroupResponse[]>([]);
  const [courses, setCourses] = useState<MyCourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDiscipleship = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [groupsResponse, coursesResponse] = await Promise.all([
        listMyGroups(),
        listMyCourses(),
      ]);
      setGroups(groupsResponse);
      setCourses(coursesResponse);
    } catch {
      setError("Não foi possível carregar seu discipulado.");
      toast.error("Não foi possível carregar seu discipulado.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiscipleship();
  }, [fetchDiscipleship]);

  const currentCourse = courses[0];
  const currentGroup = groups[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Meu Discipulado</h1>
        <p className="mt-1 text-sm text-slate-600">
          Seu acompanhamento nos grupos e cursos liberados.
        </p>
      </div>

      {error && (
        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-6 text-sm text-red-600">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchDiscipleship}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardHeader className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-full max-w-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      ) : !currentCourse && !currentGroup ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-slate-600">
            Nenhum discipulado liberado para você no momento.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          {currentCourse && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Curso atual: {currentCourse.name}</CardTitle>
                <CardDescription>
                  {currentCourse.description || "Continue avançando no conteúdo disponível."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{currentCourse.progressPercentage}%</span>
                  </div>
                  <Progress value={currentCourse.progressPercentage} />
                </div>
                <Button asChild>
                  <Link href={`/my-courses/${currentCourse.id}`}>Continuar</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {currentGroup && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Grupo: {currentGroup.name}</CardTitle>
                <CardDescription>
                  Líder: {currentGroup.leader?.name ?? "Não informado"}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                {groups.length} grupo(s) vinculado(s) ao seu perfil.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
