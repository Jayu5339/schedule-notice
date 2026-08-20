// client/src/pages/Onboarding.jsx
//
// 화면 구성:
//   landing     : 서비스 소개 + "시작하기" / "이미 계정이 있어요"
//   signupInfo  : 회원가입 1/2 — 학번·이름·번호 직접 입력 (명단 선택 → 직접 입력으로 변경)
//   signupPin   : 회원가입 2/2 — PIN 설정 + 확인
//   checkAccount: 학번·이름·번호로 기존 계정 조회 → 있으면 "로그인 하러 가기" 링크 노출
//   login       : 조회된 계정으로 PIN 입력 후 로그인
//
// 데이터는 아직 서버가 없어서 전부 localStorage(api/localStore.js)에 저장돼요.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { localStore } from "../api/localStore";
import "./Onboarding.css";

const emptyForm = { studentId: "", name: "", number: "" };

export default function Onboarding() {
  const [stage, setStage] = useState("landing");
  // landing | signupInfo | signupPin | checkAccount | login

  const [form, setForm] = useState(emptyForm);
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [checkResult, setCheckResult] = useState(null); // null | "found" | "notfound"
  const [matchedStudent, setMatchedStudent] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const resetAndGo = (nextStage) => {
    setError("");
    setPin("");
    setPinConfirm("");
    setStage(nextStage);
  };

  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePinChange = (setter) => (e) => {
    setter(e.target.value.replace(/\D/g, "").slice(0, 4));
  };

  // 회원가입 1/2 -> 2/2
  const goToSignupPin = (e) => {
    e.preventDefault();
    if (!form.studentId.trim() || !form.name.trim() || !form.number.trim()) {
      setError("학번, 이름, 번호를 모두 입력해주세요");
      return;
    }
    setError("");
    setStage("signupPin");
  };

  // 회원가입 2/2: PIN 설정 -> 계정 생성
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (pin.length !== 4) {
      setError("PIN 4자리를 입력해주세요");
      return;
    }
    if (pin !== pinConfirm) {
      setError("PIN이 서로 달라요. 다시 확인해주세요");
      return;
    }

    setSubmitting(true);
    try {
      const record = localStore.createStudent({ ...form, pin });
      login({ token: `local-${record.studentId}`, name: record.name, studentId: record.studentId, number: record.number });
      navigate("/");
    } catch (err) {
      setError(err.message || "가입 중 문제가 발생했어요");
      setPin("");
      setPinConfirm("");
    } finally {
      setSubmitting(false);
    }
  };

  // "이미 계정이 있어요" 조회
  const handleCheckAccount = (e) => {
    e.preventDefault();
    setError("");

    if (!form.studentId.trim() || !form.name.trim() || !form.number.trim()) {
      setError("학번, 이름, 번호를 모두 입력해주세요");
      return;
    }

    const found = localStore.findStudent(form);
    if (found) {
      setMatchedStudent(found);
      setCheckResult("found");
    } else {
      setMatchedStudent(null);
      setCheckResult("notfound");
    }
  };

  // 로그인 (PIN 검증)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (pin.length !== 4) {
      setError("PIN 4자리를 입력해주세요");
      return;
    }

    setSubmitting(true);
    try {
      const student = localStore.verifyPin(matchedStudent.studentId, pin);
      login({ token: `local-${student.studentId}`, name: student.name, studentId: student.studentId, number: student.number });
      navigate("/");
    } catch (err) {
      setError(err.message || "로그인 중 문제가 발생했어요");
      setPin("");
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabel =
    stage === "signupInfo" ? "1 / 2" : stage === "signupPin" ? "2 / 2" : null;

  return (
    <div className="onboarding">
      <div className="onboarding__card">
        <div className="onboarding__brand">
          <span className="onboarding__badge">S/N</span>
          <span className="onboarding__brand-name">schedule-notice</span>
          <span className="onboarding__brand-sep">·</span>
          <span className="onboarding__brand-sub">일알림</span>
          {stepLabel && <span className="onboarding__step-count">{stepLabel}</span>}
        </div>

        {stage === "landing" && (
          <LandingStage
            onStart={() => {
              setForm(emptyForm);
              resetAndGo("signupInfo");
            }}
            onCheckAccount={() => {
              setForm(emptyForm);
              setCheckResult(null);
              resetAndGo("checkAccount");
            }}
          />
        )}

        {stage === "signupInfo" && (
          <InfoForm
            title={"안녕하세요,\n학급 일정을 같이 쓰는 서비스, 일알림입니다"}
            subheading="가입을 위해 아래 정보를 입력해주세요."
            form={form}
            onChange={handleFormChange}
            onSubmit={goToSignupPin}
            error={error}
            submitLabel="다음"
          />
        )}

        {stage === "signupPin" && (
          <PinForm
            title={`안녕하세요, ${form.name}님\n마지막으로 PIN을 설정해주세요`}
            subheading="다음에 로그인할 때 사용할 4자리 번호예요."
            pin={pin}
            pinConfirm={pinConfirm}
            showConfirm
            onPinChange={handlePinChange(setPin)}
            onPinConfirmChange={handlePinChange(setPinConfirm)}
            onBack={() => resetAndGo("signupInfo")}
            onSubmit={handleSignupSubmit}
            error={error}
            submitting={submitting}
            submitLabel="가입 완료"
          />
        )}

        {stage === "checkAccount" && (
          <>
            <InfoForm
              title={"이미 계정이 있으신가요?"}
              subheading="가입할 때 입력했던 정보를 입력해주세요."
              form={form}
              onChange={handleFormChange}
              onSubmit={handleCheckAccount}
              error={error}
              submitLabel="확인"
            />

            {checkResult === "found" && (
              <p className="onboarding__notice onboarding__notice--success">
                이미 계정이 있습니다.{" "}
                <button
                  type="button"
                  className="onboarding__link"
                  onClick={() => resetAndGo("login")}
                >
                  로그인 하러 가기 →
                </button>
              </p>
            )}

            {checkResult === "notfound" && (
              <p className="onboarding__notice onboarding__notice--warn">
                일치하는 계정을 찾을 수 없어요. 정보를 다시 확인하시거나{" "}
                <button
                  type="button"
                  className="onboarding__link"
                  onClick={() => {
                    setCheckResult(null);
                    resetAndGo("signupInfo");
                  }}
                >
                  회원가입하기 →
                </button>
              </p>
            )}
          </>
        )}

        {stage === "login" && matchedStudent && (
          <PinForm
            title={`${matchedStudent.name}님, PIN을 입력해주세요`}
            subheading="설정해두신 4자리 PIN을 입력하면 로그인돼요."
            pin={pin}
            onPinChange={handlePinChange(setPin)}
            onBack={() => resetAndGo("checkAccount")}
            onSubmit={handleLoginSubmit}
            error={error}
            submitting={submitting}
            submitLabel="로그인"
          />
        )}
      </div>
    </div>
  );
}

function LandingStage({ onStart, onCheckAccount }) {
  return (
    <>
      <span className="onboarding__pill">우리 반 전용 일정 서비스</span>
      <h1 className="onboarding__title">
        흩어진 학급 일정을,
        <br />한 곳에서 <span className="onboarding__title-accent">같이</span> 관리해요
      </h1>
      <p className="onboarding__desc">
        수행평가, 제출물 마감, 학교 일정, 급식 정보, 채용의뢰까지 — 반 친구들과 함께 쓰고
        공유하는 우리 반 캘린더, 일알림입니다.
      </p>

      <div className="onboarding__tags">
        <Tag color="#ef4444" label="수행평가" />
        <Tag color="#3b82f6" label="제출물" />
        <Tag color="#22c55e" label="학교일정" />
        <Tag color="#eab308" label="급식" />
        <Tag color="#a855f7" label="채용의뢰" />
      </div>

      <div className="onboarding__actions">
        <button className="btn btn--primary" onClick={onStart}>
          시작하기 →
        </button>
        <button className="btn btn--link" onClick={onCheckAccount}>
          이미 계정이 있어요
        </button>
      </div>
    </>
  );
}

function InfoForm({ title, subheading, form, onChange, onSubmit, error, submitLabel }) {
  return (
    <form onSubmit={onSubmit}>
      <h2 className="onboarding__heading">{title}</h2>
      <p className="onboarding__subheading">{subheading}</p>

      <div className="onboarding__field-group">
        <label className="onboarding__label" htmlFor="studentId">
          학번
        </label>
        <input
          id="studentId"
          className="onboarding__input"
          type="text"
          inputMode="numeric"
          placeholder="학번을 입력해주세요"
          value={form.studentId}
          onChange={onChange("studentId")}
        />
      </div>

      <div className="onboarding__field-group">
        <label className="onboarding__label" htmlFor="name">
          이름
        </label>
        <input
          id="name"
          className="onboarding__input"
          type="text"
          placeholder="이름을 입력해주세요"
          value={form.name}
          onChange={onChange("name")}
        />
      </div>

      <div className="onboarding__field-group">
        <label className="onboarding__label" htmlFor="number">
          번호
        </label>
        <input
          id="number"
          className="onboarding__input"
          type="text"
          inputMode="numeric"
          placeholder="출석 번호를 입력해주세요"
          value={form.number}
          onChange={onChange("number")}
        />
      </div>

      {error && <p className="onboarding__error">{error}</p>}

      <div className="onboarding__footer">
        <span />
        <button className="btn btn--primary" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function PinForm({
  title,
  subheading,
  pin,
  pinConfirm,
  showConfirm,
  onPinChange,
  onPinConfirmChange,
  onBack,
  onSubmit,
  error,
  submitting,
  submitLabel,
}) {
  return (
    <form onSubmit={onSubmit}>
      <h2 className="onboarding__heading">{title}</h2>
      <p className="onboarding__subheading">{subheading}</p>

      <div className="onboarding__field-group">
        <label className="onboarding__label" htmlFor="pin">
          비밀번호 (4자리)
        </label>
        <input
          id="pin"
          className="onboarding__input onboarding__input--pin"
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={onPinChange}
          placeholder="••••"
        />
      </div>

      {showConfirm && (
        <div className="onboarding__field-group">
          <label className="onboarding__label" htmlFor="pin-confirm">
            비밀번호 확인
          </label>
          <input
            id="pin-confirm"
            className="onboarding__input onboarding__input--pin"
            type="password"
            inputMode="numeric"
            value={pinConfirm}
            onChange={onPinConfirmChange}
            placeholder="••••"
          />
        </div>
      )}

      <p className="onboarding__hint">
        <span className="onboarding__hint-dot" /> 입력한 정보는 같은 반 친구들에게만 표시돼요
      </p>

      {error && <p className="onboarding__error">{error}</p>}

      <div className="onboarding__footer">
        <button type="button" className="btn btn--link" onClick={onBack}>
          ← 이전으로
        </button>
        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? "확인 중..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Tag({ color, label }) {
  return (
    <span className="onboarding__tag">
      <span className="onboarding__tag-dot" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
