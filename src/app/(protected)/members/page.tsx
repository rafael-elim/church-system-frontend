'use client';

import { MembersHeader } from "@/components/organisms/MembersHeader";
import { MembersFilters } from "@/components/organisms/MembersFilters";
import { MembersTable } from "@/components/organisms/MembersTable";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const mockMembers = [
    {
      id: 1,
      name: "Maria Silva Santos",
      email: "maria.silva@email.com",
      phone: "(11) 98765-4321",
      branch: "Central",
      role: "Membro",
      status: "Ativo",
      joined: "15/03/2020",
      initials: "MS",
    },
    {
      id: 2,
      name: "José Carlos Oliveira",
      email: "jose.carlos@email.com",
      phone: "(11) 97654-3210",
      branch: "Zona Norte",
      role: "Líder",
      status: "Ativo",
      joined: "22/07/2019",
      initials: "JC",
    },
    {
      id: 3,
      name: "Ana Paula Costa",
      email: "ana.paula@email.com",
      phone: "(11) 96543-2109",
      branch: "Central",
      role: "Secretária",
      status: "Ativo",
      joined: "10/01/2021",
      initials: "AP",
    },
    {
      id: 4,
      name: "Pedro Henrique Alves",
      email: "pedro.alves@email.com",
      phone: "(11) 95432-1098",
      branch: "Zona Sul",
      role: "Membro",
      status: "Ativo",
      joined: "05/08/2022",
      initials: "PH",
    },
    {
      id: 5,
      name: "Juliana Ferreira Lima",
      email: "juliana.lima@email.com",
      phone: "(11) 94321-0987",
      branch: "Centro",
      role: "Líder",
      status: "Ativo",
      joined: "18/11/2020",
      initials: "JF",
    },
  ];

  

export default function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("Todas");
  const [selectedRole, setSelectedRole] = useState("Todos");

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranch === "Todas" ||
      member.branch === selectedBranch;

    const matchesRole =
      selectedRole === "Todos" ||
      member.role === selectedRole;

    return matchesSearch && matchesBranch && matchesRole;
  });


  return (
    <div className="space-y-6">
      <MembersHeader onAddClick={() => console.log("Abrir modal")} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-1">Total de Membros</p>
            <p className="text-slate-900">1,248</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-1">Novos Este Mês</p>
            <p className="text-slate-900 text-green-600">+24</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-1">Líderes Ativos</p>
            <p className="text-slate-900">42</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-1">Taxa de Retenção</p>
            <p className="text-slate-900">94%</p>
          </CardContent>
        </Card>
      </div>

      <MembersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />

      <MembersTable members={filteredMembers} />
    </div>
  );
}
