// 임시 목데이터. 추후 API 응답 스키마에 맞춰 교체 예정.

export const CATEGORY_COLORS = {
  perf: "var(--perf)",
  submit: "var(--submit)",
  school: "var(--school)",
  meal: "var(--meal)",
  recruit: "var(--recruit)",
};

export const CATEGORY_LABELS = {
  perf: "수행평가",
  submit: "제출물",
  school: "학교일정",
  meal: "급식",
  recruit: "채용의뢰",
};
// (CATEGORY_COLORS, CATEGORY_LABELS, priorityItems 등 기존 내용은 그대로 두고 아래만 교체)

// 기존의 정적 calendarDays 배열은 삭제.
// 대신 "YYYY-MM-DD" -> 카테고리 배열 형태로 관리 (월 이동해도 재사용 가능)
export const eventsByDate = {
  "2026-08-19": ["submit"],
  "2026-08-20": ["perf"],
  "2026-08-21": ["perf"],
  "2026-08-23": ["perf"],
  "2026-08-25": ["school"],
};

// 임시 "오늘" 값. 실제로는 new Date() 기반으로 계산해서 써도 됨.
export const TODAY = { year: 2026, month: 8, day: 18 };
export const priorityItems = [
  {
    id: 1,
    category: "perf",
    dday: "D-2",
    hot: true,
    pinned: true,
    title: "영어 말하기 1차시",
    desc: "1교시에 스크립트 작성 후 제출",
  },
  {
    // 원래 4번째(맨 아래, faded)였던 카드를 2번째로 이동
    id: 4,
    category: "submit",
    dday: "D-1",
    faded: true,
    title: "프로그래밍 수행 프로젝트",
    desc: "8월 19일 10:00 제출 마감",
  },
  {
    id: 2,
    category: "perf",
    dday: "D-3",
    title: "수학 포트폴리오",
    desc: "유리함수 ~ 미적분 방정식 (23p~84p)",
  },
  {
    id: 3,
    category: "school",
    dday: "D-7",
    title: "동아리",
    desc: "각자 동아리 활동 교실로 가서 활동 이후 감상문 작성",
  },
];

export const recruitDeadlines = [
  { id: 1, name: "위펀 (마케팅)", when: "07/13–07/15 10:00" },
  { id: 2, name: "인프로", when: "07/10–07/14 10:00" },
];

export const submissionDeadlines = [
  {
    id: 1,
    name: "프로그래밍",
    when: "8/19 10:00",
    desc: "수행 프로젝트 제출 마감",
  },
];

export const performanceDeadlines = [
  { id: 1, name: "영어 스피치 대본 제출", when: "08/20" },
  { id: 2, name: "수학 포트폴리오", when: "08/21" },
  { id: 3, name: "수학 포트폴리오", when: "08/23" },
];

export const mealData = {
  조식: ["현미밥", "싹 구운 토스트", "딸기잼 & 블루베리잼"],
  중식: [],
  석식: [],
};
