import { BookOpen, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DiscipleshipHeaderProps {
  onNewCourse: () => void;
  onNewGroup: () => void;
}

export function DiscipleshipHeader({
  onNewCourse,
  onNewGroup,
}: DiscipleshipHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Discipulado
        </h1>
        <p className="text-slate-600">
          Gerencie grupos, cursos e participantes do discipulado
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={onNewCourse}
        >
          <BookOpen className="h-4 w-4" />
          Novo Curso
        </Button>
        <Button type="button" className="gap-2" onClick={onNewGroup}>
          <Plus className="h-4 w-4" />
          Novo Grupo
        </Button>
      </div>
    </div>
  );
}
