export interface LevelMapping {
  level: string;
  experience: string;
  title: string;
  execution: string;
  organization: string;
  people: string;
  craft: string;
}

export interface BehavioralSubCompetency {
  name: string;
  summary: string;
  indicators: string[];
}

export interface BehavioralPillarLevelData {
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  gradeName: string;
  summaryRow?: string;
  subCompetencies: Record<string, BehavioralSubCompetency>;
}

export interface BehavioralPillar {
  id: string;
  name: string;
  scope: string;
  color: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
  };
  subPillarNames: string[];
  levels: Record<string, BehavioralPillarLevelData>;
}

export interface CraftLevelData {
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
  gradeName: string;
  summary: string;
  knowledge: { title: string; desc: string }[];
  experience: { title: string; desc: string }[];
}

export const PROFICIENCY_SCALE = [
  { grade: 'A', name: 'Awareness / Foundational', desc: 'Works effectively within defined guidelines and best practices. Delivers assigned tasks with guidance.' },
  { grade: 'B', name: 'Working / Applied', desc: 'Applies knowledge independently in familiar contexts. Translates fuzzy problems into structured solutions.' },
  { grade: 'C', name: 'Proficient / Autonomous', desc: 'Autonomous practitioner. Removes ambiguity, mentors juniors, delivers projects via small/mid-sized teams.' },
  { grade: 'D', name: 'Advanced / Strategic', desc: 'Architects scalable systems, drives technical initiatives, resolves systemic issues, leads multi-functional teams.' },
  { grade: 'E', name: 'Expert / Thought Leader', desc: 'Industry-leading expert setting organizational vision, driving enterprise culture, talent strategy & technical roadmap.' }
];

export const MASTER_LEVEL_MAPPING: LevelMapping[] = [
  {
    level: 'L1',
    experience: '1 - 2 Years',
    title: 'Data Engineer I',
    execution: 'A',
    organization: 'A',
    people: '—',
    craft: 'A'
  },
  {
    level: 'L2',
    experience: '2 - 4 Years',
    title: 'Data Engineer II',
    execution: 'B',
    organization: 'A',
    people: 'A',
    craft: 'B'
  },
  {
    level: 'L3',
    experience: '3 - 6 Years',
    title: 'Sr. Data Engineer',
    execution: 'B',
    organization: 'B',
    people: 'B',
    craft: 'C'
  },
  {
    level: 'L4',
    experience: '5 - 9 Years',
    title: 'Lead - Data Engineer / Principal Engineer I',
    execution: 'C',
    organization: 'C',
    people: 'C',
    craft: 'D'
  },
  {
    level: 'L5',
    experience: '8 - 12 Years',
    title: 'Manager - Data Engineer / Principal Engineer II',
    execution: 'D',
    organization: 'C',
    people: 'C',
    craft: 'D'
  },
  {
    level: 'L6',
    experience: '10 - 16 Years',
    title: 'Sr. Manager - Data Engineer / Technical Architect',
    execution: 'D',
    organization: 'D',
    people: 'D',
    craft: 'E'
  },
  {
    level: 'L7',
    experience: '13 - 19 Years',
    title: 'Director - Data Engineer',
    execution: 'E',
    organization: 'D',
    people: 'D',
    craft: 'E'
  },
  {
    level: 'L8',
    experience: '16 - 24 Years',
    title: 'Sr. Director - Data Engineer',
    execution: 'E',
    organization: 'E',
    people: 'E',
    craft: 'E'
  }
];

export const BEHAVIORAL_PILLARS: BehavioralPillar[] = [
  {
    id: 'execution',
    name: 'Execution',
    scope: 'Application of skill and functional expertise that enables groups of Talent to deliver results that are valued',
    color: {
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      text: 'text-sky-900',
      badgeBg: 'bg-sky-100',
      badgeText: 'text-sky-800',
      accent: 'border-l-sky-500'
    },
    subPillarNames: ['Project Management', 'Communication', 'Stakeholder Management'],
    levels: {
      A: {
        grade: 'A',
        gradeName: 'Awareness / Foundational',
        subCompetencies: {
          'Project Management': {
            name: 'Project Management',
            summary: 'Effectively delivers individual assigned tasks',
            indicators: [
              'Ensures limited ambiguity in understanding of the problem statement',
              'Estimates small tasks accurately, and delivers tightly-scoped projects efficiently',
              'Writes effective technical specs outlining approach'
            ]
          },
          'Communication': {
            name: 'Communication',
            summary: 'Communicates effectively to immediate stakeholders',
            indicators: [
              'Consistent in communicating all progress made against assigned tasks',
              'Immediately highlights any deviations related to assigned task and reaches out for assistance'
            ]
          },
          'Stakeholder Management': {
            name: 'Stakeholder Management',
            summary: 'Engages with immediate stakeholders on support, updates and self-development',
            indicators: [
              'Actively seeks, and incorporates constructive feedback',
              'Understands the benefits of collaboration and approaches it with empathy and an open mind'
            ]
          }
        }
      },
      B: {
        grade: 'B',
        gradeName: 'Working / Applied',
        subCompetencies: {
          'Project Management': {
            name: 'Project Management',
            summary: 'Effectively manages and delivers individual tasks and assigned projects',
            indicators: [
              'Does research on various approach options to the problem statement and identifies the most optimal/ viable one',
              'Balances pragmatism vs finesse decision making by taking multiple factors into consideration',
              'Can define and achieve milestones'
            ]
          },
          'Communication': {
            name: 'Communication',
            summary: 'Communicates effectively with the wider team appropriately',
            indicators: [
              'Understands and able to exhibit the intricacies of active listening',
              'Proactively identifies the right channels for communicating specific needs or, hurdles',
              'Supports and polishes the mechanisms that enable feedback sharing'
            ]
          },
          'Stakeholder Management': {
            name: 'Stakeholder Management',
            summary: 'Engages with stakeholders on enabling development, sharing of ideas, learning and value',
            indicators: [
              'Actively seeks to understand context and enable junior members with constructive feedback',
              'Does not hesitate to reach out to internal or, external experts when researching topics, approach options, or, possible hurdles'
            ]
          }
        }
      },
      C: {
        grade: 'C',
        gradeName: 'Proficient / Autonomous',
        subCompetencies: {
          'Project Management': {
            name: 'Project Management',
            summary: 'Effectively delivers projects through the help of a small/mid size team',
            indicators: [
              'Drives scope development and past learnings towards effective management of projects',
              'Ensures cascading of goals from organization to individuals, prioritization and delegation of tasks',
              'Identifies and integrates appropriate project management tools and processes accordingly'
            ]
          },
          'Communication': {
            name: 'Communication',
            summary: 'Facilitates resolution of communication break-downs between stakeholders and practices pre-emptive communication',
            indicators: [
              'Resolves communication difficulties between others',
              'Anticipates and shares schedule deviations well ahead of impact'
            ]
          },
          'Stakeholder Management': {
            name: 'Stakeholder Management',
            summary: 'Manages conflict, expectations and able to build consensus within stakeholders (internal and external)',
            indicators: [
              'Ensures there is a strong alignment within the team in terms of expectations, opportunity and, possible road-blocks',
              'Able to gauge the situation and engage with the team at a professional and personal level'
            ]
          }
        }
      },
      D: {
        grade: 'D',
        gradeName: 'Advanced / Strategic',
        subCompetencies: {
          'Project Management': {
            name: 'Project Management',
            summary: 'Effectively delivers projects with fuzzy problem statements through a large team, and/or with multiple multi-functional stakeholders',
            indicators: [
              'Maintains project objectivity including, the ability to determine the validity of progress made',
              'Integrates the project with cross-functional objectives wherever possible',
              'Able to leverage learnings from past experience to increase efficiencies, speed and value'
            ]
          },
          'Communication': {
            name: 'Communication',
            summary: 'Articulates expectations and accommodates contextual nuances against complex and ambiguous ideas/ problem statements',
            indicators: [
              'Knows how and when to communicate project risks',
              'Communicates recommendations and aligns organization on the trade-offs that are likely to happen',
              'Takes initiatives to ensure there is no ambiguity in the communication over the planned direction, approach and purpose'
            ]
          },
          'Stakeholder Management': {
            name: 'Stakeholder Management',
            summary: 'Collaborates on complex and ambiguous ideas with multiple multi-functional stakeholders across Zeta and the end-customer',
            indicators: [
              'Works with stakeholders on work-arounds for any resource restrictions faced in their teams',
              'Collaborates with other stakeholders to manage any dependencies on other projects and/ or teams'
            ]
          }
        }
      },
      E: {
        grade: 'E',
        gradeName: 'Expert / Thought Leader',
        subCompetencies: {
          'Project Management': {
            name: 'Project Management',
            summary: 'Manages complex transformation projects that impact Zeta which are to be delivered by multiple teams',
            indicators: [
              'Understands and appreciates industry trends and their impact on business',
              'Monitors and responds to market, competition and business changes that can affect the targeted deliverables',
              'Understands and adapts to complex situations with an aim to achieve business goals'
            ]
          },
          'Communication': {
            name: 'Communication',
            summary: 'Influences outcomes at the highest level, and moves beyond mere reporting while setting best practices for others to emulate and build on',
            indicators: [
              'Sets the right precedent and processes for clear communication across teams',
              'Shares the right amount of information with the right people, at the right time',
              'Able to communicate plans, directions and value in approach to CXOs, Board, Industry Experts etc.'
            ]
          },
          'Stakeholder Management': {
            name: 'Stakeholder Management',
            summary: 'Leads and ensures effective cross-functional collaboration across teams of mid-senior level stakeholders',
            indicators: [
              'Considers all constraints and business objectives when planning',
              'Encourages discussions and aligns all teams with the problem statement, approach and expectations',
              'Proactively steps in to support any stakeholder who may be struggling to achieve their expectations'
            ]
          }
        }
      }
    }
  },
  {
    id: 'organization',
    name: 'Organization',
    scope: 'Leading from the front, establishes a purpose, and structure(s) that helps Zeta achieve its business goals.',
    color: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-900',
      badgeBg: 'bg-pink-100',
      badgeText: 'text-pink-800',
      accent: 'border-l-pink-500'
    },
    subPillarNames: ['Org Design', 'Change Management', 'Team Development'],
    levels: {
      A: {
        grade: 'A',
        gradeName: 'Awareness / Foundational',
        summaryRow: 'Supports and defines processes and practices that increase the effectiveness of the organisation',
        subCompetencies: {
          'Org Design': {
            name: 'Org Design',
            summary: 'Actively participates in processes, giving meaningful feedback to help the organization improve',
            indicators: [
              'Actively participates, gives meaningful feedback to improve organisation processes and practices',
              'Reflects and introspects on experience with certain processes and discussions',
              'Confidently discusses processes with new hires',
              'Makes well thought recommendations that enable improvement'
            ]
          },
          'Change Management': {
            name: 'Change Management',
            summary: 'Understands, adapts and aligns to any Organization change programs',
            indicators: [
              'Respects discussions and participates in the transition activities',
              'Reflects and introspects, giving meaningful feedback to assist seamless change',
              'Reaches out for clarity to ensure there is no ambiguity behind the purpose of the change initiative'
            ]
          },
          'Team Development': {
            name: 'Team Development',
            summary: 'Contributes positively to the Culture of Zeta in addition to the job requirements',
            indicators: [
              'Comes across as a conscious, engaged and highly attentive individual by all members',
              'Explicitly displays the traits of Respect, Empathy and Integrity in all interactions'
            ]
          }
        }
      },
      B: {
        grade: 'B',
        gradeName: 'Working / Applied',
        subCompetencies: {
          'Org Design': {
            name: 'Org Design',
            summary: 'Identifies opportunities to improve existing processes and proactively recommends changes that positively affect the team',
            indicators: [
              'Looks at systems and processes across Zeta with an aim to improving efficiencies',
              'Proactively identifies and ropes in resources to close any open threads',
              'Defines meeting structure, frequency basis the team need'
            ]
          },
          'Change Management': {
            name: 'Change Management',
            summary: 'Identifies, discusses and collaborates with individuals/ teams that are impacted by the initiatives seeking improvement',
            indicators: [
              'Observes and validates the impact following any change initiative',
              'Has the foresight to tweak impact following any change to ensure optimal results and experience'
            ]
          },
          'Team Development': {
            name: 'Team Development',
            summary: 'Steps up, builds affinity, and takes concrete actions to promote an inclusive culture',
            indicators: [
              'Understands and advocates the need for diversity in teams and Zeta',
              'Seeks to collaborate with cross-functional stakeholders to work on ideas and initiatives that help Zeta become a great place to work'
            ]
          }
        }
      },
      C: {
        grade: 'C',
        gradeName: 'Proficient / Autonomous',
        subCompetencies: {
          'Org Design': {
            name: 'Org Design',
            summary: 'Builds processes and programs that ease ongoing functional/ Organizational challenges',
            indicators: [
              'Works to define - benchmarks of quality, standard documentation templates, issue resolution',
              'Advocates and creates channels for inter-team communication and collaboration',
              'Solves problems which are overdue at an organisation level'
            ]
          },
          'Change Management': {
            name: 'Change Management',
            summary: 'Engages with key stakeholders to ensure adoption of any new process or, programs that have a positive impact on Zeta and its people',
            indicators: [
              'Understands the purpose of change and advocates its benefits and value',
              'Participates in discussions to convert non-adopters citing value in approach and results'
            ]
          },
          'Team Development': {
            name: 'Team Development',
            summary: 'Contributes towards improving inter-team relations, working culture, and advocates support mechanisms',
            indicators: [
              'Leverages on position to tactfully highlight situations that contravene with Zeta\'s value system',
              'Reaches out and offers tangible support to other teams as and when required',
              'Helps struggling team members improve by identifying the root-cause for under-performance'
            ]
          }
        }
      },
      D: {
        grade: 'D',
        gradeName: 'Advanced / Strategic',
        subCompetencies: {
          'Org Design': {
            name: 'Org Design',
            summary: 'Volunteers to be a significant contributor for organization level initiatives and programs',
            indicators: [
              'Focuses attention and efforts on resolving systemic or, cultural hurdles within Zeta',
              'Takes the leads in incorporating new technology and tools that can resolve current challenges or prepare for tomorrow\'s goals'
            ]
          },
          'Change Management': {
            name: 'Change Management',
            summary: 'Goes beyond surface-level observations and truly examines any organisational issues and the hidden dynamics that contribute to the situation',
            indicators: [
              'Highlights contributors and encourages discussions where bias/ oversights are impacting areas affecting growth',
              'Especially sensitive when such areas are related to recruitment, people growth and career opportunities'
            ]
          },
          'Team Development': {
            name: 'Team Development',
            summary: 'Contributes towards strengthening of the organization culture and the essence of "One Organization, One Team"',
            indicators: [
              'Lives the Zeta values and guards its positive culture',
              'Sets precedents towards selflessness for the team without compromising responsibilities'
            ]
          }
        }
      },
      E: {
        grade: 'E',
        gradeName: 'Expert / Thought Leader',
        subCompetencies: {
          'Org Design': {
            name: 'Org Design',
            summary: 'Leads initiatives and programs that focus on building meaningful processes that will help Zeta scale seamlessly',
            indicators: [
              'Leads initiatives that put "quality" to be a cornerstone of everything that is built in Zeta',
              'Champions the incorporation of new initiatives, processes, and/ or programs that enable Zeta to achieve tomorrow\'s goals',
              'Creates a new function or, identifies capabilities that solve a key challenge in Zeta'
            ]
          },
          'Change Management': {
            name: 'Change Management',
            summary: 'Leads initiatives and builds consensus for change to address systemic issues that are impacting organization growth',
            indicators: [
              'Drives change to enable growth, innovation and collaboration'
            ]
          },
          'Team Development': {
            name: 'Team Development',
            summary: 'Drives initiatives and programs that strengthen the organization culture and the essence of "One Organization, One Team"',
            indicators: [
              'Advocates and drives initiatives aimed towards diversity, inclusivity, empathy, customer-centricity, and fairness'
            ]
          }
        }
      }
    }
  },
  {
    id: 'people',
    name: 'People',
    scope: 'Protecting and Strengthening Zeta\'s culture, value systems and its People by bringing in fantastic Talent, and improving the probability of success.',
    color: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      accent: 'border-l-emerald-500'
    },
    subPillarNames: ['Talent Acquisition', 'Talent Happiness', 'Talent Engagement'],
    levels: {
      A: {
        grade: 'A',
        gradeName: 'Awareness / Foundational',
        subCompetencies: {
          'Talent Acquisition': {
            name: 'Talent Acquisition',
            summary: 'Always looks to bring new Talent into Zeta',
            indicators: [
              'Keeps an eye out for talent within personal network',
              'Understands the hiring bench-marks and how to evaluate candidates at Zeta by shadowing interviews',
              'Keeps abreast of Zeta\'s hiring opportunities',
              'Reaches out to friends and individuals in their network and refers them for open positions'
            ]
          },
          'Talent Happiness': {
            name: 'Talent Happiness',
            summary: 'Acts as a catalyst to create a high energy work environment',
            indicators: [
              'Actively participates in non-work events that allow people to interact and bond',
              'Displays empathy and focuses on issue as against people or event'
            ]
          },
          'Talent Engagement': {
            name: 'Talent Engagement',
            summary: 'Helps new members assimilate into Zeta',
            indicators: [
              'Becomes a buddy to new joiners in their team',
              'Explains internal practices, processes and expectations'
            ]
          }
        }
      },
      B: {
        grade: 'B',
        gradeName: 'Working / Applied',
        subCompetencies: {
          'Talent Acquisition': {
            name: 'Talent Acquisition',
            summary: 'Takes interviews regularly, contributes in making meaningful hiring decisions, and helps build a diverse pipeline',
            indicators: [
              'Ensures consistency in-line with Zeta benchmark',
              'Works towards creating a great candidate experience',
              'Provides feedback to improve efficiency, effectiveness and diversity'
            ]
          },
          'Talent Happiness': {
            name: 'Talent Happiness',
            summary: 'Creates an environment that helps people resolve performance issues with insight, compassion and skill',
            indicators: [
              'Helps people understand the context outside the immediate problem, suggests change and checks in on regular intervals',
              'Celebrates successes, validates the \'right\' efforts made, encourages inter-team bonding',
              'Supports the well-being of the group, and motivates team to maximize potential'
            ]
          },
          'Talent Engagement': {
            name: 'Talent Engagement',
            summary: 'Proactively explores opportunities to develop self and team which can bring value to Zeta (people, organisation or, stakeholders)',
            indicators: [
              'Guides people to become problem solvers as against providing them the solution to the problem',
              'Provides opportunities and space to learn',
              'Shows patience, shares literature and engages in discussion that can aid development'
            ]
          }
        }
      },
      C: {
        grade: 'C',
        gradeName: 'Proficient / Autonomous',
        subCompetencies: {
          'Talent Acquisition': {
            name: 'Talent Acquisition',
            summary: 'Always keen to contribute towards how Zeta can hire better and faster',
            indicators: [
              'Guides and shadows new entrants to ensure they understand Zeta\'s hiring bench-marks',
              'Shares and learns great interviewing techniques',
              'Ensures the integrity of the hiring process is maintained by new joiners'
            ]
          },
          'Talent Happiness': {
            name: 'Talent Happiness',
            summary: 'Promotes maturity while displaying a balanced outlook to any situation that arises',
            indicators: [
              'Promotes calm in stressful situations, and encourages constructive debate for building consensus',
              'Looks to make work fulfilling and abstains from micro-management'
            ]
          },
          'Talent Engagement': {
            name: 'Talent Engagement',
            summary: 'Coaches and contributes to Zeta\'s shared knowledge repository, and recommends tools/ process that can help others',
            indicators: [
              'Looks to break information silos, strives to share learnings from success and failure across teams',
              'Steps in to mentor individuals who have specific long-standing challenges that is hindering growth or, potential ability',
              'Helps draw a performance/ career plan, align priorities, or with appropriate roles in Zeta'
            ]
          }
        }
      },
      D: {
        grade: 'D',
        gradeName: 'Advanced / Strategic',
        subCompetencies: {
          'Talent Acquisition': {
            name: 'Talent Acquisition',
            summary: 'Contributes to ensuring an aspirational and transparent hiring process',
            indicators: [
              'Skilled at uncovering nuanced character attributes during interviews',
              'Excites great candidates on the potential of Zeta',
              'Acts as a tie-break in hiring decisions when decisions are grid-locked'
            ]
          },
          'Talent Happiness': {
            name: 'Talent Happiness',
            summary: 'Creates an environment for peak performance by placing known motivators and removing demotivating factors that inhibit performance',
            indicators: [
              'Creates an environment where people feel good about themselves',
              'Manages smooth team transitions and ensures team members are achieving aspirations',
              'Manages interactions between teams, and conflict while promoting best practices and setting a positive example'
            ]
          },
          'Talent Engagement': {
            name: 'Talent Engagement',
            summary: 'Encourages people to mentor each other, and creates ways to enable this as a culture',
            indicators: [
              'Motivates people to dream big and achieve stretch goals',
              'Recognizes and rewards upon achievement of these goals',
              'Leads initiatives to define content for skills/ learning, works with stakeholders to attract expert speakers'
            ]
          }
        }
      },
      E: {
        grade: 'E',
        gradeName: 'Expert / Thought Leader',
        subCompetencies: {
          'Talent Acquisition': {
            name: 'Talent Acquisition',
            summary: 'Defines impactful policy and goals around hiring, tracks industry trends to identify capabilities that can improve Zeta',
            indicators: [
              'Works with stakeholders to define recruitment philosophy and strategy',
              'Keeps track of exciting talent that can be a game-changer for Zeta',
              'Always looks to widen the possible talent pool'
            ]
          },
          'Talent Happiness': {
            name: 'Talent Happiness',
            summary: 'Creates open and transparent communication channels, helps to resolves complex, or persistent organizational conflict at senior levels',
            indicators: [
              'Builds trust, repairs broken team dynamics, advocates the behavior of ownership and builds harmony',
              'Takes control of dysfunctional teams and helps them navigate through any chaos',
              'Helps teams and individuals channel any negative incidents into positive focus and ownership'
            ]
          },
          'Talent Engagement': {
            name: 'Talent Engagement',
            summary: 'Establishes vision, purpose, and transparency in leadership. Fosters great management practices - Guides, supports and aligns people to Zeta goals',
            indicators: [
              'Instills and promotes a culture of learning and development across Zeta as an organization',
              'Creates structures that promote, incentivize and recognize mentorship initiatives, Guides and mentors other early-stage mentors',
              'Identifies programs that build Zeta\'s leadership capabilities and pipeline'
            ]
          }
        }
      }
    }
  }
];

export const CRAFT_DATA_ENGINEERING: Record<string, CraftLevelData> = {
  A: {
    grade: 'A',
    gradeName: 'Awareness / Foundational',
    summary: 'Works effectively within defined guidelines and best practices',
    knowledge: [
      {
        title: 'Technical Knowledge & ETL Tools',
        desc: 'Strong SQL Skills, Knowledge of ETL processes and tools like DBT, Data Integration Pipelines and workflows using tools like NiFi, AWS Glue and Airflow'
      },
      {
        title: 'Warehousing & Data Lakes',
        desc: 'Understanding concepts of data warehousing and data lakes. Familiarity with technologies like Redshift, BigQuery and knowledge of data partitioning and data distribution'
      },
      {
        title: 'Tooling, Observability & CI/CD',
        desc: 'Familiarity with version control systems like GIT and configuration management tools. Monitoring and logging tools like Prometheus, Elasticsearch, Fluentd, Kibana'
      },
      {
        title: 'Scripting & Programming',
        desc: 'Proficiency in languages like Python, Java and shell scripting'
      }
    ],
    experience: [
      {
        title: 'Methodology and Process',
        desc: 'Understands the data integration pipelines, troubleshooting and performance'
      }
    ]
  },
  B: {
    grade: 'B',
    gradeName: 'Working / Applied',
    summary: 'Uses expertise, and reasoning to identify strengths and weaknesses of alternative solutions, conclusions, or approaches to problems. Translates fuzzy problem in assigned area into a formalized structure',
    knowledge: [
      {
        title: 'Data Modeling & Optimization',
        desc: 'Understanding data modeling techniques, Strong SQL skills, proficient in writing complex SQL queries, optimizing query performance'
      },
      {
        title: 'Data Quality and Validation',
        desc: 'Data quality principles and techniques, including validating data integrity, performing data cleansing and data validation checks, and implementing data quality controls throughout the data pipeline.'
      },
      {
        title: 'Data Governance and Security',
        desc: 'Data governance principles and security best practices, data privacy regulations, data access controls, and encryption techniques to ensure data security and compliance.'
      },
      {
        title: 'Integration with Data Pipelines',
        desc: 'Integrating monitoring and alert mechanisms into data pipelines to track health and performance.'
      }
    ],
    experience: [
      {
        title: 'Organization Skills',
        desc: 'Collaborate with cross-functional stakeholders on defined milestones'
      }
    ]
  },
  C: {
    grade: 'C',
    gradeName: 'Proficient / Autonomous',
    summary: 'Understands the product strategy, varying opinions, and removes ambiguity by incorporating details from interactions into product deployment plans and reports; drawing appropriate conclusions using previous experiences and knowledge',
    knowledge: [
      {
        title: 'Deep Technical Pipeline Expertise',
        desc: 'Deep technical expertise in designing and implementing complex data pipelines. Experience with distributed data processing frameworks like Apache Spark or Apache Flink, stream processing systems like Apache Kafka, and data orchestration tools like Apache Airflow and NiFi. Experience with large-scale data processing, data transformations, and data integration across different data sources.'
      },
      {
        title: 'Scalability & Performance Optimization',
        desc: 'Optimizing the performance and scalability of data pipelines and systems, knowledge of partitioning strategies, data shuffling techniques, and optimization of data processing workflows.'
      },
      {
        title: 'Automation & Custom Tooling',
        desc: 'Experience with advanced scripting, using frameworks, libraries, and APIs to develop custom tools and automation solutions.'
      },
      {
        title: 'Incident Response & Root Cause Analysis',
        desc: 'Ability to handle complex incidents, perform root cause analysis, and provide solutions for system failures or disruptions. Advanced troubleshooting skills, collaboration with other teams, and a focus on incident response and resolution.'
      },
      {
        title: 'Security & Governance Enforcement',
        desc: 'Good understanding of security best practices, data governance, and compliance regulations.'
      }
    ],
    experience: [
      {
        title: 'Organization Skills',
        desc: 'Collaborate with stakeholders on fuzzy problems and approach'
      },
      {
        title: 'Stakeholder Management',
        desc: 'Interpret and communicate technical and business objectives and challenges'
      },
      {
        title: 'Prioritization and Negotiation Skills',
        desc: 'Attain consensus in approach and attention; balance decisions between evidence-based research and self opinion'
      },
      {
        title: 'Mentorship & Code Governance',
        desc: 'Mentor junior resources, conduct code reviews, collaborate with team members in solving problems and help leadership to make decisions.'
      }
    ]
  },
  D: {
    grade: 'D',
    gradeName: 'Advanced / Strategic',
    summary: 'Architecture and Design: Architect scalable, reliable, and cost-effective data platforms and systems. In-depth understanding of data governance frameworks, compliance regulations, and data privacy laws. Big data processing and experience with cloud-native data storage and querying services like Trino, AWS Athena, Delta Lake, and other Hadoop-based technologies. Experience with designing and implementing data ingestion, storage, and retrieval requirements for efficient data processing, complex ETL processes, data mapping, data aggregation, and data normalization techniques.',
    knowledge: [
      {
        title: 'Architecture & Scalable Design',
        desc: 'Architect scalable, reliable, and cost-effective data platforms and systems. In-depth understanding of data governance frameworks, compliance regulations, and data privacy laws. Big data processing with cloud-native storage/query engines like Trino, AWS Athena, Delta Lake, and Hadoop ecosystems.'
      },
      {
        title: 'Metrics & SLA Management',
        desc: 'Understand, define, measure and optimize relevant metrics, SLAs of various components and processes.'
      },
      {
        title: 'Performance Engineering & Optimization',
        desc: 'Advanced skills in performance engineering and optimization. Analyzing system performance, identifying bottlenecks, and implementing solutions to improve application and infrastructure performance.'
      },
      {
        title: 'Incident Response & Problem Management',
        desc: 'Strong grasp of incident response and problem management processes. Lead and coordinate incident response efforts, conduct post-incident reviews, and drive improvements to prevent similar incidents in the future.'
      },
      {
        title: 'Disaster Recovery & FinOps',
        desc: 'Disaster recovery and managing cloud infrastructure including financial impacts and cloud cost governance.'
      }
    ],
    experience: [
      {
        title: 'Technical Leadership',
        desc: 'Ability to guide and influence team members, provide architectural direction, and drive technical initiatives within the organization. Ownership of complex projects and leading their successful implementation.'
      },
      {
        title: 'Organization Skills',
        desc: 'Lead initiatives to break large fuzzier problems into small tractable pieces.'
      },
      {
        title: 'Prioritization & Negotiation Skills',
        desc: 'Attain acceptability and suitability of data engineering strategies across stakeholders.'
      },
      {
        title: 'Methodologies and Process',
        desc: 'Ability to build, implement and direct data engineering principles including SLAs for company\'s own product suite and external vendors.'
      },
      {
        title: 'Stakeholder Management & Vendors',
        desc: 'Can build strategic partnerships with external vendors.'
      },
      {
        title: 'Business and Financial Acumen',
        desc: 'Deep understanding of the business landscape and financial implications. Decision making that aligns with business objectives, manage budgets effectively, and evaluate the return on investment (ROI) for technical initiatives.'
      }
    ]
  },
  E: {
    grade: 'E',
    gradeName: 'Expert / Thought Leader',
    summary: 'Is an industry-leading expert or, sets a strategic direction for the Data Science Organization',
    knowledge: [
      {
        title: 'Deep Technical Expertise',
        desc: 'Solid foundation in the core technologies and concepts relevant to the Zeta\'s tech stack. Making decisions about the selection of appropriate big data processing technologies, defining enterprise scale data architecture, handling large volumes of data, and architecting solutions that support the organization\'s data-driven initiatives.'
      },
      {
        title: 'Data Engineering Thought Leadership',
        desc: 'Thought leader in the field of data engineering, deep understanding of emerging trends, technologies, and best practices in data engineering.'
      }
    ],
    experience: [
      {
        title: 'Technical Leadership',
        desc: 'Thought leader in the field of data engineering. Driving the overall technical strategy of the organization. Making critical technical decisions and influencing the direction of the team and projects.'
      },
      {
        title: 'Organization Skills',
        desc: 'Define the strategy, methodology, discipline and framework. Align the goals and objectives of teams managed with the broader organizational strategy.'
      },
      {
        title: 'Data-driven Decision Making & Impact Assessment',
        desc: 'Strong focus on data-driven decision making. Ability to analyze and interpret data to provide actionable insights to business stakeholders. Able to measure the impact of data engineering initiatives, conduct performance assessments, and identify areas for improvement.'
      },
      {
        title: 'Stakeholder Management',
        desc: 'Building and maintaining relationships with stakeholders across different teams and departments, understanding their needs and expectations, and effectively managing their requirements.'
      },
      {
        title: 'Change Management',
        desc: 'Manage and lead your team through organizational changes, new initiatives, or process improvements. This includes effectively communicating changes, addressing concerns, and helping the team adapt to new ways of working. Foster a culture of continuous improvement.'
      }
    ]
  }
};
