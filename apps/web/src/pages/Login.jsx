import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
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
      try { data = await response.json(); } catch { data = null; }

      if (!response.ok) throw new Error(data?.message || "Email ou senha inválidos");

      navigate("/", { replace: true });
      window.location.reload();
    } catch (err) {
      setError(err.message || "Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (focused) => ({
    width: "100%",
    height: "48px",
    paddingLeft: "44px",
    paddingRight: "14px",
    background: "rgba(255,255,255,0.05)",
    border: focused ? "1px solid rgba(29,184,132,0.8)" : "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    color: "white",
    outline: "none",
    boxShadow: focused ? "0 0 0 2px rgba(29,184,132,0.25)" : "none",
    fontSize: "14px",
    letterSpacing: "0.01em",
    transition: "border-color 0.15s, box-shadow 0.15s",
  });

  return (
    <div style={{ minHeight: "100vh", width: "100%", position: "relative", display: "flex", overflow: "hidden" }}>

      {/* ── Full-screen background ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('/images/studio-bg-vertical.png')",
        backgroundSize: "cover", backgroundPosition: "center",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(4,8,12,0.72)" }} />

      {/* ── Left panel ── */}
      <div style={{
        flex: 1, position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px",
      }}>

        {/* 3 photo cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "480px" }}>
          {/* Row 1: two cards */}
          <div style={{ display: "flex", gap: "14px" }}>
            <div style={{
              flex: 1, height: "180px", borderRadius: "16px", overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}>
              <img src="/images/tattoo-1.png" alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{
              flex: 1, height: "180px", borderRadius: "16px", overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}>
              <img src="/images/tattoo-2.png" alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>

          {/* Row 2: one wide card */}
          <div style={{
            height: "160px", borderRadius: "16px", overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}>
            <img src="/images/tattoo-3.png" alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

        {/* Bottom-left branding */}
        <div>
          <p style={{ color: "#1db884", fontSize: "11px", fontWeight: "600", letterSpacing: "0.15em", marginBottom: "8px" }}>
            BEM-VINDO AO
          </p>
          <h2 style={{ color: "white", fontSize: "42px", fontWeight: "800", letterSpacing: "-0.5px", lineHeight: 1.1, margin: 0 }}>
            TATTOO FLOW
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", marginTop: "12px", lineHeight: 1.6, maxWidth: "320px" }}>
            Plataforma completa para gestão de estúdios de tatuagem profissionais.
          </p>
          <a href="#"
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              color: "#1db884", fontSize: "13px", fontWeight: "600",
              letterSpacing: "0.08em", marginTop: "16px", textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            SAIBA MAIS <ArrowRight style={{ width: "14px", height: "14px" }} />
          </a>
        </div>
      </div>

      {/* ── Right panel — login card ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 56px", position: "relative", zIndex: 10, minWidth: "460px",
      }}>
        <div style={{
          background: "rgba(8, 12, 18, 0.88)",
          border: "1px solid rgba(29,184,132,0.22)",
          borderRadius: "24px",
          padding: "52px 44px",
          width: "400px",
          maxWidth: "100%",
          backdropFilter: "blur(20px)",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <img src="/images/LOGO.png" alt="InkFlow"
              style={{ width: "200px", maxWidth: "100%", mixBlendMode: "screen" }} />
          </div>

          {/* Brand tagline below logo */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <p style={{ color: "white", fontSize: "13px", fontWeight: "700", letterSpacing: "0.2em", margin: 0 }}>
              TATTOO FLOW
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "0.15em", marginTop: "6px" }}>
              CRIE. CONECTE. ELEVE.
            </p>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{
              color: "white", fontWeight: "700", fontSize: "24px",
              letterSpacing: "-0.3px", margin: 0,
            }}>
              Bem-vindo de volta
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", marginTop: "6px", lineHeight: 1.5 }}>
              Entre para continuar na sua conta
            </p>
          </div>

          {error && (
            <div style={{
              marginBottom: "20px", padding: "12px 14px", borderRadius: "12px",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171", fontSize: "13px",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="email" style={{ color: "#1db884", fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em" }}>
                EMAIL
              </label>
              <div style={{ position: "relative" }}>
                <Mail style={{
                  position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                  width: "16px", height: "16px", color: "rgba(29,184,132,0.65)",
                }} />
                <input
                  id="email" type="email" autoComplete="email" autoFocus
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                  className="placeholder:text-white/30"
                  style={inputStyle(emailFocused)}
                />
              </div>
            </div>

            {/* Senha */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label htmlFor="password" style={{ color: "#1db884", fontSize: "11px", fontWeight: "700", letterSpacing: "0.12em" }}>
                  SENHA
                </label>
                <Link to="/forgot-password"
                  style={{ color: "#1db884", fontSize: "12px", textDecoration: "none", opacity: 0.85, letterSpacing: "0.02em" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock style={{
                  position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
                  width: "16px", height: "16px", color: "rgba(29,184,132,0.65)",
                }} />
                <input
                  id="password" type="password" autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                  className="placeholder:text-white/30"
                  style={inputStyle(passwordFocused)}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", height: "50px",
                background: loading ? "rgba(26,92,58,0.6)" : "#1a5c3a",
                color: "white", fontWeight: "600", fontSize: "14px",
                letterSpacing: "0.06em", borderRadius: "12px", border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                marginTop: "4px", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#154d30"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#1a5c3a"; }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
                  Entrando...
                </>
              ) : (
                <>
                  ENTRAR
                  <ArrowRight style={{ width: "16px", height: "16px" }} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "28px", letterSpacing: "0.03em" }}>
            Registro desabilitado
          </p>
        </div>
      </div>
    </div>
  );
}
