export interface AuthUser {
  id: string;
  email: string;
  name: string;
  companyId: string;
  roles?: string[];
  memberId?: string | null;
  memberStatus?: "VISITOR" | "MEMBER" | null;
}
