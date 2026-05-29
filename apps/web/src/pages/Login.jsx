import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { buildApiUrl } from "@/lib/api";

const PHOTOS = [
  "/images/studio-bg-horizontal.png",
  "/images/studio-bg-vertical.png",
  "/images/login-bg.png",
];

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

  const inputStyle = (focused) => ({
    width: "100%",
    height: "46px",
    paddingLeft: "42px",
    paddingRight: "14px",
    background: "#141820",
    border: focused ? "1px solid #1db884" : "1px solid rgba(29,184,132,0.3)",
    borderRadius: "12px",
    color: "white",
    outline: "none",
    boxShadow: focused ? "0 0 0 2px rgba(29,184,132,0.3)" : "none",
    fontSize: "14px",
    transition: "border-color 0.15s, box-shadow 0.15s",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Full-screen background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/login-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />

      {/* ── Left panel ── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
        }}
        className="hidden lg:flex"
      >
        {/* Photo grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "220px 200px",
            gap: "14px",
            maxWidth: "520px",
            width: "100%",
          }}
        >
          {/* Wide top photo */}
          <div
            style={{
              gridColumn: "1 / -1",
              borderRadius: "18px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <img
              src={PHOTOS[0]}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          {/* Two bottom photos */}
          {PHOTOS.slice(1).map((src, i) => (
            <div
              key={i}
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <img
                src={src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>

        {/* Bottom branding */}
        <div>
          <h2
            style={{
              color: "white",
              fontWeight: "700",
              fontSize: "38px",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
            }}
          >
            Seu estúdio,<br />do jeito certo.
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              marginTop: "10px",
              fontSize: "16px",
            }}
          >
            Gestão completa para tatuadores profissionais
          </p>
        </div>
      </div>

      {/* ── Right panel — login card ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 48px",
          position: "relative",
          zIndex: 10,
          minWidth: "440px",
        }}
        className="flex-1 lg:flex-none"
      >
        <div
          style={{
            background: "rgba(13, 15, 20, 0.92)",
            border: "1px solid rgba(29, 184, 132, 0.3)",
            borderRadius: "24px",
            padding: "48px",
            width: "420px",
            maxWidth: "100%",
          }}
        >
          {/* Logo image */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
            <img
              src="/images/LOGO.png"
              alt="InkFlow"
              style={{ maxWidth: "180px", mixBlendMode: "screen" }}
            />
          </div>

          {/* Heading */}
          <div style={{ marginBottom: "28px", textAlign: "center" }}>
            <h1
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: "22px",
                letterSpacing: "-0.3px",
              }}
            >
              Bem-vindo de volta
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", marginTop: "6px", fontSize: "14px" }}>
              Entre na sua conta para continuar
            </p>
          </div>

          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px",
                borderRadius: "12px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label
                htmlFor="email"
                style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: "500" }}
              >
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  style={{
                    position: "absolute",
                    left: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "16px",
                    height: "16px",
                    color: "rgba(29,184,132,0.7)",
                  }}
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
                  style={inputStyle(emailFocused)}
                />
              </div>
            </div>

            {/* Senha */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label
                  htmlFor="password"
                  style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: "500" }}
                >
                  Senha
                </label>
                <Link
                  to="/forgot-password"
                  style={{ color: "#1db884", fontSize: "12px", textDecoration: "none", opacity: 0.9 }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.65")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.9")}
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock
                  style={{
                    position: "absolute",
                    left: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "16px",
                    height: "16px",
                    color: "rgba(29,184,132,0.7)",
                  }}
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
                  style={inputStyle(passwordFocused)}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "46px",
                background: loading ? "rgba(29,184,132,0.65)" : "#1db884",
                color: "#000",
                fontWeight: "600",
                fontSize: "15px",
                borderRadius: "12px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "4px",
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
                  <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Footer */}
          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "rgba(255,255,255,0.4)",
              marginTop: "24px",
            }}
          >
            Registro desabilitado
          </p>
        </div>
      </div>
    </div>
  );
}
