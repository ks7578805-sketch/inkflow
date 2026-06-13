import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Topbar from "@/components/layout/Topbar";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarStatsBar from "@/components/calendar/CalendarStatsBar";
import MonthView from "@/components/calendar/MonthView";
import WeekView from "@/components/calendar/WeekView";
import DayView from "@/components/calendar/DayView";
import DayDetailPanel from "@/components/calendar/DayDetailPanel";
import { getMonthStats } from "@/data/calendarMock";

const VIEW_TRANSITION = { duration: 0.18, ease: [0.4, 0, 0.2, 1] };
const EMPTY_FILTERS = { statuses: [], artists: [] };

export default function Calendar() {
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState("month");
  const [selectedDay, setSelectedDay] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [overrides, setOverrides] = useState(() => new Map());

  const periodStats = useMemo(
    () => getMonthStats(cursor, overrides),
    [cursor, overrides],
  );

  const handleSelectDay = useCallback((day) => {
    setSelectedDay((current) =>
      current && current.getTime() === day.getTime() ? null : day,
    );
  }, []);

  const handlePanelToday = useCallback(() => {
    const today = new Date();
    setCursor(today);
    setSelectedDay(today);
  }, []);

  const applyOverride = useCallback((id, patch) => {
    setOverrides((prev) => {
      const next = new Map(prev);
      next.set(id, { ...(next.get(id) || {}), ...patch });
      return next;
    });
  }, []);

  const handleConfirm = useCallback(
    (id) => applyOverride(id, { status: "confirmado", depositoPago: undefined }),
    [applyOverride],
  );
  const handleCancel = useCallback(
    (id) => applyOverride(id, { status: "cancelado" }),
    [applyOverride],
  );

  const handleNewSession = useCallback(() => {
    // Hook reservado para o NewSessionModal (próxima fase de integração).
    // eslint-disable-next-line no-console
    console.info("[calendar] new session — TODO: open NewSessionModal");
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar title="Agenda" subtitle="Sessões, horários e disponibilidade" />

      <div className="flex flex-1 flex-col gap-4 p-3 md:p-5 min-h-0">
        <CalendarStatsBar cursor={cursor} overrides={overrides} />

        <CalendarHeader
          cursor={cursor}
          view={view}
          onCursorChange={setCursor}
          onViewChange={setView}
          onToday={() => setCursor(new Date())}
          onNewSession={handleNewSession}
          periodStats={periodStats}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="flex flex-1 gap-4 min-h-0">
          <div className="flex flex-1 flex-col min-h-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={VIEW_TRANSITION}
                className="flex flex-1 flex-col min-h-0"
              >
                {view === "month" && (
                  <MonthView
                    cursor={cursor}
                    selectedDay={selectedDay}
                    onSelectDay={handleSelectDay}
                    filters={filters}
                    overrides={overrides}
                  />
                )}
                {view === "week" && (
                  <WeekView
                    cursor={cursor}
                    onSelectDay={(day) => {
                      setCursor(day);
                      setView("day");
                    }}
                    filters={filters}
                    overrides={overrides}
                  />
                )}
                {view === "day" && (
                  <DayView
                    cursor={cursor}
                    filters={filters}
                    overrides={overrides}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence initial={false}>
            {selectedDay && view === "month" && (
              <DayDetailPanel
                day={selectedDay}
                onClose={() => setSelectedDay(null)}
                onToday={handlePanelToday}
                filters={filters}
                overrides={overrides}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
