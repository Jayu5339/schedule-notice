// client/src/App.jsx
// 라우팅만 담당: /onboarding, / 두 라우트만 있으면 됨. 실제 화면은 페이지 컴포넌트에 바로 위임합니다.

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Onboarding from "./pages/Onboarding";
import Main from "./pages/Main";

function PrivateRoute({ children }) {
  const { user, isReady } = useAuth();
  if (!isReady) return null; // localStorage 확인 중에는 깜빡임 방지용으로 아무것도 렌더링하지 않음
  return user ? children : <Navigate to="/onboarding" replace />;
}

export default function App() {
  useEffect(() => {
    const onDragStart = (e) => {
      // prevent dragging images and other elements by default
      if (e && e.target) {
        // allow draggable elements explicitly marked with draggable=true
        const draggable =
          e.target.getAttribute && e.target.getAttribute("draggable");
        if (draggable === "true") return;
      }
      e.preventDefault();
    };

    window.addEventListener("dragstart", onDragStart, { passive: false });

    return () => {
      window.removeEventListener("dragstart", onDragStart);
    };
  }, []);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Main />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
