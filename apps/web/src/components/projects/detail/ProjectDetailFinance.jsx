import { DollarSign, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

function KPI({ label, value, sub, variant = "neutral" }) {
  const colors = {
    primary: "text-primary",
    success: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-destructive",
    neutral: "text-foreground",
  };

  return (
    <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className={cn("text-xl font-bold", colors[variant])}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

export default function ProjectDetailFinance({ project }) {
  const total = project.valueFinal || project.valueEstimated;
  const saldo = total - project.totalPaid;
  const lucro = total - (total * 0.35);
  const paidPct = total > 0 ? Math.round((project.totalPaid / total) * 100) : 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Financeiro do Projeto</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <KPI label="Valor Total" value={`R$ ${total.toLocaleString("pt-BR")}`} sub="valor fechado" variant="primary" />
        <KPI label="Recebido" value={`R$ ${project.totalPaid.toLocaleString("pt-BR")}`} sub={`${paidPct}% do total`} variant="success" />
        <KPI label="Saldo Pendente" value={`R$ ${saldo.toLocaleString("pt-BR")}`} sub="a receber" variant={saldo > 0 ? "warning" : "success"} />
        <KPI label="Depósito" value={`R$ ${project.deposit.toLocaleString("pt-BR")}`} sub="sinal pago" />
      </div>

      <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Lucro Estimado</span>
        </div>
        <p className="text-2xl font-bold text-primary">R$ {lucro.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</p>
        <p className="text-xs text-muted-foreground mt-1">Estimativa após custos operacionais (35%)</p>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Histórico de Pagamentos</h4>
        <div className="py-8 text-center border border-border/50 rounded-xl">
          <DollarSign className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Nenhum pagamento detalhado registrado</p>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">Recebido</span>
          <span className="font-semibold text-foreground">{paidPct}%</span>
        </div>
        <div className="h-2.5 bg-muted/30 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(paidPct, 100)}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
          <span>R$ {project.totalPaid.toLocaleString("pt-BR")} recebido</span>
          <span>R$ {saldo.toLocaleString("pt-BR")} pendente</span>
        </div>
      </div>
    </div>
  );
}
