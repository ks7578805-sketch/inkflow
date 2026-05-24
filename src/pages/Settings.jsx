import Topbar from "@/components/layout/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Building2, Users, Bell, Palette, CreditCard, Wand2, CalendarDays, Crown, Save, Upload } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="min-h-screen">
      <Topbar title="Configurações" subtitle="Gerencie sua conta e preferências" />

      <div className="p-6 flex gap-6">
        {/* Settings Sidebar */}
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1">
            {[
              { id: "profile", label: "Meu Perfil", icon: User },
              { id: "studio", label: "Estúdio", icon: Building2 },
              { id: "team", label: "Equipe", icon: Users },
              { id: "notifications", label: "Notificações", icon: Bell },
              { id: "branding", label: "Branding", icon: Palette },
              { id: "payments", label: "Pagamentos", icon: CreditCard },
              { id: "stencil", label: "Stencil AI", icon: Wand2 },
              { id: "calendar", label: "Agenda", icon: CalendarDays },
              { id: "plan", label: "Plano", icon: Crown },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  tab === item.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          {tab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Meu Perfil</h2>
                <p className="text-sm text-muted-foreground">Informações pessoais do tatuador</p>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">MR</span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="text-xs gap-1.5">
                      <Upload className="w-3 h-3" /> Alterar foto
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Nome completo</Label>
                    <Input defaultValue="Marcelo Rodrigues" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Nome artístico</Label>
                    <Input defaultValue="@marcelo.ink" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Email</Label>
                    <Input defaultValue="marcelo@inkflow.com" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Telefone</Label>
                    <Input defaultValue="+55 11 99999-0000" className="h-9 text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Bio</Label>
                  <Textarea
                    defaultValue="Tatuador especializado em fine line, blackwork e realismo. +10 anos de experiência."
                    className="text-sm min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Estilos principais</Label>
                  <div className="flex gap-2 flex-wrap">
                    {["Fine Line", "Blackwork", "Realismo", "Japanese"].map((style) => (
                      <span key={style} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                        {style}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
                    <Save className="w-4 h-4" /> Salvar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {tab === "studio" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Estúdio</h2>
                <p className="text-sm text-muted-foreground">Informações do estúdio de tatuagem</p>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Nome do estúdio</Label>
                    <Input defaultValue="InkFlow Studio" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">CNPJ</Label>
                    <Input defaultValue="12.345.678/0001-90" className="h-9 text-sm" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Endereço</Label>
                    <Input defaultValue="Rua Augusta, 1234 – São Paulo, SP" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Telefone</Label>
                    <Input defaultValue="+55 11 3333-4444" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Instagram</Label>
                    <Input defaultValue="@inkflow.studio" className="h-9 text-sm" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
                    <Save className="w-4 h-4" /> Salvar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Notificações</h2>
                <p className="text-sm text-muted-foreground">Configure suas preferências de notificação</p>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
                {[
                  { label: "Novos agendamentos", desc: "Notificar quando um cliente agendar", default: true },
                  { label: "Cancelamentos", desc: "Notificar cancelamentos de sessão", default: true },
                  { label: "Pagamentos recebidos", desc: "Notificar quando pagamento for confirmado", default: true },
                  { label: "Estoque baixo", desc: "Alertar quando item estiver abaixo do mínimo", default: true },
                  { label: "Lembretes de sessão", desc: "Lembrete 24h antes da sessão", default: false },
                  { label: "Aftercare follow-up", desc: "Lembrete de follow-up pós-tatuagem", default: false },
                  { label: "Relatórios semanais", desc: "Resumo semanal por email", default: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "plan" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Plano</h2>
                <p className="text-sm text-muted-foreground">Gerencie sua assinatura</p>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-lg font-bold text-foreground">InkFlow Pro</p>
                    <p className="text-xs text-muted-foreground">Plano ativo desde Mar 2026</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-background/50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-foreground">∞</p>
                    <p className="text-[10px] text-muted-foreground">Stencils/mês</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-foreground">5</p>
                    <p className="text-[10px] text-muted-foreground">Artistas</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-foreground">50GB</p>
                    <p className="text-[10px] text-muted-foreground">Armazenamento</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">R$ 149<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {!["profile", "studio", "notifications", "plan"].includes(tab) && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  {tab === "team" ? "Equipe" : tab === "branding" ? "Branding" : tab === "payments" ? "Pagamentos" : tab === "stencil" ? "Stencil AI" : "Agenda"}
                </h2>
                <p className="text-sm text-muted-foreground">Configurações em desenvolvimento</p>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">Esta seção estará disponível em breve</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}