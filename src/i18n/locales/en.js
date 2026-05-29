export default {
  nav: {
    home: 'Home',
    about: 'About',
    portfolio: 'Portfolio',
    langZh: '中文',
    langEn: 'English',
  },
  home: {
    tag: 'Resume Site',
    skillDesc: 'Hands-on implementation experience with delivery and optimization.',
  },
  about: {
    title: 'Work Experience',
    subtitle: 'Showcasing impact and growth at each stage.',
  },
  portfolio: {
    title: 'Featured Projects',
    subtitle: 'Highlighting technical depth and product thinking.',
    viewDetail: 'View Project Details',
    backToList: 'Back to Portfolio',
    featureTitle: 'Feature List (Demo)',
    featureSubtitle: 'component demo.',
    demoLabel: 'Component Demo',
    notFoundTitle: 'Project Not Found',
    notFoundSubtitle: 'This project might not exist yet or the link is invalid.',
  },
  liveRoom: {
    matchTitle: 'Championship Play-off Final · May 23, 22:30',
    statusFinished: 'Finished',
    homeTeam: 'Hull City',
    awayTeam: 'Middlesbrough',
    tabChat: 'Chat',
    tabHost: 'Host',
    follow: 'Follow',
    inputPlaceholder: 'Say something...',
    joinHint: 'Fan AijljDKJ joined the live room',
    hostTitle: 'Host Profile',
    hostDesc: 'Provides match analysis, live commentary, and Q&A to help viewers follow the game.',
    you: 'Me',
    messages: [
      { level: 15, user: 'Fan_01', text: 'This match is intense.' },
      { level: 4, user: 'Supporter', text: 'Home defense looks solid.' },
      { level: 35, user: 'Host Assistant', text: 'Welcome to the live room. Please follow chat rules.' },
    ],
  },
  crashGame: {
    tabManual: 'Manual',
    tabAuto: 'Auto',
    betAmount: 'Bet Amount',
    cashOutAt: 'Cash Out At',
    betNext: 'Bet Next Round',
    roundRunning: 'Round in progress…',
    autoCashOutHint: 'Auto cash out at {value}x (set before bet)',
    cashOutNow: 'Cash Out',
    profitOnWin: 'Profit on Win',
    players: 'Players',
    totalWagered: 'Total Wagered',
    networkOk: 'Network OK',
    win: 'Cashed out in time — you won this round!',
    lose: 'Did not cash out in time — you lost this round.',
    crashed: 'Busted',
    crashedAt: 'Crashed at {value}x',
  },
  slideGame: {
    tabManual: 'Manual',
    tabAuto: 'Auto',
    betAmount: 'Bet Amount',
    targetMultiplier: 'Target Multiplier',
    bet: 'Bet',
    enrolled: 'Bet placed — waiting',
    sliding: 'Drawing…',
    profitOnWin: 'Profit on Win',
    bets: 'Bets',
    nextRound: 'Next round in {sec}s',
    inProgress: 'Round in progress…',
    win: 'Landed {value}× — target hit!',
    lose: 'Landed {value}× — below target',
  },
  diceGame: {
    rollLabel: 'Roll Result',
    multiplier: 'Multiplier',
    under: 'Under',
    over: 'Over',
    target: 'Target',
    balance: 'Balance',
    betAmount: 'Bet Amount',
    bet: 'Bet',
    rolling: 'Rolling...',
  },
  resume: {
    profile: {
      name: 'Richard Wang',
      title: 'Frontend Engineer (Vue.js)',
      summary:
        'Frontend engineer with 7-8 years of experience, focused on Vue.js. Experienced in SPA/SSR projects, admin systems, campaign pages, API integration, and team collaboration with Git workflows.',
      location: 'Neihu District, Taipei, Taiwan',
      email: 'richwrc2000@gmail.com',
    },
    skills: [
      'Vue.js (Vue2/Vue3)',
      'JavaScript',
      'jQuery',
      'HTML',
      'CSS / Sass / SCSS',
      'AJAX / HTTP',
      'Element Plus',
      'Git / GitLab / GitHub',
      'Java / JSP / Spring',
      'MySQL / Oracle',
    ],
    experiences: [
      {
        company: 'Daxiang Technology Co., Ltd.',
        role: 'Frontend Engineer',
        period: '2024/02 - 2026/03',
        description:
          'Developed and maintained Vue.js interfaces for management platforms and enterprise features, including API integrations and UI refinement.',
      },
      {
        company: 'Liangneng Network Technology Co., Ltd.',
        role: 'Frontend Engineer',
        period: '2020/02 - 2023/12',
        description:
          'Worked on multiple Vue projects (SPA/SSR), including sports event platforms, admin systems, brand sites, and member-related pages; also supported React maintenance tasks.',
      },
      {
        company: 'Yaqi Network Technology Co., Ltd.',
        role: 'Programmer',
        period: '2017/07 - 2019/12',
        description:
          'Started with Java web stack (Struts/Hibernate/Tomcat/Oracle), then transitioned to frontend development with Vue.js and API integration.',
      },
    ],
    projects: [
      {
        id: 'sports-platform',
        name: 'Online Sports Event Platform',
        intro:
          'Built and maintained event-related frontend modules, including login flows, data views, campaign pages, and interactive components.',
        tech: 'Vue.js / SCSS / API / GitLab',
        features: [
          {
            name: 'Login & Access Control',
            description: 'Handled authentication, role checks, and protected page access.',
            componentKey: 'auth',
          },
          {
            name: 'Table',
            description: 'Implemented filters, sorting, pagination, and status badges.',
            componentKey: 'table',
          },
          {
            name: 'Event Data Listing',
            description: 'Infinite Scroll',
            componentKey: 'list',
          },
          {
            name: 'Live Match Chat Room',
            description: 'Video area on top with realtime chat interaction below.',
            componentKey: 'videoChat',
          },
        ],
      },
      {
        id: 'admin-system',
        name: 'Admin Management System',
        intro:
          'Implemented and maintained common back-office features such as authentication, permissions, data management, and operational workflows.',
        tech: 'Vue.js / Element Plus / SCSS / AJAX',
        features: [
          {
            name: 'Login & Access Control Flow',
            description: 'Manage authenticated routes and role-based feature visibility.',
            componentKey: 'auth',
          },
          {
            name: 'Element Plus Demo Page',
            description: 'Showcase common Element Plus form controls (Input / Select / Button).',
            componentKey: 'element',
          },
          {
            name: 'WebSocket Realtime Demo',
            description: 'Demonstrate connect, receive updates, and disconnect workflow.',
            componentKey: 'websocket',
          },
        ],
      },
      {
        id: 'passkey-platform',
        name: 'Passkey Related Features',
        intro:
          'Contributed to frontend implementation of Passkey-related management features, collaborating closely with backend APIs.',
        tech: 'Vue3 / Element Plus / API',
        features: [
          {
            name: 'Login & Access Control Flow',
            description: 'Control session state and permission-based page access.',
            componentKey: 'auth',
          },
          {
            name: 'Element Plus Demo Page',
            description: 'Sample settings UI with standard Element Plus form patterns.',
            componentKey: 'element',
          },
          {
            name: 'WebSocket Realtime Demo',
            description: 'Simulate realtime verification status updates from backend.',
            componentKey: 'websocket',
          },
        ],
      },
      {
        id: 'game-platform',
        name: 'Game Platform',
        intro:
          'Built frontend modules for an entertainment game platform, including game UI, betting flow, and result display.',
        tech: 'Vue.js / SCSS / WebSocket',
        features: [
          {
            name: 'Dice Mini Game',
            description: 'Simplified Dice game panel with target, over/under, multiplier, and bottom bet action.',
            componentKey: 'diceGame',
          },
          {
            name: 'Crash Mini Game',
            description: 'Simplified Crash UI: bet controls on the left, multiplier chart and history on the right.',
            componentKey: 'crashGame',
          },
          {
            name: 'Slide Mini Game',
            description: 'Simplified Slide: horizontal multiplier tiles, center picker line, and target multiplier check.',
            componentKey: 'slideGame',
          },
        ],
      },
      {
        id: 'corporate-campaign',
        name: 'Corporate & Campaign Websites',
        intro:
          'Developed corporate identity sites and campaign pages with attention to visual quality and interactive user experience.',
        tech: 'Vue.js / jQuery / HTML / CSS / SCSS',
        features: [
          {
            name: 'One-page Website Demo',
            description: 'Single-page layout feature sections.',
            componentKey: 'onepage',
          },
        ],
      },
    ],
  },
}
