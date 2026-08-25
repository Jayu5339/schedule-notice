import { useState } from "react";
import { useMealInfo } from "../hooks/useMealInfo";

const TABS = ["조식", "중식", "석식"];

function toDateStr(d) {
  if (!d) return null;
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
}

export default function MealCard({ selectedDate }) {
  const [activeTab, setActiveTab] = useState("중식");
  const dateStr = toDateStr(selectedDate);
  const { mealData, loading, error } = useMealInfo(dateStr);
  const items = dateStr ? (mealData[activeTab] ?? []) : [];

  return (
    <div className="b-card">
      <div className="b-head">
        <h3>급식 정보</h3>
        <span className="b-badge meal">☀</span>
      </div>
      <div className="meal-tab">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="meal-list">
        {!dateStr && <div className="item muted">날짜를 선택해주세요</div>}
        {dateStr && loading && <div className="item muted">불러오는 중…</div>}
        {dateStr && !loading && error && (
          <div className="item muted">급식 정보를 불러오지 못했어요</div>
        )}
        {dateStr && !loading && !error && items.length === 0 && (
          <div className="item muted">등록된 급식 정보가 없어요</div>
        )}
        {dateStr &&
          !loading &&
          !error &&
          items.map((food) => (
            <div className="item" key={food}>
              {food}
            </div>
          ))}
      </div>
    </div>
  );
}
