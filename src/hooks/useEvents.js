import { useCallback, useEffect, useState } from "react";
import { fetchEvents, createEvent, deleteEvent } from "../api/eventsApi";
import { computeDday } from "../utils/dday";

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const addEvent = useCallback(async (payload) => {
    const created = await createEvent(payload);
    setEvents((prev) => [...prev, created]);
    return created;
  }, []);

  const removeEvent = useCallback(async (id) => {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // 캘린더 dot용: { "2026-08-19": ["submit"], ... }
  const eventsByDate = events.reduce((acc, e) => {
    (acc[e.event_date] ||= []).push(e.category);
    return acc;
  }, {});

  // 우측 우선순위 카드용: D-day 계산 + 임박순 정렬 + faded/hot 스타일 플래그
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
    .sort((a, b) => (a.dday === b.dday ? 0 : 0)) // 필요하면 diffDays 기준 정렬 로직 추가
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
