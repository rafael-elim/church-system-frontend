import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MembersHeaderProps {
  onAddClick: () => void;
}

export function MembersHeader({ onAddClick }: MembersHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Membros
        </h1>
        <p className="text-slate-600">
          Gerencie todos os membros da igreja
        </p>
      </div>

      <Button onClick={onAddClick} className="gap-2">
        <Plus className="w-4 h-4" />
        Adicionar Membro
      </Button>
    </div>
  );
}
