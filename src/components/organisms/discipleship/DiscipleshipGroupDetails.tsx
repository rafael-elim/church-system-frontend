import { BookOpen, UserPlus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GroupDetailsResponse } from "@/services/discipleship";
import { getInitials } from "./utils";

interface DiscipleshipGroupDetailsProps {
  selectedGroupId: string | null;
  details: GroupDetailsResponse | null;
  loading: boolean;
  onAddMember: () => void;
  onAddCourse: () => void;
}

export function DiscipleshipGroupDetails({
  selectedGroupId,
  details,
  loading,
  onAddMember,
  onAddCourse,
}: DiscipleshipGroupDetailsProps) {
  if (!selectedGroupId) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-slate-600">
          Selecione um grupo para ver os detalhes.
        </CardContent>
      </Card>
    );
  }

  if (loading || !details) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-slate-600">
          Carregando detalhes do grupo...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                  {details.members.length} participante(s)
                </Badge>
                <Badge variant="outline">{details.courses.length} curso(s)</Badge>
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                {details.name}
              </h2>
              <p className="mt-1 text-slate-600">
                {details.description || "Sem descrição cadastrada."}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={onAddMember}
              >
                <UserPlus className="h-4 w-4" />
                Adicionar Membro
              </Button>
              <Button type="button" className="gap-2" onClick={onAddCourse}>
                <BookOpen className="h-4 w-4" />
                Vincular Curso
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Líder do grupo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {getInitials(details.leader.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-slate-900">
                  {details.leader.name}
                </p>
                <p className="text-sm text-slate-500">
                  Dados de contato não disponíveis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos vinculados</CardTitle>
            <CardDescription>Conteúdo associado ao grupo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {details.courses.length === 0 ? (
              <p className="text-sm text-slate-600">Nenhum curso vinculado.</p>
            ) : (
              details.courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                >
                  <span className="font-medium text-slate-900">
                    {course.name}
                  </span>
                  <Badge variant="outline">Curso</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membros do grupo</CardTitle>
          <CardDescription>
            Participantes retornados pelo detalhe do grupo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {details.members.length === 0 ? (
            <p className="text-sm text-slate-600">
              Nenhum membro adicionado ao grupo.
            </p>
          ) : (
            details.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-lg border border-slate-200 p-4"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-slate-900">
                  {member.name}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
