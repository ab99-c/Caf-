import Link from "next/link";

const cafes = [
  { name: "مزاج كافيه", type: "قهوة مختصة", rating: 4.9, time: 18 },
  { name: "جلسة", type: "حلويات وقهوة", rating: 4.7, time: 22 },
  { name: "بُن الصباح", type: "فطور وقهوة", rating: 4.8, time: 16 },
];

export default function Home() {
  return <main className="container">
    <nav className="nav"><div className="brand">☕ قهوتي</div><span className="badge">Full‑Stack v2</span></nav>
    <section className="hero"><h1>قهوتك المفضلة،<br/>في مكان واحد.</h1><p>منصة قهوتي كتجمع المقاهي، المنيو، الطلبات والإدارة في نظام واحد. هادي هي النسخة الجديدة المبنية كـ Full‑Stack.</p><Link className="btn" href="/api/cafes">تجربة API المقاهي</Link></section>
    <section><h2>مقاهي مقترحة</h2><div className="grid">{cafes.map(c=><article className="card" key={c.name}><div>☕</div><h3>{c.name}</h3><div className="muted">{c.type}</div><p>⭐ {c.rating} · ⏱️ {c.time} دقيقة</p><button className="btn">عرض المنيو</button></article>)}</div></section>
    <section className="api"><h2>Backend جاهز</h2><p>أول API في المشروع:</p><code>GET /api/cafes</code><p>المرحلة التالية: PostgreSQL + Prisma + تسجيل الدخول + الطلبات + Dashboard.</p></section>
  </main>;
}