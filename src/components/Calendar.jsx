import { generateMonthDays, dateKey, isSameDate } from "../utils/calendarUtils";
import CalendarLegend from "./CalendarLegend";
import { CATEGORY_COLORS } from "../data/mockData";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function Calendar({
  year,
  month,
  selectedDate,
  today,
  eventsByDate,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
}) {
  const days = generateMonthDays(year, month);

  return (
    <div className="calendar-card">
      <div className="cal-head">
        <h2>
          {year}년 {month}월
        </h2>
        <div className="cal-nav">
          <button onClick={onPrevMonth}>‹</button>
          <button onClick={onNextMonth}>›</button>
        </div>
      </div>

      <div className="cal-weekdays">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="cal-grid">
        {days.map((cell) => {
          const cellDate = {
            year: cell.year,
            month: cell.month,
            day: cell.day,
          };
          const isToday = isSameDate(cellDate, today);
          const isSelected = isSameDate(cellDate, selectedDate);
          const categories =
            eventsByDate[dateKey(cell.year, cell.month, cell.day)] || [];

          return (
            <div
              key={`${cell.year}-${cell.month}-${cell.day}-${cell.muted ? "m" : "c"}`}
              className={[
                "cal-cell",
                cell.muted && "muted",
                isToday && "today",
                isSelected && "selected",
              ]
                .filter(Boolean)
                .join(" ")}
              role="button"
              tabIndex={0}
              onClick={() => onSelectDay(cellDate)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectDay(cellDate);
                }
              }}
            >
              <span className="num">{cell.day}</span>
              {categories.length > 0 && (
                <div className="dots">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      style={{ background: CATEGORY_COLORS[cat] }}
                    ></span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CalendarLegend />
    </div>
  );
}
