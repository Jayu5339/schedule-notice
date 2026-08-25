export function getStudentClassMeta(
  studentNumber,
  fallbackSchoolYear = new Date().getFullYear(),
) {
  if (!studentNumber) {
    return {
      schoolYear: fallbackSchoolYear,
      grade: null,
      classNumber: null,
      classLabel: "미지정 반",
      studentNumber: "",
    };
  }

  const digits = String(studentNumber).replace(/\D/g, "");
  const grade = digits.length >= 1 ? Number(digits.charAt(0)) : null;
  const classNumber = digits.length >= 2 ? Number(digits.charAt(1)) : null;
  const schoolYear = Number.isFinite(fallbackSchoolYear)
    ? fallbackSchoolYear
    : new Date().getFullYear();

  return {
    schoolYear,
    grade,
    classNumber,
    studentNumber: String(studentNumber),
    classLabel:
      grade != null && classNumber != null
        ? `${schoolYear} · ${grade}학년 ${classNumber}반`
        : `${schoolYear} · 반 정보 없음`,
  };
}

export function getClassFilterFromUser(user) {
  if (!user) return null;

  const meta = getStudentClassMeta(
    user.studentId,
    user.schoolYear ?? new Date().getFullYear(),
  );

  if (meta.grade == null || meta.classNumber == null) {
    return null;
  }

  return {
    school_year: meta.schoolYear,
    grade: meta.grade,
    class_number: meta.classNumber,
  };
}
