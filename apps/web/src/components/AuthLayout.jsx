import { Wand2 } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#080a0d]">

      {/* LADO ESQUERDO — brand panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-between p-14"
        style={{ background: 'linear-gradient(135deg, #0a1610 0%, #080d0a 50%, #080a0d 100%)' }}>

        {/* Linha verde topo */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Grade decorativa sutil */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(hsl(160,84%,39%) 1px, transparent 1px), linear-gradient(90deg, hsl(160,84%,39%) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Gradiente radial verde no canto */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, hsl(160,84%,39%) 0%, transparent 70%)' }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Wand2 className="w-4.5 h-4.5 text-[#080a0d]" />
          </div>
          <div>
            <p className="font-bold text-[15px] text-white">InkFlow</p>
            <p className="text-[9px] text-primary/50 font-mono uppercase tracking-[0.2em]">Studio Manager</p>
          </div>
        </div>

        {/* Headline central */}
        <div className="relative">
          <p className="text-[10px] font-mono text-primary/50 uppercase tracking-[0.25em] mb-4">
            Para tatuadores profissionais
          </p>
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-6">
            Gerencie<br />
            seu estúdio<br />
            <span className="text-primary">com precisão.</span>
          </h1>
          <div className="w-10 h-px bg-primary/40 mb-5" />
          <p className="text-white/35 text-sm leading-relaxed max-w-xs">
            Agenda, clientes, projetos, stencil com IA e galeria — tudo em um só lugar, feito para quem tatua.
          </p>
        </div>

        {/* Métricas decorativas */}
        <div className="relative flex items-center gap-8">
          {[
            { value: "2.4k+", label: "Tatuadores" },
            { value: "98%", label: "Satisfação" },
            { value: "50k+", label: "Sessões" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* LADO DIREITO — form */}
      <div className="w-full lg:w-[480px] flex items-center justify-center px-8 py-12 bg-[#080a0d]">
        {/* Linha verde topo (mobile) */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:hidden" />

        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-[#080a0d]" />
            </div>
            <div>
              <p className="font-bold text-[14px] text-white">InkFlow</p>
              <p className="text-[9px] text-primary/50 font-mono uppercase tracking-[0.18em]">Studio Manager</p>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
