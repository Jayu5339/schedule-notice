// client/src/pages/Main.jsx
// 로그인 성공 후 보여줄 메인 화면. Calendar / NoticeBoard / MealInfo 컴포넌트를 채워 넣기 전까지의 임시 뼈대입니다.

import { useAuth } from "../context/AuthContext";

export default function Main() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>안녕하세요, {user?.name}님 👋</h1>
      <p>
        여기에 Calendar / NoticeBoard / MealInfo 컴포넌트가 들어갈 예정이에요.
      </p>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}
