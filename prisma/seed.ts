import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const DATA_ENGINEERING_COMPETENCIES = [
  {
    id: "COMP-SQL",
    name: "SQL and Data Modelling",
    category: "Technical Foundation",
    knowledgeDescL3: "Proficient understanding of relational & dimensional models, star schemas, window functions, and indexing strategies.",
    skillsDescL3: "Writes clean, maintainable analytical SQL; designs 3NF/Kimball schemas for multi-team data marts.",
    knowledgeDescL4: "Advanced mastery of distributed SQL optimizers, columnar storage indexing, partitioning, and semantic data models.",
    skillsDescL4: "Architects enterprise semantic layers; tunes query plans across petabyte engines (BigQuery/Snowflake/Spark).",
    targetKnowledgeL3: "C",
    targetSkillsL3: "C",
    targetKnowledgeL4: "D",
    targetSkillsL4: "D",
    expectedEvidence: "Production dimensional schema diagrams, query plan benchmarks, dbt model repositories."
  },
  {
    id: "COMP-ETL",
    name: "ETL/ELT Pipeline Engineering",
    category: "Data Processing",
    knowledgeDescL3: "Understands batch vs streaming paradigms, DAG orchestration, idempotency, and backfill patterns.",
    skillsDescL3: "Constructs resilient Airflow/Prefect pipelines with automated retries and dead-letter queues.",
    knowledgeDescL4: "Deep expertise in real-time streaming architectures (Kafka/Flink), exactly-once processing, and pipeline autoscaling.",
    skillsDescL4: "Designs fault-tolerant, high-throughput streaming and micro-batch ingestion pipelines supporting critical SLA systems.",
    targetKnowledgeL3: "C",
    targetSkillsL3: "C",
    targetKnowledgeL4: "D",
    targetSkillsL4: "D",
    expectedEvidence: "Production DAG architectures, latency reduction metrics, streaming topology designs."
  },
  {
    id: "COMP-PYTHON",
    name: "Python and Distributed Processing",
    category: "Core Engineering",
    knowledgeDescL3: "Solid understanding of Python async/multiprocessing, PySpark transformations, memory management, and package design.",
    skillsDescL3: "Develops modular, type-hinted data libraries; writes PySpark jobs with partition-pruning optimizations.",
    knowledgeDescL4: "Advanced knowledge of Spark internals (Tungsten, Catalyst optimizer, broadcast joins, out-of-core spill mechanics).",
    skillsDescL4: "Solves data skew, custom serialization bottlenecks, and builds reusable distributed computing frameworks across engineering.",
    targetKnowledgeL3: "C",
    targetSkillsL3: "C",
    targetKnowledgeL4: "D",
    targetSkillsL4: "D",
    expectedEvidence: "Spark execution profile audits, custom Python SDK packages, memory leak resolution tickets."
  },
  {
    id: "COMP-ARCH",
    name: "Data Architecture and System Design",
    category: "Architecture & Systems",
    knowledgeDescL3: "Understands established architectural patterns, data storage, integration approaches, scalability, and design trade-offs.",
    skillsDescL3: "Can implement components within an established architecture and contribute to design discussions with support on complex decisions.",
    knowledgeDescL4: "Demonstrates advanced understanding of distributed data architecture, scalability, failure recovery, system trade-offs, governance, and long-term maintainability.",
    skillsDescL4: "Independently designs complex data-processing solutions, evaluates architectural alternatives, documents decisions (ADRs), and demonstrates measurable outcomes.",
    targetKnowledgeL3: "C",
    targetSkillsL3: "B",
    targetKnowledgeL4: "D",
    targetSkillsL4: "D",
    expectedEvidence: "Approved Architecture Decision Records (ADRs), cross-system interface contracts, scalability blueprints."
  },
  {
    id: "COMP-CLOUD",
    name: "Cloud Data Platforms",
    category: "Infrastructure",
    knowledgeDescL3: "Good knowledge of cloud storage tiers (S3/GCS), serverless warehouses, IAM policies, and VPC peering.",
    skillsDescL3: "Provisions data assets via Terraform; monitors cloud compute utilization and sets threshold alerts.",
    knowledgeDescL4: "Comprehensive expertise in multi-region data mesh setups, hybrid lakehouse topologies, and hybrid network egress.",
    skillsDescL4: "Architects enterprise data clouds balancing high availability, multi-tenant isolation, and regulatory boundaries.",
    targetKnowledgeL3: "C",
    targetSkillsL3: "C",
    targetKnowledgeL4: "D",
    targetSkillsL4: "C",
    expectedEvidence: "Terraform/IaC modules, disaster recovery drills, cross-region replication architectures."
  },
  {
    id: "COMP-GOV",
    name: "Data Quality and Governance",
    category: "Governance",
    knowledgeDescL3: "Familiarity with data cataloging, lineage tracking, schema enforcement, and basic SLA monitoring.",
    skillsDescL3: "Implements Great Expectations/Soda quality tests into CI/CD pipelines; tags PII in catalogs.",
    knowledgeDescL4: "Mastery of enterprise data contracts, automated anomaly detection, active metadata management, and compliance governance.",
    skillsDescL4: "Institutes automated contractual testing across producers/consumers; enforces zero-defect production guarantees.",
    targetKnowledgeL3: "C",
    targetSkillsL3: "C",
    targetKnowledgeL4: "D",
    targetSkillsL4: "D",
    expectedEvidence: "Data contract schemas, automated CI test gates, lineage graph integrations."
  },
  {
    id: "COMP-COST",
    name: "Performance and Cost Optimisation",
    category: "Efficiency",
    knowledgeDescL3: "Understands query cost models, slot utilization, table clustering, and caching advantages.",
    skillsDescL3: "Optimizes slow-running queries and converts full-table scans to incremental partitioned updates.",
    knowledgeDescL4: "Advanced FinOps mastery: capacity commitments, cold-tier archival lifecycle policies, and distributed compute cost allocation.",
    skillsDescL4: "Drives organizational FinOps strategies reducing compute spend by 25%+ without impacting downstream SLAs.",
    targetKnowledgeL3: "C",
    targetSkillsL3: "B",
    targetKnowledgeL4: "D",
    targetSkillsL4: "C",
    expectedEvidence: "FinOps dashboard audit reports, documented query runtime/cost reduction case studies."
  },
  {
    id: "COMP-OPS",
    name: "Reliability and Production Operations",
    category: "Operations",
    knowledgeDescL3: "Understands SLO/SLA definitions, pager duty incident response, and root-cause analysis postmortems.",
    skillsDescL3: "Maintains runbooks, debugs production failures, and participates in on-call rotations effectively.",
    knowledgeDescL4: "Champions site reliability engineering for data: automated rollbacks, chaos testing, and MTTR minimization.",
    skillsDescL4: "Establishes org-wide data platform SRE standards; architects self-healing data delivery pipelines.",
    targetKnowledgeL3: "C",
    targetSkillsL3: "C",
    targetKnowledgeL4: "D",
    targetSkillsL4: "D",
    expectedEvidence: "Incident postmortem docs with preventive architectural fixes, automated circuit-breaker configs."
  },
  {
    id: "COMP-SEC",
    name: "Security and Data Privacy",
    category: "Security",
    knowledgeDescL3: "Understands role-based access control (RBAC), KMS encryption at rest/transit, and anonymization hashing.",
    skillsDescL3: "Applies column-level access policies, masks sensitive data, and rotates database credentials safely.",
    knowledgeDescL4: "Deep knowledge of Zero Trust data architectures, differential privacy, tokenization vaults, and GDPR/DPDP requirements.",
    skillsDescL4: "Defines cross-border data residency architectures and security hardening protocols across data platforms.",
    targetKnowledgeL3: "C",
    targetSkillsL3: "B",
    targetKnowledgeL4: "D",
    targetSkillsL4: "C",
    expectedEvidence: "Security audit approvals, tokenization pipeline implementations, role-policy matrix."
  },
  {
    id: "COMP-DEC",
    name: "Problem Solving and Technical Decisions",
    category: "Leadership & Impact",
    knowledgeDescL3: "Demonstrates systematic debugging methodologies, trade-off analysis, and experimental validation.",
    skillsDescL3: "Resolves ambiguous data bugs, documents root cause, and delivers stable solutions within sprint timelines.",
    knowledgeDescL4: "Excels at high-stakes technical decision-making with incomplete information across interdependent systems.",
    skillsDescL4: "Deconstructs ambiguous strategic initiatives into clear multi-quarter architectural roadmaps for engineering teams.",
    targetKnowledgeL3: "C",
    targetSkillsL3: "C",
    targetKnowledgeL4: "D",
    targetSkillsL4: "D",
    expectedEvidence: "Complex incident root cause analyses, technical strategy RFCs, risk-mitigation plans."
  },
  {
    id: "COMP-STAKE",
    name: "Stakeholder Management",
    category: "Collaboration",
    knowledgeDescL3: "Understands business KPIs, requirements elicitation, and clear communication of delivery timelines.",
    skillsDescL3: "Partners with analytics and product leads to translate business requirements into technical specs.",
    knowledgeDescL4: "Strategic business acumen; aligns long-term platform capability with revenue, efficiency, and compliance goals.",
    skillsDescL4: "Influences executive stakeholders, negotiates SLAs with business heads, and steers conflicting priorities to consensus.",
    targetKnowledgeL3: "C",
    targetSkillsL3: "C",
    targetKnowledgeL4: "D",
    targetSkillsL4: "D",
    expectedEvidence: "Cross-functional SLA agreements, business stakeholder commendations, project sign-offs."
  },
  {
    id: "COMP-LEAD",
    name: "Mentoring and Technical Leadership",
    category: "Leadership & Impact",
    knowledgeDescL3: "Values constructive code review standards, pair programming techniques, and shared documentation.",
    skillsDescL3: "Mentors junior engineers on SQL/Python practices; writes comprehensive engineering documentation.",
    knowledgeDescL4: "Inspires technical excellence; defines career growth ladders, leads technical guilds, and uplevels team capability.",
    skillsDescL4: "Sponsors engineer promotions, drives hiring bar calibration, and fosters a high-performing engineering culture.",
    targetKnowledgeL3: "C",
    targetSkillsL3: "B",
    targetKnowledgeL4: "D",
    targetSkillsL4: "D",
    expectedEvidence: "Mentees successfully promoted/graded, technical tech-talks, code review impact statistics."
  }
];

const PAY_BANDS = [
  { id: "PB-L1", level: "L1", min: 5.5, midpoint: 8.0, max: 11.5, effectiveDate: "2026-01-01" },
  { id: "PB-L2", level: "L2", min: 9.0, midpoint: 13.0, max: 18.0, effectiveDate: "2026-01-01" },
  { id: "PB-L3", level: "L3", min: 15.0, midpoint: 21.0, max: 29.0, effectiveDate: "2026-01-01" },
  { id: "PB-L4", level: "L4", min: 25.0, midpoint: 34.0, max: 46.0, effectiveDate: "2026-01-01" },
  { id: "PB-L5", level: "L5", min: 42.0, midpoint: 57.0, max: 75.0, effectiveDate: "2026-01-01" },
  { id: "PB-L6", level: "L6", min: 65.0, midpoint: 85.0, max: 110.0, effectiveDate: "2026-01-01" },
  { id: "PB-L7", level: "L7", min: 95.0, midpoint: 125.0, max: 160.0, effectiveDate: "2026-01-01" },
  { id: "PB-L8", level: "L8", min: 140.0, midpoint: 180.0, max: 240.0, effectiveDate: "2026-01-01" }
];

async function main() {
  console.log("🌱 Starting Database Seed...");

  // Clean existing records in correct relation order
  await prisma.auditLog.deleteMany();
  await prisma.lifecycleEvent.deleteMany();
  await prisma.developmentPlan.deleteMany();
  await prisma.promotionNomination.deleteMany();
  await prisma.employeeCompetency.deleteMany();
  await prisma.competencyDefinition.deleteMany();
  await prisma.performanceRecord.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.jobCode.deleteMany();
  await prisma.jobFamily.deleteMany();
  await prisma.payBand.deleteMany();
  await prisma.team.deleteMany();
  await prisma.businessUnit.deleteMany();

  // 1. Business Unit
  await prisma.businessUnit.create({
    data: {
      id: "BU-01",
      name: "Digital Technologies & Commerce",
      head: "Soma Kiran Gonella",
      hrbp: "Lead HRBP (Interview Simulation)",
      function: "Technology, Operations & Revenue",
      location: "Bengaluru / Hyderabad / Remote",
      active: true
    }
  });

  // 2. Teams
  const teams = [
    { id: "A", name: "Engineering", parentBuId: "BU-01", teamHead: "Arunachalam S.", department: "Core Engineering", location: "Hyderabad" },
    { id: "B", name: "Operations", parentBuId: "BU-01", teamHead: "Bhavna Rao", department: "Global Operations", location: "Bengaluru" },
    { id: "C", name: "Revenue", parentBuId: "BU-01", teamHead: "Chetan Sharma", department: "Revenue & Growth", location: "Mumbai / Remote" }
  ];
  for (const t of teams) {
    await prisma.team.create({ data: t });
  }

  // 3. Pay Bands
  for (const pb of PAY_BANDS) {
    await prisma.payBand.create({ data: pb });
  }

  // 4. Job Families & Job Codes
  const jfData = [
    { id: "JF-DATA", name: "Data Engineering & Analytics", function: "Engineering" },
    { id: "JF-SWE", name: "Software Engineering", function: "Engineering" },
    { id: "JF-OPS", name: "Operations Management", function: "Operations" },
    { id: "JF-REV", name: "Revenue & Sales", function: "Revenue" }
  ];
  for (const jf of jfData) {
    await prisma.jobFamily.create({ data: jf });
  }

  const jobCodes = [
    { id: "A-JR-DATA", jobFamilyId: "JF-DATA", jobRole: "Data Engineer", standardTitle: "Associate Data Engineer", careerLevel: "L1", payBandId: "PB-L1", rolePurpose: "Assists in pipeline maintenance.", accountabilities: "SQL development, unit tests.", requiredKnowledge: "Basic SQL, Python", requiredSkills: "Scripting", decisionScope: "Task level", expectedImpact: "Component delivery" },
    { id: "A-INT-DATA", jobFamilyId: "JF-DATA", jobRole: "Data Engineer", standardTitle: "Senior Associate Data Engineer", careerLevel: "L2", payBandId: "PB-L2", rolePurpose: "Builds ETL tasks.", accountabilities: "DAG authoring, testing.", requiredKnowledge: "SQL, Airflow, PySpark", requiredSkills: "Pipeline engineering", decisionScope: "Feature level", expectedImpact: "Team delivery" },
    { id: "A-SR-DATA", jobFamilyId: "JF-DATA", jobRole: "Data Engineer", standardTitle: "Lead Data Engineer", careerLevel: "L3", payBandId: "PB-L3", rolePurpose: "Owns production pipeline streams.", accountabilities: "Architecture components, troubleshooting, mentoring.", requiredKnowledge: "Distributed systems, modeling", requiredSkills: "End-to-end design", decisionScope: "Workstream", expectedImpact: "System stability" },
    { id: "A-PRIN-DATA", jobFamilyId: "JF-DATA", jobRole: "Data Engineer", standardTitle: "Principal Data Engineer", careerLevel: "L4", payBandId: "PB-L4", rolePurpose: "Platform architecture and technical direction.", accountabilities: "Cross-team design, tech governance, standard setting.", requiredKnowledge: "Enterprise architecture, lakehouses", requiredSkills: "System design, leadership", decisionScope: "Multi-system", expectedImpact: "Org scalability" },
    { id: "A-DIR-DATA", jobFamilyId: "JF-DATA", jobRole: "Data Engineer", standardTitle: "Senior Principal / Director", careerLevel: "L5", payBandId: "PB-L5", rolePurpose: "Functional strategy.", accountabilities: "Strategy, hiring, platform investments.", requiredKnowledge: "Executive technical strategy", requiredSkills: "Org leadership", decisionScope: "Department", expectedImpact: "Business velocity" },
    { id: "A-SR-SOFTW", jobFamilyId: "JF-SWE", jobRole: "Software Engineer", standardTitle: "Senior Software Engineer", careerLevel: "L2", payBandId: "PB-L2", rolePurpose: "Feature development.", accountabilities: "API endpoints, UI logic.", requiredKnowledge: "TypeScript, React, Node", requiredSkills: "Full stack engineering", decisionScope: "Feature", expectedImpact: "User satisfaction" }
  ];
  for (const jc of jobCodes) {
    await prisma.jobCode.create({ data: jc });
  }

  // 5. Competencies
  for (const comp of DATA_ENGINEERING_COMPETENCIES) {
    await prisma.competencyDefinition.create({ data: comp });
  }

  // 6. Load Baseline Data
  const baselinePath = path.join(__dirname, 'baseline_data.json');
  const baselineRaw = fs.readFileSync(baselinePath, 'utf-8');
  const baseline = JSON.parse(baselineRaw);
  const employees = baseline.employees || [];

  console.log(`Loading ${employees.length} employees from baseline...`);

  // Coaches pool for independent developmental assignment
  const coachesPool = [
    "SYN-0050", "SYN-0100", "SYN-0150", "SYN-0200", "SYN-0250",
    "SYN-0005", "SYN-0020", "SYN-0080"
  ];

  for (let i = 0; i < employees.length; i++) {
    const e = employees[i];
    const coachId = coachesPool[i % coachesPool.length];
    const compa = e.band && e.band[1] ? Number((e.pay / e.band[1]).toFixed(3)) : 1.0;

    await prisma.employee.create({
      data: {
        id: e.id,
        name: e.name,
        status: "ACTIVE",
        dateOfJoining: "2024-04-01",
        employmentType: "Full-time",
        location: e.location || "Hyderabad",
        workMode: e.mode || "Hybrid",
        corporateEmail: `${e.name.toLowerCase().replace(/\s+/g, '.')}.syn@zeta-sim.internal`,
        businessUnitId: "BU-01",
        teamId: e.team,
        department: e.team === "A" ? "Engineering" : (e.team === "B" ? "Operations" : "Revenue"),
        jobCodeId: e.jobCode && jobCodes.some(x => x.id === e.jobCode) ? e.jobCode : "A-SR-DATA",
        jobTitle: e.role || "Lead Professional",
        careerLevel: e.level || "L3",
        careerTrack: e.isManager ? "Manager" : "IC",
        reportingManagerId: e.managerId || null,
        coachId: coachId !== e.id ? coachId : "SYN-0050",
        positionId: `POS-${e.id.replace('SYN-', '')}`,
        positionCriticality: e.criticalRole ? "Critical" : "Standard",
        gender: e.gender || "Undisclosed",
        age: e.age || 30,
        tenure: e.tenure || 2.0,
        annualFixedPay: e.pay || 20.0,
        variablePay: Number((e.pay * 0.15).toFixed(2)),
        totalTargetComp: Number((e.pay * 1.15).toFixed(2)),
        compaRatio: compa,
        lastIncrementPct: e.increment || 8.0,
        lastRevisionDate: "2025-04-01",
        orgLayer: e.orgLayer || 4,
        isManager: Boolean(e.isManager),
        span: e.span || 0,
        topTalent: Boolean(e.topTalent),
        highPotential: Boolean(e.potential === 3),
        criticalRole: Boolean(e.criticalRole),
        successionCandidate: Boolean(e.succession),
        retentionPriority: e.flightRisk === "High" ? "High" : "Standard",
        succession: e.succession || null,
        flightRisk: e.flightRisk || "Low",
        currentRating: e.rating || null,
        potential: e.potential || 2,
        pipStatus: null,
        performanceRecords: {
          create: {
            cycle: "FY 2025-26",
            preRating: e.preRating || e.rating,
            finalRating: e.rating,
            potential: e.potential || 2,
            goalQ1: e.goalQ1 || 90.0,
            goalQ2: e.goalQ2 || 88.0,
            goalQ3: e.goalQ3 || 85.0,
            goalQ4: e.goalQ4 || 92.0,
            goalFY: e.goalFY || 90.0,
            reviewLate: Boolean(e.reviewLate),
            reviewWords: e.reviewWords || 100,
            peerInputs: e.peerInputs || 2,
            appeal: Boolean(e.appeal),
            increment: e.increment || 8.0,
            isBaseline: true
          }
        }
      }
    });
  }

  // Pre-populate Competency Assessments for target demonstration candidates
  // Let's seed SYN-0012 as an aspiring L3 Data Engineer who is nominated for L4 promotion!
  const demoCandidateId = "SYN-0012";
  const candidate = await prisma.employee.findUnique({ where: { id: demoCandidateId } });
  if (candidate) {
    // Update role to Data Engineering for clarity in the interview demo
    await prisma.employee.update({
      where: { id: demoCandidateId },
      data: {
        jobTitle: "Lead Data Engineer",
        careerLevel: "L3",
        jobCodeId: "A-SR-DATA"
      }
    });

    console.log(`Setting up competency matrix and promotion nomination for ${demoCandidateId}...`);
    // Sample assessment with realistic gaps (mostly C and B, against L4 requirement of D)
    const gradesMap: Record<string, { k: string, s: string }> = {
      "COMP-SQL": { k: "D", s: "D" }, // Met
      "COMP-ETL": { k: "D", s: "C" }, // Skills gap -1
      "COMP-PYTHON": { k: "D", s: "D" }, // Met
      "COMP-ARCH": { k: "C", s: "B" }, // Gap: K -1, S -2
      "COMP-CLOUD": { k: "D", s: "C" }, // Met
      "COMP-GOV": { k: "C", s: "C" }, // Gap: K -1, S -1
      "COMP-COST": { k: "C", s: "C" }, // Gap: K -1
      "COMP-OPS": { k: "D", s: "D" }, // Met
      "COMP-SEC": { k: "D", s: "C" }, // Met
      "COMP-DEC": { k: "C", s: "C" }, // Gap: K -1, S -1
      "COMP-STAKE": { k: "C", s: "B" }, // Gap: K -1, S -2
      "COMP-LEAD": { k: "C", s: "B" } // Gap: K -1, S -2
    };

    for (const comp of DATA_ENGINEERING_COMPETENCIES) {
      const g = gradesMap[comp.id] || { k: "C", s: "C" };
      await prisma.employeeCompetency.create({
        data: {
          employeeId: demoCandidateId,
          competencyId: comp.id,
          knowledgeGrade: g.k,
          skillsGrade: g.s,
          evidence: "Demonstrated in Q3 Lakehouse migration sprint and technical reviews.",
          assessor: "Arunachalam S. (Manager) & Tech Panel",
          assessedDate: "2026-08-15"
        }
      });
    }

    // Propose an Initial Development Plan for Data Architecture gap
    await prisma.developmentPlan.create({
      data: {
        employeeId: demoCandidateId,
        competencyName: "Data Architecture and System Design",
        currentGrade: "Skills: B / Knowledge: C",
        targetGrade: "Skills: D / Knowledge: D",
        action: "Lead end-to-end architecture design for the Real-time Logistics Telemetry Ingestion Hub under senior staff architect guidance.",
        expectedEvidence: "Approved Architecture Decision Record (ADR-042) and zero-downtime cutover plan.",
        mentorOrCoach: "Soma Kiran Gonella",
        targetDate: "2026-11-30",
        checkpoint: "Monthly architectural review with Lead HRBP and Tech Director",
        status: "IN_PROGRESS"
      }
    });

    // Create a Promotion Nomination record
    await prisma.promotionNomination.create({
      data: {
        employeeId: demoCandidateId,
        fromLevel: "L3",
        toLevel: "L4",
        targetJobCode: "A-PRIN-DATA",
        status: "CALIBRATED",
        managerNominationNotes: "Demonstrated consistent L3 excellence and took ownership of cross-team streaming ingestion pipeline.",
        evidenceNotes: "Authored 3 major RFCs; reduced telemetry latency by 42%; mentored two junior engineers.",
        calibrationNotes: "Panel endorses promotion readiness subject to final verification of architecture leadership.",
        committeeMembers: "Arunachalam S., Bhavna Rao, Soma Kiran Gonella",
        decisionRationale: "Strong technical foundations and demonstrated readiness for multi-system L4 ownership.",
        effectiveDate: "2026-10-01",
        proposedSalary: 34.0
      }
    });
  }

  console.log("✅ Seed completed successfully! Exactly 288 baseline employees initialized.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
