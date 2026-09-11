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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CourseResponse } from "@/services/discipleship";
import { MemberResponse } from "@/services/members";
import { GroupFormState } from "./types";

const initialGroupForm: GroupFormState = {
  name: "",
  description: "",
  leaderId: "",
  courseId: "NONE",
};

interface GroupDialogProps {
  open: boolean;
  members: MemberResponse[];
  courses: CourseResponse[];
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: GroupFormState) => Promise<void>;
}

export function GroupDialog({
  open,
  members,
  courses,
  submitting,
  onOpenChange,
  onSubmit,
}: GroupDialogProps) {
  const [form, setForm] = useState<GroupFormState>(initialGroupForm);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.name.trim()) {
      setError("Informe o nome do grupo.");
      return;
    }

    if (!form.leaderId) {
      setError("Selecione o líder do grupo.");
      return;
    }

    setError("");
    await onSubmit(form);
    setForm(initialGroupForm);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setForm(initialGroupForm);
      setError("");
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Novo grupo de discipulado</DialogTitle>
          <DialogDescription>
            Configure um grupo usando os dados suportados pela API atual.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="discipleship-group-name">Nome do grupo</Label>
            <Input
              id="discipleship-group-name"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Ex: Fundamentos da fé"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="discipleship-group-description">Descrição</Label>
            <Textarea
              id="discipleship-group-description"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Objetivo e contexto do grupo"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-2">
            <Label>Líder</Label>
            <Select
              value={form.leaderId}
              onValueChange={(leaderId) =>
                setForm((current) => ({ ...current, leaderId }))
              }
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

          <div className="grid gap-2">
            <Label>Curso inicial</Label>
            <Select
              value={form.courseId}
              onValueChange={(courseId) =>
                setForm((current) => ({ ...current, courseId }))
              }
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Opcional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Sem curso inicial</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
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
            {submitting ? "Criando..." : "Criar grupo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
