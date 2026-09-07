'use client';

import { MembersHeader } from "@/components/organisms/MembersHeader";
import { MembersFilters } from "@/components/organisms/MembersFilters";
import { MembersTable } from "@/components/organisms/MembersTable";
import { Card, CardContent } from "@/components/ui/card";
import {
  getMemberStats,
  listMembers,
  MemberResponse,
  MemberStatsResponse,
  MemberStatus,
} from "@/services/members";
import { useEffect, useMemo, useState } from "react";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [stats, setStats] = useState<MemberStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const status =
          selectedStatus === "ALL" ? undefined : (selectedStatus as MemberStatus);

        const [membersPage, memberStats] = await Promise.all([
          listMembers({
            name: searchTerm.trim() || undefined,
            status,
            size: 50,
          }),
          getMemberStats(),
        ]);

        setMembers(membersPage.content);
        setStats(memberStats);
      } catch {
        setError("Não foi possível carregar os membros.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm, selectedStatus]);

  const tableMembers = useMemo(
    () =>
      members.map((member) => ({
        ...member,
        initials: getInitials(member.name),
      })),
    [members]
  );


  return (
    <div className="space-y-6">
      <MembersHeader onAddClick={() => console.log("Abrir modal")} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-1">Total de Membros</p>
            <p className="text-slate-900">{stats?.totalMembers ?? "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-1">Novos Este Mês</p>
            <p className="text-slate-900 text-green-600">
              {stats ? `+${stats.newThisMonth}` : "-"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-1">Líderes Ativos</p>
            <p className="text-slate-900">{stats?.activeLeaders ?? "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 mb-1">Taxa de Retenção</p>
            <p className="text-slate-900">
              {stats ? `${stats.retentionRate}%` : "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      <MembersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {error && (
        <Card>
          <CardContent className="p-6 text-sm text-red-600">{error}</CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-slate-600">
            Carregando membros...
          </CardContent>
        </Card>
      ) : (
        <MembersTable members={tableMembers} />
      )}
    </div>
  );
}
