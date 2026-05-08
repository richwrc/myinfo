export default {
  nav: {
    home: 'Home',
    about: 'About',
    portfolio: 'Portfolio',
    langZh: '中文',
    langEn: 'English',
  },
  home: {
    tag: '104-style Resume Site',
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
