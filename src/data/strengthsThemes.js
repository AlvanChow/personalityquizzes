// CliftonStrengths (StrengthsFinder) theme definitions
// 34 themes organised across 4 domains.
// Official domain color coding:
//   Executing           → orange / amber
//   Influencing         → yellow / lime
//   Relationship Building → blue / sky
//   Strategic Thinking  → purple / violet

export const DOMAIN_COLORS = {
  Executing: {
    bg: 'from-orange-100 to-amber-100',
    accent: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    bar: 'from-orange-300 to-amber-400',
    icon: 'bg-orange-100 text-orange-600',
  },
  Influencing: {
    bg: 'from-yellow-100 to-lime-100',
    accent: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    bar: 'from-yellow-300 to-lime-400',
    icon: 'bg-yellow-100 text-yellow-600',
  },
  'Relationship Building': {
    bg: 'from-blue-100 to-sky-100',
    accent: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    bar: 'from-blue-300 to-sky-400',
    icon: 'bg-blue-100 text-blue-600',
  },
  'Strategic Thinking': {
    bg: 'from-purple-100 to-violet-100',
    accent: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700 border-purple-200',
    bar: 'from-purple-300 to-violet-400',
    icon: 'bg-purple-100 text-purple-600',
  },
};

export const strengthsThemes = {
  // ── EXECUTING ──────────────────────────────────────────────────────────────
  Achiever: {
    name: 'Achiever',
    domain: 'Executing',
    emoji: '🏆',
    description:
      'You have a constant need for achievement. At the end of each day you must have accomplished something tangible. This internal fire drives you to work hard and to keep going even after others have stopped. Your energy is relentless, and your stamina is the envy of those around you.',
    atWork:
      'You are a natural producer. You set ambitious goals, hold yourself accountable, and push through fatigue to cross the finish line. Teams rely on you to keep momentum going when energy starts to flag.',
    inRelationships:
      'You bring discipline and reliability to your relationships. Partners and friends know you will follow through. The challenge is learning to be fully present without mentally tallying what else you could be getting done.',
    watchOut:
      'Your relentless drive can shade into workaholism. Rest can feel wasteful, and your high standards may make you impatient with people who work at a slower pace.',
    pairsWith: ['Focus', 'Discipline', 'Responsibility'],
    famousPeople: ['Serena Williams', 'Tim Cook', 'Elon Musk'],
  },

  Arranger: {
    name: 'Arranger',
    domain: 'Executing',
    emoji: '🎛️',
    description:
      'You are a conductor. When faced with a complex situation involving many factors, you enjoy managing all the variables and aligning them into the most productive configuration. You are flexible and thrive on complexity.',
    atWork:
      'You instinctively see how different people, roles, and resources can fit together to produce the best outcome. When plans change — as they always do — you adapt quickly and find a better arrangement.',
    inRelationships:
      'You are a natural organizer in group settings and family life. You enjoy creating harmony between different personalities and schedules, but you may need to be mindful of overriding others\' preferences.',
    watchOut:
      'Your love of rearranging can make you restless with stable configurations. Not every situation needs to be optimized, and constant reorganization can unsettle teammates who prefer consistency.',
    pairsWith: ['Maximizer', 'Strategic', 'Activator'],
    famousPeople: ['Oprah Winfrey', 'Barack Obama', 'Angela Merkel'],
  },

  Belief: {
    name: 'Belief',
    domain: 'Executing',
    emoji: '🧭',
    description:
      'You have certain core values that are enduring. These values give your life meaning and direction. They provide an unwavering anchor of purpose, and your life is oriented around these deeply held convictions.',
    atWork:
      'You are most motivated when your work aligns with your values. You bring an ethical compass that others trust, and you will openly challenge decisions that conflict with what you believe is right.',
    inRelationships:
      'You form deep, loyal bonds with people who share your core values. You are dependable and principled — a friend who stands for something and can be counted on in a moral crisis.',
    watchOut:
      'When your values are threatened, you can become rigid or self-righteous. Be mindful that your convictions, though genuine, are not always the only valid perspective.',
    pairsWith: ['Responsibility', 'Consistency', 'Relator'],
    famousPeople: ['Nelson Mandela', 'Malala Yousafzai', 'Martin Luther King Jr.'],
  },

  Consistency: {
    name: 'Consistency',
    domain: 'Executing',
    emoji: '⚖️',
    description:
      'You are keenly aware of the need to treat people the same. You try to avoid special treatment for individuals, believing that real fairness comes from stable rules applied equally to everyone.',
    atWork:
      'You create predictable, transparent processes that everyone can rely on. You are trusted precisely because people know you will apply the same standards regardless of who is involved.',
    inRelationships:
      'You are a fair and principled companion. You don\'t play favorites, and people appreciate your sense of justice. This reliability makes you a trusted and stabilizing presence.',
    watchOut:
      'Rigid adherence to uniform rules can prevent you from recognizing when individual circumstances warrant a different approach. Equity sometimes means treating people differently based on their needs.',
    pairsWith: ['Responsibility', 'Belief', 'Harmony'],
    famousPeople: ['Ruth Bader Ginsburg', 'Abraham Lincoln', 'Malala Yousafzai'],
  },

  Deliberative: {
    name: 'Deliberative',
    domain: 'Executing',
    emoji: '🔍',
    description:
      'You are best described by the serious care you take in making decisions or choices. You anticipate obstacles and see where things could go wrong. This vigilance keeps you and your team from costly mistakes.',
    atWork:
      'Your risk-awareness is a valuable counterweight to impulsive decisions. You spot potential pitfalls before they become problems, and others come to trust your careful judgment.',
    inRelationships:
      'You are private and selective about who you let in. The relationships you do form are deep and considered. You are not one for quick intimacy, but when you trust, your commitment is total.',
    watchOut:
      'Your caution can look like pessimism to action-oriented peers. Be careful that deliberation does not become paralysis, particularly in fast-moving environments that reward speed.',
    pairsWith: ['Analytical', 'Responsibility', 'Focus'],
    famousPeople: ['Warren Buffett', 'Angela Merkel', 'Alan Greenspan'],
  },

  Discipline: {
    name: 'Discipline',
    domain: 'Executing',
    emoji: '📋',
    description:
      'Your world needs to be ordered. Predictability is your friend. You like to have a plan and follow it. Structure gives you the confidence to move forward, and you instinctively impose order wherever you find chaos.',
    atWork:
      'You create systematic workflows and timelines that keep projects on track. You are the teammate who shows up on time, prepared, and ready — and you expect the same from others.',
    inRelationships:
      'You bring reliability and structure to your relationships. Others know they can count on you to keep commitments and organize shared responsibilities. You may need patience with spontaneous personalities.',
    watchOut:
      'When structure breaks down — as it inevitably does — you may experience disproportionate frustration. Flexibility and improvisation are skills worth developing to complement your natural orderliness.',
    pairsWith: ['Focus', 'Achiever', 'Consistency'],
    famousPeople: ['Tim Cook', 'Michelle Obama', 'Roger Federer'],
  },

  Focus: {
    name: 'Focus',
    domain: 'Executing',
    emoji: '🎯',
    description:
      'You need a clear destination. Absent that, your life and work can quickly become frustrating. Once you have a goal, you take all actions with that goal in mind, filtering out everything that does not move you toward it.',
    atWork:
      'You keep teams on course when distraction and scope creep threaten to derail progress. You ask the clarifying question: "Does this serve our goal?" — and you do not let go until it is answered.',
    inRelationships:
      'You are deeply committed when you decide someone or something is worth your energy. However, your single-mindedness can cause loved ones to feel secondary when a major goal has your full attention.',
    watchOut:
      'Your focus can become tunnel vision. You may miss important context, relationships, or opportunities that lie outside your current goal. Periodic recalibration broadens your perspective.',
    pairsWith: ['Achiever', 'Discipline', 'Strategic'],
    famousPeople: ['Steve Jobs', 'Simone Biles', 'Michael Jordan'],
  },

  Responsibility: {
    name: 'Responsibility',
    domain: 'Executing',
    emoji: '🤝',
    description:
      'You take psychological ownership of what you say you will do. You are committed to stable values such as honesty and loyalty. When you fail — even in small ways — you feel compelled to do whatever it takes to make things right.',
    atWork:
      'You are the person others rely on when something absolutely must get done. You take ownership completely and hold yourself to a higher standard than anyone else would demand of you.',
    inRelationships:
      'Your word is your bond. The people in your life know you will never leave them hanging. This reliability builds profound trust, though your excessive sense of obligation can sometimes take on others\' burdens unnecessarily.',
    watchOut:
      'Your sense of accountability can lead you to over-commit, take on tasks that others should own, and feel guilt for things outside your control. Learning to say no is an act of integrity, not a failure of responsibility.',
    pairsWith: ['Achiever', 'Belief', 'Consistency'],
    famousPeople: ['Colin Powell', 'Jacinda Ardern', 'Jimmy Carter'],
  },

  Restorative: {
    name: 'Restorative',
    domain: 'Executing',
    emoji: '🔧',
    description:
      'You love to solve problems. While some people are unsettled by problems, you are energized by them. You enjoy the challenge of analyzing a situation, identifying what is wrong, and finding the solution.',
    atWork:
      'You thrive in turnaround situations. When a project, system, or team is struggling, you dig in and figure out what is broken. Your diagnostic instinct is a powerful asset in any environment facing challenges.',
    inRelationships:
      'You are the friend people call when things go wrong. Your calm in crisis, practical thinking, and genuine desire to help people recover are deeply valued by those close to you.',
    watchOut:
      'You may have a bias toward finding problems even where none exist. This can make you focus on what is broken rather than celebrating what is working, which can demoralize people who need encouragement.',
    pairsWith: ['Analytical', 'Deliberative', 'Developer'],
    famousPeople: ['Elon Musk', 'Marie Curie', 'Thomas Edison'],
  },

  // ── INFLUENCING ────────────────────────────────────────────────────────────
  Activator: {
    name: 'Activator',
    domain: 'Influencing',
    emoji: '⚡',
    description:
      '"When can we start?" This is a recurring question in your life. You are impatient for action. You may concede that analysis has its place, but you know that only action is real. Actions drive learning, and learning drives progress.',
    atWork:
      'You are the spark that gets things moving. When teams are paralyzed by over-planning, your bias toward action breaks the logjam. You make things happen and inspire others to start before they feel fully ready.',
    inRelationships:
      'You bring excitement and momentum to groups. Your enthusiasm is contagious, and you push the people around you to stop hesitating and take the leap. You may need patient friends who help you slow down when needed.',
    watchOut:
      'Your impatience with deliberation can lead to premature action. Starting before thinking through consequences can create problems that more cautious preparation would have prevented.',
    pairsWith: ['Achiever', 'Command', 'Maximizer'],
    famousPeople: ['Richard Branson', 'Oprah Winfrey', 'Gary Vaynerchuk'],
  },

  Command: {
    name: 'Command',
    domain: 'Influencing',
    emoji: '👁️',
    description:
      'You have presence. You can take control of a situation and make decisions. You are not frightened by confrontation — rather, you know that confrontation is often the first step toward resolution.',
    atWork:
      'You step naturally into leadership vacuums. When no one knows who is in charge, you are. Your directness cuts through ambiguity, and people respect — and sometimes fear — your willingness to say the hard thing.',
    inRelationships:
      'You are a powerful, direct communicator who values honesty above comfort. Others may initially find you intimidating, but those who know you appreciate that they always know where they stand.',
    watchOut:
      'Your directness can come across as domineering or aggressive to those with more sensitive styles. Not every situation calls for command, and learning to soften your approach expands your influence.',
    pairsWith: ['Activator', 'Self-Assurance', 'Significance'],
    famousPeople: ['Winston Churchill', 'Margaret Thatcher', 'Indra Nooyi'],
  },

  Communication: {
    name: 'Communication',
    domain: 'Influencing',
    emoji: '🎤',
    description:
      'You like to explain, describe, host, speak in public, and write. Ideas are dry until you give them life, presence, and energy through your words. You find the perfect story, illustration, or example to bring them to life.',
    atWork:
      'You are a gifted presenter, writer, and storyteller. You turn complex ideas into clear narratives, and your ability to articulate a vision aligns and energizes teams around shared goals.',
    inRelationships:
      'You are engaging, expressive, and rarely at a loss for words. Friends and family love your stories. You make gatherings lively and have a gift for making people feel heard and entertained.',
    watchOut:
      'You may sometimes fill silence with words when listening would serve better. Your communication gift is most powerful when paired with genuine curiosity about what others think and feel.',
    pairsWith: ['Woo', 'Activator', 'Significance'],
    famousPeople: ['Barack Obama', 'Brené Brown', 'Martin Luther King Jr.'],
  },

  Competition: {
    name: 'Competition',
    domain: 'Influencing',
    emoji: '🥇',
    description:
      'Competition is rooted in comparison. When you look at the world, you are instinctively aware of other people\'s performance. You want to outperform your peers, and you are energized by measuring yourself against external benchmarks.',
    atWork:
      'You push performance standards higher for everyone around you. Your drive to win elevates team output, and you celebrate victory with genuine joy. You know that the best come from competing against the best.',
    inRelationships:
      'You are a compelling and energizing partner in shared endeavors. Your competitiveness can make collaborative projects feel like winning. However, turning everyday moments into contests can exhaust people who are not wired the same way.',
    watchOut:
      'A loss can haunt you longer than is healthy. Be mindful that not every interaction is a competition, and your drive to win can damage relationships if it crowds out generosity and cooperation.',
    pairsWith: ['Achiever', 'Maximizer', 'Significance'],
    famousPeople: ['Michael Jordan', 'Kobe Bryant', 'Serena Williams'],
  },

  Maximizer: {
    name: 'Maximizer',
    domain: 'Influencing',
    emoji: '✨',
    description:
      'Excellence, not average, is your measure. Taking something from below average to slightly above average takes a great deal of effort and doesn\'t excite you much. Transforming something strong into something superb — that is your drive.',
    atWork:
      'You identify the strongest performers and strongest ideas and invest your energy there. You ask: "What would this look like if we made it exceptional?" and then do not rest until you get there.',
    inRelationships:
      'You see the best in people and draw it out. Your belief in people\'s potential is a gift. However, your focus on excellence may make you impatient with mediocrity and cause you to overlook what is simply "good enough."',
    watchOut:
      'Your pursuit of excellence can become perfectionism. You may withhold praise for solid work, waiting for the exceptional, and inadvertently demoralize people who are genuinely trying their best.',
    pairsWith: ['Achiever', 'Arranger', 'Strategic'],
    famousPeople: ['Oprah Winfrey', 'Steve Jobs', 'Coco Chanel'],
  },

  'Self-Assurance': {
    name: 'Self-Assurance',
    domain: 'Influencing',
    emoji: '🦁',
    description:
      'Self-Assurance is similar to self-confidence. In the deepest part of you, you have faith in your strengths. You know that you are able — able to take risks, able to meet new challenges, able to stake claims, and, most importantly, able to deliver.',
    atWork:
      'You project a calm confidence that steadies those around you in uncertain situations. You make decisions without requiring external validation, and you own the outcomes — good and bad.',
    inRelationships:
      'Your certainty and self-possession can be deeply reassuring to people who need a grounded anchor. At the same time, you must be careful not to dismiss others\' needs for reassurance as weakness.',
    watchOut:
      'Confidence without openness to feedback can become arrogance. Your inner certainty is a strength — but stay curious about what you might be missing that others see.',
    pairsWith: ['Command', 'Significance', 'Activator'],
    famousPeople: ['Oprah Winfrey', 'Dwayne Johnson', 'Elon Musk'],
  },

  Significance: {
    name: 'Significance',
    domain: 'Influencing',
    emoji: '⭐',
    description:
      'You want to be very significant in the eyes of other people. In the deepest part of you, you want to be known for the substantial impact you make. You want to be part of excellent, prestigious undertakings and to be associated with credible people.',
    atWork:
      'You set ambitious goals and pursue them with the intention of making a real mark. Your drive for recognition motivates you to produce genuinely excellent work, and you elevate the standards of any project you join.',
    inRelationships:
      'You want your close relationships to reflect meaning and excellence. You are proud of the people you associate with and expect them to be proud of you too. This can create deep, mutually inspiring partnerships.',
    watchOut:
      'The hunger for recognition can leave you feeling empty if external validation is slow to come. Build an inner sense of your own worth that is not contingent on others\' acknowledgment.',
    pairsWith: ['Command', 'Competition', 'Communication'],
    famousPeople: ['Kanye West', 'Madonna', 'Elon Musk'],
  },

  Woo: {
    name: 'Woo',
    domain: 'Influencing',
    emoji: '🤩',
    description:
      'Woo stands for "winning others over." You enjoy the challenge of meeting new people and getting them to like you. Strangers are rarely intimidating to you. On the contrary, strangers can be energizing.',
    atWork:
      'You are a natural networker and ambassador. You create goodwill rapidly, establish rapport in new environments, and open doors that others cannot. You are invaluable when an organization needs to make a great first impression.',
    inRelationships:
      'You light up any room and make everyone feel welcome. You are adept at bringing together disparate groups. Your social gift is remarkable — just be sure to nurture depth alongside breadth in your relationships.',
    watchOut:
      'Your ease with new people may make it hard to sustain the sustained attention that deep relationships require. Some people may feel like you are always moving on to the next exciting connection.',
    pairsWith: ['Communication', 'Positivity', 'Activator'],
    famousPeople: ['Bill Clinton', 'Oprah Winfrey', 'Will Smith'],
  },

  // ── RELATIONSHIP BUILDING ──────────────────────────────────────────────────
  Adaptability: {
    name: 'Adaptability',
    domain: 'Relationship Building',
    emoji: '🌊',
    description:
      'You live in the moment. You don\'t see the future as a fixed destination. Instead, you see it as a place that you create out of the choices that you make right now. And so you discover your future one choice at a time.',
    atWork:
      'You are the teammate people want by their side when plans collapse and improvisation becomes essential. Your flexibility and composure under uncertainty make you invaluable in volatile environments.',
    inRelationships:
      'You roll with life\'s changes and help others do the same. You are present-focused and rarely burdened by regret or anxiety. Your groundedness in the now makes you a calming, stabilizing presence.',
    watchOut:
      'Your comfort with the present can mean short-term planning feels neglected. Partners and colleagues who need you to commit to a structured future may feel frustrated by your live-in-the-moment approach.',
    pairsWith: ['Positivity', 'Harmony', 'Relator'],
    famousPeople: ['Dalai Lama', 'Kobe Bryant', 'Michelle Obama'],
  },

  Connectedness: {
    name: 'Connectedness',
    domain: 'Relationship Building',
    emoji: '🔗',
    description:
      'You have faith in the links between all things. You are sure that there are few coincidences and that almost every event has a reason. You draw meaning from seeing the threads that tie the world together.',
    atWork:
      'You help teams see the bigger picture and understand how their individual contributions fit into a larger whole. Your worldview naturally builds bridges between departments, disciplines, and people.',
    inRelationships:
      'You help others feel that their lives have meaning and that they are part of something larger than themselves. This is an extraordinary gift — especially in moments of loss, transition, or doubt.',
    watchOut:
      'Your belief in fate and interconnection can sometimes seem mystical or vague to more analytically minded colleagues. Grounding your perspective in concrete language helps others understand and trust your insight.',
    pairsWith: ['Belief', 'Empathy', 'Futuristic'],
    famousPeople: ['Deepak Chopra', 'Malala Yousafzai', 'Desmond Tutu'],
  },

  Developer: {
    name: 'Developer',
    domain: 'Relationship Building',
    emoji: '🌱',
    description:
      'You see the potential in others. Very often, in fact, potential is all you see. You are drawn to the signs of growth in people — a new behavior learned or insight gained. Your instinct is to invest in people\'s development.',
    atWork:
      'You are a natural coach and mentor. You notice when someone makes even small progress, and you celebrate it genuinely. Over time, your investment in people creates loyalty, capability, and deep gratitude.',
    inRelationships:
      'You make the people around you better. Your encouragement is authentic, your patience with growth processes is real, and your joy in another\'s success is infectious. Those you invest in remember it for a lifetime.',
    watchOut:
      'Your drive to develop others can lead you to invest in people who are not genuinely committed to growth. Setting clear expectations about reciprocal effort protects your time and energy.',
    pairsWith: ['Empathy', 'Individualization', 'Positivity'],
    famousPeople: ['Oprah Winfrey', 'Brené Brown', 'Fred Rogers'],
  },

  Empathy: {
    name: 'Empathy',
    domain: 'Relationship Building',
    emoji: '💗',
    description:
      'You can sense the emotions of those around you. You feel what they are feeling as though their emotions were your own. You are able to see the world through their perspective and share their view.',
    atWork:
      'You sense the emotional temperature of a team and can identify — often before anyone speaks — when someone is struggling. This awareness helps you head off conflicts and create psychological safety.',
    inRelationships:
      'You are the person people turn to when they are hurting. Your ability to be fully present with someone in pain, without minimizing or rushing past it, is one of the rarest and most precious human gifts.',
    watchOut:
      'Absorbing others\' emotions is exhausting. Without clear boundaries and deliberate recovery time, empathic people burn out. Learning which feelings are yours and which you\'ve taken on from others is essential self-care.',
    pairsWith: ['Developer', 'Harmony', 'Connectedness'],
    famousPeople: ['Princess Diana', 'Fred Rogers', 'Brené Brown'],
  },

  Harmony: {
    name: 'Harmony',
    domain: 'Relationship Building',
    emoji: '☮️',
    description:
      'You look for consensus. You don\'t enjoy conflict; rather, you feel that there is little to be gained from it. You seek areas of agreement and look for practical things that everyone can agree on.',
    atWork:
      'You reduce friction in groups and create space for different voices to be heard. Your skill at finding common ground keeps teams from wasting energy on unproductive conflict and helps build lasting consensus.',
    inRelationships:
      'You create peace in your relationships and groups. People feel safe around you because they know you will not escalate or inflame. Your grace in tense moments is a rare and stabilizing gift.',
    watchOut:
      'Your aversion to conflict can lead to avoidance of necessary hard conversations. Some tensions need to be surfaced and addressed, not smoothed over — and delaying them often makes them worse.',
    pairsWith: ['Empathy', 'Consistency', 'Adaptability'],
    famousPeople: ['Dalai Lama', 'Jimmy Carter', 'Nelson Mandela'],
  },

  Includer: {
    name: 'Includer',
    domain: 'Relationship Building',
    emoji: '🫂',
    description:
      '"Stretch the circle wider." This is the philosophy around which you orient your life. You want to include people and make them feel part of the group. You notice the ones who feel like outsiders and want to draw them in.',
    atWork:
      'You champion diversity and ensure that quieter or more marginal voices are heard. Your instinct to expand the circle creates environments where people feel they belong, which unlocks contributions that would otherwise go unheard.',
    inRelationships:
      'You have a wide circle because you never let it close. You go out of your way to make new arrivals, shy people, and outsiders feel welcome. This generosity of spirit builds communities that others want to join.',
    watchOut:
      'Spreading inclusion effort too broadly can dilute the quality of your relationships. Consider that a few deep connections may serve you and others better than a very large but shallow circle.',
    pairsWith: ['Positivity', 'Empathy', 'Woo'],
    famousPeople: ['Fred Rogers', 'Barack Obama', 'Dolly Parton'],
  },

  Individualization: {
    name: 'Individualization',
    domain: 'Relationship Building',
    emoji: '🔎',
    description:
      'Your Individualization theme leads you to be intrigued by the unique qualities of each person. You are impatient with generalizations or "types" because you don\'t want to obscure what is special and distinct about each person.',
    atWork:
      'You are an exceptional manager and coach because you tailor your approach to each person\'s motivations, communication style, and strengths. You know that one size never fits all — and you act accordingly.',
    inRelationships:
      'You make people feel truly seen. Your ability to notice and honor what is specific and unique about each person deepens intimacy and trust in ways that generic appreciation never can.',
    watchOut:
      'Your focus on the individual can make it harder to create unified systems or team cultures. Balancing customization with the need for shared norms and processes is a key challenge.',
    pairsWith: ['Developer', 'Empathy', 'Relator'],
    famousPeople: ['Howard Gardner', 'Maria Montessori', 'Oprah Winfrey'],
  },

  Positivity: {
    name: 'Positivity',
    domain: 'Relationship Building',
    emoji: '☀️',
    description:
      'You are generous with praise, quick to smile, and always on the lookout for the positive in the situation. Some call you lighthearted. Others just wish that their world were as happy as yours appears to be.',
    atWork:
      'You are a morale booster and a source of energy in otherwise draining environments. Your enthusiasm for people\'s contributions creates a culture of encouragement that brings out the best in everyone.',
    inRelationships:
      'You make life more fun, more hopeful, and more worth living for the people around you. Your natural buoyancy is contagious, and your ability to find silver linings helps others navigate difficulty.',
    watchOut:
      'Unrelenting positivity can sometimes feel dismissive of real pain or serious problems. People need to feel that their struggles are acknowledged, not just reframed. Balance optimism with empathy for the hard stuff.',
    pairsWith: ['Woo', 'Includer', 'Adaptability'],
    famousPeople: ['Dolly Parton', 'Ellen DeGeneres', 'Robin Williams'],
  },

  Relator: {
    name: 'Relator',
    domain: 'Relationship Building',
    emoji: '🤗',
    description:
      'Relator describes your attitude toward your relationships. You derive a great deal of pleasure and strength from being around your close friends. You are comfortable with intimacy and work to cultivate deeper connections with those you already know.',
    atWork:
      'You build loyalty and trust over time. Colleagues know that your investment in them is genuine and long-term. You are not interested in superficial working relationships — you want to really know the people you work with.',
    inRelationships:
      'Your close relationships are the center of your emotional life. You invest deeply, show up consistently, and are at your best when surrounded by people who know and trust you completely.',
    watchOut:
      'Your preference for existing relationships can make you slow to open up to new people, which may limit your network and your exposure to new perspectives. Push yourself to let new people in.',
    pairsWith: ['Empathy', 'Developer', 'Individualization'],
    famousPeople: ['Brené Brown', 'Fred Rogers', 'Jacinda Ardern'],
  },

  // ── STRATEGIC THINKING ─────────────────────────────────────────────────────
  Analytical: {
    name: 'Analytical',
    domain: 'Strategic Thinking',
    emoji: '📊',
    description:
      'Your Analytical theme challenges other people: "Prove it. Show me why what you are claiming is true." In the face of this kind of questioning some will find that their brilliant theories wither and die. For you, this is precisely the point.',
    atWork:
      'You are rigorous and evidence-driven. You elevate the quality of decisions by demanding that claims be substantiated. Your skepticism is a quality-control mechanism that prevents costly mistakes driven by wishful thinking.',
    inRelationships:
      'Your logical precision is respected by people who value truth over comfort. You may need to be mindful that others experience your questioning as skepticism or dismissal, even when you mean it constructively.',
    watchOut:
      'Analysis without action is paralysis. At some point, enough data exists to make a decision. Learning to act on incomplete information — while acknowledging uncertainty — is a critical growth edge.',
    pairsWith: ['Strategic', 'Deliberative', 'Input'],
    famousPeople: ['Warren Buffett', 'Sheryl Sandberg', 'Charlie Munger'],
  },

  Context: {
    name: 'Context',
    domain: 'Strategic Thinking',
    emoji: '📜',
    description:
      'You look back. You look back because that is where the answers lie. You look back to understand the present. To you, the present is unstable, a confusing clamor of competing voices. It is only by returning to the past that you find patterns and perspective.',
    atWork:
      'You are the institutional memory of a team. Your understanding of how decisions were made, what was tried and failed, and what the foundational intent was prevents the organization from repeating past mistakes.',
    inRelationships:
      'You bring depth to conversations by connecting present experiences to historical patterns and shared stories. People feel that talking with you is like consulting a wise friend who helps put things in perspective.',
    watchOut:
      'Excessive focus on history can slow adaptation to genuinely new situations where the past offers limited guidance. Not every new challenge has a historical parallel worth waiting for.',
    pairsWith: ['Analytical', 'Intellection', 'Strategic'],
    famousPeople: ['Ken Burns', 'Doris Kearns Goodwin', 'David McCullough'],
  },

  Futuristic: {
    name: 'Futuristic',
    domain: 'Strategic Thinking',
    emoji: '🚀',
    description:
      '"Wouldn\'t it be great if…" You are the kind of person who loves to peer over the horizon. The future fascinates you. As if it were projected on the wall, you see in detail what the future might hold, and this detailed picture keeps you energized.',
    atWork:
      'You provide a compelling vision that inspires teams to look beyond today\'s constraints. When others are mired in present problems, you point toward what is possible — and you make people believe it is achievable.',
    inRelationships:
      'You inspire the people around you to dream bigger. Your vivid sense of possibility is motivating and contagious, particularly for people who have become stuck in the limitations of the present.',
    watchOut:
      'The future is not always as clear as it appears to you. Ground your visions in present-day realities and involve others in checking your assumptions before committing to a future that may not unfold as imagined.',
    pairsWith: ['Strategic', 'Ideation', 'Activator'],
    famousPeople: ['Elon Musk', 'Jeff Bezos', 'Steve Jobs'],
  },

  Ideation: {
    name: 'Ideation',
    domain: 'Strategic Thinking',
    emoji: '💡',
    description:
      'You are fascinated by ideas. What is an idea? An idea is a concept, the best explanation of the most events. You are delighted by how the world is endlessly complex and how every phenomenon can be explained through a multitude of perspectives.',
    atWork:
      'You are a wellspring of creative possibilities. Brainstorming sessions come alive when you are in the room. Your ability to synthesize disparate ideas into new frameworks accelerates innovation.',
    inRelationships:
      'You make intellectual conversations endlessly rewarding. You challenge people to see familiar things from new angles and create the kind of stimulating exchange that makes relationships feel vibrant and alive.',
    watchOut:
      'Ideas without execution are just entertainment. Your excitement about new concepts can lead to a trail of unfinished projects. Partnering with people strong in Executing themes turns your ideas into reality.',
    pairsWith: ['Futuristic', 'Strategic', 'Learner'],
    famousPeople: ['Leonardo da Vinci', 'Steve Jobs', 'Albert Einstein'],
  },

  Input: {
    name: 'Input',
    domain: 'Strategic Thinking',
    emoji: '📚',
    description:
      'You are inquisitive. You collect things. You might collect information — words, facts, books, and quotations — or you might collect tangible objects such as artefacts or keepsakes. Whatever you collect, you collect it because it interests you.',
    atWork:
      'You are a living library. Your broad collection of knowledge, contacts, and resources makes you invaluable as the person who knows a little about everything and can connect ideas and people across domains.',
    inRelationships:
      'You are a fascinating conversationalist because you are always learning something new. Your curiosity is infectious, and people leave conversations with you feeling that they\'ve learned something worth knowing.',
    watchOut:
      'Collecting without curating can lead to information overload. Develop filters for what truly serves your goals and the people you work with, rather than accumulating indiscriminately.',
    pairsWith: ['Learner', 'Intellection', 'Analytical'],
    famousPeople: ['Bill Gates', 'Malcolm Gladwell', 'David Bowie'],
  },

  Intellection: {
    name: 'Intellection',
    domain: 'Strategic Thinking',
    emoji: '🧠',
    description:
      'You like to think. You like mental activity. You like exercising the "muscles" of your brain, stretching them in multiple directions. This need for mental activity may be focused or it may be random — you may be trying to solve a problem or simply musing.',
    atWork:
      'You produce your best work when given time and space to think things through. Your depth of analysis elevates the quality of decisions and strategies. You add intellectual rigor that prevents superficial thinking.',
    inRelationships:
      'You are a deep thinker and a thoughtful communicator. The people who know you well value conversations with you for their depth and substance. You do not do small talk — and most of the time, people appreciate that.',
    watchOut:
      'Introspection without engagement can become isolation. Share your thinking with others more often — not only does it connect you, it sharpens your ideas through the friction of other perspectives.',
    pairsWith: ['Analytical', 'Learner', 'Input'],
    famousPeople: ['Carl Jung', 'Albert Einstein', 'Susan Cain'],
  },

  Learner: {
    name: 'Learner',
    domain: 'Strategic Thinking',
    emoji: '📖',
    description:
      'You love to learn. The subject matter that interests you most will be determined by your other themes and experiences, but whatever the subject, you will always be drawn to the process of learning. The process, more than the content or the result, is especially exciting to you.',
    atWork:
      'You thrive in environments that challenge you to grow. You adapt quickly because you pick up new skills and knowledge rapidly. Your willingness to be a beginner again and again keeps you relevant as the world changes.',
    inRelationships:
      'You bring a freshness and curiosity to your relationships that keeps them from going stale. You are always discovering something new to share, and your enthusiasm for learning is genuinely infectious.',
    watchOut:
      'The excitement of learning can lead you to start many things without finishing them. Apply your love of learning to depth, not just breadth — mastery requires sustained effort beyond the initial excitement of novelty.',
    pairsWith: ['Input', 'Intellection', 'Futuristic'],
    famousPeople: ['Elon Musk', 'Benjamin Franklin', 'Richard Feynman'],
  },

  Strategic: {
    name: 'Strategic',
    domain: 'Strategic Thinking',
    emoji: '♟️',
    description:
      'The Strategic theme enables you to sort through the clutter and find the best route. It is not a skill that can be taught. It is a distinct way of thinking, a special perspective on the world at large. This perspective allows you to see patterns where others simply see complexity.',
    atWork:
      'You are indispensable in planning and problem-solving. You see around corners, anticipate obstacles before they arrive, and map out alternate routes when the primary path is blocked. Leaders value your ability to think three moves ahead.',
    inRelationships:
      'You help the people you care about navigate complexity by offering them clear options and a realistic view of likely outcomes. Your calm in the face of complexity is steadying for more anxious people.',
    watchOut:
      'Your pattern-finding can lead to premature conclusions. Remain open to being surprised — the pattern you see is a hypothesis until tested, and sometimes the situation is genuinely new.',
    pairsWith: ['Futuristic', 'Analytical', 'Focus'],
    famousPeople: ['Jeff Bezos', 'Warren Buffett', 'Hillary Clinton'],
  },
};

/**
 * Returns the theme definition object for a given theme name.
 * @param {string} name - e.g. 'Achiever'
 * @returns {object}
 */
export function getStrengthsTheme(name) {
  return strengthsThemes[name] ?? null;
}
