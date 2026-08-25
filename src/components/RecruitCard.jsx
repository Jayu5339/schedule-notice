export default function RecruitCard({ items }) {
  return (
    <div className="b-card">
      <div className="b-head">
        <h3>채용 마감</h3>
        <span className="b-badge recruit">✦</span>
      </div>
      {items.map((item, i) => (
        <div key={item.id}>
          <div className="b-row">
            <span className="name">{item.name}</span>
            <span className="when">{item.when}</span>
          </div>
          {i < items.length - 1 && <div className="b-divider"></div>}
        </div>
      ))}
    </div>
  );
}
