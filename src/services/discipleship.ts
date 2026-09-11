import { api } from "@/services/api";

export interface DiscipleshipGroup {
  id: string;
  name: string;
  description: string | null;
  leaderId: string;
  active: boolean;
  companyId?: string;
  branchId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseResponse {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  active?: boolean;
  moduleCount?: number;
  lessonCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course extends CourseResponse {
  description?: string | null;
  active?: boolean;
}

export interface CourseModuleResponse {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  position: number;
  active: boolean;
  lessonCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export type LessonType = "VIDEO" | "TEXT" | "DOCUMENT";

export interface LessonResponse {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description?: string | null;
  type: LessonType;
  content?: string | null;
  videoId?: string | null;
  position: number;
  required: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseModulePayload {
  title: string;
  description?: string;
  active?: boolean;
}

export interface LessonPayload {
  title: string;
  description?: string;
  type: LessonType;
  content?: string;
  required?: boolean;
  active?: boolean;
}

export interface LeaderResponse {
  id: string;
  name: string;
}

export interface MemberSummaryResponse {
  id: string;
  name: string;
}

export interface GroupDetailsResponse {
  id: string;
  name: string;
  description: string | null;
  leader: LeaderResponse;
  members: MemberSummaryResponse[];
  courses: CourseResponse[];
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  leaderId: string;
  courseId?: string;
}

export interface AddGroupMemberRequest {
  memberId: string;
}

export interface AddGroupCourseRequest {
  courseId: string;
}

export async function listDiscipleshipGroups() {
  const response = await api.get<DiscipleshipGroup[]>("/groups");

  return response.data;
}

export async function createDiscipleshipGroup(payload: CreateGroupRequest) {
  const response = await api.post<DiscipleshipGroup>("/groups", payload);

  return response.data;
}

export async function getDiscipleshipGroupDetails(groupId: string) {
  const response = await api.get<GroupDetailsResponse>(
    `/groups/${groupId}/details`
  );

  return response.data;
}

export async function addMemberToDiscipleshipGroup(
  groupId: string,
  payload: AddGroupMemberRequest
) {
  const response = await api.post(`/groups/${groupId}/members`, payload);

  return response.data;
}

export async function addCourseToDiscipleshipGroup(
  groupId: string,
  payload: AddGroupCourseRequest
) {
  const response = await api.post(`/groups/${groupId}/courses`, payload);

  return response.data;
}

export async function listDiscipleshipCourses() {
  const response = await api.get<CourseResponse[]>("/courses");

  return response.data;
}

export async function createDiscipleshipCourse(payload: {
  name: string;
  description?: string;
  imageUrl?: string;
}) {
  const response = await api.post<Course>("/courses", payload);

  return response.data;
}

export async function getCourse(courseId: string) {
  const response = await api.get<CourseResponse>(`/courses/${courseId}`);

  return response.data;
}

export async function listCourseModules(courseId: string) {
  const response = await api.get<CourseModuleResponse[]>(
    `/courses/${courseId}/modules`
  );

  return response.data;
}

export async function createCourseModule(
  courseId: string,
  payload: CourseModulePayload
) {
  const response = await api.post<CourseModuleResponse>(
    `/courses/${courseId}/modules`,
    payload
  );

  return response.data;
}

export async function updateCourseModule(
  courseId: string,
  moduleId: string,
  payload: CourseModulePayload
) {
  const response = await api.patch<CourseModuleResponse>(
    `/courses/${courseId}/modules/${moduleId}`,
    payload
  );

  return response.data;
}

export async function deleteCourseModule(courseId: string, moduleId: string) {
  await api.delete(`/courses/${courseId}/modules/${moduleId}`);
}

export async function reorderCourseModules(
  courseId: string,
  modules: Array<{ id: string; position: number }>
) {
  const response = await api.put<CourseModuleResponse[]>(
    `/courses/${courseId}/modules/reorder`,
    { modules }
  );

  return response.data;
}

export async function listModuleLessons(courseId: string, moduleId: string) {
  const response = await api.get<LessonResponse[]>(
    `/courses/${courseId}/modules/${moduleId}/lessons`
  );

  return response.data;
}

export async function createLesson(
  courseId: string,
  moduleId: string,
  payload: LessonPayload
) {
  const response = await api.post<LessonResponse>(
    `/courses/${courseId}/modules/${moduleId}/lessons`,
    payload
  );

  return response.data;
}

export async function updateLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  payload: LessonPayload
) {
  const response = await api.patch<LessonResponse>(
    `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
    payload
  );

  return response.data;
}

export async function deleteLesson(
  courseId: string,
  moduleId: string,
  lessonId: string
) {
  await api.delete(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
}

export async function reorderModuleLessons(
  courseId: string,
  moduleId: string,
  lessons: Array<{ id: string; position: number }>
) {
  const response = await api.put<LessonResponse[]>(
    `/courses/${courseId}/modules/${moduleId}/lessons/reorder`,
    { lessons }
  );

  return response.data;
}
