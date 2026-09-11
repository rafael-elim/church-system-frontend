import { Card, CardContent } from "@/components/ui/card";

interface DiscipleshipStatsProps {
  loading: boolean;
  activeGroupsCount: number;
  coursesCount: number;
  membersCount: number;
}

export function DiscipleshipStats({
  loading,
  activeGroupsCount,
  coursesCount,
  membersCount,
}: DiscipleshipStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <p className="mb-1 text-sm text-slate-600">Grupos ativos</p>
          <p className="text-slate-900">{loading ? "-" : activeGroupsCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="mb-1 text-sm text-slate-600">Cursos disponíveis</p>
          <p className="text-slate-900">{loading ? "-" : coursesCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="mb-1 text-sm text-slate-600">Membros disponíveis</p>
          <p className="text-slate-900">{loading ? "-" : membersCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <p className="mb-1 text-sm text-slate-600">Progresso</p>
          <p className="text-sm text-slate-500">Aguardando dados</p>
        </CardContent>
      </Card>
    </div>
  );
}
