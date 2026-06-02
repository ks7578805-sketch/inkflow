export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[hsl(220_15%_5%)]">
      {/* LADO ESQUERDO */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="/images/studio-bg-vertical.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-12 left-10">
          <p className="text-xs tracking-[0.3em] text-white/50 uppercase mb-2">Bem-vindo ao</p>
          <h1 className="text-5xl font-black text-white tracking-widest uppercase">TATTOO FLOW</h1>
          <div className="w-12 h-px bg-[hsl(160_84%_39%)] my-3" />
          <p className="text-sm text-white/60 leading-relaxed max-w-xs">
            A plataforma profissional para tatuadores<br />
            e estúdios que querem criar, conectar<br />
            e elevar a arte da tatuagem.
          </p>
          <button className="mt-4 text-xs tracking-widest text-[hsl(160_84%_39%)] uppercase flex items-center gap-2 hover:gap-3 transition-all">
            SAIBA MAIS <span>→</span>
          </button>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div
        className="w-full lg:w-[480px] flex items-center justify-center px-10 py-12"
        style={{ background: 'linear-gradient(160deg, #0a1a12 0%, #060d09 100%)' }}
      >
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              style={{
                filter: 'drop-shadow(0 0 24px rgba(74,222,128,0.3)) drop-shadow(0 0 60px rgba(74,222,128,0.1))'
              }}
            >
              <img
                src="/images/LOGO.png"
                alt="Tattoo Flow"
                className="h-32 w-auto"
                style={{ mixBlendMode: 'screen', filter: 'brightness(1.4) contrast(1.1)' }}
              />
            </div>
            <h2
              className="text-xl font-bold text-white uppercase mt-3"
              style={{ letterSpacing: '0.45em', textShadow: '0 0 20px rgba(74,222,128,0.15)' }}
            >
              TATTOO FLOW
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-px bg-[hsl(160_84%_39%)] opacity-60" />
              <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Crie. Conecte. Eleve.</span>
              <div className="w-8 h-px bg-[hsl(160_84%_39%)] opacity-60" />
            </div>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(10,26,18,0.8)',
              border: '1px solid rgba(74,222,128,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
