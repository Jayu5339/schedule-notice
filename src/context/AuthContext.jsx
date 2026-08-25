// client/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../.././supabase/supabaseClient"; // Supabase 클라이언트 인스턴스
import { getStudentClassMeta } from "../utils/studentClass";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false); // 초기 로컬 스토리지 및 세션 유효성 검사 완료 여부

  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem("student_session");
      if (stored) {
        try {
          const parsedUser = JSON.parse(stored);

          const { data, error } = await supabase
            .from("students_public")
            .select("id, name, student_number, school_year")
            .eq("id", parsedUser.id)
            .maybeSingle();

          if (data && !error) {
            const classMeta = getStudentClassMeta(
              data.student_number,
              data.school_year ?? 2026,
            );
            setUser({
              id: data.id,
              name: data.name,
              studentId: data.student_number,
              schoolYear: data.school_year ?? classMeta.schoolYear,
              grade: classMeta.grade,
              classNumber: classMeta.classNumber,
              classLabel: classMeta.classLabel,
            });
          } else {
            localStorage.removeItem("student_session");
            setUser(null);
          }
        } catch {
          localStorage.removeItem("student_session");
          setUser(null);
        }
      }
      setIsReady(true);
    };

    initAuth();
  }, []);

  const login = (userInfo) => {
    const classMeta = getStudentClassMeta(
      userInfo.studentId,
      userInfo.schoolYear ?? 2026,
    );
    const normalizedUser = {
      ...userInfo,
      schoolYear: userInfo.schoolYear ?? classMeta.schoolYear,
      grade: userInfo.grade ?? classMeta.grade,
      classNumber: userInfo.classNumber ?? classMeta.classNumber,
      classLabel: userInfo.classLabel ?? classMeta.classLabel,
    };

    localStorage.setItem("student_session", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("student_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isReady, isAuthenticated: Boolean(user), login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있어요");
  return ctx;
}
