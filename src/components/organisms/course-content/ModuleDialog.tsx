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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  CourseModulePayload,
  CourseModuleResponse,
} from "@/services/discipleship";

const initialForm = {
  title: "",
  description: "",
  active: true,
};

interface ModuleDialogProps {
  open: boolean;
  mode: "create" | "edit";
  module?: CourseModuleResponse | null;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CourseModulePayload) => Promise<void>;
}

export function ModuleDialog({
  open,
  mode,
  module,
  submitting,
  onOpenChange,
  onSubmit,
}: ModuleDialogProps) {
  const [form, setForm] = useState(() =>
    mode === "edit" && module
      ? {
          title: module.title,
          description: module.description ?? "",
          active: module.active,
        }
      : initialForm
  );
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.title.trim()) {
      setError("Informe o título do módulo.");
      return;
    }

    setError("");
    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      active: form.active,
    });
    setForm(initialForm);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo módulo" : "Editar módulo"}
          </DialogTitle>
          <DialogDescription>
            Organize uma etapa do conteúdo deste curso.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="course-module-title">Título</Label>
            <Input
              id="course-module-title"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Ex: Conhecendo Jesus"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="course-module-description">Descrição</Label>
            <Textarea
              id="course-module-description"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Resumo do módulo"
              disabled={submitting}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="course-module-active">Ativo</Label>
            <Switch
              id="course-module-active"
              checked={form.active}
              onCheckedChange={(active) =>
                setForm((current) => ({ ...current, active }))
              }
              disabled={submitting}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting
              ? "Salvando..."
              : mode === "create"
                ? "Criar módulo"
                : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
