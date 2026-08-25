import RecruitCard from "./RecruitCard";
import DeadlineCard from "./DeadlineCard";
import PerformanceCard from "./PerformanceCard";
import MealCard from "./MealCard";

// events: useEvents()가 반환하는 priorityItems (category, dday, title 등을 가진 배열)
export default function BottomGrid({
  recruits = [],
  events = [],
  selectedDate,
}) {
  const submissions = events
    .filter((e) => e.category === "submit")
    .map((e) => ({ id: e.id, name: e.title, when: e.dday, desc: e.desc }));

  const performances = events
    .filter((e) => e.category === "perf")
    .map((e) => ({ id: e.id, name: e.title, when: e.dday }));

  return (
    <div className="bottom-grid">
      <RecruitCard items={recruits} />
      <DeadlineCard items={submissions} />
      <PerformanceCard items={performances} />
      <MealCard selectedDate={selectedDate} />
    </div>
  );
}
