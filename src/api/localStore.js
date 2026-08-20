// client/src/api/localStore.js
//
// 서버(routes/auth.js)가 아직 없어서, 그 자리를 대신하는 임시 저장소예요.
// 나중에 진짜 서버가 생기면 이 파일만 authApi 호출로 바꿔치기하면 됩니다.
//
// ⚠️ 주의: PIN을 평문 그대로 저장해요. 로컬 프로토타입 단계에서만 쓰고,
//    서버가 생기면 PIN은 서버에서 해싱해서 저장하도록 반드시 옮겨야 해요.

const STORAGE_KEY = "sn_students";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

export const localStore = {
  // 학번+이름+번호가 모두 일치하는 계정 찾기 ("이미 계정이 있어요" 확인용)
  findStudent({ studentId, name, number }) {
    return (
      readAll().find(
        (s) =>
          s.studentId === studentId.trim() &&
          s.name === name.trim() &&
          String(s.number) === String(number).trim()
      ) || null
    );
  },

  findByStudentId(studentId) {
    return readAll().find((s) => s.studentId === studentId) || null;
  },

  // 회원가입: 학번 중복 체크 후 저장
  createStudent({ studentId, name, number, pin }) {
    const students = readAll();
    if (students.some((s) => s.studentId === studentId.trim())) {
      throw new Error("이미 등록된 학번이에요. '이미 계정이 있어요'로 로그인해주세요");
    }
    const record = { studentId: studentId.trim(), name: name.trim(), number: String(number).trim(), pin };
    students.push(record);
    writeAll(students);
    return record;
  },

  // 로그인: PIN 검증
  verifyPin(studentId, pin) {
    const student = this.findByStudentId(studentId);
    if (!student) throw new Error("계정을 찾을 수 없어요");
    if (student.pin !== pin) throw new Error("PIN이 일치하지 않아요");
    return student;
  },
};
