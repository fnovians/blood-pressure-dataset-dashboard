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
  totalRecords: number;
  totalFeatures: number;
  trainRecords: number;
  testRecords: number;
  splitRatio: string;
  splitSeed: number;
  sentinelTotal: number;
  sentinelRows: number;
  sentinelPct: number;
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
    { name: "Kevin Dzaky Hendrawan", nim: "25051204293", role: "Statistical Validation & SHAP Explainability" },
  ],
  datasetHash: "0a90c42e343e720fe119eb77b6c1ae2b9bfdcba9f5a1227f18f1e6ce59358e38",
  totalRecords: 991346,
  totalFeatures: 24,
  trainRecords: 793076,
  testRecords: 198270,
  splitRatio: "80:20 Stratified",
  splitSeed: 42,
  sentinelTotal: 7125,
  sentinelRows: 6620,
  sentinelPct: 0.668,
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
    count: 390076,
    percent: 39.35,
    color: "#10b981", // emerald
    bgLight: "#ecfdf5",
    badgeClass: "badge-normal",
  },
  {
    key: "prahipertensi",
    name: "Prahipertensi",
    criteria: "SBP 130–139 atau DBP 80–89 mmHg",
    count: 341157,
    percent: 34.41,
    color: "#f59e0b", // amber
    bgLight: "#fffbeb",
    badgeClass: "badge-prahipertensi",
  },
  {
    key: "meningkat",
    name: "Tekanan Darah Meningkat",
    criteria: "SBP 120–129 dan DBP < 80 mmHg",
    count: 132917,
    percent: 13.41,
    color: "#0ea5e9", // sky
    bgLight: "#f0f9ff",
    badgeClass: "badge-meningkat",
  },
  {
    key: "hipertensi",
    name: "Hipertensi Terukur",
    criteria: "SBP ≥ 140 atau DBP ≥ 90 mmHg",
    count: 127196,
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
    accuracy: 43.89,
    balancedAcc: 39.31,
    macroF1: 36.68,
    note: "Model utama terbaik (skema 4 kelas) dengan class_weight balanced_subsample",
    isBest: true,
  },
  {
    model: "RF tanpa Merokok & Alkohol",
    accuracy: 43.77,
    balancedAcc: 39.14,
    macroF1: 36.51,
    note: "Uji ablasi dengan konfigurasi identik untuk menguji signifikansi gaya hidup",
    isAblation: true,
  },
  {
    model: "Logistic Regression (balanced)",
    accuracy: 41.15,
    balancedAcc: 39.13,
    macroF1: 35.39,
    note: "Model linear multikelas dengan penyeimbangan bobot kelas",
  },
  {
    model: "XGBoost (tanpa pembobotan)",
    accuracy: 49.47,
    balancedAcc: 34.54,
    macroF1: 31.17,
    note: "Akurasi semu tinggi namun gagal total pada minoritas (recall meningkat = 0,00)",
  },
  {
    model: "Logistic Regression (tanpa bobot)",
    accuracy: 48.90,
    balancedAcc: 33.93,
    macroF1: 30.48,
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
    accuracy: 51.99,
    balancedAcc: 49.71,
    macroF1: 47.29,
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
    support: 78016,
    precision: 0.60,
    recall: 0.59,
    f1: 0.60,
    preds: { normal: 46227, meningkat: 5148, prahipertensi: 17223, hipertensi: 9418 },
  },
  {
    actualClass: "Tekanan darah meningkat",
    support: 26583,
    precision: 0.18,
    recall: 0.09,
    f1: 0.12,
    preds: { normal: 9538, meningkat: 2409, prahipertensi: 7939, hipertensi: 6697 },
  },
  {
    actualClass: "Prahipertensi",
    support: 68232,
    precision: 0.43,
    recall: 0.37,
    f1: 0.40,
    preds: { normal: 17821, meningkat: 4587, prahipertensi: 25145, hipertensi: 20679 },
  },
  {
    actualClass: "Hipertensi terukur",
    support: 25439,
    precision: 0.26,
    recall: 0.52,
    f1: 0.35,
    preds: { normal: 3153, meningkat: 1437, prahipertensi: 7601, hipertensi: 13248 },
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
  testSamples: 198270,
  ci95: [0.0003, 0.0031],
  pValue: 0.0108,
  decision: "H1 didukung secara statistik (p = 0.0108 < 0.05)",
  explanation:
    "Karena 95% Confidence Interval [+0,0003, +0,0031] tidak memuat nol dan p(Δ ≤ 0) = 0,0108, penambahan kebiasaan merokok (SMK_stat_type_cd) dan alkohol (DRK_YN) terbukti meningkatkan performa klasifikasi secara signifikan, meski magnitudonya kecil karena efek fisiologisnya sebagian besar telah dimediasi oleh biomarker metabolik seperti gamma_GTP dan trigliserida.",
  results: [
    { metric: "Accuracy", withLifestyle: 43.89, withoutLifestyle: 43.77, delta: 0.0012, deltaFormatted: "+0,12%" },
    { metric: "Balanced Accuracy", withLifestyle: 39.31, withoutLifestyle: 39.14, delta: 0.0017, deltaFormatted: "+0,17%" },
    { metric: "Macro F1 (Metrik Utama)", withLifestyle: 36.68, withoutLifestyle: 36.51, delta: 0.0017, deltaFormatted: "+0,17%" },
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
  { subgroup: "Perempuan (Female)", category: "Gender", n: 93250, accuracy: 48.76, balancedAcc: 39.08, macroF1: 34.11 },
  { subgroup: "Laki-laki (Male)", category: "Gender", n: 105020, accuracy: 39.58, balancedAcc: 35.69, macroF1: 33.64 },
  { subgroup: "< 40 tahun", category: "Usia", n: 49787, accuracy: 56.24, balancedAcc: 38.96, macroF1: 39.25 },
  { subgroup: "40–49 tahun", category: "Usia", n: 49734, accuracy: 49.76, balancedAcc: 37.03, macroF1: 35.24 },
  { subgroup: "50–59 tahun", category: "Usia", n: 47910, accuracy: 40.78, balancedAcc: 34.97, macroF1: 33.35 },
  { subgroup: "60+ tahun", category: "Usia", n: 50839, accuracy: 29.00, balancedAcc: 31.32, macroF1: 25.67 },
  { subgroup: "Tidak Pernah Merokok (SMK=1)", category: "Merokok", n: 120558, accuracy: 46.00, balancedAcc: 39.81, macroF1: 36.14 },
  { subgroup: "Mantan Perokok (SMK=2)", category: "Merokok", n: 34884, accuracy: 39.27, balancedAcc: 35.84, macroF1: 33.61 },
  { subgroup: "Perokok Aktif (SMK=3)", category: "Merokok", n: 42828, accuracy: 41.74, balancedAcc: 35.91, macroF1: 34.14 },
  { subgroup: "Tidak Minum Alkohol (DRK=N)", category: "Alkohol", n: 99018, accuracy: 42.99, balancedAcc: 39.13, macroF1: 35.61 },
  { subgroup: "Minum Alkohol (DRK=Y)", category: "Alkohol", n: 99252, accuracy: 44.80, balancedAcc: 39.00, macroF1: 36.85 },
];

export interface ShapFeature {
  rank: number;
  feature: string;
  label: string;
  meanShap: number;
  category: "Demografi" | "Antropometri" | "Biomarker Enzim" | "Metabolik & Darah" | "Profil Lipid" | "Gaya Hidup" | "Pemeriksaan Fisik";
}

export const TOP20_SHAP: ShapFeature[] = [
  { rank: 1, feature: "num__age", label: "Usia (Age)", meanShap: 0.02926, category: "Demografi" },
  { rank: 2, feature: "num__waistline", label: "Lingkar Pinggang (Waistline)", meanShap: 0.02479, category: "Antropometri" },
  { rank: 3, feature: "num__gamma_GTP", label: "gamma-GTP (Enzim Hati/Metabolik)", meanShap: 0.01828, category: "Biomarker Enzim" },
  { rank: 4, feature: "num__BLDS", label: "Gula Darah Puasa (BLDS)", meanShap: 0.01680, category: "Metabolik & Darah" },
  { rank: 5, feature: "num__triglyceride", label: "Trigliserida", meanShap: 0.01411, category: "Profil Lipid" },
  { rank: 6, feature: "num__weight", label: "Berat Badan (Weight)", meanShap: 0.01319, category: "Antropometri" },
  { rank: 7, feature: "num__hemoglobin", label: "Hemoglobin", meanShap: 0.00991, category: "Metabolik & Darah" },
  { rank: 8, feature: "num__height", label: "Tinggi Badan (Height)", meanShap: 0.00608, category: "Antropometri" },
  { rank: 9, feature: "num__SGOT_AST", label: "SGOT / AST (Enzim Hati)", meanShap: 0.00598, category: "Biomarker Enzim" },
  { rank: 10, feature: "num__sight_left", label: "Penglihatan Kiri (Sight Left)", meanShap: 0.00423, category: "Pemeriksaan Fisik" },
  { rank: 11, feature: "cat__sex_Female", label: "Jenis Kelamin (Perempuan)", meanShap: 0.00412, category: "Demografi" },
  { rank: 12, feature: "cat__sex_Male", label: "Jenis Kelamin (Laki-laki)", meanShap: 0.00394, category: "Demografi" },
  { rank: 13, feature: "num__tot_chole", label: "Total Kolesterol", meanShap: 0.00370, category: "Profil Lipid" },
  { rank: 14, feature: "num__sight_right", label: "Penglihatan Kanan (Sight Right)", meanShap: 0.00360, category: "Pemeriksaan Fisik" },
  { rank: 15, feature: "num__SGOT_ALT", label: "SGOT / ALT (Enzim Hati)", meanShap: 0.00350, category: "Biomarker Enzim" },
  { rank: 16, feature: "num__HDL_chole", label: "HDL Kolesterol (Kolesterol Baik)", meanShap: 0.00302, category: "Profil Lipid" },
  { rank: 17, feature: "num__LDL_chole", label: "LDL Kolesterol (Kolesterol Jahat)", meanShap: 0.00227, category: "Profil Lipid" },
  { rank: 18, feature: "cat__DRK_YN_Y", label: "Konsumsi Alkohol (Ya)", meanShap: 0.00191, category: "Gaya Hidup" },
  { rank: 19, feature: "cat__DRK_YN_N", label: "Konsumsi Alkohol (Tidak)", meanShap: 0.00183, category: "Gaya Hidup" },
  { rank: 20, feature: "cat__SMK_stat_type_cd_3", label: "Status Perokok Aktif (SMK=3)", meanShap: 0.00156, category: "Gaya Hidup" },
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
    lead: "Akurasi semu 49,47% pada XGBoost mengabaikan total kelas minoritas.",
    content:
      "XGBoost dan Logistic Regression tanpa pembobotan menghasilkan Accuracy lebih tinggi (49,47% dan 48,90%), namun mengalami 'class collapse' dengan recall 0,00 pada kelas 'Tekanan darah meningkat'. Random Forest dengan class_weight='balanced_subsample' dipilih sebagai model terbaik karena menghasilkan Macro F1 tertinggi (36,68%) serta berhasil menangkap 52% kasus 'Hipertensi terukur' yang merupakan prioritas klinis pencegahan stroke dan infark miokard.",
    clinicalSignificance:
      "Dalam skrining preventif, kegagalan mendeteksi hipertensi membawa risiko mortalitas fatal. Macro F1 memastikan model tidak mengorbankan kelas minoritas demi akurasi semu.",
  },
  {
    title: "Penurunan Akurasi pada Kelompok Lansia (60+)",
    tag: "Confounder Klinis",
    lead: "Macro F1 anjlok dari 39,25% (<40 tahun) menjadi 25,67% pada lansia.",
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
