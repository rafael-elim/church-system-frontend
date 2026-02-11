"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface MembersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedBranch: string;
  onBranchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (value: string) => void;
}

export function MembersFilters({
  searchTerm,
  onSearchChange,
  selectedBranch,
  onBranchChange,
  selectedRole,
  onRoleChange,
}: MembersFiltersProps) {

  const branches = ["Todas", "Central", "Zona Norte", "Zona Sul", "Centro"];
  const roles = ["Todos", "Membro", "Líder", "Secretária", "Pastor"];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={selectedBranch} onValueChange={onBranchChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Congregação" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Função */}
          <Select value={selectedRole} onValueChange={onRoleChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Função" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>
      </CardContent>
    </Card>
  );
}
