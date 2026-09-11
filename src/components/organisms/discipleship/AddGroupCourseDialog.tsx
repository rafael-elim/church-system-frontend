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
import { CourseResponse } from "@/services/discipleship";

interface AddGroupCourseDialogProps {
  open: boolean;
  courses: CourseResponse[];
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (courseId: string) => Promise<void>;
}

export function AddGroupCourseDialog({
  open,
  courses,
  submitting,
  onOpenChange,
  onSubmit,
}: AddGroupCourseDialogProps) {
  const [courseId, setCourseId] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!courseId) {
      setError("Selecione um curso.");
      return;
    }

    setError("");
    await onSubmit(courseId);
    setCourseId("");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setCourseId("");
      setError("");
    }

    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Vincular curso</DialogTitle>
          <DialogDescription>
            Adicione um curso existente a este grupo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Curso</Label>
            <Select
              value={courseId}
              onValueChange={setCourseId}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um curso" />
              </SelectTrigger>
              <SelectContent>
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
            {submitting ? "Vinculando..." : "Vincular"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
