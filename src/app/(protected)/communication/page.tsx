"use client";

import { Bell, Mail, MessageSquare, Send, Users } from "lucide-react";

import { AdminUnavailableModule } from "@/components/organisms/admin/AdminUnavailableModule";

export default function CommunicationPage() {
  return (
    <AdminUnavailableModule
      title="Comunicação"
      description="Planeje mensagens, modelos e audiências para comunicação com a igreja."
      actionLabel="Nova Mensagem"
      icon={Send}
      backendNote="O backend ainda não possui serviços de mensagens, modelos, notificações ou integrações de envio."
      metrics={[
        { label: "Mensagens", value: "-", description: "Histórico pendente", icon: MessageSquare },
        { label: "Destinatários", value: "-", description: "Audiências pendentes", icon: Users },
        { label: "E-mails", value: "-", description: "Canal pendente", icon: Mail },
        { label: "Notificações", value: "-", description: "Canal pendente", icon: Bell },
      ]}
      sections={[
        {
          value: "messages",
          label: "Mensagens",
          title: "Histórico de Mensagens",
          description: "Área preparada para envios por e-mail, SMS ou notificação.",
          items: ["Assunto e conteúdo", "Canal de envio", "Status e data de envio"],
        },
        {
          value: "templates",
          label: "Modelos",
          title: "Modelos de Comunicação",
          description: "Templates reutilizáveis para mensagens recorrentes.",
          items: ["Lembrete de culto", "Convite para evento", "Boletim semanal"],
        },
      ]}
    />
  );
}
