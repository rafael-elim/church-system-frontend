"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  MessageSquare,
  BookOpen,
  Settings,
  Church,
  GraduationCap,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AppPermission, can, isAdmin, isMember, isVisitor } from "@/utils/permissions";
import { cn } from "@/utils/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecules/DropdownMenu";
import { Avatar, AvatarFallback } from "@/components/atoms/Avatar";

import styles from '@/styles/sidebar.module.css';

const navigation: Array<{
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  permission: AppPermission;
}> = [
  { name: "Início", href: "/home", icon: LayoutDashboard, permission: "VIEW_HOME" },
  { name: "Membros", href: "/members", icon: Users, permission: "MANAGE_MEMBERS" },
  { name: "Congregações", href: "/branches", icon: Building2, permission: "MANAGE_BRANCHES" },
  { name: "Eventos", href: "/events", icon: Calendar, permission: "MANAGE_EVENTS" },
  { name: "Comunicação", href: "/communication", icon: MessageSquare, permission: "MANAGE_COMMUNICATION" },
  { name: "Discipulado", href: "/discipleship", icon: BookOpen, permission: "MANAGE_DISCIPLESHIP" },
  { name: "Meu Discipulado", href: "/my-discipleship", icon: BookOpen, permission: "VIEW_MY_DISCIPLESHIP" },
  { name: "Meus Grupos", href: "/my-groups", icon: Users, permission: "VIEW_MY_GROUPS" },
  { name: "Meus Cursos", href: "/my-courses", icon: GraduationCap, permission: "VIEW_MY_COURSES" },
  { name: "Perfil", href: "/profile", icon: UserCircle, permission: "VIEW_PROFILE" },
  { name: "Configurações", href: "/settings", icon: Settings, permission: "MANAGE_SETTINGS" },
];

function getInitials(name?: string) {
  return (name ?? "Usuário")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getRoleLabel(user: ReturnType<typeof useAuth>["user"]) {
  if (isAdmin(user)) return "Administrador";
  if (isMember(user)) return "Membro";
  if (isVisitor(user)) return "Visitante";
  return "Usuário";
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const menuItems = navigation.filter((item) => can(user, item.permission));

  return (
    <aside className={styles.sidebar}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarBrand}>
            <Church className={styles.sidebarIcon} />
            <span className={styles.sidebarTitle}>ChurchAdmin</span>
          </div>
        </div>


        {/* Menu */}
        <nav className={styles.sidebar_nav}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  styles.sidebar_nav_item,
                  isActive && styles.active
                )}
              >
                <item.icon className={styles.sidebar_nav_icon} />
                {item.name}
              </a>
            );
          })}
        </nav>


        {/* Usuário */}
        <div className={styles.sidebarUser}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={styles.userButton}>
                <Avatar className={styles.userAvatar}>
                  <AvatarFallback className={styles.userAvatarFallback}>
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>

                <div className={styles.userInfo}>
                  <p className={styles.userName}>{user?.name ?? "Usuário"}</p>
                  <p className={styles.userRole}>{getRoleLabel(user)}</p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className={styles.userDropdown}>
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/profile">Perfil</a>
              </DropdownMenuItem>
              <DropdownMenuItem>Preferências</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={styles.logoutItem} onClick={logout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
