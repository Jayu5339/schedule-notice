import { useCallback, useEffect, useState } from "react";
import { fetchEvents, createEvent, deleteEvent } from "../api/eventsApi";
import { computeDday } from "../utils/dday";
import { getClassFilterFromUser } from "../utils/studentClass";

export function useEvents(user = null) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const classFilter = getClassFilterFromUser(user);

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
    if (!classFilter) {
      setEvents([]);
      setLoading(false);
      return;
    }

    load();
  }, [classFilter, load]);

  const addEvent = useCallback(
    async (payload) => {
      const created = await createEvent({
        ...payload,
        school_year: classFilter?.school_year,
        grade: classFilter?.grade,
        class_number: classFilter?.class_number,
      });
      setEvents((prev) => [...prev, created]);
      return created;
    },
    [classFilter],
  );

  const removeEvent = useCallback(async (id) => {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const eventsByDate = events.reduce((acc, e) => {
    (acc[e.event_date] ||= []).push(e.category);
    return acc;
  }, {});

  const priorityItems = events
    .map((e) => {
      const { label, diffDays } = computeDday(e.event_date);
      return {
        id: e.id,
        category: e.category,
        dday: label,
        title: e.title,
        desc: e.description,
        pinned: e.pinned,
        hot: diffDays <= 2 && diffDays >= 0,
        faded: diffDays < 0,
      };
    })
    .sort((a, b) => (a.dday === b.dday ? 0 : 0))
    .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  return {
    events,
    priorityItems,
    eventsByDate,
    loading,
    error,
    addEvent,
    removeEvent,
    refresh: load,
  };
}
