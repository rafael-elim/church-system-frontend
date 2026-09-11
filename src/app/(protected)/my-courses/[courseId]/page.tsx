"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BookText, CheckCircle2, Circle, FileText, PlayCircle, Video } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyCourse, MyCourseContentResponse, MyCourseLessonSummaryResponse } from "@/services/member-portal";

const icons = {
  VIDEO: Video,
  TEXT: BookText,
  DOCUMENT: FileText,
};

function lessonStatusIcon(lesson: MyCourseLessonSummaryResponse) {
  if (lesson.completed) {
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  }

  return <Circle className="h-4 w-4 text-slate-400" />;
}

export default function MyCoursePage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const [course, setCourse] = useState<MyCourseContentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourse = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setCourse(await getMyCourse(courseId));
    } catch {
      setError("Não foi possível carregar este curso.");
      toast.error("Não foi possível carregar este curso.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const firstAvailableLesson = course?.modules
    .flatMap((module) => module.lessons)
    .find((lesson) => !lesson.completed) ?? course?.modules.flatMap((module) => module.lessons)[0];

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="px-0">
        <Link href="/my-courses">Voltar para meus cursos</Link>
      </Button>

      {loading ? (
        <Card>
          <CardHeader className="space-y-3">
            <Skeleton className="h-7 w-60" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-6 text-sm text-red-600">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchCourse}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : course ? (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">{course.name}</h1>
              <p className="mt-1 text-sm text-slate-600">
                {course.description || "Acompanhe seu avanço neste curso."}
              </p>
            </div>
            {firstAvailableLesson && (
              <Button asChild>
                <Link href={`/my-courses/${course.id}/lessons/${firstAvailableLesson.id}`}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Continuar
                </Link>
              </Button>
            )}
          </div>

          <Card>
            <CardContent className="space-y-2 p-4">
              <div className="flex justify-between text-sm">
                <span>Progresso do curso</span>
                <span>{course.progressPercentage}%</span>
              </div>
              <Progress value={course.progressPercentage} />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {course.modules.map((module) => (
              <Card key={module.id}>
                <CardHeader>
                  <Badge variant="outline" className="w-fit">Módulo {module.position}</Badge>
                  <CardTitle className="text-base">{module.title}</CardTitle>
                  {module.description && (
                    <CardDescription>{module.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="divide-y p-0">
                  {module.lessons.length === 0 ? (
                    <div className="p-4 text-sm text-slate-600">
                      Nenhuma aula disponível neste módulo.
                    </div>
                  ) : (
                    module.lessons.map((lesson) => {
                      const Icon = icons[lesson.type];

                      return (
                        <Link
                          key={lesson.id}
                          href={`/my-courses/${course.id}/lessons/${lesson.id}`}
                          className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-slate-50"
                        >
                          <div className="flex items-center gap-3">
                            {lessonStatusIcon(lesson)}
                            <div className="rounded-md bg-slate-100 p-2 text-slate-700">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{lesson.title}</p>
                              <p className="text-sm text-slate-600">
                                {lesson.required ? "Obrigatória" : "Opcional"}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
