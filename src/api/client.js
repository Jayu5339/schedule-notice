// client/src/api/client.js
// fetch 래퍼: baseURL 고정 + 토큰 헤더 자동 첨부 + 에러 처리를 한 곳에서 관리합니다.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `요청에 실패했어요 (${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: "POST", body: JSON.stringify(data) }),
};

// 인증 관련 엔드포인트만 모아둔 얇은 레이어.
// 서버 라우트(routes/auth.js)와 1:1로 대응됩니다.
export const authApi = {
  // 미리 시딩된 반 명단을 가져옵니다. 각 항목은 { id, name, number, hasPin } 형태를 기대합니다.
  getRoster: () => api.get("/auth/roster"),

  // 이미 PIN을 설정한 학생의 로그인
  login: (studentId, pin) => api.post("/auth/login", { studentId, pin }),

  // 처음 로그인하는 학생의 PIN 최초 설정 (성공 시 로그인까지 처리되어 토큰을 함께 내려줍니다)
  setPin: (studentId, pin) => api.post("/auth/set-pin", { studentId, pin }),
};
