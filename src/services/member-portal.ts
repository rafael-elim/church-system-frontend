import { api } from "@/services/api";
import { CourseResponse, LessonType } from "@/services/discipleship";

export interface MyCourseResponse {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  moduleCount: number;
  lessonCount: number;
  completedLessonCount: number;
  progressPercentage: number;
  enrollmentId?: string | null;
}

export interface MyGroupResponse {
  id: string;
  name: string;
  description?: string | null;
  leader?: {
    id: string;
    name: string;
  } | null;
  courses: CourseResponse[];
}

export interface MyCourseContentResponse {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  progressPercentage: number;
  modules: MyCourseModuleResponse[];
}

export interface MyCourseModuleResponse {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  lessons: MyCourseLessonSummaryResponse[];
}

export interface MyCourseLessonSummaryResponse {
  id: string;
  title: string;
  type: LessonType;
  position: number;
  required: boolean;
  completed: boolean;
}

export interface MyLessonResponse {
  id: string;
  courseId: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  description?: string | null;
  type: LessonType;
  content?: string | null;
  videoId?: string | null;
  position: number;
  required: boolean;
  completed: boolean;
  previousLessonId?: string | null;
  nextLessonId?: string | null;
  courseProgressPercentage: number;
}

export async function listMyCourses() {
  const response = await api.get<MyCourseResponse[]>("/me/courses");

  return response.data;
}

export async function listMyGroups() {
  const response = await api.get<MyGroupResponse[]>("/me/groups");

  return response.data;
}

export async function getMyCourse(courseId: string) {
  const response = await api.get<MyCourseContentResponse>(`/me/courses/${courseId}`);

  return response.data;
}

export async function getMyLesson(courseId: string, lessonId: string) {
  const response = await api.get<MyLessonResponse>(
    `/me/courses/${courseId}/lessons/${lessonId}`
  );

  return response.data;
}

export async function updateMyLessonProgress(
  courseId: string,
  lessonId: string,
  completed: boolean
) {
  const response = await api.put(
    `/me/courses/${courseId}/lessons/${lessonId}/progress`,
    { completed }
  );

  return response.data;
}
