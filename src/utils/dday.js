// event_date("YYYY-MM-DD")와 오늘 날짜를 비교해 D-day 라벨 계산
export function computeDday(eventDateStr, today = new Date()) {
  const eventDate = new Date(eventDateStr + "T00:00:00");
  const todayMid = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const diffDays = Math.round((eventDate - todayMid) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { label: "D-DAY", diffDays };
  if (diffDays > 0) return { label: `D-${diffDays}`, diffDays };
  return { label: `D+${Math.abs(diffDays)}`, diffDays };
}
