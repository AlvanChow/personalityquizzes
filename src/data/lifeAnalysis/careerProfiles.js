/**
 * Career & Work profiles keyed by O-E-C levels.
 *
 * Key format: "{Openness}-{Extraversion}-{Conscientiousness}"
 * Levels: L (0-35), M (36-65), H (66-100)
 *
 * Each profile contains:
 *   summary  – holistic 2-3 sentence career analysis
 *   careers  – array of 4-6 specific career titles
 *   items    – 3-4 actionable bullets (strengths, watch-outs, tips)
 */

const careerProfiles = {
  // ── High Openness ──────────────────────────────────────────────
  'H-H-H': {
    summary:
      'You combine creative vision with social magnetism and strong follow-through — a rare trifecta. You are built for leadership roles in innovation-driven environments where you can rally a team around a bold idea and actually ship it.',
    careers: ['Product Manager', 'Creative Director', 'Startup Founder', 'Brand Strategist', 'Film Producer'],
    items: [
      'Your superpower is selling a vision AND executing on it — most people can only do one.',
      'You risk over-committing to too many ambitious projects. Pick two priorities per quarter, not five.',
      'Seek organizations that reward initiative over seniority — you will suffocate in rigid hierarchies.',
    ],
  },
  'H-H-M': {
    summary:
      'You are a natural brainstormer and collaborator who thrives in creative, team-oriented settings. You generate original ideas in conversation and are most productive when surrounded by smart people — structure follows naturally when you care about the outcome.',
    careers: ['UX Designer', 'Marketing Director', 'Innovation Consultant', 'Documentary Filmmaker', 'Design Thinking Facilitator'],
    items: [
      'Your best ideas emerge in dialogue — seek roles with regular brainstorming and collaborative design.',
      'Without external deadlines, momentum can stall. Use project management tools or pair with a detail-oriented partner.',
      'Freelance or agency work suits your mix of creativity and social energy better than corporate R&D.',
    ],
  },
  'H-H-L': {
    summary:
      'You are a big-picture creative who energizes rooms and generates more ideas than you can execute. You thrive in fast-moving, social environments where inspiration matters more than process — but finishing is your growth edge.',
    careers: ['Improv Performer', 'Event Producer', 'Social Media Strategist', 'Community Manager', 'Talent Agent'],
    items: [
      'You light up brainstorms and pitch meetings — roles where first impressions and energy matter are your sweet spot.',
      'Avoid roles with heavy documentation or process requirements — they will drain you before you produce results.',
      'Partner with someone organized. Your ideas plus their follow-through is a powerful combination.',
    ],
  },
  'H-M-H': {
    summary:
      'You blend deep creative thinking with disciplined execution. You can work both collaboratively and independently, making you effective in roles that require sustained intellectual effort with occasional team interaction.',
    careers: ['Software Architect', 'Research Scientist', 'Game Designer', 'Patent Attorney', 'Curriculum Developer'],
    items: [
      'You do your best work with long, uninterrupted focus blocks followed by collaborative check-ins.',
      'Seek roles where quality and originality are measured, not just output volume.',
      'Your discipline lets you finish ambitious creative projects others abandon — use this as a competitive advantage.',
    ],
  },
  'H-M-M': {
    summary:
      'You are a versatile creative thinker comfortable in most work environments. You adapt well to both team and solo work, bringing imagination without being impractical. You are drawn to work with meaning and variety.',
    careers: ['UX Researcher', 'Content Strategist', 'Instructional Designer', 'Museum Curator', 'Landscape Architect'],
    items: [
      'You thrive in roles that mix creative problem-solving with moderate structure — too rigid or too chaotic will frustrate you.',
      'Your adaptability is valuable but can lead to career drift. Set a clear 3-year direction and revisit it annually.',
      'Side projects and creative hobbies keep you energized — protect time for them even when work gets busy.',
    ],
  },
  'H-M-L': {
    summary:
      'You are an idea-driven generalist who values freedom over structure. You work best when you can explore new angles without rigid deadlines or micromanagement. Traditional career ladders feel suffocating — you need autonomy.',
    careers: ['Freelance Writer', 'Indie Game Developer', 'Art Therapist', 'Travel Photographer', 'Podcast Host'],
    items: [
      'Freelance, contract, or portfolio careers suit you better than traditional employment.',
      'Build a lightweight system (weekly reviews, simple task lists) to keep your best ideas from evaporating.',
      'Your challenge is not generating opportunities — it is choosing which ones to commit to.',
    ],
  },
  'H-L-H': {
    summary:
      'You are a focused, independent creative with exceptional discipline. You produce deep, original work in solitude and follow through relentlessly. You suit roles where quality matters more than networking.',
    careers: ['Research Scientist', 'Technical Writer', 'Data Scientist', 'Novelist', 'Forensic Accountant'],
    items: [
      'Remote or independent work arrangements let you operate at your best — protect your focus time fiercely.',
      'Your combination of creativity and discipline is rare — long-term projects like books, research, or complex systems are realistic goals.',
      'Build a small, trusted professional network. Your work speaks for itself, but visibility still matters for advancement.',
    ],
  },
  'H-L-M': {
    summary:
      'You are a quiet creative who does your best thinking alone. You gravitate toward intellectual, idea-rich work but prefer to engage at your own pace rather than being locked into rigid processes or constant collaboration.',
    careers: ['Academic Researcher', 'Illustrator', 'Music Composer', 'Archival Scientist', 'Data Visualization Designer'],
    items: [
      'Seek roles with protected deep-work time. Open-plan offices and back-to-back meetings will undercut your best output.',
      'You may undervalue your ideas because you are not inclined to promote them — practice sharing work before it feels "ready."',
      'Structured creative practices (daily writing, scheduled sketching) channel your imagination more effectively than waiting for inspiration.',
    ],
  },
  'H-L-L': {
    summary:
      'You are a free-spirited, independent thinker who resists both social pressure and structural constraint. You need maximum creative autonomy and will struggle in environments that demand conformity or constant teamwork.',
    careers: ['Fine Artist', 'Independent Musician', 'Freelance Photographer', 'Philosophy Researcher', 'Indie Film Director'],
    items: [
      'Your ideal work barely feels like work — it is deeply personal creative expression. Pursue it, but plan financially.',
      'Discipline is your bottleneck, not talent. Even a 30-minute daily creative practice compounds dramatically over a year.',
      'Build income streams that do not require constant self-promotion — passive royalties, licensing, or grant-funded work.',
    ],
  },

  // ── Mid Openness ───────────────────────────────────────────────
  'M-H-H': {
    summary:
      'You are a high-performing team player who balances creativity with pragmatism. You lead effectively, execute reliably, and bring just enough innovation to improve systems without blowing them up.',
    careers: ['Management Consultant', 'Operations Director', 'Healthcare Administrator', 'Program Manager', 'Business Analyst'],
    items: [
      'You are the person organizations hire to fix things — you can diagnose problems and implement solutions.',
      'Your pragmatic creativity is rare in leadership. Lean into roles where you can improve existing systems, not build from scratch.',
      'You may plateau if you avoid risk. Periodically take on a project outside your comfort zone to keep growing.',
    ],
  },
  'M-H-M': {
    summary:
      'You are socially skilled and practically minded — comfortable leading teams, managing clients, and navigating workplace politics. You bring a balanced perspective that makes you effective across many industries.',
    careers: ['Account Manager', 'Human Resources Director', 'Public Relations Manager', 'Sales Director', 'Corporate Trainer'],
    items: [
      'People-facing roles with variety suit you well — you read rooms accurately and adapt your approach.',
      'You are effective in most work cultures, which is a strength — but make sure you actively choose your career path rather than drifting into whatever comes along.',
      'Your people skills are your primary career asset. Invest in them deliberately through negotiation and leadership training.',
    ],
  },
  'M-H-L': {
    summary:
      'You are a sociable, spontaneous generalist who thrives on variety and human connection. You excel in roles where energy, charisma, and adaptability matter more than detailed planning.',
    careers: ['Real Estate Agent', 'Event Coordinator', 'Bartender-turned-Owner', 'Recruiter', 'Tour Guide'],
    items: [
      'Roles with high social contact and low repetition play to your strengths — avoid desk-heavy, process-driven work.',
      'Your spontaneity is appealing but can undermine reliability. Build simple habits around follow-up and follow-through.',
      'Consider entrepreneurship in service industries where your people skills create direct business value.',
    ],
  },
  'M-M-H': {
    summary:
      'You are a reliable, balanced professional who excels through consistency and competence. You may not be the flashiest person in the room, but you are the one people trust to deliver.',
    careers: ['Project Manager', 'Financial Analyst', 'Supply Chain Manager', 'Quality Assurance Lead', 'Civil Engineer'],
    items: [
      'Your steadiness and follow-through are career superpowers in fields that reward reliability over flair.',
      'Seek clear advancement paths — you thrive when expectations are defined and promotions are merit-based.',
      'Guard against complacency. Your competence can keep you comfortable in roles you have outgrown.',
    ],
  },
  'M-M-M': {
    summary:
      'You are a genuine generalist — adaptable, balanced, and capable across a wide range of work. Your flexibility is an asset, but it also means your career path may feel less obvious than it does for people with more extreme profiles.',
    careers: ['Product Owner', 'Business Development Manager', 'Nonprofit Program Director', 'Urban Planner', 'Technical Project Manager'],
    items: [
      'Your strength is adaptability — you can succeed in almost any reasonable work environment.',
      'The risk of balance is directionlessness. Pick a domain and develop deep expertise to anchor your versatility.',
      'Seek roles that explicitly reward cross-functional thinking — your breadth becomes a competitive edge in complex organizations.',
    ],
  },
  'M-M-L': {
    summary:
      'You are adaptable and easygoing, comfortable with ambiguity but sometimes lacking the structure to capitalize on your potential. You work well when the environment provides just enough scaffolding.',
    careers: ['Junior Account Executive', 'Retail Buyer', 'Social Media Coordinator', 'Restaurant Manager', 'Customer Success Representative'],
    items: [
      'Find workplaces that provide structure for you — external accountability systems help you perform at your best.',
      'Avoid roles that require long-term solo project management unless you build habits around task tracking.',
      'Your easygoing nature makes you a great team member. Lean into collaborative roles where the team creates the structure.',
    ],
  },
  'M-L-H': {
    summary:
      'You are a quiet, disciplined professional who gets things done without needing the spotlight. You bring reliability and focus to independent work and prefer clear expectations over ambiguous creative mandates.',
    careers: ['Accountant', 'Database Administrator', 'Lab Technician', 'Actuary', 'Compliance Officer'],
    items: [
      'Your reliability in independent, detail-oriented work makes you invaluable in fields that reward precision.',
      'You do not need to be more social to advance — seek organizations that promote on competence, not visibility.',
      'Remote work is your friend. It eliminates the social overhead that drains your energy without adding value.',
    ],
  },
  'M-L-M': {
    summary:
      'You are a quiet pragmatist who prefers steady, independent work. You are neither driven by novelty nor rigid about routine — you want reasonable work that respects your need for space and autonomy.',
    careers: ['Bookkeeper', 'Technical Support Specialist', 'Veterinary Technician', 'Surveyor', 'Pharmacy Technician'],
    items: [
      'Roles with moderate complexity and low social demands suit you well — avoid high-pressure client-facing positions.',
      'Your calm, reliable nature is an asset in support and technical roles where others provide the strategic direction.',
      'Identify one skill to deepen this year — your pragmatism means you will follow through once you commit.',
    ],
  },
  'M-L-L': {
    summary:
      'You prefer quiet, low-pressure work with minimal supervision and low social demand. You are drawn to roles where you can work at your own pace without performance theater.',
    careers: ['Library Assistant', 'Data Entry Specialist', 'Warehouse Coordinator', 'Groundskeeper', 'Night Auditor'],
    items: [
      'Low-stimulation environments where you can work independently and predictably are your best fit.',
      'Your challenge is momentum — without external structure, productivity can stall. Simple daily checklists help enormously.',
      'Consider trades or technical certifications that provide clear skills and portable employability without requiring self-promotion.',
    ],
  },

  // ── Low Openness ───────────────────────────────────────────────
  'L-H-H': {
    summary:
      'You are a disciplined, people-oriented leader who values proven methods. You excel at managing teams, running operations, and scaling systems — you are the person who makes organizations actually work.',
    careers: ['Operations Manager', 'Military Officer', 'Hospital Administrator', 'Bank Manager', 'Franchise Owner'],
    items: [
      'Your combination of social skill and discipline makes you a natural manager in structured industries.',
      'You build trust through consistency and follow-through — people know exactly what to expect from you.',
      'Your resistance to novelty can slow necessary change. Schedule quarterly "what could we do differently?" reviews.',
    ],
  },
  'L-H-M': {
    summary:
      'You are a sociable, practical professional who excels at relationship-driven work. You build trust quickly and maintain reliable connections — people come to you because you deliver what you promise.',
    careers: ['Insurance Agent', 'Pharmaceutical Sales Rep', 'Loan Officer', 'Retail Store Manager', 'Customer Relationship Manager'],
    items: [
      'Your reliability and social warmth make you a natural in sales and client management — people buy from people they trust.',
      'Resist the temptation to coast on relationships alone. Combine your people skills with domain expertise for faster advancement.',
      'You may dismiss innovative approaches too quickly. When someone suggests a new method, give it 48 hours before deciding.',
    ],
  },
  'L-H-L': {
    summary:
      'You are a social, spontaneous pragmatist who thrives on human connection and variety. You are energized by people and resist rigid systems — you need a role that lets you move freely and interact constantly.',
    careers: ['Bartender', 'Real Estate Showing Agent', 'Fitness Instructor', 'Outside Sales Rep', 'Youth Program Coordinator'],
    items: [
      'Roles with high social contact and low paperwork play to your strengths. You sell yourself naturally.',
      'Your spontaneity works in fast-paced environments but can undermine you in roles requiring long-term planning.',
      'Build one reliable follow-up habit (a CRM, a weekly check-in list) to prevent opportunities from slipping through the cracks.',
    ],
  },
  'L-M-H': {
    summary:
      'You are a disciplined, methodical worker who values stability and precision. You build expertise through repetition and become the go-to authority in your domain. You prefer depth over breadth.',
    careers: ['Civil Engineer', 'Pharmacist', 'Air Traffic Controller', 'Dental Hygienist', 'Building Inspector'],
    items: [
      'Fields with clear standards, established protocols, and measurable outcomes reward your strengths directly.',
      'Your discipline and attention to detail make you excellent in regulated industries where errors have real consequences.',
      'Do not undervalue your preference for proven methods — most workplaces desperately need people who actually follow procedures.',
    ],
  },
  'L-M-M': {
    summary:
      'You are a practical, steady worker who prefers familiar routines and clear expectations. You adapt when necessary but prefer stability. You are most effective in well-established roles with defined responsibilities.',
    careers: ['Administrative Assistant', 'Insurance Claims Adjuster', 'Dental Lab Technician', 'Payroll Specialist', 'Maintenance Technician'],
    items: [
      'Seek established organizations with clear career ladders — startups and ambiguous roles will frustrate you.',
      'Your reliability is your career engine. The people who show up consistently and deliver steadily are the ones who get promoted in stable industries.',
      'Invest in certifications or specialized training to deepen your expertise — it compounds over time in practical fields.',
    ],
  },
  'L-M-L': {
    summary:
      'You prefer straightforward, low-pressure work with clear instructions and minimal ambiguity. You do best when someone else sets the direction and you execute with reasonable autonomy.',
    careers: ['Delivery Driver', 'Warehouse Associate', 'Landscaper', 'Assembly Technician', 'Stock Clerk'],
    items: [
      'Look for roles with clear daily routines and tangible output — you find satisfaction in completing concrete tasks.',
      'Avoid roles requiring constant self-direction or ambiguous priorities. External structure helps you perform at your best.',
      'Consider skilled trades (plumbing, electrical, HVAC) — they provide structure, concrete results, and strong earning potential.',
    ],
  },
  'L-L-H': {
    summary:
      'You are a quiet, disciplined specialist who excels in focused, independent work. You build deep expertise through patient, methodical practice and prefer environments where quality is rewarded over visibility.',
    careers: ['Watchmaker', 'Machinist', 'Quality Control Inspector', 'Archivist', 'Tax Preparer'],
    items: [
      'Your ideal role has clear standards, minimal social demand, and rewards precision — you excel where others lose patience.',
      'Seek industries that value deep technical skill over networking. Your work quality is your best advocate.',
      'You may resist change that actually helps you. When a new tool or process is introduced, commit to trying it for 30 days before judging.',
    ],
  },
  'L-L-M': {
    summary:
      'You are a quiet, practical worker who prefers predictable environments with minimal social demand. You work steadily and reliably, bringing consistency to whatever role you hold.',
    careers: ['Data Entry Clerk', 'Janitor/Custodian', 'Security Guard', 'Mail Carrier', 'Machine Operator'],
    items: [
      'Roles with clear routines, minimal surprises, and low social pressure are where you do your steadiest work.',
      'Your consistency is an asset — employers value people who simply show up and do the job reliably.',
      'Consider skilled trades where you can build expertise gradually and earn more over time without needing to self-promote.',
    ],
  },
  'L-L-L': {
    summary:
      'You prefer simple, predictable work with minimal social and structural demands. You value autonomy and routine over career advancement — and there is nothing wrong with that. Not everyone needs to climb a ladder.',
    careers: ['Groundskeeper', 'Night Security Guard', 'Dishwasher', 'Self-storage Facility Attendant', 'Kennel Assistant'],
    items: [
      'Low-pressure, independent roles with clear daily routines suit you best. Find one and do it well.',
      'If you want more earning potential, skilled trades (welding, plumbing) offer good pay with structured training and minimal corporate culture.',
      'Your low need for novelty and social interaction is a genuine advantage in roles that others find boring — own it.',
    ],
  },
};

export default careerProfiles;
