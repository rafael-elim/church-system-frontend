import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface MembersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedBranch: string;
  onBranchChange: (value: string) => void;
}

export function MembersFilters({
  searchTerm,
  onSearchChange,
  selectedBranch,
  onBranchChange,
}: MembersFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
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
          <SelectItem value="Todas">Todas</SelectItem>
          <SelectItem value="Central">Central</SelectItem>
          <SelectItem value="Zona Norte">Zona Norte</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
