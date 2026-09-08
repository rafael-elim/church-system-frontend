'use client';

import { MembersHeader } from "@/components/organisms/MembersHeader";
import { MembersFilters } from "@/components/organisms/MembersFilters";
import { MembersTable } from "@/components/organisms/MembersTable";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  createMember,
  CreateMemberRequest,
  getMemberStats,
  listMembers,
  MemberResponse,
  MemberStatsResponse,
  MemberStatus,
  updateMember,
} from "@/services/members";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 10;

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
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    totalElements: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberResponse | null>(null);

  const status =
    selectedStatus === "ALL" ? undefined : (selectedStatus as MemberStatus);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [membersPage, memberStats] = await Promise.all([
        listMembers({
          name: searchTerm.trim() || undefined,
          status,
          page: pageInfo.page,
          size: PAGE_SIZE,
        }),
        getMemberStats(),
      ]);

      setMembers(membersPage.content);
      setStats(memberStats);
      setPageInfo((current) => ({
        ...current,
        page: membersPage.number,
        totalElements: membersPage.totalElements,
        totalPages: membersPage.totalPages,
      }));
    } catch {
      setError("Não foi possível carregar os membros.");
      toast.error("Não foi possível carregar os membros.");
    } finally {
      setLoading(false);
    }
  }, [pageInfo.page, searchTerm, status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchMembers();
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [fetchMembers, refreshKey]);

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setPageInfo((current) => ({ ...current, page: 0 }));
  }

  function handleStatusChange(value: string) {
    setSelectedStatus(value);
    setPageInfo((current) => ({ ...current, page: 0 }));
  }

  function handleClearFilters() {
    setSearchTerm("");
    setSelectedStatus("ALL");
    setPageInfo((current) => ({ ...current, page: 0 }));
  }

  function handleNewMember() {
    setSelectedMember(null);
    setMemberModalOpen(true);
  }

  function handleEditMember(member: MemberResponse) {
    setSelectedMember(member);
    setMemberModalOpen(true);
  }

  function handleModalOpenChange(open: boolean) {
    setMemberModalOpen(open);

    if (!open) {
      setSelectedMember(null);
    }
  }

  async function handleSubmitMember(payload: CreateMemberRequest) {
    if (selectedMember) {
      await updateMember(selectedMember.id, payload);
      toast.success("Membro atualizado com sucesso.");
    } else {
      await createMember(payload);
      toast.success("Membro criado com sucesso.");
    }

    setPageInfo((current) => ({ ...current, page: 0 }));
    setRefreshKey((current) => current + 1);
  }

  function goToPage(page: number) {
    setPageInfo((current) => ({ ...current, page }));
  }

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
      <MembersHeader
        modalOpen={memberModalOpen}
        mode={selectedMember ? "edit" : "create"}
        selectedMember={selectedMember}
        onNewMember={handleNewMember}
        onModalOpenChange={handleModalOpenChange}
        onSubmitMember={handleSubmitMember}
      />

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
        onSearchChange={handleSearchChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        onClear={handleClearFilters}
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
        <>
          <MembersTable members={tableMembers} onEditMember={handleEditMember} />

          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-600 md:flex-row">
            <span>
              {pageInfo.totalElements} registro(s) encontrado(s)
            </span>

            {pageInfo.totalPages > 1 && (
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      aria-disabled={pageInfo.page === 0}
                      className={
                        pageInfo.page === 0
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        goToPage(Math.max(pageInfo.page - 1, 0));
                      }}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <span className="px-3">
                      Página {pageInfo.page + 1} de {pageInfo.totalPages}
                    </span>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      aria-disabled={pageInfo.page + 1 >= pageInfo.totalPages}
                      className={
                        pageInfo.page + 1 >= pageInfo.totalPages
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        goToPage(
                          Math.min(pageInfo.page + 1, pageInfo.totalPages - 1)
                        );
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </>
      )}
    </div>
  );
}
