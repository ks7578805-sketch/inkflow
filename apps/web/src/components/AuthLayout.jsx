export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[hsl(220_15%_5%)]">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="/images/studio-bg-vertical.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          <img src="/images/tattoo-1.png" alt="" className="w-48 h-40 object-cover rounded-xl" />
          <img src="/images/tattoo-2.png" alt="" className="w-48 h-40 object-cover rounded-xl" />
          <img src="/images/tattoo-3.png" alt="" className="w-48 h-40 object-cover rounded-xl" />
        </div>
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

      <div className="w-full lg:w-[480px] flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/images/LOGO.png"
              alt="Tattoo Flow"
              className="h-20 w-auto mb-3"
              style={{ mixBlendMode: 'screen' }}
            />
            <p className="text-xs tracking-[0.35em] text-white/40 uppercase">
              Crie. Conecte. Eleve.
            </p>
          </div>
          <div className="bg-[hsl(220_15%_8%)] border border-[hsl(220_12%_16%)] rounded-2xl p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
