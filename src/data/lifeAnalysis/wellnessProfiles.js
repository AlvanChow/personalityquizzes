/**
 * Health & Wellness profiles keyed by C-E-N levels.
 *
 * Key format: "{Conscientiousness}-{Extraversion}-{Neuroticism}"
 * Levels: L (0-35), M (36-65), H (66-100)
 *
 * Each profile contains:
 *   summary  – holistic 2-3 sentence wellness analysis
 *   items    – 3-4 actionable bullets (fitness, sleep, nutrition, emotional wellness)
 */

const wellnessProfiles = {
  // ── High Conscientiousness ─────────────────────────────────────
  'H-H-H': {
    summary:
      'You have the discipline and social energy to maintain rigorous health routines, but your high neuroticism means stress can hijack even well-built systems. Exercise is not optional for you — it is a primary emotional regulation tool, and skipping it has outsized consequences on your mood and sleep quality.',
    items: [
      'Prioritize high-intensity group activities like CrossFit, Brazilian jiu-jitsu, or rowing classes — they burn off anxious energy while satisfying your need for social connection and structured progression.',
      'Track sleep with a Whoop band or Apple Health and enforce a strict 8-hour sleep window. Your nervous system needs consistent recovery, and you have the discipline to stick to a no-screens-60-minutes-before-bed rule.',
      'Watch for over-optimization. You are the type to track macros in MyFitnessPal, follow a rigid meal prep schedule, and still feel like you are falling short. Set a "good enough" threshold and stop tweaking.',
      'Build a stress-eating circuit breaker: when you feel the urge, do 5 minutes of box breathing or a short walk before deciding. Your discipline can override the impulse if you insert a pause.',
    ],
  },
  'H-H-M': {
    summary:
      'You are naturally disciplined and socially energized, with a moderate stress baseline that keeps you functional without the emotional volatility of higher neuroticism. You gravitate toward structured fitness communities and tend to stick with programs once you start them.',
    items: [
      'Team sports leagues (volleyball, soccer, ultimate frisbee) or group training programs like Orangetheory give you both the social charge and the structured progression you thrive on.',
      'Use Strava or a similar social fitness tracker — friendly competition and community accountability amplify your already-strong consistency.',
      'Your moderate neuroticism means you can coast on autopilot without noticing when stress is accumulating. Schedule a monthly body-and-mind check-in: sleep quality, energy levels, recovery metrics.',
      'Meal prep Sundays work exceptionally well for your personality — you will actually follow through, and the routine frees mental bandwidth during the week.',
    ],
  },
  'H-H-L': {
    summary:
      'You are disciplined, energetic, and emotionally stable — a combination that makes health habits feel almost effortless. Your risk is not falling off track; it is coasting on your natural baseline and missing early warning signs that something is off because you feel fine most of the time.',
    items: [
      'Push beyond maintenance into genuine challenge: train for a half-marathon, join a competitive rec league, or commit to a rock climbing progression. You have the consistency and social energy to sustain ambitious goals.',
      'Your emotional stability means you will not stress-eat or lose sleep over work pressure, but it also means you may ignore subtle health signals. Get annual bloodwork and track trends over time.',
      'Try the Mediterranean diet or a protein-at-every-meal approach — your discipline makes nutritional consistency easy, and you do not need the emotional regulation benefits of more restrictive protocols.',
    ],
  },
  'H-M-H': {
    summary:
      'You are highly disciplined but selectively social, and your elevated neuroticism means wellness is not a luxury — it is infrastructure for emotional stability. You are likely already tracking habits, but you may be over-engineering your routines as a way to manage anxiety rather than addressing the anxiety itself.',
    items: [
      'Solo-to-small-group activities like kettlebell training, swimming laps, or trail running give you the intensity you need without the social overwhelm of large group classes.',
      'Prioritize sleep hygiene ruthlessly: consistent bedtime, 65-degree bedroom, no caffeine after noon, and no screens 60 minutes before bed. Your nervous system depends on this more than most people realize.',
      'Add a dedicated stress-management practice — yin yoga, a 10-minute daily meditation via Headspace, or journaling. Your discipline means you will do it; your neuroticism means you genuinely need it.',
      'Watch for orthorexia tendencies. Your conscientiousness plus anxiety can turn healthy eating into obsessive restriction. If tracking macros in MyFitnessPal is causing more stress than clarity, stop tracking for a month.',
    ],
  },
  'H-M-M': {
    summary:
      'You are a steady, disciplined person with balanced social needs and a moderate stress baseline. You are the type who quietly maintains a workout routine for years without posting about it. Your wellness approach is sustainable but may lack the intensity needed to push past plateaus.',
    items: [
      'You have the consistency to follow structured programs — try a 12-week strength program, a couch-to-5K progression, or a periodized training plan. You will actually finish what you start.',
      'Intermittent fasting (16:8) or scheduled meal prep works well with your structured personality. Pick one nutritional framework and stick with it for 90 days before evaluating.',
      'Your moderate neuroticism and extraversion mean you do not urgently need exercise for emotional regulation, which can make it feel optional. Reframe it as non-negotiable maintenance, like brushing your teeth.',
      'Add variety every 8-12 weeks to prevent autopilot — swap trail running for rowing, or kettlebells for a rock climbing session. Your discipline handles consistency; novelty keeps you progressing.',
    ],
  },
  'H-M-L': {
    summary:
      'You are disciplined, emotionally stable, and moderately social — the wellness equivalent of a reliable engine. You maintain healthy habits without drama, but your low neuroticism means you rarely feel urgency about health until something actually breaks.',
    items: [
      'Build a 10,000 steps baseline plus three structured workouts per week. You have the discipline to sustain this indefinitely — the challenge is making sure it is actually challenging enough.',
      'Proactive health screening matters more for you than most. Your stable mood means you will not notice gradual declines in sleep quality, cardiovascular fitness, or nutritional gaps. Track with data, not feelings.',
      'Consider a structured nutrition approach like protein at every meal or macro tracking in MyFitnessPal for one month annually — not because you need the control, but because your stability can mask nutritional drift.',
    ],
  },
  'H-L-H': {
    summary:
      'You are deeply disciplined but introverted, and your high neuroticism makes physical health a critical lever for emotional wellbeing. You prefer to work out alone, and you likely already have routines — but they may be rigidly optimized in ways that increase anxiety rather than reduce it.',
    items: [
      'Solo, rhythmic exercise is your medicine: swimming laps, trail running, rowing, or long cycling rides. These activities regulate your nervous system without requiring social energy.',
      'Protect your sleep above all else. Use Apple Health sleep tracking or a Whoop band to enforce an 8-hour window. Your combination of introversion and neuroticism means poor sleep cascades into anxiety and withdrawal faster than it does for others.',
      'You are prone to stress-eating or stress-restricting in isolation. Build a simple meal structure — protein at every meal, meal prep Sundays, and consistent eating times — so nutrition decisions are automatic, not emotional.',
      'Add one low-stakes social wellness element: a weekly yoga class, a climbing gym session, or a walking meetup. Complete isolation amplifies the anxious thoughts your neuroticism generates.',
    ],
  },
  'H-L-M': {
    summary:
      'You are a quiet, disciplined person who maintains health habits independently and reliably. Your moderate neuroticism gives you just enough internal pressure to stay consistent without tipping into obsessive tracking or anxiety spirals.',
    items: [
      'Home gym setups, solo kettlebell programs, or structured bodyweight routines (like the r/bodyweightfitness recommended routine) suit your independent nature and high follow-through.',
      'Your introversion means recovery comes naturally — you instinctively protect your downtime. Make sure you are using that recovery time for actual rest (sleep, gentle movement) rather than passive screen consumption.',
      'A simple nutritional framework like the Mediterranean diet or protein-at-every-meal works well for you. You do not need elaborate tracking — just consistent principles applied quietly over time.',
    ],
  },
  'H-L-L': {
    summary:
      'You are the rarest wellness archetype: disciplined, introverted, and emotionally stable. You will maintain health habits for years without external motivation or emotional urgency. Your challenge is not consistency — it is ensuring your routines are actually working, because you will never feel bad enough to question them.',
    items: [
      'Solo, progressive activities like powerlifting, long-distance cycling, or swimming give you measurable feedback that your autopilot routines might not. You need objective metrics because your subjective experience is always "fine."',
      'Get comprehensive annual bloodwork and a cardiovascular stress test every few years. You are the type to feel perfectly healthy while something silently develops because your stable mood never flags a warning.',
      'Your emotional stability and introversion mean you have very low urgency around wellness. Use your discipline to create mandatory review points — quarterly fitness tests, biannual health metrics — so you do not coast for a decade.',
    ],
  },

  // ── Mid Conscientiousness ──────────────────────────────────────
  'M-H-H': {
    summary:
      'You have social energy and emotional intensity but only moderate self-discipline. Exercise is essential for your mental health, but maintaining a solo routine is a struggle. You need external structure and social accountability to stay consistent — left alone, your neuroticism fills the gap with stress-eating and poor sleep.',
    items: [
      'Group fitness is non-negotiable: sign up for a CrossFit box, a running club on Strava, or team sports with fixed schedules. Your social nature makes showing up easy when other people expect you there.',
      'Your high neuroticism means sleep disruption hits you harder than most. Enforce a no-screens-60-minutes-before-bed rule and keep a consistent wake time, even on weekends — your mood the next day depends on it.',
      'Stress-eating is your most likely failure mode. Stock your kitchen with high-protein, high-volume foods (Greek yogurt, chicken, vegetables) so the default binge option is nutritionally reasonable.',
      'Find a workout buddy or hire a coach. Your moderate discipline means you will skip sessions when anxiety spikes — having someone who expects you to show up overrides the avoidance impulse.',
    ],
  },
  'M-H-M': {
    summary:
      'You are socially energized with moderate discipline and a balanced stress response. You gravitate toward fitness naturally when it is social and fun, but you may drop routines when the novelty fades or your social circle shifts.',
    items: [
      'Rotate between social fitness options to prevent boredom: rec league sports one season, a group cycling class the next, a hiking group after that. Your social nature keeps you engaged; variety prevents staleness.',
      'Use a social tracking app like Strava or Peloton leaderboards — friendly competition gives you just enough external accountability to compensate for moderate discipline.',
      'Your balanced neuroticism means you do not urgently need exercise for emotional regulation, which makes it easy to skip. Tie your workouts to social commitments so they are harder to cancel.',
    ],
  },
  'M-H-L': {
    summary:
      'You are socially driven, emotionally stable, and moderately disciplined — you stay healthy when your social life includes active people, and you drift when it does not. Your wellness is more dependent on your environment and social circle than on internal motivation.',
    items: [
      'Join activity-based social groups: a beach volleyball league, a trail running crew, or a climbing gym with regular partners. When fitness is the social activity, your consistency takes care of itself.',
      'Your low neuroticism means you rarely feel stressed enough to prioritize recovery. Build rest days into your schedule proactively — your body needs them even when your mood says otherwise.',
      'Nutrition is your growth edge. Your stability and social nature can lead to frequent dining out and drinking. Track with MyFitnessPal for two weeks annually to reality-check your intake.',
    ],
  },
  'M-M-H': {
    summary:
      'You have moderate discipline and moderate social energy, but elevated anxiety makes wellness feel like a constant battle. You know what you should be doing, you sometimes do it, and you feel guilty when you do not — a cycle that your neuroticism amplifies.',
    items: [
      'Break the all-or-nothing cycle: a 20-minute walk counts. A 15-minute yoga session counts. Your neuroticism tells you that anything less than a perfect workout is worthless — that voice is lying.',
      'Prioritize sleep above all other wellness habits. Use Apple Health or a Whoop band to track, and aim for an 8-hour sleep window with consistent timing. Poor sleep makes your anxiety worse, which makes sleep harder — interrupt this loop early.',
      'Consider structured but forgiving activities: swimming laps, a couch-to-5K program, or yin yoga. They provide enough structure to reduce decision fatigue without the intensity that triggers perfectionism.',
      'Meal prep 3-4 days of lunches on Sunday. Removing daily food decisions reduces the cognitive load that feeds your anxiety and prevents stress-driven fast food runs.',
    ],
  },
  'M-M-M': {
    summary:
      'You are the wellness generalist — moderate across all three dimensions. You can stick with routines for a while, enjoy some social fitness, and manage stress reasonably well. Your challenge is that nothing feels urgent enough to prioritize, so health tends to drift to the back burner.',
    items: [
      'Pick one fitness goal with a deadline — a 5K race, a strength benchmark, or a 30-day yoga challenge — to create urgency your balanced personality does not naturally generate.',
      'Alternate between social and solo activities based on your energy: group classes when you want connection, solo runs or home workouts when you need space. Flexibility is your advantage.',
      'Build three non-negotiable health habits and automate everything else: a consistent bedtime, a daily step minimum (10,000 is a good baseline), and protein at every meal. Keep it simple enough that moderate discipline can sustain it.',
    ],
  },
  'M-M-L': {
    summary:
      'You are easygoing, moderately social, and moderately disciplined — which means health habits come and go without much emotional friction. You do not beat yourself up about skipping the gym, but you also do not feel compelled to go back.',
    items: [
      'Habit stacking works well for your personality: attach exercise to something you already do consistently (walk after lunch, stretch during your morning coffee, bodyweight exercises before your shower).',
      'Your low neuroticism means you will not be motivated by health anxiety or stress management. Find a physically active hobby you genuinely enjoy — rock climbing, basketball, mountain biking — rather than forcing gym discipline.',
      'Get annual health screenings and bloodwork. Your emotional stability means you will not notice gradual declines until they become significant. Data catches what feelings miss.',
    ],
  },
  'M-L-H': {
    summary:
      'You are introverted, moderately disciplined, and highly anxious — a combination that often leads to sedentary isolation. Exercise is medicine for you, but your introversion and moderate discipline make it difficult to initiate and sustain a routine without deliberate structure.',
    items: [
      'Solo, low-barrier activities are your entry point: daily walks with a podcast, home dumbbell routines, or swimming laps at off-peak hours. Remove every possible friction point between you and movement.',
      'Your high neuroticism makes sleep your highest-leverage wellness intervention. A consistent 8-hour sleep window with no caffeine after noon and no screens before bed can reduce baseline anxiety by 20-30 percent.',
      'Watch for the isolation-anxiety spiral: you withdraw because socializing is draining, but isolation feeds your anxious thoughts. One weekly low-pressure physical activity with another person (a walk with a friend, a quiet yoga class) is enough to interrupt the pattern.',
      'Avoid restrictive dieting — your neuroticism turns calorie tracking into obsessive rumination. Instead, follow a simple principle: protein at every meal, vegetables at two meals, consistent meal times.',
    ],
  },
  'M-L-M': {
    summary:
      'You are a quiet, moderately disciplined person with a balanced stress response. You maintain health habits adequately when they are convenient, but you do not seek them out with urgency or enthusiasm. Wellness for you is about building low-friction systems rather than relying on motivation.',
    items: [
      'A home gym setup — even just a kettlebell, a pull-up bar, and a yoga mat — removes the commute barrier that your introversion uses as an excuse. Convenience is everything for your profile.',
      'Follow a minimalist fitness approach: 3 sessions per week of full-body strength training plus daily walks. You do not need complexity; you need a system simple enough that moderate discipline can maintain it.',
      'Your balanced neuroticism means you will not be driven by anxiety to optimize, but you also will not ignore problems. Use that middle ground: review your health metrics twice a year and adjust only when the data says so.',
    ],
  },
  'M-L-L': {
    summary:
      'You are introverted, emotionally stable, and moderately disciplined — a profile that drifts toward comfortable sedentary routines. You are not stressed, not unhappy, and not motivated to change, which means health habits only stick when they require almost zero effort.',
    items: [
      'Start with the lowest possible barrier: a daily 20-minute walk. Do not aim for the gym, a training program, or a diet overhaul. Build the walking habit for 6 weeks, then add one thing.',
      'Your stability and introversion mean you can go months without noticing physical decline. Set a phone reminder for a 10,000-step daily target and track it in Apple Health or Google Fit — external data compensates for your low internal urgency.',
      'When you are ready for more, choose solitary, self-paced activities: cycling, bodyweight fitness at home, or lap swimming. Your profile will never sustain a boot camp or team sport, and that is fine.',
    ],
  },

  // ── Low Conscientiousness ──────────────────────────────────────
  'L-H-H': {
    summary:
      'You have social energy and emotional intensity but very little natural discipline — a volatile combination for wellness. You join gyms impulsively, start diets enthusiastically, and abandon both within weeks. Your high neuroticism means the consequences of inconsistency hit you harder than most: poor sleep, stress-eating, and guilt spirals.',
    items: [
      'Your only reliable consistency engine is social accountability. Sign up for team sports, group fitness with a committed friend, or a coach who tracks your attendance. Solo routines will fail every time.',
      'Stop trying to overhaul everything at once. Pick one habit — just one — and do it for 30 days. A daily 10-minute walk. A consistent bedtime. Protein at breakfast. One thing at a time.',
      'Your stress-eating is driven by neuroticism and enabled by low discipline. Do not keep trigger foods in your home. Make the healthy choice the easy choice by controlling your environment, not your willpower.',
      'Download a sleep tracking app and focus on one metric: consistent wake time. Your neuroticism makes sleep deprivation catastrophic for your mood, and a consistent wake time is the single highest-leverage sleep habit.',
    ],
  },
  'L-H-M': {
    summary:
      'You are socially driven, moderately anxious, and low in discipline. You are drawn to fitness when it is fun and social, but you lack the follow-through to maintain routines once the initial excitement fades. Your wellness strategy must be built entirely around social structures and external accountability.',
    items: [
      'Never exercise alone. Join a rec league, a running club, a CrossFit box, or a dance class — anything where other people notice when you do not show up. Social obligation is your discipline substitute.',
      'Use Strava, Peloton, or any fitness platform with a social feed. Visible accountability from friends replaces the internal motivation you lack.',
      'Keep your nutrition strategy dead simple: meal prep one day per week (or use a meal delivery service like Factor or HelloFresh). The fewer daily food decisions you make, the less likely you are to default to fast food.',
    ],
  },
  'L-H-L': {
    summary:
      'You are spontaneous, social, and emotionally stable — you live for fun, and you will exercise only if it feels like play. Traditional gym routines bore you within days. Your low neuroticism means you feel fine without exercise, which removes the emotional urgency that drives other people to the gym.',
    items: [
      'Make fitness a social adventure: join a beach volleyball league, try Brazilian jiu-jitsu, go bouldering with friends, take up paddleboarding, or sign up for charity obstacle course races like Tough Mudder. If it is not fun, you will not do it.',
      'Your emotional stability means you can ignore health for years without feeling bad about it. Set annual physical benchmarks (run a mile, do 10 pull-ups, touch your toes) so you catch decline before it becomes a problem.',
      'Nutrition for you should be principle-based, not rule-based: eat protein at every meal, drink water before alcohol, and eat vegetables at least twice a day. Rigid diets will last about 72 hours.',
    ],
  },
  'L-M-H': {
    summary:
      'You have moderate social energy but high anxiety and low discipline — a profile that often results in wanting to be healthier but feeling paralyzed by where to start. You know exercise would help your mood, but the gap between knowing and doing feels enormous.',
    items: [
      'Start with walking. Seriously. A 15-minute daily walk is the single most accessible intervention for your anxiety, and it requires zero discipline once it becomes routine. Use a podcast or audiobook as a reward to reinforce the habit.',
      'Do not download MyFitnessPal, buy a Whoop band, or sign up for a gym yet. Your low discipline means every new system becomes a source of guilt within two weeks. Master one habit before adding another.',
      'Address your sleep first: a consistent bedtime plus no caffeine after 2 PM will reduce your baseline anxiety more than any workout program. Your neuroticism responds to sleep quality more than any other variable.',
      'Ask one friend to walk with you once a week. Not a boot camp, not a training partner — just a walk. Your moderate extraversion can handle this, and the social commitment makes it harder to skip.',
    ],
  },
  'L-M-M': {
    summary:
      'You are moderately social, moderately anxious, and low in discipline — which means you have a generally relaxed relationship with wellness that occasionally produces guilt but rarely produces action. You know you should exercise more and eat better, but the urgency is never quite enough to override inertia.',
    items: [
      'Attach physical activity to something you already value: walk while on phone calls, bike to meet friends for coffee, join a casual recreational league. Standalone gym sessions will not stick.',
      'Commit to one weekly active social event — a hiking group, a recreational sport, a yoga class with a friend. Your moderate extraversion makes this sustainable, and weekly is achievable for low conscientiousness.',
      'Simplify nutrition to three rules you can actually follow: eat protein at breakfast, drink a glass of water before every meal, and eat at least one serving of vegetables per day. Do not aim for perfection.',
    ],
  },
  'L-M-L': {
    summary:
      'You are easygoing, spontaneous, and emotionally stable with moderate social energy. Health feels completely optional to you because you feel fine without it. You are the person who has not exercised in months and genuinely does not feel bad about it — which means traditional wellness motivation strategies do not work.',
    items: [
      'Find a physical hobby, not a workout: surfing, skateboarding, rock climbing, martial arts, or dancing. You will never sustain exercise for the sake of exercise, but you will sustain an activity you find genuinely fun.',
      'Set one annual health checkpoint: a physical exam with bloodwork. You are the most likely profile to have a treatable condition go undetected for years because nothing feels wrong.',
      'If you want to improve nutrition, make a single environmental change: stop buying soda and chips for your home. Do not add rules — just remove one default. That is a realistic starting point for your discipline level.',
    ],
  },
  'L-L-H': {
    summary:
      'You are introverted, undisciplined, and highly anxious — the profile most at risk for sedentary isolation and chronic stress. Exercise would dramatically improve your mental health, but every barrier between you and movement feels insurmountable. Your wellness strategy must be ruthlessly simple and shame-free.',
    items: [
      'Your first and only goal: walk outside for 10 minutes every day. Not 30 minutes, not a jog, not a gym session. Ten minutes. This is clinically meaningful for anxiety reduction, and it is achievable even on your worst days.',
      'Fix your sleep before anything else. Set one alarm for bedtime and one for wake time. No caffeine after noon. This single change will reduce your anxiety more than any supplement, app, or workout.',
      'Do not follow fitness influencers, download tracking apps, or buy equipment. Every new tool becomes a source of guilt when you stop using it. Keep your system invisible: a walk, a bedtime, a glass of water with every meal.',
      'If you can afford it, therapy (especially CBT) is the highest-leverage wellness investment for your profile. Your anxiety is the root barrier to every other health behavior.',
    ],
  },
  'L-L-M': {
    summary:
      'You are introverted, low in discipline, and moderately anxious — a profile that defaults to sedentary comfort. You are not in crisis, but you are not thriving either. Health improvements require removing friction rather than adding motivation, because motivation is not a resource you have in reliable supply.',
    items: [
      'Start with environmental design: put walking shoes by the door, keep a water bottle on your desk, remove junk food from your home. Change your defaults rather than your decisions.',
      'A daily 15-20 minute walk is the single most impactful habit for your profile. Do it at the same time each day — consistency matters more than duration for someone with your discipline level.',
      'Avoid ambitious meal plans or complex supplement stacks. Follow one rule at a time: this month, eat protein at breakfast. Next month, add a vegetable at dinner. Incremental change is the only change that sticks for you.',
    ],
  },
  'L-L-L': {
    summary:
      'You are introverted, undisciplined, and emotionally stable — which means you have settled into a comfortable low-activity equilibrium and feel no internal pressure to change it. You are not unhappy, not anxious, and not motivated. Health will only improve through tiny, frictionless changes that require almost no effort or willpower.',
    items: [
      'Your single starting goal: drink a glass of water when you wake up. That is it. Master that for two weeks, then add a 10-minute daily walk. The only strategy that works for your profile is absurdly small steps.',
      'You are the most likely profile to experience a health crisis that feels sudden but was actually decades in the making. Schedule an annual physical with full bloodwork — put it on auto-repeat in your calendar and treat it like a bill that is due.',
      'If any form of exercise ever feels genuinely enjoyable to you — even a casual evening walk, a video game that involves movement, or gardening — protect it fiercely. Intrinsic enjoyment is the only sustainable motivation engine for your personality.',
    ],
  },
};

export default wellnessProfiles;
