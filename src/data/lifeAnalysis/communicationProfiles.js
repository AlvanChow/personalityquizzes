/**
 * Communication Style profiles keyed by E-A-O levels.
 *
 * Key format: "{Extraversion}-{Agreeableness}-{Openness}"
 * Levels: L (0-35), M (36-65), H (66-100)
 *
 * Each profile contains:
 *   summary  – holistic 2-3 sentence communication style analysis
 *   items    – 3-4 actionable bullets (strengths, blind spots, techniques)
 */

const communicationProfiles = {
  // ── High Extraversion ───────────────────────────────────────────
  'H-H-H': {
    summary:
      'You are a warm, expressive communicator who thinks out loud in metaphors and big-picture narratives. People are drawn to your enthusiasm and openness, but your tendency to dominate conversations with abstract ideas can leave practical listeners feeling unmoored — they enjoy the ride but sometimes leave unsure what was actually decided.',
    items: [
      'You tend to interrupt because your brain processes faster than others speak — try the 3-second rule: wait 3 full seconds after someone stops talking before you respond.',
      'In workplace meetings, your abstract framing inspires but can confuse. End every contribution with one concrete next step: "So specifically, I am proposing we..."',
      'Practice reflective listening with close friends and partners — paraphrase what they said before adding your own perspective. It slows you down and makes people feel genuinely heard.',
      'Your conflict style leans toward over-processing emotions verbally. In heated moments, try writing your thoughts first, then distilling them into three key "I" statements before the conversation.',
    ],
  },
  'H-H-M': {
    summary:
      'You are a natural connector who communicates with warmth and social intuition. You read rooms accurately and adjust your tone to keep everyone comfortable — but this diplomatic instinct can make you conflict-avoidant, saying what people want to hear rather than what they need to hear.',
    items: [
      'Your strength is making people feel included and valued in group conversations. Lean into this in facilitation roles — you are a natural meeting leader.',
      'Practice the sandwich method for feedback deliberately: genuine positive, specific constructive point, forward-looking encouragement. It fits your style and prevents your tendency to skip the critical middle.',
      'In romantic relationships, your agreeableness can mask resentment. Schedule monthly "state of the union" check-ins where you commit to raising one uncomfortable thing.',
      'Emails and texts lose your warmth — default to phone calls or video for anything emotionally nuanced.',
    ],
  },
  'H-H-L': {
    summary:
      'You are a gregarious, people-pleasing communicator who keeps things concrete and agreeable. You are the person who smooths over tension in group settings and keeps conversations practical and pleasant — but you can avoid necessary confrontation and default to surface-level pleasantries when depth is what the moment actually requires.',
    items: [
      'Your strength is keeping groups aligned and comfortable. In workplace settings, you are the natural peacekeeper during tense standups or retrospectives.',
      'Learn nonviolent communication (NVC) — naming observations, feelings, needs, and requests gives you a structured way to raise hard topics without feeling like you are attacking anyone.',
      'You tend to over-explain and soften too much when delivering critical feedback. Write your core message in one sentence first, then add context — not the other way around.',
      'In close friendships, your avoidance of deep or abstract conversation can feel shallow to partners who crave intellectual intimacy. Practice asking "why" follow-up questions instead of steering toward logistics.',
    ],
  },
  'H-M-H': {
    summary:
      'You are a charismatic communicator who combines social energy with intellectual curiosity and a willingness to push back. You thrive in debate and brainstorming, energized by the friction of different perspectives — but you can overwhelm quieter people who experience your intensity as steamrolling.',
    items: [
      'In meetings, you naturally take up space with ideas. Practice the "one idea, one question" rule: for every point you make, ask someone else a genuine question before continuing.',
      'Your directness paired with abstract thinking makes you excellent at reframing problems. Use this deliberately in conflict resolution — help people see the situation from a new angle.',
      'When writing emails, your first draft is usually too long and too conceptual. Cut it in half and lead with the specific ask or decision needed.',
      'In dating and close relationships, your love of intellectual sparring can feel combative to partners who experience disagreement as emotional threat. Check in: "Are you enjoying this debate or does it feel like an argument?"',
    ],
  },
  'H-M-M': {
    summary:
      'You are a socially confident, balanced communicator who adapts well across contexts. You can be diplomatic or direct depending on the situation, and you are comfortable in both structured and free-flowing conversations. Your flexibility is a genuine asset, though it can sometimes read as not having a strong point of view.',
    items: [
      'Your adaptability makes you effective in cross-functional teams where you translate between technical and non-technical communicators.',
      'In important conversations — performance reviews, relationship conflicts, negotiations — decide your communication stance before you walk in. Your flexibility can lead to going along with whoever is most assertive in the room.',
      'Use the STAR method (Situation, Task, Action, Result) when giving feedback at work. It gives your balanced style a concrete structure that makes your observations land harder.',
      'Your moderation can read as lack of conviction. When you genuinely care about something, say so explicitly: "This one really matters to me, and here is why."',
    ],
  },
  'H-M-L': {
    summary:
      'You are a socially energetic, no-nonsense communicator who says what you mean and keeps things practical. You cut through vagueness in meetings and prefer direct, concrete exchanges — but your bluntness combined with your volume can land harder than you intend, especially in one-on-one conversations where people feel cornered.',
    items: [
      'Your directness is a genuine workplace asset — you are the one who says what everyone is thinking. But pair it with curiosity: "Here is what I think — what am I missing?"',
      'In conflict, you default to stating your position louder rather than understanding the other side. Practice reflective listening: repeat back what you heard before making your point.',
      'Your emails are efficient but can read as curt. Add one human sentence — a genuine question about their work or a brief acknowledgment — before getting to business.',
      'In close relationships, your concrete communication style can frustrate partners who want emotional processing. When someone says "I had a hard day," they usually want empathy first, solutions second.',
    ],
  },
  'H-L-H': {
    summary:
      'You are a bold, intellectually provocative communicator who combines social dominance with a love of abstract ideas and a willingness to challenge consensus. You are the person who plays devil\'s advocate in every meeting — stimulating but exhausting for people who experience disagreement as personal.',
    items: [
      'You are naturally gifted at Socratic questioning and intellectual leadership. Channel this into roles like mentoring, teaching, or strategy — where challenging assumptions is valued.',
      'Your blind spot is emotional attunement. When someone shares a problem, your instinct is to debate their framing rather than acknowledge their experience. Practice saying "That sounds frustrating" before offering your analysis.',
      'In workplace communication, your combination of confidence and abstraction can read as arrogant. Ground your ideas with specific examples and data — it makes you persuasive instead of just provocative.',
      'Use "I" statements in conflict instead of "you" statements. "I see this differently" lands better than "You are not thinking about this clearly."',
    ],
  },
  'H-L-M': {
    summary:
      'You are a dominant, straightforward communicator who commands attention and speaks with conviction. You are not interested in sugarcoating or consensus for its own sake — you want to get to the point and move on. People respect your clarity but can find your directness abrasive, especially in emotionally sensitive contexts.',
    items: [
      'Your communication strength is cutting through ambiguity. In high-stakes meetings, you are the one who names the elephant in the room — this is genuinely valuable.',
      'Your biggest growth area is listening. Practice the discipline of asking three questions before stating your opinion in any conversation. You will be surprised what you learn.',
      'In personal relationships, your bluntness can create emotional distance. Learn to distinguish between honesty and unsolicited criticism — not every observation needs to be voiced.',
      'When giving feedback at work, use the SBI model (Situation, Behavior, Impact). It channels your directness into a format people can actually absorb without becoming defensive.',
    ],
  },
  'H-L-L': {
    summary:
      'You are a forceful, practical communicator who values efficiency above all else. You say exactly what you mean, keep things concrete, and have little patience for vagueness, hedging, or emotional processing. People know where they stand with you — but your bluntness can damage relationships you actually care about.',
    items: [
      'Your communication style is an asset in crisis situations, operational roles, and any context where speed and clarity matter more than feelings. Seek these environments out.',
      'Your biggest blind spot is that you equate emotional communication with weakness. People who need to process feelings before making decisions are not being inefficient — they are wired differently.',
      'Before difficult conversations with partners, friends, or direct reports, write down the outcome you actually want. Often your delivery undermines your own goals because people stop listening once they feel attacked.',
      'Practice one softening phrase per conversation: "I want to be direct with you because I respect you" or "This matters to me, so I am going to be honest." It costs you nothing and dramatically changes how your message lands.',
    ],
  },

  // ── Mid Extraversion ────────────────────────────────────────────
  'M-H-H': {
    summary:
      'You are a thoughtful, empathetic communicator who balances social engagement with genuine listening. You gravitate toward meaningful, idea-rich conversations and use abstract thinking to help people see their own situations more clearly — a natural counselor mode. Your challenge is that you can over-accommodate and lose your own perspective in the process.',
    items: [
      'You excel in one-on-one deep conversations. Use this strength deliberately — you are often the person friends and colleagues come to when they need to think something through.',
      'In group settings, you tend to hold back your ideas until you have fully formed them. Practice sharing half-baked thoughts — your tentative contributions are often more insightful than others\' polished ones.',
      'Your agreeableness combined with abstract thinking can make you vague when you need to be direct. When you have a specific request, state it plainly: "What I need is..." rather than hinting through metaphor.',
      'In conflict, you over-empathize with the other person\'s position and under-represent your own. Write down your non-negotiables before entering any difficult conversation.',
    ],
  },
  'M-H-M': {
    summary:
      'You are a steady, warm communicator who listens well and contributes thoughtfully. You are neither the loudest nor the quietest person in the room — you speak when you have something worth saying, and people tend to trust your judgment because of it. Your risk is fading into the background in high-energy groups.',
    items: [
      'Your balanced, trustworthy communication style makes you effective in mediation, HR, and any role requiring diplomatic judgment.',
      'In meetings dominated by louder voices, practice the "bookend" technique: speak early to establish presence, then again at the end to summarize or redirect. This prevents you from being overlooked.',
      'You are naturally skilled at "I" statements and diplomatic phrasing. Use this in written communication too — your emails tend to be well-received because they feel considered rather than reactive.',
      'Your tendency toward accommodation means you sometimes agree to things you resent later. Practice saying "Let me think about that and get back to you" instead of committing in the moment.',
    ],
  },
  'M-H-L': {
    summary:
      'You are a kind, practical communicator who keeps things grounded and considers others\' feelings. You are the person who remembers to check in on a struggling colleague and who keeps group conversations anchored in actionable specifics. Your weakness is that you can be so focused on keeping the peace that you avoid raising important issues.',
    items: [
      'Your strength is translating big decisions into concrete next steps while keeping everyone\'s feelings in mind. This makes you valuable in project coordination and team leadership.',
      'Practice raising concerns proactively rather than waiting until resentment builds. A simple framework: "I have noticed [specific observation], and I am concerned about [specific impact]."',
      'In personal relationships, your concrete communication style means you express care through actions rather than words. Some partners need to hear it explicitly — practice verbal affirmation even when it feels redundant.',
      'You may dismiss abstract or theoretical conversations as "pointless." Stay open — sometimes the conceptual detour is what leads to the practical breakthrough.',
    ],
  },
  'M-M-H': {
    summary:
      'You are a measured, intellectually curious communicator who engages when the topic is interesting and conserves energy when it is not. You contribute original perspectives and are willing to respectfully disagree, but you pick your moments carefully rather than filling every silence.',
    items: [
      'Your combination of moderate assertiveness and genuine curiosity makes you excellent at asking the questions no one else thinks to ask. Lean into this in strategic discussions.',
      'You communicate most effectively in smaller groups and one-on-one settings where ideas can develop organically. Volunteer for these settings over large presentations when possible.',
      'When you do disagree, you tend to frame it intellectually rather than personally — this is a real strength. Make it explicit: "I am pushing back on the idea, not on you."',
      'In close relationships, your tendency to engage selectively can read as emotional unavailability. Signal interest even when you are in listening mode: nodding, brief verbal acknowledgments, eye contact.',
    ],
  },
  'M-M-M': {
    summary:
      'You are an adaptable, even-keeled communicator with no strong tendencies toward dominance, deference, abstraction, or bluntness. You adjust to the communication norms of whatever group you are in, which makes you easy to work with but can leave people unsure who you really are.',
    items: [
      'Your flexibility is a genuine asset in diverse teams and cross-cultural communication. You code-switch naturally without it feeling performative.',
      'The risk of your balance is passivity. In important conversations, decide in advance what role you want to play — facilitator, advocate, challenger, listener — rather than defaulting to whatever the group needs.',
      'Develop a signature communication strength to anchor your versatility. Whether it is asking great questions, giving structured feedback, or writing clear emails — pick one and become known for it.',
      'In personal relationships, your even-tempered style is stabilizing but can feel emotionally flat. Practice naming your feelings explicitly, even when they are moderate: "I am a little hurt by that" is better than silence.',
    ],
  },
  'M-M-L': {
    summary:
      'You are a practical, moderate communicator who keeps things simple and prefers straightforward exchanges over elaborate discussions. You are neither especially assertive nor especially deferential — you engage sensibly and expect the same from others. Nuance and subtext can frustrate you.',
    items: [
      'Your straightforward style is an asset in operational and logistical communication. You write clear emails and give actionable instructions.',
      'In emotionally charged conversations — with partners, friends, or upset colleagues — your instinct to simplify can feel dismissive. Practice sitting with complexity: "I hear you, and I can see this is not simple."',
      'When receiving feedback, your tendency is to hear the practical takeaway and move on. Slow down and ask clarifying questions — sometimes the person is telling you something about the relationship, not just the task.',
      'In group brainstorming, your pragmatism keeps things grounded. Use the phrase "How would we actually implement that?" — it is genuinely useful and plays to your strength.',
    ],
  },
  'M-L-H': {
    summary:
      'You are a quietly provocative communicator — intellectually independent, willing to disagree, but not especially interested in commanding the room. You challenge ideas through incisive questions rather than forceful declarations, which makes your pushback harder to dismiss because it feels thoughtful rather than aggressive.',
    items: [
      'Your communication superpower is the well-timed, precisely worded question that reframes an entire discussion. Cultivate this — it is more influential than you realize.',
      'In workplace settings, your willingness to dissent combined with your measured delivery makes you valuable in quality reviews, risk assessment, and strategic planning.',
      'Your blind spot is warmth. People may respect your thinking but not feel connected to you. Practice genuine curiosity about people\'s experiences, not just their ideas.',
      'In personal relationships, your combination of intellectual directness and emotional reserve can feel cold. When your partner shares feelings, respond to the emotion first, the content second.',
    ],
  },
  'M-L-M': {
    summary:
      'You are a reserved, direct communicator who does not waste words. You speak when you have something specific to say and prefer efficiency over social niceties. People appreciate your honesty but may find it difficult to build rapport with you because you do not offer much conversational warmth or small talk.',
    items: [
      'Your efficiency is an asset in written communication — your emails and messages are clear, concise, and actionable. Lean into async communication channels where this style is valued.',
      'In meetings, your silence can be misread as disengagement or judgment. Signal participation with brief verbal cues: "Good point," "I agree with that approach," or even just a nod.',
      'When you need to give critical feedback, your natural directness works — but open with one genuine acknowledgment to prevent the listener from becoming immediately defensive.',
      'In close relationships, practice sharing your internal process out loud. Saying "I am thinking about what you said" is dramatically better than extended silence, even though to you the silence is just processing.',
    ],
  },
  'M-L-L': {
    summary:
      'You are a blunt, no-frills communicator who values brevity and concrete facts. You are impatient with vagueness, emotional processing, and social performance — you want to know what is happening, what needs to be done, and who is doing it. This efficiency can make personal relationships feel transactional.',
    items: [
      'Your communication style excels in high-efficiency environments: technical teams, operations, incident response, and any context where clarity outweighs diplomacy.',
      'Your biggest growth area is recognizing that emotional communication is not a waste of time — it is how most people build trust. Investing 60 seconds of empathy saves you hours of misunderstanding later.',
      'In written communication, your messages are admirably brief but can feel harsh. Read your emails from the recipient\'s perspective before sending — if you would not say it face-to-face without softening, add the softening.',
      'Practice the phrase "Tell me more about that" in personal conversations. It costs you almost nothing and signals genuine interest in a way that silence does not.',
    ],
  },

  // ── Low Extraversion ────────────────────────────────────────────
  'L-H-H': {
    summary:
      'You are a deeply empathetic, intellectually rich communicator who does your best work in writing or intimate one-on-one conversation. You listen intently, synthesize complex ideas with nuance, and offer perspectives that make people feel truly understood. Your challenge is that you struggle to speak up in group settings, where your insights go unheard.',
    items: [
      'Your written communication is your superpower — emails, long-form messages, and thoughtful feedback documents showcase your combination of warmth and depth. Volunteer for written deliverables.',
      'In meetings, prepare two or three points in advance and commit to sharing at least one. Your contributions carry weight precisely because you speak selectively.',
      'Your agreeableness combined with introversion can create a pattern of over-giving in relationships — you listen endlessly but rarely ask for attention in return. Practice saying "I need to talk through something" proactively.',
      'When you do have conflict, your instinct is to withdraw and process internally. Let the other person know: "I need some time to think about this, and I will come back to you by [specific time]."',
    ],
  },
  'L-H-M': {
    summary:
      'You are a gentle, considerate communicator who listens carefully and chooses words with care. You are the person people confide in because you create a sense of safety and non-judgment. Your challenge is that your preference for harmony combined with your quietness means your own needs often go unexpressed.',
    items: [
      'Your listening skills are genuinely exceptional. In professional settings, position yourself in roles that leverage this: interviewing, user research, counseling, or mediation.',
      'You tend to rehearse conversations extensively before having them, which makes you thoughtful but can also lead to avoidance. Set a deadline: if something has been bothering you for more than 48 hours, raise it.',
      'In group communication, use written pre-reads and follow-ups to contribute your ideas without competing for airtime in real-time discussions.',
      'Practice direct requests without excessive preamble. Instead of "I know you are busy, and this probably is not a big deal, but maybe if you have time..." try "Could you do [specific thing] by [specific time]?"',
    ],
  },
  'L-H-L': {
    summary:
      'You are a quiet, practical caretaker in conversations — you show up reliably, listen patiently, and express care through concrete actions rather than words. You keep things grounded and hate unnecessary drama. Your weakness is that you can be so focused on maintaining calm that you suppress real concerns until they become resentment.',
    items: [
      'Your communication strength is calm, dependable presence. In stressful work situations, you are a steadying influence — people feel safe around you.',
      'You express care through action — remembering details, following through on commitments, showing up consistently. Make sure the people closest to you know this is your love language, because they may not recognize it without being told.',
      'Your combination of introversion and agreeableness makes confrontation genuinely painful. Use structured formats: write a bullet-point list of your concerns before difficult conversations so you do not lose your nerve.',
      'In workplace communication, your preference for concrete, low-drama exchanges is an asset in operations and support roles. Avoid environments that reward self-promotion or constant visibility.',
    ],
  },
  'L-M-H': {
    summary:
      'You are a quiet, independent thinker who communicates with precision and intellectual depth. You prefer to fully develop your ideas before sharing them, and when you do speak, people notice because your contributions tend to be unusually well-considered. You can come across as aloof, though — not because you do not care, but because you live more in your head than in the social space.',
    items: [
      'Your written communication is likely significantly stronger than your verbal presence. Use this strategically — send pre-meeting briefs, write detailed proposals, and follow up conversations with summary emails.',
      'In one-on-one conversations about ideas, you are engaging and insightful. Seek out colleagues who share intellectual interests — these relationships become your professional network.',
      'Your moderate agreeableness means you will push back when it matters, but you do it quietly. Make sure your dissent is actually heard — follow up in writing if you sense your point was lost in a meeting.',
      'In personal relationships, your rich inner world can feel inaccessible to partners. Practice narrating your thought process: "Here is what I have been thinking about..." invites people in.',
    ],
  },
  'L-M-M': {
    summary:
      'You are a reserved, practical communicator who engages selectively and says what needs to be said without excess. You are not unfriendly — just efficient. People who know you well appreciate your reliability and straightforwardness, but new acquaintances can find you hard to read.',
    items: [
      'Your communication is most effective in structured, low-ambiguity settings. Agendas, clear roles, and defined expectations let you contribute without the social overhead that drains you.',
      'In new professional relationships, invest slightly more than feels natural in small talk and rapport-building. Two minutes of warmth at the start of a call buys you the directness you prefer for the rest of it.',
      'When you need to influence decisions, written proposals are your medium. You organize thoughts clearly and present them logically — this plays better on paper than in a fast-moving verbal debate.',
      'In personal relationships, your reserve can read as indifference. Develop a practice of explicit affirmation — saying "I enjoyed that," "That was a great dinner," or "I appreciate you" out loud, even when you assume it is obvious.',
    ],
  },
  'L-M-L': {
    summary:
      'You are a quiet, matter-of-fact communicator who values clarity and brevity. You do not see the point of elaborate social rituals or abstract discussions — you want to know the facts, make a decision, and move on. You are dependable and clear but can seem disengaged or uninterested to people who need more verbal and emotional feedback.',
    items: [
      'Your strength is clarity in practical communication. Instructions you write are easy to follow. Procedures you document are thorough. Lean into roles that value this precision.',
      'Your communication weakness is emotional reciprocity. When someone shares something personal, even a brief "Thanks for telling me that" or "I did not realize — that matters" goes further than you think.',
      'In workplace settings, your quietness combined with directness means people trust what you say — you are not performing. This is a real credibility asset in environments where others over-communicate.',
      'Avoid roles that require frequent public speaking, client relationship management, or extensive networking — not because you cannot do them, but because the energy cost is disproportionate to the return for your profile.',
    ],
  },
  'L-L-H': {
    summary:
      'You are an intellectually independent, private communicator who engages deeply with ideas but has little patience for social niceties or consensus-building. You think in systems and abstractions, and your insights are often sharp — but your delivery can be so detached that people dismiss valid points because they feel lectured rather than engaged.',
    items: [
      'Your communication strength is analytical precision. In written formats — reports, analyses, technical reviews — your ability to identify what others miss is a genuine asset.',
      'Your blind spot is interpersonal warmth. You may view it as unnecessary, but most people literally cannot process critical feedback from someone they do not feel some warmth from. Invest in the relationship before delivering the analysis.',
      'In workplace discussions, translate your abstract insights into concrete implications. "This architectural pattern will cause maintenance problems" is more actionable than "The underlying paradigm is flawed."',
      'In personal relationships, you may attract partners initially through your intellectual depth but struggle to maintain closeness because you resist emotional vulnerability. Practice sharing how you feel, not just what you think.',
    ],
  },
  'L-L-M': {
    summary:
      'You are a quiet, direct communicator who keeps interactions brief and functional. You say what you mean without embellishment and prefer to be left alone unless there is a specific reason to engage. People respect your honesty but may not feel close to you, which can limit your influence in environments that run on relationships.',
    items: [
      'Your straightforward, low-maintenance communication style is valued in technical, analytical, and operational roles where results matter more than rapport.',
      'In professional settings, identify one or two allies who understand your style and can advocate for you in meetings where visibility matters. You do not need to network broadly — just strategically.',
      'Your emails are efficient and clear, which is a genuine professional asset. For sensitive topics, though, add a brief human opener — it prevents your directness from reading as hostility in text.',
      'In personal relationships, your reserve and directness can feel rejecting to people who express affection verbally. Recognize that "How was your day?" is not a meaningless ritual — it is a bid for connection, and responding with more than one word matters.',
    ],
  },
  'L-L-L': {
    summary:
      'You are a private, concrete, no-nonsense communicator who strongly prefers actions over words. You engage minimally in social contexts, keep communication brief and factual, and feel drained by conversations that seem to have no practical purpose. Your reliability speaks for you — but your silence can create distance even with people you care about.',
    items: [
      'Your communication style works well in independent roles with minimal collaboration — technical work, trades, back-end operations, or any position where output matters more than presentation.',
      'Your biggest challenge is that the world requires more communication than you prefer. Identify the two or three relationships — personal and professional — that matter most, and invest more verbal energy there. You do not need to change for everyone, but you do need to show up for a few.',
      'In workplace settings, proactive updates (even brief ones) prevent others from filling your silence with assumptions. A weekly two-sentence status message can replace multiple unwanted check-in conversations.',
      'Consider that your discomfort with emotional or abstract communication may limit your understanding of others\' motivations. You do not need to enjoy it — but developing basic fluency in emotional language will make your practical skills significantly more effective.',
    ],
  },
};

export default communicationProfiles;
