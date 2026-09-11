"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Suspense } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { activateAccount } from "@/services/auth";

function ActivateAccountForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (!token) {
      setError("Link de ativação inválido.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("A confirmação da senha não confere.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await activateAccount({ token, password, passwordConfirmation });
      setSuccess(true);
    } catch {
      setError("Link inválido ou expirado. Solicite um novo convite de acesso.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar sua senha</CardTitle>
          <CardDescription>
            Defina a senha para acessar sua conta.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {success ? (
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
              Senha criada com sucesso.
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="activation-password">Nova senha</Label>
                <div className="flex gap-2">
                  <Input
                    id="activation-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={submitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={submitting}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="activation-password-confirmation">Confirmar nova senha</Label>
                <Input
                  id="activation-password-confirmation"
                  type={showPassword ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(event) => setPasswordConfirmation(event.target.value)}
                  disabled={submitting}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </>
          )}
        </CardContent>

        <CardFooter>
          {success ? (
            <Button asChild className="w-full">
              <Link href="/login">Ir para o login</Link>
            </Button>
          ) : (
            <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Criando senha..." : "Criar senha"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}

export default function ActivateAccountPage() {
  return (
    <Suspense fallback={null}>
      <ActivateAccountForm />
    </Suspense>
  );
}
