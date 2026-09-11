"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemberResponse } from "@/services/members";

interface AddGroupMemberDialogProps {
  open: boolean;
  members: MemberResponse[];
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (memberId: string) => Promise<void>;
}

export function AddGroupMemberDialog({
  open,
  members,
  submitting,
  onOpenChange,
  onSubmit,
}: AddGroupMemberDialogProps) {
  const [memberId, setMemberId] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!memberId) {
      setError("Selecione um membro.");
      return;
    }

    setError("");
    await onSubmit(memberId);
    setMemberId("");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setMemberId("");
      setError("");
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Adicionar membro ao grupo</DialogTitle>
          <DialogDescription>
            Selecione um membro da igreja para participar deste grupo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Membro</Label>
            <Select
              value={memberId}
              onValueChange={setMemberId}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um membro" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
