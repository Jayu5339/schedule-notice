import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/TopBar";
import Toolbar from "../components/Toolbar";
import Calendar from "../components/Calendar";
import PriorityList from "../components/PriorityList";
import BottomGrid from "../components/BottomGrid";
import "./Main.css";
import AddEventModal from "../components/modals/AddEventModal";
import { useEvents } from "../hooks/useEvents";
import { getStudentClassMeta } from "../utils/studentClass";

const today = new Date();
const TODAY = {
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  day: today.getDate(),
};

const CATEGORY_PRIORITY = {
  perf: 3,
  submit: 2,
  school: 1,
  recruit: 0,
};

export default function Main() {
  const { user } = useAuth();
  const classMeta = user
    ? getStudentClassMeta(user.studentId, user.schoolYear ?? 2026)
    : null;

  const [sortBy, setSortBy] = useState("importance");
  const [viewYear, setViewYear] = useState(TODAY.year);
  const [viewMonth, setViewMonth] = useState(TODAY.month);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const { priorityItems, eventsByDate, addEvent, updateEvent, removeEvent } =
    useEvents(user);

  const sortedPriorityItems = useMemo(() => {
    const items = [...priorityItems];

    return items.sort((a, b) => {
      if (sortBy === "dday") {
        const aUrgency =
          a.diffDays < 0 ? Number.MAX_SAFE_INTEGER + a.diffDays : a.diffDays;
        const bUrgency =
          b.diffDays < 0 ? Number.MAX_SAFE_INTEGER + b.diffDays : b.diffDays;
        return (
          aUrgency - bUrgency ||
          Number(new Date(b.createdAt || 0)) -
            Number(new Date(a.createdAt || 0))
        );
      }

      if (sortBy === "created") {
        return (
          Number(new Date(b.createdAt || 0)) -
          Number(new Date(a.createdAt || 0))
        );
      }

      const aPriority = CATEGORY_PRIORITY[a.category] ?? 0;
      const bPriority = CATEGORY_PRIORITY[b.category] ?? 0;
      if (aPriority !== bPriority) return bPriority - aPriority;
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      const aUrgency =
        a.diffDays < 0 ? Number.MAX_SAFE_INTEGER + a.diffDays : a.diffDays;
      const bUrgency =
        b.diffDays < 0 ? Number.MAX_SAFE_INTEGER + b.diffDays : b.diffDays;
      return aUrgency - bUrgency;
    });
  }, [priorityItems, sortBy]);

  const displayPriorityItems = sortedPriorityItems;
  const displayEventsByDate = eventsByDate;

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

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowAddModal(true);
  };

  const handleSaveEvent = async (payload) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, {
        title: payload.title,
        description: payload.description,
        category: payload.category,
        event_date: payload.event_date,
        pinned: payload.category === "perf" || Boolean(payload.pinned),
      });
    } else {
      await addEvent(payload);
    }
    setEditingEvent(null);
  };

  return (
    <div className="main-page">
      <TopBar
        user={
          user
            ? {
                ...user,
                verified: true,
              }
            : { name: "", studentId: "", verified: false, isManager: false }
        }
      />

      <div className="header-row">
        <div className="className-chip">
          {classMeta?.classLabel ?? "2026 · 3학년 2반"}
        </div>
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
          eventsByDate={displayEventsByDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectDay={handleSelectDay}
        />
        <PriorityList
          items={displayPriorityItems}
          isManager={Boolean(user?.isManager)}
          onEdit={handleEditEvent}
          onDelete={removeEvent}
        />
      </div>

      <BottomGrid
        recruits={[]}
        events={displayPriorityItems}
        selectedDate={selectedDate}
      />

      <AddEventModal
        open={showAddModal}
        defaultDate={selectedDateStr}
        initialValues={
          editingEvent
            ? {
                title: editingEvent.title,
                description: editingEvent.desc,
                category: editingEvent.category,
                eventDate: editingEvent.eventDate || selectedDateStr,
              }
            : null
        }
        mode={editingEvent ? "edit" : "create"}
        onClose={() => {
          setShowAddModal(false);
          setEditingEvent(null);
        }}
        onSubmit={handleSaveEvent}
      />
    </div>
  );
}
