"use client";

import { Building2, MapPin, Phone, Users } from "lucide-react";

import { AdminUnavailableModule } from "@/components/organisms/admin/AdminUnavailableModule";

export default function BranchesPage() {
  return (
    <AdminUnavailableModule
      title="Congregações"
      description="Gerencie sedes, congregações, responsáveis e escopo organizacional."
      actionLabel="Nova Congregação"
      icon={Building2}
      backendNote="O backend possui entidade e repositório de Branch, mas ainda não expõe endpoints administrativos para listar, criar ou atualizar congregações."
      metrics={[
        { label: "Congregações", value: "-", description: "Sem endpoint de listagem", icon: Building2 },
        { label: "Membros Vinculados", value: "-", description: "Depende de branchId nos contratos", icon: Users },
        { label: "Responsáveis", value: "-", description: "Campo ainda não modelado", icon: Phone },
        { label: "Cidades", value: "-", description: "Cadastro pendente", icon: MapPin },
      ]}
      sections={[
        {
          value: "branches",
          label: "Congregações",
          title: "Lista de Congregações",
          description: "Visão preparada para o cadastro real de congregações.",
          items: ["Nome, endereço e contato", "Responsável pastoral", "Status operacional"],
        },
        {
          value: "coverage",
          label: "Cobertura",
          title: "Cobertura Organizacional",
          description: "Agrupamentos por cidade, bairro e escopo administrativo.",
          items: ["Distribuição por cidade", "Vínculo com membros", "Filtro por congregação"],
        },
      ]}
    />
  );
}
