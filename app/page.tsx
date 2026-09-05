const services=[
  ["01","Architecture & Design","هندسة نظام قابل للتوسع: Web، Mobile، API، قاعدة البيانات والخدمات."],
  ["02","Cloud & DevOps","CI/CD، بيئات Preview وProduction، نشر مستمر ومراقبة الإصدارات."],
  ["03","Security Engineering","RBAC، عزل بيانات المقاهي، validation، security headers وسجلات التدقيق."],
  ["04","Backend & APIs","APIs منظمة وقابلة للإصدار، business logic، orders وpayments بطريقة آمنة."],
  ["05","Data Engineering","PostgreSQL + Prisma، تصميم العلاقات، النسخ الاحتياطي واسترجاع البيانات."],
  ["06","Quality Engineering","Automated QA، type safety، build checks واختبارات قبل Production."],
  ["07","Observability","Health checks، logs، metrics والتنبيه على مشاكل الأداء والخدمات."],
  ["08","Multi-tenant SaaS","بنية تسمح بإضافة عدد كبير من المقاهي مع فصل بيانات كل tenant."],
  ["09","Product Engineering","تحويل الفكرة من MVP إلى منتج SaaS عملي، سريع وسهل الاستعمال."],
  ["10","Enterprise Readiness","حوكمة، disaster recovery، auditability وخطة توسع نحو العقود الكبيرة."],
];

const stack=["Next.js","TypeScript","React","Node.js","PostgreSQL","Prisma","REST API","Vercel","GitHub CI/CD","RBAC"];

export default function Home(){return <main className="shell">
  <nav className="nav"><div className="brand">☕ قهوتي <span>Qahwati Engineering</span></div><div className="nav-links"><a href="#services">الخدمات</a><a href="#architecture">Architecture</a><a href="#roadmap">Roadmap</a><a href="/api/health">Health</a></div><div className="status"><i/> Engineering Platform</div></nav>

  <section className="hero" id="architecture"><div className="hero-copy"><div className="kicker">SOFTWARE ENGINEERING · QAHWATI</div><h1>من MVP إلى<br/><strong>Software Platform.</strong></h1><p>هنا قهوتي ماشي غير موقع ديال القهوة. هادي منصة هندسة برمجيات كنطوروها بمعمارية احترافية: Frontend، Backend، APIs، Data، Security، Cloud وCI/CD.</p><div className="actions"><a className="btn" href="#services">الخدمات الهندسية ↓</a><a className="ghost" href="#roadmap">شوف الـRoadmap</a></div><div className="stack">{stack.map(x=><span key={x}>{x}</span>)}</div></div><div className="architecture"><div className="arch-title">ENGINEERING ARCHITECTURE <b>v2</b></div><div className="layers"><span>Customer / Café / Admin</span><b>↓</b><span>Next.js Web + Mobile</span><b>↓</b><span>Versioned API · Auth · RBAC</span><b>↓</b><span>Services · Validation · Audit</span><b>↓</b><span>PostgreSQL · Prisma · Backups</span></div><div className="arch-foot"><span>● API Ready</span><span>● Cloud Ready</span><span>● Secure by Design</span></div></div></section>

  <section className="metrics"><div><b>10</b><span>Engineering pillars</span></div><div><b>3</b><span>Core roles</span></div><div><b>6</b><span>Order lifecycle states</span></div><div><b>24/7</b><span>Ready for observability</span></div></section>

  <section className="section" id="services"><div className="heading"><div><div className="kicker">Software engineering services</div><h2>هندسة الخدمة من الداخل</h2></div><p>نفس الفكرة ديال الصورة: 10 technical pillars، ولكن مطبقة على قهوتي وبشكل حقيقي داخل الـsoftware architecture.</p></div><div className="pillar-grid">{services.map(([n,t,d])=><article className="pillar" key={n}><div className="num">{n}</div><div><h3>{t}</h3><p>{d}</p></div></article>)}</div></section>

  <section className="section roadmap" id="roadmap"><div className="heading"><div><div className="kicker">MVP → Enterprise</div><h2>Roadmap هندسة البرمجيات</h2></div><p>كل مرحلة كتزيد قدرة النظام، الأمان، الجودة والاستعداد للتوسع.</p></div><div className="steps"><div><b>01</b><h3>Foundation</h3><p>Architecture · Auth · RBAC · Multi-tenant · PostgreSQL</p></div><div><b>02</b><h3>Scale</h3><p>Café dashboard · Orders · Inventory · Analytics · APIs</p></div><div><b>03</b><h3>Enterprise</h3><p>Audit · Backups · Observability · Automated QA · DR</p></div></div></section>

  <section className="engineering-note"><div><div className="kicker">ENGINEERING PRINCIPLE</div><h2>نبنيو الخدمة باش تكبر، ماشي غير باش تخدم اليوم.</h2><p>كل feature جديدة خاصها تدخل وسط architecture واضحة، permissions صحيحة، data isolation، monitoring وquality gates.</p></div><a className="btn" href="/api/v1/cafes">Test API →</a></section>

  <footer><div className="brand">☕ قهوتي <span>Qahwati Engineering</span></div><p>Built to scale. Engineered for tomorrow.</p><small>© 2026 Qahwati Software Engineering Platform</small></footer>
</main>}