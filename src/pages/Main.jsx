import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/TopBar";
import Toolbar from "../components/Toolbar";
import Calendar from "../components/Calendar";
import PriorityList from "../components/PriorityList";
import BottomGrid from "../components/BottomGrid";
import {
  priorityItems,
  recruitDeadlines,
  submissionDeadlines,
  performanceDeadlines,
  mealData,
  eventsByDate,
  TODAY,
} from "../data/mockData";
import "./Main.css";
// import { useState } from "react";
// import TopBar from "../components/TopBar";
// import Toolbar from "../components/Toolbar";
// import Calendar from "../components/calendar/Calendar";
// import PriorityList from "../components/priority/PriorityList";
// import BottomGrid from "../components/bottom/BottomGrid";
import AddEventModal from "../components/modals/AddEventModal";
import { useEvents } from "../hooks/useEvents";
// import "./Main.css";

// const TODAY = { year: 2026, month: 8, day: 18 };

export default function Main() {
  const user = { name: "이상희", studentId: "20304", verified: true };

  const [sortBy, setSortBy] = useState("importance");
  const [viewYear, setViewYear] = useState(TODAY.year);
  const [viewMonth, setViewMonth] = useState(TODAY.month);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [showAddModal, setShowAddModal] = useState(false);

  const { priorityItems, eventsByDate, addEvent } = useEvents();

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else setViewMonth((m) => m - 1);
  };
  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else setViewMonth((m) => m + 1);
  };
  const handleSelectDay = (date) => {
    setSelectedDate(date);
    if (date.year !== viewYear || date.month !== viewMonth) {
      setViewYear(date.year);
      setViewMonth(date.month);
    }
  };

  const selectedDateStr = `${selectedDate.year}-${String(selectedDate.month).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`;

  return (
    <div className="main-page">
      <TopBar user={user} />

      <div className="header-row">
        <div className="className-chip">2026 · 3학년 2반</div>
      </div>

      <Toolbar
        sortBy={sortBy}
        onSortChange={setSortBy}
        onAddClick={() => setShowAddModal(true)}
      />

      <div className="main-grid">
        <Calendar
          year={viewYear}
          month={viewMonth}
          selectedDate={selectedDate}
          today={TODAY}
          eventsByDate={eventsByDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectDay={handleSelectDay}
        />
        <PriorityList items={priorityItems} />
      </div>

      <BottomGrid
        recruits={recruitDeadlines}
        events={priorityItems}
        selectedDate={selectedDate}
      />

      <AddEventModal
        open={showAddModal}
        defaultDate={selectedDateStr}
        onClose={() => setShowAddModal(false)}
        onSubmit={addEvent}
      />
    </div>
  );
}
