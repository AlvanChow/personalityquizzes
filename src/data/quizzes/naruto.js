// Which Naruto Character Are You? — 'pick' mode exemplar for the quiz catalog.
// Every option awards points to one or more result keys; highest total wins.

export default {
  key: 'naruto',
  mode: 'pick',
  resultsHeading: 'Your character match breakdown',

  results: {
    naruto: {
      name: 'Naruto Uzumaki',
      emoji: '🍜',
      color: 'from-orange-100 to-amber-50',
      accent: 'text-orange-600',
      tagline: '#NeverGiveUp #Believe It #ChaoticGood',
      description:
        'You lead with heart, not calculation. When everyone else has written something off as impossible, you are the one still shouting that it can be done — and somehow, through sheer stubborn optimism, you prove it. People underestimate you at first, then find themselves fighting for your approval. Your superpower is turning enemies into friends and doubters into believers.',
      strengths: ['Relentless optimism', 'Wins people over', 'Never abandons anyone', 'Grows fastest under pressure'],
      growth: 'Your instinct is to charge in and figure it out mid-fight. A little planning before the leap would save you a lot of bruises — and let the people who believe in you worry less.',
      kindred: ['rocklee', 'sakura'],
    },
    sasuke: {
      name: 'Sasuke Uchiha',
      emoji: '⚡',
      color: 'from-indigo-100 to-slate-50',
      accent: 'text-indigo-600',
      tagline: '#LoneWolf #Prodigy #StillWaters',
      description:
        'You are driven by an internal standard so high that most people never see the full picture of what you are working toward. You would rather master something alone than perform it for applause. Beneath the cool exterior is intense loyalty — the few people you let in are protected fiercely, even if you would never say it out loud.',
      strengths: ['Laser focus', 'Independent mastery', 'Unshakeable composure', 'Quietly loyal'],
      growth: 'Going it alone feels efficient, but your hardest chapters are the ones you refused to let anyone share. Letting people help is not weakness — it is how you avoid becoming your own worst enemy.',
      kindred: ['kakashi', 'gaara'],
    },
    sakura: {
      name: 'Sakura Haruno',
      emoji: '🌸',
      color: 'from-pink-100 to-rose-50',
      accent: 'text-rose-500',
      tagline: '#SteelAndSoftness #Healer #LateBloomer',
      description:
        'You combine emotional intelligence with genuine grit. You may have started out in someone else\'s shadow, but you did the unglamorous work — the studying, the practice, the discipline — until you became the person others depend on in a crisis. You care deeply and you hit hard, and people who mistake your kindness for softness only make that mistake once.',
      strengths: ['Disciplined self-improvement', 'Calm in a crisis', 'Emotionally perceptive', 'Deceptive strength'],
      growth: 'You measure yourself against the most talented people in the room and discount how far you have come. Own your wins — your growth curve is the steepest one in the story.',
      kindred: ['naruto', 'hinata'],
    },
    kakashi: {
      name: 'Kakashi Hatake',
      emoji: '📖',
      color: 'from-slate-100 to-gray-50',
      accent: 'text-slate-600',
      tagline: '#CoolUnderFire #Mentor #HiddenDepths',
      description:
        'You project relaxed detachment — always a little late, always reading something, never visibly rattled. Underneath is one of the sharpest minds in the room and a past that taught you exactly what matters: the people beside you. You lead without demanding the spotlight, teach without lecturing, and when things get genuinely serious, everyone instinctively looks to you.',
      strengths: ['Sees ten moves ahead', 'Effortless mentorship', 'Grace under pressure', 'Learns from loss'],
      growth: 'The aloof act keeps people at a comfortable distance — including the ones who want to be closer. You have earned the right to let your guard down more than you do.',
      kindred: ['shikamaru', 'sasuke'],
    },
    shikamaru: {
      name: 'Shikamaru Nara',
      emoji: '☁️',
      color: 'from-emerald-100 to-teal-50',
      accent: 'text-emerald-600',
      tagline: '#WhatADrag #200IQ #ReluctantGenius',
      description:
        'You are the smartest person in the room who would honestly rather be watching clouds. Effort for its own sake strikes you as absurd — but when something actually matters, you out-think everyone, seeing the whole board while others fixate on single pieces. Your loyalty is understated but absolute: you show up, grumbling, and then you solve the unsolvable.',
      strengths: ['Strategic brilliance', 'Ruthless prioritization', 'Steady under stakes', 'Loyal without drama'],
      growth: 'The "too troublesome" shield protects you from failure by lowering the stakes. The moments you have chosen to fully commit are the ones that changed everything — do that more often.',
      kindred: ['kakashi', 'sasuke'],
    },
    hinata: {
      name: 'Hinata Hyuga',
      emoji: '💜',
      color: 'from-violet-100 to-purple-50',
      accent: 'text-violet-600',
      tagline: '#QuietCourage #Watchful #GentleStrength',
      description:
        'You are proof that courage does not have to be loud. You notice everything — the person left out of the conversation, the friend pretending to be fine — and you act on it without needing credit. Your bravery shows up in the moments that count: soft-spoken until someone you love is threatened, and then utterly immovable.',
      strengths: ['Deep observation', 'Courage when it counts', 'Steadfast devotion', 'Grows at her own pace'],
      growth: 'You extend endless belief to others and ration it for yourself. Speaking up earlier — in meetings, in friendships, in your own defense — is the next evolution of your quiet strength.',
      kindred: ['sakura', 'gaara'],
    },
    gaara: {
      name: 'Gaara',
      emoji: '🏜️',
      color: 'from-amber-100 to-orange-50',
      accent: 'text-amber-700',
      tagline: '#Redemption #OldSoul #ProtectorNow',
      description:
        'You know what it is to be misunderstood, and it made you either bitter or profoundly empathetic — and you chose empathy. You carry responsibility older than your years and take protecting your people deadly seriously. Those who knew you long ago would not recognize the steady, principled leader you have deliberately become.',
      strengths: ['Hard-won empathy', 'Carries heavy responsibility', 'Deliberate self-reinvention', 'Calm authority'],
      growth: 'You still half-expect to be an outsider, so you over-prepare and under-ask. You are allowed to receive the loyalty you so freely give.',
      kindred: ['sasuke', 'hinata'],
    },
    rocklee: {
      name: 'Rock Lee',
      emoji: '🥋',
      color: 'from-green-100 to-emerald-50',
      accent: 'text-green-600',
      tagline: '#HardWorkBeatsTalent #Springtime OfYouth #NoShortcuts',
      description:
        'You were not handed the natural gifts others got — so you built your own with pure, joyful, terrifying work ethic. You do the extra reps, keep the promises you make to yourself, and celebrate other people\'s wins as loudly as your own. Your enthusiasm is not naivety; it is a decision you make every single morning, and it is contagious.',
      strengths: ['Unmatched work ethic', 'Zero self-pity', 'Genuine enthusiasm', 'Keeps promises to himself'],
      growth: 'Effort is your answer to everything, including problems that need rest or a different strategy. Working smarter is not a betrayal of working hard.',
      kindred: ['naruto', 'sakura'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'Your team is losing badly at the halfway point. What do you do?',
      options: [
        { label: 'Refuse to accept it — rally everyone with pure belief that we can turn it around', points: { naruto: 2, rocklee: 1 } },
        { label: 'Quietly analyze what the opponent is doing and find the counter', points: { shikamaru: 2, kakashi: 1 } },
        { label: 'Take the whole thing on my own shoulders and raise my level', points: { sasuke: 2, gaara: 1 } },
        { label: 'Keep everyone calm, patch people up, and hold the line', points: { sakura: 2, hinata: 1 } },
      ],
    },
    {
      id: 2,
      text: 'How do your friends describe you when you\'re not in the room?',
      options: [
        { label: '"The most stubborn optimist you will ever meet"', points: { naruto: 2, rocklee: 1 } },
        { label: '"Way more talented than they let on — kind of mysterious"', points: { kakashi: 2, sasuke: 1 } },
        { label: '"Quiet, but they notice everything about you"', points: { hinata: 2, gaara: 1 } },
        { label: '"Scary smart, and scarier when you waste their time"', points: { shikamaru: 2, sakura: 1 } },
      ],
    },
    {
      id: 3,
      text: 'You fail publicly at something you care about. Your honest reaction?',
      options: [
        { label: 'Announce, louder than before, that I will get it next time — and mean it', points: { naruto: 2 } },
        { label: 'Double my training until failure is mathematically impossible', points: { rocklee: 2, sasuke: 1 } },
        { label: 'Turn it into a lesson and move on like nothing happened', points: { kakashi: 2, shikamaru: 1 } },
        { label: 'Take it hard privately, then quietly rebuild myself stronger', points: { sakura: 2, hinata: 1 } },
      ],
    },
    {
      id: 4,
      text: 'Pick your ideal Friday night:',
      options: [
        { label: 'Ramen with the whole crew, everyone talking over each other', points: { naruto: 2, rocklee: 1 } },
        { label: 'Cloud-watching, napping, absolutely nothing on the schedule', points: { shikamaru: 2 } },
        { label: 'One close friend, quiet spot, real conversation', points: { hinata: 2, gaara: 1 } },
        { label: 'Alone with a good book and zero obligations', points: { kakashi: 2, sasuke: 1 } },
      ],
    },
    {
      id: 5,
      text: 'A newcomer joins your group and is clearly struggling to fit in. You…',
      options: [
        { label: 'Adopt them instantly and loudly — they are one of us now', points: { naruto: 2, rocklee: 1 } },
        { label: 'Watch from a distance and step in the moment they actually need help', points: { kakashi: 2, gaara: 1 } },
        { label: 'Notice before anyone else and quietly make space for them', points: { hinata: 2, sakura: 1 } },
        { label: 'Leave them alone — they will find their footing like I had to', points: { sasuke: 2, shikamaru: 1 } },
      ],
    },
    {
      id: 6,
      text: 'What motivates you most deeply?',
      options: [
        { label: 'Proving that hard work can beat natural talent', points: { rocklee: 2, naruto: 1 } },
        { label: 'Protecting the people I am responsible for', points: { gaara: 2, kakashi: 1 } },
        { label: 'Becoming undeniably excellent at my craft', points: { sasuke: 2, sakura: 1 } },
        { label: 'Honestly? Peace and quiet. I fight so things can be boring again', points: { shikamaru: 2, hinata: 1 } },
      ],
    },
    {
      id: 7,
      text: 'Your biggest flaw, if you\'re being honest:',
      options: [
        { label: 'I leap before I look — every single time', points: { naruto: 2, rocklee: 1 } },
        { label: 'I shut people out when things get hard', points: { sasuke: 2, gaara: 1 } },
        { label: 'I undersell myself and let others take the spotlight', points: { hinata: 2, sakura: 1 } },
        { label: 'I coast on talent when I should fully commit', points: { shikamaru: 2, kakashi: 1 } },
      ],
    },
    {
      id: 8,
      text: 'How do you handle a rival who is better than you right now?',
      options: [
        { label: 'Declare them my rival to their face and chase them relentlessly', points: { naruto: 2, rocklee: 2 } },
        { label: 'Say nothing. Study them. Surpass them', points: { sasuke: 2, sakura: 1 } },
        { label: 'Respect it — talent is just data, and I know how to work with data', points: { shikamaru: 2, kakashi: 1 } },
        { label: 'I don\'t really do rivalries — I am competing with who I was yesterday', points: { gaara: 2, hinata: 1 } },
      ],
    },
    {
      id: 9,
      text: 'In a group project, you are inevitably the one who…',
      options: [
        { label: 'Keeps morale alive when everything is on fire', points: { naruto: 2, rocklee: 1 } },
        { label: 'Makes the actual plan at the last possible minute — and it works', points: { shikamaru: 2 } },
        { label: 'Fixes everyone\'s sections without being asked', points: { sakura: 2, hinata: 1 } },
        { label: 'Silently does their part perfectly and judges the chaos', points: { sasuke: 2, kakashi: 1 } },
      ],
    },
    {
      id: 10,
      text: 'Choose a life philosophy:',
      options: [
        { label: 'I never go back on my word — that is my way', points: { naruto: 2, rocklee: 1 } },
        { label: 'Those who break the rules are trash, but those who abandon their friends are worse', points: { kakashi: 2, sakura: 1 } },
        { label: 'The strongest bonds are forged from the deepest wounds', points: { gaara: 2, hinata: 1 } },
        { label: 'Work with the reality in front of you, not the one you wish existed', points: { shikamaru: 2, sasuke: 1 } },
      ],
    },
  ],
};
