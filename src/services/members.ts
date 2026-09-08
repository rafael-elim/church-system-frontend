import { api } from '@/services/api';

export type MemberStatus = 'VISITOR' | 'MEMBER';

export interface MemberResponse {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  birthDate: string | null;
  baptismDate: string | null;
  address: string | null;
  status: MemberStatus;
}

export interface MemberStatsResponse {
  totalMembers: number;
  newThisMonth: number;
  activeLeaders: number;
  retentionRate: number;
}

export interface CreateMemberRequest {
  name: string;
  status: MemberStatus;
  birthDate?: string;
  baptismDate?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export type UpdateMemberRequest = CreateMemberRequest;

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface MemberFilters {
  name?: string;
  status?: MemberStatus;
  page?: number;
  size?: number;
}

export async function listMembers(params: MemberFilters = {}) {
  const response = await api.get<PageResponse<MemberResponse>>('/members', {
    params,
  });

  return response.data;
}

export async function createMember(payload: CreateMemberRequest) {
  const response = await api.post('/members', payload);

  return response.data as MemberResponse;
}

export async function updateMember(id: string, payload: UpdateMemberRequest) {
  const response = await api.put<MemberResponse>(`/members/${id}`, payload);

  return response.data;
}

export async function getMemberStats() {
  const response = await api.get<MemberStatsResponse>('/members/stats');

  return response.data;
}
