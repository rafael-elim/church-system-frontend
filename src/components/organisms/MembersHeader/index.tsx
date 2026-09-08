import { AddMemberDialog } from "../AddMemberDialog";
import { Button } from "@/components/ui/button";
import { CreateMemberRequest, MemberResponse } from "@/services/members";
import { Plus } from "lucide-react";

interface MembersHeaderProps {
  modalOpen: boolean;
  mode: "create" | "edit";
  selectedMember: MemberResponse | null;
  onNewMember: () => void;
  onModalOpenChange: (open: boolean) => void;
  onSubmitMember: (member: CreateMemberRequest) => Promise<void>;
}

export function MembersHeader({
  modalOpen,
  mode,
  selectedMember,
  onNewMember,
  onModalOpenChange,
  onSubmitMember,
}: MembersHeaderProps) {
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

      <Button className="gap-2" onClick={onNewMember}>
        <Plus className="w-4 h-4" />
        Adicionar Membro
      </Button>

      <AddMemberDialog
        open={modalOpen}
        mode={mode}
        member={selectedMember}
        onOpenChange={onModalOpenChange}
        onSubmitMember={onSubmitMember}
      />
    </div>
  );
}
