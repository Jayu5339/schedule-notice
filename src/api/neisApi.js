const NEIS_BASE = "https://open.neis.go.kr/hub";
const API_KEY = import.meta.env.VITE_NEIS_API_KEY;
const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || "미림마이스터고등학교";

let cachedSchoolCode = null; // { ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE } 캐싱

async function resolveSchoolCode() {
  if (cachedSchoolCode) return cachedSchoolCode;

  const url = `${NEIS_BASE}/schoolInfo?KEY=${API_KEY}&Type=json&SCHUL_NM=${encodeURIComponent(SCHOOL_NAME)}`;
  const res = await fetch(url);
  const data = await res.json();

  const row = data?.schoolInfo?.[1]?.row?.[0];
  if (!row)
    throw new Error("학교 코드를 찾지 못했습니다. 학교명을 확인해주세요.");

  cachedSchoolCode = {
    ATPT_OFCDC_SC_CODE: row.ATPT_OFCDC_SC_CODE,
    SD_SCHUL_CODE: row.SD_SCHUL_CODE,
  };
  return cachedSchoolCode;
}

// date: "YYYY-MM-DD"
export async function fetchMealInfo(date) {
  const { ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE } = await resolveSchoolCode();
  const ymd = date.replaceAll("-", "");

  const url =
    `${NEIS_BASE}/mealServiceDietInfo?KEY=${API_KEY}&Type=json` +
    `&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}` +
    `&MLSV_YMD=${ymd}`;

  const res = await fetch(url);
  const data = await res.json();

  // 급식 없는 날(주말/방학)이면 RESULT 코드로 옴
  const rows = data?.mealServiceDietInfo?.[1]?.row ?? [];

  const byMeal = { 조식: [], 중식: [], 석식: [] };
  rows.forEach((row) => {
    const mealName = row.MMEAL_SC_NM; // "조식" | "중식" | "석식"
    const dishes = row.DDISH_NM.split("<br/>")
      .map((d) => d.replace(/\([\d.]+\)/g, "").trim()) // 알레르기 표시 숫자 제거
      .filter(Boolean);
    if (byMeal[mealName]) byMeal[mealName] = dishes;
  });

  return byMeal;
}
