export default function PerformanceCard({ items, rangeLabel = "7일 내" }) {
  const safeItems = items ?? [];

  return (
    <div className="b-card">
      <div className="b-head">
        <h3>
          수행평가 · {rangeLabel} {safeItems.length}개
        </h3>
        <span className="b-badge perf">!</span>
      </div>
      {safeItems.length === 0 && (
        <div className="p-desc">예정된 수행평가가 없어요</div>
      )}
      {safeItems.map((item) => (
        <div className="b-row" key={item.id}>
          <span className="name">{item.name}</span>
          <span className="when">{item.when}</span>
        </div>
      ))}
    </div>
  );
}
