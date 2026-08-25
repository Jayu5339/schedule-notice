// 일정 추가 버튼 + 정렬 셀렉트
export default function Toolbar({ sortBy, onSortChange, onAddClick }) {
  return (
    <div className="toolbar">
      <button className="add-btn" onClick={onAddClick}>
        <span className="plus">＋</span>
        일정 추가
      </button>

      <div className="sort-wrap" aria-label="정렬 기준">
        <div className="select-shell">
          <select
            id="priority-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="우선순위 정렬"
          >
            <option value="importance">중요도</option>
            <option value="dday">임박도</option>
            <option value="created">등록순</option>
          </select>
        </div>
      </div>
    </div>
  );
}
