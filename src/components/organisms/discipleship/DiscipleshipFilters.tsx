import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface DiscipleshipFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export function DiscipleshipFilters({
  searchTerm,
  onSearchChange,
  onClear,
}: DiscipleshipFiltersProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              className="pl-9"
              placeholder="Buscar grupos, líderes ou cursos..."
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
