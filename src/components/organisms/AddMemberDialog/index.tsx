"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  CreateMemberRequest,
  MemberResponse,
  MemberStatus,
} from "@/services/members";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddMemberDialogProps {
  open: boolean;
  mode: "create" | "edit";
  member?: MemberResponse | null;
  onOpenChange: (open: boolean) => void;
  onSubmitMember: (member: CreateMemberRequest) => Promise<void>;
}

const initialForm = {
  name: "",
  email: "",
  phone: "",
  birthDate: "",
  baptismDate: "",
  address: "",
  status: "VISITOR" as MemberStatus,
};

export function AddMemberDialog({
  open,
  mode,
  member,
  onOpenChange,
  onSubmitMember,
}: AddMemberDialogProps) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setError("");
      return;
    }

    if (mode === "edit" && member) {
      setForm({
        name: member.name,
        email: member.email ?? "",
        phone: member.phone ?? "",
        birthDate: member.birthDate ?? "",
        baptismDate: member.baptismDate ?? "",
        address: member.address ?? "",
        status: member.status,
      });
      setError("");
      return;
    }

    setForm(initialForm);
    setError("");
  }, [member, mode, open]);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit() {
    if (submitting) {
      return;
    }

    if (!form.name.trim()) {
      setError("Informe o nome do membro.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmitMember({
        name: form.name.trim(),
        status: form.status,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        birthDate: form.birthDate || undefined,
        baptismDate: form.baptismDate || undefined,
        address: form.address.trim() || undefined,
      });

      onOpenChange(false);
      setForm(initialForm);
    } catch {
      setError(
        mode === "create"
          ? "Não foi possível criar o membro."
          : "Não foi possível salvar as alterações."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo membro" : "Editar membro"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Preencha as informações do novo membro"
              : "Atualize as informações do membro"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="member-name">Nome Completo</Label>
            <Input
              id="member-name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Digite o nome completo"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => handleChange("status", value)}
              disabled={submitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VISITOR">Visitante</SelectItem>
                <SelectItem value="MEMBER">Membro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="member-email">E-mail</Label>
            <Input
              id="member-email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="email@exemplo.com"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="member-phone">Telefone</Label>
            <Input
              id="member-phone"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(11) 98765-4321"
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="member-birth-date">Data de nascimento</Label>
              <Input
                id="member-birth-date"
                type="date"
                value={form.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="member-baptism-date">Data de batismo</Label>
              <Input
                id="member-baptism-date"
                type="date"
                value={form.baptismDate}
                onChange={(e) => handleChange("baptismDate", e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="member-address">Endereço</Label>
            <Textarea
              id="member-address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Digite o endereço"
              disabled={submitting}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting
              ? mode === "create"
                ? "Adicionando..."
                : "Salvando..."
              : mode === "create"
                ? "Adicionar"
                : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
