import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Topbar from "@/components/layout/Topbar";
import { toast } from "@/components/ui/use-toast";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import DayView from "@/components/calendar/DayView";
import WeekView from "@/components/calendar/WeekView";
import MonthView from "@/components/calendar/MonthView";
import SessionDetailPanel from "@/components/calendar/SessionDetailPanel";
import NewSessionModal from "@/components/calendar/NewSessionModal";
import { buildCalendarArtistOptions, listProjects } from "@/lib/projects";
import { cancelSession, concludeSession, createSession, listSessions, mapSessionToCalendarSession, updateSession } from "@/lib/sessions";
import { format } from "date-fns";

export default function Calendar() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("day");
  const [artist, setArtist] = useState("all");
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
  });

  const sessionsQuery = useQuery({
    queryKey: ["sessions"],
    queryFn: () => listSessions(),
  });

  const saveMutation = useMutation({
    mutationFn: ({ sessionId, payload }) => (sessionId ? updateSession(sessionId, payload) : createSession(payload)),
    onSuccess: ({ session }) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setSelectedSessionId(session.id);
      setEditingSession(null);
      setShowModal(false);
      toast({ title: "Sessão salva", description: `${session.project.name} foi atualizado na agenda.` });
    },
    onError: (error) => {
      toast({ title: "Erro ao salvar sessão", description: error.message, variant: "destructive" });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ sessionId, status }) => (status === "Concluída" ? concludeSession(sessionId) : cancelSession(sessionId)),
    onSuccess: ({ session }) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setSelectedSessionId(session.id);
      toast({ title: "Status atualizado", description: `${session.project.name} foi atualizado.` });
    },
    onError: (error) => {
      toast({ title: "Erro ao atualizar status", description: error.message, variant: "destructive" });
    },
  });

  const projects = useMemo(() => projectsQuery.data?.items ?? [], [projectsQuery.data]);
  const rawSessions = useMemo(() => sessionsQuery.data?.items ?? [], [sessionsQuery.data]);
  const artistOptions = useMemo(() => buildCalendarArtistOptions(projects), [projects]);
  const sessions = useMemo(() => rawSessions.map(mapSessionToCalendarSession), [rawSessions]);

  const filteredSessions = useMemo(() => {
    if (artist === "all") return sessions.filter((session) => session.status !== "Cancelada");
    return sessions.filter((session) => session.artist === artist && session.status !== "Cancelada");
  }, [sessions, artist]);

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) ?? null,
    [sessions, selectedSessionId],
  );

  const todayStr = format(date, "yyyy-MM-dd");
  const daySessions = filteredSessions.filter((session) => session.date === todayStr);
  const dayRevenue = daySessions.reduce((amount, session) => amount + (session.value || 0), 0);
  const isSaving = saveMutation.isPending || statusMutation.isPending;

  const handleDayClick = (day) => {
    setDate(day);
    setView("day");
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setShowModal(true);
  };

  const handleSaveSession = async ({ sessionId, payload }) => {
    await saveMutation.mutateAsync({ sessionId, payload });
  };

  const handleStatusChange = async (sessionId, status) => {
    await statusMutation.mutateAsync({ sessionId, status });
  };

  const handleOpenProject = (projectId) => {
    if (!projectId) {
      return;
    }

    navigate(`/projects?project=${projectId}`);
  };

  const handleUnschedule = async (sessionId) => {
    await statusMutation.mutateAsync({ sessionId, status: "Cancelada" });
    setSelectedSessionId(null);
  };

  const closeModal = () => {
    if (isSaving) {
      return;
    }

    setShowModal(false);
    setEditingSession(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar title="Agenda" subtitle="Sessões, horários e disponibilidade" />

      <div className="flex-1 flex flex-col p-3 md:p-5 gap-4 min-h-0">
        <CalendarHeader
          date={date}
          view={view}
          artist={artist}
          artistOptions={artistOptions}
          onDateChange={setDate}
          onViewChange={setView}
          onArtistChange={setArtist}
          onNewSession={() => {
            setEditingSession(null);
            setShowModal(true);
          }}
        />

        {view === "day" && (
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-0.5">
            {[
              { label: "Sessões hoje", value: daySessions.length },
              { label: "Receita prevista", value: `R$ ${dayRevenue.toLocaleString("pt-BR")}` },
              { label: "Horas agendadas", value: `${daySessions.reduce((amount, session) => amount + session.duration, 0)}h` },
              { label: "Confirmadas", value: daySessions.filter((session) => session.status === "Confirmada").length },
            ].map((item) => (
              <div key={item.label} className="shrink-0 bg-card border border-border/50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <p className="text-lg font-bold text-foreground">{item.value}</p>
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {sessionsQuery.isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="text-sm font-medium text-foreground">Não foi possível carregar a agenda</p>
            <p className="text-xs text-muted-foreground mt-1">{sessionsQuery.error.message}</p>
          </div>
        ) : (
          <div className="flex-1 flex gap-4 min-h-0" style={{ height: "calc(100vh - 240px)" }}>
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {sessionsQuery.isLoading ? (
                <div className="flex-1 rounded-xl bg-muted/20 animate-pulse" />
              ) : view === "day" ? (
                <DayView
                  date={date}
                  sessions={filteredSessions}
                  selectedId={selectedSession?.id}
                  onSelect={(session) => setSelectedSessionId(session.id)}
                />
              ) : view === "week" ? (
                <WeekView
                  date={date}
                  sessions={filteredSessions}
                  onSelect={(session) => setSelectedSessionId(session.id)}
                  onDayClick={handleDayClick}
                />
              ) : (
                <MonthView
                  date={date}
                  sessions={filteredSessions}
                  onSelect={(session) => setSelectedSessionId(session.id)}
                  onDayClick={handleDayClick}
                />
              )}
            </div>

            {selectedSession && (
              <div className="hidden md:flex w-72 lg:w-80 flex-shrink-0 flex-col bg-card border border-border/50 rounded-xl p-5 overflow-y-auto">
                <SessionDetailPanel
                  session={selectedSession}
                  onClose={() => setSelectedSessionId(null)}
                  onEdit={handleEditSession}
                  onStatusChange={handleStatusChange}
                  onOpenProject={handleOpenProject}
                  onUnschedule={handleUnschedule}
                  isSaving={isSaving}
                />
              </div>
            )}
          </div>
        )}

        {selectedSession && (
          <div className="fixed md:hidden inset-x-0 bottom-0 z-50 bg-card border-t border-border rounded-t-2xl p-5 shadow-2xl max-h-[75vh] overflow-y-auto">
            <div className="w-10 h-1 bg-muted-foreground/20 rounded-full mx-auto mb-4" />
            <SessionDetailPanel
              session={selectedSession}
              onClose={() => setSelectedSessionId(null)}
              onEdit={handleEditSession}
              onStatusChange={handleStatusChange}
              onOpenProject={handleOpenProject}
              onUnschedule={handleUnschedule}
              isSaving={isSaving}
            />
          </div>
        )}
      </div>

      <NewSessionModal
        open={showModal}
        onClose={closeModal}
        onSave={handleSaveSession}
        defaultDate={date}
        projects={projects}
        initialSession={editingSession}
        isPending={saveMutation.isPending}
      />
    </div>
  );
}
