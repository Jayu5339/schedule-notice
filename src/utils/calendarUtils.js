// 연/월 기준 캘린더 그리드(6주 x 7일 = 42칸) 생성 유틸
// 이전/다음 달 패딩 날짜도 함께 계산해서 클릭 시 해당 월로 이동할 수 있게 함

export function generateMonthDays(year, month) {
  // month: 1~12
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7; // 월요일=0 기준
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

  const prev =
    month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
  const next =
    month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

  const cells = [];

  // 이전 달 꼬리
  for (let i = 0; i < firstWeekday; i++) {
    const day = daysInPrevMonth - firstWeekday + 1 + i;
    cells.push({ day, year: prev.year, month: prev.month, muted: true });
  }

  // 이번 달
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, year, month, muted: false });
  }

  // 다음 달 머리 (항상 42칸으로 맞춤 → 달마다 캘린더 높이 흔들리지 않음)
  let nextDay = 1;
  while (cells.length < 42) {
    cells.push({
      day: nextDay,
      year: next.year,
      month: next.month,
      muted: true,
    });
    nextDay++;
  }

  return cells;
}

export function dateKey(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function isSameDate(a, b) {
  return (
    !!a && !!b && a.year === b.year && a.month === b.month && a.day === b.day
  );
}
