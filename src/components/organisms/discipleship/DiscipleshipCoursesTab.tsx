import Link from "next/link";
import { BookOpen, ListVideo } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseResponse } from "@/services/discipleship";

interface DiscipleshipCoursesTabProps {
  courses: CourseResponse[];
  loading: boolean;
}

export function DiscipleshipCoursesTab({
  courses,
  loading,
}: DiscipleshipCoursesTabProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-slate-600">
          Carregando cursos...
        </CardContent>
      </Card>
    );
  }

  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-slate-600">
          Nenhum curso encontrado.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span>{course.moduleCount ?? 0} módulo(s)</span>
              <span>{course.lessonCount ?? 0} aula(s)</span>
            </div>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/courses/${course.id}/content`}>
                <ListVideo className="mr-2 h-4 w-4" />
                Gerenciar conteúdo
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
