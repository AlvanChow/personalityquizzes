/**
 * Personal Growth profiles keyed by most extreme trait + level.
 *
 * Unlike other categories (which use 3-trait combos), Growth identifies the
 * single trait with the score furthest from 50 and provides targeted growth
 * advice based on that trait's direction.
 *
 * Key format: "{Trait}-{Level}" where Trait is O/C/E/A/N and Level is H or L.
 * A special "balanced" key covers users with no trait exceeding 15 points
 * from center (all scores between 36-65).
 *
 * Each profile contains:
 *   summary  – holistic 2-3 sentence growth edge analysis
 *   items    – 3-4 specific growth exercises and practices
 */

const growthProfiles = {
  'O-H': {
    summary:
      'Your mind is a fountain of ideas, visions, and possibilities — but your growth edge is not generating more of them. It is finishing what you have already started. You are drawn to novelty so strongly that commitment feels like confinement, and the next interesting thing always seems more alive than the thing you are halfway through. Your real growth happens when you learn to stay with a single project past the point where it stops feeling exciting and push it across the finish line.',
    items: [
      'The "One Thing" practice: each morning, pick one idea from yesterday and take a single concrete step on it before exploring anything new. This builds the muscle of following through rather than branching out.',
      'Try the "finish before you start" rule for one month — no new projects, books, or creative experiments until you complete or deliberately close one that is already in progress. The Artist\'s Way by Julia Cameron has excellent exercises for channeling creative energy without scattering it.',
      'Set a 90-day commitment to one project and journal weekly about the urge to abandon it. Notice the pattern: excitement, plateau, restlessness, desire to quit. Growth lives on the other side of that restlessness.',
      'Practice "creative monogamy" with a single medium or domain for 30 days. If you paint, only paint. If you write, only write. Depth requires the discipline to say no to breadth, and that discipline is your most underdeveloped skill.',
    ],
  },
  'O-L': {
    summary:
      'You have built a life around what is familiar, reliable, and proven — and that has served you well. But your growth edge is deliberately stepping into the unfamiliar. Not because your preferences are wrong, but because your comfort zone has quietly become a cage. You avoid new experiences not because you have evaluated and rejected them, but because the discomfort of novelty itself has become the thing you are avoiding.',
    items: [
      'Start a "30-day challenge" practice: each month, commit to one small unfamiliar experience — a cuisine you have never tried, a genre of music you would normally skip, a route you have never walked. The goal is not to enjoy it but to prove you can tolerate the discomfort of not knowing.',
      'Read one book per quarter that is completely outside your usual interests. The Artist\'s Way by Julia Cameron or Big Magic by Elizabeth Gilbert can help you reconnect with curiosity you may have shut down years ago.',
      'Schedule a weekly "solo date" — one hour doing something you have no skill in and no opinion about. A pottery class, a foreign film, a jazz concert. Notice the resistance, and go anyway.',
      'Ask someone you respect: "What is one thing you think I should try that I would never choose on my own?" Then actually try it. Your growth requires external prompts because your internal compass always points toward the familiar.',
    ],
  },
  'C-H': {
    summary:
      'You are disciplined, organized, and reliable — and those qualities have earned you a lot. But your growth edge is learning to release control. You hold yourself to standards so high that imperfection feels like failure, and you struggle to delegate because nobody does it quite the way you would. Your real growth is not becoming more disciplined — it is learning that good enough is often genuinely good enough, and that self-worth is not the same thing as productivity.',
    items: [
      'Practice deliberate imperfection: once a week, send an email without re-reading it, leave a task at 80% completion, or let someone else handle something "your way." Notice the anxiety — and notice that nothing actually falls apart.',
      'Read Self-Compassion by Kristin Neff. Your inner critic is loud and you have mistaken it for motivation. Growth means learning to distinguish between healthy standards and self-punishment.',
      'Delegate one meaningful task per week without correcting the result. The goal is not efficiency — it is tolerating the discomfort of someone else doing it differently. This is a skill, not a personality flaw.',
      'Build a daily self-compassion practice: at the end of each day, name one thing you did well enough — not perfectly, not impressively, just adequately. You need to retrain your brain to register "sufficient" as acceptable.',
    ],
  },
  'C-L': {
    summary:
      'You are spontaneous, flexible, and comfortable with chaos — but your growth edge is building just enough structure to support the life you actually want. Not rigid systems or crushing discipline, but small, lightweight habits that create consistency without suffocating you. The freedom you value most is actually undermined when nothing gets finished and commitments keep slipping, because unreliability eventually limits your options more than any routine would.',
    items: [
      'Start with the "2-minute rule" from Atomic Habits by James Clear: if a task takes less than two minutes, do it immediately instead of adding it to a mental list you will forget. This one habit alone can change your relationship with follow-through.',
      'Build one anchor habit — a single non-negotiable daily action that takes less than five minutes. Make your bed, write three priorities on a sticky note, or do a 2-minute morning review. Consistency with one thing builds the neural pathway for consistency with everything.',
      'Use a simple weekly review: every Sunday, spend 15 minutes writing down what you said you would do this week and what you actually did. No judgment — just awareness. The gap between intention and action is where your growth lives.',
      'Try "temptation bundling" — pair a habit you need to build with something you already enjoy. Listen to your favorite podcast only while doing the task you have been avoiding. Your brain does not lack willpower; it lacks sufficient motivation for boring-but-important things.',
    ],
  },
  'E-H': {
    summary:
      'You are energized by people, conversation, and action — and that extraverted drive has built you a rich social world. But your growth edge is cultivating a meaningful inner life. You fill silence with noise, solitude with company, and reflection with activity — not because you are shallow, but because stillness feels uncomfortable in a way you may not have examined. Your deepest growth happens in the spaces between conversations, when you learn to be alone with your own thoughts without reaching for your phone or another person.',
    items: [
      'Start a daily journaling practice — even 10 minutes. Use a prompt like "What am I avoiding thinking about?" or "What do I actually want, separate from what others expect?" You process externally by default, and journaling forces internal processing that conversations cannot replace.',
      'Schedule one "silent morning" per week: no calls, no podcasts, no social media until noon. Notice what comes up when you stop performing and start listening to yourself. The discomfort is the growth.',
      'Try a solo activity that you would normally do with others — eating at a restaurant alone, hiking alone, or attending an event alone. The goal is not isolation but building comfort with your own company.',
      'Read Quiet by Susan Cain — not to become an introvert, but to understand what solitude offers that social connection cannot. Specifically, practice one form of deep reflection weekly: meditation, long walks without earbuds, or unstructured thinking time.',
    ],
  },
  'E-L': {
    summary:
      'You are comfortable with solitude, deep thought, and independence — and those qualities give you a rich inner life that many people never develop. But your growth edge is social courage: the willingness to initiate connection, tolerate the discomfort of group settings, and risk being seen. Not because introversion is a flaw, but because avoiding social situations entirely limits your life in ways that feel protective but are actually constricting.',
    items: [
      'Set a weekly "social stretch" goal: one conversation you would not normally initiate. Message a colleague, invite an acquaintance for coffee, or ask a question in a group setting. The goal is not to enjoy it — it is to prove you can tolerate the discomfort and survive.',
      'Practice the "first move" in low-stakes settings: compliment a barista, ask a neighbor how their day is going, or introduce yourself to one new person at a gathering. Social confidence is built through repetition, not personality change.',
      'Join one structured social activity — a book club, a class, a volunteer group — where interaction is built into the format so you do not have to generate it from scratch. Structured social settings are dramatically easier for introverts than unstructured ones.',
      'Read Nonviolent Communication by Marshall Rosenberg. Your growth is not about talking more — it is about connecting more authentically when you do talk. Learning to express needs and feelings directly reduces the social anxiety that makes connection feel exhausting.',
    ],
  },
  'A-H': {
    summary:
      'You are warm, empathetic, and attuned to others\' needs — and people trust you because of it. But your growth edge is boundaries. You say yes when you mean no, you absorb others\' emotions as if they were your own, and you treat conflict as something to be avoided at all costs. Your real growth is learning that saying no is not selfish, that healthy conflict is not cruelty, and that taking care of yourself is not the same as abandoning others.',
    items: [
      'Practice saying no to one request per week that you would normally agree to out of guilt or obligation. Use the script: "I appreciate you asking, but I cannot take that on right now." Do not explain or justify — the discomfort of their disappointment is yours to tolerate, not yours to fix.',
      'Read Set Boundaries, Find Peace by Nedra Glennon Tawwab or The Disease to Please by Harriet Braiker. Your pattern of over-giving has a structure you can learn to see and interrupt.',
      'Start a daily check-in: "What do I actually want right now, separate from what everyone else wants from me?" Write the answer down. You have spent so long attuning to others that you may have genuinely lost track of your own preferences.',
      'Practice tolerating conflict without immediately resolving it. When a disagreement arises, resist the urge to smooth it over. Sit with the tension for 24 hours before responding. You will discover that most conflicts do not actually need your intervention — they need your patience.',
    ],
  },
  'A-L': {
    summary:
      'You are independent, direct, and skeptical — qualities that protect you from being taken advantage of but can also keep people at arm\'s length. Your growth edge is empathy: not the performative kind, but genuine curiosity about other people\'s inner worlds. You tend to evaluate others\' perspectives rather than truly inhabiting them, and your directness, while efficient, can shut down the vulnerability that real relationships require.',
    items: [
      'Practice active listening with a specific structure: when someone shares a problem, reflect back what they said before offering your opinion. "It sounds like you are feeling [X] because of [Y]" — then wait. You will be surprised how often people do not need your solution; they need to feel heard.',
      'Read Nonviolent Communication by Marshall Rosenberg. It provides a concrete framework for expressing yourself directly while still honoring others\' experiences — a skill set that bridges your natural directness with the empathy you are developing.',
      'Try a "curiosity practice" in conversations: ask one genuine follow-up question about the other person\'s experience before sharing your own take. Not a strategic question — a genuinely curious one. "What was that like for you?" is a good starting point.',
      'Volunteer for a cause that puts you in direct contact with people whose experiences differ from yours — a food bank, a mentorship program, a crisis hotline. Empathy is not a feeling you generate through willpower; it is a skill built through exposure to lives different from your own.',
    ],
  },
  'N-H': {
    summary:
      'You feel everything intensely — anxiety arrives fast, emotions run deep, and your inner world is a constant weather system. Your growth edge is not feeling less but developing distress tolerance: the ability to experience intense emotions without being controlled by them. You tend to treat every emotional spike as an emergency that requires immediate action, when often the most powerful thing you can do is nothing — just wait, breathe, and let the wave pass.',
    items: [
      'Learn and practice the RAIN technique from Tara Brach: Recognize what you are feeling, Allow it to be there, Investigate it with curiosity, and Nurture yourself with self-compassion. This interrupts the spiral of reacting to your reactions.',
      'Start a "feelings log" — three times a day, write down what you are feeling and rate its intensity from 1 to 10. After two weeks, review the log. You will notice that intense feelings always pass, and this evidence is more convincing than any affirmation.',
      'Read Feeling Good by David Burns or The Happiness Trap by Russ Harris. CBT and ACT approaches are specifically designed for minds like yours — they do not ask you to feel less, they teach you to respond differently to what you feel.',
      'Practice the 90-second rule: neuroscience research shows that the chemical lifespan of an emotion in the body is roughly 90 seconds. When a feeling hits, set a timer and simply observe the sensation without acting on it. What remains after 90 seconds is story, not emotion — and stories can be rewritten.',
    ],
  },
  'N-L': {
    summary:
      'You are emotionally steady, even-keeled, and rarely rattled — which makes you reliable and calm under pressure. But your growth edge is emotional attunement: developing a richer, more granular relationship with your own feelings and the feelings of others. Your steadiness can shade into emotional flatness, where you are not so much managing emotions as bypassing them entirely. Growth means learning to sit with discomfort rather than dismissing it, and recognizing that emotions you do not feel strongly still carry important information.',
    items: [
      'Build an emotional vocabulary practice: three times a day, pause and name what you are feeling using specific language — not "fine" or "okay" but frustrated, restless, content, uneasy, hopeful, flat. The Feeling Wheel (developed by Dr. Gloria Willcox) is a useful tool for expanding your emotional vocabulary beyond the five words you currently rotate between.',
      'Practice "empathic mirroring" in conversations: when someone shares something emotional, resist the urge to problem-solve or reassure. Instead, reflect their feeling back: "That sounds really frustrating" or "It makes sense you would feel hurt by that." This builds emotional attunement that your natural composure tends to bypass.',
      'Try one practice that deliberately activates emotion: watching a film that moves you, listening to music that stirs something, or reading personal essays about experiences very different from your own. Your growth is not about manufacturing feelings — it is about noticing the ones that are already there but too quiet to register.',
      'Read Permission to Feel by Marc Brackett. It provides a research-backed framework for developing emotional intelligence that does not require you to become someone you are not — just more aware of what is already happening beneath your calm surface.',
    ],
  },
  'balanced': {
    summary:
      'Your personality scores sit near the center across all five traits, which means no single dimension dominates your experience — and no single dimension offers an obvious growth lever. Your growth edge is intentionality: because nothing feels extreme, you can drift through life without the friction that forces other people to develop. Your challenge is not managing a dominant trait but choosing a direction deliberately rather than defaulting to the comfortable middle.',
    items: [
      'Pick one trait to deliberately stretch this quarter — not because it is a weakness, but as an experiment in range. Spend a month living slightly more adventurously (Openness), more disciplined (Conscientiousness), more socially engaged (Extraversion), more boundaried (Agreeableness), or more emotionally expressive (Neuroticism). Growth for you is chosen, not forced.',
      'Start a quarterly "life audit" practice: spend 30 minutes reviewing your satisfaction across relationships, work, health, and personal development. Without extreme traits pushing you toward crisis or excellence, stagnation is your primary risk — and regular honest assessment is the antidote.',
      'Read Designing Your Life by Bill Burnett and Dave Evans. It provides a structured framework for building a meaningful life when your personality does not hand you an obvious blueprint — which is both the challenge and the freedom of a balanced profile.',
      'Build one keystone habit from Atomic Habits by James Clear — a single daily practice that creates a ripple effect across other areas of your life. For balanced profiles, the hardest part is not ability but activation. You can do almost anything adequately, so the question becomes: what do you actually want to do well?',
    ],
  },
};

export default growthProfiles;
