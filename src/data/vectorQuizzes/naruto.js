// Which Naruto Character Are You? — data module.
//
// Faithful port of the standalone "Shinobi Alignment Test". Every character
// is a position in 4-axis personality space; matching is cosine similarity
// (see src/utils/vectorQuiz.js for the why). The Monte-Carlo battery in
// naruto.test.js re-verifies reachability/entropy/sensitivity after every
// roster or question edit — run it before shipping ANY change to this file.
//
// Axes: [logos, social, drive, express], each in [-1, 1]
//   logos:   -1 strategy  / +1 instinct
//   social:  -1 lone      / +1 bonds
//   drive:   -1 protector / +1 trailblazer (ambition)
//   express: -1 reserved  / +1 expressive
//
// Character images: every entry has img:null. Paste a URL to swap the
// generated chakra emblem for a photo; the emblem code handles the rest.

import { lighten } from '../../utils/vectorQuiz';

/* ---------- glyph builders (all original, centred at 110,110) ---------- */
/* eslint-disable no-unused-vars -- all builders share the (aura, light) signature */
const G = {
  spiral:(a)=>{let d='M 110 110';const T=2.6,R=46,S=90;for(let i=1;i<=S;i++){const t=i/S,r=t*R,th=t*T*2*Math.PI;d+=' L '+(110+r*Math.cos(th)).toFixed(1)+' '+(110+r*Math.sin(th)).toFixed(1);}return `<path d="${d}" fill="none" stroke="${a}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;},
  lightning:(a,l)=>`<path d="M124 62 L92 112 L110 112 L88 158 L140 100 L120 100 L138 62 Z" fill="${a}" stroke="${l}" stroke-width="2" stroke-linejoin="round"/>`,
  blossom:(a,l)=>{let s='';for(let i=0;i<5;i++){s+=`<ellipse cx="110" cy="78" rx="14" ry="27" fill="${a}" opacity=".92" transform="rotate(${(i/5)*360} 110 110)"/>`;}return s+`<circle cx="110" cy="110" r="12" fill="${l}"/>`;},
  flame:(a,l)=>`<path d="M110 60 C 130 88 140 106 124 130 C 138 124 143 108 141 100 C 152 122 147 152 110 160 C 73 152 68 122 79 100 C 77 108 82 124 96 130 C 80 106 90 88 110 60 Z" fill="${a}"/><path d="M110 96 C 121 112 121 130 110 148 C 99 130 99 112 110 96 Z" fill="${l}"/>`,
  ripple:(a,l)=>`<circle cx="110" cy="110" r="10" fill="${l}"/><circle cx="110" cy="110" r="24" fill="none" stroke="${a}" stroke-width="4" opacity=".9"/><circle cx="110" cy="110" r="38" fill="none" stroke="${a}" stroke-width="3" opacity=".6"/><circle cx="110" cy="110" r="51" fill="none" stroke="${a}" stroke-width="2" opacity=".35"/>`,
  shadow:(a,l)=>`<path d="M110 62 L152 152 L68 152 Z" fill="${a}" opacity=".88"/><path d="M110 94 L148 158 L72 158 Z" fill="${l}" opacity=".5"/>`,
  sand:(a,l)=>{let s=`<circle cx="110" cy="110" r="14" fill="${l}"/>`;[[30,8,3.2],[44,14,2.6],[55,18,2]].forEach(([r,n,z])=>{for(let i=0;i<n;i++){const th=(i/n)*2*Math.PI;s+=`<circle cx="${(110+r*Math.cos(th)).toFixed(1)}" cy="${(110+r*Math.sin(th)).toFixed(1)}" r="${z}" fill="${a}"/>`;}});return s;},
  feather:(a,l)=>`<path d="M110 56 C 88 96 84 132 104 162 L110 152 L116 162 C 136 132 132 96 110 56 Z" fill="${a}"/><line x1="110" y1="70" x2="110" y2="154" stroke="${l}" stroke-width="2"/><g stroke="${l}" stroke-width="1.5" opacity=".7"><line x1="110" y1="88" x2="97" y2="97"/><line x1="110" y1="88" x2="123" y2="97"/><line x1="110" y1="108" x2="93" y2="119"/><line x1="110" y1="108" x2="127" y2="119"/><line x1="110" y1="128" x2="98" y2="138"/><line x1="110" y1="128" x2="122" y2="138"/></g>`,
  hex:(a,l)=>{const hp=(cx,cy,r)=>{let p='';for(let i=0;i<6;i++){const ang=(Math.PI/180)*(60*i-90);p+=(i?'L':'M')+(cx+r*Math.cos(ang)).toFixed(1)+' '+(cy+r*Math.sin(ang)).toFixed(1)+' ';}return p+'Z';};let s='';[[110,94],[84,120],[136,120],[110,146]].forEach((h,i)=>{s+=`<path d="${hp(h[0],h[1],17)}" fill="${i%2?l:a}" fill-opacity="${i%2?.5:.92}" stroke="${a}" stroke-width="1.5"/>`;});return s;},
  burst:(a,l)=>{const sp=12,o=52,inr=20;let d='';for(let i=0;i<sp*2;i++){const r=i%2?inr:o,th=(i/(sp*2))*2*Math.PI-Math.PI/2;d+=(i?'L':'M')+(110+r*Math.cos(th)).toFixed(1)+' '+(110+r*Math.sin(th)).toFixed(1)+' ';}return `<path d="${d}Z" fill="${a}"/><circle cx="110" cy="110" r="12" fill="${l}"/>`;},
  gear:(a,l)=>{const t=10,rO=50,rI=39,w=.3;let d='';for(let i=0;i<t;i++){const s0=(i/t)*2*Math.PI,s1=s0+w*(2*Math.PI/t),s2=s0+(1-w)*(2*Math.PI/t),s3=s0+(2*Math.PI/t);const p=(r,g)=>`${(110+r*Math.cos(g)).toFixed(1)} ${(110+r*Math.sin(g)).toFixed(1)}`;d+=(i?'L':'M')+p(rI,s0)+' L '+p(rO,s1)+' L '+p(rO,s2)+' L '+p(rI,s3)+' ';}return `<path d="${d}Z" fill="${a}"/><circle cx="110" cy="110" r="16" fill="none" stroke="${l}" stroke-width="6"/><circle cx="110" cy="110" r="6" fill="${l}"/>`;},
  sound:(a,l)=>{let s=`<circle cx="110" cy="110" r="8" fill="${l}"/>`;[18,30,42,54].forEach((r,i)=>{const op=(1-i*.2).toFixed(2);const P=(ang)=>`${(110+r*Math.cos(ang)).toFixed(1)} ${(110+r*Math.sin(ang)).toFixed(1)}`;s+=`<path d="M ${P(-Math.PI/4)} A ${r} ${r} 0 0 1 ${P(Math.PI/4)}" fill="none" stroke="${a}" stroke-width="4" opacity="${op}" stroke-linecap="round"/>`;s+=`<path d="M ${P(Math.PI-Math.PI/4)} A ${r} ${r} 0 0 0 ${P(Math.PI+Math.PI/4)}" fill="none" stroke="${a}" stroke-width="4" opacity="${op}" stroke-linecap="round"/>`;});return s;},
  ink:(a)=>`<path d="M72 132 C 88 94 108 82 118 74 C 132 66 140 72 133 82 C 124 96 100 108 91 126 C 108 116 130 112 142 118 C 129 127 104 130 91 141 C 106 138 126 141 138 149" fill="none" stroke="${a}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="142" cy="151" r="4.5" fill="${a}"/>`,
  coil:(a)=>{let d='M 110 160';const amp=26,top=62,S=60;for(let i=1;i<=S;i++){const t=i/S,y=160-t*(160-top),x=110+amp*Math.sin(t*Math.PI*2.5)*(0.4+0.6*t);d+=' L '+x.toFixed(1)+' '+y.toFixed(1);}const hx=110+amp*Math.sin(Math.PI*2.5)*1;return `<path d="${d}" fill="none" stroke="${a}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${hx.toFixed(1)}" cy="${top}" r="7.5" fill="${a}"/>`;},
  flash:(a,l)=>{const o=54,inr=15;let d='';for(let i=0;i<8;i++){const r=i%2?inr:o,th=(i/8)*2*Math.PI-Math.PI/2;d+=(i?'L':'M')+(110+r*Math.cos(th)).toFixed(1)+' '+(110+r*Math.sin(th)).toFixed(1)+' ';}return `<path d="${d}Z" fill="${a}"/><circle cx="110" cy="110" r="10" fill="${l}"/>`;},
  blade:(a,l)=>`<path d="M110 58 L122 78 L122 132 L134 140 L134 150 L86 150 L86 140 L98 132 L98 78 Z" fill="${a}" stroke="${l}" stroke-width="2" stroke-linejoin="round"/><circle cx="110" cy="104" r="6.5" fill="none" stroke="${l}" stroke-width="3"/>`,
  eye:(a,l)=>{let t='';for(let i=0;i<3;i++){const th=(i/3)*2*Math.PI-Math.PI/2,cx=110+24*Math.cos(th),cy=110+24*Math.sin(th);t+=`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="8" fill="${l}"/>`;}return `<circle cx="110" cy="110" r="48" fill="${a}"/><circle cx="110" cy="110" r="11" fill="${l}"/>`+t;},
  knives:(a,l)=>{const b=r=>`<g transform="rotate(${r} 110 110)"><path d="M110 60 L118 74 L114 140 L106 140 L102 74 Z" fill="${a}"/><rect x="103" y="140" width="14" height="18" rx="2" fill="${l}"/></g>`;return b(26)+b(-26);},
  toad:(a,l)=>`<path d="M64 118 C 64 92 84 78 110 78 C 136 78 156 92 156 118 C 156 140 136 152 110 152 C 84 152 64 140 64 118 Z" fill="${a}"/><circle cx="90" cy="98" r="15" fill="${l}"/><circle cx="130" cy="98" r="15" fill="${l}"/><circle cx="90" cy="98" r="6" fill="${a}"/><circle cx="130" cy="98" r="6" fill="${a}"/><path d="M92 128 Q110 140 128 128" fill="none" stroke="${l}" stroke-width="4" stroke-linecap="round"/>`,
  butterfly:(a,l)=>{const w=s=>`<g transform="translate(110 110) scale(${s} 1)"><path d="M4 -6 C 30 -46 60 -40 54 -10 C 52 4 30 6 4 2 Z" fill="${a}"/><path d="M4 6 C 26 20 48 22 46 40 C 42 56 18 44 4 18 Z" fill="${a}" opacity=".8"/></g>`;return w(1)+w(-1)+`<ellipse cx="110" cy="110" rx="5" ry="26" fill="${l}"/><circle cx="110" cy="82" r="5" fill="${l}"/>`;},
  cube:(a,l)=>`<path d="M110 66 L150 90 L110 114 L70 90 Z" fill="${l}"/><path d="M70 90 L110 114 L110 158 L70 134 Z" fill="${a}"/><path d="M150 90 L110 114 L110 158 L150 134 Z" fill="${a}" opacity=".78"/>`,
  diamond:(a,l)=>`<path d="M110 58 L150 110 L110 162 L70 110 Z" fill="${a}"/><path d="M110 82 L132 110 L110 138 L88 110 Z" fill="${l}"/><circle cx="110" cy="110" r="7" fill="${a}"/>`,
  fan:(a,l)=>{const cx=110,cy=150,R=86,a0=-Math.PI*0.82,a1=-Math.PI*0.18;const X=(r,t)=>(cx+r*Math.cos(t)).toFixed(1),Y=(r,t)=>(cy+r*Math.sin(t)).toFixed(1);const d=`M ${X(14,a0)} ${Y(14,a0)} L ${X(R,a0)} ${Y(R,a0)} A ${R} ${R} 0 0 1 ${X(R,a1)} ${Y(R,a1)} L ${X(14,a1)} ${Y(14,a1)} Z`;let ribs='';for(let i=1;i<5;i++){const t=a0+(a1-a0)*i/5;ribs+=`<line x1="${X(14,t)}" y1="${Y(14,t)}" x2="${X(R,t)}" y2="${Y(R,t)}" stroke="${l}" stroke-width="2.5"/>`;}return `<path d="${d}" fill="${a}"/>${ribs}<circle cx="${cx}" cy="${cy}" r="7" fill="${l}"/>`;},
  bloom:(a,l)=>{let s='';for(let i=0;i<8;i++){s+=`<ellipse cx="110" cy="74" rx="9" ry="30" fill="${a}" opacity=".9" transform="rotate(${i*45} 110 110)"/>`;}return s+`<circle cx="110" cy="110" r="13" fill="${l}"/>`;},
  paw:(a,l)=>{let toes='';[[80,92],[104,80],[128,84],[144,104]].forEach(([x,y],i)=>{toes+=`<ellipse cx="${x}" cy="${y}" rx="11" ry="14" fill="${a}" transform="rotate(${((i-1.5)*18).toFixed(1)} ${x} ${y})"/>`;});return toes+`<path d="M110 108 C 92 108 78 122 78 138 C 78 156 96 162 110 162 C 124 162 142 156 142 138 C 142 122 128 108 110 108 Z" fill="${a}"/>`;},
  leaf:(a,l)=>`<path d="M110 58 C 150 84 150 138 110 164 C 70 138 70 84 110 58 Z" fill="${a}"/><path d="M110 62 L110 160" stroke="${l}" stroke-width="3"/><g stroke="${l}" stroke-width="1.6" opacity=".75"><line x1="110" y1="86" x2="92" y2="98"/><line x1="110" y1="86" x2="128" y2="98"/><line x1="110" y1="112" x2="90" y2="126"/><line x1="110" y1="112" x2="130" y2="126"/></g>`,
  tree:(a,l)=>`<path d="M110 164 L110 96" stroke="${a}" stroke-width="8" stroke-linecap="round"/><path d="M110 120 L86 100 M110 112 L134 94" stroke="${a}" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="110" cy="84" r="20" fill="${l}"/><circle cx="84" cy="98" r="12" fill="${l}"/><circle cx="136" cy="90" r="13" fill="${l}"/>`,
  fin:(a,l)=>`<path d="M110 60 C 118 96 140 120 150 132 L70 132 C 92 118 102 96 110 60 Z" fill="${a}"/><g stroke="${l}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".85"><path d="M64 146 q 12 -10 24 0 t 24 0 t 24 0"/><path d="M64 160 q 12 -10 24 0 t 24 0 t 24 0"/></g>`,
  jashin:(a,l)=>{const R=52;let d='';for(let i=0;i<3;i++){const t=-Math.PI/2+i*2*Math.PI/3;d+=(i?'L':'M')+(110+R*Math.cos(t)).toFixed(1)+' '+(110+R*Math.sin(t)).toFixed(1)+' ';}return `<circle cx="110" cy="110" r="62" fill="none" stroke="${a}" stroke-width="5"/><path d="${d}Z" fill="none" stroke="${a}" stroke-width="5" stroke-linejoin="round"/><circle cx="110" cy="110" r="6" fill="${l}"/>`;},
  rinne:(a,l)=>{let s=`<circle cx="110" cy="110" r="9" fill="${l}"/>`;[22,34,46,58].forEach((r,i)=>{s+=`<circle cx="110" cy="110" r="${r}" fill="none" stroke="${a}" stroke-width="${i===0?4:3}" opacity="${(1-i*0.12).toFixed(2)}"/>`;});return s;},
  uchiwa:(a,l)=>`<circle cx="110" cy="104" r="33" fill="${l}"/><path d="M110 72 C 128 74 140 88 140 104 C 140 112 136 118 110 118 C 84 118 80 112 80 104 C 80 88 92 74 110 72 Z" fill="${a}"/><path d="M110 118 L110 150" stroke="${a}" stroke-width="6" stroke-linecap="round"/>`,
  wave:(a,l)=>`<path d="M64 132 C 72 100 104 96 120 118 C 130 132 146 130 150 118 C 150 140 138 156 112 158 C 84 160 66 150 64 132 Z" fill="${a}"/><circle cx="118" cy="120" r="9" fill="${l}"/><path d="M110 66 C 120 84 120 94 110 100 C 100 94 100 84 110 66 Z" fill="${a}"/>`,
  fox:(a,l)=>`<path d="M82 66 L98 100 L82 100 Z" fill="${a}"/><path d="M138 66 L122 100 L138 100 Z" fill="${a}"/><path d="M110 158 C 74 140 72 116 84 98 L136 98 C 148 116 146 140 110 158 Z" fill="${a}"/><path d="M96 118 l9 6 M124 118 l-9 6" stroke="${l}" stroke-width="5" stroke-linecap="round"/><path d="M103 136 L110 142 L117 136" fill="none" stroke="${l}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
};
/* eslint-enable no-unused-vars */

const CHARS = {
  naruto:{name:"Naruto Uzumaki", tag:"The Unbreakable Heart", tier:"front", glyph:"spiral", aura:"#f5a623", img:null,
    v:[.80,.90,.30,.90], kindred:"lee", rival:"sasuke",
    traits:["Relentless","Warm","Loud","Loyal","Optimistic"],
    desc:"You lead with pure heart and refuse to quit, no matter how long the odds. People underestimate you at first, then get pulled into your orbit by sheer force of belief. Loyalty is your whole religion — you'd walk through fire for anyone you've claimed as your own."},
  sasuke:{name:"Sasuke Uchiha", tag:"The Lone Blade", tier:"front", glyph:"lightning", aura:"#6d5bd0", img:null,
    v:[-.20,-.90,.90,-.30], kindred:"itachi", rival:"naruto",
    traits:["Driven","Independent","Intense","Gifted","Guarded"],
    desc:"You carry your goals alone and hold yourself to a standard almost nobody else can see. Talent comes easily, and you lean on discipline to carry you the rest of the way. Beneath the cool distance sits a fierce, complicated loyalty you rarely let anyone witness."},
  kakashi:{name:"Kakashi Hatake", tag:"The Quiet Master", tier:"front", glyph:"lightning", aura:"#7fb2d9", img:null,
    v:[-.80,.00,-.40,-.70], kindred:"itachi", rival:"guy",
    traits:["Wise","Laid-back","Perceptive","Mysterious","Steady"],
    desc:"You're endlessly capable and wear it lightly, hiding real depth behind a relaxed, hard-to-read exterior. You read people and situations faster than you let on, and you prefer to guide while others find their footing. You'll show up late without blinking and stand by your people without fail."},
  itachi:{name:"Itachi Uchiha", tag:"The Silent Sacrifice", tier:"front", glyph:"feather", aura:"#b23a55", img:null,
    v:[-.80,-.40,-.20,-.60], kindred:"kakashi", rival:"orochimaru",
    traits:["Genius","Selfless","Composed","Strategic","Enigmatic"],
    desc:"You shoulder heavy burdens alone and let people misunderstand you if it keeps them safe. Brilliant and self-controlled, you play a longer game than anyone around you realizes. Every hard choice you make quietly serves someone you love."},
  gaara:{name:"Gaara", tag:"The Steady Shield", tier:"front", glyph:"sand", aura:"#cf6f47", img:null,
    v:[-.30,-.20,.00,-.85], kindred:"sasuke", rival:"naruto",
    traits:["Stoic","Protective","Composed","Resilient","Loyal"],
    desc:"You've turned hard-won pain into a quiet duty to protect. Calm to the point of stillness, you carry authority without ever raising your voice. People feel safer when you're the one standing guard."},
  jiraiya:{name:"Jiraiya", tag:"The Gallant Sage", tier:"front", glyph:"toad", aura:"#cc4f3e", img:null,
    v:[.35,.75,-.35,.85], kindred:"naruto", rival:"orochimaru",
    traits:["Wise","Flamboyant","Big-hearted","Free-spirited","Devoted"],
    desc:"You mentor with a wide-open heart and a taste for the dramatic entrance. Experience made you wise, and you spend that wisdom lifting up the people coming after you. Underneath the showmanship runs deep devotion to your students and your ideals."},
  minato:{name:"Minato Namikaze", tag:"The Yellow Flash", tier:"front", glyph:"flash", aura:"#e8c14a", img:null,
    v:[-.70,.50,-.70,-.20], kindred:"kakashi", rival:"obito",
    traits:["Brilliant","Swift","Humble","Selfless","Composed"],
    desc:"You combine dazzling skill with genuine humility, solving problems at a speed others struggle to follow. Calm under pressure, you lead by example and put your people first at every turn. When everything hangs in the balance, you give whatever it takes to protect what you love."},
  tsunade:{name:"Tsunade", tag:"The Healing Fist", tier:"front", glyph:"diamond", aura:"#35b58e", img:null,
    v:[.10,.50,-.15,.55], kindred:"jiraiya", rival:"orochimaru",
    traits:["Bold","Nurturing","Strong-willed","Brash","Loyal"],
    desc:"You lead with raw strength and an even bigger sense of duty to the people under you. A soft touch for healing sits right alongside a temper and a fist that can level a wall. You gamble big, love hard, and carry burdens most people would crumble under."},
  hashirama:{name:"Hashirama Senju", tag:"The God of Shinobi", tier:"front", glyph:"tree", aura:"#57a84f", img:null,
    v:[.50,.85,-.35,.75], kindred:"naruto", rival:"madara",
    traits:["Idealistic","Warm","Powerful","Forgiving","Dramatic"],
    desc:"You dream big and lead with an open, forgiving heart, holding a whole community together through sheer warmth. Enormous power sits alongside a goofy, emotional streak that puts everyone at ease. You believe in people to a fault and keep reaching for a world where everyone belongs."},
  tobirama:{name:"Tobirama Senju", tag:"The Cold Current", tier:"front", glyph:"wave", aura:"#3fa2c0", img:null,
    v:[-.75,-.25,-.35,-.45], kindred:"hashirama", rival:"orochimaru",
    traits:["Pragmatic","Blunt","Brilliant","Disciplined","Wary"],
    desc:"You approach every problem with a cool, analytical mind and say the hard truths out loud. A relentless innovator, you build the tools and systems others rely on for generations. Beneath the stern exterior runs a fierce loyalty to the people and the order you protect."},
  lee:{name:"Rock Lee", tag:"The Burning Effort", tier:"front", glyph:"flame", aura:"#3fbf6f", img:null,
    v:[.70,.50,.10,.95], kindred:"guy", rival:"neji",
    traits:["Hardworking","Sincere","Passionate","Brave","Kind"],
    desc:"You believe hard work beats raw talent, and you'll bleed to prove it. Your sincerity is total: earnest effort, honest ambition, and a big open heart. Where others see limits, you see a training montage."},
  guy:{name:"Might Guy", tag:"The Blazing Spirit", tier:"cut", glyph:"flame", aura:"#35b85f", img:null,
    v:[.90,.60,.20,1.0], kindred:"lee", rival:"kakashi",
    traits:["Intense","Sincere","Devoted","Courageous","Energetic"],
    desc:"You bring maximum intensity to everything, from training to friendship to a single thumbs-up. Your energy is contagious and your sincerity is bulletproof. When things get truly desperate, you're capable of feats that leave legends speechless."},
  neji:{name:"Neji Hyuga", tag:"The Sharpened Pride", tier:"cut", glyph:"ripple", aura:"#8fb8d8", img:null,
    v:[-.55,-.35,.10,-.50], kindred:"sasuke", rival:"lee",
    traits:["Precise","Disciplined","Talented","Proud","Evolving"],
    desc:"You hold yourself and everyone around you to exacting standards, with the skill to back it up. Early on you believed the world was fixed; growth taught you to fight for a different future. Precise and disciplined, you carry a depth of feeling you seldom show."},
  shikamaru:{name:"Shikamaru Nara", tag:"The Ten-Move Mind", tier:"front", glyph:"shadow", aura:"#7a8aa0", img:null,
    v:[-.95,.20,-.60,-.60], kindred:"kakashi", rival:"sasuke",
    traits:["Strategic","Calm","Perceptive","Loyal","Understated"],
    desc:"You conserve energy for what matters and solve problems in your head before anyone notices there was one. You see several moves ahead and favor a clever exit over a loud brawl. Under all the sighing sits someone fiercely dependable the moment your people need a plan."},
  bee:{name:"Killer Bee", tag:"The Free Rhythm", tier:"cut", glyph:"sound", aura:"#29c0b0", img:null,
    v:[.20,.60,.15,.90], kindred:"naruto", rival:"sasuke",
    traits:["Confident","Creative","Generous","Powerful","Free"],
    desc:"You move to your own beat and turn everything into a performance, backed by serious power. Confident and generous, you mentor without ego and celebrate out loud. You've made peace with the storm inside you and channel it straight into flow."},
  kurama:{name:"Kurama", tag:"The Nine-Tailed Fox", tier:"front", glyph:"fox", aura:"#e5642b", img:null,
    v:[.45,-.55,.55,.80], kindred:"naruto", rival:"obito",
    traits:["Proud","Powerful","Sardonic","Independent","Fierce"],
    desc:"You carry ancient pride and enough raw power to level a landscape when provoked. Sharp-tongued and fiercely independent, you answer to no one and make sure everyone knows it. Under all the growling sits a loyalty that runs deep once someone finally earns your respect."},
  orochimaru:{name:"Orochimaru", tag:"The Endless Seeker", tier:"front", glyph:"coil", aura:"#a983d6", img:null,
    v:[-.70,-.90,1.0,-.35], kindred:"madara", rival:"itachi",
    traits:["Brilliant","Ambitious","Fearless","Solitary","Obsessive"],
    desc:"You're driven by an insatiable hunger to know and to slip past every limit set in front of you. Brilliant and utterly self-directed, you follow curiosity past every fence others stop at. Attachment is a luxury; discovery is the whole point."},
  deidara:{name:"Deidara", tag:"The Explosive Artist", tier:"cut", glyph:"burst", aura:"#e0b13a", img:null,
    v:[.30,-.50,.75,.85], kindred:"bee", rival:"sasori",
    traits:["Artistic","Bold","Proud","Dramatic","Impulsive"],
    desc:"You believe a thing reaches its peak in the instant it goes off. Bold, dramatic, and proud of your craft, you aim for a spectacular impression every single time. You take your art personally, because to you it is deeply personal."},
  sasori:{name:"Sasori", tag:"The Timeless Craftsman", tier:"cut", glyph:"gear", aura:"#b06a4a", img:null,
    v:[-.75,-.85,.60,-.60], kindred:"orochimaru", rival:"deidara",
    traits:["Meticulous","Patient","Controlled","Detached","Ingenious"],
    desc:"You believe true art lasts forever, and you build with patience most people can't summon. Meticulous and self-contained, you prize control and permanence. Behind the calm exterior runs a mind always engineering the next perfect piece."},
  hidan:{name:"Hidan", tag:"The Undying Zealot", tier:"cut", glyph:"jashin", aura:"#c23a34", img:null,
    v:[.55,-.55,.65,.90], kindred:"deidara", rival:"shikamaru",
    traits:["Fanatical","Loud","Reckless","Fearless","Volatile"],
    desc:"You throw yourself into your beliefs with total, screaming devotion. Loud and reckless, you fear almost nothing and treat pain as part of the ritual. Once you commit to something, you follow it to the bitter end and laugh the whole way there."},
  obito:{name:"Obito Uchiha", tag:"The Man Behind the Mask", tier:"front", glyph:"eye", aura:"#bb4736", img:null,
    v:[-.75,-.75,.90,-.55], kindred:"sasuke", rival:"kakashi",
    traits:["Calculating","Enigmatic","Driven","Complex","Guarded"],
    desc:"You move through the world behind a mask, letting people see only what serves your design. A single loss reshaped your whole path, and you pursue your vision with relentless, patient resolve. Every layer you wear hides a heart that once believed, and in some buried way still does."},
  pain:{name:"Pain (Nagato)", tag:"The Voice of Pain", tier:"front", glyph:"rinne", aura:"#8168cc", img:null,
    v:[-.55,-.30,.95,-.45], kindred:"obito", rival:"naruto",
    traits:["Messianic","Calm","Philosophical","Detached","Resolute"],
    desc:"You carry a grand vision and the cold conviction to see it through. Calm and philosophical, you speak in absolutes about a broken world and your plan to remake it. Every action serves the cause, and you shoulder the weight of that mission with unshakable resolve."},
  madara:{name:"Madara Uchiha", tag:"The Sovereign of War", tier:"front", glyph:"uchiwa", aura:"#a8343e", img:null,
    v:[.35,-.70,1.0,.40], kindred:"obito", rival:"naruto",
    traits:["Arrogant","Powerful","Theatrical","Ambitious","Unyielding"],
    desc:"You command any room through sheer force of presence and refuse to bow to anyone. Overwhelming ambition drives you toward a vision only you can see, delivered with theatrical flair. You measure yourself against legends and fully intend to surpass them all."}
};

/* ---------- questions: weight vector [logos, social, drive, express] ---------- */
const Q = [
  {t:"I make my best calls on a gut feeling and figure out the reasons later.",        w:[ 1, 0, 0, 0]},
  {t:"Before anything big, I've got a plan, a backup plan, and probably a spreadsheet.",                 w:[-1, 0, 0, 0]},
  {t:"My people are my whole world — I'd drop everything the second one of them needed me.",               w:[ 0, 1, 0, 0]},
  {t:"Give me headphones, a closed door, and zero interruptions, and I'm in my element.",                               w:[ 0,-1, 0, 0]},
  {t:"I want to be the best at what I do, and I'm fine with everyone knowing it.",w:[ 0, 0, 1, 0]},
  {t:"My perfect weekend is a comfy couch, great snacks, and absolutely nowhere to be.",                             w:[ 0, 0,-1, 0]},
  {t:"You can read my whole mood off my face before I say a single word.",                   w:[ 0, 0, 0, 1]},
  {t:"I keep my feelings to myself and let very few people past the surface.",                     w:[ 0, 0, 0,-1]},
  {t:"My big goal or someone I love? I'd choose the person every single time.",                   w:[ 0, .6,-.8, 0]},
  {t:"I love making a statement — bold looks, big gestures, a little drama, that's me.",    w:[ 0, 0, .3, .7]}
];
const AXMAX=[2, 2.6, 3.1, 2.7];
const SPECTRA=[
  {l:"Strategy", r:"Instinct"},
  {l:"Lone Wolf", r:"Bonds First"},
  {l:"Protector", r:"Trailblazer"},
  {l:"Reserved", r:"Expressive"}
];

export { G, CHARS, Q, AXMAX, SPECTRA };

/* ---------- emblem renderer ---------- */
let EUID = 0;
export function emblem(ch, size, noSpin, reduceMotion = false) {
  const id = 'e' + (EUID++), a = ch.aura, aL = lighten(a, .4);
  let inner;
  if (ch.img) {
    inner = `<clipPath id="${id}c"><circle cx="110" cy="110" r="72"/></clipPath><image href="${ch.img}" x="38" y="38" width="144" height="144" clip-path="url(#${id}c)" preserveAspectRatio="xMidYMid slice"/>`;
  } else {
    const g = G[ch.glyph](a, aL);
    inner = `<g filter="url(#${id}b)" opacity=".28">${g}</g><g>${g}</g>`;
  }
  const anim = (reduceMotion || noSpin) ? '' : `<animateTransform attributeName="transform" type="rotate" from="0 110 110" to="360 110 110" dur="30s" repeatCount="indefinite"/>`;
  return `<svg class="emblem-svg" viewBox="0 0 220 220" width="${size}" height="${size}" role="img" aria-label="${ch.name} emblem" style="color:${a}">
    <defs>
      <radialGradient id="${id}g" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="${aL}" stop-opacity=".5"/>
        <stop offset="55%" stop-color="${a}" stop-opacity=".1"/>
        <stop offset="100%" stop-color="${a}" stop-opacity="0"/>
      </radialGradient>
      <filter id="${id}b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <circle cx="110" cy="110" r="104" fill="url(#${id}g)"/>
    <circle cx="110" cy="110" r="92" fill="none" stroke="${a}" stroke-width="2" opacity=".45"/>
    <circle cx="110" cy="110" r="84" fill="none" stroke="${a}" stroke-width="4" opacity=".9"/>
    <circle cx="110" cy="110" r="72" fill="none" stroke="${aL}" stroke-width="2" stroke-dasharray="3 10" opacity=".8" style="transform-origin:110px 110px;">${anim}</circle>
    ${inner}
  </svg>`;
}
