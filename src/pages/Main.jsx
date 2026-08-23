// client/src/pages/Main.jsx
// 로그인 성공 후 보여줄 메인 화면. Calendar / NoticeBoard / MealInfo 컴포넌트를 채워 넣기 전까지의 임시 뼈대입니다.

import { useAuth } from "../context/AuthContext";
import "./Main.css";

export default function Main() {
  // const { user, logout } = useAuth();

  return (
    <div className="main-page">
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
          <span className="who">이상희</span>
          <span className="num mono">20304</span>
          <span className="verified">
            <span className="dot"></span>인증됨
          </span>
        </div>
      </div>
      <div className="header-row">
        <div className="className-chip">2026 · 3학년 2반</div>
      </div>
      <div className="toolbar">
        <button className="add-btn">
          <span className="plus">+</span>일정 추가
        </button>
        <div className="sort-select">
          정렬
          <select>
            <option>중요도</option>
            <option>임박도</option>
            <option>등록순</option>
          </select>
        </div>
      </div>
      <div className="main-grid">
        <div className="calendar-card">
          <div className="cal-head">
            <h2>2026년 8월</h2>
            <div className="cal-nav">
              <button>‹</button>
              <button>›</button>
            </div>
          </div>
          <div className="cal-weekdays">
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div>토</div>
            <div>일</div>
          </div>
          <div className="cal-grid">
            <div className="cal-cell muted">
              <span className="num">27</span>
            </div>
            <div className="cal-cell muted">
              <span className="num">28</span>
            </div>
            <div className="cal-cell muted">
              <span className="num">29</span>
            </div>
            <div className="cal-cell muted">
              <span className="num">30</span>
            </div>
            <div className="cal-cell muted">
              <span className="num">31</span>
            </div>
            <div className="cal-cell">
              <span className="num">1</span>
            </div>
            <div className="cal-cell">
              <span className="num">2</span>
            </div>

            <div className="cal-cell">
              <span className="num">3</span>
            </div>
            <div className="cal-cell">
              <span className="num">4</span>
            </div>
            <div className="cal-cell">
              <span className="num">5</span>
            </div>
            <div className="cal-cell">
              <span className="num">6</span>
            </div>
            <div className="cal-cell">
              <span className="num">7</span>
            </div>
            <div className="cal-cell">
              <span className="num">8</span>
            </div>
            <div className="cal-cell">
              <span className="num">9</span>
            </div>

            <div className="cal-cell">
              <span className="num">10</span>
            </div>
            <div className="cal-cell">
              <span className="num">11</span>
            </div>
            <div className="cal-cell">
              <span className="num">12</span>
            </div>
            <div className="cal-cell">
              <span className="num">13</span>
            </div>
            <div className="cal-cell">
              <span className="num">14</span>
            </div>
            <div className="cal-cell">
              <span className="num">15</span>
            </div>
            <div className="cal-cell">
              <span className="num">16</span>
            </div>

            <div className="cal-cell">
              <span className="num">17</span>
            </div>
            <div className="cal-cell today selected">
              <span className="num">18</span>
            </div>
            <div className="cal-cell">
              <span className="num">19</span>
              <div className="dots">
                <span style={{ background: "var(--submit)" }}></span>
              </div>
            </div>
            <div className="cal-cell">
              <span className="num">20</span>
              <div className="dots">
                <span style={{ background: "var(--perf)" }}></span>
              </div>
            </div>
            <div className="cal-cell">
              <span className="num">21</span>
              <div className="dots">
                <span style={{ background: "var(--perf)" }}></span>
              </div>
            </div>
            <div className="cal-cell">
              <span className="num">22</span>
            </div>
            <div className="cal-cell">
              <span className="num">23</span>
              <div className="dots">
                <span style={{ background: "var(--perf)" }}></span>
              </div>
            </div>

            <div className="cal-cell">
              <span className="num">24</span>
            </div>
            <div className="cal-cell">
              <span className="num">25</span>
              <div className="dots">
                <span style={{ background: "var(--school)" }}></span>
              </div>
            </div>
            <div className="cal-cell">
              <span className="num">26</span>
            </div>
            <div className="cal-cell">
              <span className="num">27</span>
            </div>
            <div className="cal-cell">
              <span className="num">28</span>
            </div>
            <div className="cal-cell">
              <span className="num">29</span>
            </div>
            <div className="cal-cell">
              <span className="num">30</span>
            </div>

            <div className="cal-cell">
              <span className="num">31</span>
            </div>
            <div className="cal-cell muted">
              <span className="num">1</span>
            </div>
            <div className="cal-cell muted">
              <span className="num">2</span>
            </div>
            <div className="cal-cell muted">
              <span className="num">3</span>
            </div>
            <div className="cal-cell muted">
              <span className="num">4</span>
            </div>
            <div className="cal-cell muted">
              <span className="num">5</span>
            </div>
            <div className="cal-cell muted">
              <span className="num">6</span>
            </div>
          </div>

          <div className="cal-legend">
            <div className="item">
              <span className="sw" style={{ background: "var(--perf)" }}></span>
              수행평가
            </div>
            <div className="item">
              <span
                className="sw"
                style={{ background: "var(--submit)" }}
              ></span>
              제출물
            </div>
            <div className="item">
              <span
                className="sw"
                style={{ background: "var(--school)" }}
              ></span>
              학교일정
            </div>
            <div className="item">
              <span className="sw" style="background:var(--meal)"></span>급식
            </div>
            <div className="item">
              <span
                className="sw"
                style={{ background: "var(--recruit)" }}
              ></span>
              채용의뢰
            </div>
          </div>
        </div>

        <div className="priority-col">
          <div className="p-card pinned">
            <div className="p-top">
              <span className="tag perf">수행평가</span>
              <span className="dday hot">D-2</span>
            </div>
            <p className="p-title">영어 말하기 1차시</p>
            <p className="p-desc">1교시에 스크립트 작성 후 제출</p>
          </div>

          <div className="p-card">
            <div className="p-top">
              <span className="tag perf">수행평가</span>
              <span className="dday">D-3</span>
            </div>
            <p className="p-title">수학 포트폴리오</p>
            <p className="p-desc">유리함수 ~ 미적분 방정식 (23p~84p)</p>
          </div>

          <div className="p-card">
            <div className="p-top">
              <span className="tag school">학교일정</span>
              <span className="dday">D-7</span>
            </div>
            <p className="p-title">동아리</p>
            <p className="p-desc">
              각자 동아리 활동 교실로 가서 활동 이후 감상문 작성
            </p>
          </div>

          <div className="p-card faded">
            <div className="p-top">
              <span className="tag submit">제출물</span>
              <span className="dday">D-1</span>
            </div>
            <p className="p-title">프로그래밍 수행 프로젝트</p>
            <p className="p-desc">8월 19일 10:00 제출 마감</p>
          </div>
        </div>
      </div>
      <div className="bottom-grid">
        <div className="b-card">
          <div className="b-head">
            <h3>채용 마감</h3>
            <span className="b-badge recruit">✦</span>
          </div>
          <div className="b-row">
            <span className="name">위펀 (마케팅)</span>
            <span className="when">07/13–07/15 10:00</span>
          </div>
          <div className="b-divider"></div>
          <div className="b-row">
            <span className="name">인프로</span>
            <span className="when">07/10–07/14 10:00</span>
          </div>
        </div>

        <div className="b-card">
          <div className="b-head">
            <h3>과제 · 제출물 마감</h3>
            <span className="b-badge submit">✎</span>
          </div>
          <div className="b-row">
            <span className="name">프로그래밍</span>
            <span className="when">8/19 10:00</span>
          </div>
          <div className="b-divider"></div>
          <div className="p-desc" style="margin-top:-4px;">
            수행 프로젝트 제출 마감
          </div>
        </div>

        <div className="b-card">
          <div className="b-head">
            <h3>수행평가 · 7일 내 3개</h3>
            <span className="b-badge perf">!</span>
          </div>
          <div className="b-row">
            <span className="name">영어 스피치 대본 제출</span>
            <span className="when">08/20</span>
          </div>
          <div className="b-row">
            <span className="name">수학 포트폴리오</span>
            <span className="when">08/21</span>
          </div>
          <div className="b-row">
            <span className="name">수학 포트폴리오</span>
            <span className="when">08/23</span>
          </div>
        </div>

        <div className="b-card">
          <div className="b-head">
            <h3>급식 정보</h3>
            <span className="b-badge meal">☀</span>
          </div>
          <div className="meal-tab">
            <button className="active">조식</button>
            <button>중식</button>
            <button>석식</button>
          </div>
          <div className="meal-list">
            <div className="item">현미밥</div>
            <div className="item">싹 구운 토스트</div>
            <div className="item">딸기잼 &amp; 블루베리잼</div>
          </div>
        </div>
      </div>
    </div>
  );
}
