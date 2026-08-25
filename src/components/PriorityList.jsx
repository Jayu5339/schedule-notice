import PriorityCard from "./PriorityCard";

export default function PriorityList({ items }) {
  return (
    <div className="priority-col">
      {items.map((item) => (
        <PriorityCard key={item.id} item={item} />
      ))}
    </div>
  );
}
