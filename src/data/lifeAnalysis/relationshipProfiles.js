/**
 * Relationship profiles keyed by A-E-N levels.
 *
 * Key format: "{Agreeableness}-{Extraversion}-{Neuroticism}"
 * Levels: L (0-35), M (36-65), H (66-100)
 *
 * Each profile contains:
 *   summary  – holistic 2-3 sentence relationship analysis
 *   items    – 3-4 actionable relationship-specific bullets
 */

const relationshipProfiles = {
  // ── High Agreeableness ──────────────────────────────────────────

  'H-H-H': {
    summary:
      'You pour enormous warmth into your relationships while craving constant connection — but your emotional intensity means you absorb every shift in your partner\'s mood as a referendum on the relationship itself. You love deeply and anxiously, giving more than you receive and then quietly drowning in resentment when the imbalance goes unacknowledged.',
    items: [
      'Your conflict-avoidance and emotional intensity are a dangerous combination. Practice the Gottman "soft startup": begin difficult conversations with "I feel..." rather than letting weeks of silence erupt into an emotional flood.',
      'You likely score highest on Acts of Service and Words of Affirmation in the love languages framework. Tell your partner explicitly which gestures refuel you — do not assume they can read the room as well as you can.',
      'Before agreeing to a social plan or favor, pause for ten seconds and ask yourself: "Do I actually want this, or am I afraid of disappointing them?" Track your answers for a week. The pattern will be revealing.',
      'You bond through shared experiences — cooking together, road trips, collaborative projects. Plan at least one per month to keep your connection tank full without relying solely on emotional processing.',
    ],
  },
  'H-H-M': {
    summary:
      'You are a natural relationship builder — warm, socially energized, and genuinely interested in the people around you. Your partnerships tend to be active and communicative, filled with shared activities and an easy emotional flow. Your moderate emotional reactivity means you can navigate most conflicts without spiraling, though you still lean toward accommodation over honest confrontation.',
    items: [
      'Your social calendar can crowd out one-on-one depth with your partner. Block one evening per week that belongs exclusively to the two of you — no friends, no group plans.',
      'You default to smoothing things over, which works until it doesn\'t. When you notice yourself saying "it\'s fine" more than twice about the same issue, that is your signal to bring it up directly.',
      'Your warmth makes you attractive to people who take more than they give. In new relationships, pay attention to reciprocity in the first three months — who initiates, who adjusts, who compromises.',
    ],
  },
  'H-H-L': {
    summary:
      'You are emotionally generous, socially magnetic, and remarkably steady — a combination that makes your relationships feel like a warm, safe harbor for the people in your life. You genuinely enjoy giving, rarely get rattled, and attract people effortlessly. The risk is that your calm agreeableness masks a pattern of neglecting your own needs until they become invisible even to you.',
    items: [
      'Your emotional steadiness is a gift to anxious partners, but it can also mean you never signal when something is wrong. Schedule a monthly "state of us" conversation where both partners share one thing that is working and one thing that is not.',
      'You are at risk for codependency precisely because caretaking feels natural rather than costly. Read up on the "overfunctioning/underfunctioning" pattern in Bowen Family Systems Theory — you are almost certainly the overfunctioner.',
      'Your low neuroticism means you may dismiss a partner\'s anxiety or emotional pain as overreaction. Practice reflective listening: repeat back what they said before offering solutions or reassurance.',
      'You likely attract a wide range of people. Be selective. Your tendency to see the best in everyone can delay recognizing when someone is genuinely not good for you.',
    ],
  },
  'H-M-H': {
    summary:
      'You care deeply about your relationships and feel everything at high volume, but your moderate social energy means you prefer a small number of close bonds over a wide network. You are the partner who remembers every emotional detail, anticipates needs, and quietly absorbs pain to keep the peace — until the accumulated weight becomes unbearable and surfaces as anxiety, withdrawal, or sudden emotional overwhelm.',
    items: [
      'When you are upset, write down what you are feeling before bringing it up. It prevents the emotional flood from overwhelming the conversation and gives your partner something concrete to respond to.',
      'Your anxiety often manifests as reassurance-seeking: "Are we okay? Do you still love me?" This puts your partner in a parental role. Instead, practice self-soothing first — journaling, a walk, deep breathing — and then check in from a calmer place.',
      'You need a partner who can handle emotional depth without withdrawing. Avoidant attachment styles will trigger your worst patterns. Learn the basics of attachment theory and notice which dynamic you are recreating.',
      'Protect your alone time. Your introversion needs recharging, and your agreeableness will sacrifice it for others if you let it. A depleted version of you is not a better partner.',
    ],
  },
  'H-M-M': {
    summary:
      'You bring a balanced, warm presence to relationships — caring without being consumed, social without being scattered. You form genuine connections at a comfortable pace and maintain them through consistent kindness and attention. Your risk is not dramatic dysfunction but quiet stagnation: you accommodate so readily that you may lose track of what you actually want from a relationship.',
    items: [
      'Your agreeableness makes you easy to be with, but "easy" can become "invisible." Make a habit of expressing preferences — where to eat, what movie to watch, what you need this weekend — even when you genuinely do not mind. The muscle atrophies if you never use it.',
      'In arguments, use the "XYZ" formula: "When you did X, in situation Y, I felt Z." It keeps the focus on behavior, not character, and prevents your natural conflict avoidance from turning every disagreement into a vague, unresolved tension.',
      'You are well-suited to partners across a wide temperament range. The key compatibility factor for you is whether they actively ask about your inner world — you will not volunteer it unprompted.',
    ],
  },
  'H-M-L': {
    summary:
      'You are warm, easygoing, and emotionally unflappable — the person everyone describes as "the nicest person I know." Your relationships tend to be pleasant and low-conflict, which sounds ideal until you realize that low-conflict can also mean low-honesty. Your calm agreeableness can quietly erode authenticity because you never push back hard enough for your partner to know where you actually stand.',
    items: [
      'Your biggest relationship risk is not conflict — it is the slow death of a connection where nobody ever says what they really think. Practice radical honesty in small doses: share one genuine opinion, preference, or frustration per day.',
      'Partners with high neuroticism will be drawn to your stability, but the dynamic can become therapist-patient if you are not careful. Maintain clear emotional boundaries: you can support without absorbing.',
      'You may not naturally prioritize the relationship because nothing feels urgent. Set intentional rituals — weekly date nights, daily check-ins, annual relationship reviews — to prevent comfortable drift.',
      'Your low emotional reactivity means you might not notice when your partner is struggling until they are in crisis. Ask "How are you really doing?" at least once a week, and then wait for the real answer.',
    ],
  },
  'H-L-H': {
    summary:
      'You love deeply from a quiet, private place — preferring one profound bond to a wide social circle. Your high agreeableness means you orient your life around your partner\'s needs, and your high neuroticism means you feel every ripple in the relationship as a potential tidal wave. You are intensely loyal but also intensely anxious, and the combination can create a clinging pattern that suffocates the very connection you are trying to protect.',
    items: [
      'Your attachment style likely leans anxious. Read "Attached" by Amir Levine and Rachel Heller — it will give you a framework for the patterns you have been living but could not name.',
      'You need a partner who offers consistent reassurance without you having to ask for it. This is not weakness — it is a legitimate emotional need. But you also need to build internal stability so that reassurance supplements rather than replaces your own self-worth.',
      'Limit relationship-checking behaviors: re-reading texts for hidden meanings, monitoring response times, asking "what\'s wrong?" when nothing is wrong. Each check temporarily soothes anxiety but reinforces the cycle.',
      'Invest in at least one deep friendship outside your romantic relationship. Your introversion makes this hard, but putting all your emotional weight on one person is unsustainable for both of you.',
    ],
  },
  'H-L-M': {
    summary:
      'You are a quiet, devoted partner who shows love through steady presence and thoughtful attention rather than grand gestures or social performance. You prefer deep, unhurried intimacy — long conversations, shared silence, knowing someone fully. Your moderate emotional stability keeps you grounded, though your agreeableness still makes it hard to voice dissatisfaction until it has built up significantly.',
    items: [
      'Your ideal relationship looks like a best friendship with romance layered in. Seek partners who value depth over novelty and can enjoy a quiet evening without interpreting it as boredom.',
      'You tend to give more than you ask for. Once a month, make a deliberate request of your partner — something you need, want, or would enjoy. Treat it as practice, not entitlement.',
      'Social obligations from your partner\'s life (family events, work parties, group vacations) will drain you. Negotiate in advance: attend the ones that matter most, gracefully skip the rest, and do not feel guilty about it.',
    ],
  },
  'H-L-L': {
    summary:
      'You are emotionally steady, deeply kind, and prefer the quiet intimacy of close partnership to any social performance. You create a stable, nurturing home base and show love through reliability, patience, and genuine care. Your challenge is that your combination of agreeableness and calm can make you so self-sufficient and accommodating that partners may never learn who you really are beneath the warmth.',
    items: [
      'You risk becoming the relationship\'s "rock" so completely that your partner forgets you have needs too. Rocks do not ask for help — but you must. Practice being the vulnerable one at least once a month.',
      'Your low need for stimulation means you are content with routine, but your partner may not be. Build in occasional novelty — a new restaurant, a weekend trip, a class together — to keep the relationship from becoming invisible to both of you.',
      'You are exceptionally compatible with anxious or high-neuroticism partners because your calm grounds them. Just make sure grounding does not become your entire role in the relationship.',
      'Conflict will not come to you naturally. You will have to go to it. When something bothers you, bring it up within 48 hours — the longer you wait, the more your agreeableness will convince you it was not worth mentioning.',
    ],
  },

  // ── Mid Agreeableness ───────────────────────────────────────────

  'M-H-H': {
    summary:
      'You are socially driven and emotionally intense — you need people, but people also exhaust you because you feel everything so strongly. Your moderate agreeableness means you are neither a pushover nor a bulldozer, but your high neuroticism amplifies every relational friction into a potential crisis. You are passionate, expressive, and at your best in relationships that can match your energy without being destabilized by it.',
    items: [
      'Your emotional intensity is not a flaw, but it needs a container. The Gottman method\'s "repair attempts" technique is essential for you: learn to de-escalate mid-conflict with humor, affection, or a brief timeout before things spiral.',
      'You process externally — you need to talk through feelings. But your partner may need time to think before responding. Agree on a signal that means "I need 20 minutes before I can engage with this" so neither person feels shut out or cornered.',
      'Your social energy means you maintain many friendships, which is healthy — but during emotionally turbulent periods, you may vent about your partner to friends before talking to your partner. This erodes trust. Go to the source first.',
      'High-neuroticism extraverts often cycle between "everything is amazing" and "everything is falling apart." Track your emotional baseline over a month. You will start to see which reactions are proportionate and which are amplified by mood.',
    ],
  },
  'M-H-M': {
    summary:
      'You bring a healthy balance to relationships: socially engaged, emotionally moderate, and neither too accommodating nor too combative. You navigate partnerships with a natural ease that many people envy. Your risk is not dysfunction but complacency — your balance can make you assume the relationship is fine when it actually needs active investment.',
    items: [
      'You are easy to be in a relationship with, which means problems can hide longer than they should. Do not wait for a crisis to evaluate the relationship\'s health. Use Gottman\'s "State of the Union" format quarterly: what is working, what is not, what do we each need.',
      'Your moderate agreeableness means you can hold boundaries without cruelty. This is a rare and valuable relational skill — lean into it during conflicts rather than defaulting to either aggression or avoidance.',
      'You thrive with partners who match your social energy. A highly introverted partner will need more alone time than feels natural to you — this is not rejection. Negotiate social schedules early.',
    ],
  },
  'M-H-L': {
    summary:
      'You are outgoing, emotionally steady, and pragmatic in relationships — you enjoy people, handle conflict without drama, and bring a refreshing directness to your partnerships. Your low neuroticism means you rarely spiral, but it also means you can miss the emotional undertones in conversations that your partner finds deeply significant.',
    items: [
      'Your calm confidence is attractive, but it can read as emotional unavailability to partners who need more processing. When your partner brings up a feeling, resist the urge to solve it. Say "Tell me more" before offering any response.',
      'You likely underestimate how much emotional labor your partner does. For one week, notice every time they check in on you, adjust plans for your comfort, or manage a social obligation — then acknowledge it explicitly.',
      'Your directness is a strength in relationships, but timing matters. The same honest observation that lands perfectly on a Saturday morning can feel brutal on a Wednesday night after a hard day. Read the room before speaking the truth.',
    ],
  },
  'M-M-H': {
    summary:
      'You feel things deeply and your relationships carry enormous emotional weight, but your moderate social energy and agreeableness mean you neither seek constant companionship nor sacrifice yourself endlessly for others. You are capable of real intimacy, but your neuroticism creates a persistent inner narrator that questions whether you are loved enough, doing enough, or good enough — and that narrator can sabotage what is actually working.',
    items: [
      'Your inner critic applies to relationships too. When your partner does something hurtful, you will replay it for days. Practice cognitive defusion: name the thought ("There is the \'they do not care about me\' story again") rather than fusing with it.',
      'Journaling before difficult conversations is essential for you. Get the emotional charge on paper first so you can speak from clarity rather than reactivity.',
      'You are prone to "mind-reading" — assuming you know what your partner thinks or feels without checking. Replace assumptions with direct questions: "I noticed you were quiet tonight. What is going on for you?"',
      'Your moderate agreeableness means you can advocate for yourself, but your anxiety makes it feel dangerous. Start with low-stakes assertions — choosing the restaurant, declining a social invitation — and build up to the harder ones.',
    ],
  },
  'M-M-M': {
    summary:
      'You are the relational equivalent of a Swiss Army knife — adaptable, reasonable, and functional across a wide range of relationship dynamics. You do not have extreme tendencies that create obvious problems, which is genuinely advantageous. The trade-off is that you may lack a strong relational identity — you adjust to whoever you are with rather than bringing a consistent, defined self to the table.',
    items: [
      'Your adaptability means you can partner with almost anyone, but "can" does not mean "should." Identify your three non-negotiable relationship values (e.g., intellectual curiosity, physical affection, shared humor) and filter partners through them rather than defaulting to compatibility by accommodation.',
      'Because you do not have extreme emotional patterns, you may not recognize when something is genuinely wrong until it is advanced. Schedule monthly relationship check-ins — do not rely on problems announcing themselves.',
      'You risk mirroring your partner\'s relationship style rather than developing your own. Spend time articulating what you need, how you show love, and what your attachment patterns look like. The "36 Questions" exercise by Arthur Aron is a good starting point for depth.',
    ],
  },
  'M-M-L': {
    summary:
      'You approach relationships with a relaxed, practical steadiness that makes you easy to live with but sometimes hard to read. You are neither highly emotional nor highly social, which means your partnerships tend to be calm and functional — but they can also drift toward autopilot if neither partner actively invests in emotional connection.',
    items: [
      'Your emotional steadiness is stabilizing, but it can also feel like indifference to a partner who needs more engagement. Make affection deliberate: a daily compliment, a weekly gesture, a monthly surprise. It does not need to feel urgent to be important.',
      'You are unlikely to initiate difficult conversations, and your partner may mistake your calm for not caring. When they raise an issue, engage fully — put your phone down, make eye contact, and reflect back what you heard before responding.',
      'You are compatible with a wide range of partners, but you will thrive most with someone who provides just enough emotional activation to keep you engaged without overwhelming your steady baseline.',
    ],
  },
  'M-L-H': {
    summary:
      'You are an intensely private person whose relationships are few but profoundly important. Your moderate agreeableness means you can assert your needs, but your high neuroticism fills every interaction with emotional subtext — you are constantly reading between the lines, and your introversion means you process it all internally before anyone knows something is wrong. By the time you speak up, you have already built a case in your head that may bear little resemblance to reality.',
    items: [
      'Your tendency to process alone means your partner is often the last to know something is bothering you. Set a 48-hour rule: if something still hurts after two days, bring it up — even if it feels small. Small things compound.',
      'You likely have an anxious-avoidant attachment blend: you crave deep closeness but pull away when it feels too vulnerable. Recognize this push-pull pattern and name it to your partner so they do not personalize it.',
      'In arguments, your neuroticism will generate worst-case interpretations while your introversion prevents you from checking them. Write down your interpretation, then write down two alternative explanations. Share all three with your partner.',
      'You need a partner who respects your need for solitude without interpreting it as withdrawal. Establish clear signals: "I need alone time to recharge" is different from "I am upset and pulling away," and your partner needs to know which one is happening.',
    ],
  },
  'M-L-M': {
    summary:
      'You value deep, quiet connection and approach relationships with a reserved pragmatism. You are selective about who you let in, and once you commit, you are steady and reliable. Your moderate agreeableness and neuroticism give you a balanced emotional range — you are neither volatile nor flat. The challenge is that your introversion and reserve can make you seem more self-contained than you actually are, leaving partners unsure of where they stand.',
    items: [
      'You show love through presence and reliability, but your partner may need verbal affirmation too. Make it a practice to say out loud what you are thinking — "I am glad you are here," "That meant a lot to me," "I missed you today."',
      'Your selectivity is a strength. You do not waste time on relationships that lack substance. But once you are in, guard against taking the relationship for granted because it passed your initial filter.',
      'Plan regular, low-key connection time that suits your energy: a morning coffee ritual, an evening walk, cooking dinner together. Consistency matters more than intensity for you.',
    ],
  },
  'M-L-L': {
    summary:
      'You are self-contained, calm, and comfortable with solitude in a way that most people find either enviable or baffling. Your relationships are characterized by low drama and high independence — you give your partner space and expect the same. The risk is that your emotional steadiness and introversion create such a self-sufficient baseline that a partner may feel unnecessary rather than chosen.',
    items: [
      'Independence is your default, but relationships require deliberate interdependence. Find at least one area of your life where you genuinely rely on your partner — not because you have to, but because it builds the connective tissue that sustains a partnership.',
      'Your emotional radar may be set too low. You can miss a partner\'s distress because it does not register on your calm baseline. Ask directly and often: "Is there anything you need from me right now?"',
      'You are best matched with a partner who also values autonomy but knows how to bridge the gap with intentional closeness. Two self-sufficient people can build a wonderful partnership — or two parallel lives under one roof. The difference is deliberate effort.',
    ],
  },

  // ── Low Agreeableness ───────────────────────────────────────────

  'L-H-H': {
    summary:
      'You are intense, socially bold, and emotionally reactive — a combination that makes your relationships vivid and volatile. You say what you think, feel things strongly, and need a wide social world, but your low agreeableness means conflict does not scare you the way it scares others. This makes you honest and magnetic, but it also means you can wound people in the heat of the moment and move on before they have finished bleeding.',
    items: [
      'Your directness is valuable, but your neuroticism turns it into a weapon during emotional flooding. Implement a strict 20-minute timeout rule during heated arguments — physically leave the room, regulate your nervous system, then return. Research shows it takes at least 20 minutes for physiological arousal to subside.',
      'You may confuse intensity with intimacy. A relationship that is constantly dramatic is not necessarily deep — it is just loud. Track how much of your emotional energy goes to conflict versus connection over a month.',
      'Your social confidence means you have options, and your low agreeableness means you are not afraid to exercise them. This can make partners feel replaceable. If you are committed, say so explicitly and often — your partner cannot read your mind.',
      'Learn the difference between assertiveness and aggression. Assertiveness is "I need this." Aggression is "You always fail at this." The Nonviolent Communication (NVC) framework — observations, feelings, needs, requests — was designed for people like you.',
    ],
  },
  'L-H-M': {
    summary:
      'You are socially confident, direct, and pragmatically balanced — you enjoy being around people, speak your mind without agonizing over it, and handle conflict with more ease than most. You bring a refreshing honesty to relationships, though your low agreeableness means your version of honesty can land harder than you intend.',
    items: [
      'Your directness is efficient but can feel dismissive to partners who process emotions more slowly. After stating your position, add: "How does that land for you?" It costs you five seconds and prevents hours of resentment.',
      'You are likely more competitive than you realize in your relationships. Notice when conversations become debates you need to win rather than problems you are solving together. Partnership is not a zero-sum game.',
      'You thrive with a partner who has enough backbone to push back on you without crumbling. If your partner agrees with everything you say, that is not compatibility — it is submission, and you will eventually lose respect for it.',
    ],
  },
  'L-H-L': {
    summary:
      'You are bold, socially dominant, and emotionally unshakeable — a natural leader in every room, including your relationships. You know what you want, you are not afraid to go get it, and you rarely second-guess yourself. This confidence is magnetic, but in intimate relationships it can steamroll a partner who does not have the same force of personality.',
    items: [
      'Your emotional steadiness combined with low agreeableness means you may genuinely not understand why your partner is upset. Before dismissing their reaction, consider: "Is it possible they are experiencing something I am not wired to feel as strongly?" Empathy is a skill, not an instinct, for you.',
      'You risk selecting partners who defer to you because it feels like harmony, then growing bored with the lack of challenge. Seek someone who matches your strength in different domains — you lead some areas, they lead others.',
      'Your low neuroticism means you recover from conflict quickly, but your partner may not. Just because you have moved on does not mean the conversation is over. Check in 24 hours after a disagreement to make sure it is actually resolved.',
      'Study the concept of "bids for connection" from Gottman research. Your partner makes small gestures — a touch, a comment about their day, pointing something out — that are invitations to connect. Your natural tendency may be to overlook them. Start turning toward those bids deliberately.',
    ],
  },
  'L-M-H': {
    summary:
      'You are emotionally intense and fiercely independent — you feel things deeply but refuse to soften your edges to make others comfortable. Your relationships are honest to the point of rawness, and your neuroticism means that underneath the tough exterior, you are more vulnerable than anyone suspects. You push people away with your sharpness and then ache when they leave.',
    items: [
      'Your pattern is likely: feel hurt → get angry → say something cutting → regret it later → feel too proud to apologize. Break the cycle at step three. When you feel the urge to strike, say "I am hurt and I need a minute" instead. It is more honest than the attack, not less.',
      'You may have a fearful-avoidant attachment style — craving closeness but trusting no one enough to be truly vulnerable. A therapist trained in attachment work (EFT — Emotionally Focused Therapy) can help you untangle this more effectively than willpower alone.',
      'Your directness is not the problem. Your timing and delivery are. The same truth delivered with care ("I feel disconnected from you and it scares me") lands completely differently than the armored version ("You obviously do not care").',
      'You need a partner who does not take your sharpness personally but also does not tolerate cruelty. The line between the two is where your relationship growth lives.',
    ],
  },
  'L-M-M': {
    summary:
      'You are straightforward, moderately social, and emotionally stable — you say what you mean, you do not need constant togetherness, and you handle conflict without drama. Your relationships tend to be functional and honest, though your low agreeableness means warmth is something you express through action rather than words, and your partner may sometimes feel like a respected colleague more than a loved one.',
    items: [
      'Your relational style is efficient but can feel transactional. Make a deliberate effort to express appreciation in words, not just deeds. "I appreciate you" costs nothing and deposits heavily in the emotional bank account.',
      'You handle disagreements well because you are not afraid of them, but you may underestimate how much your directness costs your partner emotionally. After conflicts, ask: "Are we good?" and mean it — do not assume that because you feel fine, they do too.',
      'You are best matched with a partner who values honesty over harmony and can handle your bluntness without wilting. But even the most resilient partner needs softness sometimes. Learn to deliver hard truths wrapped in genuine care.',
    ],
  },
  'L-M-L': {
    summary:
      'You are independent, direct, and almost preternaturally calm — very little rattles you, and you do not bend yourself to please others. Your relationships are built on mutual respect and practical partnership rather than emotional fusion. This makes you an excellent partner for someone who values autonomy, but it can feel cold or indifferent to someone who needs more emotional engagement.',
    items: [
      'Your emotional baseline is so steady that you may not realize when your partner is in genuine distress. What feels like a minor irritation to you might be a serious emotional event for them. Calibrate by asking, not assuming.',
      'You likely show love through problem-solving, practical support, and giving space. These are real expressions of care — but make sure your partner recognizes them as such. Ask them directly: "Do you feel loved by me? What would help you feel it more?"',
      'Your independence and low agreeableness mean you can come across as not needing the relationship. Even if that is partly true — you would survive fine alone — your partner needs to feel wanted, not just tolerated. Express desire, not just contentment.',
      'You will thrive with a partner who is emotionally self-sufficient and does not interpret your independence as rejection. Two secure, autonomous adults choosing each other daily is the healthiest relationship model — and it is yours to build.',
    ],
  },
  'L-L-H': {
    summary:
      'You are private, sharp-edged, and emotionally turbulent beneath a surface that most people never get past. Your low agreeableness protects you — you would rather be seen as difficult than vulnerable — and your introversion means very few people ever witness the emotional depth your neuroticism creates. Relationships are high-stakes for you because letting someone in requires dismantling defenses you have spent years building.',
    items: [
      'Your defensive sharpness is armor, not personality. The people who get close enough to see past it will find someone deeply feeling and fiercely loyal. But they need to know it is worth the effort — give them glimpses of the real you before they burn out on the armor.',
      'You likely have a dismissive-avoidant attachment style that masks anxious underpinnings. When intimacy increases, you create distance through criticism, withdrawal, or "testing" your partner. Name this pattern to yourself when it happens — awareness is the first step to interrupting it.',
      'Therapy is not optional for this profile — it is essential. Specifically, look for a therapist who practices EFT (Emotionally Focused Therapy) or schema therapy. You need a safe space to practice vulnerability before you can bring it to a relationship.',
      'Your ideal partner is someone patient, emotionally secure, and unbothered by your prickliness — but who refuses to accept it as a permanent condition. You need someone who gently and persistently calls you into connection.',
    ],
  },
  'L-L-M': {
    summary:
      'You are reserved, independent, and matter-of-fact in relationships — you do not seek out connection for its own sake, and when you do connect, you value substance over sentimentality. Your low agreeableness means you will not pretend to feel what you do not, and your introversion means you need significant alone time. Partners who interpret this as coldness will struggle, but those who understand it will find a deeply loyal, quietly attentive companion.',
    items: [
      'You express care through actions — fixing things, showing up when it matters, giving honest advice. Make sure your partner speaks that language, or translate: pair the action with a verbal acknowledgment like "I did this because you matter to me."',
      'Your need for solitude is non-negotiable, but frame it as a positive rather than a retreat. "I am going to recharge so I can be fully present with you tonight" lands very differently than disappearing without explanation.',
      'You respect competence and self-sufficiency in a partner. Seek someone who has a full life of their own — mutual independence, shared selectively, is your ideal relationship architecture.',
    ],
  },
  'L-L-L': {
    summary:
      'You are the most self-contained profile in this framework — independent, direct, emotionally steady, and genuinely comfortable alone. You do not seek relationships to fill a void, which means when you choose to be with someone, it is a deliberate, clear-eyed decision. The challenge is that your self-sufficiency can become so complete that a partner feels like an optional accessory rather than an essential part of your life.',
    items: [
      'You can go long stretches without feeling lonely, which means you may not notice when a relationship is dying from neglect. Set concrete relationship maintenance rituals — weekly quality time, daily physical affection, regular conversations about something other than logistics.',
      'Your directness, independence, and emotional steadiness are strengths, but combined they can make you seem impenetrable. Vulnerability is a choice for you, never a compulsion — which means when you do share something personal, your partner will value it enormously. Do it more often than feels natural.',
      'You are most compatible with someone equally independent who chooses partnership deliberately. The relationship model to aspire to is "two whole people building something together" — not fusion, not dependency, but intentional, chosen connection.',
      'Your low agreeableness means you will not stay in a bad relationship out of guilt or obligation, which is actually healthy. But make sure you distinguish between genuine incompatibility and the discomfort of growing closer. Not every urge to leave is wisdom — sometimes it is fear.',
    ],
  },
};

export default relationshipProfiles;
