"use client";

import { Calendar, CheckCircle2, Clock, Users } from "lucide-react";

import { AdminUnavailableModule } from "@/components/organisms/admin/AdminUnavailableModule";

export default function EventsPage() {
  return (
    <AdminUnavailableModule
      title="Eventos"
      description="Organize cultos, agendas, inscrições e acompanhamento de presença."
      actionLabel="Criar Evento"
      icon={Calendar}
      backendNote="Ainda não há domínio nem endpoints de eventos no backend. A tela foi criada no frontend principal sem persistência falsa."
      metrics={[
        { label: "Próximos Eventos", value: "-", description: "Cadastro pendente", icon: Calendar },
        { label: "Presenças", value: "-", description: "Check-in pendente", icon: CheckCircle2 },
        { label: "Inscritos", value: "-", description: "Inscrições pendentes", icon: Users },
        { label: "Agenda", value: "-", description: "Calendário pendente", icon: Clock },
      ]}
      sections={[
        {
          value: "upcoming",
          label: "Próximos",
          title: "Próximos Eventos",
          description: "Lista e cards conforme referência visual do painel administrativo.",
          items: ["Cultos e celebrações", "Estudos e conferências", "Eventos por congregação"],
        },
        {
          value: "history",
          label: "Histórico",
          title: "Eventos Anteriores",
          description: "Área preparada para métricas de participação e histórico.",
          items: ["Participantes confirmados", "Capacidade do evento", "Status de conclusão"],
        },
      ]}
    />
  );
}
