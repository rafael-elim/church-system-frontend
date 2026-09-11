"use client";

import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MyLessonResponse } from "@/services/member-portal";
import { sanitizeHtml } from "@/utils/sanitize-html";
import { YoutubeEmbed } from "@/components/organisms/course-content/YoutubeEmbed";

interface LessonContentProps {
  lesson: MyLessonResponse;
}

export function LessonContent({ lesson }: LessonContentProps) {
  if (lesson.type === "VIDEO") {
    return <YoutubeEmbed value={lesson.content || lesson.videoId || ""} />;
  }

  if (lesson.type === "TEXT") {
    return (
      <div
        className="prose prose-sm max-w-none rounded-md border p-4"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(lesson.content ?? "") }}
      />
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-slate-100 p-2 text-slate-700">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">Documento da aula</p>
          <p className="text-sm text-slate-600">{lesson.content}</p>
        </div>
      </div>
      {lesson.content && (
        <Button asChild variant="outline">
          <a href={lesson.content} target="_blank" rel="noreferrer">
            Abrir
          </a>
        </Button>
      )}
    </div>
  );
}
