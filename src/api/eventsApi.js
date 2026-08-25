import { supabase } from "../../supabase/supabaseClient";

export async function fetchEvents(classFilter = null) {
  let query = supabase.from("events").select("*");

  if (classFilter) {
    query = query
      .eq("school_year", classFilter.school_year)
      .eq("grade", classFilter.grade)
      .eq("class_number", classFilter.class_number);
  }

  const { data, error } = await query.order("event_date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createEvent({
  title,
  description,
  category,
  event_date,
  pinned = false,
  school_year,
  grade,
  class_number,
}) {
  const payload = {
    title,
    description,
    category,
    event_date,
    pinned,
  };

  if (school_year != null) payload.school_year = school_year;
  if (grade != null) payload.grade = grade;
  if (class_number != null) payload.class_number = class_number;

  const { data, error } = await supabase
    .from("events")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(id) {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}
