"use client";

import { Bell, Building2, Database, Palette, Shield, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Configurações</h1>
        <p className="mt-1 text-sm text-slate-600">Preferências administrativas e dados do usuário autenticado.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="organization">Organização</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>Dados retornados pelo endpoint de autenticação atual.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={user?.name ?? ""} readOnly />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" value={user?.email ?? ""} readOnly />
              </div>
              <Button disabled title="Ainda não existe endpoint de atualização de perfil">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="size-5" />
                Organização
              </CardTitle>
              <CardDescription>Informações da igreja e configurações visuais aguardam contrato de API.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="companyId">Empresa</Label>
                <Input id="companyId" value={user?.companyId ?? ""} readOnly />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="theme">Tema</Label>
                <Input id="theme" value="Claro" readOnly />
              </div>
              <div className="flex items-center gap-3 rounded-md border border-slate-200 p-4 md:col-span-2">
                <Palette className="size-5 text-blue-700" />
                <p className="text-sm text-slate-600">Preferências de aparência serão persistidas quando o backend expuser configurações por tenant.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>Controles visuais preparados para o módulo de comunicação.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Novos membros", "Eventos", "Comunicação", "Discipulado"].map((label) => (
                <div key={label} className="flex items-center justify-between rounded-md border border-slate-200 p-4">
                  <Label>{label}</Label>
                  <Switch disabled />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="size-5" />
                  Senha e Segurança
                </CardTitle>
                <CardDescription>A troca de senha ainda não possui endpoint administrativo no backend.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input type="password" placeholder="Senha atual" disabled />
                <Input type="password" placeholder="Nova senha" disabled />
                <Button disabled>Alterar Senha</Button>
              </CardContent>
            </Card>

            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="size-5" />
                  Dados e Privacidade
                </CardTitle>
                <CardDescription>Exportação e auditoria dependem de endpoints específicos por tenant.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
