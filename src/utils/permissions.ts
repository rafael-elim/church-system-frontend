import { AuthUser } from "@/types/auth-user";

export type AppPermission =
  | "VIEW_HOME"
  | "VIEW_PROFILE"
  | "MANAGE_MEMBERS"
  | "MANAGE_DISCIPLESHIP"
  | "MANAGE_COURSE_CONTENT"
  | "VIEW_MY_DISCIPLESHIP"
  | "VIEW_MY_GROUPS"
  | "VIEW_MY_COURSES";

const adminRoles = ["ADMIN_GLOBAL", "ADMIN_BRANCH"];

export function isAdmin(user: AuthUser | null) {
  return Boolean(user?.roles?.some((role) => adminRoles.includes(role)));
}

export function isMember(user: AuthUser | null) {
  return user?.memberStatus === "MEMBER" || user?.roles?.includes("MEMBER");
}

export function isVisitor(user: AuthUser | null) {
  return user?.memberStatus === "VISITOR" && !isAdmin(user);
}

export function can(user: AuthUser | null, permission: AppPermission) {
  if (!user) {
    return false;
  }

  if (permission === "VIEW_HOME" || permission === "VIEW_PROFILE") {
    return true;
  }

  if (
    permission === "MANAGE_MEMBERS" ||
    permission === "MANAGE_DISCIPLESHIP" ||
    permission === "MANAGE_COURSE_CONTENT"
  ) {
    return isAdmin(user);
  }

  if (
    permission === "VIEW_MY_DISCIPLESHIP" ||
    permission === "VIEW_MY_GROUPS" ||
    permission === "VIEW_MY_COURSES"
  ) {
    return isMember(user);
  }

  return false;
}

export function getDefaultAuthenticatedPath(user: AuthUser | null) {
  if (isAdmin(user)) {
    return "/home";
  }

  if (isMember(user)) {
    return "/my-courses";
  }

  return "/profile";
}

export function permissionForPath(pathname: string): AppPermission | null {
  if (pathname.startsWith("/members")) return "MANAGE_MEMBERS";
  if (pathname.startsWith("/discipleship")) return "MANAGE_DISCIPLESHIP";
  if (pathname.includes("/content")) return "MANAGE_COURSE_CONTENT";
  if (pathname.startsWith("/my-discipleship")) return "VIEW_MY_DISCIPLESHIP";
  if (pathname.startsWith("/my-groups")) return "VIEW_MY_GROUPS";
  if (pathname.startsWith("/my-courses")) return "VIEW_MY_COURSES";
  if (pathname.startsWith("/profile")) return "VIEW_PROFILE";
  if (pathname.startsWith("/home")) return "VIEW_HOME";

  return null;
}
