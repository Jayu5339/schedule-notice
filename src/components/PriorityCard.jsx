import { useEffect, useState } from "react";

const CATEGORY_LABELS = {
  perf: "수행평가",
  submit: "제출물",
  school: "학교일정",
  recruit: "채용의뢰",
};

export default function PriorityCard({
  item,
  isManager = false,
  onEdit,
  onDelete,
}) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("priority_expanded");
      if (!raw) return;
      const map = JSON.parse(raw || "{}") || {};
      if (map[item.id]) setExpanded(true);
    } catch (e) {
      // ignore
    }
  }, [item.id]);

  const classNames = [
    "p-card",
    item.pinned && "pinned",
    item.faded && "faded",
    expanded && "expanded",
  ]
    .filter(Boolean)
    .join(" ");

  const handleCardClick = (event) => {
    if (event.target.closest("button")) return;
    setExpanded((prev) => {
      const next = !prev;
      try {
        const raw = localStorage.getItem("priority_expanded");
        const map = JSON.parse(raw || "{}") || {};
        if (next) map[item.id] = true;
        else delete map[item.id];
        localStorage.setItem("priority_expanded", JSON.stringify(map));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className={classNames} onClick={handleCardClick}>
      <div className="p-top">
        <span className={`tag ${item.category}`}>
          {CATEGORY_LABELS[item.category] || item.category}
        </span>
        <span className={`dday ${item.hot ? "hot" : ""}`}>{item.dday}</span>
      </div>

      <div className="p-body">
        <p className="p-title">{item.title}</p>
        <div className="p-meta">
          <span className="p-bullet" />
          {item.pinned ? "중요 일정" : "일정"}
        </div>
      </div>

      <p className={`p-desc ${expanded ? "visible" : "trimmed"}`}>
        {item.desc}
      </p>

      {isManager && (
        <div className="p-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="mini-btn mini-btn--ghost"
            onClick={() => onEdit?.(item)}
          >
            수정
          </button>
          <button
            type="button"
            className="mini-btn mini-btn--danger"
            onClick={() => onDelete?.(item.id)}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
