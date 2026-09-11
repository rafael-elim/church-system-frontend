import { BookOpen } from "lucide-react";

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
              Conteúdo preparado para evolução do módulo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full" disabled>
              Conteúdo em breve
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
