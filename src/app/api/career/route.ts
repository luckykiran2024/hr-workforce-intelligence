import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEFAULT_PAY_BANDS } from '@/lib/compensation';

const CAREER_LEVELS = [
  {
    level: "L1",
    title: "Data Engineer I",
    track: "IC Track",
    purpose: "Executes foundational data engineering tasks under structured supervision; develops technical fluency in SQL, ETL pipelines (Airflow, DBT), and data warehouse concepts.",
    knowledge: "Strong SQL skills, basic ETL concepts, DBT, workflows (Airflow, Glue, NiFi), data warehouse/lake fundamentals, GIT, Python.",
    skills: "Routine data pipeline development, basic data transformations, and bug fixes with guidance.",
    complexity: "Well-defined, low ambiguity tasks with clear technical specifications.",
    decisionScope: "Component level with supervisor code review and guidance.",
    accountability: "Timely delivery and quality of individual assigned pipeline tasks.",
    impact: "Sub-team data pipeline reliability and sprint task completion.",
    stakeholders: "Direct peers, senior engineers, and immediate lead.",
    leadership: "Personal effectiveness, rapid self-learning, and adherence to engineering standards.",
    contribution: "Reliable task completion and active contribution to team knowledge."
  },
  {
    level: "L2",
    title: "Data Engineer II",
    track: "IC Track",
    purpose: "Independently delivers standard data pipelines, data models, and queries; troubleshoots operational defects and ensures data quality validation.",
    knowledge: "Data modeling techniques, complex SQL query optimization, data quality principles, data governance & security best practices, pipeline observability.",
    skills: "Builds and tests end-to-end data pipelines, implements automated validation checks, and optimizes query performance.",
    complexity: "Translates fuzzy problems in assigned area into structured pipeline solutions.",
    decisionScope: "Feature implementation, pipeline scheduling, and query optimization decisions.",
    accountability: "Data integrity, pipeline uptime, and test coverage across assigned datasets.",
    impact: "Squad-level data availability, pipeline efficiency, and SLA compliance.",
    stakeholders: "Data analysts, squad peers, QA, and pod lead.",
    leadership: "Supports onboarding of junior associates, shares feedback, and buddies new hires.",
    contribution: "Consistent sprint velocity, clean modular code, and reliable data delivery."
  },
  {
    level: "L3",
    title: "Sr. Data Engineer",
    track: "IC Track",
    purpose: "Owns end-to-end distributed data pipelines, streaming architectures (Kafka, Spark/Flink), and performance scalability; mentors junior resources.",
    knowledge: "Deep technical expertise in Spark/Flink, Kafka, Airflow/NiFi, large-scale data processing, partitioning/shuffling techniques, root-cause incident analysis.",
    skills: "Architects scalable pipelines, performs advanced incident troubleshooting, conducts code reviews, and automates operational workflows.",
    complexity: "Removes ambiguity from product deployment plans; handles complex multi-system failures.",
    decisionScope: "Pipeline design, framework selection, data partitioning strategy, and tech debt prioritization.",
    accountability: "Pipeline SLAs, data accuracy, processing performance, and squad uptime.",
    impact: "Multi-pipeline scalability, performance optimization, and cross-team data reliability.",
    stakeholders: "Product managers, analytics engineers, data scientists, and engineering leadership.",
    leadership: "Technical mentoring, conducting thorough code reviews, and guiding junior engineers in problem solving.",
    contribution: "High-throughput data platforms, defect prevention, and robust engineering best practices."
  },
  {
    level: "L4",
    title: "Principal Engineer I / Lead",
    track: "Dual Track: Principal Engineer I (IC) | Lead (Management)",
    purpose: "Architects scalable, reliable data platforms and systems (Trino, Athena, Delta Lake) as Principal Engineer I, or leads multi-engineer sprint pods and delivery as Lead.",
    knowledge: "Platform architecture, cloud-native storage/query engines, metrics/SLAs, performance engineering, incident problem management, FinOps.",
    skills: "Designs enterprise data platforms, defines SLAs, leads technical initiatives, or manages sprint delegation and pod velocity.",
    complexity: "High ambiguity, large fuzzy problems broken into tractable modules, cross-squad dependencies.",
    decisionScope: "Platform architecture, data governance frameworks, cloud resource budgeting, and pod work-arounds.",
    accountability: "Data platform resilience, architectural standards, SLA attainment, and pod delivery velocity.",
    impact: "Cross-squad pipeline efficiency, reusable data framework components, and platform scalability.",
    stakeholders: "Product managers, engineering managers, vendor partners, and cross-functional teams.",
    leadership: "Provides architectural direction, leads complex project implementation, and mentors L1-L3 talent.",
    contribution: "Enterprise data platform infrastructure and robust pod delivery execution."
  },
  {
    level: "L5",
    title: "Principal Engineer II / Engineering Manager",
    track: "Dual Track: Principal Engineer II (IC) | Engineering Manager (Management)",
    purpose: "Sets strategic domain data architecture and technological direction as Principal Engineer II, or manages people, hiring, and squad execution as Engineering Manager.",
    knowledge: "Enterprise big data processing technologies, data platform governance, managerial people leadership, and budget management.",
    skills: "Architects solutions supporting enterprise data initiatives, manages team performance, resolves conflicts, and builds high-performing squads.",
    complexity: "Enterprise-wide architectural trade-offs or complex supervisory spans with multiple deliverables.",
    decisionScope: "Domain architecture, team resource allocation, performance calibrations, and vendor SLA decisions.",
    accountability: "Data platform SLAs, organizational health, talent growth, and operational performance.",
    impact: "Strategic organizational capability, business intelligence acceleration, and team high-performance culture.",
    stakeholders: "Directors, Business Unit Heads, and senior product leadership.",
    leadership: "Drives organizational change, sponsors senior engineers, and builds leadership pipeline.",
    contribution: "Strategic technological leverage, talent retention, and sustained delivery excellence."
  },
  {
    level: "L6",
    title: "Technical Architect / Sr. Manager",
    track: "Dual Track: Technical Architect (IC Pinnacle) | Sr. Manager (Management)",
    purpose: "Acts as highest technical individual contributor governing enterprise architecture standards as Technical Architect, or leads multi-team data portfolios as Sr. Manager.",
    knowledge: "Industry-leading data architecture, emerging technologies, enterprise governance, and multi-team organizational leadership.",
    skills: "Drives enterprise-scale data transformations, multi-team org design, and executive stakeholder alignment.",
    complexity: "Multi-departmental data platform dependencies, enterprise scalability, and systemic organization challenges.",
    decisionScope: "Enterprise data stacks, cloud infrastructure spend, departmental structure, and technical strategy.",
    accountability: "Enterprise data resilience, architectural compliance, and portfolio execution outcomes.",
    impact: "Industry-defining data engineering standards, corporate data governance, and strategic platform leverage.",
    stakeholders: "C-level executives, Business Unit Heads, and Directors.",
    leadership: "Thought leader in data engineering; mentors managers and principal engineers across the business unit.",
    contribution: "Sustainable competitive advantage, enterprise data assets, and robust organizational scalability."
  },
  {
    level: "L7",
    title: "Director",
    track: "Management Track (Director — No IC Track)",
    purpose: "Directs organizational data engineering strategy, sets vision and goals for the Data Science Organization, and governs capital allocation.",
    knowledge: "Executive business acumen, large-scale organizational dynamics, talent acquisition philosophy, and corporate strategy.",
    skills: "Sets data organization vision, leads organizational change, eliminates systemic roadblocks, and builds executive talent pipelines.",
    complexity: "High-level strategic ambiguity, market competition, and executive business alignment.",
    decisionScope: "Department-wide data strategy, headcount budgets, leadership appointments, and technology partnerships.",
    accountability: "Total data engineering delivery, budget governance, and organizational health.",
    impact: "Enterprise data capability, executive decision enablement, and institutional business growth.",
    stakeholders: "Executive Committee, BU Heads, and enterprise partners.",
    leadership: "Directs Sr. Managers, mentors future directors, and champions an inclusive high-performance culture.",
    contribution: "Strategic organizational transformation and executive stewardship."
  },
  {
    level: "L8",
    title: "Sr. Director",
    track: "Management Track (Sr. Director — No IC Track)",
    purpose: "Commands enterprise data & workforce strategy, executive succession slates, and board-level technology governance.",
    knowledge: "Visionary industry acumen, board-level alignment, global workforce architecture, and enterprise transformation.",
    skills: "Orchestrates multi-functional business units, establishes long-term technology roadmaps, and drives enterprise culture.",
    complexity: "Enterprise survival, corporate portfolio strategy, and executive governance.",
    decisionScope: "Business unit roadmap, multi-department capital allocation, and executive hiring.",
    accountability: "Total business unit P&L enablement and enterprise leadership pipeline.",
    impact: "Company-wide industry standing, enterprise shareholder value, and long-term organizational endurance.",
    stakeholders: "C-suite, Board of Directors, and global functional heads.",
    leadership: "Directs functional Directors and mentors senior executive successors.",
    contribution: "Enduring corporate capability and industry-defining leadership."
  }
];

export async function GET() {
  try {
    const competencies = await prisma.competencyDefinition.findMany({
      orderBy: { id: 'asc' }
    });

    const jobCodes = await prisma.jobCode.findMany({
      include: { jobFamily: true, payBand: true }
    });

    const employeesByLevelRaw = await prisma.employee.groupBy({
      by: ['careerLevel'],
      _count: { id: true }
    });

    const levelCounts: Record<string, number> = {};
    employeesByLevelRaw.forEach(l => {
      levelCounts[l.careerLevel] = l._count.id;
    });

    return NextResponse.json({
      success: true,
      levels: CAREER_LEVELS,
      payBands: DEFAULT_PAY_BANDS,
      competencies,
      jobCodes,
      levelCounts
    });
  } catch (error: any) {
    console.error('Error fetching career architecture:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
