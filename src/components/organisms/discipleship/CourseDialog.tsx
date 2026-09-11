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
import { Textarea } from "@/components/ui/textarea";
import { CourseFormState } from "./types";

interface CourseDialogProps {
  open: boolean;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: CourseFormState) => Promise<void>;
}

export function CourseDialog({
  open,
  submitting,
  onOpenChange,
  onSubmit,
}: CourseDialogProps) {
  const [form, setForm] = useState<CourseFormState>({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.name.trim()) {
      setError("Informe o nome do curso.");
      return;
    }

    setError("");
    await onSubmit(form);
    setForm({ name: "", description: "" });
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setForm({ name: "", description: "" });
      setError("");
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo curso</DialogTitle>
          <DialogDescription>
            Cadastre um curso disponível para grupos de discipulado.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="discipleship-course-name">Nome do curso</Label>
            <Input
              id="discipleship-course-name"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Ex: Fundamentos da fé"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="discipleship-course-description">Descrição</Label>
            <Textarea
              id="discipleship-course-description"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Resumo do conteúdo do curso"
              disabled={submitting}
            />
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
            {submitting ? "Criando..." : "Criar curso"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
