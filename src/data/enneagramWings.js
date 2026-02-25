// Comprehensive Enneagram wing data.
// Each type has two possible wings (the adjacent numbers on the Enneagram circle).
// Wing descriptions based on established Enneagram literature
// (Riso & Hudson, Beatrice Chestnut, Don Richard Riso, Sandra Maitri).

/**
 * Adjacent type numbers for each core type on the Enneagram circle.
 * The circle wraps: 9 is adjacent to 1, and 1 is adjacent to 9.
 */
export const WING_ADJACENTS = {
  '1': ['9', '2'],
  '2': ['1', '3'],
  '3': ['2', '4'],
  '4': ['3', '5'],
  '5': ['4', '6'],
  '6': ['5', '7'],
  '7': ['6', '8'],
  '8': ['7', '9'],
  '9': ['8', '1'],
};

/**
 * Full wing descriptions for all 18 wing combinations.
 * Keyed as "coreWing" (e.g. "1w9", "1w2").
 */
export const enneagramWings = {
  // ─── TYPE 1 ──────────────────────────────────────────
  '1w9': {
    name: 'The Idealist',
    summary: 'The Nine wing softens the One\'s sharp inner critic with a layer of calm, patience, and philosophical detachment. These Ones are less outwardly critical and more quietly principled — they work towards their vision of a better world with a steady, measured energy rather than fiery intensity.',
    keyTraits: ['Calm and composed under pressure', 'Highly principled but less openly judgmental', 'Philosophical and reflective', 'Emotionally reserved and self-contained', 'Patient and methodical reformers'],
    blindSpot: 'Can become so internally focused on perfecting their own standards that they disconnect from the world. The Nine wing\'s tendency towards inertia can make them slow to act on the very principles they hold dear — they think deeply but may struggle to take decisive action.',
    atTheirBest: 'Wise, serene, and deeply ethical. They embody their principles without preaching them, and people are naturally drawn to their quiet integrity and thoughtful approach to improving the world.',
    growth: 'Practice expressing your opinions and frustrations out loud before they calcify into resentment. Your calm exterior often hides genuine anger — let trusted people see it.',
    stress: 'Under stress, 1w9s can become increasingly rigid and withdrawn, retreating into an ivory tower of moral certainty while disconnecting from the messy human reality around them.',
    relationship: 'In relationships, 1w9s are dependable and emotionally steady. They show love through quiet acts of service and consistency. They need partners who respect their need for personal space and who don\'t mistake their reserve for coldness.',
  },
  '1w2': {
    name: 'The Advocate',
    summary: 'The Two wing adds warmth, interpersonal energy, and a desire to help others to the One\'s principled nature. These Ones are more outwardly passionate about their causes and more willing to get personally involved in fixing what\'s broken. They don\'t just see what\'s wrong — they roll up their sleeves.',
    keyTraits: ['Warm and personally invested in doing good', 'More emotionally expressive than 1w9', 'Strong sense of moral duty to help others', 'Can be persuasive advocates for their beliefs', 'Empathetic but with firm boundaries'],
    blindSpot: 'The combination of One\'s inner critic and Two\'s need to be needed can create a pattern of self-righteous helping — doing good in ways that are subtly controlling. They may believe they know what\'s best for others and push their standards onto people under the guise of caring.',
    atTheirBest: 'Compassionate, principled, and genuinely devoted to making life better for others. They combine moral clarity with personal warmth in a way that makes people feel both challenged and deeply cared for.',
    growth: 'Notice when your desire to help is actually a desire to correct. Ask people what they need before assuming you know. Your standards are valuable — but so is other people\'s autonomy.',
    stress: 'Under stress, 1w2s can become critical and controlling in relationships, convinced that their way is the right way and that others should be grateful for the guidance.',
    relationship: 'In relationships, 1w2s are devoted, attentive, and actively caring. They show love by trying to make their partner\'s life better — sometimes to the point of unsolicited advice. They need partners who appreciate their dedication without feeling managed.',
  },

  // ─── TYPE 2 ──────────────────────────────────────────
  '2w1': {
    name: 'The Servant',
    summary: 'The One wing gives the Two a stronger sense of duty, structure, and moral purpose behind their helping. These Twos are less emotionally effusive and more practically helpful — they serve with precision and hold themselves to high standards of how care should be given.',
    keyTraits: ['Disciplined and service-oriented', 'More reserved and controlled than 2w3', 'Strong moral compass guiding their generosity', 'Altruistic with a sense of duty', 'Self-critical about whether they\'re giving enough'],
    blindSpot: 'The One wing\'s inner critic can turn inward with devastating effect — these Twos not only worry about being loved, but also judge themselves harshly for not being helpful enough. They can become martyrs who suffer quietly while insisting everything is fine.',
    atTheirBest: 'Selfless, reliable, and deeply principled in their care for others. They combine genuine warmth with practical competence, becoming the person everyone trusts to do the right thing.',
    growth: 'Your standards for how much you should give are impossibly high. Practice receiving help without guilt. You are allowed to have needs — having them doesn\'t make you selfish.',
    stress: 'Under stress, 2w1s become increasingly self-sacrificing and resentful, giving more while internally criticising both themselves and others for the imbalance.',
    relationship: 'In relationships, 2w1s are deeply devoted and practical in their love. They show care through acts of service and responsibility. They need partners who actively reciprocate and notice their efforts without being asked.',
  },
  '2w3': {
    name: 'The Host',
    summary: 'The Three wing adds charm, social savvy, and an awareness of image to the Two\'s natural warmth. These Twos are more outgoing, more visibly generous, and more attuned to how their helpfulness is perceived. They want to be loved — and they want to be seen being lovable.',
    keyTraits: ['Charismatic and socially confident', 'Generous in visible, impressive ways', 'Image-conscious about their role as a helper', 'Ambitious about their relationships and social standing', 'Energetic and engaging'],
    blindSpot: 'The Three wing can turn genuine care into performance. These Twos may begin to help strategically — gravitating toward important people, curating their generosity for maximum social impact, and measuring their worth by the status of the people who need them.',
    atTheirBest: 'Genuinely warm, socially brilliant, and capable of making everyone they meet feel like the most important person in the room. They use their considerable charm in service of real connection, not just admiration.',
    growth: 'Ask yourself: would I still do this if no one noticed? Learn to be generous in private. The love that matters most doesn\'t require an audience.',
    stress: 'Under stress, 2w3s become attention-seeking and possessive, working harder to be indispensable while tracking whether their efforts are being properly appreciated.',
    relationship: 'In relationships, 2w3s are attentive, expressive, and enthusiastic partners. They love through grand gestures and social warmth. They need partners who offer genuine, private appreciation — not just public acknowledgment.',
  },

  // ─── TYPE 3 ──────────────────────────────────────────
  '3w2': {
    name: 'The Charmer',
    summary: 'The Two wing adds interpersonal warmth and people-skills to the Three\'s achievement drive. These Threes are more socially engaging, more focused on relationships as part of their success, and more naturally likeable. They achieve through people as much as through work.',
    keyTraits: ['Highly sociable and interpersonally gifted', 'Achievement-oriented but people-focused', 'Naturally encouraging and motivating to others', 'Skilled at networking and building alliances', 'Warm and outwardly generous'],
    blindSpot: 'The combination of Three\'s image-management and Two\'s desire to be loved can create a deeply seductive but ultimately hollow persona — someone who is all things to all people but struggles to know who they actually are underneath the performance.',
    atTheirBest: 'Inspiring leaders who genuinely lift others up as they rise. They combine real competence with authentic warmth, creating success that includes and benefits the people around them.',
    growth: 'Notice when you\'re being charming versus being honest. The real you — the one behind the polished exterior — is more interesting and more lovable than the performance.',
    stress: 'Under stress, 3w2s become increasingly image-obsessed and people-pleasing, working frantically to maintain both their success metrics and their social approval ratings.',
    relationship: 'In relationships, 3w2s are attentive, impressive partners who love making their significant other proud. They need partners who see past the polished surface and love the real, imperfect person underneath.',
  },
  '3w4': {
    name: 'The Professional',
    summary: 'The Four wing adds emotional depth, introspection, and a concern with authenticity to the Three\'s drive for achievement. These Threes are more serious, more internally complex, and more interested in doing work that is genuinely meaningful rather than merely impressive.',
    keyTraits: ['Ambitious but introspective', 'Concerned with authentic achievement, not just appearance', 'Emotionally deeper and more self-aware than 3w2', 'Drawn to creative or prestigious fields', 'Can experience genuine identity struggles'],
    blindSpot: 'The Four wing introduces an uncomfortable tension: the Three wants to project success while the Four demands authenticity. These Threes can suffer from imposter syndrome more acutely than any other subtype — achieving impressive things while privately feeling like a fraud.',
    atTheirBest: 'Accomplished, authentic, and emotionally intelligent. They create work that is both excellent and personally meaningful, and they inspire others by being genuinely themselves rather than performing a version of success.',
    growth: 'Your achievements don\'t define your identity — and your feelings of being a fraud don\'t invalidate your real accomplishments. Both sides are telling you something true. Listen to them together.',
    stress: 'Under stress, 3w4s oscillate between manic productivity and depressive withdrawal, swinging between "I\'ll prove myself through work" and "none of this means anything."',
    relationship: 'In relationships, 3w4s are more emotionally available than other Threes but can struggle with vulnerability. They need partners who appreciate both their ambition and their sensitivity without dismissing either.',
  },

  // ─── TYPE 4 ──────────────────────────────────────────
  '4w3': {
    name: 'The Aristocrat',
    summary: 'The Three wing adds drive, social awareness, and a desire to make their uniqueness visible to the world. These Fours are more ambitious, more image-conscious, and more willing to put their creative vision out into the public eye. They don\'t just feel deeply — they want the world to see it.',
    keyTraits: ['Creatively ambitious and productive', 'More socially engaged and competitive', 'Desire to be both unique and successful', 'Expressive and dramatic in self-presentation', 'Driven to turn emotional depth into achievement'],
    blindSpot: 'The Three wing\'s concern with image can distort the Four\'s authentic self-expression. These Fours may begin to perform their uniqueness rather than simply being it — curating their individuality for maximum impact and feeling devastated when others don\'t appreciate the show.',
    atTheirBest: 'Brilliantly creative, emotionally compelling, and capable of turning their inner world into art, products, or experiences that genuinely move other people. They channel depth into expression with remarkable power.',
    growth: 'Not every feeling needs to become a performance. Practice being ordinary sometimes — the depth is still there even when no one is watching.',
    stress: 'Under stress, 4w3s become competitive and envious, comparing their creative output to others and feeling simultaneously superior and inadequate.',
    relationship: 'In relationships, 4w3s are passionate, expressive, and intensely devoted. They need partners who are impressed by their depth but also willing to gently ground them when self-expression becomes self-absorption.',
  },
  '4w5': {
    name: 'The Bohemian',
    summary: 'The Five wing adds intellectual depth, privacy, and a more withdrawn quality to the Four\'s emotional intensity. These Fours are the most introspective and unconventional of all subtypes — less concerned with being seen and more absorbed in their own rich inner world of ideas, feelings, and creative vision.',
    keyTraits: ['Deeply introspective and intellectually curious', 'More private and withdrawn than 4w3', 'Highly original and unconventional thinkers', 'Rich inner fantasy life', 'Independent and self-sufficient'],
    blindSpot: 'The Five wing\'s tendency to withdraw combines with the Four\'s feeling of being different to create intense isolation. These Fours can disappear so deeply into their inner world that they lose connection with reality and other people entirely — becoming brilliant but increasingly eccentric and alone.',
    atTheirBest: 'Profoundly original, intellectually fascinating, and creatively visionary. They produce work of extraordinary depth and insight by combining emotional intelligence with intellectual rigour in ways no other type can.',
    growth: 'Your inner world is extraordinary — but it needs contact with the outer world to stay grounded. Share your ideas before they\'re perfect. Let people in before you\'ve fully understood them.',
    stress: 'Under stress, 4w5s retreat further into isolation and abstraction, becoming increasingly detached from others while their inner emotional world grows darker and more consuming.',
    relationship: 'In relationships, 4w5s are deeply loyal but need significant alone time. They connect through shared intellectual and creative interests. They need partners who respect their independence and don\'t interpret withdrawal as rejection.',
  },

  // ─── TYPE 5 ──────────────────────────────────────────
  '5w4': {
    name: 'The Iconoclast',
    summary: 'The Four wing adds emotional depth, creative sensitivity, and a concern with identity to the Five\'s intellectual detachment. These Fives are more expressive, more unconventional, and more attuned to beauty and meaning. They don\'t just want to understand the world — they want to understand it in their own unique way.',
    keyTraits: ['Intellectually brilliant with creative flair', 'More emotionally sensitive than 5w6', 'Drawn to the avant-garde and unconventional', 'Intensely private and idiosyncratic', 'Combines analytical thinking with artistic vision'],
    blindSpot: 'The Four wing\'s emotional intensity can clash with the Five\'s desire for detachment, creating an internal tug-of-war between wanting to feel deeply and wanting to think clearly. These Fives may use intellectual frameworks to manage overwhelming feelings, never fully experiencing or expressing either.',
    atTheirBest: 'Visionary thinkers who combine rigorous analysis with genuine emotional and aesthetic depth. They produce work that is both intellectually precise and profoundly moving — scientists who write poetry, artists who think like philosophers.',
    growth: 'Your feelings are not a threat to your thinking — they are a different kind of intelligence. Practice sharing emotional truths with the same precision you bring to intellectual ones.',
    stress: 'Under stress, 5w4s become increasingly isolated and emotionally volatile behind closed doors, oscillating between cold detachment and intense, unshareable feelings.',
    relationship: 'In relationships, 5w4s are deeply devoted but intensely private. They express love through sharing their inner world — ideas, creations, vulnerabilities — with a very select few. They need partners who treasure this access and never betray its trust.',
  },
  '5w6': {
    name: 'The Problem Solver',
    summary: 'The Six wing adds a practical, security-conscious, and more socially engaged quality to the Five\'s cerebral nature. These Fives are more grounded, more focused on real-world applications of their knowledge, and more loyal to the groups and systems they trust.',
    keyTraits: ['Analytical and practically minded', 'More socially connected than 5w4', 'Security-conscious and prepared', 'Loyal to trusted people and institutions', 'Systematic and thorough in their expertise'],
    blindSpot: 'The Six wing\'s anxiety can amplify the Five\'s tendency to over-prepare. These Fives can get stuck in an endless loop of researching, planning, and gathering information as a way to manage the fear of being unprepared — never quite feeling ready enough to act.',
    atTheirBest: 'Brilliant problem-solvers who combine deep expertise with practical application. They build reliable systems, produce thoroughly researched work, and earn trust through competence and loyalty.',
    growth: 'You will never have enough information to eliminate all risk. Practice acting on 80% certainty. Your preparation is a strength — but only when it leads to action, not avoidance.',
    stress: 'Under stress, 5w6s become increasingly anxious and paranoid, withdrawing into research spirals while catastrophising about worst-case scenarios.',
    relationship: 'In relationships, 5w6s are loyal, reliable, and quietly caring. They show love through practical support and intellectual companionship. They need partners who are patient with their caution and who build trust gradually.',
  },

  // ─── TYPE 6 ──────────────────────────────────────────
  '6w5': {
    name: 'The Defender',
    summary: 'The Five wing adds intellectual depth, independence, and a more introverted quality to the Six\'s security-seeking nature. These Sixes are more analytical, more self-reliant, and more likely to manage their anxiety through knowledge and expertise than through seeking reassurance from others.',
    keyTraits: ['Analytical and independently minded', 'More introverted and self-reliant than 6w7', 'Uses knowledge as a defence against uncertainty', 'Cautious and thorough in decision-making', 'Quietly loyal rather than overtly social'],
    blindSpot: 'The Five wing\'s tendency towards withdrawal can make these Sixes increasingly isolated in their anxiety. Instead of reaching out for support, they retreat into their heads, building elaborate mental models of everything that could go wrong without testing those fears against reality.',
    atTheirBest: 'Deeply knowledgeable, quietly courageous, and fiercely protective of what matters to them. They combine sharp analytical thinking with genuine loyalty, becoming the person who has thought through every scenario and still shows up.',
    growth: 'Your mind is powerful, but it can become a prison. When you notice yourself spiralling into analysis, reach out to someone you trust. Saying "I\'m worried" out loud is often more effective than thinking about worry privately.',
    stress: 'Under stress, 6w5s become increasingly withdrawn and mentally rigid, constructing worst-case scenarios in isolation and struggling to distinguish between realistic caution and catastrophic thinking.',
    relationship: 'In relationships, 6w5s are deeply loyal but take time to fully trust. They show love through steadfast reliability and intellectual engagement. They need partners who are consistent, honest, and patient with their cautious approach to vulnerability.',
  },
  '6w7': {
    name: 'The Buddy',
    summary: 'The Seven wing adds warmth, optimism, and social energy to the Six\'s cautious nature. These Sixes are more outgoing, more playful, and more likely to manage their anxiety through humour, social connection, and staying busy. They are the most approachable and relatable of the Sixes.',
    keyTraits: ['Warm, witty, and socially engaging', 'Uses humour to manage anxiety', 'More optimistic and action-oriented than 6w5', 'Loyal and fun in equal measure', 'Seeks security through community and connection'],
    blindSpot: 'The Seven wing\'s desire for fun can be used to avoid confronting genuine anxiety. These Sixes may stay so busy, social, and upbeat that they never sit with their fears long enough to work through them — the anxiety is always just beneath the cheerful surface.',
    atTheirBest: 'Loyal, hilarious, and genuinely courageous. They combine a realistic awareness of life\'s dangers with an irrepressible desire to enjoy it anyway. They make others feel both safe and entertained.',
    growth: 'Your humour is a gift, but sometimes it\'s also a shield. Practice sitting with discomfort without deflecting into jokes or plans. The anxiety you\'re avoiding is smaller than you think.',
    stress: 'Under stress, 6w7s become scattered and reactive, oscillating between anxious worst-case thinking and frantic attempts to distract themselves through activity and socialising.',
    relationship: 'In relationships, 6w7s are fun, loyal, and emotionally expressive. They create warmth and laughter in their partnerships. They need partners who provide genuine reassurance and who don\'t dismiss their worries as overreaction.',
  },

  // ─── TYPE 7 ──────────────────────────────────────────
  '7w6': {
    name: 'The Entertainer',
    summary: 'The Six wing adds loyalty, responsibility, and a warmer, more grounded quality to the Seven\'s adventurous nature. These Sevens are more community-oriented, more aware of their commitments, and more likely to channel their enthusiasm into shared experiences rather than solo adventures.',
    keyTraits: ['Sociable, loyal, and team-oriented', 'More responsible and committed than 7w8', 'Combines enthusiasm with genuine concern for others', 'Productive and collaborative', 'Anxious energy channelled into humour and activity'],
    blindSpot: 'The Six wing introduces anxiety beneath the Seven\'s optimistic surface. These Sevens can be surprisingly insecure, using their entertaining persona to keep people close while secretly worrying about abandonment. The busyness serves double duty — avoiding both pain and loneliness.',
    atTheirBest: 'Genuinely joyful, deeply loyal, and brilliantly entertaining. They bring people together with warmth and energy while staying committed to the relationships and responsibilities that matter.',
    growth: 'You don\'t have to be entertaining to be loved. Practice being present in quiet moments. The people who truly love you will still be there when the party is over.',
    stress: 'Under stress, 7w6s become anxious and scattered, ping-ponging between exciting plans and fearful worst-case scenarios while struggling to commit to any single course of action.',
    relationship: 'In relationships, 7w6s are devoted, fun, and emotionally warm. They create excitement and laughter in their partnerships. They need partners who match their energy but also help them slow down and feel safe being still.',
  },
  '7w8': {
    name: 'The Realist',
    summary: 'The Eight wing adds force, confidence, and a more aggressive edge to the Seven\'s desire for experience. These Sevens are bolder, more assertive, and more likely to make things happen through sheer willpower. They don\'t just dream of adventures — they charge towards them.',
    keyTraits: ['Bold, assertive, and high-energy', 'More materialistic and action-oriented', 'Pursues experiences with intensity and force', 'Competitive and entrepreneurial', 'Less anxious and more confrontational than 7w6'],
    blindSpot: 'The Eight wing\'s intensity can turn the Seven\'s appetite for experience into excess. These Sevens may pursue pleasure and stimulation so aggressively that they overwhelm themselves and others — consuming experiences rather than savouring them, and bulldozing anyone who stands in their way.',
    atTheirBest: 'Powerful, visionary, and unstoppable in the best sense. They combine creative imagination with the force of will to actually bring their ideas to life, inspiring others with their sheer energy and determination.',
    growth: 'More is not always better. Practice savouring instead of consuming. Your force of personality is a gift — learn to wield it with awareness of its impact on the people around you.',
    stress: 'Under stress, 7w8s become aggressive, impulsive, and grandiose, pushing harder for stimulation and control while becoming increasingly insensitive to others\' boundaries.',
    relationship: 'In relationships, 7w8s are passionate, exciting, and fiercely devoted. They create a life full of adventure and intensity. They need partners who are strong enough to hold their own and who can lovingly call them out when intensity tips into insensitivity.',
  },

  // ─── TYPE 8 ──────────────────────────────────────────
  '8w7': {
    name: 'The Maverick',
    summary: 'The Seven wing adds energy, charisma, and an appetite for experience to the Eight\'s natural power. These Eights are more extroverted, more restless, and more interested in pursuing a big, exciting life. They combine raw force with genuine enthusiasm.',
    keyTraits: ['Charismatic, bold, and larger-than-life', 'High energy and restless', 'Entrepreneurial and risk-taking', 'Combines power with a sense of fun', 'Magnetic personality that draws followers'],
    blindSpot: 'The Seven wing\'s restlessness can amplify the Eight\'s already considerable intensity. These Eights may pursue power, experience, and stimulation simultaneously with such force that they burn out themselves and everyone around them. They struggle deeply with slowing down or being vulnerable.',
    atTheirBest: 'Magnetic, visionary, and enormously generous. They use their considerable personal power and energy to create big, exciting things that benefit others — building empires that include and protect the people they care about.',
    growth: 'Your energy is extraordinary, but sustainability matters too. Practice stillness. The vulnerability you\'re avoiding — the quiet, tender part of you — is not weakness. It\'s the source of your deepest strength.',
    stress: 'Under stress, 8w7s become increasingly aggressive and reckless, pursuing control and stimulation simultaneously while ignoring the damage to relationships and their own wellbeing.',
    relationship: 'In relationships, 8w7s are passionate, exciting, and fiercely protective. They create a thrilling, larger-than-life partnership. They need partners who are strong enough to stand up to them lovingly and who can coax out the tender vulnerability they work so hard to hide.',
  },
  '8w9': {
    name: 'The Bear',
    summary: 'The Nine wing adds a calm, steady, and more approachable quality to the Eight\'s forceful nature. These Eights are quieter, more patient, and more grounded. They possess enormous power but hold it in reserve, deploying it only when something truly important is at stake.',
    keyTraits: ['Calm, grounded, and quietly powerful', 'More patient and approachable than 8w7', 'Protective and steady rather than confrontational', 'Prefers to lead through quiet authority', 'Slow to anger but formidable when provoked'],
    blindSpot: 'The Nine wing\'s desire for peace can create an internal contradiction with the Eight\'s intensity. These Eights may suppress their aggression for extended periods, appearing calm and easygoing, until a threshold is crossed and the full force erupts — shocking everyone, including sometimes themselves.',
    atTheirBest: 'Powerfully calm, deeply protective, and extraordinarily grounding to be around. They combine the Eight\'s strength with the Nine\'s acceptance, becoming leaders who make others feel simultaneously safe and empowered.',
    growth: 'Your ability to absorb and contain is remarkable — but don\'t confuse suppression with peace. Express your wants and frustrations in real time so they don\'t accumulate into eruptions.',
    stress: 'Under stress, 8w9s can become stubbornly immovable, shutting down communication and using passive resistance as a form of control while denying their own aggression.',
    relationship: 'In relationships, 8w9s are steady, protective, and deeply comforting. They create a sense of safety and stability that few other types can match. They need partners who are gently persistent about emotional communication and who don\'t mistake their calm for indifference.',
  },

  // ─── TYPE 9 ──────────────────────────────────────────
  '9w8': {
    name: 'The Referee',
    summary: 'The Eight wing adds a stubborn, assertive undercurrent to the Nine\'s peaceful exterior. These Nines are more grounded, more physically present, and more willing to stand their ground when pushed. They seek peace — but they won\'t be bulldozed.',
    keyTraits: ['Easygoing but surprisingly stubborn', 'More assertive and physically grounded than 9w1', 'Comfortable with practical, sensory pleasures', 'Can be forceful when boundaries are crossed', 'Seeks harmony but won\'t be pushed around'],
    blindSpot: 'The Eight wing\'s stubbornness can manifest as passive aggression in these Nines. Rather than openly confronting conflict (which the Nine avoids), they dig in silently — refusing to budge, going along on the surface while resisting underneath. Others experience this as infuriating immovability disguised as agreeableness.',
    atTheirBest: 'Genuinely peaceful, surprisingly strong, and capable of holding space for conflicting perspectives without losing themselves. They combine the Nine\'s acceptance with the Eight\'s backbone, becoming mediators who can\'t be intimidated.',
    growth: 'Your strength is real — own it openly. Practice stating your preferences and boundaries directly rather than through passive resistance. You can be both peaceful and assertive; they\'re not opposites.',
    stress: 'Under stress, 9w8s become passively aggressive and stubborn, appearing agreeable on the surface while silently resisting and building resentment that may eventually erupt.',
    relationship: 'In relationships, 9w8s are comfortable, warm, and more direct than other Nines. They create a relaxed, grounded partnership. They need partners who draw out their opinions and preferences rather than accepting their habitual "I\'m fine with whatever."',
  },
  '9w1': {
    name: 'The Dreamer',
    summary: 'The One wing adds idealism, a sense of purpose, and a stronger internal moral compass to the Nine\'s peaceful nature. These Nines are more principled, more orderly, and more quietly driven by a vision of how the world should be — even if they struggle to take action on it.',
    keyTraits: ['Idealistic and quietly principled', 'More orderly and disciplined than 9w8', 'Drawn to meaningful causes and ethical living', 'Imaginative and future-oriented', 'Combines serenity with a sense of purpose'],
    blindSpot: 'The One wing\'s idealism can combine with the Nine\'s passivity to create a dreamer who envisions the perfect world but never quite takes the steps to build it. These Nines may be haunted by a gap between their ideals and their actions — knowing what\'s right but numbing out rather than doing the hard work of change.',
    atTheirBest: 'Serene, principled, and quietly inspiring. They embody a calm moral clarity that makes others feel both peaceful and motivated. When they finally act on their ideals, they do so with a gentle power that moves people without force.',
    growth: 'Your vision is beautiful — but vision without action becomes escapism. Start small. Take one concrete step today towards the world you imagine. You have more capacity for impact than you believe.',
    stress: 'Under stress, 9w1s become critical and anxious internally while maintaining a placid exterior, building resentment about the gap between their ideals and what they feel capable of doing.',
    relationship: 'In relationships, 9w1s are gentle, principled, and quietly devoted. They create a harmonious, values-driven partnership. They need partners who encourage them to voice their opinions and who gently challenge them to turn their beautiful ideals into concrete plans.',
  },
};

/**
 * Determines the user's wing based on their scores.
 * The wing is the adjacent type (on the Enneagram circle) with the higher score.
 * If both adjacent types have equal scores, returns the lower-numbered wing.
 *
 * @param {string} coreType  The user's core type number as a string ('1'–'9')
 * @param {Record<string, number>} scores  All 9 type scores
 * @returns {{ wingType: string, wingKey: string, wing: object }}
 */
export function getWing(coreType, scores) {
  const [adj1, adj2] = WING_ADJACENTS[coreType];
  const score1 = scores[adj1] ?? 0;
  const score2 = scores[adj2] ?? 0;

  const wingType = score2 > score1 ? adj2 : adj1;
  const wingKey = `${coreType}w${wingType}`;

  return {
    wingType,
    wingKey,
    wing: enneagramWings[wingKey],
  };
}
