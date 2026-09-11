"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { listMyCourses, MyCourseResponse } from "@/services/member-portal";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<MyCourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setCourses(await listMyCourses());
    } catch {
      setError("Não foi possível carregar seus cursos.");
      toast.error("Não foi possível carregar seus cursos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Meus Cursos</h1>
        <p className="mt-1 text-sm text-slate-600">
          Acompanhe os cursos liberados para você.
        </p>
      </div>

      {error && (
        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-6 text-sm text-red-600">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchCourses}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((item) => (
            <Card key={item}>
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-slate-600">
            Nenhum curso liberado para você no momento.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="outline">Curso</Badge>
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-base">{course.name}</CardTitle>
                <CardDescription>
                  {course.description || "Curso sem descrição cadastrada."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{course.progressPercentage}% concluído</span>
                    <span className="text-slate-600">
                      {course.completedLessonCount}/{course.lessonCount} aulas
                    </span>
                  </div>
                  <Progress value={course.progressPercentage} />
                </div>
                <Button asChild className="w-full">
                  <Link href={`/my-courses/${course.id}`}>
                    {course.progressPercentage > 0 ? "Continuar curso" : "Começar"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
