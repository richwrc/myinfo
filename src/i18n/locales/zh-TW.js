export default {
  nav: {
    home: '首頁',
    about: '自我介紹',
    portfolio: '作品集',
    langZh: '中文',
    langEn: 'English',
  },
  home: {
    tag: '104 風格履歷網站',
    skillDesc: '具備實務經驗，可獨立完成開發與優化。',
    skillDesc2: '具備實務經驗',
  },
  about: {
    title: '工作經歷',
    subtitle: '清楚呈現每個階段的價值與成長。',
  },
  portfolio: {
    title: '精選作品',
    subtitle: '以專案成果展示技術深度與設計思維。',
    viewDetail: '查看作品內容',
    backToList: '返回作品列表',
    featureTitle: '功能列表（範例）',
    featureSubtitle: '以下為對應元件展示',
    demoLabel: 'Component Demo',
    notFoundTitle: '找不到這個作品',
    notFoundSubtitle: '此作品可能尚未建立或連結有誤。',
  },
  resume: {
    profile: {
      name: '王律程 Richard',
      title: '前端工程師（Vue.js）',
      summary:
        '具 7-8 年前端開發經驗，長期以 Vue.js 為核心，熟悉 SPA/SSR、後台系統、活動頁與 API 串接，並具備 Git 協作與跨團隊開發經驗。',
      location: '台灣，台北市內湖區',
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
        company: '大極科技股份有限公司',
        role: '前端工程師',
        period: '2024/02 - 2026/03',
        description: '參與管理後台與企業相關平台前端開發，負責 Vue.js 畫面建置、功能調整與 API 串接。',
      },
      {
        company: '量算網路科技股份有限公司',
        role: '前端工程師',
        period: '2020/02 - 2023/12',
        description:
          '負責多個 Vue 專案（SPA/SSR），包含賽事平台、後台管理、公司形象網站與會員功能頁面，並曾支援 React 專案維護。',
      },
      {
        company: '樂奇網路科技股份有限公司',
        role: '程式設計師',
        period: '2017/07 - 2019/12',
        description:
          '初期以 Java Web（Struts/Hibernate/Tomcat/Oracle）為主，後期轉向前端開發，使用 Vue.js 與 API 整合。',
      },
    ],
    projects: [
      {
        id: 'sports-platform',
        name: '線上賽事平台',
        intro: '參與賽事相關前台與後台功能開發，負責登入、資料查詢、活動頁與互動元件調整。',
        tech: 'Vue.js / SCSS / API / GitLab',
        features: [
          {
            name: '登入與權限流程',
            description: '管理登入驗證、角色權限與頁面保護。',
            componentKey: 'auth',
          },
          {
            name: 'Table後台範例',
            description: '支援篩選、排序、分頁與欄位狀態顯示。',
            componentKey: 'table',
          },
          {
            name: '賽事資料列表',
            description: '無限滾動列表',
            componentKey: 'list',
          },
        ],
      },
      {
        id: 'admin-system',
        name: '後台管理系統（多模組）',
        intro: '開發與維護後台常用功能，如登入、權限、資料管理與流程頁面，提升內部管理效率。',
        tech: 'Vue.js / Element Plus / SCSS / AJAX',
        features: [
          {
            name: '登入與權限流程',
            description: '以路由守衛與角色控管管理登入後可見頁面與操作權限。',
            componentKey: 'auth',
          },
          {
            name: 'Element Plus Demo 頁面',
            description: '示範 Element Plus 常見表單元件組合（Input / Select / Button）。',
            componentKey: 'element',
          },
          {
            name: 'WebSocket 即時推播 Demo',
            description: '展示建立連線、接收訊息、斷線等基本即時資料流程。',
            componentKey: 'websocket',
          },
        ],
      },
      {
        id: 'passkey-platform',
        name: 'Passkey 相關平台功能',
        intro: '協助 Passkey 相關管理功能前端開發，與後端協作完成流程與資料串接。',
        tech: 'Vue3 / Element Plus / API',
        features: [
          {
            name: '登入與權限流程',
            description: '搭配身份驗證流程控管使用者登入狀態與頁面存取權限。',
            componentKey: 'auth',
          },
          {
            name: 'Element Plus Demo 頁面',
            description: '示範設定頁常見欄位與動作按鈕配置。',
            componentKey: 'element',
          },
          {
            name: 'WebSocket 即時推播 Demo',
            description: '模擬驗證狀態即時更新與推播提示流程。',
            componentKey: 'websocket',
          },
        ],
      },
      {
        id: 'corporate-campaign',
        name: '公司形象與活動頁',
        intro: '製作公司形象網站與活動頁，兼顧視覺呈現與互動效果，支援多品牌專案需求。',
        tech: 'Vue.js / jQuery / HTML / CSS / SCSS',
        features: [
          {
            name: '一頁式網站範例',
            description: '展示特色區塊頁單頁版型。',
            componentKey: 'onepage',
          },
        ],
      },
    ],
  },
}
