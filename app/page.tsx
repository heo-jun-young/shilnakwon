"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/* ───────── 타입 ───────── */
type SectionId = "etiquette" | "faq" | "menu" | "allergy" | "survey";

const TABS: { id: SectionId; label: string }[] = [
  { id: "etiquette", label: "장례 상식" },
  { id: "faq", label: "FAQ" },
  { id: "menu", label: "메뉴 안내" },
  { id: "allergy", label: "알레르기" },
  { id: "survey", label: "만족도 조사" },
];

const FAQ_DATA = [
  { q: "주차 등록은 어디서 하나요?", a: "주차 등록은 운영사무실에서 도와드리고 있으니, 방문하시거나 안내 데스크에 문의해 주시면 친절히 안내해 드리겠습니다." },
  { q: "ATM 기기는 어디에 있나요?", a: "ATM 기기는 장례식장 1층 로비에 위치해 있으니 편리하게 이용하실 수 있습니다." },
  { q: "조의금 봉투와 펜은 어디에 있나요?", a: "조의금 봉투와 펜은 각 층 복도에 비치되어 있으니 필요하실 때 자유롭게 사용하시기 바랍니다." },
  { q: "조문용 넥타이 구입 가능한가요?", a: "조문용 넥타이는 원내 매점 또는 운영사무실에서 구입하실 수 있으니 방문하여 문의해 주시기 바랍니다." },
  { q: "화장실은 어디에 위치해 있나요?", a: "화장실은 각 층에 마련되어 있으며, 엘리베이터 또는 계단 인근의 층별 안내도를 참고하시면 쉽게 찾으실 수 있습니다." },
  { q: "대중교통 이용은 어떻게 하나요?", a: "버스 및 지하철 이용 시 장례식장 인근 정류장과 역에서 도보로 이동 가능하며, 자세한 노선은 1층 안내 데스크 또는 원내 교통 안내문을 참고해 주시기 바랍니다." },
];

/* ───────── 가격표 데이터 (비고 그룹 단위) ───────── */
type PriceItem = { menu: string; unit: string; price: string };
type PriceCat  = { name: string; items: PriceItem[] };
type PriceGroup = { note: string; cats: PriceCat[]; sepBefore?: boolean };

const PRICE_TABLE: PriceGroup[] = [
  {
    note: "• 주문단위 : 30인 / 50인\n• 소요시간 : 1시간 이내\n• 주문시간 : 07 ~ 21시\n\n※ 전주 홍어탕 50인\n275,000원 추가 판매",
    cats: [
      { name: "매운국", items: [
        { menu: "뭉근한 육개장", unit: "50인", price: "240,000원" },
        { menu: "육개장",        unit: "50인", price: "175,000원" },
        { menu: "사골우거지국",  unit: "50인", price: "175,000원" },
      ]},
      { name: "맑은국", items: [
        { menu: "돼지곰탕",    unit: "50인", price: "175,000원" },
        { menu: "황태해장국",  unit: "50인", price: "175,000원" },
        { menu: "소고기무국",  unit: "50인", price: "175,000원" },
        { menu: "근대재첩국",  unit: "50인", price: "175,000원" },
      ]},
      { name: "밥류", items: [
        { menu: "잡곡밥", unit: "50인", price: "75,000원" },
        { menu: "쌀밥",   unit: "50인", price: "60,000원" },
      ]},
    ],
  },
  {
    note: "• 주문단위 : 3kg / 4kg\n• 소요시간 : 1시간 이내\n• 주문시간 : 07 ~ 21시",
    cats: [
      { name: "고기류", items: [
        { menu: "삼겹수육",       unit: "3kg", price: "175,000원" },
        { menu: "편육",           unit: "3kg", price: "120,000원" },
        { menu: "[반반] 수육&편육", unit: "4kg", price: "185,000원" },
      ]},
    ],
  },
  {
    note: "• 주문단위 : 메뉴별 상이\n• 소요시간 : 1시간 이내\n• 주문시간 : 07 ~ 21시",
    cats: [
      { name: "전·튀김류", items: [
        { menu: "모듬전",             unit: "3kg", price: "[3종] 105,000원 [5종] 140,000원" },
        { menu: "모듬튀김",           unit: "3kg", price: "120,000원" },
        { menu: "[반반] 모듬전&튀김", unit: "4kg", price: "145,000원" },
      ]},
      { name: "무침류", items: [
        { menu: "삼채명태회무침", unit: "5kg", price: "180,000원" },
        { menu: "홍어무침",      unit: "5kg", price: "180,000원" },
      ]},
      { name: "냉채류", items: [
        { menu: "해산물냉채", unit: "3kg", price: "105,000원" },
        { menu: "해파리냉채", unit: "3kg", price: "90,000원" },
      ]},
      { name: "샐러드류", items: [
        { menu: "꽃맛살샐러드", unit: "3kg", price: "90,000원" },
        { menu: "단호박샐러드", unit: "3kg", price: "90,000원" },
        { menu: "코다리조림",   unit: "5kg", price: "190,000원" },
      ]},
      { name: "반찬류", items: [
        { menu: "멸치견과류볶음", unit: "2kg", price: "85,000원" },
        { menu: "포기김치",      unit: "4kg", price: "65,000원" },
        { menu: "명이나물",      unit: "1kg", price: "30,000원" },
        { menu: "간장고추절임",  unit: "1kg", price: "20,000원" },
      ]},
      { name: "소스류", items: [
        { menu: "새우젓",   unit: "1kg", price: "15,000원" },
        { menu: "겨자소스", unit: "1kg", price: "10,000원" },
      ]},
    ],
  },
  {
    note: "• 주문단위 : 메뉴별 상이\n• 소요시간 : 메뉴별 상이\n• 주문시간 : 15 ~ 21시",
    cats: [
      { name: "안주류", items: [
        { menu: "소불고기", unit: "3kg",  price: "180,000원" },
        { menu: "닭강정",   unit: "3kg",  price: "130,000원" },
        { menu: "탕수육",   unit: "3kg",  price: "130,000원" },
        { menu: "먹태구이", unit: "500g", price: "30,000원" },
        { menu: "감자튀김", unit: "2kg",  price: "20,000원" },
      ]},
    ],
  },
  {
    note: "• 주문단위 : 4kg / 8kg\n• 소요시간 : 주문 후 약 3~4시간 소요\n• 주문마감 : 8시, 12시, 16시",
    cats: [
      { name: "디저트류", items: [
        { menu: "절편",     unit: "4kg", price: "45,000원" },
        { menu: "꿀떡",     unit: "4kg", price: "55,000원" },
        { menu: "인절미",   unit: "4kg", price: "60,000원" },
        { menu: "영양찰떡", unit: "4kg", price: "85,000원" },
      ]},
    ],
  },
  {
    note: "• 소요시간 : 1시간 이내\n• 주문시간 : 07 ~ 21시",
    sepBefore: true,
    cats: [
      { name: "디저트류", items: [
        { menu: "[개별포장] 두텁떡",  unit: "4kg",  price: "85,000원" },
        { menu: "[개별포장] 앙꼬절편", unit: "4kg",  price: "55,000원" },
        { menu: "조각 케이크",        unit: "56pc", price: "45,000원" },
      ]},
    ],
  },
  {
    note: "",
    cats: [
      { name: "과일류", items: [
        { menu: "방울토마토, 수박 등", unit: "–", price: "시세 적용" },
      ]},
    ],
  },
];


/* ───────── 메인 컴포넌트 ───────── */
export default function ShilnakwonPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("etiquette");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ── 스크롤스파이: IntersectionObserver ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 현재 뷰포트에 들어온 섹션 중 가장 위에 있는 것을 active로
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id as SectionId);
        }
      },
      { rootMargin: "-48px 0px -50% 0px", threshold: 0 }
    );

    TABS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: SectionId) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="shil-page">
      {/* ═══════ HERO ═══════ */}
      <header className="hero">
        <Image src="/icons/header-logo.png" alt="쉴낙원" width={60} height={60} unoptimized className="hero-logo" />
        <p className="hero-eng">SHILLAKWON</p>
        <h1 className="hero-title">쉴낙원 안양 장례식장 서비스 안내</h1>
        <p className="hero-sub">마지막 이별의 순간, 가족과 같은 마음으로 함께 하겠습니다.</p>
        <div className="hero-divider" />
      </header>

      {/* ═══════ NAV (sticky scrollspy) ═══════ */}
      <nav className="tab-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${activeSection === t.id ? "active" : ""}`}
            onClick={() => scrollTo(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* ═══════ 장례 상식 ═══════ */}
      <section id="etiquette" className="content-section">
        <p className="section-eng">FUNERAL ETIQUETTE</p>
        <h2 className="section-title">장례 상식</h2>

        {/* ── 조문 복장 ── */}
        <h3 className="sub-title">조문 복장</h3>
        <div className="divider" />
        <ol className="numbered-list">
          <li><span className="num">01</span>검은색 정장이 기본이나, 없을 때는 무채색 계열의 어두운 옷도 괜찮다.</li>
          <li><span className="num">02</span>외투나 모자는 장례식장에 들어가기 전에 벗는 것이 예의다.</li>
          <li><span className="num">03</span>지나치게 화려한 악세사리(시계, 귀걸이, 팔찌 등)는 착용을 삼가한다.</li>
          <li><span className="num">04</span>어두운 색의 양말, 넥타이, 스타킹이 없을 경우 장례식장에서도 구입이 가능하니 당황하지 말자.</li>
        </ol>

        <div className="dress-code-image">
          <Image src="/icons/dress-code.png" alt="남녀 조문 복장의 좋은 예" width={800} height={350} unoptimized style={{ width: "100%", height: "auto" }} />
        </div>

        {/* ── 부의금 봉투 ── */}
        <h3 className="sub-title">부의금 봉투</h3>
        <div className="divider" />
        <ol className="numbered-list">
          <li><span className="num">01</span>봉투 앞면 중앙에 추모의 의미를 담은 한자어를 적는다. 보통 부의(賻儀)를 가장 많이 쓴다.</li>
          <li><span className="num">02</span>봉투 뒷면 왼쪽 하단에 세로로 이름을 적는다. 소속은 이름의 오른쪽 위쪽에 적는다.</li>
          <li><span className="num">03</span>부의금은 홀수단위(3, 5, 10, 15, …)로 내며, 새돈이 아닌 헌돈을 내는 것이 좋다.</li>
        </ol>

        <div className="hanja-grid">
          {[
            { hanja: "賻儀", label: "부의(賻儀)" },
            { hanja: "謹弔", label: "근조(謹弔)" },
            { hanja: "追慕", label: "추모(追慕)" },
            { hanja: "追悼", label: "추도(追悼)" },
            { hanja: "哀悼", label: "애도(哀悼)" },
            { hanja: "慰靈", label: "위령(慰靈)" },
          ].map((item) => (
            <div key={item.hanja} className="hanja-card">
              <span className="hanja-text">{item.hanja}</span>
              <span className="hanja-label">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="hanja-desc">
          <p>
            <strong className="gold-text">부의(賻儀)</strong> 상을 치르고 있는 곳에 보내는 물품이라는 뜻 · <strong className="gold-text">근조(謹弔)</strong> 죽음에 대해 슬퍼하고 있는 뜻 · <strong className="gold-text">추모(追慕)</strong> 돌아가신 분을 그리며 생각한다는 뜻 · <strong className="gold-text">추도(追悼)</strong> 돌아가신 분을 생각하며 슬퍼하고 있는 뜻 · <strong className="gold-text">애도(哀悼)</strong> 죽음에 대해 슬퍼하고 있다는 뜻 · <strong className="gold-text">위령(慰靈)</strong> 돌아가신 분의 영혼을 위로하고 있다는 뜻
          </p>
        </div>

        {/* ── 조객록 서명 ── */}
        <h3 className="sub-title">조객록 서명</h3>
        <div className="divider" />
        <ol className="numbered-list">
          <li><span className="num">01</span>장례식장에 도착하면 먼저 조객록에 서명한다.</li>
          <li><span className="num">02</span>부의금은 문상이 끝난 후 내는 것이 기본이지만, 조객록 서명 시 함께 내기도 하니 주변 분위기에 맞추면 된다.</li>
          <li><span className="num">03</span>상가의 종교나 집안 문화에 따라 문상법의 차이가 있으니 주의할 점이 있는지 물어보는 것이 좋다.</li>
        </ol>

        {/* ── 조문 순서 ── */}
        <h3 className="sub-title">조문 순서</h3>
        <div className="divider" />
        <div className="step-timeline">
          {["조객록 서명", "분향 혹은 헌화", "제배 또는 묵념", "조문", "부의금 전달"].map((step, i) => (
            <div key={i} className="step-item">
              <div className="step-dot" />
              <div className="step-content">
                <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="step-label">{step}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── 분향 혹은 헌화 ── */}
        <h3 className="sub-title">분향 혹은 헌화</h3>
        <div className="divider" />
        <ol className="numbered-list">
          <li><span className="num">01</span>빈소에 들어가서 상주에게 가벼운 목례 후, 분향 혹은 헌화를 한다.</li>
          <li><span className="num">02</span>단체로 왔을 경우, 대표로 한 명만 분향 혹은 헌화를 하는 게 좋다.</li>
        </ol>

        <h4 className="method-title">분향하는 방법</h4>
        <div className="divider" />
        <div className="method-list">
          {[
            { icon: "/icons/incense-1.png", num: "01.", text: "오른손으로 향 1개나 3개를 집은 뒤, 촛불로 불을 붙인다.", note: "* 단, 이미 향로에 향이 많은 경우, 1개만 피우는 것이 좋다." },
            { icon: "/icons/incense-2.png", num: "02.", text: "불은 왼손으로 가볍게 부채질하거나 흔들어 끈다.\n절대 입으로 불어 꺼서는 안된다.", note: "" },
            { icon: "/icons/incense-3.png", num: "03.", text: "향을 집은 오른손을 왼손으로 받치고 공손히 향로에 꽂는다.", note: "* 향을 여러개 꽂을 경우, 반드시 하나씩 꽂는다." },
          ].map((item, i) => (
            <div key={i} className="method-item">
              <div className="method-icon-wrap">
                <Image src={item.icon} alt="" width={80} height={80} unoptimized />
              </div>
              <div className="method-content">
                <span className="method-num">{item.num}</span>
                {item.text.split("\n").map((line, li) => <p key={li}>{line}</p>)}
                {item.note && <p className="method-note">{item.note}</p>}
              </div>
            </div>
          ))}
        </div>

        <h4 className="method-title">헌화하는 방법</h4>
        <div className="divider" />
        <div className="method-list">
          {[
            { icon: "/icons/flower-1.png", num: "01.", text: "헌화를 할 때는 오른손으로 꽃 줄기를 잡고, 왼손으로 오른손을 받친다." },
            { icon: "/icons/flower-2.png", num: "02.", text: "꽃봉오리가 영전을 향하도록 올린다." },
          ].map((item, i) => (
            <div key={i} className="method-item">
              <div className="method-icon-wrap">
                <Image src={item.icon} alt="" width={80} height={80} unoptimized />
              </div>
              <div className="method-content">
                <span className="method-num">{item.num}</span>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── 제배 또는 묵념 ── */}
        <h3 className="sub-title">제배 또는 묵념</h3>
        <div className="divider" />
        <ol className="numbered-list">
          <li><span className="num">01</span>분향 혹은 헌화 후, 일어나 두 번 절을 한다. 종교적 이유로 절하는 것이 어려우면, 묵념/기도를 올려도 무방하다.</li>
          <li><span className="num">02</span><span>절을 두 번 올리는 의미: 한 번 — 천신에게 잘 받아달라는 의미<br />/ 두 번 — 지신에게 잘 떠나게 해달라는 의미</span></li>
        </ol>

        {/* ── 조문 ── */}
        <h3 className="sub-title">조문</h3>
        <div className="divider" />
        <ol className="numbered-list">
          <li><span className="num">01</span>영좌에서 물러나와 상주와 맞절한다. 종교적 이유로 절을 못한다면 정중히 목례만 해도 좋다.</li>
          <li><span className="num">02</span>절을 한 후에 간단한 인사말을 건네도 좋지만, 기본적으로 아무말 하지 않는 것이 일반적이다.</li>
          <li><span className="num">03</span>문상이 끝난 후에는 두세 걸음 뒤로 물러난 뒤 몸을 돌려 나오는 것이 예의다.</li>
        </ol>

        <div className="warning-box">
          <p className="warning-title">⚠ 조문 시 주의사항</p>
          <ul>
            <li>상주, 상제에게 악수를 청하는 행동을 삼가고, 인사는 목례로 대신한다.</li>
            <li>반가운 지인을 만나더라도 큰 소리로 이름을 부르지 말아야 한다.</li>
            <li>유가족에게 계속 말을 시키거나, 고인의 사망 원인을 상세히 묻는 것은 실례다.</li>
            <li>장례식장에서 술을 마실 때는 본인이 본인 잔을 채워서 마시는 것이 좋고, 건배도 해서는 안된다.</li>
          </ul>
        </div>
      </section>

      {/* ═══════ 섹션 구분선 ═══════ */}
      <div className="section-sep" />

      {/* ═══════ FAQ ═══════ */}
      <section id="faq" className="content-section">
        <p className="section-eng">FREQUENTLY ASKED QUESTIONS</p>
        <h2 className="section-title">자주 묻는 질문</h2>
        <div className="faq-list">
          {FAQ_DATA.map((item, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{item.q}</span>
                <span className="faq-arrow">{openFaq === i ? "▲" : "▼"}</span>
              </button>
              {openFaq === i && <div className="faq-answer"><p>{item.a}</p></div>}
            </div>
          ))}
        </div>
      </section>

      <div className="section-sep" />

      {/* ═══════ 메뉴 안내 ═══════ */}
      <section id="menu" className="content-section">
        {/* ── 헤더 (로고 포함) ── */}
        <div className="menu-header-row">
          <div>
            <p className="section-eng">FUNERAL SERVICE MENU</p>
            <h2 className="section-title" style={{ marginBottom: 0 }}>메뉴 안내</h2>
          </div>
          <div className="menu-logo-box">
            <Image
              src="/icons/hue-dining-logo.png"
              alt="HUE DINING"
              width={80}
              height={80}
              unoptimized
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* ── 가격표 ── */}
        <div className="menu-table-wrap">
          <table className="menu-table">
            <colgroup>
              <col className="col-cat" />
              <col className="col-menu" />
              <col className="col-unit" />
              <col className="col-price" />
              <col className="col-note" />
            </colgroup>
            <thead>
              <tr>
                <th>구분</th>
                <th>메뉴</th>
                <th>단위</th>
                <th>판매가</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              {PRICE_TABLE.flatMap((group, gIdx) => {
                const totalRows = group.cats.reduce((s, c) => s + c.items.length, 0);
                let noteAdded = false;
                return group.cats.flatMap((cat) =>
                  cat.items.map((item, iIdx) => {
                    const firstInCat   = iIdx === 0;
                    const firstInGroup = firstInCat && !noteAdded;
                    if (firstInGroup) noteAdded = true;
                    return (
                      <tr
                        key={`${gIdx}-${cat.name}-${iIdx}`}
                        className={group.sepBefore && firstInGroup ? "note-sep-row" : ""}
                      >
                        {firstInCat && (
                          <td className="menu-category" rowSpan={cat.items.length}>
                            <strong>{cat.name}</strong>
                          </td>
                        )}
                        <td className="menu-name">{item.menu}</td>
                        <td className="menu-unit">{item.unit}</td>
                        <td className="menu-price">{item.price}</td>
                        {firstInGroup && (
                          <td className="menu-note" rowSpan={totalRows}>
                            {group.note.split("\n").map((line, li) => (
                              <span key={li}>{line}<br /></span>
                            ))}
                          </td>
                        )}
                      </tr>
                    );
                  })
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="menu-notice">※ 메뉴는 식재료 수급에 따라 변동될 수 있습니다.</p>

        <div className="menu-set-images">
          <Image src="/icons/menu-set-1.png" alt="세트구성 1" width={800} height={400} unoptimized style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }} />
          <Image src="/icons/menu-set-2.png" alt="세트구성 2" width={800} height={400} unoptimized style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }} />
        </div>
      </section>

      <div className="section-sep" />

      {/* ═══════ 알레르기 ═══════ */}
      <section id="allergy" className="content-section">
        <p className="section-eng">ALLERGY INFORMATION</p>
        <h2 className="section-title">알레르기 정보</h2>

        <div className="allergy-grid">
          {[
            { icon: "/icons/wheat.png", name: "밀", items: "모듬전, 모듬튀김, 닭강정, 탕수육, 케익류" },
            { icon: "/icons/egg.png", name: "알류", items: "모듬전, 모듬튀김, 샐러드류, 닭강정, 탕수육, 케익류" },
            { icon: "/icons/crab.png", name: "갑각류(게, 새우)", items: "해산물냉채, 새우젓" },
            { icon: "/icons/soy.png", name: "대두", items: "대부분의 메뉴가 간장이 사용됨으로 대두 알레르기 보유 고객께서는 주문 전 직원에게 알려주시길 부탁드립니다." },
            { icon: "/icons/milk.png", name: "우유", items: "케익류" },
          ].map((a, i) => (
            <div key={i} className="allergy-card">
              <div className="allergy-icon" style={{ backgroundImage: `url('${a.icon}')` }} />
              <div className="allergy-text">
                <strong className="allergy-name">{a.name}</strong>
                <p className="allergy-items">{a.items}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="allergy-warning">
          <p>⚠ 알레르기 반응이 우려되시는 분은 식사 전 저희 직원에게 말씀해 주시기 바랍니다.</p>
        </div>
      </section>

      <div className="section-sep" />

      {/* ═══════ 만족도 조사 ═══════ */}
      <section id="survey" className="content-section">
        <p className="section-eng">CUSTOMER SATISFACTION SURVEY</p>
        <h2 className="section-title">고객 서비스 만족도 설문</h2>

        <div className="survey-intro">
          <p>이 설문은 고객님께 더 나은 서비스를 제공하기 위해 사용됩니다.</p>
          <p><strong>원하시는 답의 항목을 선택해 주시기 바랍니다.</strong></p>
        </div>

        {/* Q1 */}
        <div className="survey-q">
          <p className="survey-q-text">1. 쉴낙원을 이용함에 있어 전체적으로 만족하셨습니까?</p>
          <div className="likert-row">
            {["매우\n불만족", "불만족", "보통", "만족", "매우\n만족"].map((label) => (
              <label key={label} className="likert-option"><input type="radio" name="q1" /><span>{label}</span></label>
            ))}
          </div>
        </div>

        {/* Q2 */}
        <div className="survey-q">
          <p className="survey-q-text">2. 쉴낙원에 대해서 들어본 적이 있으십니까?</p>
          <div className="radio-list">
            {["들어본 적 있다", "들어봤으나 장례식장인지 몰랐다", "들어본 적 없다"].map((opt) => (
              <label key={opt} className="radio-option"><input type="radio" name="q2" /><span>{opt}</span></label>
            ))}
          </div>
        </div>

        {/* Q3 */}
        <div className="survey-q">
          <p className="survey-q-text">3. 고객님께서는 &apos;쉴낙원&apos;이 국내 1위 상조업체 &apos;웅진프리드라이프&apos;에서 직영으로 운영하는 장례식장이라는 사실을 알고 계셨습니까?</p>
          <div className="radio-list">
            {["알고 있었다", "몰랐다"].map((opt) => (
              <label key={opt} className="radio-option"><input type="radio" name="q3" /><span>{opt}</span></label>
            ))}
          </div>
        </div>

        {/* Q4 */}
        <div className="survey-q">
          <p className="survey-q-text">4. 쉴낙원 장례식장 이용(방문) 경로는 어떻게 되십니까?</p>
          <div className="radio-list">
            {[
              "인적 추천 - 상조회사 장례지도사(의전팀장)의 추천",
              "인적 추천 - 주변 지인의 쉴낙원 장례식장 경험 추천",
              "직접 경험 - 쉴낙원 장례식장 조문객 방문 경험을 통해",
              "현장 광고 - 현수막 및 전단지 광고를 통해",
              "TV 광고 - 배우 최수종이 나오는 TV 광고를 통해",
              "온라인 광고 - 포털사이트(네이버 등) 및 유튜브 등의 광고를 통해",
            ].map((opt) => (
              <label key={opt} className="radio-option"><input type="radio" name="q4" /><span>{opt}</span></label>
            ))}
          </div>
        </div>

        {/* Q5 */}
        <div className="survey-q">
          <p className="survey-q-text">5. 주변 분들께 쉴낙원을 추천해 주시겠습니까?</p>
          <div className="radio-list">
            {["적극 추천 하겠다", "추천 하겠다", "모르겠다", "추천하지 않겠다"].map((opt) => (
              <label key={opt} className="radio-option"><input type="radio" name="q5" /><span>{opt}</span></label>
            ))}
          </div>
        </div>

        {/* Q6–Q12 리커트 */}
        {[
          { n: 6, t: "빈소 외 시설물 등 청결 및 위생상태는 만족하셨습니까?" },
          { n: 7, t: "장의 절차(수시)와 용품(영정사진 등)은 만족하셨습니까?" },
          { n: 8, t: "음식 메뉴와 맛은 만족하셨습니까?" },
          { n: 9, t: "직원의 친절도는 만족하셨습니까?" },
          { n: 10, t: "주차 공간의 편리성은 만족하셨습니까?" },
          { n: 11, t: "쉴낙원의 이용 요금(가격)은 만족하셨습니까?" },
          { n: 12, t: "찾아오시는데 불편함은 없으셨습니까?" },
        ].map((q) => (
          <div key={q.n} className="survey-q">
            <p className="survey-q-text">{q.n}. {q.t}</p>
            <div className="likert-row">
              {["매우\n불만족", "불만족", "보통", "만족", "매우\n만족"].map((label) => (
                <label key={label} className="likert-option"><input type="radio" name={`q${q.n}`} /><span>{label}</span></label>
              ))}
            </div>
          </div>
        ))}

        {/* 주관식 */}
        <div className="survey-q">
          <p className="survey-q-text">장례식장 이용 시 중요하게 생각하는 것이 있다면 무엇인가요?</p>
          <textarea className="survey-textarea" placeholder="자유롭게 작성해 주세요" />
        </div>

        <div className="survey-q">
          <p className="survey-q-text">쉴낙원 이용 시 불편한 점이 있었습니까?</p>
          <div className="radio-list">
            {["아니요, 없었습니다", "예, 불편한 점이 있었습니다"].map((opt) => (
              <label key={opt} className="radio-option"><input type="radio" name="inconvenience" /><span>{opt}</span></label>
            ))}
          </div>
          <p className="survey-sub-label">어떤 점이 불편하셨습니까?</p>
          <textarea className="survey-textarea" placeholder="불편하셨던 점을 알려주세요 (선택)" />
        </div>

        <div className="survey-q">
          <p className="survey-q-text">쉴낙원 이용 시 좋은 점이나 개선사항이 있다면 간략히 적어 주시기 바랍니다.</p>
          <textarea className="survey-textarea" placeholder="소중한 의견을 남겨주세요 (선택)" />
        </div>

        <button className="submit-btn">설문 제출하기</button>
      </section>
    </main>
  );
}
