import { useCallback, useEffect, useState, useMemo } from "react";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../api/eventsApi";
import { computeDday } from "../utils/dday";
import { getClassFilterFromUser } from "../utils/studentClass";

export function useEvents(user = null) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const classFilter = useMemo(() => getClassFilterFromUser(user), [user]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEvents(classFilter);
      setEvents(data);
      setError(null);
    } catch (e) {
      setError(e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [classFilter]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!classFilter) {
        if (active) {
          setEvents([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const data = await fetchEvents(classFilter);
        if (active) {
          setEvents(data);
          setError(null);
        }
      } catch (e) {
        if (active) {
          setError(e);
          setEvents([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    run();

    return () => {
      active = false;
    };
  }, [classFilter]);

  const addEvent = useCallback(
    async (payload) => {
      if (!classFilter) {
        throw new Error("로그인 후에만 일정을 추가할 수 있어요.");
      }

      const created = await createEvent({
        ...payload,
        pinned: payload.category === "perf" ? true : Boolean(payload.pinned),
        school_year: classFilter?.school_year,
        grade: classFilter?.grade,
        class_number: classFilter?.class_number,
      });
      setEvents((prev) => [created, ...prev]);
      return created;
    },
    [classFilter],
  );

  const updateExistingEvent = useCallback(async (id, updates) => {
    const saved = await updateEvent(id, updates);
    setEvents((prev) => prev.map((event) => (event.id === id ? saved : event)));
    return saved;
  }, []);

  const removeEvent = useCallback(async (id) => {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const eventsByDate = events.reduce((acc, e) => {
    (acc[e.event_date] ||= []).push(e.category);
    return acc;
  }, {});

  const priorityItems = events.map((e) => {
    const { label, diffDays } = computeDday(e.event_date);
    return {
      id: e.id,
      category: e.category,
      dday: label,
      title: e.title,
      desc: e.description || "설명 없음",
      pinned: Boolean(e.pinned) || e.category === "perf",
      hot: diffDays <= 2 && diffDays >= 0,
      faded: diffDays < 0,
      diffDays,
      createdAt: e.created_at,
    };
  });

  return {
    events,
    priorityItems,
    eventsByDate,
    loading,
    error,
    addEvent,
    updateEvent: updateExistingEvent,
    removeEvent,
    refresh: load,
  };
}
