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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LessonPayload, LessonResponse, LessonType } from "@/services/discipleship";
import { getYoutubeVideoId } from "@/utils/youtube";
import { RichTextEditor } from "./RichTextEditor";
import { YoutubeEmbed } from "./YoutubeEmbed";

const initialForm = {
  title: "",
  description: "",
  type: "VIDEO" as LessonType,
  content: "",
  required: true,
  active: true,
};

interface LessonDialogProps {
  open: boolean;
  mode: "create" | "edit";
  lesson?: LessonResponse | null;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: LessonPayload) => Promise<void>;
}

export function LessonDialog({
  open,
  mode,
  lesson,
  submitting,
  onOpenChange,
  onSubmit,
}: LessonDialogProps) {
  const [form, setForm] = useState(() =>
    mode === "edit" && lesson
      ? {
          title: lesson.title,
          description: lesson.description ?? "",
          type: lesson.type,
          content: lesson.content ?? lesson.videoId ?? "",
          required: lesson.required,
          active: lesson.active,
        }
      : initialForm
  );
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.title.trim()) {
      setError("Informe o título da aula.");
      return;
    }

    if (form.type === "VIDEO" && !getYoutubeVideoId(form.content)) {
      setError("Informe uma URL válida do YouTube.");
      return;
    }

    if (!form.content.trim()) {
      setError("Informe o conteúdo da aula.");
      return;
    }

    setError("");
    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      type: form.type,
      content: form.content.trim(),
      required: form.required,
      active: form.active,
    });
    setForm(initialForm);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nova aula" : "Editar aula"}
          </DialogTitle>
          <DialogDescription>
            Configure o conteúdo da aula conforme os tipos suportados pela API.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="course-lesson-title">Título</Label>
            <Input
              id="course-lesson-title"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Ex: Quem é Jesus?"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="course-lesson-description">Descrição</Label>
            <Textarea
              id="course-lesson-description"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Resumo da aula"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-2">
            <Label>Tipo</Label>
            <Select
              value={form.type}
              onValueChange={(type: LessonType) =>
                setForm((current) => ({ ...current, type, content: "" }))
              }
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO">Vídeo</SelectItem>
                <SelectItem value="TEXT">Texto</SelectItem>
                <SelectItem value="DOCUMENT">Documento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.type === "VIDEO" && (
            <div className="grid gap-3">
              <Label htmlFor="course-lesson-video">URL do YouTube</Label>
              <Input
                id="course-lesson-video"
                value={form.content}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
                }
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={submitting}
              />
              <YoutubeEmbed value={form.content} />
            </div>
          )}

          {form.type === "TEXT" && (
            <div className="grid gap-2">
              <Label>Conteúdo</Label>
              <RichTextEditor
                value={form.content}
                disabled={submitting}
                onChange={(content) =>
                  setForm((current) => ({ ...current, content }))
                }
              />
            </div>
          )}

          {form.type === "DOCUMENT" && (
            <div className="grid gap-2">
              <Label htmlFor="course-lesson-document">URL ou referência do documento</Label>
              <Input
                id="course-lesson-document"
                value={form.content}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
                }
                placeholder="https://..."
                disabled={submitting}
              />
            </div>
          )}

          <div className="grid gap-3 rounded-md border p-3 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="course-lesson-required">Obrigatória</Label>
              <Switch
                id="course-lesson-required"
                checked={form.required}
                onCheckedChange={(required) =>
                  setForm((current) => ({ ...current, required }))
                }
                disabled={submitting}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="course-lesson-active">Ativa</Label>
              <Switch
                id="course-lesson-active"
                checked={form.active}
                onCheckedChange={(active) =>
                  setForm((current) => ({ ...current, active }))
                }
                disabled={submitting}
              />
            </div>
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
                ? "Criar aula"
                : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
