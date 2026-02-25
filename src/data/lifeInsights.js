import { Briefcase, Heart, Shield, MessageCircle, TrendingUp, Activity } from 'lucide-react';

/**
 * Score-based life insights organized by life category.
 *
 * Each category contains per-trait ranges (low ≤35, mid ≤65, high ≤100)
 * written in second person so they read as personalized analysis when
 * the matching range is selected based on the user's actual score.
 */
const lifeInsights = [
  {
    key: 'careers',
    label: 'Career & Work',
    icon: Briefcase,
    traits: {
      O: [
        { max: 35, text: 'You\'re drawn to structured, practical work — operations, logistics, accounting, or trades where consistency is valued.' },
        { max: 65, text: 'You\'re flexible across creative and structured roles, gravitating toward work that balances novelty with practicality.' },
        { max: 100, text: 'You thrive in creative, idea-driven work — research, design, the arts, or any role that rewards original thinking.' },
      ],
      C: [
        { max: 35, text: 'You do best in loose, improvisational environments — startups, creative freelancing, or work that rewards adaptability.' },
        { max: 65, text: 'You perform well in most work settings, bringing structure when needed without being rigid about it.' },
        { max: 100, text: 'You excel in fields demanding precision and follow-through — law, medicine, finance, engineering, or management.' },
      ],
      E: [
        { max: 35, text: 'You\'re at your best in independent, focused roles — writing, programming, research, or specialist positions.' },
        { max: 65, text: 'You move naturally between collaborative and solo work, making you effective in hybrid team environments.' },
        { max: 100, text: 'You\'re a natural in people-facing roles — sales, leadership, teaching, PR, or anything that runs on social energy.' },
      ],
      A: [
        { max: 35, text: 'You suit competitive, high-stakes fields — law, business strategy, negotiation, or roles requiring tough critical analysis.' },
        { max: 65, text: 'You navigate both cooperative and competitive environments well, adjusting your approach to what the situation needs.' },
        { max: 100, text: 'You\'re drawn to helping professions — social work, nursing, counseling, education, or HR where empathy is an asset.' },
      ],
      N: [
        { max: 35, text: 'You handle high-pressure work naturally — leadership, emergency medicine, military, or crisis management roles.' },
        { max: 65, text: 'You manage workplace stress well enough to thrive in most environments without needing unusually calm conditions.' },
        { max: 100, text: 'Your emotional depth fuels creativity — artistic fields, therapy, advocacy, or roles where sensitivity is a strength.' },
      ],
    },
  },
  {
    key: 'relationships',
    label: 'Relationships',
    icon: Heart,
    traits: {
      O: [
        { max: 35, text: 'You value stability and shared routines — a partner who keeps things familiar and grounded suits you best.' },
        { max: 65, text: 'You appreciate both novelty and comfort in relationships, seeking a partner who can offer both.' },
        { max: 100, text: 'You crave intellectual depth, novelty, and philosophical connection — routine-heavy relationships feel stifling.' },
      ],
      C: [
        { max: 35, text: 'You bring spontaneity and fun to relationships, though follow-through on commitments may require conscious effort.' },
        { max: 65, text: 'You\'re a balanced partner — reliable when it matters, flexible enough not to be rigid about every plan.' },
        { max: 100, text: 'You\'re a deeply reliable, committed partner who follows through — though you may need to ease up on expectations.' },
      ],
      E: [
        { max: 35, text: 'You need space to recharge and prefer a few deep connections over a wide social circle.' },
        { max: 65, text: 'You\'re comfortably ambiverted — happy at a party or on the couch, and your partner gets both versions of you.' },
        { max: 100, text: 'You need social stimulation from your partner and a wide shared social life to feel connected.' },
      ],
      A: [
        { max: 35, text: 'You\'re direct and self-advocating, which builds clarity but may require deliberate work on empathy.' },
        { max: 65, text: 'You balance your own needs with your partner\'s naturally, neither overly accommodating nor rigidly independent.' },
        { max: 100, text: 'You\'re a natural nurturer who prioritizes harmony — but learning to hold boundaries will strengthen your relationships.' },
      ],
      N: [
        { max: 35, text: 'You\'re a steady emotional anchor for partners, though you may need to tune in more actively to their emotional world.' },
        { max: 65, text: 'You experience a healthy range of emotional ups and downs, making you relatable and emotionally accessible.' },
        { max: 100, text: 'You bring emotional depth and intensity — a stable partner and mutual vulnerability help you thrive.' },
      ],
    },
  },
  {
    key: 'stress',
    label: 'Stress & Coping',
    icon: Shield,
    traits: {
      O: [
        { max: 35, text: 'You recover through routine and familiar comforts — exercise, structure, and returning to what you know works.' },
        { max: 65, text: 'You cope flexibly, mixing familiar routines with creative outlets depending on what the situation demands.' },
        { max: 100, text: 'You process stress through meaning-making — journaling, creative expression, and exploring why things happened.' },
      ],
      C: [
        { max: 35, text: 'Under stress you may procrastinate or avoid — breaking things into small, manageable steps helps you regain traction.' },
        { max: 65, text: 'You handle stress by planning when useful and going with the flow when planning would only add pressure.' },
        { max: 100, text: 'Under stress you may overwork or become rigid — the recovery is regaining control through structure and lists.' },
      ],
      E: [
        { max: 35, text: 'You need solitude and quiet to process stress — forced social interaction during hard times makes things worse.' },
        { max: 65, text: 'You cope by alternating between talking it out with trusted people and retreating to process on your own.' },
        { max: 100, text: 'You cope by talking things through and seeking social support — isolation during stress feels wrong for you.' },
      ],
      A: [
        { max: 35, text: 'You handle your own stress effectively but may become combative or isolated when the pressure gets high.' },
        { max: 65, text: 'You manage stress pragmatically, leaning on others when it helps and going solo when that\'s more effective.' },
        { max: 100, text: 'You tend to absorb others\' stress on top of your own — learning boundaries is critical to your coping.' },
      ],
      N: [
        { max: 35, text: 'You\'re naturally resilient under pressure, but watch for ignoring warning signs until problems escalate quietly.' },
        { max: 65, text: 'Stress hits you but doesn\'t stay — you process it at a normal pace and return to baseline relatively easily.' },
        { max: 100, text: 'Stress hits hard and can spiral into rumination — structured coping (exercise, CBT, meditation) is essential for you.' },
      ],
    },
  },
  {
    key: 'communication',
    label: 'Communication',
    icon: MessageCircle,
    traits: {
      O: [
        { max: 35, text: 'You communicate concretely and directly — clear, practical, and to the point without unnecessary abstraction.' },
        { max: 65, text: 'You shift between concrete and abstract communication naturally, reading the room for what\'s needed.' },
        { max: 100, text: 'You gravitate toward abstract, idea-rich communication — metaphor, philosophy, and deep conceptual discussion.' },
      ],
      C: [
        { max: 35, text: 'You communicate casually and focus on the big picture, getting to the heart of things without sweating details.' },
        { max: 65, text: 'You\'re thorough when the stakes call for it and casual when they don\'t — a flexible communicator.' },
        { max: 100, text: 'You communicate precisely and methodically, following through on every detail and expecting others to do the same.' },
      ],
      E: [
        { max: 35, text: 'You listen more than you speak, prefer writing or one-on-one conversation, and think before responding.' },
        { max: 65, text: 'You adjust your style to the setting — expressive in groups, reflective in quieter moments.' },
        { max: 100, text: 'You\'re expressive and enthusiastic, thinking out loud — comfortable commanding a room and energizing a conversation.' },
      ],
      A: [
        { max: 35, text: 'You\'re blunt, direct, and debate-oriented — effective in high-stakes talks but may need to soften in sensitive ones.' },
        { max: 65, text: 'You balance diplomacy with directness, knowing when to push and when to accommodate.' },
        { max: 100, text: 'You communicate warmly and diplomatically, seeking consensus — though you may avoid confrontation when it\'s needed.' },
      ],
      N: [
        { max: 35, text: 'You come across as steady and composed, which feels reassuring but can read as emotionally distant.' },
        { max: 65, text: 'You express emotions in measured ways — open enough to connect, composed enough to stay grounded.' },
        { max: 100, text: 'You\'re emotionally expressive and may over-share when overwhelmed — you process feelings out loud.' },
      ],
    },
  },
  {
    key: 'growth',
    label: 'Personal Growth',
    icon: TrendingUp,
    traits: {
      O: [
        { max: 35, text: 'Your edge is deepening expertise — mastering familiar skills and refining what you already know well.' },
        { max: 65, text: 'You grow by alternating between exploring new territory and consolidating what you\'ve already learned.' },
        { max: 100, text: 'Your edge is grounding — learning to follow through on ideas rather than chasing the next novel thing.' },
      ],
      C: [
        { max: 35, text: 'Your edge is building small habits — lightweight structure that creates consistency without feeling suffocating.' },
        { max: 65, text: 'You grow by knowing when to tighten discipline and when to let things be good enough.' },
        { max: 100, text: 'Your edge is releasing control — learning to delegate, tolerate imperfection, and let good enough be enough.' },
      ],
      E: [
        { max: 35, text: 'Your edge is pushing into social discomfort — discovering that connection doesn\'t always have to drain you.' },
        { max: 65, text: 'You grow by leaning into whichever mode — social or solitary — feels less natural in the moment.' },
        { max: 100, text: 'Your edge is cultivating a rich inner life — learning to sit with silence and reflect deeply.' },
      ],
      A: [
        { max: 35, text: 'Your edge is empathy — practicing active listening and genuinely considering others\' perspectives.' },
        { max: 65, text: 'You grow by noticing when you over-accommodate or under-accommodate, and adjusting in real time.' },
        { max: 100, text: 'Your edge is boundaries — learning to say no, tolerate conflict, and advocate for your own needs.' },
      ],
      N: [
        { max: 35, text: 'Your edge is emotional attunement — developing richer emotional vocabulary and sitting with others\' pain.' },
        { max: 65, text: 'You grow by noticing when steadiness masks avoidance, and when reactivity signals something worth listening to.' },
        { max: 100, text: 'Your edge is distress tolerance — learning that intense emotions, however real, are always temporary.' },
      ],
    },
  },
  {
    key: 'wellness',
    label: 'Health & Wellness',
    icon: Activity,
    traits: {
      O: [
        { max: 35, text: 'You thrive on consistent, predictable routines — the same gym, the same schedule, long-term habit loyalty.' },
        { max: 65, text: 'You balance familiar health routines with occasional variety to keep things interesting without losing consistency.' },
        { max: 100, text: 'You need novelty in wellness — varied exercises, new activities, and creative approaches to mindfulness.' },
      ],
      C: [
        { max: 35, text: 'Accountability partners and habit-stacking are your best tools for maintaining consistent wellness practices.' },
        { max: 65, text: 'You maintain healthy habits when motivated and let them slide when not — gentle systems keep you on track.' },
        { max: 100, text: 'You maintain strong health routines naturally, but watch for burnout from over-optimizing every aspect of wellness.' },
      ],
      E: [
        { max: 35, text: 'Solo practices suit you best — hiking, yoga, swimming, or home workouts where you can recharge while moving.' },
        { max: 65, text: 'You enjoy both group and solo fitness, choosing based on your energy level and mood on any given day.' },
        { max: 100, text: 'You thrive with group fitness, team sports, and social wellness activities that combine health with connection.' },
      ],
      A: [
        { max: 35, text: 'Competitive or individual pursuits channel your drive — races, personal records, solo training programs.' },
        { max: 65, text: 'You enjoy both community-based wellness and individual pursuits, depending on what fits the moment.' },
        { max: 100, text: 'Community-based wellness works best — group classes, cooking for others, and health goals shared with people you care about.' },
      ],
      N: [
        { max: 35, text: 'Your emotional baseline is stable, but watch for suppressing stress rather than actually processing it.' },
        { max: 65, text: 'Regular exercise and adequate sleep keep your emotional regulation in a healthy range — prioritize both.' },
        { max: 100, text: 'Exercise, sleep hygiene, and mindfulness have outsized effects on your emotional regulation — prioritize these above all.' },
      ],
    },
  },
];

export default lifeInsights;
