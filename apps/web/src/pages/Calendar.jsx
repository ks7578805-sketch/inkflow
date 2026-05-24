import { useState, useMemo } from "react";
import Topbar from "@/components/layout/Topbar";
import { MOCK_SESSIONS } from "@/data/calendarMock";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import DayView from "@/components/calendar/DayView";
import WeekView from "@/components/calendar/WeekView";
import MonthView from "@/components/calendar/MonthView";
import SessionDetailPanel from "@/components/calendar/SessionDetailPanel";
import NewSessionModal from "@/components/calendar/NewSessionModal";
import { format } from "date-fns";

export default function Calendar() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("day");
  const [artist, setArtist] = useState("all");
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter by artist
  const filteredSessions = useMemo(() => {
    if (artist === "all") return sessions;
    return sessions.filter(s => s.artist === artist);
  }, [sessions, artist]);

  const handleNewSession = (data) => {
    setSessions(prev => [...prev, data]);
  };

  const handleStatusChange = (id, newStatus) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    setSelectedSession(prev => prev?.id === id ? { ...prev, status: newStatus } : prev);
  };

  const handleDayClick = (day) => {
    setDate(day);
    setView("day");
  };

  // Summary strip for day view
  const todayStr = format(date, "yyyy-MM-dd");
  const daySessions = filteredSessions.filter(s => s.date === todayStr);
  const dayRevenue = daySessions.reduce((a, s) => a + (s.value || 0), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar title="Agenda" subtitle="Sessões, horários e disponibilidade" />

      <div className="flex-1 flex flex-col p-3 md:p-5 gap-4 min-h-0">
        {/* Header controls */}
        <CalendarHeader
          date={date}
          view={view}
          artist={artist}
          onDateChange={setDate}
          onViewChange={setView}
          onArtistChange={setArtist}
          onNewSession={() => setShowModal(true)}
        />

        {/* Day summary strip (day view only) */}
        {view === "day" && (
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-0.5">
            {[
              { label: "Sessões hoje", value: daySessions.length },
              { label: "Receita prevista", value: `R$ ${dayRevenue.toLocaleString("pt-BR")}` },
              { label: "Horas agendadas", value: `${daySessions.reduce((a, s) => a + s.duration, 0)}h` },
              { label: "Confirmadas", value: daySessions.filter(s => s.status === "Confirmada").length },
            ].map((item) => (
              <div key={item.label} className="shrink-0 bg-card border border-border/50 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <p className="text-lg font-bold text-foreground">{item.value}</p>
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Main area */}
        <div className="flex-1 flex gap-4 min-h-0" style={{ height: "calc(100vh - 240px)" }}>
          {/* Calendar view */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {view === "day" && (
              <DayView
                date={date}
                sessions={filteredSessions}
                selectedId={selectedSession?.id}
                onSelect={setSelectedSession}
              />
            )}
            {view === "week" && (
              <WeekView
                date={date}
                sessions={filteredSessions}
                onSelect={setSelectedSession}
                onDayClick={handleDayClick}
              />
            )}
            {view === "month" && (
              <MonthView
                date={date}
                sessions={filteredSessions}
                onSelect={setSelectedSession}
                onDayClick={handleDayClick}
              />
            )}
          </div>

          {/* Detail panel */}
          {selectedSession && (
            <div className="hidden md:flex w-72 lg:w-80 flex-shrink-0 flex-col bg-card border border-border/50 rounded-xl p-5 overflow-y-auto">
              <SessionDetailPanel
                session={selectedSession}
                onClose={() => setSelectedSession(null)}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}
        </div>

        {/* Mobile detail sheet */}
        {selectedSession && (
          <div className="fixed md:hidden inset-x-0 bottom-0 z-50 bg-card border-t border-border rounded-t-2xl p-5 shadow-2xl max-h-[75vh] overflow-y-auto">
            <div className="w-10 h-1 bg-muted-foreground/20 rounded-full mx-auto mb-4" />
            <SessionDetailPanel
              session={selectedSession}
              onClose={() => setSelectedSession(null)}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </div>

      <NewSessionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleNewSession}
        defaultDate={date}
      />
    </div>
  );
}