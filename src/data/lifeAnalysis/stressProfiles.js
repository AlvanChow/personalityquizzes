/**
 * Stress & Coping profiles keyed by N-C-E levels.
 *
 * Key format: "{Neuroticism}-{Conscientiousness}-{Extraversion}"
 * Levels: L (0-35), M (36-65), H (66-100)
 *
 * Each profile contains:
 *   summary  – holistic 2-3 sentence stress pattern analysis
 *   items    – 3-4 actionable stress management bullets
 */

const stressProfiles = {
  // ── High Neuroticism ─────────────────────────────────────────────
  'H-H-H': {
    summary:
      'You feel stress intensely and your first instinct is to do something about it — make a plan, talk it through, take action. This combination means you rarely sit still with discomfort, which keeps you productive but can mask the fact that you are running on anxiety rather than motivation. You tend to overwork as a way to feel in control — but productivity becomes avoidance when you are using it to avoid sitting with discomfort.',
    items: [
      'Schedule a daily "worry window" — 15 minutes where you write down every concern, then close the notebook and move on. This contains rumination instead of letting it bleed into your entire day.',
      'Your social processing is a strength, but venting without structure just recycles anxiety. Try structured check-ins: tell a friend "here is what is stressing me, here is what I have tried, here is what I need from you."',
      'Use box breathing (4-4-4-4) before switching between tasks. Your nervous system needs deliberate downshifts because you will not naturally pause.',
      'Block one evening per week with zero plans and zero productivity. You need to learn that doing nothing is not the same as falling behind.',
    ],
  },
  'H-H-M': {
    summary:
      'You carry stress like a weight you are constantly trying to organize your way out of. Your high conscientiousness means you respond to anxiety by doubling down on structure — more lists, more plans, tighter control — but the emotional undercurrent of neuroticism means the anxiety never fully resolves no matter how organized you get. You oscillate between social coping and solitary planning depending on your energy.',
    items: [
      'Try CBT thought records when you notice catastrophic thinking. Write the trigger, your automatic thought, the evidence for and against it, and a balanced alternative. This interrupts the spiral.',
      'Your planning instinct is useful but can become compulsive. Set a rule: plan for 15 minutes, then act. Replanning the same task three times is procrastination in disguise.',
      'Progressive muscle relaxation before bed directly targets the physical tension you accumulate from sustained vigilance. The Headspace app has a good 10-minute guided version.',
      'Distinguish between productive worry (problems you can act on today) and rumination (problems you cannot solve right now). Only the first one deserves your energy.',
    ],
  },
  'H-H-L': {
    summary:
      'You experience stress deeply and process it alone through structure and discipline. You are the person who rewrites their entire to-do system at 11pm because the anxiety needs somewhere to go. Your introversion means you rarely talk about what is eating at you, so stress builds silently until it becomes physical — headaches, insomnia, jaw clenching.',
    items: [
      'Body scan meditation is especially important for you because you store stress physically without realizing it. A 10-minute scan before sleep helps you notice what your mind is ignoring.',
      'Journaling works better for you than talking. Try a structured format: three things causing stress, one thing you can control about each, one thing you need to release.',
      'Watch for perfectionist overwork spirals. When you catch yourself reorganizing or optimizing instead of resting, that is the anxiety talking, not discipline.',
      'NSDR (non-sleep deep rest) protocols — like Yoga Nidra or Andrew Huberman\'s guided NSDR — give your nervous system the reset you will not get from planning harder.',
    ],
  },
  'H-M-H': {
    summary:
      'You are emotionally reactive and socially oriented, but without the rigid structure that high conscientiousness provides. Under stress you reach for people — calling friends, processing out loud, seeking reassurance — which helps in the short term but can become a pattern where you externalize your regulation rather than building internal tools. Acute stress hits you fast and loud.',
    items: [
      'Limit your "processing calls" to two trusted people. When you talk to everyone about the same problem, you are not processing — you are seeking reassurance, and reassurance has diminishing returns.',
      'Build a 5-minute morning routine that is non-negotiable: 4-7-8 breathing (inhale 4, hold 7, exhale 8) followed by writing down your top three priorities. This gives your day a spine without requiring rigid planning.',
      'When you feel acute stress rising, take a 10-minute walk outside before doing anything else. Movement plus nature is one of the fastest ways to regulate your nervous system.',
      'Ask yourself: "Am I solving this problem or performing my stress for an audience?" Honest answers to that question will change how you cope.',
    ],
  },
  'H-M-M': {
    summary:
      'You sit at the intersection of emotional sensitivity and moderate coping resources — enough structure to function, enough social connection to avoid isolation, but not enough of either to fully absorb the intensity of what you feel. Stress tends to be a background hum rather than an acute crisis, and the danger is that you normalize low-grade anxiety as your baseline.',
    items: [
      'Track your stress on a 1-10 scale daily for two weeks. You have likely normalized a 6 as your "fine." Seeing the pattern in writing makes it harder to ignore.',
      'The Pomodoro technique (25 minutes work, 5 minutes rest) works well for you because it builds in recovery periods your nervous system needs but you will not take voluntarily.',
      'Invest in one grounding practice and do it daily — box breathing, a 10-minute morning walk, or a body scan. Consistency matters more than duration.',
      'When stress is chronic, your brain stops distinguishing between real threats and background noise. Weekly therapy or structured self-reflection (CBT thought records) helps recalibrate.',
    ],
  },
  'H-M-L': {
    summary:
      'You feel stress deeply and process it internally, with limited structure to contain it and limited social outlets to discharge it. This is one of the more vulnerable stress profiles — not because you are weak, but because your coping toolkit is narrow. You tend toward isolation and rumination, replaying stressors in your mind without resolution.',
    items: [
      'Rumination is your primary enemy. The worry window technique — confining worry to a scheduled 15-minute block — gives your brain permission to stop looping outside that window.',
      'Start a gratitude journaling practice: three specific things each evening. This is not toxic positivity — research shows it literally shifts the ratio of threat-to-reward processing in the brain.',
      'You need one structured activity that gets you out of your head and into your body. Walking, swimming, or even cold showers (30-60 seconds) break the rumination loop physiologically.',
      'Consider therapy with a CBT or ACT framework. You need external structure for emotional processing because you will not naturally seek social support or build systems on your own.',
    ],
  },
  'H-L-H': {
    summary:
      'You are emotionally volatile, socially driven, and structurally loose — a combination that means stress shows up loudly and publicly. You are the person who announces their breakdown, processes it with five people, and still feels terrible because the underlying issue never got organized into actionable steps. Your coping is all discharge, no containment.',
    items: [
      'After venting to a friend, force yourself to write down one concrete next step before the conversation ends. Social processing only helps if it leads somewhere.',
      'Build a minimal daily structure: a morning checklist of three items maximum. You do not need a full productivity system — you need enough scaffolding to prevent freefall.',
      'When a crisis hits, use the 4-7-8 breathing technique before you call anyone. Regulate first, then connect. The order matters.',
      'Your emotional expressiveness is a genuine strength in many contexts, but under stress it can escalate situations. Practice noticing the impulse to react and inserting a 10-second pause.',
    ],
  },
  'H-L-M': {
    summary:
      'You are stress-sensitive with minimal structure and moderate social resources. Without the scaffolding of either high conscientiousness or high extraversion, stress tends to pool and stagnate — you feel it intensely but lack clear outlets. Procrastination under stress is your signature pattern, and the guilt from procrastinating creates more stress, forming a self-reinforcing loop.',
    items: [
      'Break the procrastination-guilt cycle by starting absurdly small. Tell yourself you will work on the stressful task for just two minutes. Getting started is 90% of the battle for your profile.',
      'Progressive muscle relaxation (tensing and releasing each muscle group for 5 seconds) directly addresses the physical anxiety you carry. Do it once a day, ideally before the stress compounds.',
      'You need external accountability — not because you are lazy, but because your internal regulation system gets overwhelmed. A body-doubling partner, a coworking session, or even the Focusmate app gives you structure without requiring you to build it yourself.',
      'Limit decisions when stressed. Eat the same meals, wear the same clothes, follow the same route. Decision fatigue compounds emotional reactivity.',
    ],
  },
  'H-L-L': {
    summary:
      'This is the highest-risk stress profile. You feel everything intensely, you lack external structure to contain it, and you lack social connection to discharge it. Stress builds internally with nowhere to go, leading to rumination spirals, withdrawal, and in severe cases, shutdown. You are not broken — but you are operating without a safety net, and building one is urgent.',
    items: [
      'Your single most important investment is one reliable coping structure. Pick one: a daily 10-minute walk, a body scan meditation app (Headspace or Insight Timer), or a nightly three-item journal. Do it every day for 30 days before judging whether it works.',
      'Isolation feels protective but it is making things worse. You do not need a social life — you need one person you can text when things get heavy. Identify that person and tell them explicitly: "I might reach out when I am struggling."',
      'When rumination takes over, use the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This pulls your nervous system out of the loop.',
      'Professional support is not optional for this profile — it is necessary. A therapist trained in CBT, DBT, or ACT can provide the external regulation framework you are not going to build alone.',
    ],
  },

  // ── Mid Neuroticism ──────────────────────────────────────────────
  'M-H-H': {
    summary:
      'You handle stress competently — you have the structure to organize it and the social resources to process it. Your moderate neuroticism means stress registers clearly but does not overwhelm. The risk for your profile is not breakdown but blind spots: you cope so effectively on the surface that you can ignore deeper dissatisfaction or chronic low-level burnout for months.',
    items: [
      'Schedule a quarterly "life audit" — 30 minutes reviewing whether your stress levels, relationships, and energy feel sustainable. You are good at managing stress day-to-day but bad at noticing slow deterioration.',
      'Watch for the "high-functioning" trap. Just because you are productive does not mean you are well. Check in with your body: tight shoulders, disrupted sleep, and jaw clenching are signals you are likely to rationalize away.',
      'Your combination of social skill and discipline means you take on others\' problems. Practice the phrase: "That sounds really hard. What are you going to do about it?" instead of volunteering to fix things.',
      'When acute stress does hit, lean into your social network early rather than trying to handle it alone first. Your instinct to structure a solution before asking for help slows your recovery.',
    ],
  },
  'M-H-M': {
    summary:
      'You are a steady, reliable coper who manages stress through planning and moderate social connection. You do not panic easily, and you recover at a reasonable pace. Your biggest stress risk is not intensity but duration — you can sustain a moderately stressful situation for so long that burnout creeps in before you notice it.',
    items: [
      'Burnout is your primary risk, not breakdown. Track your energy levels weekly on a simple 1-10 scale. If you are consistently below 5 for three weeks, something needs to change — even if you are "managing fine."',
      'Your structured coping is effective but can become mechanical. Once a month, do something purely restorative with no productivity goal: a long hike, an afternoon nap, an unplanned day off.',
      'When stress accumulates, your tendency is to tighten your schedule. Try the opposite: cancel one commitment. Creating space is more restorative than optimizing your existing time.',
      'A 10-minute morning walk before checking your phone sets a calm neurological baseline for the day. Simple, evidence-based, and surprisingly effective for preventing stress accumulation.',
    ],
  },
  'M-H-L': {
    summary:
      'You manage stress through discipline and internal processing. You do not seek social support readily, which means your coping is effective but solitary. Under sustained pressure, this can lead to a slow, quiet burnout that nobody sees coming — including you. You tend to treat stress as a problem to be solved rather than an experience to be felt.',
    items: [
      'Journaling is your highest-leverage stress tool. Write for 10 minutes daily — not to-do lists, but actual reflection on how you feel and why. Your natural tendency is to plan your way out of emotions, and journaling interrupts that.',
      'Schedule physical stress release: weight training, running, or swimming. You process internally, and your body accumulates tension that your mind rationalizes away.',
      'You need at least one person who knows your actual stress level. Not a therapist necessarily — just someone who sees past your composed exterior. Let them in deliberately.',
      'Try NSDR (non-sleep deep rest) on days when you feel "tired but wired." It addresses the nervous system fatigue that sleep alone does not fix.',
    ],
  },
  'M-M-H': {
    summary:
      'You have a balanced stress response with moderate structure and strong social resources. You cope primarily through connection — talking things out, seeking perspective, staying active. Your stress management works well for acute situations but can lack depth for existential or chronic stress. You sometimes stay busy as a way of avoiding harder questions.',
    items: [
      'Your social coping is effective for situational stress but insufficient for deeper existential questions. When the usual strategies stop working, that is a signal to go inward rather than outward — try solo journaling or long walks without podcasts.',
      'Watch for "productive avoidance" — filling your schedule so completely that you never have to sit with uncertainty. Boredom is not your enemy; it is where your most important insights live.',
      'When stress is social in origin (conflict, rejection, loneliness), your usual strategy of talking it through may backfire. Sometimes you need to process alone first so you can approach the situation clearly rather than reactively.',
      'Box breathing (4-4-4-4) between meetings or social interactions prevents the accumulation of micro-stressors that compound into evening exhaustion.',
    ],
  },
  'M-M-M': {
    summary:
      'You are a genuine moderate — stress affects you at a normal level, and you cope through a balanced mix of structure, social connection, and internal processing. Nothing about your stress response is extreme, which is both a strength and a limitation. You handle most situations adequately but may lack the intense coping infrastructure that people with more extreme profiles are forced to build.',
    items: [
      'Your balanced profile means you can coast on "good enough" coping for years without building real resilience. Invest in one stress management skill now, before you actually need it — meditation, breathwork, or a regular exercise habit.',
      'When stress does escalate, you may not have practiced tools to match it. Pick one technique — progressive muscle relaxation, box breathing, or the 4-7-8 method — and practice it three times a week so it is available when you need it.',
      'Your risk is complacency, not crisis. The person who never builds a coping toolkit is the person who is blindsided when real adversity hits. Treat stress management like exercise: do it when you feel fine so it works when you do not.',
      'Pay attention to which coping style you naturally reach for — planning, talking, or withdrawing. Then deliberately practice the other two so you have options.',
    ],
  },
  'M-M-L': {
    summary:
      'You experience moderate stress and process it quietly, with limited structure and limited social outlets. You are not in crisis, but you lack robust coping infrastructure. Under sustained pressure, your tendency is to withdraw and wait for the stress to pass rather than actively managing it — which works for small stressors but fails for larger ones.',
    items: [
      'Your default strategy of "wait it out" works for minor stress but leaves you unprepared for anything sustained. Build one proactive habit: a daily walk, a weekly journal entry, or a monthly check-in with a friend.',
      'When stress rises above your baseline, your instinct is to retreat. Set a personal rule: if you have been stressed for more than five days, you must tell one person. Breaking the silence is itself a coping mechanism.',
      'Try the Pomodoro technique for stress-inducing tasks. The timed structure externalizes the discipline you do not naturally generate, and the built-in breaks prevent accumulation.',
      'Cold exposure (a 30-60 second cold shower) is surprisingly effective for your profile because it forces your nervous system into a controlled stress response, which builds tolerance for uncontrolled ones.',
    ],
  },
  'M-L-H': {
    summary:
      'You cope through social energy and action, but without much internal structure. When stress hits, you move — you call someone, you make plans, you stay busy. The risk is that you never actually sit with the discomfort long enough to understand it. Your stress management is reactive rather than preventive, and it works until the pace becomes unsustainable.',
    items: [
      'After every stressful event, take 10 minutes alone before engaging socially. Write down what happened, what you felt, and what you need. This prevents the pattern of processing everything externally without internal clarity.',
      'Your lack of structure means small stressors accumulate into overwhelm because nothing gets organized or prioritized. A simple weekly review — 20 minutes on Sunday listing what is on your plate — prevents this.',
      'When you feel the impulse to "do something" about stress, check whether action is actually needed or whether you are using activity to avoid feeling. Sometimes the most productive response is sitting still.',
      'Build a wind-down routine for evenings. Without structure, your social energy can keep you activated past the point of useful engagement. A screen-free hour before bed with 4-7-8 breathing helps your system downshift.',
    ],
  },
  'M-L-M': {
    summary:
      'You are low-structure and moderate in both emotionality and social orientation. Stress does not hit you hard, but you also do not have strong mechanisms to deal with it when it does. You tend to drift through stressful periods rather than confronting them directly. Nothing is urgent enough to force action, so things stay unresolved longer than they should.',
    items: [
      'Your biggest risk is letting moderate stress persist indefinitely because it never feels bad enough to address. Set a personal threshold: if something has been bothering you for two weeks, take one concrete step to resolve it.',
      'Build one anchor habit that requires no motivation: a 10-minute morning walk is ideal. It is low effort, physiologically regulating, and gives your day a starting point when nothing else does.',
      'Avoid the "I should be able to handle this" trap. Your moderate stress levels do not mean you do not deserve support. A monthly check-in with a friend or therapist prevents drift from becoming stagnation.',
      'When you notice avoidance behavior (scrolling, snacking, binge-watching), treat it as a stress signal rather than a character flaw. Ask: "What am I avoiding?" and write the answer down.',
    ],
  },
  'M-L-L': {
    summary:
      'You are emotionally moderate but structurally and socially minimal. Stress does not devastate you, but you also do not have much infrastructure to handle it. Your pattern is quiet avoidance — withdrawing from stressors rather than engaging with them, which works for small problems but allows larger ones to grow unchecked.',
    items: [
      'Your avoidance pattern means problems grow silently. Set a weekly alarm to ask yourself: "Is there anything I am avoiding?" Write the answer down and take one small step toward it.',
      'Physical activity is your most accessible coping tool because it requires no social interaction and no complex planning. A daily walk, even 10 minutes, provides neurological regulation that passive rest does not.',
      'You need at least one external check-in point — a friend, a therapist, even a structured online community. Without it, your natural tendency toward withdrawal means stressors go unaddressed until they become crises.',
      'When avoidance is strong, use the two-minute rule: if a stressful task takes less than two minutes, do it immediately. This builds momentum without requiring willpower you do not have in stressed states.',
    ],
  },

  // ── Low Neuroticism ──────────────────────────────────────────────
  'L-H-H': {
    summary:
      'You are naturally calm, highly organized, and socially energized — a profile that handles stress exceptionally well on the surface. You rarely feel overwhelmed, you take action quickly, and you have people around you for support. The hidden risk is that you suppress or intellectualize stress signals rather than feeling them. You can push through problems that other people would stop and process, which means you occasionally miss the message your stress is trying to send.',
    items: [
      'Your biggest vulnerability is ignoring stress signals until they become physical symptoms — back pain, insomnia, digestive issues. Treat these as data, not inconveniences.',
      'Schedule emotional check-ins with yourself. You are so action-oriented that you skip the "how do I actually feel about this?" step. A 5-minute daily journal asking just that question builds awareness over time.',
      'You may inadvertently dismiss others\' stress because it does not match your experience. Practice validating emotions you do not share: "That sounds really difficult" goes further than "Here is what I would do."',
      'When you do hit genuine overwhelm — and it will happen eventually — you may not have practiced tools to handle it. Learn body scan meditation or progressive muscle relaxation now, while you are calm, so it is available when you need it.',
    ],
  },
  'L-H-M': {
    summary:
      'You are calm and disciplined with moderate social resources. Stress rarely derails you because you plan effectively and do not feel things with paralyzing intensity. Your risk is the long game: you can sustain unhealthy situations — bad jobs, stale relationships, grinding routines — for years because your low neuroticism means the distress signal never gets loud enough to force a change.',
    items: [
      'Ask yourself annually: "Am I genuinely satisfied, or have I just gotten good at tolerating things?" Your natural calmness can mask stagnation.',
      'When something does bother you, pay extra attention — it takes a lot to register on your radar, which means the signal is probably important.',
      'Your tendency to handle everything internally and systematically means you may not realize when you need external perspective. Build regular check-ins with a mentor, coach, or trusted friend.',
      'Try gratitude journaling — not because you are unhappy, but because your low emotional reactivity means positive experiences can pass without being fully absorbed either.',
    ],
  },
  'L-H-L': {
    summary:
      'You are calm, disciplined, and solitary — a profile that handles stress through quiet, methodical competence. You rarely feel overwhelmed and rarely seek help, which makes you exceptionally self-sufficient. The downside is emotional flatness: you can become so efficient at managing stress that you lose touch with the emotional texture of your life.',
    items: [
      'Your risk is not stress — it is numbness. When everything is managed and contained, check whether you are actually living or just operating. Schedule unstructured time with no agenda.',
      'Physical practices are especially important for you because they bypass your intellectual containment. Cold showers, intense exercise, or breathwork create physiological states that your mind cannot rationalize away.',
      'You may be the last person to recognize burnout because it manifests as flatness and disengagement rather than distress. If you stop caring about things that used to matter, that is your alarm bell.',
      'Practice naming emotions with granularity. Not just "fine" or "stressed" but specific labels: frustrated, disappointed, bored, restless. Emotional vocabulary builds awareness you are currently bypassing.',
    ],
  },
  'L-M-H': {
    summary:
      'You are emotionally steady with moderate structure and high social energy. You cope primarily through connection and activity, and stress rarely lingers because you process it externally and move on. Your vulnerability is superficial processing — you talk about stress without fully feeling it, and you can confuse social validation with actual resolution.',
    items: [
      'After talking through a stressful situation with friends, ask yourself: "Did I actually resolve anything, or did I just feel better temporarily?" Social processing is valuable but can substitute for action.',
      'Your calm demeanor and social skill mean people bring their stress to you. Learn to distinguish between supporting others and absorbing their problems. The question "What do you need from me right now?" sets a healthy boundary.',
      'Build one solitary practice — journaling, meditation, or solo walks — to complement your social coping. Some stress requires internal processing that conversation cannot reach.',
      'When life gets genuinely hard, your instinct is to stay positive and keep moving. Allow yourself to feel bad without trying to fix it immediately. Grief, disappointment, and frustration need space, not solutions.',
    ],
  },
  'L-M-M': {
    summary:
      'You are emotionally steady and moderately resourced in both structure and social support. Stress sits lightly on you, and you cope adequately through a mix of strategies. You are unlikely to have a stress crisis, but you are also unlikely to build deep resilience — because nothing has ever forced you to. Your risk is being unprepared when real adversity arrives.',
    items: [
      'Build stress tolerance proactively. Regular exercise, breathwork practice, or cold exposure builds the neurological infrastructure for handling acute stress before you need it.',
      'Your emotional steadiness is a genuine asset, but make sure it does not become emotional avoidance. Check in monthly: "Is there anything I have been suppressing rather than feeling?"',
      'When someone close to you is struggling, resist the urge to minimize their experience just because you would handle it differently. "That sounds really hard" is more helpful than "It will be fine."',
      'Consider learning one formal stress technique — box breathing, progressive muscle relaxation, or meditation — as an insurance policy. The best time to learn it is when you do not need it.',
    ],
  },
  'L-M-L': {
    summary:
      'You are calm, moderately structured, and introverted — a profile that rarely experiences acute stress but can drift into chronic low-grade disengagement. You manage by keeping your world small and controlled, which works until something disrupts the equilibrium. When external stress does penetrate your calm, you may lack practiced responses because you have never needed them.',
    items: [
      'Your containment strategy works until it does not. Build one active coping skill — 4-7-8 breathing, progressive muscle relaxation, or body scan meditation — and practice it weekly so it is available in a crisis.',
      'Watch for withdrawal becoming your default response to everything. Solitude is restorative, but chronic isolation is a risk factor for depression even in people with low neuroticism.',
      'Physical activity is especially important for your profile. You will not naturally seek out intense experiences, so schedule them: a challenging hike, a cold plunge, or a hard workout. Your nervous system needs activation, not just calm.',
      'Check in with yourself quarterly: "Am I at peace, or am I just numb?" The difference matters, and your low emotional reactivity can make it hard to tell.',
    ],
  },
  'L-L-H': {
    summary:
      'You are calm, unstructured, and highly social — a profile that handles stress through action, connection, and spontaneity. You bounce back quickly from setbacks because you neither dwell on them emotionally nor overthink them structurally. The risk is that your lack of reflection means you repeat the same stress patterns without learning from them.',
    items: [
      'Your fast recovery is a strength, but speed is not the same as depth. After major stressors, take 30 minutes to write down what happened, what you learned, and what you would do differently. This converts experience into wisdom.',
      'Your lack of structure means preventable stressors keep recurring — missed deadlines, forgotten commitments, last-minute scrambles. A simple weekly planning session (20 minutes on Sunday) eliminates most of these.',
      'You process externally, but make sure you are getting genuine feedback, not just agreement. Ask a trusted friend: "Tell me what I am not seeing here."',
      'When stress is genuinely serious — health, finances, relationships — your instinct to "keep it light" can prevent you from engaging at the depth the situation requires. Notice when optimism becomes avoidance.',
    ],
  },
  'L-L-M': {
    summary:
      'You are calm, unstructured, and socially moderate — a low-intensity profile that rarely feels stressed and rarely does much about it when stress does arise. Your approach is essentially to wait for problems to resolve themselves, and surprisingly often, they do. When they do not, you can find yourself in situations that have escalated beyond easy repair.',
    items: [
      'Your biggest risk is neglect — not of tasks, but of yourself. Because stress does not feel urgent, important things (health, finances, relationships) can deteriorate slowly without triggering your alarm system.',
      'Build one simple maintenance habit: a monthly review of what is working and what is not. You do not need a complex system — just 20 minutes of honest assessment.',
      'When stress does arrive, your lack of practiced coping tools means it hits harder than it should. Learn one grounding technique (box breathing or the 5-4-3-2-1 method) and practice it enough that it is automatic.',
      'Your easygoing nature is a genuine social asset, but make sure people around you know when something actually matters to you. Others cannot support what they do not know about.',
    ],
  },
  'L-L-L': {
    summary:
      'You are the calmest, least structured, most solitary stress profile. Stress rarely registers, you have minimal coping infrastructure, and you do not seek external support. For day-to-day life this works — you are genuinely unbothered by things that devastate other people. The risk is existential rather than emotional: you can drift through life without the friction that forces growth, connection, or change.',
    items: [
      'Your profile is low-maintenance until it is not. When a genuine crisis hits — and one eventually will — you will have no practiced coping tools, no support network, and no internal alarm system. Build at least one of each now.',
      'Physical practices are your best entry point: a daily walk, a cold shower, or any form of exercise. These require no social interaction, no structure, and no emotional engagement — but they build neurological resilience quietly.',
      'Identify one person you could call in a genuine emergency and make sure that relationship is maintained. You do not need a social life — you need a lifeline.',
      'Ask yourself honestly: "Am I at peace, or have I just stopped caring?" Low neuroticism is a gift when it means equanimity. It is a warning sign when it means disengagement.',
    ],
  },
};

export default stressProfiles;
