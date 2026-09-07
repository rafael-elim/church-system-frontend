import { api } from '@/services/api';

export type MemberStatus = 'VISITOR' | 'MEMBER';

export interface MemberResponse {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: MemberStatus;
}

export interface MemberStatsResponse {
  totalMembers: number;
  newThisMonth: number;
  activeLeaders: number;
  retentionRate: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

interface ListMembersParams {
  name?: string;
  status?: MemberStatus;
  page?: number;
  size?: number;
}

export async function listMembers(params: ListMembersParams = {}) {
  const response = await api.get<PageResponse<MemberResponse>>('/members', {
    params,
  });

  return response.data;
}

export async function getMemberStats() {
  const response = await api.get<MemberStatsResponse>('/members/stats');

  return response.data;
}
