import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
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
      if (!response.ok) throw new Error(data?.message || 'Email ou senha inválidos');
      navigate('/', { replace: true });
      window.location.reload();
    } catch (err) {
      setError(err.message || "Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-white mb-1">Bem-vindo de volta</h2>
      <p className="text-sm text-white/50 mb-6">Entre para continuar na sua conta</p>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs tracking-widest text-[hsl(160_84%_39%)] uppercase">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[hsl(220_12%_12%)] border border-[hsl(220_12%_20%)] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[hsl(160_84%_39%)] transition-colors"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs tracking-widest text-[hsl(160_84%_39%)] uppercase">Senha</label>
            <Link to="/forgot-password" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[hsl(220_12%_12%)] border border-[hsl(220_12%_20%)] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[hsl(160_84%_39%)] transition-colors"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[hsl(160_84%_39%)] hover:bg-[hsl(160_84%_34%)] text-black font-bold py-3 rounded-lg text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</>
          ) : (
            <>ENTRAR →</>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-white/20 mt-6">Registro desabilitado</p>
    </AuthLayout>
  );
}
