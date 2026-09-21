# HR Leadership Intelligence, Workforce Architecture & Career Management Platform

A comprehensive, executive-grade full-stack platform built for a Senior HR Business Partner interview demonstration, integrating Workforce Intelligence, an authoritative Employee Master with lifecycle management, L1–L8 Career & Competency Architecture, and an end-to-end L3-to-L4 Data Engineering promotion workflow.

---

## 🌟 Executive Summary & Three Core Capabilities

### Capability 1: Workforce Intelligence & Appraisal Case Study
- **Single Source of Truth**: All demographics, compa-ratios, 9-box grids, and spans dynamically reconcile from a centralized relational database.
- **Dual Reporting Engine**:
  - **Baseline Case Study (288 Employees)**: Anchored to the exact historical 288-employee synthetic workforce and completed appraisal cycle (Team A: 128 Engineering, Team B: 96 Operations, Team C: 64 Revenue).
  - **Current Live Workforce (288 + Changes)**: Live active workforce reflecting all new hires, transfers, promotions, and edits in real-time.
- **Three-Team Appraisal Diagnosis**:
  - **Team A (Engineering)**: Upward rating leniency (mean 3.84/5.0) and grade compression.
  - **Team B (Operations)**: Managerial span overload (up to 18 reports) correlating with appraisal penalties.
  - **Team C (Revenue)**: Statistically significant work-proximity paradox (+0.45 rating advantage for on-site staff despite identical objective quota achievement).
- **90-Day Strategic Leadership Action Plan**: Concrete, sequenced milestones across 30, 60, and 90 days.

### Capability 2: Employee Master & HR Architecture
- **Centralized Employee Management**: Searchable roster with live filtering by team, career level (L1–L8), location, work mode, and talent classification.
- **Comprehensive 5-Tab Employee Profile**:
  1. Personal & Organisational Details
  2. Performance & Talent Ratings
  3. Compensation & Pay Band Compa-Ratios
  4. Career & Competency Gap Analysis
  5. Authoritative Transaction & Lifecycle History
- **Independent Manager & Coach Assignment**: Reporting accountability is decoupled from career mentorship.
- **Transactional Lifecycle Management**: Hiring, Transfers, Promotions, Salary Revisions, and Exits with automated audit logging.

### Capability 3: Career & Competency Management (L1–L8)
- **L1–L8 Career Level Architecture**: Dual tracks (Individual Contributor vs. People Manager) detailed across 10 dimensions of role scope, complexity, knowledge, skills, and business impact.
- **Two-Dimensional Competency Framework**: Independent grading of **Knowledge** (understanding) and **Skills** (demonstrable delivery) across the 5-level proficiency scale:
  - **A**: Awareness
  - **B**: Working
  - **C**: Proficient
  - **D**: Advanced
  - **E**: Expert
- **12 Data Engineering Competencies**: SQL, ETL/ELT, Python & Distributed Processing, System Architecture, Cloud Platforms, Data Governance, FinOps, SRE, Security, Problem Solving, Stakeholder Management, and Technical Leadership.
- **Structured 7-Stage Promotion Assessment**:
  1. Candidate Selection (Eligible L3 Data Engineer)
  2. Manager Nomination & Dossier Submission
  3. Competency Assessment against L4 Target Requirements
  4. Observable Evidence Review (RFCs, latency benchmarks, code reviews)
  5. Cross-Functional Calibration Panel
  6. Formal Human-Reviewed Promotion Decision
  7. Career & Compensation Update (Live execution updating level to L4, shifting to L4 pay band, and recalculating compa-ratio)
- **Automated Individual Development Plan (IDP)**: Identifies specific capability gaps and recommends targeted stretch assignments and architect mentorship.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Database & Persistence**: SQLite via Prisma ORM with relational integrity, foreign keys, and atomic transactions
- **Analytics Engine**: Shared, deterministic TypeScript business logic (`/src/lib/analytics.ts` and `/src/lib/compensation.ts`)
- **Presentation & Export**: PptxGenJS (executive 16:9 `.pptx` decks) and SheetJS / XLSX (spreadsheets)

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Initialize Database
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 3. Start the Application
```bash
npm start
# Or for live development:
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Run Automated Reconciliation Tests
```bash
npx tsx scripts/verify_reconciliation.ts
```

---

## 🧭 Guided Interview Demonstration Sequence

Use the top banner in the application to navigate through the 7 demonstration stages:

| Stage | Title | Demonstration Action & Talking Points |
| :--- | :--- | :--- |
| **Stage 1** | **Executive Dashboard (Baseline)** | Open the **Workforce Intelligence** tab. Review the 288-employee baseline, demographic split, compa-ratio positioning, and managerial spans. Explain how all four modules draw from one unified baseline without data silos. |
| **Stage 2** | **Employee Master & Live SSOT** | Click **Add Female L3 Engineer** in the banner. Create *Ananya Sharma* in Team A. Demonstrate that total headcount immediately updates from 288 to 289, Team A becomes 129, and manager's span increments, while the completed historical appraisal denominator remains intact. |
| **Stage 3** | **Talent Identification & 9-Box** | Open candidate *SYN-0012* profile and toggle **Top Talent**. Demonstrate the real-time re-segmentation in the 9-Box matrix and explain the separation between employee talent designation and critical role position criticality. |
| **Stage 4** | **L1–L8 Career Architecture** | Switch to the **L1–L8 Career Architecture** tab. Select L4 Principal. Walk through the 10 role dimensions and explain how the IC and Manager tracks diverge at L4/L5 based on scope, autonomy, and organizational leverage. |
| **Stage 5** | **Competency Assessment (A–E)** | Switch to **L3-to-L4 Promotion & IDP**. Review the candidate's Knowledge and Skills grades against L4 targets. Highlight the independent grading of Knowledge vs. Skills and the automated stretch-initiative recommendations in the IDP. |
| **Stage 6** | **L3-to-L4 Promotion Workflow** | Click **Open Promotion Workflow**. Walk through the 7 stages: nomination, evidence artifacts, and calibration. Click **Approve & Execute L4 Promotion** to demonstrate the live update of career level to L4, application of the L4 pay band, and compa-ratio recalculation. |
| **Stage 7** | **Appraisal Case Study & 90-Day Plan** | Switch to **Appraisal Case Study (Teams A, B, C)**. Present the 3 team challenges (Engineering Leniency, Operations Overload, Revenue Proximity Paradox). Close with the structured 90-day action plan. |

### Reset Demo
Click the **Reset Demo** button in the top banner or header at any time to restore the platform back to the initial 288-employee baseline with zero residual edits.
