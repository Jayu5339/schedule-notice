import { useEffect, useState } from "react";
import "./AddEventModal.css";

const CATEGORY_OPTIONS = [
  { value: "perf", label: "수행평가" },
  { value: "submit", label: "제출물" },
  { value: "school", label: "학교일정" },
  { value: "recruit", label: "채용의뢰" },
];

export default function AddEventModal({
  open,
  defaultDate,
  initialValues = null,
  mode = "create",
  onClose,
  onSubmit,
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [category, setCategory] = useState(initialValues?.category ?? "perf");
  const [eventDate, setEventDate] = useState(
    initialValues?.eventDate ?? defaultDate ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!open) return;

    setTitle(initialValues?.title ?? "");
    setDescription(initialValues?.description ?? "");
    setCategory(initialValues?.category ?? "perf");
    setEventDate(initialValues?.eventDate ?? defaultDate ?? "");
    setErrorMsg(null);
  }, [open, initialValues, defaultDate]);

  if (!open) return null;

  const resetAndClose = () => {
    setTitle("");
    setDescription("");
    setCategory("perf");
    setErrorMsg(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) {
      setErrorMsg("제목과 날짜는 필수예요.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      await onSubmit({
        title: title.trim(),
        description,
        category,
        event_date: eventDate,
        pinned: category === "perf",
      });
      resetAndClose();
    } catch (err) {
      setErrorMsg(
        err?.message || "저장에 실패했어요. 잠시 후 다시 시도해주세요.",
      );
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={resetAndClose}>
      <form
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="modal-head">
          <h3>{mode === "edit" ? "일정 수정" : "일정 추가"}</h3>
          <button type="button" className="modal-close" onClick={resetAndClose}>
            ✕
          </button>
        </div>

        <label className="modal-field">
          <span>제목</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 수학 포트폴리오"
          />
        </label>

        <label className="modal-field">
          <span>카테고리</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="modal-field">
          <span>날짜</span>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </label>

        <label className="modal-field">
          <span>설명 (선택)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </label>

        {errorMsg && <p className="modal-error">{errorMsg}</p>}

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={resetAndClose}>
            취소
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "저장 중…" : mode === "edit" ? "수정" : "추가"}
          </button>
        </div>
      </form>
    </div>
  );
}
