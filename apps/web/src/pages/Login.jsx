import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wand2, Mail, Lock, Loader2 } from "lucide-react";
import { buildApiUrl } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(buildApiUrl("/v1/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.message || "Email ou senha inválidos");
      }

      navigate("/", { replace: true });
      window.location.reload();
    } catch (err) {
      setError(err.message || "Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-end"
      style={{
        backgroundImage: "url('/images/login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 w-full max-w-[420px] mx-6 lg:mr-24 lg:mx-0 py-8">
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(13, 15, 20, 0.90)",
            border: "1px solid rgba(29, 184, 132, 0.2)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(29, 184, 132, 0.15)" }}
            >
              <Wand2 className="w-4 h-4" style={{ color: "#1db884" }} />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">InkFlow</span>
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              Entre na sua conta para continuar
            </p>
          </div>

          {error && (
            <div
              className="mb-5 p-3 rounded-xl text-sm"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-white/70">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "rgba(29,184,132,0.7)" }}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                  className="placeholder:text-white/40"
                  style={{
                    width: "100%",
                    height: "44px",
                    paddingLeft: "40px",
                    paddingRight: "12px",
                    background: "#141820",
                    border: emailFocused
                      ? "1px solid #1db884"
                      : "1px solid rgba(29,184,132,0.3)",
                    borderRadius: "12px",
                    color: "white",
                    outline: "none",
                    boxShadow: emailFocused
                      ? "0 0 0 3px rgba(29,184,132,0.15)"
                      : "none",
                    fontSize: "14px",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-white/70">
                  Senha
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs transition-opacity hover:opacity-75"
                  style={{ color: "#1db884" }}
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "rgba(29,184,132,0.7)" }}
                />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                  className="placeholder:text-white/40"
                  style={{
                    width: "100%",
                    height: "44px",
                    paddingLeft: "40px",
                    paddingRight: "12px",
                    background: "#141820",
                    border: passwordFocused
                      ? "1px solid #1db884"
                      : "1px solid rgba(29,184,132,0.3)",
                    borderRadius: "12px",
                    color: "white",
                    outline: "none",
                    boxShadow: passwordFocused
                      ? "0 0 0 3px rgba(29,184,132,0.15)"
                      : "none",
                    fontSize: "14px",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-medium rounded-xl flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? "rgba(29,184,132,0.7)" : "#1db884",
                color: "#000",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#17a372";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = "#1db884";
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.4)" }}>
            Registro desabilitado
          </p>
        </div>
      </div>
    </div>
  );
}
