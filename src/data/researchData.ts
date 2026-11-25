export interface AuthorInfo {
  name: string;
  nim: string;
  role: string;
}

export interface ResearchMeta {
  institution: string;
  faculty: string;
  program: string;
  projectTitle: string;
  subTitle: string;
  academicYear: string;
  authors: AuthorInfo[];
  datasetHash: string;
  totalRecordsRaw: number;
  duplicatesRemoved: number;
  totalRecords: number;
  totalFeatures: number;
  trainRecords: number;
  testRecords: number;
  splitRatio: string;
  splitSeed: number;
  sentinelTotal: number;
  sentinelRows: number;
  sentinelPct: number;
  qwk: number;
  adjacentErrors: number;
  totalErrors: number;
  adjacentErrorPct: number;
}

export const RESEARCH_META: ResearchMeta = {
  institution: "Universitas Negeri Surabaya (UNESA)",
  faculty: "Fakultas Teknik",
  program: "S1 Teknik Informatika",
  projectTitle: "Rekapitulasi Hasil Olah Data & Evaluasi Model Klasifikasi Kategori Tekanan Darah",
  subTitle: "Explainable Machine Learning & Big Data Analytics",
  academicYear: "2024/2025",
  authors: [
    { name: "Farid Ade Novian", nim: "25051204327", role: "Model Architecture & Visual Analytics" },
    { name: "Farid Hanif Fathan", nim: "25051204364", role: "Data Pipeline & Feature Engineering" },
    { name: "Kevin Dzaky Hendratama", nim: "25051204293", role: "Statistical Validation & SHAP Explainability" },
  ],
  datasetHash: "0a90c42e343e720fe119eb77b6c1ae2b9bfdcba9f5a1227f18f1e6ce59358e38",
  totalRecordsRaw: 991346,
  duplicatesRemoved: 26,
  totalRecords: 991320,
  totalFeatures: 22,
  trainRecords: 793056,
  testRecords: 198264,
  splitRatio: "80:20 Stratified",
  splitSeed: 42,
  sentinelTotal: 7125,
  sentinelRows: 6620,
  sentinelPct: 0.668,
  qwk: 0.3761,
  adjacentErrors: 55304,
  totalErrors: 111381,
  adjacentErrorPct: 49.65,
};

export interface SentinelBreakdown {
  feature: string;
  sentinelValue: string;
  rowCount: number;
  action: string;
}

export const SENTINEL_DATA: SentinelBreakdown[] = [
  { feature: "sight_left", sentinelValue: "9,9", rowCount: 3118, action: "Konversi ke NaN -> Median Imputation" },
  { feature: "sight_right", sentinelValue: "9,9", rowCount: 3111, action: "Konversi ke NaN -> Median Imputation" },
  { feature: "urine_protein", sentinelValue: "6", rowCount: 512, action: "Konversi ke NaN -> Median Imputation" },
  { feature: "gamma_GTP", sentinelValue: "999", rowCount: 239, action: "Konversi ke NaN -> Median Imputation" },
  { feature: "height", sentinelValue: "130", rowCount: 86, action: "Konversi ke NaN -> Median Imputation" },
  { feature: "waistline", sentinelValue: "999 / 8", rowCount: 58, action: "Konversi ke NaN -> Median Imputation" },
  { feature: "SGOT_AST", sentinelValue: "9999", rowCount: 1, action: "Konversi ke NaN -> Median Imputation" },
];

export interface BPCategory {
  key: string;
  name: string;
  criteria: string;
  count: number;
  percent: number;
  color: string;
  bgLight: string;
  badgeClass: string;
}

export const BP_CATEGORIES: BPCategory[] = [
  {
    key: "normal",
    name: "Normal",
    criteria: "SBP < 120 dan DBP < 80 mmHg",
    count: 390072,
    percent: 39.35,
    color: "#10b981", // emerald
    bgLight: "#ecfdf5",
    badgeClass: "badge-normal",
  },
  {
    key: "prahipertensi",
    name: "Prahipertensi",
    criteria: "SBP 130–139 atau DBP 80–89 mmHg",
    count: 341146,
    percent: 34.41,
    color: "#f59e0b", // amber
    bgLight: "#fffbeb",
    badgeClass: "badge-prahipertensi",
  },
  {
    key: "meningkat",
    name: "Tekanan Darah Meningkat",
    criteria: "SBP 120–129 dan DBP < 80 mmHg",
    count: 132910,
    percent: 13.41,
    color: "#0ea5e9", // sky
    bgLight: "#f0f9ff",
    badgeClass: "badge-meningkat",
  },
  {
    key: "hipertensi",
    name: "Hipertensi Terukur",
    criteria: "SBP ≥ 140 atau DBP ≥ 90 mmHg",
    count: 127192,
    percent: 12.83,
    color: "#ef4444", // rose
    bgLight: "#fef2f2",
    badgeClass: "badge-hipertensi",
  },
];

export interface HypertensionAgeGroup {
  ageRange: string;
  totalRespondents: number;
  hypertensiveCount: number;
  prevalencePercent: number;
  relativeRisk: string;
}

export const HYPERTENSION_BY_AGE: HypertensionAgeGroup[] = [
  { ageRange: "< 40 tahun", totalRespondents: 248667, hypertensiveCount: 13798, prevalencePercent: 5.55, relativeRisk: "1.0x (Baseline)" },
  { ageRange: "40–49 tahun", totalRespondents: 248740, hypertensiveCount: 25588, prevalencePercent: 10.29, relativeRisk: "1.85x vs Muda" },
  { ageRange: "50–59 tahun", totalRespondents: 240657, hypertensiveCount: 32852, prevalencePercent: 13.65, relativeRisk: "2.46x vs Muda" },
  { ageRange: "60+ tahun", totalRespondents: 253282, hypertensiveCount: 54958, prevalencePercent: 21.70, relativeRisk: "3.91x vs Muda" },
];

export interface LifestyleGroup {
  label: string;
  category: "Merokok" | "Alkohol";
  code: string;
  total: number;
  normalPct: number;
  meningkatPct: number;
  prahipertensiPct: number;
  hipertensiPct: number;
  highlight?: string;
}

export const LIFESTYLE_BP_DATA: LifestyleGroup[] = [
  {
    label: "Tidak Pernah Merokok",
    category: "Merokok",
    code: "SMK = 1",
    total: 602441,
    normalPct: 43.67,
    meningkatPct: 13.43,
    prahipertensiPct: 30.93,
    hipertensiPct: 11.97,
  },
  {
    label: "Mantan Perokok",
    category: "Merokok",
    code: "SMK = 2",
    total: 174951,
    normalPct: 29.92,
    meningkatPct: 13.66,
    prahipertensiPct: 40.55,
    hipertensiPct: 15.86,
    highlight: "Hipertensi tertinggi (15,86%) — Reverse Causality",
  },
  {
    label: "Perokok Aktif",
    category: "Merokok",
    code: "SMK = 3",
    total: 213954,
    normalPct: 34.88,
    meningkatPct: 13.12,
    prahipertensiPct: 39.21,
    hipertensiPct: 12.79,
  },
  {
    label: "Tidak Minum Alkohol",
    category: "Alkohol",
    code: "DRK = N",
    total: 495858,
    normalPct: 41.26,
    meningkatPct: 14.03,
    prahipertensiPct: 32.02,
    hipertensiPct: 12.69,
  },
  {
    label: "Minum Alkohol",
    category: "Alkohol",
    code: "DRK = Y",
    total: 495488,
    normalPct: 37.44,
    meningkatPct: 12.78,
    prahipertensiPct: 36.81,
    hipertensiPct: 12.97,
  },
];

export interface BiomarkerProfile {
  category: string;
  age: number;
  waistline: number;
  gamma_GTP: number;
  BLDS: number;
  triglyceride: number;
}

export const BIOMARKER_PROFILES: BiomarkerProfile[] = [
  {
    category: "Normal",
    age: 43.83,
    waistline: 77.58,
    gamma_GTP: 28.39,
    BLDS: 95.95,
    triglyceride: 111.35,
  },
  {
    category: "Tekanan Darah Meningkat",
    age: 48.71,
    waistline: 81.54,
    gamma_GTP: 34.57,
    BLDS: 100.45,
    triglyceride: 128.21,
  },
  {
    category: "Prahipertensi",
    age: 48.89,
    waistline: 83.40,
    gamma_GTP: 42.29,
    BLDS: 102.68,
    triglyceride: 146.25,
  },
  {
    category: "Hipertensi Terukur",
    age: 54.68,
    waistline: 85.90,
    gamma_GTP: 51.03,
    BLDS: 108.09,
    triglyceride: 162.18,
  },
];

export interface ModelBenchmark {
  model: string;
  accuracy: number;
  balancedAcc: number;
  macroF1: number;
  note: string;
  isBest?: boolean;
  isAblation?: boolean;
}

export const MODEL_BENCHMARKS: ModelBenchmark[] = [
  {
    model: "Random Forest (Semua Fitur)",
    accuracy: 43.82,
    balancedAcc: 39.25,
    macroF1: 36.57,
    note: "Model utama terbaik (skema 4 kelas) dengan class_weight balanced_subsample. QWK: 0,3761",
    isBest: true,
  },
  {
    model: "RF tanpa Merokok & Alkohol",
    accuracy: 43.86,
    balancedAcc: 39.19,
    macroF1: 36.57,
    note: "Uji ablasi dengan konfigurasi identik; selisih macro F1 = 0,0000 (tidak berbeda secara signifikan)",
    isAblation: true,
  },
  {
    model: "Logistic Regression (balanced)",
    accuracy: 41.11,
    balancedAcc: 39.12,
    macroF1: 35.42,
    note: "Model linear multikelas dengan penyeimbangan bobot kelas",
  },
  {
    model: "XGBoost (tanpa pembobotan)",
    accuracy: 49.55,
    balancedAcc: 34.60,
    macroF1: 31.19,
    note: "Akurasi semu tinggi namun gagal total pada minoritas (recall meningkat = 0,00)",
  },
  {
    model: "Logistic Regression (tanpa bobot)",
    accuracy: 48.95,
    balancedAcc: 34.00,
    macroF1: 30.57,
    note: "Bias ekstrem ke kelas mayoritas (recall meningkat = 0,00)",
  },
  {
    model: "Dummy Classifier (Baseline)",
    accuracy: 39.35,
    balancedAcc: 25.00,
    macroF1: 14.12,
    note: "Acuan tebakan acak mayoritas (selalu memprediksi kelas 'Normal')",
  },
  {
    model: "Uji Sensitivitas RF (3 Kelas)",
    accuracy: 52.01,
    balancedAcc: 49.77,
    macroF1: 47.34,
    note: "Kelas 'Tekanan darah meningkat' dilebur ke Normal untuk menguji batas separabilitas",
  },
];

export interface ConfusionMatrixRow {
  actualClass: string;
  support: number;
  precision: number;
  recall: number;
  f1: number;
  preds: {
    normal: number;
    meningkat: number;
    prahipertensi: number;
    hipertensi: number;
  };
}

export const RF_CONFUSION_MATRIX: ConfusionMatrixRow[] = [
  {
    actualClass: "Normal",
    support: 78015,
    precision: 0.60,
    recall: 0.59,
    f1: 0.60,
    preds: { normal: 46211, meningkat: 4959, prahipertensi: 17266, hipertensi: 9579 },
  },
  {
    actualClass: "Tekanan darah meningkat",
    support: 26582,
    precision: 0.18,
    recall: 0.09,
    f1: 0.12,
    preds: { normal: 9424, meningkat: 2363, prahipertensi: 7948, hipertensi: 6847 },
  },
  {
    actualClass: "Prahipertensi",
    support: 68229,
    precision: 0.43,
    recall: 0.37,
    f1: 0.40,
    preds: { normal: 17752, meningkat: 4613, prahipertensi: 25042, hipertensi: 20822 },
  },
  {
    actualClass: "Hipertensi terukur",
    support: 25438,
    precision: 0.26,
    recall: 0.52,
    f1: 0.35,
    preds: { normal: 3161, meningkat: 1472, prahipertensi: 7538, hipertensi: 13267 },
  },
];

export interface BootstrapAblationResult {
  metric: string;
  withLifestyle: number;
  withoutLifestyle: number;
  delta: number;
  deltaFormatted: string;
}

export const BOOTSTRAP_ABLATION: {
  results: BootstrapAblationResult[];
  iterations: number;
  testSamples: number;
  ci95: [number, number];
  pValue: number;
  decision: string;
  explanation: string;
} = {
  iterations: 5000,
  testSamples: 198264,
  ci95: [-0.0015, 0.0014],
  pValue: 0.5002,
  decision: "H0 tidak tertolak (p = 0.5002 > 0.05, selisih tidak terbukti secara statistik)",
  explanation:
    "Karena 95% Confidence Interval [-0,0015, +0,0014] memuat angka nol dan p(Δ ≤ 0) = 0,5002, penambahan kebiasaan merokok (SMK_stat_type_cd) dan alkohol (DRK_YN) tidak terbukti memberikan peningkatan performa secara signifikan terhadap model Random Forest. Hal ini menegaskan bahwa sinyal risiko dari gaya hidup telah dimediasi sepenuhnya oleh biomarker metabolik seperti gamma_GTP, SGOT_AST, dan profil trigliserida.",
  results: [
    { metric: "Accuracy", withLifestyle: 43.82, withoutLifestyle: 43.86, delta: -0.0004, deltaFormatted: "-0,04%" },
    { metric: "Balanced Accuracy", withLifestyle: 39.25, withoutLifestyle: 39.19, delta: 0.0006, deltaFormatted: "+0,06%" },
    { metric: "Macro F1 (Metrik Utama)", withLifestyle: 36.57, withoutLifestyle: 36.57, delta: 0.0000, deltaFormatted: "+0,00%" },
  ],
};

export interface SubgroupItem {
  subgroup: string;
  category: "Gender" | "Usia" | "Merokok" | "Alkohol";
  n: number;
  accuracy: number;
  balancedAcc: number;
  macroF1: number;
}

export const SUBGROUP_RESULTS: SubgroupItem[] = [
  { subgroup: "Perempuan (Female)", category: "Gender", n: 93112, accuracy: 48.62, balancedAcc: 39.14, macroF1: 33.94 },
  { subgroup: "Laki-laki (Male)", category: "Gender", n: 105152, accuracy: 39.58, balancedAcc: 35.59, macroF1: 33.53 },
  { subgroup: "< 40 tahun", category: "Usia", n: 49826, accuracy: 56.35, balancedAcc: 38.88, macroF1: 39.12 },
  { subgroup: "40–49 tahun", category: "Usia", n: 49714, accuracy: 49.94, balancedAcc: 37.13, macroF1: 35.42 },
  { subgroup: "50–59 tahun", category: "Usia", n: 48051, accuracy: 40.51, balancedAcc: 34.77, macroF1: 33.19 },
  { subgroup: "60+ tahun", category: "Usia", n: 50673, accuracy: 28.64, balancedAcc: 31.11, macroF1: 25.19 },
  { subgroup: "Tidak Pernah Merokok (SMK=1)", category: "Merokok", n: 120542, accuracy: 45.99, balancedAcc: 39.92, macroF1: 36.12 },
  { subgroup: "Mantan Perokok (SMK=2)", category: "Merokok", n: 35022, accuracy: 38.98, balancedAcc: 35.41, macroF1: 33.19 },
  { subgroup: "Perokok Aktif (SMK=3)", category: "Merokok", n: 42700, accuracy: 41.67, balancedAcc: 35.77, macroF1: 34.03 },
  { subgroup: "Tidak Minum Alkohol (DRK=N)", category: "Alkohol", n: 99273, accuracy: 42.70, balancedAcc: 39.01, macroF1: 35.37 },
  { subgroup: "Minum Alkohol (DRK=Y)", category: "Alkohol", n: 98991, accuracy: 44.94, balancedAcc: 38.97, macroF1: 36.80 },
];

export interface ShapFeature {
  rank: number;
  feature: string;
  label: string;
  meanShap: number;
  category: "Demografi" | "Antropometri" | "Biomarker Enzim" | "Metabolik & Darah" | "Profil Lipid" | "Gaya Hidup" | "Pemeriksaan Fisik";
}

export const TOP20_SHAP: ShapFeature[] = [
  { rank: 1, feature: "num__age", label: "Usia (Age)", meanShap: 0.02994, category: "Demografi" },
  { rank: 2, feature: "num__waistline", label: "Lingkar Pinggang (Waistline)", meanShap: 0.02447, category: "Antropometri" },
  { rank: 3, feature: "num__gamma_GTP", label: "gamma-GTP (Enzim Hati/Metabolik)", meanShap: 0.01762, category: "Biomarker Enzim" },
  { rank: 4, feature: "num__BLDS", label: "Gula Darah Puasa (BLDS)", meanShap: 0.01731, category: "Metabolik & Darah" },
  { rank: 5, feature: "num__triglyceride", label: "Trigliserida", meanShap: 0.01344, category: "Profil Lipid" },
  { rank: 6, feature: "num__weight", label: "Berat Badan (Weight)", meanShap: 0.01237, category: "Antropometri" },
  { rank: 7, feature: "num__hemoglobin", label: "Hemoglobin", meanShap: 0.00998, category: "Metabolik & Darah" },
  { rank: 8, feature: "num__SGOT_AST", label: "SGOT / AST (Enzim Hati)", meanShap: 0.00599, category: "Biomarker Enzim" },
  { rank: 9, feature: "num__height", label: "Tinggi Badan (Height)", meanShap: 0.00587, category: "Antropometri" },
  { rank: 10, feature: "cat__sex_Male", label: "Jenis Kelamin (Laki-laki)", meanShap: 0.00442, category: "Demografi" },
  { rank: 11, feature: "num__sight_left", label: "Penglihatan Kiri (Sight Left)", meanShap: 0.00410, category: "Pemeriksaan Fisik" },
  { rank: 12, feature: "cat__sex_Female", label: "Jenis Kelamin (Perempuan)", meanShap: 0.00388, category: "Demografi" },
  { rank: 13, feature: "num__tot_chole", label: "Total Kolesterol", meanShap: 0.00385, category: "Profil Lipid" },
  { rank: 14, feature: "num__sight_right", label: "Penglihatan Kanan (Sight Right)", meanShap: 0.00363, category: "Pemeriksaan Fisik" },
  { rank: 15, feature: "num__SGOT_ALT", label: "SGOT / ALT (Enzim Hati)", meanShap: 0.00339, category: "Biomarker Enzim" },
  { rank: 16, feature: "num__HDL_chole", label: "HDL Kolesterol (Kolesterol Baik)", meanShap: 0.00311, category: "Profil Lipid" },
  { rank: 17, feature: "num__LDL_chole", label: "LDL Kolesterol (Kolesterol Jahat)", meanShap: 0.00218, category: "Profil Lipid" },
  { rank: 18, feature: "cat__DRK_YN_Y", label: "Konsumsi Alkohol (Ya)", meanShap: 0.00180, category: "Gaya Hidup" },
  { rank: 19, feature: "cat__DRK_YN_N", label: "Konsumsi Alkohol (Tidak)", meanShap: 0.00173, category: "Gaya Hidup" },
  { rank: 20, feature: "cat__urine_protein_1", label: "Protein Urine Negatif (Tingkat 1)", meanShap: 0.00149, category: "Metabolik & Darah" },
];

export interface DiscussionInsight {
  title: string;
  tag: string;
  lead: string;
  content: string;
  clinicalSignificance: string;
}

export const DISCUSSION_INSIGHTS: DiscussionInsight[] = [
  {
    title: "Pemilihan Metrik Utama (Macro F1 vs Accuracy)",
    tag: "Metodologi Evaluasi",
    lead: "Akurasi semu 49,55% pada XGBoost mengabaikan total kelas minoritas.",
    content:
      "XGBoost dan Logistic Regression tanpa pembobotan menghasilkan Accuracy lebih tinggi (49,55% dan 48,95%), namun mengalami 'class collapse' dengan recall 0,00 pada kelas 'Tekanan darah meningkat'. Random Forest dengan class_weight='balanced_subsample' dipilih sebagai model terbaik karena menghasilkan Macro F1 tertinggi (36,57%) serta berhasil menangkap 52% kasus 'Hipertensi terukur' yang merupakan prioritas klinis pencegahan stroke dan infark miokard.",
    clinicalSignificance:
      "Dalam skrining preventif, kegagalan mendeteksi hipertensi membawa risiko mortalitas fatal. Macro F1 memastikan model tidak mengorbankan kelas minoritas demi akurasi semu.",
  },
  {
    title: "Penurunan Akurasi pada Kelompok Lansia (60+)",
    tag: "Confounder Klinis",
    lead: "Macro F1 anjlok dari 39,12% (<40 tahun) menjadi 25,19% pada lansia.",
    content:
      "Performa model mengalami degradasi tajam pada responden berusia 60 tahun ke atas. Penurunan ini mencerminkan adanya variabel perancu (confounding variable) klinis yang tidak terekam dalam dataset rekam medis publik ini, yaitu konsumsi rutin obat antihipertensi (seperti ACE-inhibitor, ARB, atau CCB). Pasien lanjut usia yang secara patologis hipertensif memiliki profil tekanan darah sistolik/diastolik terukur normal semu akibat efek farmakoterapi.",
    clinicalSignificance:
      "Model ML memerlukan fitur riwayat medikasi/resep farmasi untuk klasifikasi akurat pada populasi geriatri.",
  },
  {
    title: "Fenomena Reverse Causality pada Mantan Perokok",
    tag: "Epidemiologi Gaya Hidup",
    lead: "Hipertensi tertinggi justru ditemukan pada mantan perokok (15,86% vs 12,79% perokok aktif).",
    content:
      "Data menunjukkan paradoks di mana mantan perokok memiliki prevalensi hipertensi terukur tertinggi (15,86%), lebih tinggi dari perokok aktif (12,79%) maupun bukan perokok (11,97%). Fenomena ini secara epidemiologis dikenal sebagai reverse causality (kausalitas terbalik): individu memutuskan berhenti merokok setelah menerima diagnosis gangguan kardiovaskular atau komplikasi kesehatan serius, bukan sebaliknya.",
    clinicalSignificance:
      "Analisis cross-sectional harus berhati-hati dalam menginterpretasikan variabel gaya hidup tanpa data temporal riwayat onset penyakit.",
  },
  {
    title: "Crossover Point Tekanan Sistolik di Usia 70 Tahun",
    tag: "Fisiologi Penuaan & Gender",
    lead: "Sistolik wanita menyalip pria mulai usia 70 (129,9 vs 129,3 mmHg) hingga 85 tahun.",
    content:
      "Pada rentang usia 20–65 tahun, rata-rata sistolik pria konsisten melampaui wanita dengan selisih terbesar mencapai 11,2 mmHg pada usia 30. Namun, di usia 70 tahun terjadi persilangan (crossover point) di mana sistolik wanita menyalip pria hingga usia 85 (131,9 vs 130,6 mmHg). Hal ini sejalan dengan perubahan hormonal pasca-menopause (penurunan estrogen), kekakuan arteri (arterial stiffness) yang lebih progresif pada wanita lanjut usia, dan peningkatan sensitivitas garam.",
    clinicalSignificance:
      "Skrining intensif kekakuan arteri dan hipertensi sistolik terisolasi (ISH) sangat krusial bagi populasi wanita di atas 65–70 tahun.",
  },
];
