"use client";

import React, { useState, useMemo } from "react";

export interface CafeItem {
  id: string;
  name: string;
  type: string;
  rating: number;
  deliveryMinutes: number;
  isOpen: boolean;
  ice: string;
  address: string;
  image: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  priceMad: number;
  cafeId: string;
  image: string;
  calories?: string;
}

export interface CreatedOrder {
  id: string;
  invoiceNumber: number;
  items: { name: string; quantity: number; price: number }[];
  subtotalHt: number;
  vatMad: number;
  totalTtc: number;
  paymentMethod: string;
  status: "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED";
  createdAt: string;
  cafeIce: string;
  cafeName: string;
}

const DEMO_CAFES: CafeItem[] = [
  {
    id: "cafe_demo",
    name: "مقهى ومحمصة الأصالة",
    type: "قهوة مختصة ومخبوزات فاخرة",
    rating: 4.9,
    deliveryMinutes: 15,
    isOpen: true,
    ice: "001234567000089",
    address: "شارع المسيرة الخضراء، كازابلانكا",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cafe_2",
    name: "جلسة كافيه & برانش",
    type: "حلويات فرنسية وفطور مغربي",
    rating: 4.8,
    deliveryMinutes: 20,
    isOpen: true,
    ice: "002987654000031",
    address: "حي النخيل، الرباط",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "cafe_3",
    name: "بُن الصباح Roastery",
    type: "إسبريسو بار وحبوب محمصة طازجة",
    rating: 4.7,
    deliveryMinutes: 18,
    isOpen: true,
    ice: "003112233000045",
    address: "طريق السواني، طنجة",
    image: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80",
  },
];

const DEMO_PRODUCTS: MenuItem[] = [
  {
    id: "p_espresso",
    name: "إسبريسو سينغل أوريجين",
    category: "قهوة مختصة",
    description: "حبوب بن إثيوبية يرقاتشيفي محمصة محلياً بنفحات الزهور والحمضيات اللطيفة",
    priceMad: 15,
    cafeId: "cafe_demo",
    calories: "5 سعرة",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p_nss",
    name: "قهوة نص-نص تقليدية",
    category: "مشروبات بالحليب",
    description: "القهوة المغربية الأصيلة، توازن مثالي بين الإسبريسو المركّز والحليب الساخن الرغوي",
    priceMad: 16,
    cafeId: "cafe_demo",
    calories: "75 سعرة",
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p_cappuccino",
    name: "كابتشينو كراميل مخملي",
    category: "مشروبات بالحليب",
    description: "إسبريسو مزدوج مع رغوة حليب ميكروية ورسمة باريستا احترافية",
    priceMad: 24,
    cafeId: "cafe_demo",
    calories: "120 سعرة",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p_croissant",
    name: "كرواسون زبدة فرنسي طازج",
    category: "مخبوزات وحلويات",
    description: "مخبوز يومياً بطبقات هشة ومقرمشة ومحضر بالزبدة الطبيعية 100%",
    priceMad: 12,
    cafeId: "cafe_demo",
    calories: "240 سعرة",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p_v60",
    name: "قهوة مقطرة V60 Pour-over",
    category: "قهوة مختصة",
    description: "تقطير يدوي دقيق يبرز حلاوة القهوة ونقاء الإيحاءات الطبيعية",
    priceMad: 26,
    cafeId: "cafe_demo",
    calories: "2 سعرة",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p_iced_latte",
    name: "آيسد لاتيه بالفانيليا الطبيعية",
    category: "مشروبات باردة",
    description: "إسبريسو مثلج مع حليب بارد ولمسة شراب فانيليا طبيعي مدغشقري",
    priceMad: 28,
    cafeId: "cafe_demo",
    calories: "140 سعرة",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
  },
];

interface CustomerViewProps {
  onOrderCreated?: (order: CreatedOrder) => void;
}

export default function CustomerView({ onOrderCreated }: CustomerViewProps) {
  const [selectedCafeId, setSelectedCafeId] = useState<string>("cafe_demo");
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [cart, setCart] = useState<Record<string, number>>({
    p_espresso: 1,
    p_croissant: 1,
  });
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "APP">("CASH");
  const [diningOption, setDiningOption] = useState<"TAKEAWAY" | "DINE_IN" | "DELIVERY">("DINE_IN");
  const [lastOrder, setLastOrder] = useState<CreatedOrder | null>(null);
  const [invoiceCounter, setInvoiceCounter] = useState(1048);

  const selectedCafe = useMemo(
    () => DEMO_CAFES.find((c) => c.id === selectedCafeId) || DEMO_CAFES[0],
    [selectedCafeId]
  );

  const categories = ["الكل", "قهوة مختصة", "مشروبات بالحليب", "مشروبات باردة", "مخبوزات وحلويات"];

  const filteredProducts = useMemo(() => {
    return DEMO_PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === "الكل" || p.category === selectedCategory;
      const matchSearch =
        p.name.includes(search.trim()) || p.description.includes(search.trim());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, search]);

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  // Moroccan VAT calculation: 10% VAT
  const totalTtc = useMemo(() => {
    return DEMO_PRODUCTS.reduce((sum, p) => sum + p.priceMad * (cart[p.id] || 0), 0);
  }, [cart]);

  // HT = TTC / 1.10
  const subtotalHt = Math.round((totalTtc / 1.1) * 100) / 100;
  const vatMad = Math.round((totalTtc - subtotalHt) * 100) / 100;

  function addToCart(productId: string) {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  }

  function removeFromCart(productId: string) {
    setCart((prev) => {
      const next = { ...prev };
      if (next[productId] > 1) {
        next[productId] -= 1;
      } else {
        delete next[productId];
      }
      return next;
    });
  }

  function handleCheckout() {
    if (totalItems === 0) return;

    const newInvoiceNumber = invoiceCounter + 1;
    setInvoiceCounter(newInvoiceNumber);

    const itemsSummary = DEMO_PRODUCTS.filter((p) => cart[p.id]).map((p) => ({
      name: p.name,
      quantity: cart[p.id],
      price: p.priceMad,
    }));

    const orderRecord: CreatedOrder = {
      id: `CMD-${Date.now().toString().slice(-5)}`,
      invoiceNumber: newInvoiceNumber,
      items: itemsSummary,
      subtotalHt,
      vatMad,
      totalTtc,
      paymentMethod,
      status: "CONFIRMED",
      createdAt: new Date().toLocaleTimeString("ar-MA", { hour: "2-digit", minute: "2-digit" }),
      cafeIce: selectedCafe.ice,
      cafeName: selectedCafe.name,
    };

    setLastOrder(orderRecord);
    if (onOrderCreated) {
      onOrderCreated(orderRecord);
    }
    setCart({});
  }

  return (
    <div className="customer-view">
      {/* Banner */}
      <div className="role-banner">
        <div className="role-banner-content">
          <h2>بوابة الزبون — استكشف، اطلب وتتبع قهوتك</h2>
          <p>
            اختر أفضل المقاهي المحمية بالفوترة المغربية القانونية (ICE & TVA 10%). استمتع بقهوتك
            المفضلة واستلم فاتورتك الإلكترونية المعتمدة فورياً.
          </p>
        </div>
        <div className="role-banner-badge">☕ تجربة زبون راقية وسلسة</div>
      </div>

      {/* Customer Hero Banner */}
      <div className="customer-hero">
        <div>
          <h2>
            قهوتك المفضلة، <span>محضرة بإتقان.</span>
          </h2>
          <p>
            تصفح قائمة المقهى، أضف طلباتك للسلة واستمتع بقهوة طازجة مع فاتورة إلكترونية مطابقة
            للمعايير الضريبية المغربية في ثوانٍ.
          </p>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="ابحث عن قهوة، إفطار، حلويات أو مقهى..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="hero-feature-card">
          <h4>✨ مميزات الطلب عبر منصة قهوتي</h4>
          <div className="hero-steps">
            <div className="hero-step-item">
              <span className="step-num">1</span>
              <span>مقاهي معتمدة برقم ICE وسجل تجاري نظامي</span>
            </div>
            <div className="hero-step-item">
              <span className="step-num">2</span>
              <span>فاتورة إلكترونية قانونية تتضمن الضريبة (10% TVA)</span>
            </div>
            <div className="hero-step-item">
              <span className="step-num">3</span>
              <span>دفع مرن: نقداً بالدرهم، بالبطاقة البنكية أو أونلاين</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Cafe Selection Section */}
      <div className="q-section-header">
        <div>
          <h3>🏪 اختر المقهى المفضل</h3>
          <p>مقاهي مختارة بعناية توفر تجربة متميزة وجودة عالية</p>
        </div>
        <span style={{ fontSize: "13px", color: "var(--caramel-gold)", fontWeight: 700 }}>
          3 مقاهي متاحة في منطقتك
        </span>
      </div>

      <div className="cafes-grid">
        {DEMO_CAFES.map((cafe) => {
          const isSelected = cafe.id === selectedCafeId;
          return (
            <div
              key={cafe.id}
              className={`cafe-card ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedCafeId(cafe.id)}
            >
              <div
                className="cafe-card-image"
                style={{ backgroundImage: `url(${cafe.image})` }}
              >
                <span className="cafe-status-badge">● مفتوح للطلب</span>
                <span className="cafe-ice-badge">ICE: {cafe.ice}</span>
              </div>
              <div className="cafe-card-body">
                <div>
                  <div className="cafe-card-title">
                    <h4>{cafe.name}</h4>
                    <span className="cafe-rating">★ {cafe.rating}</span>
                  </div>
                  <div className="cafe-type">{cafe.type}</div>
                </div>
                <div className="cafe-meta">
                  <span>📍 {cafe.address}</span>
                  <span>⏱️ {cafe.deliveryMinutes} دقيقة</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Interactive Products Menu Section */}
      <div className="q-section-header">
        <div>
          <h3>☕ قائمة مشروبات ومأكولات — {selectedCafe.name}</h3>
          <p>اختر ما يناسب ذوقك وأضفه مباشرة إلى سلة المشتريات</p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-pill ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredProducts.map((p) => {
          const inCartQty = cart[p.id] || 0;
          return (
            <div key={p.id} className="product-card">
              <div
                className="product-image"
                style={{ backgroundImage: `url(${p.image})` }}
              >
                {p.calories && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      background: "rgba(0,0,0,0.65)",
                      color: "#fff",
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    🔥 {p.calories}
                  </span>
                )}
              </div>
              <div className="product-body">
                <div>
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                </div>
                <div className="product-footer">
                  <div className="product-price">
                    {p.priceMad} <small>د.م (TTC)</small>
                  </div>
                  {inCartQty > 0 ? (
                    <div className="cart-item-qty">
                      <button className="qty-btn" onClick={() => removeFromCart(p.id)}>
                        -
                      </button>
                      <span style={{ fontWeight: 800, fontSize: "14px" }}>{inCartQty}</span>
                      <button className="qty-btn" onClick={() => addToCart(p.id)}>
                        +
                      </button>
                    </div>
                  ) : (
                    <button className="btn-add" onClick={() => addToCart(p.id)}>
                      + أضف للسلة
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Cart & Checkout Section */}
      <div className="q-section-header" id="cart-section">
        <div>
          <h3>🛒 السلة وإتمام الطلب القانوني</h3>
          <p>حساب دقيق للضريبة على القيمة المضافة (10% TVA) وإصدار فوري للفاتورة</p>
        </div>
      </div>

      <div className="cart-layout">
        {/* Cart items list */}
        <div className="cart-items-panel">
          <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px" }}>
            عناصر الطلب ({totalItems} قطع)
          </h4>

          {totalItems === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>☕</div>
              <p>السلة فارغة حالياً. اختر منتجاتك من القائمة أعلاه!</p>
            </div>
          ) : (
            DEMO_PRODUCTS.filter((p) => cart[p.id]).map((p) => (
              <div key={p.id} className="cart-item-row">
                <div className="cart-item-info">
                  <h5>{p.name}</h5>
                  <span>
                    {p.priceMad} د.م للقطعة · شامل الضريبة
                  </span>
                </div>
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => removeFromCart(p.id)}>
                    -
                  </button>
                  <span style={{ fontWeight: 900, minWidth: "20px", textAlign: "center" }}>
                    {cart[p.id]}
                  </span>
                  <button className="qty-btn" onClick={() => addToCart(p.id)}>
                    +
                  </button>
                </div>
                <div className="cart-item-price">{p.priceMad * cart[p.id]} د.م</div>
              </div>
            ))
          )}

          {/* Dining / Delivery Options */}
          <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #eee" }}>
            <label style={{ fontSize: "13px", fontWeight: 800, color: "var(--primary-espresso)" }}>
              نوع الطلب:
            </label>
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              {[
                { id: "DINE_IN", label: "🍽️ داخل المقهى" },
                { id: "TAKEAWAY", label: "🛍️ أخذ خارجي (Emporter)" },
                { id: "DELIVERY", label: "🛵 توصيل سريع" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDiningOption(opt.id as any)}
                  className={`cat-pill ${diningOption === opt.id ? "active" : ""}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Summary & Legal Invoicing */}
        <div className="cart-summary-panel">
          <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px" }}>
            ملخص الفاتورة القانونية
          </h4>

          <div className="summary-row">
            <span>المجموع بدون ضريبة (HT):</span>
            <b>{subtotalHt.toFixed(2)} د.م</b>
          </div>

          <div className="summary-row">
            <span>
              ضريبة القيمة المضافة (TVA 10%):
              <span className="summary-vat-tag" style={{ marginRight: "6px" }}>
                قانون المالية المغربي
              </span>
            </span>
            <b>{vatMad.toFixed(2)} د.م</b>
          </div>

          <div className="summary-row total">
            <span>المجموع الإجمالي (TTC):</span>
            <b style={{ color: "var(--caramel-gold)" }}>{totalTtc} د.م</b>
          </div>

          {/* Payment Method */}
          <div style={{ marginTop: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: 800, display: "block", marginBottom: "8px" }}>
              طريقة الأداء:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                type="button"
                className={`cat-pill ${paymentMethod === "CASH" ? "active" : ""}`}
                onClick={() => setPaymentMethod("CASH")}
                style={{ textAlign: "center" }}
              >
                💵 نقداً بالصندوق
              </button>
              <button
                type="button"
                className={`cat-pill ${paymentMethod === "CARD" ? "active" : ""}`}
                onClick={() => setPaymentMethod("CARD")}
                style={{ textAlign: "center" }}
              >
                💳 بطاقة بنكية CMI
              </button>
            </div>
          </div>

          <button
            className="btn-checkout"
            disabled={totalItems === 0}
            onClick={handleCheckout}
          >
            تأكيد الطلب وإصدار الفاتورة ({totalTtc} د.م)
          </button>
        </div>
      </div>

      {/* 4. Instant Receipt / Facture Display */}
      {lastOrder && (
        <div className="receipt-card">
          <div className="receipt-header">
            <h4>🧾 فاتورة طلب قانونية — {lastOrder.cafeName}</h4>
            <div className="receipt-legal">
              رقم الفاتورة: <strong>FAC-{new Date().getFullYear()}-{lastOrder.invoiceNumber}</strong> ·
              رقم التعريف الموحد (ICE): <strong>{lastOrder.cafeIce}</strong> · الحالة:{" "}
              <span className="badge-tag paid">مدفوعة بنجاح</span>
            </div>
          </div>

          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
              <span>رقم الطلب: <strong>{lastOrder.id}</strong></span>
              <span>الوقت: <strong>{lastOrder.createdAt}</strong></span>
            </div>

            <table className="q-table" style={{ margin: "14px 0" }}>
              <thead>
                <tr>
                  <th>العنصر</th>
                  <th>الكمية</th>
                  <th>السعر الفردي</th>
                  <th>المجموع</th>
                </tr>
              </thead>
              <tbody>
                {lastOrder.items.map((it, idx) => (
                  <tr key={idx}>
                    <td>{it.name}</td>
                    <td>{it.quantity}</td>
                    <td>{it.price} د.م</td>
                    <td>{it.price * it.quantity} د.م</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ background: "#fdf8f4", padding: "14px", borderRadius: "10px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span>الصافي الخاضع للضريبة (HT):</span>
                <b>{lastOrder.subtotalHt.toFixed(2)} د.م</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span>الضريبة على القيمة المضافة (TVA 10%):</span>
                <b>{lastOrder.vatMad.toFixed(2)} د.م</b>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "16px",
                  fontWeight: 900,
                  color: "var(--primary-espresso)",
                  borderTop: "1px dashed #d9cbbe",
                  paddingTop: "6px",
                  marginTop: "6px",
                }}
              >
                <span>المجموع المؤدى (TTC):</span>
                <b>{lastOrder.totalTtc} د.م</b>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "18px" }}>
              <button
                className="btn-export"
                onClick={() => alert(`تم تحميل الفاتورة الإلكترونية الرسمية FAC-${new Date().getFullYear()}-${lastOrder.invoiceNumber}.pdf بنجاح!`)}
              >
                📥 تحميل الفاتورة الرسمية بصيغة PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
