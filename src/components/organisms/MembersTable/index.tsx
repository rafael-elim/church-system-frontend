"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Mail,
  Phone,
  MoreVertical,
  Edit,
  Trash2,
  Send,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberResponse } from "@/services/members";

interface TableMember extends MemberResponse {
  initials: string;
}

interface MembersTableProps {
  members: TableMember[];
  onEditMember: (member: MemberResponse) => void;
  onGenerateActivationLink: (member: MemberResponse) => void;
}

export function MembersTable({ members, onEditMember, onGenerateActivationLink }: MembersTableProps) {
  const statusLabels = {
    VISITOR: "Visitante",
    MEMBER: "Membro",
  };

  const accountLabels = {
    NO_ACCOUNT: "Sem conta",
    PENDING_ACTIVATION: "Conta não ativada",
    ACTIVE: "Conta ativa",
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Membro</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Conta</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum membro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  {/* Nome */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-slate-900">
                        {member.name}
                      </span>
                    </div>
                  </TableCell>

                  {/* Contato */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-3 h-3" />
                        {member.email ?? "Sem e-mail"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-3 h-3" />
                        {member.phone ?? "Sem telefone"}
                      </div>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      className={
                        member.status === "MEMBER"
                          ? "bg-green-50 text-green-700 hover:bg-green-50"
                          : "bg-amber-50 text-amber-700 hover:bg-amber-50"
                      }
                    >
                      {statusLabels[member.status]}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={member.accountStatus === "ACTIVE" ? "default" : "outline"}>
                      {accountLabels[member.accountStatus ?? "NO_ACCOUNT"]}
                    </Badge>
                  </TableCell>

                  {/* Ações */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditMember(member)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        {member.userId && member.accountStatus !== "ACTIVE" && (
                          <DropdownMenuItem onClick={() => onGenerateActivationLink(member)}>
                            <Send className="w-4 h-4 mr-2" />
                            Gerar link de acesso
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
