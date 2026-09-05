const pillars=[
  ["01","Multi-tenancy","كل مقهى معزول ببياناته وصلاحياته."],
  ["02","Zero-downtime","نشر مستمر عبر GitHub → Vercel مع أقل توقف ممكن."],
  ["03","SOC 2 ready","سجلات تدقيق، أسرار خارج الكود، وضوابط أمنية قابلة للتوسع."],
  ["04","RBAC","Customer / Cafe Staff / Admin بصلاحيات واضحة."],
  ["05","Disaster Recovery","قاعدة بيانات PostgreSQL قابلة للنسخ الاحتياطي والاسترجاع."],
  ["06","Security Governance","Headers أمنية، تحقق من المدخلات، وHealth checks."],
  ["07","Scalable Architecture","Next.js + API + Prisma مصممة للتوسع."],
  ["08","Observability","Health endpoint وإشارات جاهزة للمراقبة والتنبيه."],
  ["09","Versioned API","واجهات API منظمة تحت /api/v1."],
  ["10","Automated QA","بوابة CI للبناء والتحقق قبل الإنتاج."],
];

export default function Home(){return <main className="shell">
  <nav className="nav"><div className="brand">☕ قهوتي <span>Qahwati</span></div><div className="nav-links"><a href="#platform">المنصة</a><a href="#pillars">Enterprise</a><a href="/api/health">Health</a></div><div className="status"><i/> Production-ready foundation</div></nav>
  <section className="hero" id="platform"><div><div className="kicker">Qahwati Platform · v2</div><h1>من MVP إلى<br/><strong>منصة Enterprise.</strong></h1><p>نبني قهوتي كمنصة SaaS حقيقية للمقاهي: عزل البيانات، صلاحيات دقيقة، API قابلة للتوسع، مراقبة، أمان، ونشر مستمر.</p><div className="actions"><a className="btn" href="#pillars">شاهد المعمارية ↓</a><a className="ghost" href="/api/v1/cafes">جرب API</a></div></div><div className="architecture"><div className="arch-title">PLATFORM HEALTH <b>99.9%</b></div><div className="layers"><span>Customer App</span><b>↓</b><span>Next.js Web + Mobile API</span><b>↓</b><span>RBAC · Validation · Audit</span><b>↓</b><span>PostgreSQL + Prisma</span></div><div className="arch-foot"><span>● API Online</span><span>● Database Ready</span></div></div></section>
  <section className="metrics"><div><b>10</b><span>Technical pillars</span></div><div><b>3</b><span>Access roles</span></div><div><b>6</b><span>Order states</span></div><div><b>∞</b><span>Scalable tenants</span></div></section>
  <section className="section" id="pillars"><div className="heading"><div><div className="kicker">Enterprise roadmap</div><h2>10 أعمدة تقنية</h2></div><p>الهدف ليس فقط أن يعمل الموقع؛ الهدف أن يكون أساساً يمكنه تحمل النمو والعقود الكبيرة.</p></div><div className="pillar-grid">{pillars.map(([n,t,d])=><article className="pillar" key={n}><div className="num">{n}</div><div><h3>{t}</h3><p>{d}</p></div></article>)}</div></section>
  <section className="section roadmap"><div className="heading"><div className="kicker">Delivery plan</div><h2>من الآن إلى Production</h2></div><div className="steps"><div><b>01</b><h3>Foundation</h3><p>Auth · RBAC · Multi-tenant · PostgreSQL · Prisma</p></div><div><b>02</b><h3>Operations</h3><p>Café dashboard · Orders · Inventory · Analytics</p></div><div><b>03</b><h3>Enterprise</h3><p>Audit logs · Backups · Observability · Automated QA</p></div></div></section>
  <footer><div className="brand">☕ قهوتي <span>Qahwati</span></div><p>Built to scale. Ready for tomorrow.</p><small>© 2026 Qahwati Platform</small></footer>
</main>}