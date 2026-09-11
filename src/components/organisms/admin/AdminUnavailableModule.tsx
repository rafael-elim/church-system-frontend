"use client";

import { LucideIcon, PlugZap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Metric = {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

type Section = {
  value: string;
  label: string;
  title: string;
  description: string;
  items: string[];
};

type AdminUnavailableModuleProps = {
  title: string;
  description: string;
  actionLabel: string;
  icon: LucideIcon;
  metrics: Metric[];
  sections: Section[];
  backendNote: string;
};

export function AdminUnavailableModule({
  title,
  description,
  actionLabel,
  icon: Icon,
  metrics,
  sections,
  backendNote,
}: AdminUnavailableModuleProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        <Button disabled title="A API deste módulo ainda não existe no backend">
          <Icon className="size-4" />
          {actionLabel}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="rounded-lg">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-slate-600">{metric.label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{metric.value}</p>
                <p className="mt-1 text-xs text-slate-500">{metric.description}</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <metric.icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-lg border-dashed">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <PlugZap className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base">Integração pendente</CardTitle>
              <CardDescription>{backendNote}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue={sections[0]?.value} className="space-y-6">
        <TabsList>
          {sections.map((section) => (
            <TabsTrigger key={section.value} value={section.value}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.value} value={section.value}>
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-md border border-slate-200 p-4"
                  >
                    <span className="text-sm font-medium text-slate-800">{item}</span>
                    <Badge variant="outline">Aguardando API</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
