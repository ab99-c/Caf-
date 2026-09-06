"use client";

import { useMemo, useState } from "react";

type Cafe = { id: string; name: string; type: string; rating: number; deliveryMinutes: number; isOpen: boolean };
type Product = { id: string; name: string; description: string; priceMad: number; cafeId: string };

const cafes: Cafe[] = [
  { id: "cafe_1", name: "مزاج كافيه", type: "قهوة مختصة", rating: 4.9, deliveryMinutes: 18, isOpen: true },
  { id: "cafe_2", name: "جلسة", type: "حلويات وقهوة", rating: 4.7, deliveryMinutes: 22, isOpen: true },
  { id: "cafe_3", name: "بُن الصباح", type: "فطور وقهوة", rating: 4.8, deliveryMinutes: 16, isOpen: true },
];

const products: Product[] = [
  { id: "p1", name: "إسبريسو", description: "قهوة مركزة محضرة طازجة", priceMad: 18, cafeId: "cafe_1" },
  { id: "p2", name: "كابتشينو", description: "إسبريسو مع حليب رغوي", priceMad: 24, cafeId: "cafe_1" },
  { id: "p3", name: "لاتيه", description: "قهوة ناعمة بحليب ساخن", priceMad: 26, cafeId: "cafe_1" },
  { id: "p4", name: "تشيز كيك", description: "قطعة يومية طازجة", priceMad: 32, cafeId: "cafe_2" },
  { id: "p5", name: "موكا", description: "قهوة وشوكولاتة", priceMad: 28, cafeId: "cafe_2" },
  { id: "p6", name: "فطور الصباح", description: "فطور خفيف مع مشروب", priceMad: 45, cafeId: "cafe_3" },
];

export default function MvpShell() {
  const [selectedCafe, setSelectedCafe] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [orderMessage, setOrderMessage] = useState("");

  const visibleCafes = cafes.filter((cafe) => `${cafe.name} ${cafe.type}`.includes(search.trim()));
  const selectedProducts = products.filter((product) => product.cafeId === selectedCafe);
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const total = useMemo(() => products.reduce((sum, product) => sum + product.priceMad * (cart[product.id] || 0), 0), [cart]);

  function add(productId: string) {
    setCart((current) => ({ ...current, [productId]: (current[productId] || 0) + 1 }));
    setOrderMessage("");
  }

  function checkout() {
    if (!totalItems) return;
    setOrderMessage(`تم تجهيز الطلب التجريبي بقيمة ${total} د.م — الـAPI جاهز للربط مع قاعدة البيانات.`);
    setCart({});
  }

  return (
    <main className="mvp-shell">
      <header className="mvp-nav">
        <div className="mvp-logo"><span>☕</span><div><b>قهوتي</b><small>Qahwati</small></div></div>
        <div className="mvp-nav-links"><a href="#cafes">المقاهي</a><a href="#how">كيف تعمل</a><a href="#orders">طلباتي</a></div>
        <button className="cart-button" onClick={() => document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" })}>السلة <b>{totalItems}</b></button>
      </header>

      <section className="mvp-hero">
        <div><span className="mvp-badge">MVP · CUSTOMER APP</span><h1>قهوة مزيانة،<br/><strong>بضغطة وحدة.</strong></h1><p>اختار المقهى، شوف الـMenu، زيد للسلة ووجد طلبك. هادي هي تجربة المستخدم؛ أما الهندسة الحقيقية فخدامة من الداخل.</p><div className="mvp-search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="قلب على مقهى أو نوع القهوة..."/></div></div>
        <div className="mvp-hero-card"><span>ORDER FLOW</span><div><b>01</b> اختيار المقهى</div><i>↓</i><div><b>02</b> اختيار المنتجات</div><i>↓</i><div><b>03</b> تأكيد الطلب</div><i>↓</i><div><b>04</b> تتبع الحالة</div></div>
      </section>

      <section className="mvp-section" id="cafes"><div className="section-title"><span>EXPLORE</span><h2>اختار المقهى</h2><p>{visibleCafes.length} مقاهي متاحة حالياً</p></div><div className="cafe-grid">{visibleCafes.map((cafe) => <button className={`cafe-card ${selectedCafe === cafe.id ? "selected" : ""}`} key={cafe.id} onClick={() => setSelectedCafe(cafe.id)}><div className="cafe-image">☕</div><div className="cafe-info"><div><h3>{cafe.name}</h3><span>{cafe.type}</span></div><em>● مفتوح</em><div className="cafe-meta"><span>★ {cafe.rating}</span><span>◷ {cafe.deliveryMinutes} دقيقة</span></div></div></button>)}</div></section>

      {selectedCafe && <section className="mvp-section menu-section"><div className="section-title"><span>MENU</span><h2>{cafes.find((c) => c.id === selectedCafe)?.name}</h2><p>اختار اللي بغيتي وزيدو للسلة</p></div><div className="menu-grid">{selectedProducts.map((product) => <article className="product-card" key={product.id}><div><span className="product-icon">☕</span><h3>{product.name}</h3><p>{product.description}</p></div><footer><b>{product.priceMad} د.م</b><button onClick={() => add(product.id)}>+ زيد</button></footer></article>)}</div></section>}

      <section className="mvp-section" id="cart"><div className="section-title"><span>CART & CHECKOUT</span><h2>السلة ديالك</h2><p>Checkout بسيط في الـMVP وقابل للربط مع Payment Provider</p></div><div className="cart-panel"><div>{totalItems ? products.filter((p) => cart[p.id]).map((p) => <div className="cart-row" key={p.id}><span>{p.name} × {cart[p.id]}</span><b>{p.priceMad * cart[p.id]} د.م</b></div>) : <div className="empty-cart">السلة خاوية — اختار شي منتج من Menu.</div>}</div><div className="cart-total"><span>المجموع</span><strong>{total} د.م</strong><button disabled={!totalItems} onClick={checkout}>تأكيد الطلب</button></div></div>{orderMessage && <div className="success-message">✓ {orderMessage}</div>}</section>

      <section className="mvp-how" id="how"><div><span>MVP EXPERIENCE</span><h2>واجهة بسيطة للمستخدم.<br/>هندسة قوية من الداخل.</h2></div><div className="how-grid"><div><b>01</b><h3>Web / Mobile</h3><p>نفس الـbackend يمكن للويب والموبايل استعماله.</p></div><div><b>02</b><h3>API First</h3><p>الـbusiness logic ماشي مربوط بالواجهة.</p></div><div><b>03</b><h3>Secure Roles</h3><p>Customer، Café Staff وAdmin بصلاحيات منفصلة.</p></div></div></section>
    </main>
  );
}
