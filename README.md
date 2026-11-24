# Blood Pressure Big Data Analytics & Research Dashboard

> **Interactive Clinical & Epidemiological Dashboard (AHA/ACC 2017 & JNC-8 Criteria)**  
> Analisis Komprehensif Berbasis Big Data (991.346 Rekam Medis) & Machine Learning Explainability (SHAP).

🌐 **Live Demo:** [https://blood-pressure-dataset-dashboard.vercel.app](https://blood-pressure-dataset-dashboard.vercel.app)

---

## 📌 Ringkasan Proyek

Dashboard ini dikembangkan untuk memvisualisasikan, menganalisis, dan mengeksplorasi temuan klinis serta epidemiologis dari dataset skala besar rekam medis tekanan darah (**991.346 responden**). Visualisasi dirancang dengan filosofi desain modern (*Liquid Glassmorphism & Hemodynamic Waves*), dilengkapi interaktivitas data klinis, visualisasi biomarker dinamis, serta benchmark model Machine Learning.

---

## 🔬 Fitur Utama & Visualisasi

1. **Dashboard KPI & Demografi Global (Paket 1.1)**
   - Total populasi: **991.346 responden** (53,1% Pria, 46,9% Wanita).
   - Nilai rata-rata global: **Sistolik 122,43 mmHg** / **Diastolik 76,05 mmHg**.
   - Model prediktif terbaik: **Random Forest (Macro F1: 36,68%)** — 2,6x baseline mayoritas.
   - Faktor penentu utama (SHAP #1 & #2): **Usia** (`0.0293`) dan **Lingkar Pinggang** (`0.0248`).

2. **Distribusi Klinis Responden (AHA / JNC-8) (Paket 1.2)**
   - Donut Chart interaktif 4 kuadran:
     - **Normal** (<120 / <80 mmHg): 381.821 (38,51%)
     - **Tekanan Darah Meningkat** (120–129 / <80 mmHg): 141.172 (14,24%)
     - **Prahipertensi** (130–139 / 80–89 mmHg): 341.161 (34,41%)
     - **Hipertensi Terukur** (≥140 / ≥90 mmHg): 127.192 (12,83%)
   - Peringatan Klinis: **47,24% responden (468.353 jiwa)** berada dalam zona risiko intervensi dini.

3. **Prevalensi Hipertensi per Kelompok Usia (Paket 1.3)**
   - Visualisasi tabung kaca cairan (*Liquid Glass Tube*) dengan animasi air mengisi dari bawah dan gelombang bergoyang (*sloshing wave*).
   - Eksplorasi Relative Risk (RR):
     - **< 40 tahun:** 5,55% (1.0x Baseline)
     - **40–49 tahun:** 10,29% (1.85x vs Muda)
     - **50–59 tahun:** 13,65% (2.46x vs Muda)
     - **60+ tahun:** 21,70% (3.91x vs Muda — lonjakan ~4x lipat).

4. **Matriks Gaya Hidup & Fenomena Paradoks (Paket 1.4)**
   - Segmentasi kombinasi Merokok & Konsumsi Alkohol.
   - Temuan **Kausalitas Terbalik (Reverse Causality)**: Mantan perokok memiliki proporsi hipertensi tertinggi (**15,86%** vs perokok aktif **12,79%** dan non-perokok **11,97%**) karena pasien baru memutuskan berhenti setelah diagnosis kardiovaskular.

5. **Komparasi Profil Biomarker Kunci (Paket 1.5 / 1.6)**
   - Tab switching interaktif (*gamma-GTP, Gula Darah Puasa / BLDS, Trigliserida, Lingkar Pinggang, Usia*).
   - Tabung reaksi cairan reaktif dengan gelombang air dual-layer dan gelembung mikro (*rising bubbles*).
   - Menyoroti lonjakan dramatis enzim hati **gamma-GTP (+80%)** dan **Trigliserida (+46%)** dari kelompok Normal ke Hipertensi.

6. **Machine Learning Benchmark & SHAP Explainability (Paket 2)**
   - Perbandingan 4 arsitektur model:
     - **Random Forest** (Semua Fitur) — Macro F1: 36,68% | Macro Precision: 42,91%
     - **XGBoost Classifier** — Macro F1: 36,12%
     - **LightGBM** — Macro F1: 35,94%
     - **Logistic Regression (Baseline)** — Macro F1: 28,10%
   - Evaluasi subgrup (Disparitas Gender, Usia, Gaya Hidup).
   - Interpretasi nilai SHAP (*Global Feature Importance*).

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite 8
- **Styling:** Tailwind CSS v4 + Custom Glassmorphism & SVG Wave Keyframes
- **Icons:** Lucide React
- **Background Engine:** Canvas API (Hemodynamic Continuous Wave Motion)
- **Deployment:** Vercel

---

## 🚀 Menjalankan Secara Lokal

1. **Clone repository ini:**
   ```bash
   git clone <URL_REPOSITORY_ANDA>
   cd "Blood Pressure Dataset Dashboard"
   ```

2. **Install dependensi:**
   ```bash
   pnpm install
   # atau
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   pnpm dev
   # atau
   npm run dev
   ```

4. **Buka di browser:**
   Akses `http://localhost:8443` (atau port yang tertera di terminal).

5. **Build untuk produksi:**
   ```bash
   pnpm build
   # atau
   npm run build
   ```

---

## 📄 Lisensi & Referensi Data

- Berdasarkan dataset rekam medis tekanan darah (991.346 observasi).
- Kategori diagnosis mengacu pada pedoman klinis **AHA/ACC 2017** (*American Heart Association / American College of Cardiology*) dan **JNC-8** (*Eighth Joint National Committee*).
# blood-pressure-dataset-dashboard
