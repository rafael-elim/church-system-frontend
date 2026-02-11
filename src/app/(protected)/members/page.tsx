'use client';

import { MembersHeader } from "@/components/molecules/MembersHeader";
import { MembersFilters } from "@/components/organisms/MembersFilters";
import { MembersTable } from "@/components/organisms/MembersTable";
import { useState } from "react";

const mockMembers = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria@email.com",
    branch: "Central",
    role: "Membro",
    status: "Ativo",
    joined: "15/03/2020",
  },
];

export default function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("Todas");

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch = member.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesBranch =
      selectedBranch === "Todas" ||
      member.branch === selectedBranch;

    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-6">
      <MembersHeader onAddClick={() => console.log("Abrir modal")} />

      <MembersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedBranch={selectedBranch}
        onBranchChange={setSelectedBranch}
      />

      <MembersTable members={filteredMembers} />
    </div>
  );
}
