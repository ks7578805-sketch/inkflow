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
        <div className="absolute inset-0 bg-black/40" />
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
      <div className="w-full lg:w-[500px] flex items-center justify-center px-10 py-12 bg-[hsl(220_15%_7%)]">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <img
              src="/images/LOGO.png"
              alt="Tattoo Flow"
              className="h-28 w-auto mb-4"
              style={{ mixBlendMode: 'screen' }}
            />
            <h2 className="text-2xl font-bold tracking-[0.25em] text-white uppercase">
              TATTOO FLOW
            </h2>
            <p className="text-xs tracking-[0.35em] text-white/40 uppercase mt-1">
              Crie. Conecte. Eleve.
            </p>
          </div>

          {/* Card */}
          <div className="bg-[hsl(220_15%_10%)] border border-[hsl(220_12%_18%)] rounded-2xl p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
