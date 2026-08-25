export default function DeadlineCard({ items }) {
  const safeItems = items ?? [];

  return (
    <div className="b-card">
      <div className="b-head">
        <h3>과제 · 제출물 마감</h3>
        <span className="b-badge submit">✎</span>
      </div>
      {safeItems.length === 0 && (
        <div className="p-desc">등록된 제출물이 없어요</div>
      )}
      {safeItems.map((item, i) => (
        <div key={item.id}>
          <div className="b-row">
            <span className="name">{item.name}</span>
            <span className="when">{item.when}</span>
          </div>
          {i < safeItems.length - 1 && <div className="b-divider"></div>}
          {item.desc && (
            <div className="p-desc" style={{ marginTop: "-4px" }}>
              {item.desc}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
