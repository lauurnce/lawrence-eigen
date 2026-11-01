/* ============================================================
   HERO GRAPH DATA
   ------------------------------------------------------------
   Everything the hero node graph says lives here, so the content
   can change without touching the component (hero-scene.js).

   Shape: a three-level tree.
     hubs[]                 level 1, the eight spokes around him
       .label               text on the canvas and in the readout
       .hue                 0..360, colours the whole branch on hover
       .children[]          level 2, always labelled on desktop
         .label
         .children[]        level 3, labelled when its parent is
           .label           hovered or tapped

   Branching is uneven on purpose. Leave a `children` out, or leave
   it empty, when a node has nothing beneath it; do not pad.

   crossLinks: pairs of labels from different hubs that belong
   together. They draw as a faint line while either end is hovered
   or selected. Labels must match exactly.

   Keep labels short: they are drawn in 9 to 11px mono beside a dot.
   ============================================================ */
window.HERO_GRAPH = {
  hubs: [
    {
      label: 'Building', hue: 100,
      children: [
        { label: 'I Love Product People', children: [
          { label: '36 outreach messages' },
          { label: '5 validation calls' },
          { label: 'Germany · Spain · US' },
          { label: 'Equity, not hourly' }
        ] },
        { label: 'Problem validation' },
        { label: 'Market sizing', children: [
          { label: 'Bottom-up, not top-down' }
        ] }
      ]
    },
    {
      label: 'Shipping', hue: 200,
      children: [
        { label: 'BSIT Survival Kit', children: [
          { label: 'Next.js + Supabase' },
          { label: 'PayMongo unlocks' },
          { label: 'For PH BSIT students' }
        ] },
        { label: 'Kalinga', children: [
          { label: 'For night-shift BPO agents' },
          { label: 'React Native' }
        ] },
        { label: 'GreenProof', children: [
          { label: 'Stellar Soroban' },
          { label: 'Recycle-to-Earn' }
        ] },
        { label: 'feedy', children: [
          { label: 'Daily dev digest' }
        ] },
        { label: 'Zero to Agent Manila site' }
      ]
    },
    {
      label: 'Teaching', hue: 42,
      children: [
        { label: 'AI at Analog Devices', children: [
          { label: 'Category Managers' },
          { label: 'Operations Buyers' },
          { label: 'Real procurement tasks' }
        ] },
        { label: 'Workshops', children: [
          { label: 'Langflow RAG · 66 people' },
          { label: 'AWS Polar · 60+ people' },
          { label: 'ACM Core VerteX · 50+ people' },
          { label: 'AI Maxxin · 60+ people' }
        ] },
        { label: 'Build Nights', children: [
          { label: 'Amazon Quick' },
          { label: 'Curriculum, Weeks 2 to 5' }
        ] }
      ]
    },
    {
      label: 'Leading', hue: 275,
      children: [
        { label: 'AWS Student Builder Group PUP', children: [
          { label: '1,434 members' },
          { label: 'First student AWS group in PH' }
        ] },
        { label: 'Department of AI', children: [
          { label: '78 associates' },
          { label: 'Zero to intermediate roadmap' },
          { label: '3 speakers, 1 sponsor' }
        ] }
      ]
    },
    {
      label: 'Wins', hue: 350,
      children: [
        { label: 'PH100 2026' },
        { label: 'HABI 4.0', children: [
          { label: '2nd, Health and Well-Being' }
        ] },
        { label: 'Zero Vector Hackathon', children: [
          { label: '3rd Place' }
        ] },
        { label: 'Stellar PH Bootcamp', children: [
          { label: 'Winner' }
        ] },
        { label: 'DataCamp', children: [
          { label: 'Top 1 scholar' }
        ] }
      ]
    },
    {
      label: 'Roots', hue: 240,
      children: [
        { label: 'PUP Sta. Mesa', children: [
          { label: 'BS Information Technology' },
          { label: 'DOST Scholar' }
        ] },
        { label: 'Self-taught', children: [
          { label: 'Zero background' },
          { label: '6 certifications' }
        ] },
        { label: 'Quezon City', children: [
          { label: 'Taglish' }
        ] }
      ]
    },
    {
      label: 'Stories', hue: 24,
      children: [
        { label: 'Film', children: [
          { label: 'Interstellar' },
          { label: 'The Prestige' },
          { label: 'Oppenheimer' }
        ] },
        { label: 'Series', children: [
          { label: 'Loki' },
          { label: 'Moon Knight' },
          { label: 'Prison Break' }
        ] },
        { label: 'Music', children: [
          { label: 'Linkin Park' },
          { label: 'Paramore' },
          { label: 'IV of Spades' }
        ] },
        { label: 'Reading', children: [
          { label: 'The Lean Startup' },
          { label: 'The Hard Thing About Hard Things' },
          { label: 'The SaaS Playbook' }
        ] }
      ]
    },
    {
      label: 'Fuel', hue: 160,
      children: [
        { label: 'Jogging' },
        { label: 'Painting' },
        { label: 'Food', children: [
          { label: 'Sisig' },
          { label: 'Sinigang' }
        ] },
        { label: 'Coffee', children: [
          { label: 'Spanish latte' },
          { label: 'Java chip frappé' }
        ] },
        { label: '7pm onwards' }
      ]
    }
  ],

  crossLinks: [
    ['Problem validation', 'The Lean Startup'],
    ['Kalinga', 'HABI 4.0'],
    ['Build Nights', 'AWS Student Builder Group PUP'],
    ['I Love Product People', 'Zero Vector Hackathon'],
    ['7pm onwards', 'I Love Product People']
  ]
};
