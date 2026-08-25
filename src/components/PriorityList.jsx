import PriorityCard from "./PriorityCard";

export default function PriorityList({
  items = [],
  isManager = false,
  onEdit,
  onDelete,
}) {
  if (!items.length) {
    return (
      <div className="priority-col">
        <div className="priority-empty">
          <div className="priority-empty__badge">👾</div>
          <div className="priority-empty__title">등록된 일정이 없어요</div>
          <div className="priority-empty__sub">
            반의 중요한 일정이 추가되면 여기에서 한눈에 확인할 수 있어요.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="priority-col">
      {items.map((item) => (
        <PriorityCard
          key={item.id}
          item={item}
          isManager={isManager}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
