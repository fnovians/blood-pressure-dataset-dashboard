import { ChangeEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  CategoryDonutChart,
  HypertensionAgeBarChart,
  LifestyleStackedBarChart,
  BiomarkerComparisonChart,
  ModelBenchmarkSection,
  DataAuditSection,
  AuthorsTeamCard,
} from "./components/ResearchComponents";
import { LiquidGlassBackground } from "./components/LiquidGlassBackground";
import { RESEARCH_META } from "./data/researchData";

type IconName =
  | "grid"
  | "database"
  | "users"
  | "heart"
  | "chart"
  | "info"
  | "download"
  | "upload"
  | "search"
  | "chevron"
  | "file"
  | "activity"
  | "layers"
  | "calendar"
  | "arrow"
  | "menu"
  | "close";

type DataRow = {
  sex: "Female" | "Male";
  age: number;
  count: number;
  systolic: number;
  diastolic: number;
};

const DEFAULT_DATA: DataRow[] = [
  { sex: "Female", age: 20, count: 12661, systolic: 111.3, diastolic: 69.3 },
  { sex: "Male", age: 20, count: 9310, systolic: 119.3, diastolic: 73.4 },
  { sex: "Female", age: 25, count: 29618, systolic: 111.0, diastolic: 69.4 },
  { sex: "Male", age: 25, count: 34752, systolic: 121.1, diastolic: 74.9 },
  { sex: "Female", age: 30, count: 28701, systolic: 111.4, diastolic: 70.1 },
  { sex: "Male", age: 30, count: 48899, systolic: 122.6, diastolic: 76.6 },
  { sex: "Female", age: 35, count: 26468, systolic: 112.7, diastolic: 71.1 },
  { sex: "Male", age: 35, count: 58258, systolic: 123.6, diastolic: 77.9 },
  { sex: "Female", age: 40, count: 60071, systolic: 115.2, diastolic: 72.6 },
  { sex: "Male", age: 40, count: 70314, systolic: 123.9, diastolic: 78.7 },
  { sex: "Female", age: 45, count: 54655, systolic: 117.6, diastolic: 73.9 },
  { sex: "Male", age: 45, count: 63700, systolic: 124.2, diastolic: 79.1 },
  { sex: "Female", age: 50, count: 64610, systolic: 120.0, diastolic: 75.1 },
  { sex: "Male", age: 50, count: 64824, systolic: 124.9, diastolic: 79.2 },
  { sex: "Female", age: 55, count: 55286, systolic: 121.8, diastolic: 75.6 },
  { sex: "Male", age: 55, count: 55937, systolic: 125.9, diastolic: 78.9 },
  { sex: "Female", age: 60, count: 55036, systolic: 124.3, diastolic: 75.9 },
  { sex: "Male", age: 60, count: 51027, systolic: 127.0, diastolic: 78.4 },
  { sex: "Female", age: 65, count: 26388, systolic: 127.5, diastolic: 76.3 },
  { sex: "Male", age: 65, count: 26573, systolic: 128.2, diastolic: 77.4 },
  { sex: "Female", age: 70, count: 26717, systolic: 129.9, diastolic: 76.4 },
  { sex: "Male", age: 70, count: 23949, systolic: 129.3, diastolic: 76.5 },
  { sex: "Female", age: 75, count: 13932, systolic: 131.6, diastolic: 76.6 },
  { sex: "Male", age: 75, count: 11401, systolic: 130.3, diastolic: 75.7 },
  { sex: "Female", age: 80, count: 8547, systolic: 132.8, diastolic: 76.8 },
  { sex: "Male", age: 80, count: 6421, systolic: 130.8, diastolic: 75.2 },
  { sex: "Female", age: 85, count: 2241, systolic: 131.9, diastolic: 76.3 },
  { sex: "Male", age: 85, count: 1050, systolic: 130.6, diastolic: 74.9 },
];

type SortKey = keyof DataRow;
type SortDirection = "asc" | "desc";

const navItems: { label: string; icon: IconName }[] = [
  { label: "Overview", icon: "grid" },
  { label: "Dataset Summary", icon: "database" },
  { label: "Demographic Analysis", icon: "users" },
  { label: "Blood Pressure Analysis", icon: "heart" },
  { label: "Model Evaluation & SHAP", icon: "activity" },
  { label: "Data Distribution", icon: "chart" },
  { label: "About Dataset", icon: "info" },
];

const pageMeta: Record<string, { kicker: string; title: string; description: string }> = {
  Overview: {
    kicker: "ANALYTICS OVERVIEW",
    title: "Dashboard Overview",
    description: "Ringkasan utama populasi, kategori klinis, dan indikator tekanan darah.",
  },
  "Dataset Summary": {
    kicker: "DATASET AUDIT & SUMMARY",
    title: "Dataset Audit & Summary",
    description: "Integritas data, pembersihan sentinel, skema split 80:20, dan preview data agregat.",
  },
  "Demographic Analysis": {
    kicker: "POPULATION & LIFESTYLE",
    title: "Demographic & Lifestyle Analysis",
    description: "Distribusi populasi serta pengaruh kebiasaan merokok dan konsumsi alkohol.",
  },
  "Blood Pressure Analysis": {
    kicker: "CLINICAL METRICS & SHAP BIOMARKERS",
    title: "Blood Pressure & Biomarker Analysis",
    description: "Analisis tekanan darah sepanjang usia, crossover point usia 70, dan profil biomarker.",
  },
  "Model Evaluation & SHAP": {
    kicker: "EXPLAINABLE ML & BENCHMARK",
    title: "Evaluasi Model & Interpretabilitas SHAP",
    description: "Benchmark performa Random Forest vs XGBoost, Confusion Matrix, Bootstrap 5.000 iterasi, dan Top 20 SHAP.",
  },
  "Data Distribution": {
    kicker: "DISTRIBUTION EXPLORER",
    title: "Data Distribution",
    description: "Sebaran volume responden serta rentang nilai tekanan darah.",
  },
  "About Dataset": {
    kicker: "RESEARCH DOCUMENTATION",
    title: "About Dataset & Academic Report",
    description: "Konteks ilmiah, tim peneliti UNESA, audit integritas SHA-256, dan metodologi.",
  },
};

function Icon({
  name,
  size = 18,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<IconName, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    heart: (
      <>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        <path d="M4.5 12h4l1.3-3 2.4 6 1.5-3H20" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m7 16 4-5 3 3 5-7" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12M7 10l5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4M7 9l5-5 5 5" />
        <path d="M5 20h14" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    file: (
      <>
        <path d="M6 2h8l4 4v16H6z" />
        <path d="M14 2v5h5M9 13h6M9 17h4" />
      </>
    ),
    activity: (
      <>
        <path d="M3 12h4l2-6 4 12 2-6h6" />
      </>
    ),
    layers: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    menu: (
      <>
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </>
    ),
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

function parseCsv(text: string): DataRow[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw new Error("File CSV tidak berisi data.");
  const delimiter = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(delimiter).map(normalize);
  const aliases = {
    sex: ["sex", "gender", "jenis_kelamin"],
    age: ["age", "usia"],
    count: ["jumlah_orang", "count", "population", "jumlah"],
    systolic: ["rata_rata_sistolik", "average_systolic", "avg_systolic", "systolic"],
    diastolic: ["rata_rata_diastolik", "average_diastolic", "avg_diastolic", "diastolic"],
  };
  const index = Object.fromEntries(
    Object.entries(aliases).map(([key, names]) => [
      key,
      headers.findIndex((header) => names.includes(header)),
    ]),
  ) as Record<keyof typeof aliases, number>;

  if (Object.values(index).some((value) => value < 0)) {
    throw new Error("Kolom CSV belum sesuai format yang dibutuhkan.");
  }

  const rows = lines.slice(1).map((line) => {
    const cells = line.split(delimiter).map((cell) => cell.trim().replace(/^"|"$/g, ""));
    const sexValue = cells[index.sex].toLowerCase();
    const row: DataRow = {
      sex: sexValue.startsWith("f") || sexValue === "perempuan" ? "Female" : "Male",
      age: Number(cells[index.age]),
      count: Number(cells[index.count]),
      systolic: Number(cells[index.systolic]),
      diastolic: Number(cells[index.diastolic]),
    };
    if (
      [row.age, row.count, row.systolic, row.diastolic].some((number) => !Number.isFinite(number))
    ) {
      throw new Error("CSV mengandung nilai numerik yang tidak valid.");
    }
    return row;
  });
  return rows;
}

function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function weightedAverage(rows: DataRow[], key: "systolic" | "diastolic") {
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  return total ? rows.reduce((sum, row) => sum + row[key] * row.count, 0) / total : null;
}

function EmptyChart({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`empty-chart ${compact ? "compact" : ""}`}>
      <div className="empty-grid" />
      <div className="empty-state">
        <span className="empty-icon">
          <Icon name="chart" size={19} />
        </span>
        <strong>Menunggu sumber data</strong>
        <span>Impor CSV untuk menghasilkan visualisasi</span>
      </div>
    </div>
  );
}

function LineChart({
  rows,
  metric,
  activeAge,
  onSelectAge,
}: {
  rows: DataRow[];
  metric: "systolic" | "diastolic";
  activeAge?: number | null;
  onSelectAge?: (age: number | null) => void;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const grouped = useMemo(() => {
    const ages = [...new Set(rows.map((row) => row.age))].sort((a, b) => a - b);
    return {
      ages,
      Female: ages.map((age) =>
        weightedAverage(
          rows.filter((row) => row.age === age && row.sex === "Female"),
          metric,
        ),
      ),
      Male: ages.map((age) =>
        weightedAverage(
          rows.filter((row) => row.age === age && row.sex === "Male"),
          metric,
        ),
      ),
      FemaleCounts: ages.map((age) =>
        rows
          .filter((row) => row.age === age && row.sex === "Female")
          .reduce((sum, r) => sum + r.count, 0),
      ),
      MaleCounts: ages.map((age) =>
        rows
          .filter((row) => row.age === age && row.sex === "Male")
          .reduce((sum, r) => sum + r.count, 0),
      ),
    };
  }, [rows, metric]);

  if (!rows.length || !grouped.ages.length) return <EmptyChart />;

  const allValues = [...grouped.Female, ...grouped.Male].filter(
    (value): value is number => value !== null,
  );
  const minY = Math.floor(Math.min(...allValues) / 10) * 10 - 5;
  const maxY = Math.ceil(Math.max(...allValues) / 10) * 10 + 5;
  const width = 640;
  const height = 235;
  const pad = { left: 48, right: 18, top: 18, bottom: 34 };

  const x = (index: number) =>
    pad.left + (index / Math.max(grouped.ages.length - 1, 1)) * (width - pad.left - pad.right);
  const y = (value: number) =>
    pad.top + ((maxY - value) / (maxY - minY || 1)) * (height - pad.top - pad.bottom);

  const points = (sex: "Female" | "Male") =>
    grouped[sex]
      .map((value, index) => (value === null ? null : `${x(index)},${y(value)}`))
      .filter(Boolean)
      .join(" ");

  const areaPoints = (sex: "Female" | "Male") => {
    const pts = grouped[sex]
      .map((v, i) => (v === null ? null : `${x(i)},${y(v)}`))
      .filter(Boolean);
    if (!pts.length) return "";
    const firstX = pts[0].split(",")[0];
    const lastX = pts[pts.length - 1].split(",")[0];
    const bottomY = height - pad.bottom;
    return `${firstX},${bottomY} ${pts.join(" ")} ${lastX},${bottomY}`;
  };

  const grid = Array.from({ length: 5 }, (_, index) => maxY - ((maxY - minY) / 4) * index);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const padLeftPx = (pad.left / width) * rect.width;
    const padRightPx = (pad.right / width) * rect.width;
    const usableWidth = rect.width - padLeftPx - padRightPx;
    if (usableWidth <= 0 || grouped.ages.length <= 1) return;
    const clampedX = Math.max(0, Math.min(usableWidth, mouseX - padLeftPx));
    const idx = Math.round((clampedX / usableWidth) * (grouped.ages.length - 1));
    setHoverIndex(idx);
  };

  const activeIdx =
    hoverIndex !== null
      ? hoverIndex
      : activeAge !== undefined && activeAge !== null
        ? grouped.ages.indexOf(activeAge)
        : null;

  const currentAge =
    activeIdx !== null && activeIdx >= 0 ? grouped.ages[activeIdx] : null;
  const currentFemale =
    activeIdx !== null && activeIdx >= 0 ? grouped.Female[activeIdx] : null;
  const currentMale =
    activeIdx !== null && activeIdx >= 0 ? grouped.Male[activeIdx] : null;
  const currentFCnt =
    activeIdx !== null && activeIdx >= 0 ? grouped.FemaleCounts[activeIdx] : 0;
  const currentMCnt =
    activeIdx !== null && activeIdx >= 0 ? grouped.MaleCounts[activeIdx] : 0;
  const currentDiff =
    currentFemale !== null && currentMale !== null
      ? Math.abs(currentMale - currentFemale)
      : null;
  const higherSex =
    currentFemale !== null && currentMale !== null
      ? currentMale >= currentFemale
        ? "Laki-laki"
        : "Perempuan"
      : null;
  const maxVal = Math.max(currentFemale ?? 0, currentMale ?? 0);
  const bpStatus =
    maxVal >= 130
      ? "Hipertensi Stage 1"
      : maxVal >= 120
        ? "Prehipertensi"
        : "Normal / Optimal";
  const bpBadgeClass =
    maxVal >= 130 ? "high" : maxVal >= 120 ? "elevated" : "normal";

  return (
    <div className="chart-wrap">
      <svg
        className="line-chart chart-svg-interactive"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Grafik rata-rata ${metric}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
        onClick={() => {
          if (currentAge !== null && onSelectAge) {
            onSelectAge(activeAge === currentAge ? null : currentAge);
          }
        }}
      >
        <defs>
          <linearGradient id={`femaleGrad-${metric}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#20b8a5" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#20b8a5" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id={`maleGrad-${metric}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3974a8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#3974a8" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {grid.map((value) => (
          <g key={value}>
            <line
              x1={pad.left}
              x2={width - pad.right}
              y1={y(value)}
              y2={y(value)}
              stroke="#e7edf2"
            />
            <text x={pad.left - 9} y={y(value) + 4} textAnchor="end">
              {Math.round(value)}
            </text>
          </g>
        ))}

        {grouped.ages.map(
          (age, index) =>
            index % Math.ceil(grouped.ages.length / 7) === 0 && (
              <text key={age} x={x(index)} y={height - 7} textAnchor="middle">
                {age}
              </text>
            ),
        )}

        {/* Gradient area under lines */}
        <polygon points={areaPoints("Female")} fill={`url(#femaleGrad-${metric})`} />
        <polygon points={areaPoints("Male")} fill={`url(#maleGrad-${metric})`} />

        {/* Polylines */}
        <polyline
          points={points("Female")}
          fill="none"
          stroke="#20b8a5"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <polyline
          points={points("Male")}
          fill="none"
          stroke="#3974a8"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />

        {/* Circles */}
        {(["Female", "Male"] as const).flatMap((sex) =>
          grouped[sex].map((value, index) => {
            if (value === null) return null;
            const isPointActive = activeIdx === index;
            return (
              <circle
                key={`${sex}-${index}`}
                cx={x(index)}
                cy={y(value)}
                r={isPointActive ? 6 : 3.8}
                fill={sex === "Female" ? "#20b8a5" : "#3974a8"}
                stroke="#ffffff"
                strokeWidth={isPointActive ? 2 : 1}
                className={isPointActive ? "chart-point-active" : ""}
              />
            );
          }),
        )}

        {/* Crossover Point Annotation at Age 70 for Systolic */}
        {metric === "systolic" && grouped.ages.includes(70) && (
          <g className="crossover-marker">
            {(() => {
              const idx70 = grouped.ages.indexOf(70);
              const x70 = x(idx70);
              const valF = grouped.Female[idx70];
              const valM = grouped.Male[idx70];
              if (valF === null || valM === null) return null;
              return (
                <g>
                  <line
                    x1={x70}
                    x2={x70}
                    y1={pad.top + 16}
                    y2={height - pad.bottom}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth="1.6"
                    opacity="0.85"
                  />
                  <circle cx={x70} cy={y(valF)} r="7" fill="none" stroke="#20b8a5" strokeWidth="2.5" />
                  <circle cx={x70} cy={y(valM)} r="7" fill="none" stroke="#3974a8" strokeWidth="2.5" />
                  <rect
                    x={x70 - 48}
                    y={pad.top}
                    width="96"
                    height="18"
                    rx="4"
                    fill="#fffbeb"
                    stroke="#f59e0b"
                    strokeWidth="1"
                  />
                  <text
                    x={x70}
                    y={pad.top + 12}
                    textAnchor="middle"
                    fill="#b45309"
                    fontSize="9.5"
                    fontWeight="800"
                  >
                    Crossover Usia 70
                  </text>
                </g>
              );
            })()}
          </g>
        )}

        {/* Hover Crosshair */}
        {activeIdx !== null && activeIdx >= 0 && (
          <g>
            <line
              className="chart-crosshair-line"
              x1={x(activeIdx)}
              x2={x(activeIdx)}
              y1={pad.top}
              y2={height - pad.bottom}
            />
            {currentFemale !== null && (
              <circle
                cx={x(activeIdx)}
                cy={y(currentFemale)}
                r="10"
                className="chart-pulse-ring"
                fill="#20b8a5"
              />
            )}
            {currentMale !== null && (
              <circle
                cx={x(activeIdx)}
                cy={y(currentMale)}
                r="10"
                className="chart-pulse-ring"
                fill="#3974a8"
              />
            )}
          </g>
        )}
      </svg>

      {/* Floating High-tech Glassmorphism Tooltip Card */}
      {currentAge !== null && (
        <div className="chart-floating-tooltip">
          <div className="cft-header">
            <span>Usia {currentAge} Tahun</span>
            <span className={`cft-badge ${bpBadgeClass}`}>{bpStatus}</span>
          </div>
          <div className="cft-row">
            <span>
              <i className="cft-dot female" /> Perempuan
            </span>
            <strong>
              {currentFemale !== null ? `${formatNumber(currentFemale, 1)} mmHg` : "—"}{" "}
              <small style={{ color: "#94a3b8", fontWeight: "normal" }}>
                ({formatNumber(currentFCnt)})
              </small>
            </strong>
          </div>
          <div className="cft-row">
            <span>
              <i className="cft-dot male" /> Laki-laki
            </span>
            <strong>
              {currentMale !== null ? `${formatNumber(currentMale, 1)} mmHg` : "—"}{" "}
              <small style={{ color: "#94a3b8", fontWeight: "normal" }}>
                ({formatNumber(currentMCnt)})
              </small>
            </strong>
          </div>
          {currentDiff !== null && (
            <div className="cft-diff">
              <span>
                {higherSex} +{formatNumber(currentDiff, 1)} mmHg
              </span>
              <span style={{ color: "#38bdf8" }}>Klik utk fokus</span>
            </div>
          )}
          {currentAge >= 70 && metric === "systolic" && (
            <div style={{ marginTop: "8px", paddingTop: "6px", borderTop: "1px dashed rgba(255,255,255,0.2)", fontSize: "11px", color: "#fef08a", display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>
                Titik Balik (Crossover Point): Sistolik perempuan ({formatNumber(currentFemale ?? 0, 1)}) menyalip laki-laki ({formatNumber(currentMale ?? 0, 1)})
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PopulationChart({
  rows,
  onSelectAgeRange,
}: {
  rows: DataRow[];
  onSelectAgeRange?: (start: number, end: number) => void;
}) {
  const [hoveredBucket, setHoveredBucket] = useState<number | null>(null);

  if (!rows.length) return <EmptyChart compact />;
  const buckets = [
    [20, 29],
    [30, 39],
    [40, 49],
    [50, 59],
    [60, 69],
    [70, 85],
  ];
  const totalPop = rows.reduce((sum, row) => sum + row.count, 0);
  const values = buckets.map(([start, end]) => {
    const fCount = rows
      .filter((row) => row.sex === "Female" && row.age >= start && row.age <= end)
      .reduce((sum, row) => sum + row.count, 0);
    const mCount = rows
      .filter((row) => row.sex === "Male" && row.age >= start && row.age <= end)
      .reduce((sum, row) => sum + row.count, 0);
    const sum = fCount + mCount;
    return {
      label: `${start}–${end}`,
      start,
      end,
      Female: fCount,
      Male: mCount,
      total: sum,
      pctOfTotal: totalPop ? (sum / totalPop) * 100 : 0,
      fPct: sum ? (fCount / sum) * 100 : 0,
      mPct: sum ? (mCount / sum) * 100 : 0,
    };
  });
  const max = Math.max(...values.flatMap((value) => [value.Female, value.Male]), 1);

  return (
    <div className="bar-chart" style={{ position: "relative" }}>
      {values.map((value, idx) => (
        <div
          className="bar-group"
          key={value.label}
          style={{
            cursor: "pointer",
            transition: "transform 0.15s ease",
            transform: hoveredBucket === idx ? "scale(1.05)" : "none",
          }}
          onMouseEnter={() => setHoveredBucket(idx)}
          onMouseLeave={() => setHoveredBucket(null)}
          onClick={() => onSelectAgeRange?.(value.start, value.end)}
        >
          <div className="bars">
            <i
              className="female"
              style={{
                height: `${(value.Female / max) * 100}%`,
                opacity: hoveredBucket !== null && hoveredBucket !== idx ? 0.45 : 1,
                transition: "opacity 0.2s ease",
              }}
            />
            <i
              className="male"
              style={{
                height: `${(value.Male / max) * 100}%`,
                opacity: hoveredBucket !== null && hoveredBucket !== idx ? 0.45 : 1,
                transition: "opacity 0.2s ease",
              }}
            />
          </div>
          <span
            style={{
              fontWeight: hoveredBucket === idx ? 700 : 500,
              color: hoveredBucket === idx ? "#173b57" : "#8094a2",
            }}
          >
            {value.label}
          </span>
        </div>
      ))}

      {hoveredBucket !== null && (
        <div
          style={{
            position: "absolute",
            bottom: "45px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(18, 52, 78, 0.95)",
            color: "white",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "8.5px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            whiteSpace: "nowrap",
            zIndex: 10,
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: "#5eead4",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
              paddingBottom: "3px",
            }}
          >
            Usia {values[hoveredBucket].label} Tahun · {formatNumber(values[hoveredBucket].total)} Jiwa (
            {values[hoveredBucket].pctOfTotal.toFixed(1)}%)
          </div>
          <div>
            <span style={{ color: "#20b8a5" }}>● Perempuan:</span>{" "}
            {formatNumber(values[hoveredBucket].Female)} ({values[hoveredBucket].fPct.toFixed(1)}%)
          </div>
          <div>
            <span style={{ color: "#3974a8" }}>● Laki-laki:</span>{" "}
            {formatNumber(values[hoveredBucket].Male)} ({values[hoveredBucket].mPct.toFixed(1)}%)
          </div>
        </div>
      )}
    </div>
  );
}

function BloodPressureSimulator({ rows }: { rows: DataRow[] }) {
  const [userSex, setUserSex] = useState<"Female" | "Male">("Male");
  const [userAge, setUserAge] = useState<number>(40);
  const [userSys, setUserSys] = useState<number>(124);
  const [userDia, setUserDia] = useState<number>(78);

  // Find population benchmark from dataset
  const benchmark = useMemo(() => {
    const sexRows = rows.filter((r) => r.sex === userSex);
    if (!sexRows.length) return null;
    const closest = sexRows.reduce((prev, curr) =>
      Math.abs(curr.age - userAge) < Math.abs(prev.age - userAge) ? curr : prev,
    );
    const diffSys = userSys - closest.systolic;
    const diffDia = userDia - closest.diastolic;
    return {
      closestAge: closest.age,
      popSys: closest.systolic,
      popDia: closest.diastolic,
      popCount: closest.count,
      diffSys,
      diffDia,
    };
  }, [rows, userSex, userAge, userSys, userDia]);

  // AHA Classification
  const classification = useMemo(() => {
    if (userSys >= 140 || userDia >= 90) {
      return {
        label: "Hipertensi Stage 2",
        tone: "high2",
        color: "#dc2626",
        angle: 65,
        desc: "Tekanan darah tinggi signifikan. Disarankan evaluasi klinis dan manajemen medis.",
      };
    }
    if (userSys >= 130 || userDia >= 80) {
      return {
        label: "Hipertensi Stage 1",
        tone: "high1",
        color: "#ea580c",
        angle: 25,
        desc: "Kategori hipertensi tahap awal. Modifikasi pola makan, kurangi garam, dan olahraga rutin.",
      };
    }
    if (userSys >= 120 && userDia < 80) {
      return {
        label: "Elevated / Prehipertensi",
        tone: "elevated",
        color: "#d97706",
        angle: -25,
        desc: "Tekanan darah sedikit di atas optimal. Jaga aktivitas fisik teratur untuk mencegah kenaikan.",
      };
    }
    return {
      label: "Normal / Optimal",
      tone: "normal",
      color: "#16a34a",
      angle: -65,
      desc: "Tekanan darah Anda berada dalam rentang ideal dan sehat. Pertahankan pola hidup bugar!",
    };
  }, [userSys, userDia]);

  const setPreset = (s: number, d: number) => {
    setUserSys(s);
    setUserDia(d);
  };

  const setPopAverage = () => {
    if (benchmark) {
      setUserSys(Math.round(benchmark.popSys));
      setUserDia(Math.round(benchmark.popDia));
    }
  };

  return (
    <section className="dashboard-section simulator-section">
      <article className="simulator-card">
        <SectionHeader
          eyebrow="INTERACTIVE CLINICAL SIMULATOR"
          title="Simulasi & Komparator Terhadap 991.346 Responden Dataset"
          description="Uji coba nilai tekanan darah Anda dan bandingkan secara langsung dengan rata-rata responden riil pada kelompok usia dan jenis kelamin sebayanya."
        />
        <div className="sim-grid">
          <div className="sim-controls">
            <div className="sim-control-group">
              <div className="sim-label-row">
                <span>JENIS KELAMIN</span>
                <span className="sim-value-badge">
                  {userSex === "Female" ? "Perempuan (Wanita)" : "Laki-laki (Pria)"}
                </span>
              </div>
              <div className="sim-gender-toggle">
                <button
                  type="button"
                  className={`sim-gender-btn ${userSex === "Female" ? "active female" : ""}`}
                  onClick={() => setUserSex("Female")}
                >
                  <i className="cft-dot female" /> Perempuan (Wanita)
                </button>
                <button
                  type="button"
                  className={`sim-gender-btn ${userSex === "Male" ? "active male" : ""}`}
                  onClick={() => setUserSex("Male")}
                >
                  <i className="cft-dot male" /> Laki-laki (Pria)
                </button>
              </div>
            </div>

            <div className="sim-control-group">
              <div className="sim-label-row">
                <span>USIA RESPONDEN</span>
                <span className="sim-value-badge">{userAge} tahun</span>
              </div>
              <input
                type="range"
                min={20}
                max={85}
                step={5}
                value={userAge}
                onChange={(e) => setUserAge(Number(e.target.value))}
                className="sim-slider"
              />
            </div>

            <div className="sim-control-group">
              <div className="sim-label-row">
                <span>TEKANAN SISTOLIK (mmHg)</span>
                <span className="sim-value-badge" style={{ color: "#0f766e" }}>
                  {userSys} mmHg
                </span>
              </div>
              <input
                type="range"
                min={90}
                max={180}
                value={userSys}
                onChange={(e) => setUserSys(Number(e.target.value))}
                className="sim-slider"
              />
            </div>

            <div className="sim-control-group">
              <div className="sim-label-row">
                <span>TEKANAN DIASTOLIK (mmHg)</span>
                <span className="sim-value-badge" style={{ color: "#2563eb" }}>
                  {userDia} mmHg
                </span>
              </div>
              <input
                type="range"
                min={60}
                max={110}
                value={userDia}
                onChange={(e) => setUserDia(Number(e.target.value))}
                className="sim-slider"
              />
            </div>

            <div className="sim-control-group">
              <span style={{ fontSize: "8px", fontWeight: 700, color: "#64748b" }}>
                PRESET NILAI CEPAT:
              </span>
              <div className="sim-presets-row">
                <button
                  type="button"
                  className="sim-preset-chip"
                  onClick={() => setPreset(115, 75)}
                >
                  <span className="preset-indicator-dot dot-emerald" />
                  <span>Normal (115/75)</span>
                </button>
                <button
                  type="button"
                  className="sim-preset-chip"
                  onClick={() => setPreset(125, 78)}
                >
                  <span className="preset-indicator-dot dot-sky" />
                  <span>Prehipertensi (125/78)</span>
                </button>
                <button
                  type="button"
                  className="sim-preset-chip"
                  onClick={() => setPreset(136, 86)}
                >
                  <span className="preset-indicator-dot dot-amber" />
                  <span>Stage 1 (136/86)</span>
                </button>
                <button
                  type="button"
                  className="sim-preset-chip"
                  onClick={() => setPreset(152, 95)}
                >
                  <span className="preset-indicator-dot dot-rose" />
                  <span>Stage 2 (152/95)</span>
                </button>
                <button type="button" className="sim-preset-chip" onClick={setPopAverage}>
                  <Icon name="chart" size={13} />
                  <span>Sesuai Rata-rata Populasi</span>
                </button>
              </div>
            </div>
          </div>

          <div className="sim-results">
            <div className="sim-gauge-card">
              <span
                style={{
                  fontSize: "8px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#64748b",
                }}
              >
                KLASIFIKASI STANDAR AHA / JNC-8
              </span>

              {/* Gauge Semi-Circular Meter */}
              <svg width="200" height="110" viewBox="0 0 200 110">
                <path
                  d="M 25 100 A 75 75 0 0 1 175 100"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 25 100 A 75 75 0 0 1 65 37"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 65 37 A 75 75 0 0 1 100 25"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="14"
                />
                <path
                  d="M 100 25 A 75 75 0 0 1 135 37"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="14"
                />
                <path
                  d="M 135 37 A 75 75 0 0 1 175 100"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Needle */}
                <g
                  transform={`rotate(${classification.angle}, 100, 100)`}
                  style={{ transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                >
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="38"
                    stroke="#0f172a"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="100" r="7" fill="#0f172a" />
                  <circle cx="100" cy="100" r="3" fill="#ffffff" />
                </g>
              </svg>

              <div className={`sim-status-banner ${classification.tone}`}>
                <Icon name="heart" size={15} />
                <span>{classification.label}</span>
              </div>

              <p
                style={{
                  fontSize: "8.5px",
                  color: "#64748b",
                  marginTop: "8px",
                  maxWidth: "270px",
                  lineHeight: "1.4",
                }}
              >
                {classification.desc}
              </p>
            </div>

            {benchmark && (
              <div className="sim-benchmark-card">
                <span className="sim-benchmark-title">KOMPARASI DENGAN DATASET 991.346 JIWA</span>
                <div className="sim-benchmark-stat">
                  <strong>
                    {userSys} / {userDia}
                  </strong>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>vs</span>
                  <strong style={{ color: "#0f766e" }}>
                    {formatNumber(benchmark.popSys, 1)} / {formatNumber(benchmark.popDia, 1)}
                  </strong>
                  <small style={{ fontSize: "8px", color: "#64748b" }}>
                    mmHg (Rata-rata sebayanya)
                  </small>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span
                    className={`sim-delta-pill ${benchmark.diffSys > 0 ? "higher" : benchmark.diffSys < 0 ? "lower" : "same"
                      }`}
                  >
                    Sistolik:{" "}
                    {benchmark.diffSys > 0
                      ? `+${benchmark.diffSys.toFixed(1)} mmHg di atas populasi`
                      : benchmark.diffSys < 0
                        ? `${benchmark.diffSys.toFixed(1)} mmHg di bawah populasi`
                        : "Sama persis dengan populasi"}
                  </span>
                  <span
                    className={`sim-delta-pill ${benchmark.diffDia > 0 ? "higher" : benchmark.diffDia < 0 ? "lower" : "same"
                      }`}
                  >
                    Diastolik:{" "}
                    {benchmark.diffDia > 0
                      ? `+${benchmark.diffDia.toFixed(1)} mmHg di atas populasi`
                      : benchmark.diffDia < 0
                        ? `${benchmark.diffDia.toFixed(1)} mmHg di bawah populasi`
                        : "Sama persis dengan populasi"}
                  </span>
                </div>

                <small style={{ fontSize: "7.5px", color: "#8da1ae", marginTop: "3px" }}>
                  Benchmark diambil dari data agregat {userSex === "Female" ? "Perempuan" : "Laki-laki"}{" "}
                  usia {benchmark.closestAge} tahun ({formatNumber(benchmark.popCount)} responden).
                </small>
              </div>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}

function GenderPressureChart({ rows }: { rows: DataRow[] }) {
  if (!rows.length) return <EmptyChart compact />;
  const values = (["Female", "Male"] as const).map((sex) => ({
    sex,
    systolic:
      weightedAverage(
        rows.filter((row) => row.sex === sex),
        "systolic",
      ) ?? 0,
    diastolic:
      weightedAverage(
        rows.filter((row) => row.sex === sex),
        "diastolic",
      ) ?? 0,
  }));
  const max = Math.max(...values.flatMap((value) => [value.systolic, value.diastolic]), 1);
  return (
    <div className="horizontal-chart">
      {values.map((value) => (
        <div className="horizontal-group" key={value.sex}>
          <strong>{value.sex}</strong>
          <div>
            <span>Systolic</span>
            <i style={{ width: `${(value.systolic / max) * 100}%` }}>
              <b>{formatNumber(value.systolic, 1)}</b>
            </i>
          </div>
          <div>
            <span>Diastolic</span>
            <i className="diastolic-bar" style={{ width: `${(value.diastolic / max) * 100}%` }}>
              <b>{formatNumber(value.diastolic, 1)}</b>
            </i>
          </div>
        </div>
      ))}
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  suffix,
  note,
  tone,
}: {
  icon: IconName;
  label: string;
  value: string;
  suffix?: string;
  note: string;
  tone: "blue" | "teal" | "violet" | "orange";
}) {
  return (
    <article className={`kpi-card tone-${tone}`}>
      <div className={`kpi-icon ${tone}`}>
        <Icon name={icon} size={21} />
      </div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {value} {suffix && <small>{suffix}</small>}
      </div>
      <div className="kpi-note">
        <span className={`note-dot ${tone}`} />
        {note}
      </div>
    </article>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rows, setRows] = useState<DataRow[]>(DEFAULT_DATA);
  const [sexFilter, setSexFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [ageCategory, setAgeCategory] = useState<string>("All");
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("age");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("Blood Pressure Dataset · 28 kelompok agregat");
  const inputRef = useRef<HTMLInputElement>(null);
  const currentPage = pageMeta[activeNav];

  useEffect(() => {
    // Initial check for mobile viewports
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    // Dynamic pulsing ECG heartbeat tab icon
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let offset = 0;
    let animId: number;
    let lastTime = 0;

    const link =
      document.querySelector<HTMLLinkElement>("link[rel='icon']") ||
      document.querySelector<HTMLLinkElement>("link[rel*='icon']");

    if (!link) return;

    const render = (time: number) => {
      if (document.visibilityState === "visible" && time - lastTime > 70) {
        lastTime = time;
        offset = (offset + 1.2) % 32;

        ctx.clearRect(0, 0, 32, 32);

        // Background rounded squircle
        ctx.fillStyle = "#14b8a6";
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(0, 0, 32, 32, 8);
        else ctx.rect(0, 0, 32, 32);
        ctx.fill();

        // ECG Line
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();

        for (let x = 0; x < 32; x++) {
          const relX = (x + offset) % 32;
          let y = 16;
          if (relX >= 8 && relX < 11) {
            y = 16 - (relX - 8) * 1.5;
          } else if (relX >= 11 && relX < 14) {
            y = 11.5 + (relX - 11) * 4.5;
          } else if (relX >= 14 && relX < 18) {
            y = 25 - (relX - 14) * 5.5;
          } else if (relX >= 18 && relX < 21) {
            y = 3 + (relX - 18) * 4.3;
          }
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        link.href = canvas.toDataURL("image/png");
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const matchesSex = sexFilter === "All" || row.sex === sexFilter;
        const matchesAge = ageFilter === "All" || row.age === Number(ageFilter);
        let matchesCategory = true;
        if (ageCategory === "Young") matchesCategory = row.age >= 20 && row.age <= 39;
        else if (ageCategory === "Middle") matchesCategory = row.age >= 40 && row.age <= 59;
        else if (ageCategory === "Senior") matchesCategory = row.age >= 60;
        return matchesSex && matchesAge && matchesCategory;
      }),
    [rows, sexFilter, ageFilter, ageCategory],
  );

  const systolic = weightedAverage(filteredRows, "systolic");
  const diastolic = weightedAverage(filteredRows, "diastolic");
  const totalPopulation = rows.reduce((sum, row) => sum + row.count, 0);
  const ages = [...new Set(rows.map((row) => row.age))].sort((a, b) => a - b);
  const analysisSummary = useMemo(() => {
    const activeAges = [...new Set(filteredRows.map((row) => row.age))].sort((a, b) => a - b);
    const youngestAge = activeAges[0];
    const oldestAge = activeAges.at(-1);
    const youngestSystolic = weightedAverage(
      filteredRows.filter((row) => row.age === youngestAge),
      "systolic",
    );
    const oldestSystolic = weightedAverage(
      filteredRows.filter((row) => row.age === oldestAge),
      "systolic",
    );
    const femaleSystolic = weightedAverage(
      filteredRows.filter((row) => row.sex === "Female"),
      "systolic",
    );
    const maleSystolic = weightedAverage(
      filteredRows.filter((row) => row.sex === "Male"),
      "systolic",
    );
    const largestGroup = activeAges
      .map((age) => ({
        age,
        count: filteredRows
          .filter((row) => row.age === age)
          .reduce((sum, row) => sum + row.count, 0),
      }))
      .sort((a, b) => b.count - a.count)[0];
    return {
      youngestAge,
      oldestAge,
      systolicChange:
        youngestSystolic !== null && oldestSystolic !== null
          ? oldestSystolic - youngestSystolic
          : null,
      genderGap:
        femaleSystolic !== null && maleSystolic !== null
          ? Math.abs(maleSystolic - femaleSystolic)
          : null,
      higherGender:
        femaleSystolic !== null && maleSystolic !== null
          ? maleSystolic >= femaleSystolic
            ? "Male"
            : "Female"
          : null,
      largestGroup,
      highestSystolic: [...filteredRows].sort((a, b) => b.systolic - a.systolic)[0],
    };
  }, [filteredRows]);

  const tableRows = useMemo(
    () =>
      filteredRows
        .filter((row) => `${row.sex} ${row.age}`.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
          const first = a[sortKey];
          const second = b[sortKey];
          const result =
            typeof first === "string"
              ? first.localeCompare(second as string)
              : first - (second as number);
          return sortDirection === "asc" ? result : -result;
        }),
    [filteredRows, search, sortKey, sortDirection],
  );
  const tableSummary = useMemo(() => {
    const totalCount = tableRows.reduce((sum, r) => sum + r.count, 0);
    const weightedSys = totalCount
      ? tableRows.reduce((sum, r) => sum + r.systolic * r.count, 0) / totalCount
      : null;
    const weightedDia = totalCount
      ? tableRows.reduce((sum, r) => sum + r.diastolic * r.count, 0) / totalCount
      : null;
    const femaleCount = tableRows
      .filter((r) => r.sex === "Female")
      .reduce((sum, r) => sum + r.count, 0);
    const maleCount = tableRows
      .filter((r) => r.sex === "Male")
      .reduce((sum, r) => sum + r.count, 0);
    const ages = tableRows.map((r) => r.age);
    const minAge = ages.length ? Math.min(...ages) : 0;
    const maxAge = ages.length ? Math.max(...ages) : 0;

    return {
      totalCount,
      weightedSys,
      weightedDia,
      femaleCount,
      maleCount,
      femalePercent: totalCount ? (femaleCount / totalCount) * 100 : 0,
      malePercent: totalCount ? (maleCount / totalCount) * 100 : 0,
      minAge,
      maxAge,
      totalRows: tableRows.length,
    };
  }, [tableRows]);

  const pageCount = perPage === 28 ? 1 : Math.max(1, Math.ceil(tableRows.length / perPage));
  const visibleRows =
    perPage === 28
      ? tableRows
      : tableRows.slice((page - 1) * perPage, page * perPage);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = parseCsv(await file.text());
      setRows(parsed);
      setFileName(file.name);
      setError("");
      setPage(1);
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : "Dataset tidak dapat dibaca.");
    }
  };

  const handleSort = (key: SortKey) => {
    setSortDirection(sortKey === key && sortDirection === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  const exportReport = () => {
    const report = [
      "BIGDATA INSIGHT — Dataset Overview",
      `Total Population,${totalPopulation}`,
      `Total Features,24`,
      `Average Systolic,${systolic?.toFixed(2) ?? "Data not available"}`,
      `Average Diastolic,${diastolic?.toFixed(2) ?? "Data not available"}`,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([report], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "bigdata-insight-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportTableCsv = () => {
    const headers = "No,Sex,Age,Jumlah Orang,Rata-rata Sistolik (mmHg),Rata-rata Diastolik (mmHg),Kategori";
    const body = tableRows
      .map((r, i) => {
        const bpCategory =
          r.systolic >= 130 || r.diastolic >= 80
            ? "Hipertensi Stage 1"
            : r.systolic >= 120
              ? "Prehipertensi"
              : "Normal";
        return `${i + 1},${r.sex},${r.age},${r.count},${r.systolic},${r.diastolic},${bpCategory}`;
      })
      .join("\n");
    const summary = `\nTotal & Rata-rata Berbobot,,${tableSummary.minAge}-${tableSummary.maxAge} th,${tableSummary.totalCount},${tableSummary.weightedSys?.toFixed(1) ?? ""},${tableSummary.weightedDia?.toFixed(1) ?? ""},Ringkasan Agregat`;
    const csvContent = `${headers}\n${body}${summary}`;
    const url = URL.createObjectURL(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "blood-pressure-summary-table.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`app-shell ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Icon name="activity" size={23} strokeWidth={2.2} />
          </div>
          <div>
            <strong>BIGDATA</strong>
            <span>INSIGHT</span>
          </div>
        </div>

        <div className="nav-label">MAIN MENU</div>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.label}
              className={activeNav === item.label ? "active" : ""}
              onClick={() => {
                setActiveNav(item.label);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
              {activeNav === item.label && <Icon name="chevron" size={14} />}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main">
        <LiquidGlassBackground />
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label={sidebarOpen ? "Tutup Menu Sidebar" : "Buka Menu Sidebar"}
              title="Menu Sidebar (Hamburger)"
            >
              <Icon name="menu" size={20} strokeWidth={2} />
            </button>
            <div className="breadcrumb">
              <span>Dashboard</span>
              <Icon name="chevron" size={12} />
              <strong>{activeNav}</strong>
            </div>
          </div>
        </header>

        <div className="content">
          <section className="page-heading">
            <div>
              <span className="page-kicker">{currentPage.kicker}</span>
              <h1>{currentPage.title}</h1>
              <p>{currentPage.description}</p>
            </div>
            <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={handleFile} hidden />
          </section>

          <div key={activeNav} className="tab-pane-animated">
            {(activeNav === "Overview" || activeNav === "Dataset Summary") && (
              <>
                {error && (
                  <div className="error-message">
                    {error} Gunakan kolom: sex, age, jumlah_orang, rata_rata_sistolik,
                    rata_rata_diastolik.
                  </div>
                )}

                <section className="kpi-grid">
                  <KpiCard
                    icon="users"
                    label="TOTAL REKAM MEDIS (1.1)"
                    value={formatNumber(totalPopulation)}
                    suffix="Responden"
                    note="Pria: 526.415 (53,1%) · Wanita: 464.931 (46,9%)"
                    tone="blue"
                  />
                  <KpiCard
                    icon="activity"
                    label="RATA-RATA GLOBAL"
                    value={
                      systolic && diastolic
                        ? `${formatNumber(systolic, 1)} / ${formatNumber(diastolic, 1)}`
                        : "122,4 / 76,1"
                    }
                    suffix="mmHg"
                    note="Sistolik 122,43 · Diastolik 76,05 mmHg"
                    tone="teal"
                  />
                  <KpiCard
                    icon="layers"
                    label="MODEL TERBAIK (MACRO F1)"
                    value="36,68%"
                    suffix="Macro F1"
                    note="Random Forest · 2,6x baseline mayoritas (14,12%)"
                    tone="violet"
                  />
                  <KpiCard
                    icon="heart"
                    label="FAKTOR UTAMA SHAP (#1 & #2)"
                    value="Usia & Pinggang"
                    suffix="Predictors"
                    note="num__age (0,0293) · num__waistline (0,0248)"
                    tone="orange"
                  />
                </section>
              </>
            )}

            {activeNav !== "About Dataset" && (
              <section className="filter-bar">
                <div className="filter-title">
                  <span>
                    <Icon name="chart" size={17} />
                  </span>
                  <div>
                    <strong>Analysis Filters</strong>
                    <small>Terapkan ke seluruh visualisasi</small>
                  </div>
                </div>
                <label>
                  Jenis Kelamin
                  <select
                    value={sexFilter}
                    onChange={(e) => {
                      setSexFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="All">Semua Gender</option>
                    <option>Female</option>
                    <option>Male</option>
                  </select>
                </label>
                <label>
                  Kelompok Usia
                  <select
                    value={ageFilter}
                    onChange={(e) => {
                      setAgeFilter(e.target.value);
                      setAgeCategory("All");
                      setPage(1);
                    }}
                  >
                    <option value="All">Semua Usia (20–85)</option>
                    {ages.map((age) => (
                      <option key={age}>{age}</option>
                    ))}
                  </select>
                </label>
                <div className="filter-meta">
                  <span className="filter-count">{filteredRows.length}</span>
                  <span>
                    kelompok
                    <br />
                    terfilter
                  </span>
                </div>

                {/* Quick Interactive Preset Pills */}
                <div className="filter-presets">
                  <span className="filter-preset-label">Kategori Cepat:</span>
                  <button
                    type="button"
                    className={`filter-preset-btn ${ageCategory === "All" && ageFilter === "All" ? "active" : ""
                      }`}
                    onClick={() => {
                      setAgeCategory("All");
                      setAgeFilter("All");
                      setPage(1);
                    }}
                  >
                    Semua Usia (20–85)
                  </button>
                  <button
                    type="button"
                    className={`filter-preset-btn ${ageCategory === "Young" ? "active" : ""}`}
                    onClick={() => {
                      setAgeCategory("Young");
                      setAgeFilter("All");
                      setPage(1);
                    }}
                  >
                    Dewasa Muda (20–39)
                  </button>
                  <button
                    type="button"
                    className={`filter-preset-btn ${ageCategory === "Middle" ? "active" : ""}`}
                    onClick={() => {
                      setAgeCategory("Middle");
                      setAgeFilter("All");
                      setPage(1);
                    }}
                  >
                    Paruh Baya (40–59)
                  </button>
                  <button
                    type="button"
                    className={`filter-preset-btn ${ageCategory === "Senior" ? "active" : ""}`}
                    onClick={() => {
                      setAgeCategory("Senior");
                      setAgeFilter("All");
                      setPage(1);
                    }}
                  >
                    Lansia (60+)
                  </button>

                  {(sexFilter !== "All" ||
                    ageFilter !== "All" ||
                    ageCategory !== "All" ||
                    selectedAge !== null ||
                    search !== "") && (
                      <button
                        type="button"
                        className="filter-reset-btn"
                        onClick={() => {
                          setSexFilter("All");
                          setAgeFilter("All");
                          setAgeCategory("All");
                          setSelectedAge(null);
                          setSearch("");
                          setPage(1);
                        }}
                      >
                        <Icon name="arrow" size={11} /> Reset Filter
                      </button>
                    )}
                </div>
              </section>
            )}

            {activeNav === "Overview" && (
              <>
                <section className="dashboard-section">
                  <SectionHeader
                    eyebrow="1.2 DISTRIBUSI KATEGORI TEKANAN DARAH"
                    title="Distribusi Klinis Responden (AHA / JNC-8)"
                    description="Distribusi 991.346 rekam medis ke dalam 4 kategori klinis. Arahkan kursor ke segmen donat atau legenda untuk detail persentase dan kriteria SBP/DBP."
                  />
                  <CategoryDonutChart />
                </section>

                <section className="dashboard-section">
                  <SectionHeader
                    eyebrow="1.3 PREVALENSI HIPERTENSI BERDASARKAN USIA"
                    title="Prevalensi Hipertensi per Kelompok Usia"
                    description="Proporsi kasus hipertensi terukur melonjak hampir 4x lipat (3,91x) dari usia <40 tahun (5,55%) ke lansia 60+ tahun (21,70%)."
                  />
                  <HypertensionAgeBarChart />
                </section>
              </>
            )}

            {(activeNav === "Overview" || activeNav === "Demographic Analysis") && (
              <section className="dashboard-section">
                <SectionHeader
                  eyebrow="POPULATION PROFILE"
                  title="Demographic Analysis"
                  description="Distribusi responden berdasarkan kelompok usia dan jenis kelamin."
                  action={
                    <div className="legend">
                      <span>
                        <i className="female" />
                        Female
                      </span>
                      <span>
                        <i className="male" />
                        Male
                      </span>
                    </div>
                  }
                />
                <div className="demographic-grid">
                  <article className="chart-card wide">
                    <div className="card-title">
                      <div>
                        <h3>Population by Age Group</h3>
                        <p>Jumlah responden pada setiap rentang usia</p>
                      </div>
                      <span className="unit">People</span>
                    </div>
                    <PopulationChart
                      rows={filteredRows}
                      onSelectAgeRange={(start, end) => {
                        if (start >= 20 && end <= 39)
                          setAgeCategory(ageCategory === "Young" ? "All" : "Young");
                        else if (start >= 40 && end <= 59)
                          setAgeCategory(ageCategory === "Middle" ? "All" : "Middle");
                        else if (start >= 60)
                          setAgeCategory(ageCategory === "Senior" ? "All" : "Senior");
                      }}
                    />
                  </article>
                  <article className="chart-card">
                    <div className="card-title">
                      <div>
                        <h3>Gender Comparison</h3>
                        <p>Komposisi populasi</p>
                      </div>
                    </div>
                    {rows.length ? (
                      <div className="gender-summary">
                        {(["Female", "Male"] as const).map((sex) => {
                          const count = filteredRows
                            .filter((row) => row.sex === sex)
                            .reduce((sum, row) => sum + row.count, 0);
                          const total = filteredRows.reduce((sum, row) => sum + row.count, 0);
                          return (
                            <div key={sex}>
                              <span>{sex}</span>
                              <strong>{formatNumber(count)}</strong>
                              <div>
                                <i
                                  className={sex.toLowerCase()}
                                  style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <EmptyChart compact />
                    )}
                  </article>
                </div>
              </section>
            )}

            {activeNav === "Demographic Analysis" && (
              <section className="dashboard-section">
                <SectionHeader
                  eyebrow="1.5 GAYA HIDUP & TEKANAN DARAH"
                  title="Distribusi Tekanan Darah Menurut Gaya Hidup"
                  description="Proporsi kategori klinis berdasarkan status merokok (SMK) dan konsumsi alkohol (DRK). Memperlihatkan fenomena reverse causality di mana mantan perokok memiliki hipertensi terukur tertinggi (15,86%)."
                />
                <LifestyleStackedBarChart />
              </section>
            )}

            {(activeNav === "Overview" || activeNav === "Blood Pressure Analysis") && (
              <section className="dashboard-section">
                <SectionHeader
                  eyebrow="CLINICAL METRICS & DYNAMIC CHARTS"
                  title="Blood Pressure Analysis"
                  description="Perubahan tekanan darah rata-rata berdasarkan usia dan jenis kelamin. Arahkan kursor ke grafik untuk melihat data rinci per titik usia."
                  action={
                    <div className="legend">
                      <span>
                        <i className="female" />
                        Female
                      </span>
                      <span>
                        <i className="male" />
                        Male
                      </span>
                    </div>
                  }
                />
                <div className="pressure-grid">
                  <article className="chart-card">
                    <div className="card-title">
                      <div>
                        <h3>Average Systolic Blood Pressure</h3>
                        <p>Trend pergerakan sistolik (Arahkan kursor utk detail)</p>
                      </div>
                      <span className="unit">mmHg</span>
                    </div>
                    <LineChart
                      rows={filteredRows}
                      metric="systolic"
                      activeAge={selectedAge}
                      onSelectAge={setSelectedAge}
                    />
                  </article>
                  <article className="chart-card">
                    <div className="card-title">
                      <div>
                        <h3>Average Diastolic Blood Pressure</h3>
                        <p>Trend pergerakan diastolik (Arahkan kursor utk detail)</p>
                      </div>
                      <span className="unit">mmHg</span>
                    </div>
                    <LineChart
                      rows={filteredRows}
                      metric="diastolic"
                      activeAge={selectedAge}
                      onSelectAge={setSelectedAge}
                    />
                  </article>
                  <article className="chart-card comparison-card">
                    <div className="card-title">
                      <div>
                        <h3>Blood Pressure by Gender</h3>
                        <p>Perbandingan sistolik dan diastolik</p>
                      </div>
                    </div>
                    <GenderPressureChart rows={filteredRows} />
                  </article>
                  <article className="insight-card">
                    <div className="insight-heading">
                      <span>
                        <Icon name="info" size={20} />
                      </span>
                      <div>
                        <small>AUTOMATED ANALYSIS</small>
                        <h3>Insight & Findings</h3>
                      </div>
                    </div>
                    {rows.length ? (
                      <ul>
                        <li>
                          <span>01</span>Rata-rata sistolik pada filter aktif adalah{" "}
                          <strong>{formatNumber(systolic ?? 0, 1)} mmHg</strong>.
                        </li>
                        <li>
                          <span>02</span>
                          {analysisSummary.systolicChange !== null &&
                            analysisSummary.youngestAge !== analysisSummary.oldestAge ? (
                            <>
                              Sistolik meningkat{" "}
                              <strong>{formatNumber(analysisSummary.systolicChange, 1)} mmHg</strong>{" "}
                              dari usia {analysisSummary.youngestAge} ke {analysisSummary.oldestAge}.
                            </>
                          ) : (
                            <>
                              Diastolik berbobot tercatat{" "}
                              <strong>{formatNumber(diastolic ?? 0, 1)} mmHg</strong>.
                            </>
                          )}
                        </li>
                        <li>
                          <span>03</span>
                          {analysisSummary.genderGap !== null ? (
                            <>
                              Sistolik {analysisSummary.higherGender} lebih tinggi{" "}
                              <strong>{formatNumber(analysisSummary.genderGap, 1)} mmHg</strong>{" "}
                              secara rata-rata berbobot.
                            </>
                          ) : (
                            <>Perbandingan gender mengikuti filter yang sedang aktif.</>
                          )}
                        </li>
                        <li>
                          <span>04</span>Kelompok usia terbesar adalah{" "}
                          <strong>usia {analysisSummary.largestGroup?.age}</strong> dengan{" "}
                          {formatNumber(analysisSummary.largestGroup?.count ?? 0)} responden.
                        </li>
                        <li>
                          <span>05</span>Sistolik tertinggi tercatat pada{" "}
                          <strong>
                            {analysisSummary.highestSystolic?.sex}, usia{" "}
                            {analysisSummary.highestSystolic?.age}
                          </strong>{" "}
                          ({formatNumber(analysisSummary.highestSystolic?.systolic ?? 0, 1)} mmHg).
                        </li>
                        <li>
                          <span>06</span>
                          <strong>Crossover Point Usia 70:</strong> Mulai usia 70 tahun, sistolik wanita (129,9 mmHg) menyalip pria (129,3 mmHg) hingga usia 85 tahun (131,9 vs 130,6 mmHg) akibat peningkatan kekakuan vaskular pasca-menopause.
                        </li>
                      </ul>
                    ) : (
                      <div className="insight-empty">
                        <strong>Insight akan dibuat dari data aktual</strong>
                        <p>
                          Pola kenaikan, perbedaan gender, dan kelompok usia tertinggi hanya
                          ditampilkan setelah dataset tersedia.
                        </p>
                      </div>
                    )}
                  </article>
                </div>
              </section>
            )}

            {/* Interactive Blood Pressure Simulator & Risk Comparator (WOW Widget) */}
            {(activeNav === "Overview" || activeNav === "Blood Pressure Analysis") && (
              <BloodPressureSimulator rows={rows} />
            )}

            {activeNav === "Blood Pressure Analysis" && (
              <section className="dashboard-section">
                <SectionHeader
                  eyebrow="1.6 PROFIL BIOMARKER TERATAS SHAP"
                  title="Profil Rata-Rata 5 Indikator Teratas per Kategori"
                  description="Rerata usia, lingkar pinggang, gamma-GTP, gula darah puasa (BLDS), dan trigliserida sepanjang 4 kategori klinis."
                />
                <BiomarkerComparisonChart />
              </section>
            )}
            {(activeNav === "Overview" || activeNav === "Blood Pressure Analysis") && (
              <BloodPressureSimulator rows={rows} />
            )}

            {activeNav === "Data Distribution" && (
              <section className="dashboard-section distribution-page">
                <SectionHeader
                  eyebrow="POPULATION DENSITY"
                  title="Distribution Profile"
                  description="Kepadatan responden dan rentang indikator pada dataset aktif."
                  action={
                    <div className="legend">
                      <span>
                        <i className="female" />
                        Female
                      </span>
                      <span>
                        <i className="male" />
                        Male
                      </span>
                    </div>
                  }
                />
                <div className="distribution-stats">
                  <article>
                    <span>AGE COVERAGE</span>
                    <strong>
                      {Math.min(...filteredRows.map((row) => row.age))}–
                      {Math.max(...filteredRows.map((row) => row.age))}
                    </strong>
                    <small>tahun · interval 5 tahun</small>
                  </article>
                  <article>
                    <span>SYSTOLIC RANGE</span>
                    <strong>
                      {formatNumber(Math.min(...filteredRows.map((row) => row.systolic)), 1)}–
                      {formatNumber(Math.max(...filteredRows.map((row) => row.systolic)), 1)}
                    </strong>
                    <small>mmHg pada data terfilter</small>
                  </article>
                  <article>
                    <span>DIASTOLIC RANGE</span>
                    <strong>
                      {formatNumber(Math.min(...filteredRows.map((row) => row.diastolic)), 1)}–
                      {formatNumber(Math.max(...filteredRows.map((row) => row.diastolic)), 1)}
                    </strong>
                    <small>mmHg pada data terfilter</small>
                  </article>
                  <article>
                    <span>ACTIVE POPULATION</span>
                    <strong>
                      {formatNumber(filteredRows.reduce((sum, row) => sum + row.count, 0))}
                    </strong>
                    <small>responden terpilih</small>
                  </article>
                </div>
                <div className="distribution-grid">
                  <article className="chart-card">
                    <div className="card-title">
                      <div>
                        <h3>Population Frequency</h3>
                        <p>Distribusi jumlah responden per kelompok usia</p>
                      </div>
                      <span className="unit">People</span>
                    </div>
                    <PopulationChart rows={filteredRows} />
                  </article>
                  <article className="chart-card">
                    <div className="card-title">
                      <div>
                        <h3>Pressure Distribution Trend</h3>
                        <p>Rentang tekanan sistolik sepanjang usia (Arahkan kursor utk detail)</p>
                      </div>
                      <span className="unit">mmHg</span>
                    </div>
                    <LineChart
                      rows={filteredRows}
                      metric="systolic"
                      activeAge={selectedAge}
                      onSelectAge={setSelectedAge}
                    />
                  </article>
                </div>
              </section>
            )}

            {activeNav === "Model Evaluation & SHAP" && (
              <section className="dashboard-section">
                <SectionHeader
                  eyebrow="PAKET 2 — EVALUASI MODEL & EXPLAINABLE ML"
                  title="Rekapitulasi Hasil Evaluasi Model & Interpretabilitas SHAP"
                  description="Benchmark model klasifikasi 4-kelas pada 198.270 data uji (split 80:20), Confusion Matrix, Uji Ablasi 5.000 Paired Bootstrap, Evaluasi Subkelompok, dan Peringkat Top 20 Fitur SHAP."
                />
                <ModelBenchmarkSection />
              </section>
            )}

            {activeNav === "Dataset Summary" && (
              <section className="dashboard-section">
                <SectionHeader
                  eyebrow="2.1 AUDIT DATASET & PREPROCESSING"
                  title="Audit Integritas Data, Nilai Sentinel & Skema Split"
                  description="Spesifikasi teknis dataset (991.346 baris × 24 kolom), verifikasi hash SHA-256, penanganan nilai sentinel tanpa kebocoran data (data leakage), dan pembagian 80:20 stratified split."
                />
                <DataAuditSection />
              </section>
            )}

            {activeNav !== "About Dataset" && activeNav !== "Model Evaluation & SHAP" && (
              <section className="dashboard-section table-section" id="dataset-summary-table">
                <SectionHeader
                  eyebrow="DATASET TABLE & SUMMARY"
                  title="Tabel Data Agregat & Ringkasan"
                  description="Tabel 28 kelompok data agregat berdasarkan usia dan jenis kelamin dengan kalkulasi rata-rata berbobot (weighted average) sistolik dan diastolik."
                  action={
                    <div className="table-header-actions">
                      <button className="button secondary sm" onClick={exportTableCsv}>
                        <Icon name="download" size={15} />
                        Export Tabel CSV
                      </button>
                    </div>
                  }
                />

                <div className="table-summary-cards">
                  <article className="table-summary-card">
                    <div className="tsc-icon blue">
                      <Icon name="users" size={19} />
                    </div>
                    <div className="tsc-info">
                      <span className="tsc-label">TOTAL POPULASI AKTIF</span>
                      <strong className="tsc-value">{formatNumber(tableSummary.totalCount)}</strong>
                      <span className="tsc-desc">
                        {formatNumber(tableSummary.femaleCount)} P ({tableSummary.femalePercent.toFixed(1)}%) · {formatNumber(tableSummary.maleCount)} L ({tableSummary.malePercent.toFixed(1)}%)
                      </span>
                    </div>
                  </article>

                  <article className="table-summary-card">
                    <div className="tsc-icon teal">
                      <Icon name="activity" size={19} />
                    </div>
                    <div className="tsc-info">
                      <span className="tsc-label">AVG. SISTOLIK BERBOBOT</span>
                      <strong className="tsc-value">
                        {tableSummary.weightedSys !== null
                          ? formatNumber(tableSummary.weightedSys, 1)
                          : "—"}{" "}
                        <small>mmHg</small>
                      </strong>
                      <span className="tsc-desc">Σ (Sistolik × Jiwa) / Total Jiwa</span>
                    </div>
                  </article>

                  <article className="table-summary-card">
                    <div className="tsc-icon orange">
                      <Icon name="heart" size={19} />
                    </div>
                    <div className="tsc-info">
                      <span className="tsc-label">AVG. DIASTOLIK BERBOBOT</span>
                      <strong className="tsc-value">
                        {tableSummary.weightedDia !== null
                          ? formatNumber(tableSummary.weightedDia, 1)
                          : "—"}{" "}
                        <small>mmHg</small>
                      </strong>
                      <span className="tsc-desc">Σ (Diastolik × Jiwa) / Total Jiwa</span>
                    </div>
                  </article>

                  <article className="table-summary-card">
                    <div className="tsc-icon violet">
                      <Icon name="database" size={19} />
                    </div>
                    <div className="tsc-info">
                      <span className="tsc-label">TOTAL KELOMPOK DATA</span>
                      <strong className="tsc-value">{tableSummary.totalRows} Kelompok</strong>
                      <span className="tsc-desc">
                        Rentang usia {tableSummary.minAge}–{tableSummary.maxAge} tahun
                      </span>
                    </div>
                  </article>
                </div>

                <div className="table-card">
                  <div className="table-toolbar">
                    <div className="search-box">
                      <Icon name="search" size={17} />
                      <input
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setPage(1);
                        }}
                        placeholder="Cari sex atau usia..."
                      />
                    </div>
                    <div className="table-source">
                      <span className={rows.length ? "ready" : ""} />
                      {rows.length ? fileName : "Dataset belum dimuat"}
                    </div>
                  </div>

                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: 45 }}>#</th>
                          {(
                            [
                              ["sex", "Jenis Kelamin (Sex)"],
                              ["age", "Usia (Age)"],
                              ["count", "Jumlah Orang (Populasi)"],
                              ["systolic", "Rata-rata Sistolik"],
                              ["diastolic", "Rata-rata Diastolik"],
                            ] as [SortKey, string][]
                          ).map(([key, label]) => (
                            <th key={key} onClick={() => handleSort(key)}>
                              {label}
                              <span className={sortKey === key ? "sorted" : ""}>↕</span>
                            </th>
                          ))}
                          <th>Klasifikasi Klinis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRows.length ? (
                          visibleRows.map((row, index) => {
                            const rowNum =
                              (perPage === 28 ? 0 : (page - 1) * perPage) + index + 1;
                            const popPercent = totalPopulation
                              ? ((row.count / totalPopulation) * 100).toFixed(1)
                              : "0";
                            const isHighSys = row.systolic >= 130;
                            const isPreSys = row.systolic >= 120 && row.systolic < 130;
                            const isPreDia = row.diastolic >= 80;

                            return (
                              <tr
                                key={`${row.sex}-${row.age}-${index}`}
                                className={`table-row-clickable ${selectedAge === row.age ? "table-row-active" : ""
                                  }`}
                                onClick={() => setSelectedAge(selectedAge === row.age ? null : row.age)}
                                title="Klik baris untuk memfokuskan kelompok usia ini pada grafik"
                              >
                                <td>
                                  <span className="row-num">{rowNum}</span>
                                </td>
                                <td>
                                  <span className={`sex-badge ${row.sex.toLowerCase()}`}>
                                    <i />
                                    <strong>{row.sex}</strong>
                                    <small style={{ color: "#7f94a4" }}>
                                      ({row.sex === "Female" ? "Perempuan" : "Laki-laki"})
                                    </small>
                                  </span>
                                </td>
                                <td>
                                  <strong>{row.age}</strong> tahun
                                </td>
                                <td>
                                  <div className="table-pop-cell">
                                    <strong>{formatNumber(row.count)}</strong>
                                    <div className="table-bar-track">
                                      <div
                                        className={`table-bar-fill ${row.sex.toLowerCase()}`}
                                        style={{
                                          width: `${Math.min(100, (row.count / 71000) * 100)}%`,
                                        }}
                                      />
                                    </div>
                                    <small>{popPercent}% dari total populasi</small>
                                  </div>
                                </td>
                                <td>
                                  <div className="table-metric-cell">
                                    <strong
                                      className={
                                        isHighSys
                                          ? "text-danger"
                                          : isPreSys
                                            ? "text-warning"
                                            : "text-teal"
                                      }
                                    >
                                      {formatNumber(row.systolic, 1)}
                                    </strong>
                                    <small>mmHg</small>
                                  </div>
                                </td>
                                <td>
                                  <div className="table-metric-cell">
                                    <strong className={isPreDia ? "text-warning" : "text-blue"}>
                                      {formatNumber(row.diastolic, 1)}
                                    </strong>
                                    <small>mmHg</small>
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className={`status-pill ${isHighSys
                                      ? "high"
                                      : isPreSys || isPreDia
                                        ? "elevated"
                                        : "normal"
                                      }`}
                                  >
                                    {isHighSys
                                      ? "Hipertensi Stg 1"
                                      : isPreSys || isPreDia
                                        ? "Prehipertensi"
                                        : "Normal / Optimal"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7}>
                              <div className="table-empty">
                                <span>
                                  <Icon name="file" size={22} />
                                </span>
                                <strong>Belum ada data untuk ditampilkan</strong>
                                <small>Impor dataset CSV atau ubah filter aktif.</small>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                      {visibleRows.length > 0 && (
                        <tfoot>
                          <tr className="summary-footer-row">
                            <td colSpan={2}>
                              <div className="summary-foot-title">
                                <Icon name="database" size={17} />
                                <div>
                                  <strong>TOTAL & RATA-RATA BERBOBOT</strong>
                                  <small>Ringkasan {tableSummary.totalRows} kelompok agregat</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong>{tableSummary.minAge}–{tableSummary.maxAge}</strong> tahun
                            </td>
                            <td>
                              <div className="table-pop-cell">
                                <strong className="text-primary">
                                  {formatNumber(tableSummary.totalCount)}
                                </strong>
                                <small>100% data terfilter</small>
                              </div>
                            </td>
                            <td>
                              <div className="table-metric-cell">
                                <strong className="text-teal-bold">
                                  {tableSummary.weightedSys !== null
                                    ? formatNumber(tableSummary.weightedSys, 1)
                                    : "—"}
                                </strong>
                                <small>mmHg</small>
                                <span className="weighted-sub">Weighted Avg</span>
                              </div>
                            </td>
                            <td>
                              <div className="table-metric-cell">
                                <strong className="text-blue-bold">
                                  {tableSummary.weightedDia !== null
                                    ? formatNumber(tableSummary.weightedDia, 1)
                                    : "—"}
                                </strong>
                                <small>mmHg</small>
                                <span className="weighted-sub">Weighted Avg</span>
                              </div>
                            </td>
                            <td>
                              <span className="status-pill aggregate">Ringkasan Agregat</span>
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>

                  <div className="pagination">
                    <div className="pagination-info">
                      <span>
                        Menampilkan {visibleRows.length} dari {tableRows.length} baris
                      </span>
                      <div className="per-page-selector">
                        <span>Tampilkan:</span>
                        {[5, 10, 14, 28].map((size) => (
                          <button
                            key={size}
                            type="button"
                            className={`size-btn ${perPage === size ? "active" : ""}`}
                            onClick={() => {
                              setPerPage(size);
                              setPage(1);
                            }}
                          >
                            {size === 28 ? "Semua (28)" : size}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pagination-controls">
                      <button disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
                        Sebelumnya
                      </button>
                      <b>
                        {page} / {pageCount}
                      </b>
                      <button
                        disabled={page === pageCount}
                        onClick={() => setPage((value) => value + 1)}
                      >
                        Berikutnya
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeNav === "About Dataset" && (
              <section className="about-page">
                <AuthorsTeamCard />
                <div className="about-hero">
                  <div className="about-mark">
                    <Icon name="activity" size={30} />
                  </div>
                  <div>
                    <span>BIG DATA COURSE PROJECT</span>
                    <h2>Blood Pressure Dataset</h2>
                    <p>
                      Dataset agregat untuk mempelajari hubungan usia, jenis kelamin, dan perubahan
                      tekanan darah pada populasi berjumlah 991.346 responden.
                    </p>
                  </div>
                </div>
                <div className="about-grid">
                  <article className="about-card">
                    <span className="about-icon">
                      <Icon name="database" size={20} />
                    </span>
                    <h3>Dataset Scope</h3>
                    <p>
                      28 kelompok agregat dari dua kategori jenis kelamin dan 14 titik usia, mulai 20
                      hingga 85 tahun.
                    </p>
                    <dl>
                      <div>
                        <dt>Population</dt>
                        <dd>991.346</dd>
                      </div>
                      <div>
                        <dt>Features</dt>
                        <dd>24</dd>
                      </div>
                      <div>
                        <dt>Age interval</dt>
                        <dd>5 tahun</dd>
                      </div>
                    </dl>
                  </article>
                  <article className="about-card">
                    <span className="about-icon teal">
                      <Icon name="file" size={20} />
                    </span>
                    <h3>Summary Fields</h3>
                    <p>
                      Dashboard memakai lima atribut ringkasan utama untuk seluruh kalkulasi dan
                      visualisasi.
                    </p>
                    <ul className="field-list">
                      <li>
                        <code>sex</code>
                        <span>Female atau Male</span>
                      </li>
                      <li>
                        <code>age</code>
                        <span>Usia responden</span>
                      </li>
                      <li>
                        <code>jumlah_orang</code>
                        <span>Bobot populasi</span>
                      </li>
                      <li>
                        <code>rata_sistolik</code>
                        <span>Tekanan sistolik</span>
                      </li>
                      <li>
                        <code>rata_diastolik</code>
                        <span>Tekanan diastolik</span>
                      </li>
                    </ul>
                  </article>
                  <article className="about-card">
                    <span className="about-icon violet">
                      <Icon name="chart" size={20} />
                    </span>
                    <h3>Methodology</h3>
                    <p>
                      Rata-rata keseluruhan dihitung menggunakan weighted average agar setiap kelompok
                      berkontribusi sesuai jumlah responden.
                    </p>
                    <div className="formula">
                      <small>WEIGHTED AVERAGE</small>
                      <strong>Σ (nilai × jumlah orang) / Σ jumlah orang</strong>
                    </div>
                  </article>
                  <article className="about-card">
                    <span className="about-icon orange">
                      <Icon name="info" size={20} />
                    </span>
                    <h3>Interpretation Notes</h3>
                    <p>
                      Data bersifat agregat. Dashboard menunjukkan pola populasi, bukan diagnosis
                      klinis individu.
                    </p>
                    <ul className="notes-list">
                      <li>Semua tekanan ditampilkan dalam mmHg.</li>
                      <li>Filter mengubah basis weighted average.</li>
                      <li>Nilai tidak tersedia tidak diestimasi.</li>
                    </ul>
                  </article>
                </div>

                <section className="dashboard-section" style={{ marginTop: 32 }}>
                  <SectionHeader
                    eyebrow="2.1 AUDIT DATASET & PREPROCESSING"
                    title="Audit Integritas Data, Nilai Sentinel & Skema Split"
                    description="Spesifikasi teknis dataset (991.346 baris × 24 kolom), verifikasi hash kriptografi SHA-256, penanganan nilai sentinel tanpa kebocoran data, dan skema validasi 80:20."
                  />
                  <DataAuditSection />
                </section>
              </section>
            )}
          </div>

          <footer>
            <span>BIGDATA INSIGHT</span>
            <p>Blood Pressure Dataset Analytics · Academic Project</p>
            <small>Data integrity first — no unavailable statistics are estimated.</small>
          </footer>
        </div>
      </main>
    </div>
  );
}
