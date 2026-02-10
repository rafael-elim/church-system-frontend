"use client";

import Link from "next/link";
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
  X,
} from "lucide-react";
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

const navigation = [
  { name: "Dashboard", href: "/home", icon: LayoutDashboard },
  { name: "Membros", href: "/members", icon: Users },
  { name: "Congregações", href: "/branches", icon: Building2 },
  { name: "Eventos", href: "/events", icon: Calendar },
  { name: "Comunicação", href: "/communication", icon: MessageSquare },
  { name: "Discipulado", href: "/discipleship", icon: BookOpen },
  { name: "Configurações", href: "/settings", icon: Settings },
];

const currentUser = {
  name: "Pastor João Silva",
  role: "Pastor",
  initials: "PJ",
};



export function Sidebar() {
  const pathname = usePathname();

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
          {navigation.map((item) => {
            const isActive = pathname === item.href;

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
                    {currentUser.initials}
                  </AvatarFallback>
                </Avatar>

                <div className={styles.userInfo}>
                  <p className={styles.userName}>{currentUser.name}</p>
                  <p className={styles.userRole}>{currentUser.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className={styles.userDropdown}>
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Preferências</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={styles.logoutItem}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
