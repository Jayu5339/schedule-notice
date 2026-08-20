// client/src/api/localStore.js
//
// 서버(Express + DB)가 아직 없어서 임시로 브라우저 localStorage에 인증 데이터를 저장합니다.
// 나중에 서버가 완성되면 이 파일을 지우고 client.js(api/authApi)의 fetch 호출로 교체하면 됩니다.
//
// 구조:
//   가입된 계정 - localStorage(STUDENTS_KEY)에 { studentId, name, pinHash } 형태로 저장
//   (번호 필드는 온보딩에서 받지 않기로 해서 제외했어요)
//
// Onboarding.jsx가 기대하는 API:
//   findStudent(form)              - 이미 가입된 계정인지 확인 (없으면 undefined)
//   createStudent({...form, pin})  - PIN 설정 + 계정 생성
//   verifyPin(studentId, pin)      - 기존 계정 로그인 (PIN 검증)

const STUDENTS_KEY = "sn_students";

// ---- 내부 유틸 ----

function readStudents() {
    try {
        return JSON.parse(localStorage.getItem(STUDENTS_KEY) || "[]");
    } catch {
        return [];
    }
}

function writeStudents(students) {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

function normalize(value) {
    return String(value ?? "").trim();
}

// 학번 + 이름이 모두 일치해야 같은 계정으로 판단
function sameIdentity(a, b) {
    return (
        normalize(a.studentId) === normalize(b.studentId) &&
        normalize(a.name) === normalize(b.name)
    );
}

// 진짜 암호학적 해시는 아니지만(브라우저 로컬 프로토타입용),
// PIN을 평문 그대로 저장하지 않기 위한 간단한 해시입니다.
// 서버가 생기면 crypto.scryptSync 등으로 교체하세요.
function hashPin(pin, salt) {
    const input = `${salt}:${pin}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
    }
    return hash.toString(16);
}

function toPublicRecord({ studentId, name }) {
    return { studentId, name };
}

// ---- 공개 API ----

export const localStore = {
    // 이미 가입된 계정인지 확인 (학번/이름이 모두 일치해야 함)
    findStudent(form) {
        const students = readStudents();
        const record = students.find((s) => sameIdentity(s, form));
        return record ? toPublicRecord(record) : undefined;
    },

    // PIN 설정 + 계정 생성
    createStudent({ studentId, name, pin }) {
        const students = readStudents();
        if (students.some((s) => sameIdentity(s, { studentId, name }))) {
            throw new Error("이미 가입된 계정이에요");
        }

        const record = {
            studentId: normalize(studentId),
            name: normalize(name),
            pinHash: hashPin(pin, studentId),
        };

        students.push(record);
        writeStudents(students);

        return toPublicRecord(record);
    },

    // 기존 계정 로그인 (PIN 검증)
    verifyPin(studentId, pin) {
        const students = readStudents();
        const record = students.find(
            (s) => normalize(s.studentId) === normalize(studentId)
        );

        if (!record) {
            throw new Error("계정을 찾을 수 없어요");
        }
        if (record.pinHash !== hashPin(pin, record.studentId)) {
            throw new Error("PIN이 올바르지 않아요");
        }

        return toPublicRecord(record);
    },

    // 개발용: 저장된 계정 전체 초기화 (콘솔에서 localStore.resetAll() 처럼 호출해 테스트할 때 사용)
    resetAll() {
        localStorage.removeItem(STUDENTS_KEY);
    },
};
