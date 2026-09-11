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
}

export interface Course extends CourseResponse {
  description?: string | null;
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
}) {
  const response = await api.post<Course>("/courses", undefined, {
    params: payload,
  });

  return response.data;
}
