# Workforce Intelligence & Appraisal Health — HRBP Leadership Interview Case Study

Interactive executive dashboard and decision brief designed for HR Leadership / HRBP case study presentations.

---

## 📋 Overview

- **Title**: Workforce Intelligence & Appraisal Health
- **Target Audience**: Business Leadership / HRBP Executive Interview Panel
- **Dataset**: 100% Synthetic Records (Simulated Data across 288 records, reproducible seed: `20260919`)
- **Key Modules**:
  - Executive Narrative & Decision Framework
  - Appraisal Distribution & Compa-Ratio Analysis
  - Gender Pay & Progression Equity
  - Management Span of Control & Org Layering
  - 90-Day Action Plan & Leadership Interventions
  - Automated PowerPoint (.pptx) Deck Generation

---

## 📁 Project Structure

```
Interview/
├── index.html                             # Main application entry point
├── HR_Leadership_Interview_Dashboard.html # Standalone self-contained dashboard
├── server.js                              # Zero-dependency local development server
├── package.json                           # Project metadata and start scripts
├── .gitignore                             # Git ignore rules
└── README.md                              # Documentation and usage guide
```

---

## 🚀 How to Run

### Option 1: Direct File Launch
Double-click `index.html` or open it directly in any modern browser:
```bash
# Windows command line / PowerShell
start index.html
```

### Option 2: Local HTTP Server (Node.js)
Run the included zero-dependency server:
```bash
npm start
# or
node server.js
```
Then visit: [http://localhost:3000](http://localhost:3000)

### Option 3: Python Built-in Server
```bash
python -m http.server 3000
```

---

## 🌟 Key Features

1. **Simulated Scope Filtering**:
   - Entire Business Unit (288 employees)
   - Engineering (128 employees)
   - Operations (96 employees)
   - Revenue (64 employees)

2. **Decision-Grade Visualizations**:
   - Box-and-whisker & compa-ratio distributions by level
   - Unadjusted & adjusted gender pay comparisons across functions
   - Span-of-control organizational layer diagrams
   - Performance rating vs. goal attainment scatter plots

3. **Export & Theming**:
   - Dynamic dark / light theme toggle
   - One-click `.pptx` presentation deck generation powered by bundled PptxGenJS
