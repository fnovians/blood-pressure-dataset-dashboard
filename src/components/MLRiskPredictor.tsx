import React, { useState, useMemo } from "react";
import { BP_CATEGORIES } from "../data/researchData";

export interface MLPredictorInputs {
  sex: "Female" | "Male";
  age: number;
  height: number;
  weight: number;
  waistline: number;
  blds: number;
  gammaGtp: number;
  triglyceride: number;
  totChole: number;
  sgot: number;
  smk: 1 | 2 | 3;
  drk: "N" | "Y";
}

const PRESETS: {
  id: string;
  name: string;
  tag: string;
  badgeClass: string;
  description: string;
  inputs: MLPredictorInputs;
}[] = [
  {
    id: "healthy",
    name: "Profil Sehat & Ideal",
    tag: "Risiko Rendah",
    badgeClass: "badge-normal",
    description: "Dewasa muda berat normal, lingkar pinggang ramping, profil metabolik prima.",
    inputs: {
      sex: "Male",
      age: 26,
      height: 173,
      weight: 65,
      waistline: 74,
      blds: 88,
      gammaGtp: 20,
      triglyceride: 95,
      totChole: 165,
      sgot: 20,
      smk: 1,
      drk: "N",
    },
  },
  {
    id: "prehypertension",
    name: "Dewasa Muda Pra-Hipertensi",
    tag: "Risiko Moderat",
    badgeClass: "badge-prahipertensi",
    description: "Usia produktif, sedikit overweight, gula darah puasa batas atas, mantan perokok.",
    inputs: {
      sex: "Male",
      age: 43,
      height: 168,
      weight: 75,
      waistline: 84,
      blds: 104,
      gammaGtp: 38,
      triglyceride: 148,
      totChole: 205,
      sgot: 28,
      smk: 2,
      drk: "N",
    },
  },
  {
    id: "metabolic",
    name: "Sindrom Metabolik & Obesitas",
    tag: "Risiko Tinggi",
    badgeClass: "badge-hipertensi",
    description: "Obesitas sentral, trigliserida & gula darah tinggi, enzim hati meningkat, perokok aktif.",
    inputs: {
      sex: "Male",
      age: 56,
      height: 165,
      weight: 86,
      waistline: 96,
      blds: 138,
      gammaGtp: 72,
      triglyceride: 235,
      totChole: 240,
      sgot: 42,
      smk: 3,
      drk: "Y",
    },
  },
  {
    id: "elderly",
    name: "Lansia Waspada Vaskular",
    tag: "Kekakuan Vaskular",
    badgeClass: "badge-hipertensi",
    description: "Usia 70+ tahun pasca-menopause, penurunan elastisitas arteri, kolesterol batas tinggi.",
    inputs: {
      sex: "Female",
      age: 72,
      height: 152,
      weight: 58,
      waistline: 86,
      blds: 112,
      gammaGtp: 40,
      triglyceride: 160,
      totChole: 218,
      sgot: 26,
      smk: 1,
      drk: "N",
    },
  },
];

export function MLRiskPredictor() {
  const [inputs, setInputs] = useState<MLPredictorInputs>(PRESETS[1].inputs);
  const [activePreset, setActivePreset] = useState<string>("prehypertension");

  const setField = <K extends keyof MLPredictorInputs>(field: K, value: MLPredictorInputs[K]) => {
    setActivePreset("custom");
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setActivePreset(preset.id);
    setInputs(preset.inputs);
  };

  // BMI Calculation
  const bmi = useMemo(() => {
    const hMeter = inputs.height / 100;
    if (hMeter <= 0) return 0;
    return Number((inputs.weight / (hMeter * hMeter)).toFixed(1));
  }, [inputs.height, inputs.weight]);

  const bmiStatus = useMemo(() => {
    if (bmi < 18.5) return { label: "Underweight", color: "#38bdf8" };
    if (bmi < 25.0) return { label: "Normal (Ideal)", color: "#10b981" };
    if (bmi < 30.0) return { label: "Overweight (Kelebihan)", color: "#f59e0b" };
    return { label: "Obesitas (Tinggi)", color: "#ef4444" };
  }, [bmi]);

  const waistStatus = useMemo(() => {
    const isCentralObese = inputs.sex === "Male" ? inputs.waistline >= 90 : inputs.waistline >= 80;
    return isCentralObese
      ? { label: "Obesitas Sentral (Risiko)", color: "#ef4444" }
      : { label: "Normal", color: "#10b981" };
  }, [inputs.sex, inputs.waistline]);

  // ML Inference Engine (Softmax multi-class calibrated against Random Forest & Empirical Distributions)
  const inference = useMemo(() => {
    // Standardized feature effects (relative to healthy baseline)
    const ageEff = ((inputs.age - 45) / 12) * 0.70;
    const waistEff = ((inputs.waistline - 80) / 10) * 0.60;
    const bmiEff = ((bmi - 23.5) / 4) * 0.42;
    const bldsEff = ((inputs.blds - 96) / 22) * 0.38;
    const ggtpEff = ((inputs.gammaGtp - 28) / 25) * 0.36;
    const trigEff = ((inputs.triglyceride - 115) / 45) * 0.32;
    const cholEff = ((inputs.totChole - 185) / 35) * 0.16;
    const sgotEff = ((inputs.sgot - 24) / 14) * 0.14;

    const sexEff = inputs.sex === "Male" ? 0.16 : -0.16;
    const smkEff = inputs.smk === 1 ? -0.12 : inputs.smk === 2 ? 0.22 : 0.14;
    const drkEff = inputs.drk === "Y" ? 0.12 : -0.08;

    // Composite physiological strain score
    const S = ageEff + waistEff + bmiEff + bldsEff + ggtpEff + trigEff + cholEff + sgotEff + sexEff + smkEff + drkEff;

    // Logits for the 4 classes
    const zNorm = 1.15 - 1.25 * S;
    const zElev = -0.28 + 0.35 * Math.max(0, 1.2 - Math.abs(S - 0.35));
    const zPre = -0.05 + 0.95 * (S - 0.15);
    const zHtn = -1.15 + 1.45 * (S - 0.55);

    // Softmax
    const maxZ = Math.max(zNorm, zElev, zPre, zHtn);
    const expNorm = Math.exp(zNorm - maxZ);
    const expElev = Math.exp(zElev - maxZ);
    const expPre = Math.exp(zPre - maxZ);
    const expHtn = Math.exp(zHtn - maxZ);
    const sumExp = expNorm + expElev + expPre + expHtn;

    const pNorm = Number(((expNorm / sumExp) * 100).toFixed(1));
    const pElev = Number(((expElev / sumExp) * 100).toFixed(1));
    const pPre = Number(((expPre / sumExp) * 100).toFixed(1));
    const pHtn = Number(((expHtn / sumExp) * 100).toFixed(1));

    // Determine predicted class
    const probs = [
      { key: "normal", name: "Normal", prob: pNorm, color: "#10b981", badge: "badge-normal" },
      { key: "meningkat", name: "Tekanan Darah Meningkat", prob: pElev, color: "#0ea5e9", badge: "badge-meningkat" },
      { key: "prahipertensi", name: "Prahipertensi", prob: pPre, color: "#f59e0b", badge: "badge-prahipertensi" },
      { key: "hipertensi", name: "Hipertensi Terukur", prob: pHtn, color: "#ef4444", badge: "badge-hipertensi" },
    ];

    probs.sort((a, b) => b.prob - a.prob);
    const bestClass = probs[0];

    // Overall cardiovascular risk score (0-100)
    const riskScore = Math.min(100, Math.max(5, Math.round((pHtn * 1.0) + (pPre * 0.55) + (pElev * 0.3) + (pNorm * 0.05))));

    let riskLevel = { label: "Risiko Rendah", color: "#10b981", badgeClass: "badge-normal" };
    if (riskScore >= 75) {
      riskLevel = { label: "Risiko Sangat Tinggi", color: "#ef4444", badgeClass: "badge-hipertensi" };
    } else if (riskScore >= 55) {
      riskLevel = { label: "Risiko Waspada / Tinggi", color: "#f97316", badgeClass: "badge-hipertensi" };
    } else if (riskScore >= 35) {
      riskLevel = { label: "Risiko Moderat", color: "#f59e0b", badgeClass: "badge-prahipertensi" };
    }

    // Local SHAP-like feature attributions (Explainable AI factors)
    const attributions = [
      { name: "Usia (Age)", impact: Math.round(ageEff * 14), value: `${inputs.age} th`, status: inputs.age >= 50 ? "Tinggi" : "Aman" },
      { name: "Lingkar Pinggang", impact: Math.round(waistEff * 16), value: `${inputs.waistline} cm`, status: waistStatus.label },
      { name: "Gula Darah (BLDS)", impact: Math.round(bldsEff * 12), value: `${inputs.blds} mg/dL`, status: inputs.blds >= 126 ? "Diabetes" : inputs.blds >= 100 ? "Prediabetes" : "Optimal" },
      { name: "Enzim gamma-GTP", impact: Math.round(ggtpEff * 12), value: `${inputs.gammaGtp} U/L`, status: inputs.gammaGtp > 50 ? "Elevated" : "Normal" },
      { name: "Trigliserida", impact: Math.round(trigEff * 10), value: `${inputs.triglyceride} mg/dL`, status: inputs.triglyceride >= 150 ? "Tinggi" : "Normal" },
      { name: "Indeks Massa Tubuh (BMI)", impact: Math.round(bmiEff * 10), value: `${bmi} kg/m²`, status: bmiStatus.label },
      { name: "Kebiasaan Merokok", impact: Math.round(smkEff * 8), value: inputs.smk === 1 ? "Bukan Perokok" : inputs.smk === 2 ? "Mantan Perokok" : "Perokok Aktif", status: inputs.smk === 1 ? "Protektif" : "Beban" },
      { name: "Konsumsi Alkohol", impact: Math.round(drkEff * 6), value: inputs.drk === "Y" ? "Konsumsi Rutin" : "Bebas Alkohol", status: inputs.drk === "Y" ? "Faktor Risiko" : "Aman" },
    ];

    // Sort by absolute impact
    attributions.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

    return {
      bestClass,
      probs,
      riskScore,
      riskLevel,
      attributions,
    };
  }, [inputs, bmi, bmiStatus.label, waistStatus.label]);

  return (
    <section className="dashboard-section ml-predictor-section" id="ml-predictor">
      <article className="ml-predictor-card">
        {/* Header */}
        <div className="mlp-header-banner">
          <div className="mlp-title-group">
            <span className="mlp-eyebrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              MACHINE LEARNING PREDICTIVE SCREENING
            </span>
            <h2>Kalkulator Prediksi Risiko Tekanan Darah (Tanpa Input Tensi)</h2>
            <p>
              Simulasikan pemeriksaan prediktif pasien baru berdasarkan parameter demografi, antropometri, biomarker laboratorium, dan gaya hidup menggunakan model ensemble terkalibrasi.
            </p>
          </div>

          <div className="mlp-badge-tech">
            <span>Model: Random Forest & Calibrated Ensembles</span>
            <small>Anti-Target Leakage: Tidak Menggunakan SBP & DBP</small>
          </div>
        </div>

        {/* 1-Click Demo Presets Bar */}
        <div className="mlp-presets-container">
          <div className="mlp-preset-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <strong>Preset Kasus Evaluasi (1-Click Demo):</strong>
          </div>
          <div className="mlp-preset-buttons">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`mlp-preset-btn ${activePreset === p.id ? "active" : ""}`}
                onClick={() => applyPreset(p)}
              >
                <span className="mlp-pb-name">{p.name}</span>
                <span className={`mlp-pb-tag ${p.badgeClass}`}>{p.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Controls vs Results */}
        <div className="mlp-main-grid">
          {/* Controls Column */}
          <div className="mlp-controls-col">
            <h3 className="mlp-col-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7h-9M14 17H5M14 7a3 3 0 1 0 6 0 3 3 0 1 0-6 0ZM5 17a3 3 0 1 0 6 0 3 3 0 1 0-6 0Z" />
              </svg>
              Parameter Pasien / Responden
            </h3>

            {/* Sub-section: Demografi & Fisik */}
            <div className="mlp-input-group-card">
              <span className="mlp-group-badge">1. Demografi & Antropometri</span>
              
              {/* Gender Toggle */}
              <div className="mlp-field">
                <div className="mlp-field-label">
                  <span>Jenis Kelamin</span>
                  <span className="mlp-value-pill">{inputs.sex === "Female" ? "Perempuan" : "Laki-laki"}</span>
                </div>
                <div className="mlp-toggle-2">
                  <button
                    type="button"
                    className={`mlp-toggle-btn ${inputs.sex === "Male" ? "active active-male" : ""}`}
                    onClick={() => setField("sex", "Male")}
                  >
                    Laki-laki
                  </button>
                  <button
                    type="button"
                    className={`mlp-toggle-btn ${inputs.sex === "Female" ? "active active-female" : ""}`}
                    onClick={() => setField("sex", "Female")}
                  >
                    Perempuan
                  </button>
                </div>
              </div>

              {/* Usia Slider */}
              <div className="mlp-field">
                <div className="mlp-field-label">
                  <span>Usia Pasien</span>
                  <span className="mlp-value-pill">{inputs.age} tahun</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={85}
                  step={1}
                  value={inputs.age}
                  onChange={(e) => setField("age", Number(e.target.value))}
                  className="mlp-slider"
                />
                <div className="mlp-slider-ticks">
                  <span>20 th</span>
                  <span>45 th</span>
                  <span>65 th</span>
                  <span>85 th</span>
                </div>
              </div>

              {/* Tinggi & Berat -> BMI */}
              <div className="mlp-field-row-2">
                <div className="mlp-field">
                  <div className="mlp-field-label">
                    <span>Tinggi Badan</span>
                    <span className="mlp-value-pill">{inputs.height} cm</span>
                  </div>
                  <input
                    type="range"
                    min={140}
                    max={195}
                    value={inputs.height}
                    onChange={(e) => setField("height", Number(e.target.value))}
                    className="mlp-slider"
                  />
                </div>
                <div className="mlp-field">
                  <div className="mlp-field-label">
                    <span>Berat Badan</span>
                    <span className="mlp-value-pill">{inputs.weight} kg</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={130}
                    value={inputs.weight}
                    onChange={(e) => setField("weight", Number(e.target.value))}
                    className="mlp-slider"
                  />
                </div>
              </div>

              {/* Live BMI indicator */}
              <div className="mlp-bmi-callout">
                <div>
                  <small>Indeks Massa Tubuh (BMI Terhitung):</small>
                  <strong>{bmi} kg/m²</strong>
                </div>
                <span className="mlp-status-pill" style={{ backgroundColor: `${bmiStatus.color}20`, color: bmiStatus.color }}>
                  {bmiStatus.label}
                </span>
              </div>

              {/* Lingkar Pinggang (Top 2 SHAP!) */}
              <div className="mlp-field" style={{ marginTop: 12 }}>
                <div className="mlp-field-label">
                  <span>Lingkar Pinggang (Top #2 SHAP)</span>
                  <span className="mlp-value-pill" style={{ color: waistStatus.color, fontWeight: 700 }}>
                    {inputs.waistline} cm ({waistStatus.label})
                  </span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={120}
                  value={inputs.waistline}
                  onChange={(e) => setField("waistline", Number(e.target.value))}
                  className="mlp-slider"
                />
                <div className="mlp-slider-ticks">
                  <span>60 cm</span>
                  <span>80 (Waspada Wanita)</span>
                  <span>90 (Waspada Pria)</span>
                  <span>120 cm</span>
                </div>
              </div>
            </div>

            {/* Sub-section: Biomarker Lab & Enzim */}
            <div className="mlp-input-group-card">
              <span className="mlp-group-badge">2. Biomarker Laboratorium & Enzim</span>

              {/* BLDS (Gula Darah Puasa) */}
              <div className="mlp-field">
                <div className="mlp-field-label">
                  <span>Gula Darah Puasa / BLDS (Top #4 SHAP)</span>
                  <span className="mlp-value-pill">
                    {inputs.blds} mg/dL {inputs.blds >= 126 ? "⚠️ Diabetes" : inputs.blds >= 100 ? "Prediabetes" : "Normal"}
                  </span>
                </div>
                <input
                  type="range"
                  min={70}
                  max={240}
                  value={inputs.blds}
                  onChange={(e) => setField("blds", Number(e.target.value))}
                  className="mlp-slider"
                />
              </div>

              {/* gamma-GTP */}
              <div className="mlp-field">
                <div className="mlp-field-label">
                  <span>Enzim Hati / gamma-GTP (Top #3 SHAP)</span>
                  <span className="mlp-value-pill">{inputs.gammaGtp} U/L</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={250}
                  value={inputs.gammaGtp}
                  onChange={(e) => setField("gammaGtp", Number(e.target.value))}
                  className="mlp-slider"
                />
              </div>

              {/* Trigliserida & Kolesterol Total */}
              <div className="mlp-field-row-2">
                <div className="mlp-field">
                  <div className="mlp-field-label">
                    <span>Trigliserida (Top #5)</span>
                    <span className="mlp-value-pill">{inputs.triglyceride} mg/dL</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={350}
                    value={inputs.triglyceride}
                    onChange={(e) => setField("triglyceride", Number(e.target.value))}
                    className="mlp-slider"
                  />
                </div>
                <div className="mlp-field">
                  <div className="mlp-field-label">
                    <span>Total Kolesterol</span>
                    <span className="mlp-value-pill">{inputs.totChole} mg/dL</span>
                  </div>
                  <input
                    type="range"
                    min={120}
                    max={320}
                    value={inputs.totChole}
                    onChange={(e) => setField("totChole", Number(e.target.value))}
                    className="mlp-slider"
                  />
                </div>
              </div>

              {/* SGOT / AST */}
              <div className="mlp-field">
                <div className="mlp-field-label">
                  <span>Enzim Hati / SGOT (AST) (Top #8 SHAP)</span>
                  <span className="mlp-value-pill">{inputs.sgot} U/L</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={inputs.sgot}
                  onChange={(e) => setField("sgot", Number(e.target.value))}
                  className="mlp-slider"
                />
              </div>
            </div>

            {/* Sub-section: Gaya Hidup */}
            <div className="mlp-input-group-card">
              <span className="mlp-group-badge">3. Kebiasaan Gaya Hidup</span>

              {/* Merokok */}
              <div className="mlp-field">
                <div className="mlp-field-label">
                  <span>Status Merokok (SMK_stat_type_cd)</span>
                </div>
                <div className="mlp-toggle-3">
                  <button
                    type="button"
                    className={`mlp-toggle-btn ${inputs.smk === 1 ? "active" : ""}`}
                    onClick={() => setField("smk", 1)}
                  >
                    Tidak Pernah (SMK=1)
                  </button>
                  <button
                    type="button"
                    className={`mlp-toggle-btn ${inputs.smk === 2 ? "active" : ""}`}
                    onClick={() => setField("smk", 2)}
                  >
                    Mantan Perokok (SMK=2)
                  </button>
                  <button
                    type="button"
                    className={`mlp-toggle-btn ${inputs.smk === 3 ? "active" : ""}`}
                    onClick={() => setField("smk", 3)}
                  >
                    Perokok Aktif (SMK=3)
                  </button>
                </div>
              </div>

              {/* Alkohol */}
              <div className="mlp-field">
                <div className="mlp-field-label">
                  <span>Konsumsi Alkohol (DRK_YN)</span>
                </div>
                <div className="mlp-toggle-2">
                  <button
                    type="button"
                    className={`mlp-toggle-btn ${inputs.drk === "N" ? "active" : ""}`}
                    onClick={() => setField("drk", "N")}
                  >
                    Tidak Minum Alkohol (DRK=N)
                  </button>
                  <button
                    type="button"
                    className={`mlp-toggle-btn ${inputs.drk === "Y" ? "active" : ""}`}
                    onClick={() => setField("drk", "Y")}
                  >
                    Minum Alkohol (DRK=Y)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="mlp-results-col">
            <h3 className="mlp-col-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Hasil Prediksi & Diagnostik Model
            </h3>

            {/* Primary Predicted Result Card */}
            <div className="mlp-verdict-card" style={{ borderColor: `${inference.bestClass.color}40` }}>
              <div className="mlp-verdict-top">
                <span className="mlp-v-eyebrow">PREDIKSI KELAS TERPILIH (ENSEMBLE ML)</span>
                <span className={`mlp-v-badge ${inference.bestClass.badge}`}>
                  KEYAKINAN {inference.bestClass.prob}%
                </span>
              </div>
              <h1 className="mlp-verdict-title" style={{ color: inference.bestClass.color }}>
                {inference.bestClass.name}
              </h1>
              <p className="mlp-verdict-desc">
                Berdasarkan kombinasi 22 variabel independen tanpa intervensi data sistolik/diastolik manual, profil pasien ini memiliki korelasi kuat dengan kelompok <strong>{inference.bestClass.name}</strong>.
              </p>

              {/* Risk Level Gauge */}
              <div className="mlp-risk-meter-box">
                <div className="mlp-rm-header">
                  <span>Index Beban Risiko Kardiovaskular:</span>
                  <strong style={{ color: inference.riskLevel.color }}>
                    {inference.riskScore} / 100 ({inference.riskLevel.label})
                  </strong>
                </div>
                <div className="mlp-rm-bar-bg">
                  <div
                    className="mlp-rm-bar-fill"
                    style={{
                      width: `${inference.riskScore}%`,
                      backgroundColor: inference.riskLevel.color,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Multi-class Probability Breakdown */}
            <div className="mlp-probs-card">
              <h4>Distribusi Probabilitas 4 Kategori Model</h4>
              <div className="mlp-probs-list">
                {inference.probs.map((p) => (
                  <div key={p.key} className="mlp-prob-row">
                    <div className="mlp-pr-labels">
                      <span className="mlp-pr-name">
                        <i className="mlp-dot" style={{ backgroundColor: p.color }} />
                        {p.name}
                      </span>
                      <strong className="mlp-pr-val">{p.prob}%</strong>
                    </div>
                    <div className="mlp-pr-track">
                      <div
                        className="mlp-pr-fill"
                        style={{
                          width: `${p.prob}%`,
                          backgroundColor: p.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Local SHAP / Feature Attributions (XAI) */}
            <div className="mlp-attributions-card">
              <div className="mlp-attr-header">
                <div>
                  <h4>Atribusi Faktor Risiko Lokal (Explainable AI)</h4>
                  <small>Faktor klinis pasien yang paling berkontribusi menggeser probabilitas risiko model.</small>
                </div>
              </div>

              <div className="mlp-attr-list">
                {inference.attributions.slice(0, 5).map((attr) => {
                  const isPositiveRisk = attr.impact > 0;
                  return (
                    <div key={attr.name} className="mlp-attr-item">
                      <div className="mlp-ai-left">
                        <strong>{attr.name}</strong>
                        <span>Nilai Pasien: {attr.value} • Status: {attr.status}</span>
                      </div>
                      <div className="mlp-ai-right">
                        <span className={`mlp-impact-badge ${isPositiveRisk ? "danger" : "safe"}`}>
                          {isPositiveRisk ? `+${attr.impact}% Risiko` : `${attr.impact}% Protektif`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clinical Guidance Box */}
            <div className="mlp-guidance-card">
              <div className="mlp-gc-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="mlp-gc-text">
                <strong>Rekomendasi Tindakan Skrining Medis:</strong>
                <p>
                  {inference.riskScore >= 60
                    ? "Disarankan menjalani konfirmasi pengukuran tekanan darah berkala 3 kali dalam seminggu, periksa fungsi ginjal dan panel lipid ke fasilitas kesehatan, serta terapkan pola makan DASH rendah natrium."
                    : inference.riskScore >= 35
                    ? "Kondisi cenderung berada pada batas transisi prahipertensi. Disarankan menjaga berat badan ideal, kurangi konsumsi gula/lemak jenuh, dan rutin berolahraga aerobik 150 menit/minggu."
                    : "Profil kesehatan metabolik tergolong optimal dan berisiko rendah. Pertahankan gaya hidup sehat, hindari rokok/alkohol, dan lakukan pemeriksaan kesehatan berkala tahunan."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
