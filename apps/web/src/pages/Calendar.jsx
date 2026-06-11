import { useState } from "react";
import Topbar from "@/components/layout/Topbar";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import MonthView from "@/components/calendar/MonthView";

export default function Calendar() {
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState("month");
  const [selectedDay, setSelectedDay] = useState(null);

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    // Phase 2: opens the sliding day-detail panel.
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar title="Agenda" subtitle="Sessões, horários e disponibilidade" />

      <div className="flex flex-1 flex-col gap-4 p-3 md:p-5 min-h-0">
        <CalendarHeader
          cursor={cursor}
          view={view}
          onCursorChange={setCursor}
          onViewChange={setView}
          onToday={() => setCursor(new Date())}
        />

        <div className="flex flex-1 flex-col min-h-0">
          {view === "month" ? (
            <MonthView
              cursor={cursor}
              selectedDay={selectedDay}
              onSelectDay={handleSelectDay}
            />
          ) : (
            <div className="grid flex-1 place-items-center text-sm text-white/30">
              Em breve
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
