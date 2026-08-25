# schedule-notice

간단한 학급 일정 공유 웹앱 — 로컬에서 실행하고 다른 개발자가 동일한 환경에서 테스트할 수 있도록 설정 방법을 정리한 안내서입니다.

## 주요 내용

- 로컬 개발 환경 설정 (Node.js + npm)
- 환경 변수(.env) 설정 (`VITE_` 접두사 사용)
- Supabase(또는 Postgres) DB 스키마 및 테스트용 데이터 예시
- PIN 검증용 서버리스 함수(`verify-pin`) 안내
- 로컬 개발, 빌드, 배포 및 GitHub에 업로드하는 방법
- 문제 해결 팁

---

## 요구사항

- Node.js >= 18 권장
- npm 또는 pnpm
- (옵션) Supabase 프로젝트 또는 PostgreSQL 인스턴스

## 설치 및 실행

1. 레포지토리 클론

```bash
git clone https://github.com/<your-org-or-username>/p-schedule-notice.git
cd p-schedule-notice
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정

루트에 `.env.local` 파일을 만들고 다음 값을 채우세요 (Vite는 `VITE_` 접두사가 필요합니다):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
# (선택) 배포 시 사용되는 개인 키 같은 값은 안전하게 관리하세요.
```

4. 개발 서버 실행

```bash
npm run dev
```

기본적으로 Vite가 포트 `5173`을 사용합니다. 포트 충돌 시 Vite가 자동으로 다른 포트를 선택합니다.

5. 브라우저에서 열기

```
http://localhost:5173/  # 또는 콘솔에 표시된 포트
```

---

## 데이터베이스 (Supabase) 준비

이 프로젝트는 `students_public` 뷰(또는 `students` 테이블)에서 학생 정보를 조회합니다. 최소한 다음 컬럼이 필요합니다:

- `id` (UUID 또는 PK)
- `name` (텍스트)
- `student_number` (학번, 텍스트)
- `school_year` (정수)
- `is_manager` (boolean)
- `is_register` (boolean) // 클라이언트에서는 `is_register`가 false면 PIN 설정 단계로 안내합니다

테스트용 더미 레코드 삽입 예시(SQL):

```sql
INSERT INTO students (id, name, student_number, school_year, is_manager, is_register)
VALUES ('00000000-0000-0000-0000-000000000001', '홍길동', '20261234', 2026, false, false);
```

> 노트: 일부 배포 환경에서는 `students_public`을 읽기 전용 뷰로 제공할 수 있습니다. 이 경우 클라이언트에서 뷰를 업데이트하려는 시도는 실패할 수 있으므로, 서버쪽(함수 또는 RPC)을 통해 `is_register` 플래그를 안전하게 업데이트하는 것을 권장합니다.

---

## `verify-pin` 서버리스 함수

클라이언트는 `src/api/handleVerifyPin.js`를 통해 Supabase Functions(또는 유사 엔드포인트) `verify-pin`을 호출합니다. 이 함수는 다음을 수행해야 합니다:

- 입력: `{ studentId, pin, isFirstLogin }`
- 동작:
  - `isFirstLogin === true`일 경우 PIN을 저장(해시 가능), `is_register`를 `true`로 설정
  - `isFirstLogin === false`일 경우 저장된 PIN과 비교
- 반환: `{ ok: true }` 또는 `{ ok: false, error: '...' }`

함수가 없는 환경이라면 로컬에서 테스트할 때는 `handleVerifyPin`을 모킹하거나 Supabase Edge Function을 작성해 배치하세요.

간단한 함수 스텁(예시, 서버쪽):

```ts
// functions/verify-pin/index.ts (pseudo-code)
export default async function handler(req, res) {
  const { studentId, pin, isFirstLogin } = req.body;
  if (!studentId || !pin)
    return res
      .status(400)
      .json({ ok: false, error: "studentId와 pin이 필요합니다." });

  if (isFirstLogin) {
    // DB에 PIN 저장 & is_register = true
  } else {
    // DB에서 PIN 확인
  }

  return res.json({ ok: true });
}
```

---

## 온보딩(가입/로그인) 흐름 테스트 방법

1. `Info` 폼에서 테스트용 `student_number`와 `name`을 입력하세요 (위 SQL로 삽입한 값과 일치).
2. `가입` 흐름에서 PIN 4자리를 설정하세요.
3. 정상적으로 `localStorage.student_session`에 사용자 정보와 `_loginAt`이 저장되어 메인 페이지로 이동해야 합니다.

문제가 발생하면 브라우저 DevTools 콘솔과 네트워크 탭에서 `/verify-pin` 호출의 응답을 확인하세요.

---

## 세션 만료

- 클라이언트는 `localStorage.student_session`에 `_loginAt` 타임스탬프를 저장합니다.
- 앱 초기화 시 해당 값이 7일을 초과하면 세션을 만료시키고 Onboarding으로 이동시킵니다.

---

## 로컬 스토리지 키

- `student_session` — 로그인한 사용자 정보 및 `_loginAt` 타임스탬프
- `priority_expanded` — PriorityCard 확장 상태(객체: { [eventId]: true })

---

## GitHub에 올리기 (간단 가이드)

1. 새 리포지토리 생성: https://github.com/new
2. 로컬에서 연결 및 푸시

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:<your-org>/<repo>.git
git branch -M main
git push -u origin main
```

## 배포

- 정적 호스팅(예: Vercel, Netlify)에 Vite 앱을 배포하세요. 환경변수(`VITE_SUPABASE_*`)를 각 플랫폼에 설정해야 합니다.
- Supabase Functions(verify-pin)는 Supabase에 배포하거나 별도의 서버에 올리세요.

---

## 문제 해결 팁

- `students_public`에서 학생이 조회되지 않으면 `Info` 단계에서 "계정이 없습니다"로 표시됩니다. 이 경우 DB에 레코드를 추가하세요.
- `verify-pin` 호출 오류는 네트워크/환경변수 문제일 가능성이 큽니다. `VITE_SUPABASE_URL` 및 `VITE_SUPABASE_ANON_KEY`가 올바른지 확인하세요.
- 포트 충돌 시 Vite가 다른 포트를 자동 선택합니다. 원하는 포트로 고정하려면 실행 전에 환경변수 `PORT`를 설정하세요:

```bash
# PowerShell
$env:PORT=5175; npm run dev
```

---

## 기여

이 프로젝트에 대한 개선 제안이나 PR은 환영합니다. 이 리포지토리에 README 업데이트, 유형 안정성 추가, `verify-pin` 서버 구현 등을 기여해주세요.

---

문의가 있으면 원하시는 세부 항목(예: `verify-pin`의 구체적 구현, Supabase 설정, CI/CD 설정)에 맞춰 추가 문서를 작성해 드리겠습니다.
