// client/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient"; // Supabase 클라이언트 인스턴스
import { getStudentClassMeta } from "../utils/studentClass";

const AuthContext = createContext(null);

function normalizeUser(userInfo) {
  const classMeta = getStudentClassMeta(
    userInfo?.studentId ?? userInfo?.student_number,
    userInfo?.schoolYear ?? userInfo?.school_year ?? 2026,
  );

  return {
    id: userInfo?.id ?? null,
    name: userInfo?.name ?? "",
    studentId:
      userInfo?.studentId ??
      userInfo?.student_number ??
      classMeta.studentNumber,
    schoolYear:
      userInfo?.schoolYear ?? userInfo?.school_year ?? classMeta.schoolYear,
    grade: userInfo?.grade ?? classMeta.grade,
    classNumber:
      userInfo?.classNumber ?? userInfo?.class_number ?? classMeta.classNumber,
    classLabel: userInfo?.classLabel ?? classMeta.classLabel,
    isManager: Boolean(userInfo?.isManager ?? userInfo?.is_manager),
    verified: Boolean(userInfo?.verified),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem("student_session");
      if (!stored) {
        setIsReady(true);
        return;
      }

      try {
        const parsedUser = JSON.parse(stored);
        // expire session after 7 days
        try {
          const loginAt = parsedUser._loginAt || parsedUser.loginAt;
          if (loginAt) {
            const then = new Date(loginAt).getTime();
            const now = Date.now();
            const days = (now - then) / (1000 * 60 * 60 * 24);
            if (days > 7) {
              localStorage.removeItem("student_session");
              setIsReady(true);
              return;
            }
          }
        } catch (err) {
          // ignore parsing errors related to timestamp
        }
        const currentUser = normalizeUser(parsedUser);

        const { data, error } = await supabase
          .from("students_public")
          .select("id, name, student_number, school_year, is_manager")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (data && !error) {
          const merged = normalizeUser({
            ...currentUser,
            id: data.id,
            name: data.name,
            studentId: data.student_number,
            schoolYear: data.school_year ?? currentUser.schoolYear,
            isManager: data.is_manager ?? currentUser.isManager,
          });
          // preserve original login timestamp if present
          if (parsedUser._loginAt) merged._loginAt = parsedUser._loginAt;
          setUser(merged);
          localStorage.setItem("student_session", JSON.stringify(merged));
        } else {
          localStorage.removeItem("student_session");
          setUser(null);
        }
      } catch {
        localStorage.removeItem("student_session");
        setUser(null);
      } finally {
        setIsReady(true);
      }
    };

    initAuth();
  }, []);

  const login = (userInfo) => {
    const normalizedUser = normalizeUser(userInfo);
    // stamp login time for expiry checks
    const withStamp = { ...normalizedUser, _loginAt: new Date().toISOString() };
    localStorage.setItem("student_session", JSON.stringify(withStamp));
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
