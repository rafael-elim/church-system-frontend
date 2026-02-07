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

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
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

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 h-screen w-64",
        "border-r bg-sidebar text-sidebar-foreground border-sidebar-border",
        "transition-transform duration-300",
        // MOBILE: começa fechada
        "-translate-x-full",
        // DESKTOP: sempre aberta
        "lg:translate-x-0",
        // MOBILE: quando abrir
        open && "translate-x-0"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Church className="w-8 h-8 text-sidebar-primary" />
            <span className="font-semibold">ChurchAdmin</span>
          </div>

          <button className="lg:hidden" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Usuário */}
        <div className="p-4 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-sidebar-accent">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                    {currentUser.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="text-left">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs opacity-70">{currentUser.role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Preferências</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
