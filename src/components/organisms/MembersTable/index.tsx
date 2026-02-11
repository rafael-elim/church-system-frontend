import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

interface Member {
  id: number;
  name: string;
  email: string;
  branch: string;
  role: string;
  status: string;
  joined: string;
}

interface MembersTableProps {
  members: Member[];
}

export function MembersTable({ members }: MembersTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Membro</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Congregação</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Entrada</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                {member.name}
              </TableCell>

              <TableCell>{member.email}</TableCell>

              <TableCell>{member.branch}</TableCell>

              <TableCell>{member.role}</TableCell>

              <TableCell>
                <Badge variant="outline">
                  {member.status}
                </Badge>
              </TableCell>

              <TableCell>{member.joined}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
