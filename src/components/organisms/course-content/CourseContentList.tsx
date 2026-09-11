"use client";

import {
  BookText,
  ChevronDown,
  ChevronUp,
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Video,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseModuleResponse, LessonResponse, LessonType } from "@/services/discipleship";

interface CourseContentListProps {
  modules: CourseModuleResponse[];
  lessonsByModule: Record<string, LessonResponse[]>;
  loading: boolean;
  actionId: string;
  onCreateModule: () => void;
  onEditModule: (module: CourseModuleResponse) => void;
  onDeleteModule: (module: CourseModuleResponse) => void;
  onCreateLesson: (module: CourseModuleResponse) => void;
  onEditLesson: (module: CourseModuleResponse, lesson: LessonResponse) => void;
  onDeleteLesson: (module: CourseModuleResponse, lesson: LessonResponse) => void;
  onMoveModule: (module: CourseModuleResponse, direction: "up" | "down") => void;
  onMoveLesson: (
    module: CourseModuleResponse,
    lesson: LessonResponse,
    direction: "up" | "down"
  ) => void;
  confirmDelete: {
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  } | null;
  onCancelDelete: () => void;
}

const lessonLabels: Record<LessonType, string> = {
  VIDEO: "Vídeo",
  TEXT: "Texto",
  DOCUMENT: "Documento",
};

const lessonIcons: Record<LessonType, typeof Video> = {
  VIDEO: Video,
  TEXT: BookText,
  DOCUMENT: FileText,
};

export function CourseContentList({
  modules,
  lessonsByModule,
  loading,
  actionId,
  onCreateModule,
  onEditModule,
  onDeleteModule,
  onCreateLesson,
  onEditLesson,
  onDeleteLesson,
  onMoveModule,
  onMoveLesson,
  confirmDelete,
  onCancelDelete,
}: CourseContentListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((item) => (
          <Card key={item}>
            <CardHeader className="space-y-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-full max-w-md" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div>
            <h2 className="text-lg font-semibold">Nenhum módulo cadastrado</h2>
            <p className="mt-1 text-sm text-slate-600">
              Adicione o primeiro módulo para começar a organizar o conteúdo deste curso.
            </p>
          </div>
          <Button type="button" onClick={onCreateModule}>
            <Plus className="mr-2 h-4 w-4" />
            Criar módulo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {modules.map((module, moduleIndex) => {
          const lessons = lessonsByModule[module.id] ?? [];

          return (
            <Card key={module.id}>
              <CardHeader className="border-b">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">Módulo {module.position}</Badge>
                      {!module.active && <Badge variant="secondary">Inativo</Badge>}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{module.title}</h2>
                      {module.description && (
                        <p className="mt-1 text-sm text-slate-600">{module.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => onCreateLesson(module)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Aula
                    </Button>
                    <Button type="button" size="icon" variant="outline" disabled={moduleIndex === 0 || actionId === module.id} onClick={() => onMoveModule(module, "up")}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="icon" variant="outline" disabled={moduleIndex === modules.length - 1 || actionId === module.id} onClick={() => onMoveModule(module, "down")}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditModule(module)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteModule(module)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Desativar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {lessons.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 p-6 text-center text-sm text-slate-600">
                    <span>Nenhuma aula neste módulo.</span>
                    <Button type="button" size="sm" variant="outline" onClick={() => onCreateLesson(module)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar aula
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {lessons.map((lesson, lessonIndex) => {
                      const Icon = lessonIcons[lesson.type];

                      return (
                        <div key={lesson.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 rounded-md bg-slate-100 p-2 text-slate-700">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-medium">{lesson.title}</h3>
                                {!lesson.active && <Badge variant="secondary">Inativa</Badge>}
                              </div>
                              <p className="text-sm text-slate-600">{lessonLabels[lesson.type]}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                            <Badge variant={lesson.required ? "default" : "outline"}>
                              {lesson.required ? "Obrigatória" : "Opcional"}
                            </Badge>
                            <Button type="button" size="icon" variant="outline" disabled={lessonIndex === 0 || actionId === lesson.id} onClick={() => onMoveLesson(module, lesson, "up")}>
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button type="button" size="icon" variant="outline" disabled={lessonIndex === lessons.length - 1 || actionId === lesson.id} onClick={() => onMoveLesson(module, lesson, "down")}>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button type="button" size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEditLesson(module, lesson)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDeleteLesson(module, lesson)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Desativar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={Boolean(confirmDelete)} onOpenChange={(open) => !open && onCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDelete?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDelete?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete?.onConfirm}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
