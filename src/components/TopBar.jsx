// 상단 브랜드 + 사용자 인증 정보 표시
export default function TopBar({ user }) {
  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark">
          <span>S/N</span>
        </div>
        <div>
          <div className="brand-name">schedule-notice</div>
          <div className="brand-sub mono">미림마이스터고 · 2026</div>
        </div>
      </div>
      <div className="id-chip">
        <span className="who">{user.name}</span>
        <span className="num mono">{user.studentId}</span>
        {user.verified && (
          <span className="verified">
            <span className="dot"></span>인증됨
          </span>
        )}
      </div>
    </div>
  );
}
