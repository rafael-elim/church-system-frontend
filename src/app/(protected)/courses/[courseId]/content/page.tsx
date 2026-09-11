"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CourseContentList } from "@/components/organisms/course-content/CourseContentList";
import { LessonDialog } from "@/components/organisms/course-content/LessonDialog";
import { ModuleDialog } from "@/components/organisms/course-content/ModuleDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CourseModulePayload,
  CourseModuleResponse,
  CourseResponse,
  createCourseModule,
  createLesson,
  deleteCourseModule,
  deleteLesson,
  getCourse,
  LessonPayload,
  LessonResponse,
  listCourseModules,
  listModuleLessons,
  reorderCourseModules,
  reorderModuleLessons,
  updateCourseModule,
  updateLesson,
} from "@/services/discipleship";

type ModuleDialogState =
  | { open: false; mode: "create"; module: null }
  | { open: true; mode: "create"; module: null }
  | { open: true; mode: "edit"; module: CourseModuleResponse };

type LessonDialogState =
  | { open: false; mode: "create"; module: null; lesson: null }
  | { open: true; mode: "create"; module: CourseModuleResponse; lesson: null }
  | {
      open: true;
      mode: "edit";
      module: CourseModuleResponse;
      lesson: LessonResponse;
    };

export default function CourseContentPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const courseId = params.courseId;

  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [modules, setModules] = useState<CourseModuleResponse[]>([]);
  const [lessonsByModule, setLessonsByModule] = useState<
    Record<string, LessonResponse[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState("");
  const [moduleDialog, setModuleDialog] = useState<ModuleDialogState>({
    open: false,
    mode: "create",
    module: null,
  });
  const [lessonDialog, setLessonDialog] = useState<LessonDialogState>({
    open: false,
    mode: "create",
    module: null,
    lesson: null,
  });
  const [confirmDelete, setConfirmDelete] = useState<{
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  const orderedModules = useMemo(
    () => [...modules].sort((a, b) => a.position - b.position),
    [modules]
  );

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [courseResponse, modulesResponse] = await Promise.all([
        getCourse(courseId),
        listCourseModules(courseId),
      ]);

      const lessonsEntries = await Promise.all(
        modulesResponse.map(async (module) => {
          const lessons = await listModuleLessons(courseId, module.id);
          return [
            module.id,
            lessons.sort((a, b) => a.position - b.position),
          ] as const;
        })
      );

      setCourse(courseResponse);
      setModules(modulesResponse.sort((a, b) => a.position - b.position));
      setLessonsByModule(Object.fromEntries(lessonsEntries));
    } catch {
      setError("Não foi possível carregar os módulos deste curso.");
      toast.error("Não foi possível carregar os módulos deste curso.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  async function handleSubmitModule(payload: CourseModulePayload) {
    setSubmitting(true);

    try {
      if (moduleDialog.mode === "edit") {
        await updateCourseModule(courseId, moduleDialog.module.id, payload);
        toast.success("Módulo atualizado com sucesso.");
      } else {
        await createCourseModule(courseId, payload);
        toast.success("Módulo criado com sucesso.");
      }

      setModuleDialog({ open: false, mode: "create", module: null });
      await fetchContent();
    } catch {
      toast.error("Não foi possível salvar o módulo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmitLesson(payload: LessonPayload) {
    if (!lessonDialog.module) {
      return;
    }

    setSubmitting(true);

    try {
      if (lessonDialog.mode === "edit" && lessonDialog.lesson) {
        await updateLesson(
          courseId,
          lessonDialog.module.id,
          lessonDialog.lesson.id,
          payload
        );
        toast.success("Aula atualizada com sucesso.");
      } else {
        await createLesson(courseId, lessonDialog.module.id, payload);
        toast.success("Aula criada com sucesso.");
      }

      setLessonDialog({
        open: false,
        mode: "create",
        module: null,
        lesson: null,
      });
      await fetchContent();
    } catch {
      toast.error("Não foi possível salvar a aula.");
    } finally {
      setSubmitting(false);
    }
  }

  async function moveModule(module: CourseModuleResponse, direction: "up" | "down") {
    const currentIndex = orderedModules.findIndex((item) => item.id === module.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= orderedModules.length) {
      return;
    }

    setActionId(module.id);
    try {
      const nextModules = [...orderedModules];
      [nextModules[currentIndex], nextModules[targetIndex]] = [
        nextModules[targetIndex],
        nextModules[currentIndex],
      ];
      await reorderCourseModules(
        courseId,
        nextModules.map((item, index) => ({
          id: item.id,
          position: index + 1,
        }))
      );
      toast.success("Módulos reordenados com sucesso.");
      await fetchContent();
    } catch {
      toast.error("Não foi possível reordenar os módulos.");
    } finally {
      setActionId("");
    }
  }

  async function moveLesson(
    module: CourseModuleResponse,
    lesson: LessonResponse,
    direction: "up" | "down"
  ) {
    const lessons = [...(lessonsByModule[module.id] ?? [])].sort(
      (a, b) => a.position - b.position
    );
    const currentIndex = lessons.findIndex((item) => item.id === lesson.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= lessons.length) {
      return;
    }

    setActionId(lesson.id);
    try {
      [lessons[currentIndex], lessons[targetIndex]] = [
        lessons[targetIndex],
        lessons[currentIndex],
      ];
      await reorderModuleLessons(
        courseId,
        module.id,
        lessons.map((item, index) => ({
          id: item.id,
          position: index + 1,
        }))
      );
      toast.success("Aulas reordenadas com sucesso.");
      await fetchContent();
    } catch {
      toast.error("Não foi possível reordenar as aulas.");
    } finally {
      setActionId("");
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/discipleship">Cursos</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{course?.name ?? "Curso"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Button
            type="button"
            variant="ghost"
            className="px-0"
            onClick={() => router.push("/discipleship")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">
              {course?.name ?? "Conteúdo do curso"}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Gerencie os módulos e aulas deste curso.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() =>
            setModuleDialog({ open: true, mode: "create", module: null })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo módulo
        </Button>
      </div>

      {error && (
        <Card>
          <CardContent className="flex flex-col gap-3 p-6 text-sm text-red-600 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={fetchContent}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      <CourseContentList
        modules={orderedModules}
        lessonsByModule={lessonsByModule}
        loading={loading}
        actionId={actionId}
        onCreateModule={() =>
          setModuleDialog({ open: true, mode: "create", module: null })
        }
        onEditModule={(module) =>
          setModuleDialog({ open: true, mode: "edit", module })
        }
        onDeleteModule={(module) =>
          setConfirmDelete({
            title: "Desativar módulo?",
            description:
              "Tem certeza que deseja desativar este módulo? As aulas relacionadas podem deixar de aparecer nos fluxos ativos.",
            onConfirm: async () => {
              await deleteCourseModule(courseId, module.id);
              toast.success("Módulo desativado com sucesso.");
              setConfirmDelete(null);
              await fetchContent();
            },
          })
        }
        onCreateLesson={(module) =>
          setLessonDialog({ open: true, mode: "create", module, lesson: null })
        }
        onEditLesson={(module, lesson) =>
          setLessonDialog({ open: true, mode: "edit", module, lesson })
        }
        onDeleteLesson={(module, lesson) =>
          setConfirmDelete({
            title: "Desativar aula?",
            description:
              "Tem certeza que deseja desativar esta aula? O histórico de progresso existente não será removido pela API atual.",
            onConfirm: async () => {
              await deleteLesson(courseId, module.id, lesson.id);
              toast.success("Aula desativada com sucesso.");
              setConfirmDelete(null);
              await fetchContent();
            },
          })
        }
        onMoveModule={moveModule}
        onMoveLesson={moveLesson}
        confirmDelete={confirmDelete}
        onCancelDelete={() => setConfirmDelete(null)}
      />

      <ModuleDialog
        key={`${moduleDialog.mode}-${moduleDialog.module?.id ?? "new"}-${moduleDialog.open}`}
        open={moduleDialog.open}
        mode={moduleDialog.mode}
        module={moduleDialog.module}
        submitting={submitting}
        onOpenChange={(open) =>
          setModuleDialog({ open, mode: "create", module: null })
        }
        onSubmit={handleSubmitModule}
      />

      <LessonDialog
        key={`${lessonDialog.mode}-${lessonDialog.lesson?.id ?? lessonDialog.module?.id ?? "new"}-${lessonDialog.open}`}
        open={lessonDialog.open}
        mode={lessonDialog.mode}
        lesson={lessonDialog.lesson}
        submitting={submitting}
        onOpenChange={() =>
          setLessonDialog({
            open: false,
            mode: "create",
            module: null,
            lesson: null,
          })
        }
        onSubmit={handleSubmitLesson}
      />
    </div>
  );
}
