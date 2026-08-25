import { supabase } from "../../supabase/supabaseClient";

export async function fetchEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createEvent({
  title,
  description,
  category,
  event_date,
  pinned = false,
}) {
  const { data, error } = await supabase
    .from("events")
    .insert([{ title, description, category, event_date, pinned }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(id) {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}
