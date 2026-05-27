import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock } from "lucide-react";
import { listSessions } from "@/lib/sessions";

function SummaryCard({ label, value, color = "text-foreground" }) {
  return (
    <div className="bg-muted/20 rounded-xl p-3 border border-border/50 text-center">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function ProjectDetailSessions({ project }) {
  const sessionsQuery = useQuery({
    queryKey: ["sessions", "project", project.id],
    queryFn: () => listSessions({ projectId: project.id }),
  });

  const sessions = useMemo(() => sessionsQuery.data?.items ?? [], [sessionsQuery.data]);
  const completedSessions = project.sessions.done;
  const scheduledSessions = Math.max(project.sessions.total - project.sessions.done, 0);
  const totalHours = project.hoursReal;

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Sessões do Projeto</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{totalHours}h acumuladas · {completedSessions} sessões concluídas</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Concluídas" value={completedSessions} color="text-primary" />
        <SummaryCard label="Restantes" value={scheduledSessions} color="text-blue-400" />
        <SummaryCard label="Horas totais" value={`${totalHours}h`} />
      </div>

      {sessionsQuery.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-16 rounded-xl bg-muted/20 animate-pulse" />
          ))}
        </div>
      ) : sessionsQuery.isError ? (
        <div className="py-12 text-center border border-destructive/20 rounded-xl bg-destructive/5">
          <CalendarDays className="w-8 h-8 text-destructive/40 mx-auto mb-2" />
          <p className="text-sm text-foreground">Não foi possível carregar as sessões</p>
          <p className="text-xs text-muted-foreground mt-1">{sessionsQuery.error.message}</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-12 text-center border border-border/50 rounded-xl bg-card">
          <CalendarDays className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nenhuma sessão registrada</p>
          <p className="text-xs text-muted-foreground mt-1">Crie uma sessão no calendário para este projeto.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="rounded-xl border border-border/50 bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{formatDateTime(session.startsAt)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{session.status}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.max(1, Math.round(((new Date(session.endsAt).getTime() - new Date(session.startsAt).getTime()) / (60 * 60 * 1000)) * 10) / 10)}h
                </div>
              </div>
              {session.notes && <p className="text-xs text-foreground/80 mt-3">{session.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
