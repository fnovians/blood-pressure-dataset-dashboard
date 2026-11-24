import React, { useState, useEffect, useRef } from "react";
import {
  BP_CATEGORIES,
  HYPERTENSION_BY_AGE,
  LIFESTYLE_BP_DATA,
  BIOMARKER_PROFILES,
  MODEL_BENCHMARKS,
  RF_CONFUSION_MATRIX,
  BOOTSTRAP_ABLATION,
  SUBGROUP_RESULTS,
  TOP20_SHAP,
  DISCUSSION_INSIGHTS,
  RESEARCH_META,
  SENTINEL_DATA,
  BPCategory,
} from "../data/researchData";

function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/* =========================================================================
   1. CATEGORY DONUT CHART (1.2 Distribusi Kategori Tekanan Darah)
   ========================================================================= */
export function CategoryDonutChart() {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const total = BP_CATEGORIES.reduce((sum, item) => sum + item.count, 0);

  // Calculate SVG arc paths
  const size = 260;
  const strokeWidth = 38;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const hoveredItem = BP_CATEGORIES.find((c) => c.key === hoveredKey) || null;

  return (
    <div className="research-donut-card">
      <div className="donut-main-row">
        <div className="donut-chart-container">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-svg">
            {BP_CATEGORIES.map((item) => {
              const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += item.percent;
              const isHovered = hoveredKey === item.key;

              return (
                <circle
                  key={item.key}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="donut-segment"
                  onMouseEnter={() => setHoveredKey(item.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    filter: isHovered ? "drop-shadow(0 4px 10px rgba(0,0,0,0.18))" : "none",
                  }}
                />
              );
            })}
          </svg>
          <div className="donut-center-info">
            <span className="dci-label">
              {hoveredItem ? hoveredItem.name : "TOTAL VALID"}
            </span>
            <strong className="dci-val">
              {hoveredItem ? `${hoveredItem.percent.toFixed(1)}%` : formatNumber(total)}
            </strong>
            <small className="dci-sub">
              {hoveredItem ? `${formatNumber(hoveredItem.count)} orang` : "Rekam Medis (100%)"}
            </small>
          </div>
        </div>

        <div className="donut-legend-col">
          <div className="donut-legend-header">
            <strong>Kategori Klinis (AHA / JNC-8)</strong>
            <span>991.346 Pasien</span>
          </div>
          <div className="donut-legend-list">
            {BP_CATEGORIES.map((item) => {
              const active = hoveredKey === item.key;
              return (
                <div
                  key={item.key}
                  className={`donut-legend-row ${active ? "active" : ""}`}
                  onMouseEnter={() => setHoveredKey(item.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  style={{
                    borderColor: active ? item.color : "transparent",
                    background: active ? item.bgLight : "transparent",
                  }}
                >
                  <div className="dl-left">
                    <span className="dl-dot" style={{ backgroundColor: item.color }} />
                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.criteria}</small>
                    </div>
                  </div>
                  <div className="dl-right">
                    <strong>{item.percent.toFixed(2)}%</strong>
                    <small>{formatNumber(item.count)}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="donut-footer-callout">
        <div className="dfc-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
        </div>
        <div>
          <strong>Populasi Berisiko: 47,24%</strong>
          <p>
            Sebanyak 47,24% responden (468.353 orang) berada dalam status <em>Prahipertensi</em> (34,41%) atau <em>Hipertensi Terukur</em> (12,83%), menandakan urgensi intervensi gaya hidup sejak dini.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. HYPERTENSION PREVALENCE BY AGE (1.3 Bar Chart)
   ========================================================================= */
export function HypertensionAgeBarChart() {
  const [activeRange, setActiveRange] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);

    // Fallback timer ensures liquid rises immediately if already on screen
    const timer = setTimeout(() => setIsVisible(true), 200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const replayAnimation = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 120);
  };

  const maxPercent = 25; // max scale for bars

  return (
    <div className="prevalence-card" ref={containerRef}>
      <div className="prevalence-bars">
        {HYPERTENSION_BY_AGE.map((item, index) => {
          const isSelected = activeRange === item.ageRange;
          const barHeightPct = (item.prevalencePercent / maxPercent) * 100;
          const currentHeight = isVisible ? `${barHeightPct}%` : "0%";

          const liquidColors =
            item.prevalencePercent > 20
              ? {
                  main: "#ef4444",
                  dark: "#b91c1c",
                  light: "#fca5a5",
                  grad: "linear-gradient(180deg, rgba(239, 68, 68, 0.95) 0%, rgba(185, 28, 28, 0.98) 100%)",
                }
              : item.prevalencePercent > 12
              ? {
                  main: "#f59e0b",
                  dark: "#b45309",
                  light: "#fcd34d",
                  grad: "linear-gradient(180deg, rgba(245, 158, 11, 0.95) 0%, rgba(180, 83, 9, 0.98) 100%)",
                }
              : {
                  main: "#10b981",
                  dark: "#047857",
                  light: "#6ee7b7",
                  grad: "linear-gradient(180deg, rgba(16, 185, 129, 0.95) 0%, rgba(4, 120, 87, 0.98) 100%)",
                };

          return (
            <div
              key={item.ageRange}
              className={`prev-bar-col ${isSelected ? "selected" : ""}`}
              onClick={() => setActiveRange(isSelected ? null : item.ageRange)}
            >
              <div
                className="prev-val-badge"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(12px)",
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 160 + 350}ms`,
                }}
              >
                <strong>{item.prevalencePercent.toFixed(2)}%</strong>
                <span className="risk-tag">{item.relativeRisk}</span>
              </div>

              <div className="prev-bar-track liquid-glass-tube" onClick={replayAnimation} title="Klik untuk putar ulang animasi air">
                {/* Specular glass reflection */}
                <div className="tube-specular-gloss" />

                {/* Liquid Body with Water Wave Surface & Bubbles Filling from Bottom */}
                <div
                  className="prev-bar-fill liquid-water-fill"
                  style={{
                    height: currentHeight,
                    background: liquidColors.grad,
                    boxShadow: isVisible ? `0 0 16px ${liquidColors.main}40` : "none",
                    transition: "height 1.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.8s ease",
                    transitionDelay: `${index * 160}ms`,
                  }}
                >
                  {/* Undulating Wavy Water Surface */}
                  <div
                    className="water-wave-container"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: `opacity 0.3s ease ${index * 160}ms`,
                    }}
                  >
                    <svg className="water-wave-svg wave-back" viewBox="0 0 200 20" preserveAspectRatio="none">
                      <path
                        d="M 0,10 C 15,2 35,2 50,10 C 65,18 85,18 100,10 C 115,2 135,2 150,10 C 165,18 185,18 200,10 L 200,25 L 0,25 Z"
                        fill={liquidColors.light}
                        opacity="0.65"
                      />
                    </svg>
                    <svg className="water-wave-svg wave-front" viewBox="0 0 200 20" preserveAspectRatio="none">
                      <path
                        d="M 0,10 C 15,2 35,2 50,10 C 65,18 85,18 100,10 C 115,2 135,2 150,10 C 165,18 185,18 200,10 L 200,25 L 0,25 Z"
                        fill={liquidColors.main}
                      />
                    </svg>
                  </div>

                  {/* Rising Water Bubbles */}
                  <span className="water-bubble bubble-1" />
                  <span className="water-bubble bubble-2" />
                  <span className="water-bubble bubble-3" />
                </div>
              </div>

              <div className="prev-bar-labels">
                <strong>{item.ageRange}</strong>
                <small>{formatNumber(item.hypertensiveCount)} kasus</small>
                <span className="prev-total-sub">dari {formatNumber(item.totalRespondents)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="prevalence-insight-banner">
        <span className="pib-tag">ESKALASI USIA</span>
        <p>
          Prevalensi hipertensi melonjak hampir <strong>4x lipat (3,91x)</strong> dari kelompok usia <code>&lt; 40 tahun (5,55%)</code> ke kelompok usia <code>60+ tahun (21,70%)</code>. Hal ini menegaskan usia kronologis sebagai faktor determinan independen utama penuaan vaskular.
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   3. LIFESTYLE STACKED BAR CHART (1.5 Stacked Bar Chart)
   ========================================================================= */
export function LifestyleStackedBarChart() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  return (
    <div className="lifestyle-card">
      <div className="lifestyle-chart-legend">
        <span><i style={{ background: "#10b981" }} /> Normal</span>
        <span><i style={{ background: "#0ea5e9" }} /> Meningkat</span>
        <span><i style={{ background: "#f59e0b" }} /> Prahipertensi</span>
        <span><i style={{ background: "#ef4444" }} /> Hipertensi Terukur</span>
      </div>

      <div className="lifestyle-bars-stack">
        {LIFESTYLE_BP_DATA.map((row) => {
          const isSelected = activeGroup === row.label;

          return (
            <div
              key={row.label}
              className={`ls-row-item ${isSelected ? "selected" : ""}`}
              onClick={() => setActiveGroup(isSelected ? null : row.label)}
            >
              <div className="ls-label-col">
                <strong>{row.label}</strong>
                <span className="ls-code-tag">{row.code} · n = {formatNumber(row.total)}</span>
              </div>

              <div className="ls-stacked-bar">
                <div
                  className="ls-slice normal"
                  style={{ width: `${row.normalPct}%`, background: "#10b981" }}
                  title={`Normal: ${row.normalPct}%`}
                >
                  {row.normalPct > 15 && <span>{row.normalPct.toFixed(1)}%</span>}
                </div>
                <div
                  className="ls-slice meningkat"
                  style={{ width: `${row.meningkatPct}%`, background: "#0ea5e9" }}
                  title={`Meningkat: ${row.meningkatPct}%`}
                >
                  {row.meningkatPct > 8 && <span>{row.meningkatPct.toFixed(1)}%</span>}
                </div>
                <div
                  className="ls-slice prahip"
                  style={{ width: `${row.prahipertensiPct}%`, background: "#f59e0b" }}
                  title={`Prahipertensi: ${row.prahipertensiPct}%`}
                >
                  {row.prahipertensiPct > 15 && <span>{row.prahipertensiPct.toFixed(1)}%</span>}
                </div>
                <div
                  className="ls-slice hipert"
                  style={{ width: `${row.hipertensiPct}%`, background: "#ef4444" }}
                  title={`Hipertensi: ${row.hipertensiPct}%`}
                >
                  {row.hipertensiPct > 8 && <span>{row.hipertensiPct.toFixed(1)}%</span>}
                </div>
              </div>

              <div className="ls-detail-stat">
                <span className="ls-hip-badge">
                  Hipertensi: <strong>{row.hipertensiPct.toFixed(2)}%</strong>
                </span>
                {row.highlight && (
                  <span className="ls-warning-pill">{row.highlight}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="lifestyle-callout">
        <div className="lc-badge">EPIDEMIOLOGI</div>
        <div>
          <strong>Paradoks Mantan Perokok (Reverse Causality):</strong>
          <p>
            Mantan perokok memiliki proporsi hipertensi tertinggi yaitu <strong>15,86%</strong> (dibandingkan perokok aktif <strong>12,79%</strong> dan non-perokok <strong>11,97%</strong>). Ini mencerminkan <em>kausalitas terbalik</em>: pasien baru memutuskan berhenti merokok setelah menerima diagnosis gangguan kardiovaskular atau komplikasi metabolik.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. TOP 5 BIOMARKER SHAP PROFILES (1.6 Grouped Bar)
   ========================================================================= */
export function BiomarkerComparisonChart() {
  const [selectedMetric, setSelectedMetric] = useState<
    "age" | "waistline" | "gamma_GTP" | "BLDS" | "triglyceride"
  >("gamma_GTP");
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    const timer = setTimeout(() => setIsVisible(true), 200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // Surge and re-fill water when switching metric tabs
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(timer);
  }, [selectedMetric]);

  const replayAnimation = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 100);
  };

  const metricMeta = {
    age: { label: "Usia Responden", unit: "Tahun", desc: "Rata-rata usia responden pada masing-masing kategori" },
    waistline: { label: "Lingkar Pinggang", unit: "cm", desc: "Indikator adipositas viseral dan obesitas sentral" },
    gamma_GTP: { label: "gamma-GTP", unit: "U/L", desc: "Enzim hati yang sensitif terhadap resistensi insulin dan alkohol (+80% lonjakan)" },
    BLDS: { label: "Gula Darah Puasa (BLDS)", unit: "mg/dL", desc: "Kadar glukosa darah saat puasa" },
    triglyceride: { label: "Trigliserida", unit: "mg/dL", desc: "Profil lipid darah (+46% peningkatan dari Normal ke Hipertensi)" },
  };

  const categoryColors: Record<
    string,
    { main: string; dark: string; light: string; grad: string }
  > = {
    Normal: {
      main: "#10b981",
      dark: "#047857",
      light: "#6ee7b7",
      grad: "linear-gradient(180deg, rgba(16, 185, 129, 0.95) 0%, rgba(4, 120, 87, 0.98) 100%)",
    },
    "Tekanan Darah Meningkat": {
      main: "#0ea5e9",
      dark: "#0369a1",
      light: "#7dd3fc",
      grad: "linear-gradient(180deg, rgba(14, 165, 233, 0.95) 0%, rgba(3, 105, 161, 0.98) 100%)",
    },
    Prahipertensi: {
      main: "#f59e0b",
      dark: "#b45309",
      light: "#fcd34d",
      grad: "linear-gradient(180deg, rgba(245, 158, 11, 0.95) 0%, rgba(180, 83, 9, 0.98) 100%)",
    },
    "Hipertensi Terukur": {
      main: "#ef4444",
      dark: "#b91c1c",
      light: "#fca5a5",
      grad: "linear-gradient(180deg, rgba(239, 68, 68, 0.95) 0%, rgba(185, 28, 28, 0.98) 100%)",
    },
  };

  const currentMeta = metricMeta[selectedMetric];
  const maxVal = Math.max(...BIOMARKER_PROFILES.map((p) => p[selectedMetric])) * 1.15;

  return (
    <div className="biomarker-card" ref={containerRef}>
      <div className="biomarker-tabs">
        {(Object.keys(metricMeta) as Array<keyof typeof metricMeta>).map((key) => (
          <button
            key={key}
            className={`bm-tab-btn ${selectedMetric === key ? "active" : ""}`}
            onClick={() => setSelectedMetric(key)}
          >
            <strong>{metricMeta[key].label}</strong>
            <small>{metricMeta[key].unit}</small>
          </button>
        ))}
      </div>

      <div className="biomarker-display">
        <div className="bm-metric-header">
          <div>
            <h3>{currentMeta.label}</h3>
            <p>{currentMeta.desc}</p>
          </div>
          <span className="bm-unit-badge">Satuan: {currentMeta.unit}</span>
        </div>

        <div className="bm-bars-grid">
          {BIOMARKER_PROFILES.map((p, index) => {
            const val = p[selectedMetric];
            const pct = (val / maxVal) * 100;
            const currentHeight = isVisible ? `${pct}%` : "0%";
            const isHighest = val === Math.max(...BIOMARKER_PROFILES.map((x) => x[selectedMetric]));
            const colors = categoryColors[p.category] || categoryColors.Normal;

            return (
              <div key={p.category} className="bm-bar-column">
                <div
                  className="bm-val-label"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(12px)",
                    transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 150 + 350}ms`,
                  }}
                >
                  <strong>{formatNumber(val, 2)}</strong>
                  <small>{currentMeta.unit}</small>
                </div>

                <div
                  className="bm-bar-track liquid-glass-tube"
                  onClick={replayAnimation}
                  title="Klik untuk putar ulang animasi air"
                >
                  {/* Specular glass reflection */}
                  <div className="tube-specular-gloss" />

                  {/* Liquid Body with Water Wave Surface & Bubbles Filling from Bottom */}
                  <div
                    className="bm-bar-fill liquid-water-fill"
                    style={{
                      height: currentHeight,
                      background: colors.grad,
                      boxShadow: isVisible ? `0 0 16px ${colors.main}40` : "none",
                      transition: "height 1.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.8s ease",
                      transitionDelay: `${index * 150}ms`,
                    }}
                  >
                    {/* Undulating Wavy Water Surface */}
                    <div
                      className="water-wave-container"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transition: `opacity 0.3s ease ${index * 150}ms`,
                      }}
                    >
                      <svg className="water-wave-svg wave-back" viewBox="0 0 200 20" preserveAspectRatio="none">
                        <path
                          d="M 0,10 C 15,2 35,2 50,10 C 65,18 85,18 100,10 C 115,2 135,2 150,10 C 165,18 185,18 200,10 L 200,25 L 0,25 Z"
                          fill={colors.light}
                          opacity="0.65"
                        />
                      </svg>
                      <svg className="water-wave-svg wave-front" viewBox="0 0 200 20" preserveAspectRatio="none">
                        <path
                          d="M 0,10 C 15,2 35,2 50,10 C 65,18 85,18 100,10 C 115,2 135,2 150,10 C 165,18 185,18 200,10 L 200,25 L 0,25 Z"
                          fill={colors.main}
                        />
                      </svg>
                    </div>

                    {/* Rising Water Bubbles */}
                    <span className="water-bubble bubble-1" />
                    <span className="water-bubble bubble-2" />
                    <span className="water-bubble bubble-3" />
                  </div>
                </div>

                <div className="bm-bar-name">
                  <strong>{p.category}</strong>
                  {isHighest && <span className="bm-highest-tag">Tertinggi</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   5. MODEL BENCHMARK & SHAP EXPLAINABILITY (Paket 2)
   ========================================================================= */
export function ModelBenchmarkSection() {
  const [selectedModel, setSelectedModel] = useState<string>("Random Forest (Semua Fitur)");
  const [subgroupCat, setSubgroupCat] = useState<"Gender" | "Usia" | "Merokok" | "Alkohol">("Gender");
  const [shapCategory, setShapCategory] = useState<string>("All");

  const filteredShap = shapCategory === "All"
    ? TOP20_SHAP
    : TOP20_SHAP.filter((f) => f.category === shapCategory);

  const maxShap = Math.max(...TOP20_SHAP.map((s) => s.meanShap));

  const filteredSubgroups = SUBGROUP_RESULTS.filter((s) => s.category === subgroupCat);

  return (
    <div className="model-eval-section">
      {/* KPI Cards for ML Evaluation */}
      <div className="ml-kpi-grid">
        <article className="ml-kpi-card highlight">
          <div className="mlk-icon teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div>
          <div className="mlk-info">
            <span className="mlk-label">MODEL TERBAIK (4 KELAS)</span>
            <strong className="mlk-val">Random Forest</strong>
            <span className="mlk-desc">class_weight='balanced_subsample'</span>
          </div>
        </article>

        <article className="ml-kpi-card">
          <div className="mlk-icon blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" x2="18" y1="20" y2="10" />
              <line x1="12" x2="12" y1="20" y2="4" />
              <line x1="6" x2="6" y1="20" y2="14" />
            </svg>
          </div>
          <div className="mlk-info">
            <span className="mlk-label">MACRO F1 (METRIK UTAMA)</span>
            <strong className="mlk-val">36,68%</strong>
            <span className="mlk-desc">Unggul 2,6x lipat dari Dummy (14,12%)</span>
          </div>
        </article>

        <article className="ml-kpi-card">
          <div className="mlk-icon violet">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
              <path d="M7 21h10" />
              <path d="M12 3v18" />
              <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
            </svg>
          </div>
          <div className="mlk-info">
            <span className="mlk-label">BALANCED ACCURACY</span>
            <strong className="mlk-val">39,31%</strong>
            <span className="mlk-desc">Test Set = 198.270 rekam medis</span>
          </div>
        </article>

        <article className="ml-kpi-card">
          <div className="mlk-icon orange">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div className="mlk-info">
            <span className="mlk-label">RECALL HIPERTENSI TERUKUR</span>
            <strong className="mlk-val">52,00%</strong>
            <span className="mlk-desc">13.248 dari 25.439 kasus terdeteksi</span>
          </div>
        </article>
      </div>

      {/* 2.2 Model Benchmark Table */}
      <section className="ml-card-block">
        <div className="ml-block-header">
          <div>
            <span className="ml-block-eyebrow">2.2 MODEL BENCHMARK</span>
            <h2>Perbandingan Performa Model Klasifikasi (Test Set n = 198.270)</h2>
            <p>
              Evaluasi komparatif antara ensemble (Random Forest, XGBoost), linear model (Logistic Regression), dan baseline majority rule pada dataset uji 20% independen (seed=42).
            </p>
          </div>
        </div>

        <div className="table-scroll">
          <table className="ml-benchmark-table">
            <thead>
              <tr>
                <th>Model / Eksperimen</th>
                <th>Accuracy</th>
                <th>Balanced Acc.</th>
                <th>Macro F1 (Utama)</th>
                <th>Karakteristik & Catatan Evaluasi</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_BENCHMARKS.map((m) => {
                const isSelected = selectedModel === m.model;
                return (
                  <tr
                    key={m.model}
                    className={`${isSelected ? "table-row-active" : ""} ${m.isBest ? "best-model-row" : ""}`}
                    onClick={() => setSelectedModel(m.model)}
                  >
                    <td>
                      <div className="model-name-cell">
                        <strong>{m.model}</strong>
                        {m.isBest && <span className="best-pill">MODEL UTAMA</span>}
                        {m.isAblation && <span className="ablation-pill">ABLATION</span>}
                      </div>
                    </td>
                    <td>
                      <span className="metric-num">{m.accuracy.toFixed(2)}%</span>
                    </td>
                    <td>
                      <span className="metric-num">{m.balancedAcc.toFixed(2)}%</span>
                    </td>
                    <td>
                      <strong className={`metric-num f1 ${m.isBest ? "f1-best" : ""}`}>
                        {m.macroF1.toFixed(2)}%
                      </strong>
                    </td>
                    <td>
                      <span className="eval-note-text">{m.note}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Confusion Matrix & Classification Report for RF */}
      <section className="ml-card-block">
        <div className="ml-block-header">
          <div>
            <span className="ml-block-eyebrow">DETIL KLASIFIKASI</span>
            <h2>Confusion Matrix & Metrik Per Kelas — Random Forest</h2>
            <p>
              Distribusi prediksi model terbaik pada 198.270 data uji rekam medis riil.
            </p>
          </div>
        </div>

        <div className="cm-grid-layout">
          {/* Confusion Matrix Visual */}
          <div className="cm-visual-card">
            <h3>Confusion Matrix (Kolom = Prediksi | Baris = Aktual)</h3>
            <div className="cm-matrix-wrapper">
              <div className="cm-header-cols">
                <span className="cm-empty-corner">Aktual \ Pred</span>
                <span>Pred: Normal</span>
                <span>Pred: Meningkat</span>
                <span>Pred: Prahip.</span>
                <span>Pred: Hipert.</span>
              </div>
              {RF_CONFUSION_MATRIX.map((row) => (
                <div key={row.actualClass} className="cm-row">
                  <span className="cm-row-label">{row.actualClass}</span>
                  <span className={`cm-cell ${row.preds.normal > 20000 ? "heat-4" : row.preds.normal > 8000 ? "heat-2" : "heat-1"}`}>
                    <strong>{formatNumber(row.preds.normal)}</strong>
                  </span>
                  <span className={`cm-cell ${row.preds.meningkat > 5000 ? "heat-3" : row.preds.meningkat > 2000 ? "heat-2" : "heat-1"}`}>
                    <strong>{formatNumber(row.preds.meningkat)}</strong>
                  </span>
                  <span className={`cm-cell ${row.preds.prahipertensi > 20000 ? "heat-4" : row.preds.prahipertensi > 7000 ? "heat-2" : "heat-1"}`}>
                    <strong>{formatNumber(row.preds.prahipertensi)}</strong>
                  </span>
                  <span className={`cm-cell ${row.preds.hipertensi > 12000 ? "heat-4" : row.preds.hipertensi > 6000 ? "heat-2" : "heat-1"}`}>
                    <strong>{formatNumber(row.preds.hipertensi)}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Classification Report Table */}
          <div className="cm-report-card">
            <h3>Per-Class Classification Report</h3>
            <table className="cm-report-table">
              <thead>
                <tr>
                  <th>Kelas Target</th>
                  <th>Support (n)</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1-Score</th>
                </tr>
              </thead>
              <tbody>
                {RF_CONFUSION_MATRIX.map((r) => (
                  <tr key={r.actualClass}>
                    <td><strong>{r.actualClass}</strong></td>
                    <td>{formatNumber(r.support)}</td>
                    <td>{r.precision.toFixed(2)}</td>
                    <td>
                      <span className={`recall-badge ${r.recall >= 0.5 ? "high" : r.recall < 0.2 ? "low" : "mid"}`}>
                        {r.recall.toFixed(2)}
                      </span>
                    </td>
                    <td><strong>{r.f1.toFixed(2)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2.3 Bootstrap Ablation Card */}
      <section className="ml-card-block bootstrap-card">
        <div className="ml-block-header">
          <div>
            <span className="ml-block-eyebrow">2.3 UJI ABLASI & PAIRED BOOTSTRAP</span>
            <h2>Signifikansi Gaya Hidup: Merokok & Konsumsi Alkohol</h2>
            <p>
              Hasil uji hipotesis non-parametrik Paired Bootstrap dengan <strong>5.000 iterasi resampling</strong> pada 198.270 data uji.
            </p>
          </div>
          <span className="decision-badge">{BOOTSTRAP_ABLATION.decision}</span>
        </div>

        <div className="bootstrap-metrics-grid">
          {BOOTSTRAP_ABLATION.results.map((res) => (
            <div key={res.metric} className="bs-metric-box">
              <span className="bs-label">{res.metric}</span>
              <div className="bs-values">
                <div>
                  <small>Dg Merokok & Alkohol</small>
                  <strong>{res.withLifestyle.toFixed(2)}%</strong>
                </div>
                <span className="bs-arrow">vs</span>
                <div>
                  <small>Tanpa Merokok & Alkohol</small>
                  <strong>{res.withoutLifestyle.toFixed(2)}%</strong>
                </div>
              </div>
              <div className="bs-delta">
                <span>Selisih (Δ):</span>
                <strong>{res.deltaFormatted}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="bootstrap-ci-box">
          <div className="ci-visual">
            <span className="ci-tag">95% Confidence Interval</span>
            <div className="ci-line-track">
              <div className="ci-line-fill" />
              <div className="ci-marker left">0,0003</div>
              <div className="ci-marker center">Δ = +0,0017</div>
              <div className="ci-marker right">0,0031</div>
            </div>
            <small>Interval sepenuhnya berada di atas 0 (p = 0,0108 &lt; 0,05) — H1 Didukung!</small>
          </div>
          <div className="ci-desc">
            <p>{BOOTSTRAP_ABLATION.explanation}</p>
          </div>
        </div>
      </section>

      {/* 2.4 Subgroup Analysis */}
      <section className="ml-card-block">
        <div className="ml-block-header">
          <div>
            <span className="ml-block-eyebrow">2.4 EVALUASI SUBKELOMPOK</span>
            <h2>Ketahanan Model Lintas Demografi & Gaya Hidup</h2>
            <p>
              Evaluasi keadilan performa model pada subkelompok gender, kelompok usia, kebiasaan merokok, dan konsumsi alkohol.
            </p>
          </div>
          <div className="subgroup-tabs">
            {(["Gender", "Usia", "Merokok", "Alkohol"] as const).map((cat) => (
              <button
                key={cat}
                className={`subgroup-tab-btn ${subgroupCat === cat ? "active" : ""}`}
                onClick={() => setSubgroupCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="subgroup-table-wrap">
          <table className="subgroup-table">
            <thead>
              <tr>
                <th>Subkelompok Uji</th>
                <th>Jumlah Sampel (n)</th>
                <th>Accuracy</th>
                <th>Balanced Accuracy</th>
                <th>Macro F1 (Utama)</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubgroups.map((item) => (
                <tr key={item.subgroup}>
                  <td><strong>{item.subgroup}</strong></td>
                  <td>{formatNumber(item.n)} responden</td>
                  <td>{item.accuracy.toFixed(2)}%</td>
                  <td>{item.balancedAcc.toFixed(2)}%</td>
                  <td>
                    <strong className="subgroup-f1">{item.macroF1.toFixed(2)}%</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2.5 Top 20 SHAP Feature Importance */}
      <section className="ml-card-block">
        <div className="ml-block-header">
          <div>
            <span className="ml-block-eyebrow">2.5 INTERPRETABILITAS MODEL (SHAP)</span>
            <h2>Peringkat Top 20 Fitur Paling Berpengaruh (TreeExplainer)</h2>
            <p>
              Nilai rerata kontribusi absolut <code>Mean |SHAP|</code> yang menunjukkan fitur paling determinan dalam klasifikasi tekanan darah.
            </p>
          </div>
          <div className="shap-filter-pills">
            {["All", "Demografi", "Antropometri", "Biomarker Enzim", "Metabolik & Darah", "Profil Lipid", "Gaya Hidup"].map((cat) => (
              <button
                key={cat}
                className={`shap-pill ${shapCategory === cat ? "active" : ""}`}
                onClick={() => setShapCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="shap-bars-container">
          {filteredShap.map((f) => {
            const barWidth = (f.meanShap / maxShap) * 100;
            return (
              <div key={f.feature} className="shap-row">
                <div className="shap-label-col">
                  <span className="shap-rank">#{f.rank}</span>
                  <strong>{f.label}</strong>
                  <span className={`shap-cat-badge ${f.category.toLowerCase().replace(/[\s&]+/g, "-")}`}>
                    {f.category}
                  </span>
                </div>

                <div className="shap-bar-track">
                  <div
                    className="shap-bar-fill"
                    style={{
                      width: `${barWidth}%`,
                      background:
                        f.rank <= 2
                          ? "linear-gradient(90deg, #0f766e 0%, #14b8a6 100%)"
                          : f.rank <= 5
                          ? "linear-gradient(90deg, #1d4ed8 0%, #3b82f6 100%)"
                          : "linear-gradient(90deg, #64748b 0%, #94a3b8 100%)",
                    }}
                  />
                </div>

                <div className="shap-val-col">
                  <strong>{f.meanShap.toFixed(5)}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2.6 Discussion Insights Cards */}
      <section className="ml-card-block">
        <div className="ml-block-header">
          <div>
            <span className="ml-block-eyebrow">2.6 DISKUSI & INSIGHT ARTIKEL ILMIAH</span>
            <h2>Temuan Kritis & Implikasi Klinis Penelitian</h2>
            <p>
              Rangkuman pembahasan ilmiah untuk penulisan naskah publikasi dan interpretasi kebijakan kesehatan masyarakat.
            </p>
          </div>
        </div>

        <div className="discussion-grid">
          {DISCUSSION_INSIGHTS.map((d) => (
            <article key={d.title} className="discussion-card">
              <div className="disc-tag">{d.tag}</div>
              <h3>{d.title}</h3>
              <p className="disc-lead">{d.lead}</p>
              <p className="disc-body">{d.content}</p>
              <div className="disc-significance">
                <span className="ds-label">IMPLIKASI KLINIS:</span>
                <p>{d.clinicalSignificance}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

/* =========================================================================
   6. DATA AUDIT SECTION (2.1 Integritas, Sentinel, Split)
   ========================================================================= */
export function DataAuditSection() {
  const [copied, setCopied] = useState(false);

  const copyHash = () => {
    navigator.clipboard.writeText(RESEARCH_META.datasetHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="data-audit-wrap">
      <div className="audit-kpi-grid">
        <div className="audit-kpi-card">
          <small>DIMENSI DATASET</small>
          <strong>{formatNumber(RESEARCH_META.totalRecords)} × {RESEARCH_META.totalFeatures}</strong>
          <span>Baris × Kolom (26 duplikat dibersihkan)</span>
        </div>
        <div className="audit-kpi-card">
          <small>SKEMA SPLIT DATA</small>
          <strong>80 : 20 Stratified</strong>
          <span>{formatNumber(RESEARCH_META.trainRecords)} Latih · {formatNumber(RESEARCH_META.testRecords)} Uji</span>
        </div>
        <div className="audit-kpi-card">
          <small>NILAI SENTINEL DIBERSIHKAN</small>
          <strong>{formatNumber(RESEARCH_META.sentinelTotal)} Sel</strong>
          <span>Pada {formatNumber(RESEARCH_META.sentinelRows)} baris ({RESEARCH_META.sentinelPct}%)</span>
        </div>
        <div className="audit-kpi-card">
          <small>PENCEGAHAN TARGET LEAKAGE</small>
          <strong>22 Fitur Prediktor</strong>
          <span>SBP & DBP dieksklusi dari matriks fitur</span>
        </div>
      </div>

      <div className="audit-hash-bar">
        <div>
          <span className="hash-label">KODE INTEGRITAS DATASET (SHA-256):</span>
          <code className="hash-code">{RESEARCH_META.datasetHash}</code>
        </div>
        <button className="copy-hash-btn" onClick={copyHash}>
          {copied ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              Tersalin!
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          ) : (
            "Salin Hash"
          )}
        </button>
      </div>

      <div className="sentinel-table-wrap">
        <h3>Audit & Protokol Pembersihan Nilai Sentinel (Anomali)</h3>
        <table className="sentinel-table">
          <thead>
            <tr>
              <th>Fitur / Kolom</th>
              <th>Nilai Sentinel</th>
              <th>Jumlah Baris Terdampak</th>
              <th>Tindakan Pembersihan (Pipeline Safe)</th>
            </tr>
          </thead>
          <tbody>
            {SENTINEL_DATA.map((s) => (
              <tr key={s.feature}>
                <td><code>{s.feature}</code></td>
                <td><span className="sentinel-tag">{s.sentinelValue}</span></td>
                <td>{formatNumber(s.rowCount)} baris</td>
                <td>{s.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================================
   7. AUTHORS & ACADEMIC CREDENTIALS CARD
   ========================================================================= */
export function AuthorsTeamCard() {
  return (
    <div className="academic-team-card">
      <div className="atc-header">
        <span className="atc-eyebrow">TIM PENELITI / MAHASISWA</span>
        <h2>{RESEARCH_META.program} • {RESEARCH_META.institution}</h2>
        <p>{RESEARCH_META.projectTitle} ({RESEARCH_META.academicYear})</p>
      </div>

      <div className="authors-grid">
        {RESEARCH_META.authors.map((author) => (
          <div key={author.nim} className="author-card">
            <div className="author-avatar">
              {author.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div className="author-info">
              <strong>{author.name}</strong>
              <span className="author-nim">NIM: {author.nim}</span>
              <small className="author-role">{author.role}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
