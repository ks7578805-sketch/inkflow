import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, Mail, Lock, Loader2 } from "lucide-react";
import { buildApiUrl } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(buildApiUrl('/v1/auth/login'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data = null;
      try { data = await response.json(); } catch { data = null; }

      if (!response.ok) {
        throw new Error(data?.message || 'Email ou senha inválidos');
      }

      navigate('/', { replace: true });
      window.location.reload();
    } catch (err) {
      setError(err.message || "Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0d0f14]">

      {/* ── Left panel — hero image ── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <img
          src="/images/studio-bg-horizontal.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* dark base + green tint overlay */}
        <div className="absolute inset-0 bg-[#0d0f14]/70" />
        <div className="absolute inset-0 bg-[#1db884]/10" />

        {/* Branding */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1db884]/20 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-[#1db884]" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">InkFlow</span>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-white leading-snug">
              Seu estúdio,<br />do jeito certo.
            </h2>
            <p className="text-white/50 mt-3 text-base max-w-xs">
              Gestão completa para tatuadores profissionais.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">InkFlow</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Bem-vindo de volta</h1>
            <p className="text-muted-foreground mt-1 text-sm">Entre na sua conta para continuar</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-medium mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Registro desabilitado.{" "}
            <Link to="/forgot-password" className="text-primary hover:underline">
              Recuperar senha
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
