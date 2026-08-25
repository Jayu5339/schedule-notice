import { CATEGORY_LABELS } from "../data/mockData";

export default function PriorityCard({ item }) {
  const classNames = ["p-card", item.pinned && "pinned", item.faded && "faded"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames}>
      <div className="p-top">
        <span className={`tag ${item.category}`}>
          {CATEGORY_LABELS[item.category]}
        </span>
        <span className={`dday ${item.hot ? "hot" : ""}`}>{item.dday}</span>
      </div>
      <p className="p-title">{item.title}</p>
      <p className="p-desc">{item.desc}</p>
    </div>
  );
}
