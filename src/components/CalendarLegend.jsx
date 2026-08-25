import { CATEGORY_COLORS, CATEGORY_LABELS } from "../data/mockData";

export default function CalendarLegend() {
  return (
    <div className="cal-legend">
      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
        <div className="item" key={key}>
          <span
            className="sw"
            style={{ background: CATEGORY_COLORS[key] }}
          ></span>
          {label}
        </div>
      ))}
    </div>
  );
}
