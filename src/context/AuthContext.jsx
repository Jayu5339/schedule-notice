// client/src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../.././supabase/supabaseClient"; // Supabase 클라이언트 인스턴스

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

          // (선택 사항) 로컬 스토리지의 유저가 실제 DB에 여전히 존재하는지 가볍게 검증
          const { data, error } = await supabase
            .from("students_public")
            .select("id, name, student_number")
            .eq("id", parsedUser.id)
            .maybeSingle();

          if (data && !error) {
            setUser({
              id: data.id,
              name: data.name,
              studentId: data.student_number,
            });
          } else {
            // DB에서 삭제되었거나 찾을 수 없는 경우 로컬 세션 제거
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

  // 로그인 성공 시 호출 (Edge Function 인증 완료 후)
  const login = (userInfo) => {
    // userInfo 형태: { id, name, studentId }
    localStorage.setItem("student_session", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  // 로그아웃
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
