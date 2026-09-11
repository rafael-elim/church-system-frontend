"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AddGroupCourseDialog } from "@/components/organisms/discipleship/AddGroupCourseDialog";
import { AddGroupMemberDialog } from "@/components/organisms/discipleship/AddGroupMemberDialog";
import { CourseDialog } from "@/components/organisms/discipleship/CourseDialog";
import { DiscipleshipCoursesTab } from "@/components/organisms/discipleship/DiscipleshipCoursesTab";
import { DiscipleshipFilters } from "@/components/organisms/discipleship/DiscipleshipFilters";
import { DiscipleshipGroupDetails } from "@/components/organisms/discipleship/DiscipleshipGroupDetails";
import { DiscipleshipGroupsTab } from "@/components/organisms/discipleship/DiscipleshipGroupsTab";
import { DiscipleshipHeader } from "@/components/organisms/discipleship/DiscipleshipHeader";
import { DiscipleshipStats } from "@/components/organisms/discipleship/DiscipleshipStats";
import { GroupDialog } from "@/components/organisms/discipleship/GroupDialog";
import {
  CourseFormState,
  GroupFormState,
} from "@/components/organisms/discipleship/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addCourseToDiscipleshipGroup,
  addMemberToDiscipleshipGroup,
  CourseResponse,
  createDiscipleshipCourse,
  createDiscipleshipGroup,
  DiscipleshipGroup,
  getDiscipleshipGroupDetails,
  GroupDetailsResponse,
  listDiscipleshipCourses,
  listDiscipleshipGroups,
} from "@/services/discipleship";
import { listMembers, MemberResponse } from "@/services/members";

export default function DiscipleshipPage() {
  const [activeTab, setActiveTab] = useState("groups");
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState<DiscipleshipGroup[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroupDetails, setSelectedGroupDetails] =
    useState<GroupDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [courseLinkDialogOpen, setCourseLinkDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchDiscipleship = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [groupsResponse, coursesResponse, membersResponse] =
        await Promise.all([
          listDiscipleshipGroups(),
          listDiscipleshipCourses(),
          listMembers({ size: 100 }),
        ]);

      setGroups(groupsResponse);
      setCourses(coursesResponse);
      setMembers(membersResponse.content);
    } catch {
      setError("Não foi possível carregar o módulo de discipulado.");
      toast.error("Não foi possível carregar o módulo de discipulado.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGroupDetails = useCallback(async (groupId: string) => {
    setDetailsLoading(true);

    try {
      const details = await getDiscipleshipGroupDetails(groupId);
      setSelectedGroupDetails(details);
    } catch {
      toast.error("Não foi possível carregar os detalhes do grupo.");
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiscipleship();
  }, [fetchDiscipleship, refreshKey]);

  useEffect(() => {
    if (selectedGroupId) {
      fetchGroupDetails(selectedGroupId);
    }
  }, [fetchGroupDetails, refreshKey, selectedGroupId]);

  const filteredGroups = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return groups;
    }

    return groups.filter((group) => {
      const leader = members.find((member) => member.id === group.leaderId);

      return [group.name, group.description, leader?.name]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(term));
    });
  }, [groups, members, searchTerm]);

  const filteredCourses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return courses;
    }

    return courses.filter((course) => course.name.toLowerCase().includes(term));
  }, [courses, searchTerm]);

  const activeGroupsCount = groups.filter((group) => group.active).length;

  function getLeaderName(group: DiscipleshipGroup) {
    return (
      members.find((member) => member.id === group.leaderId)?.name ??
      "Líder não localizado"
    );
  }

  function handleSelectGroup(groupId: string) {
    setSelectedGroupId(groupId);
    setSelectedGroupDetails(null);
    setActiveTab("details");
  }

  async function handleCreateGroup(form: GroupFormState) {
    setSubmitting(true);

    try {
      const group = await createDiscipleshipGroup({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        leaderId: form.leaderId,
      });

      if (form.courseId !== "NONE") {
        await addCourseToDiscipleshipGroup(group.id, {
          courseId: form.courseId,
        });
      }

      toast.success("Grupo criado com sucesso.");
      setGroupDialogOpen(false);
      setRefreshKey((current) => current + 1);
    } catch {
      toast.error("Não foi possível criar o grupo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateCourse(form: CourseFormState) {
    setSubmitting(true);

    try {
      await createDiscipleshipCourse({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      });
      toast.success("Curso criado com sucesso.");
      setCourseDialogOpen(false);
      setRefreshKey((current) => current + 1);
    } catch {
      toast.error("Não foi possível criar o curso.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddMember(memberId: string) {
    if (!selectedGroupId) {
      return;
    }

    setSubmitting(true);

    try {
      await addMemberToDiscipleshipGroup(selectedGroupId, { memberId });
      toast.success("Membro adicionado ao grupo.");
      setMemberDialogOpen(false);
      setRefreshKey((current) => current + 1);
    } catch {
      toast.error("Não foi possível adicionar o membro ao grupo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddCourse(courseId: string) {
    if (!selectedGroupId) {
      return;
    }

    setSubmitting(true);

    try {
      await addCourseToDiscipleshipGroup(selectedGroupId, { courseId });
      toast.success("Curso vinculado ao grupo.");
      setCourseLinkDialogOpen(false);
      setRefreshKey((current) => current + 1);
    } catch {
      toast.error("Não foi possível vincular o curso.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <DiscipleshipHeader
        onNewCourse={() => setCourseDialogOpen(true)}
        onNewGroup={() => setGroupDialogOpen(true)}
      />

      <DiscipleshipStats
        loading={loading}
        activeGroupsCount={activeGroupsCount}
        coursesCount={courses.length}
        membersCount={members.length}
      />

      <DiscipleshipFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClear={() => setSearchTerm("")}
      />

      {error && (
        <Card>
          <CardContent className="p-6 text-sm text-red-600">{error}</CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="groups">Grupos</TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedGroupId}>
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="mt-6">
          <DiscipleshipGroupsTab
            groups={filteredGroups}
            loading={loading}
            getLeaderName={getLeaderName}
            onSelectGroup={handleSelectGroup}
          />
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <DiscipleshipGroupDetails
            selectedGroupId={selectedGroupId}
            details={selectedGroupDetails}
            loading={detailsLoading}
            onAddMember={() => setMemberDialogOpen(true)}
            onAddCourse={() => setCourseLinkDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <DiscipleshipCoursesTab
            courses={filteredCourses}
            loading={loading}
          />
        </TabsContent>
      </Tabs>

      <GroupDialog
        open={groupDialogOpen}
        members={members}
        courses={courses}
        submitting={submitting}
        onOpenChange={setGroupDialogOpen}
        onSubmit={handleCreateGroup}
      />
      <CourseDialog
        open={courseDialogOpen}
        submitting={submitting}
        onOpenChange={setCourseDialogOpen}
        onSubmit={handleCreateCourse}
      />
      <AddGroupMemberDialog
        open={memberDialogOpen}
        members={members}
        submitting={submitting}
        onOpenChange={setMemberDialogOpen}
        onSubmit={handleAddMember}
      />
      <AddGroupCourseDialog
        open={courseLinkDialogOpen}
        courses={courses}
        submitting={submitting}
        onOpenChange={setCourseLinkDialogOpen}
        onSubmit={handleAddCourse}
      />
    </div>
  );
}
