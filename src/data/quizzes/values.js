// What Do You Value Most? — 'pick' mode, inspired by Schwartz's basic human values.
// Twelve real-life tradeoff dilemmas reveal which of six core values steers you:
// achievement, benevolence, self-direction, security, stimulation, universalism.
// Each question offers four values; every value is the primary (2-pt) target of
// eight options across the quiz.

export default {
  key: 'values',
  mode: 'pick',
  resultsHeading: 'Your values breakdown',

  results: {
    achievement: {
      name: 'The Achiever',
      emoji: '🏆',
      color: 'from-amber-100 to-yellow-50',
      accent: 'text-amber-700',
      tagline: '#RaiseTheBar #EarnIt #Undeniable',
      description:
        'The value quietly steering you is achievement — competence proven, excellence demonstrated, effort turned into results no one can argue with. You feel most yourself when you are measurably getting better at something hard, and a goal without a scoreboard barely feels like a goal to you. Praise is nice, but what you really want is to be undeniable. Your drive lifts every team you join; just make sure the ladder you are climbing so brilliantly is leaning against your own wall.',
      strengths: ['Turns ambition into output', 'Raises the standard for everyone', 'Honest about the score', 'Thrives on hard goals'],
      growth: 'When winning becomes the only lens, rest looks like losing and other people look like rankings. Practice valuing a day by what you built or who you became — not only by where you placed.',
      kindred: ['selfdirection', 'security'],
    },
    benevolence: {
      name: 'The Caregiver',
      emoji: '💗',
      color: 'from-rose-100 to-pink-50',
      accent: 'text-rose-600',
      tagline: '#InnerCircle #ShowUp #LoyalToTheEnd',
      description:
        'The value at your core is benevolence — the wellbeing of the people you have decided are yours. Titles and thrills come and go, but you measure a life by whether the people who count on you could always count on you. You remember birthdays, notice bad days, and quietly rearrange your plans when someone you love is struggling. Your loyalty is the kind people describe decades later; the world runs on people like you and rarely says so.',
      strengths: ['Fierce, dependable loyalty', 'Notices what people need', 'Keeps relationships in repair', 'Generous without keeping score'],
      growth: 'Your care flows outward so automatically that your own needs go to the back of the line — and resentment can grow in that quiet. Saying "I need" out loud is not a burden on your people; it is an invitation they have been waiting for.',
      kindred: ['universalism', 'security'],
    },
    selfdirection: {
      name: 'The Trailblazer',
      emoji: '🧭',
      color: 'from-indigo-100 to-violet-50',
      accent: 'text-indigo-600',
      tagline: '#MyOwnTerms #ThinkForYourself #NoScript',
      description:
        'Your steering value is self-direction — the freedom to think your own thoughts, make your own calls, and live by conclusions you reached yourself. Being told how to do something you already know how to do is, to you, a special category of insult. You would take a smaller paycheck with full autonomy over a bigger one with a script, and you have. The gift you give the world is independent judgment; the price you pay is that you can never fully outsource a decision.',
      strengths: ['Thinks from first principles', 'Comfortable standing alone', 'Self-starting and self-correcting', 'Immune to groupthink'],
      growth: 'Independence can quietly harden into never letting anyone help, teach, or lead you. Choosing to follow — a mentor, a partner, a plan — is also a decision made on your own terms.',
      kindred: ['stimulation', 'achievement'],
    },
    security: {
      name: 'The Guardian',
      emoji: '🛡️',
      color: 'from-slate-100 to-gray-50',
      accent: 'text-slate-600',
      tagline: '#SolidGround #PlanAhead #SafeHarbor',
      description:
        'The value anchoring you is security — stability, safety, and order for yourself and the people under your roof. While others chase upside, you are the one asking the unglamorous questions about downside, and you are usually right to. You keep promises, savings, and routines, and there are people who sleep well at night specifically because you exist. Your steadiness is not a lack of imagination; it is what makes everyone else\'s risk-taking survivable.',
      strengths: ['Plans for the storm early', 'Utterly dependable', 'Protects what matters', 'Steady when everything shakes'],
      growth: 'Not every unfamiliar thing is a threat, and some of the best chapters of your life sit just past the edge of your comfort zone. Take one well-researched risk a year — you of all people can afford it.',
      kindred: ['benevolence', 'achievement'],
    },
    stimulation: {
      name: 'The Adventurer',
      emoji: '⚡',
      color: 'from-orange-100 to-red-50',
      accent: 'text-orange-600',
      tagline: '#NeverBoring #SayYes #NewHorizons',
      description:
        'The value with its hands on your wheel is stimulation — novelty, challenge, and the electric feeling of not knowing exactly what happens next. Routine drains you faster than hard work ever could, and your nightmare is not failure but a life that becomes a repeating loop. You say yes first and figure it out mid-air, and your stories are the ones people ask to hear twice. You keep everyone around you from mistaking comfort for living.',
      strengths: ['Fearless with the unfamiliar', 'Adapts mid-leap', 'Brings energy into every room', 'Turns life into stories'],
      growth: 'Chasing the next spark can mean abandoning things at the exact moment they get deep — projects, places, sometimes people. The rarest adventure for you is staying long enough to find out what chapter two feels like.',
      kindred: ['selfdirection', 'universalism'],
    },
    universalism: {
      name: 'The Humanitarian',
      emoji: '🌍',
      color: 'from-emerald-100 to-teal-50',
      accent: 'text-emerald-600',
      tagline: '#BiggerThanMe #FairForAll #ProtectThePlanet',
      description:
        'Your governing value is universalism — fairness, tolerance, and care that extends past your own circle to strangers, other species, and the planet itself. You are the one who asks who was left out of the decision, where the product really comes from, and whether the rules are just or merely convenient. Injustice you cannot fix still keeps you up at night, which is exhausting — and exactly why it gets fixed at all. Your conscience has a longer range than most.',
      strengths: ['Sees the whole system', 'Fair even when it costs them', 'Gives the voiceless a voice', 'Thinks in generations'],
      growth: 'Caring about everything everywhere can curdle into guilt and despair that help no one. Pick your corner of the world and tend it well — depth of impact beats breadth of worry.',
      kindred: ['benevolence', 'stimulation'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'A recruiter calls: dream salary, but the job starts abroad next month. Your very first thought?',
      options: [
        { label: "I couldn't be that far from the people who count on me", points: { benevolence: 2 } },
        { label: 'Is it stable? I want the contract details before I want the adventure', points: { security: 2 } },
        { label: 'A whole new country and life? When do I fly out?', points: { stimulation: 2 } },
        { label: 'What does this company actually do to the world? That decides it', points: { universalism: 2 } },
      ],
    },
    {
      id: 2,
      text: 'A completely free Saturday appears. What actually ends up happening?',
      options: [
        { label: "Helping someone I love — a move, a repair, a long overdue visit", points: { benevolence: 2 } },
        { label: 'Hours on my own project, my own way, with nobody to answer to', points: { selfdirection: 2 } },
        { label: "Something I've never done — a new trail, a new town, a new anything", points: { stimulation: 2 } },
        { label: 'The community cleanup or fundraiser I keep meaning to join', points: { universalism: 2, benevolence: 1 } },
      ],
    },
    {
      id: 3,
      text: 'An unexpected $3,000 lands in your account. Where does most of it honestly go?',
      options: [
        { label: 'On my people — a treat for family or bailing a friend out of a bind', points: { benevolence: 2 } },
        { label: 'Into my own thing — gear, a course, fuel for the project only I believe in', points: { selfdirection: 2 } },
        { label: 'Straight into savings. Future-me has enough problems already', points: { security: 2 } },
        { label: 'A real chunk goes to a cause much bigger than my wishlist', points: { universalism: 2 } },
      ],
    },
    {
      id: 4,
      text: "Your team's plan has a flaw only you can see. What do you do?",
      options: [
        { label: 'Fix it gently, one conversation at a time — the relationships matter most', points: { benevolence: 2 } },
        { label: 'Say it plainly in the meeting. I trust my judgment, even against the room', points: { selfdirection: 2 } },
        { label: 'Document it and raise it through the proper channel, with evidence', points: { security: 2 } },
        { label: 'Pitch a bolder alternative on the spot — the flaw is an opening', points: { stimulation: 2 } },
      ],
    },
    {
      id: 5,
      text: 'Two job offers, one decision. What actually tips the scale?',
      options: [
        { label: 'The faster track — which one gets me furthest, soonest', points: { achievement: 2 } },
        { label: 'The safer bet — solid industry, good benefits, still there in ten years', points: { security: 2 } },
        { label: "The wilder one — new field, steep curve, can't predict year two", points: { stimulation: 2 } },
        { label: 'The one that leaves the world slightly better than it found it', points: { universalism: 2 } },
      ],
    },
    {
      id: 6,
      text: 'Which bit of praise secretly means the most to you?',
      options: [
        { label: '"You are genuinely the best at what you do"', points: { achievement: 2 } },
        { label: '"You did it completely your own way — and it worked"', points: { selfdirection: 2 } },
        { label: '"I never know what you\'ll do next, and I love that"', points: { stimulation: 2 } },
        { label: '"You treat everyone fairly, even when nobody would notice"', points: { universalism: 2 } },
      ],
    },
    {
      id: 7,
      text: 'A friend asks why you work as hard as you do. The honest answer?',
      options: [
        { label: 'To be excellent. I want my work to speak so I never have to', points: { achievement: 2 } },
        { label: 'So that no one, ever, gets to tell me how to live', points: { selfdirection: 2 } },
        { label: 'So my people and I never have to worry about the basics again', points: { security: 2, benevolence: 1 } },
        { label: 'Because the problems I work on matter beyond my own life', points: { universalism: 2 } },
      ],
    },
    {
      id: 8,
      text: 'You finally have two whole weeks off. The trip you actually book is…',
      options: [
        { label: 'One with a finish line — a summit, a race, something to train for', points: { achievement: 2 } },
        { label: 'Unplanned and mine alone — a loose route and total freedom to change it', points: { selfdirection: 2, stimulation: 1 } },
        { label: 'The beloved familiar place where everything is easy and nothing surprises me', points: { security: 2 } },
        { label: "Somewhere I know absolutely nothing about, figured out live", points: { stimulation: 2 } },
      ],
    },
    {
      id: 9,
      text: 'You and a close friend both want the same promotion. You…',
      options: [
        { label: 'Compete flat-out. May the best person win — and I intend to be them', points: { achievement: 2 } },
        { label: 'Talk it through with them first. The friendship outranks the title', points: { benevolence: 2 } },
        { label: "Let the process decide and keep my head down — I won't torch a stable situation", points: { security: 2 } },
        { label: 'Make sure the process is fair to everyone who applied, not just us two', points: { universalism: 2 } },
      ],
    },
    {
      id: 10,
      text: 'What keeps you staring at the ceiling at 2 a.m. more often?',
      options: [
        { label: 'Falling behind people who started when I did', points: { achievement: 2 } },
        { label: "Someone I love struggling with something I can't fix", points: { benevolence: 2 } },
        { label: 'The safety math — money, health, and all the what-ifs', points: { security: 2 } },
        { label: 'The creeping feeling that my life is becoming a repeating loop', points: { stimulation: 2 } },
      ],
    },
    {
      id: 11,
      text: 'At your 80th birthday, the toast you most want to hear says you were…',
      options: [
        { label: 'Someone who set out to do hard things — and did them', points: { achievement: 2 } },
        { label: 'The one who always, always showed up for their people', points: { benevolence: 2 } },
        { label: 'Someone who lived life entirely on their own terms, start to finish', points: { selfdirection: 2 } },
        { label: 'Someone who left the world fairer than they found it', points: { universalism: 2 } },
      ],
    },
    {
      id: 12,
      text: 'Your boss rolls out a rigid new process that slows down work you had running beautifully. You…',
      options: [
        { label: 'Outperform inside the new rules anyway — results are the strongest argument', points: { achievement: 2 } },
        { label: 'First check how it hits my teammates, then go to bat for whoever it hurts', points: { benevolence: 2 } },
        { label: 'Push back directly. Autonomy over how I work is not a perk, it is the deal', points: { selfdirection: 2 } },
        { label: 'Treat it as a puzzle — find a clever workaround that makes work fun again', points: { stimulation: 2 } },
      ],
    },
  ],
};
