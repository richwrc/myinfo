<template>
  <div class="onepage-demo">
    <header class="demo-nav">
      <div class="demo-nav__brand">Ｄemo</div>
      <nav>
        <a href="#">服務項目</a>
        <a href="#">聯絡我們</a>
      </nav>
    </header>

    <section class="hero">
      <div class="hero__overlay">
        <p class="hero__tag">企業形象官網範例</p>
        <h2>神級團隊，您最能信任的好夥伴</h2>
        <p>我們追求卓越與創新，提供穩定、可維護的網站與系統服務，陪伴企業長期成長。</p>
      </div>
    </section>

    <section class="service service--left">
      <div class="service__visual service__visual--backup"></div>
      <div class="service__content">
        <h3>Backup</h3>
        <small>贏得信任</small>
        <h4>程式代碼保險箱</h4>
        <p>提供原始碼備份與版本管理機制，避免人力異動造成服務中斷風險。</p>
      </div>
    </section>

    <section class="service service--right">
      <div class="service__visual service__visual--oem"></div>
      <div class="service__content">
        <h3>OEM</h3>
        <small>專業團隊</small>
        <h4>原代碼委託維護</h4>
        <p>在原團隊人力短缺時提供持續維護，協助系統穩定營運並快速迭代。</p>
      </div>
    </section>

    <section class="why">
      <h3>為什麼要選擇我們？</h3>
      <p>因為我們深知：唯有相信團隊、相信專業，才能共創長期價值與穩定成果。</p>
    </section>

    <footer class="contact">
      <div>聯絡我們：service@demo.com</div>
      <div>台北市信義區範例路 100 號</div>
    </footer>
  </div>
</template>

<style scoped>
.onepage-demo {
  margin-top: 12px;
  background: #030712;
  color: #f8fafc;
  border-radius: 12px;
  width: 100%;
  height: 560px;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #1f2937;
  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.45);
  scrollbar-width: thin;
  scrollbar-color: #334155 #0b1220;
}

.onepage-demo::-webkit-scrollbar {
  width: 8px;
}

.onepage-demo::-webkit-scrollbar-track {
  background: #0b1220;
}

.onepage-demo::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 999px;
}

.demo-nav {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: rgba(17, 24, 39, 0.86);
  backdrop-filter: blur(6px);
}

.demo-nav__brand {
  font-weight: 800;
  letter-spacing: 1px;
}

.demo-nav nav {
  display: flex;
  gap: 14px;
}

.demo-nav a {
  color: #e2e8f0;
  font-size: 13px;
}

.hero {
  min-height: 300px;
  background:
    radial-gradient(circle at 68% 22%, rgba(250, 204, 21, 0.42), transparent 38%),
    radial-gradient(circle at 28% 30%, rgba(59, 130, 246, 0.44), transparent 40%),
    linear-gradient(180deg, #0b1020 0%, #020617 100%);
  display: grid;
  align-items: end;
}

.hero__overlay {
  padding: 20px 16px 26px;
  max-width: 640px;
}

.hero__tag {
  margin: 0 0 8px;
  color: #93c5fd;
  font-size: 13px;
}

.hero h2 {
  margin: 0 0 10px;
  font-size: 2rem;
  line-height: 1.2;
}

.hero p {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.6;
}

.service {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
}

.service--right .service__visual {
  order: 2;
}
.service--right .service__content {
  order: 1;
}

.service__visual {
  min-height: 180px;
}

.service__visual--backup {
  background:
    radial-gradient(circle at 22% 40%, rgba(148, 163, 184, 0.36), transparent 40%),
    linear-gradient(135deg, #111827, #0f172a);
}

.service__visual--oem {
  background:
    radial-gradient(circle at 80% 30%, rgba(14, 165, 233, 0.34), transparent 42%),
    linear-gradient(135deg, #1f2937, #111827);
}

.service__content {
  padding: 16px;
}

.service__content h3 {
  margin: 0;
  font-size: 2rem;
}

.service__content small {
  color: #94a3b8;
}

.service__content h4 {
  margin: 8px 0 8px;
  font-size: 1.55rem;
}

.service__content p {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.6;
}

.why {
  padding: 18px 16px;
  background:
    radial-gradient(circle at 78% 30%, rgba(37, 99, 235, 0.26), transparent 38%),
    linear-gradient(180deg, #0f172a, #111827);
}

.why h3 {
  margin: 0 0 8px;
  font-size: 1.7rem;
}

.why p {
  margin: 0;
  color: #cbd5e1;
}

.contact {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: linear-gradient(180deg, #0b1220, #020617);
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  color: #cbd5e1;
  font-size: 13px;
}

@media (max-width: 760px) {
  .onepage-demo {
    height: 500px;
  }

  .service {
    grid-template-columns: 1fr;
  }

  .service--right .service__visual,
  .service--right .service__content {
    order: initial;
  }

  .hero h2 {
    font-size: 1.55rem;
  }

  .service__content h3 {
    font-size: 1.6rem;
  }

  .service__content h4 {
    font-size: 1.25rem;
  }
}
</style>
