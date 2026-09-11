import { Eye, MoreVertical, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DiscipleshipGroup } from "@/services/discipleship";

interface DiscipleshipGroupsTabProps {
  groups: DiscipleshipGroup[];
  loading: boolean;
  getLeaderName: (group: DiscipleshipGroup) => string;
  onSelectGroup: (groupId: string) => void;
}

export function DiscipleshipGroupsTab({
  groups,
  loading,
  getLeaderName,
  onSelectGroup,
}: DiscipleshipGroupsTabProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-slate-600">
          Carregando grupos...
        </CardContent>
      </Card>
    );
  }

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-slate-600">
          Nenhum grupo encontrado.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {groups.map((group) => (
        <Card key={group.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <Badge
                    className={
                      group.active
                        ? "bg-green-50 text-green-700 hover:bg-green-50"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                    }
                  >
                    {group.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <CardDescription>
                  Líder: {getLeaderName(group)}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSelectGroup(group.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalhes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="min-h-10 text-sm text-slate-600">
              {group.description || "Sem descrição cadastrada."}
            </p>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Users className="h-4 w-4 text-slate-400" />
                Participantes e cursos
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onSelectGroup(group.id)}
              >
                Ver detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
