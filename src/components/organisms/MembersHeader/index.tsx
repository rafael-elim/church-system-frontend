import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddMemberDialog } from "../AddMemberDialog";

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

      {/* <MembersHeader /> */}
        <AddMemberDialog
          onAddMember={(member) => {
            console.log("Novo membro:", member);
          }}
        />
    </div>
  );
}
