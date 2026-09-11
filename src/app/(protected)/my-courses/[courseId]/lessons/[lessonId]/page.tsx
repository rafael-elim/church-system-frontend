"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { LessonContent } from "@/components/organisms/member-portal/LessonContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getMyLesson, MyLessonResponse, updateMyLessonProgress } from "@/services/member-portal";

export default function MyLessonPage() {
  const params = useParams<{ courseId: string; lessonId: string }>();
  const router = useRouter();
  const { courseId, lessonId } = params;
  const [lesson, setLesson] = useState<MyLessonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchLesson = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setLesson(await getMyLesson(courseId, lessonId));
    } catch {
      setError("Não foi possível carregar esta aula.");
      toast.error("Não foi possível carregar esta aula.");
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  async function markCompleted() {
    setSubmitting(true);

    try {
      await updateMyLessonProgress(courseId, lessonId, true);
      toast.success("Aula marcada como concluída.");
      if (lesson?.nextLessonId) {
        router.push(`/my-courses/${courseId}/lessons/${lesson.nextLessonId}`);
      } else {
        await fetchLesson();
      }
    } catch {
      toast.error("Não foi possível atualizar o progresso.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="px-0">
        <Link href={`/my-courses/${courseId}`}>Voltar para o curso</Link>
      </Button>

      {loading ? (
        <Card>
          <CardHeader className="space-y-3">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-6 text-sm text-red-600">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchLesson}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : lesson ? (
        <>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{lesson.moduleTitle}</Badge>
              <Badge variant={lesson.completed ? "default" : "secondary"}>
                {lesson.completed ? "Concluída" : "Em andamento"}
              </Badge>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">{lesson.title}</h1>
              {lesson.description && (
                <p className="mt-1 text-sm text-slate-600">{lesson.description}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso do curso</span>
                <span>{lesson.courseProgressPercentage}%</span>
              </div>
              <Progress value={lesson.courseProgressPercentage} />
            </div>
          </div>

          <LessonContent lesson={lesson} />

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button asChild variant="outline" disabled={!lesson.previousLessonId}>
              <Link href={lesson.previousLessonId ? `/my-courses/${courseId}/lessons/${lesson.previousLessonId}` : "#"}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Aula anterior
              </Link>
            </Button>

            <Button onClick={markCompleted} disabled={submitting || lesson.completed}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {lesson.completed ? "Aula concluída" : "Marcar como concluída"}
            </Button>

            <Button asChild variant="outline" disabled={!lesson.nextLessonId}>
              <Link href={lesson.nextLessonId ? `/my-courses/${courseId}/lessons/${lesson.nextLessonId}` : "#"}>
                Próxima aula
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
