"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Building2, GraduationCap, MessageSquare, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listDiscipleshipCourses, listDiscipleshipGroups } from "@/services/discipleship";
import { getMemberStats, type MemberStatsResponse } from "@/services/members";

type DashboardState = {
  memberStats: MemberStatsResponse | null;
  groups: number;
  courses: number;
  loading: boolean;
  error: string | null;
};

const initialState: DashboardState = {
  memberStats: null,
  groups: 0,
  courses: 0,
  loading: true,
  error: null,
};

function formatNumber(value: number | undefined) {
  if (value === undefined) return "-";
  return new Intl.NumberFormat("pt-BR").format(value);
}

export default function HomePage() {
  const [state, setState] = useState<DashboardState>(initialState);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [memberStats, groups, courses] = await Promise.all([
          getMemberStats(),
          listDiscipleshipGroups(),
          listDiscipleshipCourses(),
        ]);

        if (!active) return;

        setState({
          memberStats,
          groups: groups.length,
          courses: courses.length,
          loading: false,
          error: null,
        });
      } catch {
        if (!active) return;
        setState((current) => ({
          ...current,
          loading: false,
          error: "Não foi possível carregar todos os indicadores do painel.",
        }));
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const cards = useMemo(
    () => [
      {
        title: "Total de Membros",
        value: state.loading ? "..." : formatNumber(state.memberStats?.totalMembers),
        description: `${formatNumber(state.memberStats?.newThisMonth)} novos neste mês`,
        icon: Users,
      },
      {
        title: "Grupos de Discipulado",
        value: state.loading ? "..." : formatNumber(state.groups),
        description: "Grupos cadastrados no backend",
        icon: BookOpen,
      },
      {
        title: "Cursos",
        value: state.loading ? "..." : formatNumber(state.courses),
        description: "Cursos disponíveis para discipulado",
        icon: GraduationCap,
      },
      {
        title: "Retenção",
        value: state.loading ? "..." : `${state.memberStats?.retentionRate ?? 0}%`,
        description: "Indicador atual do módulo de membros",
        icon: TrendingUp,
      },
    ],
    [state],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Visão geral administrativa da igreja.</p>
      </div>

      {state.error && (
        <Card className="rounded-lg border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-sm text-amber-800">{state.error}</CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="rounded-lg">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-slate-600">{card.title}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{card.value}</p>
                <p className="mt-1 text-xs text-slate-500">{card.description}</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <card.icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Operação Administrativa</CardTitle>
            <CardDescription>Módulos implementados no frontend principal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Membros", "Integrado ao backend"],
              ["Discipulado", "Integrado ao backend"],
              ["Congregações", "Tela criada, API pendente"],
              ["Eventos", "Tela criada, API pendente"],
              ["Comunicação", "Tela criada, API pendente"],
            ].map(([label, status]) => (
              <div key={label} className="flex items-center justify-between rounded-md border border-slate-200 p-4">
                <span className="text-sm font-medium text-slate-800">{label}</span>
                <Badge variant="outline">{status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Próximas Integrações</CardTitle>
            <CardDescription>Áreas do Figma que já estão navegáveis, aguardando contrato de API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 size-5 text-blue-700" />
              <div>
                <p className="text-sm font-medium text-slate-900">Congregações</p>
                <p className="text-sm text-slate-600">Expor endpoints tenant-safe para Branch antes de permitir gravação.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="mt-0.5 size-5 text-blue-700" />
              <div>
                <p className="text-sm font-medium text-slate-900">Comunicação e Eventos</p>
                <p className="text-sm text-slate-600">Modelar domínio, permissões e auditoria antes de enviar mensagens ou registrar presença.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
