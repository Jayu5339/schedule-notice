// client/src/pages/Onboarding.jsx
//
// 화면 구성:
//   landing   : 서비스 소개 + "시작하기"(가입 의도) / "이미 계정이 있으신가요?"(로그인 의도) 링크
//   info      : 학번·이름 입력 → 제출 시 기존 계정 여부를 판단. intent(가입/로그인)에 따라 분기가 다름
//               - intent === "signup": 기존 계정이면 existing 단계(안내 후 로그인 버튼), 없으면 signupPin
//               - intent === "login" : 기존 계정이면 곧바로 login(PIN 입력) 단계, 없으면 notFound 단계
//   existing  : (가입 의도로 들어왔는데) "이미 계정이 있습니다" 안내 후 로그인 페이지로 이동하는 버튼
//   notFound  : (로그인 의도로 들어왔는데) "계정이 없습니다" 안내 후 회원가입으로 이동하는 버튼
//   signupPin : 회원가입 — PIN 설정 + 확인
//   login     : 기존 계정으로 PIN 입력 후 로그인
//
// 모든 단계(랜딩 제외)는 이전 단계로 돌아가는 "← 뒤로가기" 버튼을 가집니다.
// 데이터는 아직 서버가 없어서 전부 localStorage(api/localStore.js)에 저장돼요.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { localStore } from "../api/localStore";
import { supabase } from "../../supabase/supabaseClient";
import "./Onboarding.css";

const emptyForm = { studentId: "", name: "" };

export default function Onboarding() {
  const [stage, setStage] = useState("landing");
  // landing | info | existing | notFound | signupPin | login

  const [intent, setIntent] = useState("signup"); // "signup" | "login" - info 단계의 분기 기준

  const [form, setForm] = useState(emptyForm);
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [matchedStudent, setMatchedStudent] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const resetAndGo = (nextStage) => {
    setError("");
    setPin("");
    setPinConfirm("");
    setStage(nextStage);
  };

  const goToInfo = (nextIntent) => {
    setIntent(nextIntent);
    setForm(emptyForm);
    resetAndGo("info");
  };

  const goToLanding = () => {
    setForm(emptyForm);
    setMatchedStudent(null);
    resetAndGo("landing");
  };

  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePinChange = (setter) => (e) => {
    setter(e.target.value.replace(/\D/g, "").slice(0, 4));
  };

  // info 단계 제출: intent에 따라 분기가 다름
  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId.trim() || !form.name.trim()) {
      setError("학번, 이름을 모두 입력해주세요");
      return;
    }
    setError("");

    try {
      // DB의 students_public View에서 학번/이름 일치 여부 확인
      const { data: found, error } = await supabase
        .from("students_public")
        .select("id, name, student_number, is_manager")
        .eq("student_number", form.studentId.trim())
        .eq("name", form.name.trim())
        .maybeSingle();

      if (error) throw error;
      console.log(found);
      // if (error || !student) {
      //   alert("등록된 학생이 아닙니다.");
      //   setMatchedStudent(null);
      //   return;
      // }

      // // 조회가 성공했을 때만 상태에 저장
      // setMatchedStudent(student);

      if (intent === "login") {
        if (found && found.is_register) {
          // 계정이 있고 이미 PIN이 설정됨 -> PIN 입력 단계로
          setMatchedStudent(found);
          setStage("login");
        } else if (found && !found.is_register) {
          // 계정은 등록되어 있으나 PIN이 미설정된 상태 -> 회원가입/PIN 설정 안내
          setMatchedStudent(found);
          setStage("signupPin");
        } else {
          // 등록된 학생 명단에 없음
          setStage("notFound");
        }
        return;
      }

      // intent === "signup" (최초 등록)
      if (found) {
        if (found.is_register) {
          // 이미 PIN까지 설정 완료된 계정
          setMatchedStudent(found);
          setStage("existing");
        } else {
          // 명단에 존재하며 PIN 미설정 상태 -> PIN 설정 단계 진행
          setMatchedStudent(found);
          setStage("signupPin");
        }
      } else {
        // CSV 명단에 없는 사용자
        setStage("notFound");
      }
    } catch (err) {
      setError(err.message || "학생 정보 확인 중 문제가 발생했습니다");
    } finally {
      setSubmitting(false);
    }
  };

  // 회원가입: PIN 설정 -> 계정 생성
  const handleSignupSubmit = async (e) => {
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
      const { data, error } = await supabase.functions.invoke("verify-pin", {
        body: {
          studentId: matchedStudent.id,
          pin_hash: pin,
          is_register: true,
        },
      });

      if (error || !data?.ok) {
        throw new Error(data?.error || "PIN 등록에 실패했습니다.");
      }

      // 로그인 처리 및 세션 저장
      const studentData = {
        id: matchedStudent.id,
        name: matchedStudent.name,
        studentId: matchedStudent.student_number,
      };
      login(studentData);
      navigate("/");
    } catch (err) {
      setError(err.message || "가입 중 문제가 발생했어요");
      setPin("");
      setPinConfirm("");
    } finally {
      setSubmitting(false);
    }
  };

  // 로그인 (PIN 검증)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (pin.length !== 4) {
      setError("PIN 4자리를 입력해주세요");
      return;
    }

    setSubmitting(true);
    // try {
    //   const student = localStore.verifyPin(matchedStudent.studentId, pin);
    //   login({
    //     token: `local-${student.studentId}`,
    //     name: student.name,
    //     studentId: student.studentId,
    //   });
    //   navigate("/");
    // } catch (err) {
    //   setError(err.message || "로그인 중 문제가 발생했어요");
    //   setPin("");
    // } finally {
    //   setSubmitting(false);
    // }
    try {
      const { data, error } = await supabase.functions.invoke("verify-pin", {
        body: {
          studentId: matchedStudent.id,
          pin,
          isFirstLogin: false,
        },
      });

      if (error || !data?.ok) {
        throw new Error("PIN 번호가 일치하지 않습니다");
      }

      // 로그인 처리 및 세션 저장
      const studentData = {
        id: matchedStudent.id,
        name: matchedStudent.name,
        studentId: matchedStudent.student_number,
      };
      login(studentData);
      navigate("/");
    } catch (err) {
      setError(err.message || "로그인 중 문제가 발생했어요");
      setPin("");
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabel =
    stage === "info" ? "1 / 2" : stage === "signupPin" ? "2 / 2" : null;

  return (
    <div className="onboarding">
      <div className="onboarding__card">
        <div className="onboarding__brand">
          <span className="onboarding__badge">S/N</span>
          <span className="onboarding__brand-name">schedule-notice</span>
          <span className="onboarding__brand-sep">·</span>
          <span className="onboarding__brand-sub">일알림</span>
          {stepLabel && (
            <span className="onboarding__step-count">{stepLabel}</span>
          )}
        </div>

        {stage === "landing" && (
          <LandingStage
            onStart={() => goToInfo("signup")}
            onLoginClick={() => goToInfo("login")}
          />
        )}

        {stage === "info" && (
          <InfoForm
            title={
              intent === "login"
                ? "안녕하세요,\n로그인할 계정 정보를 입력해주세요"
                : "안녕하세요,\n학급 일정을 같이 쓰는 서비스, 일알림입니다"
            }
            subheading={
              intent === "login"
                ? "가입할 때 입력했던 학번, 이름을 입력해주세요."
                : "학번, 이름을 입력해주세요. 이미 가입했다면 안내해드려요."
            }
            form={form}
            onChange={handleFormChange}
            onSubmit={handleInfoSubmit}
            onBack={goToLanding}
            error={error}
            submitLabel="다음"
          />
        )}

        {stage === "existing" && matchedStudent && (
          <ExistingAccountStage
            name={matchedStudent.name}
            onGoLogin={() => resetAndGo("login")}
            onBack={() => resetAndGo("info")}
          />
        )}

        {stage === "notFound" && (
          <NotFoundStage
            onSignup={() => resetAndGo("signupPin")}
            onBack={() => resetAndGo("info")}
          />
        )}

        {stage === "signupPin" && (
          <PinForm
            title={`안녕하세요, ${form.name}님\n처음이시니 PIN을 설정해주세요`}
            subheading="다음에 로그인할 때 사용할 4자리 번호예요."
            pin={pin}
            pinConfirm={pinConfirm}
            showConfirm
            onPinChange={handlePinChange(setPin)}
            onPinConfirmChange={handlePinChange(setPinConfirm)}
            onBack={() => resetAndGo("info")}
            onSubmit={handleSignupSubmit}
            error={error}
            submitting={submitting}
            submitLabel="가입 완료"
          />
        )}

        {stage === "login" && matchedStudent && (
          <PinForm
            badge="이미 계정이 있어요"
            title={`${matchedStudent.name}님, PIN을 입력해주세요`}
            subheading="설정해두신 4자리 PIN을 입력하면 로그인돼요."
            pin={pin}
            onPinChange={handlePinChange(setPin)}
            onBack={() => resetAndGo("info")}
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

function LandingStage({ onStart, onLoginClick }) {
  return (
    <>
      <span className="onboarding__pill">우리 반 전용 일정 서비스</span>
      <h1 className="onboarding__title">
        흩어진 학급 일정을,
        <br />한 곳에서 <span className="onboarding__title-accent">
          같이
        </span>{" "}
        관리해요
      </h1>
      <p className="onboarding__desc">
        수행평가, 제출물 마감, 학교 일정, 급식 정보, 채용의뢰까지 — 반 친구들과
        함께 쓰고 공유하는 우리 반 캘린더, 일알림입니다.
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
        <button
          type="button"
          className="onboarding__login-link"
          onClick={onLoginClick}
        >
          이미 계정이 있으신가요?
        </button>
      </div>
    </>
  );
}

function ExistingAccountStage({ name, onGoLogin, onBack }) {
  return (
    <>
      <p className="onboarding__notice onboarding__notice--info">
        이미 계정이 있습니다
      </p>
      <h2 className="onboarding__heading">
        {name}님, 이미 가입된 계정이 있어요
      </h2>
      <p className="onboarding__subheading">
        아래 버튼을 눌러 로그인 화면으로 이동한 뒤 PIN을 입력해주세요.
      </p>

      <div className="onboarding__footer">
        <button type="button" className="btn btn--link" onClick={onBack}>
          ← 뒤로가기
        </button>
        <button type="button" className="btn btn--primary" onClick={onGoLogin}>
          로그인하러 가기 →
        </button>
      </div>
    </>
  );
}

function NotFoundStage({ onSignup, onBack }) {
  return (
    <>
      <p className="onboarding__notice onboarding__notice--warning">
        계정이 없습니다
      </p>
      <h2 className="onboarding__heading">일치하는 계정을 찾지 못했어요</h2>
      <p className="onboarding__subheading">
        입력하신 학번·이름으로 가입된 계정이 없어요. 아래 버튼으로 회원가입을
        진행해주세요.
      </p>

      <div className="onboarding__footer">
        <button type="button" className="btn btn--link" onClick={onBack}>
          ← 뒤로가기
        </button>
        <button type="button" className="btn btn--primary" onClick={onSignup}>
          회원가입 하러 가기 →
        </button>
      </div>
    </>
  );
}

function InfoForm({
  title,
  subheading,
  form,
  onChange,
  onSubmit,
  onBack,
  error,
  submitLabel,
}) {
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

      {error && <p className="onboarding__error">{error}</p>}

      <div className="onboarding__footer">
        <button type="button" className="btn btn--link" onClick={onBack}>
          ← 뒤로가기
        </button>
        <button className="btn btn--primary" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function PinForm({
  badge,
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
      {badge && (
        <p className="onboarding__notice onboarding__notice--success">
          {badge}
        </p>
      )}
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
        <span className="onboarding__hint-dot" /> 입력한 정보는 같은 반
        친구들에게만 표시돼요
      </p>

      {error && <p className="onboarding__error">{error}</p>}

      <div className="onboarding__footer">
        <button type="button" className="btn btn--link" onClick={onBack}>
          ← 뒤로가기
        </button>
        <button
          className="btn btn--primary"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "확인 중..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Tag({ color, label }) {
  return (
    <span className="onboarding__tag">
      <span
        className="onboarding__tag-dot"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
