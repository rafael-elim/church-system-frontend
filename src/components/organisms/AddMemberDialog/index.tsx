"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus } from "lucide-react";

interface AddMemberDialogProps {
  onAddMember?: (member: {
    name: string;
    email: string;
    phone: string;
    branch: string;
    role: string;
  }) => void;
}

export function AddMemberDialog({ onAddMember }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    role: "",
  });

  function handleChange(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSubmit() {
    onAddMember?.(form);
    setOpen(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      branch: "",
      role: "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Membro
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Membro</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo membro
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Nome Completo</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Digite o nome completo"
            />
          </div>

          <div className="grid gap-2">
            <Label>E-mail</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="grid gap-2">
            <Label>Telefone</Label>
            <Input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(11) 98765-4321"
            />
          </div>

          <div className="grid gap-2">
            <Label>Congregação</Label>
            <Select
              value={form.branch}
              onValueChange={(value) => handleChange("branch", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a congregação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Central">Central</SelectItem>
                <SelectItem value="Zona Norte">Zona Norte</SelectItem>
                <SelectItem value="Zona Sul">Zona Sul</SelectItem>
                <SelectItem value="Centro">Centro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Função</Label>
            <Select
              value={form.role}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Membro">Membro</SelectItem>
                <SelectItem value="Líder">Líder</SelectItem>
                <SelectItem value="Secretária">Secretária</SelectItem>
                <SelectItem value="Pastor">Pastor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
