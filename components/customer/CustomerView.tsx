"use client";

import React, { useState, useMemo } from "react";
import { CafeTenant, MenuItem } from "../portal/types";

export interface CreatedOrder {
  id: string;
  invoiceNumber: number;
  items: { name: string; quantity: number; price: number }[];
  subtotalHt: number;
  vatMad: number;
  totalTtc: number;
  paymentMethod: "CASH" | "CARD";
  status: "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED";
  createdAt: string;
  cafeIce: string;
  cafeName: string;
}

interface CustomerViewProps {
  cafe: CafeTenant;
  cafes: CafeTenant[];
  onSelectCafe: (cafeId: string) => void;
  onOrderCreated: (cafeId: string, order: CreatedOrder) => void;
}

export default function CustomerView({
  cafe,
  cafes,
  onSelectCafe,
  onOrderCreated,
}: CustomerViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD">("CASH");
  const [diningOption, setDiningOption] = useState<"TAKEAWAY" | "DINE_IN" | "DELIVERY">("DINE_IN");
  const [lastOrder, setLastOrder] = useState<CreatedOrder | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>(["الكل"]);
    cafe.products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [cafe.products]);

  const filteredProducts = useMemo(() => {
    return cafe.products.filter((p) => {
      const matchCat = selectedCategory === "الكل" || p.category === selectedCategory;
      const matchSearch =
        p.name.includes(search.trim()) || p.description.includes(search.trim());
      return matchCat && matchSearch;
    });
  }, [cafe.products, selectedCategory, search]);

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  // Moroccan VAT calculation: 10% VAT
  const totalTtc = useMemo(() => {
    return cafe.products.reduce((sum, p) => sum + p.priceMad * (cart[p.id] || 0), 0);
  }, [cafe.products, cart]);

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

    const nextInvoiceNumber = (cafe.invoices[cafe.invoices.length - 1]?.number || 1000) + 1;

    const itemsSummary = cafe.products.filter((p) => cart[p.id]).map((p) => ({
      name: p.name,
      quantity: cart[p.id],
      price: p.priceMad,
    }));

    const orderRecord: CreatedOrder = {
      id: `CMD-${cafe.id.slice(5, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      invoiceNumber: nextInvoiceNumber,
      items: itemsSummary,
      subtotalHt,
      vatMad,
      totalTtc,
      paymentMethod,
      status: "CONFIRMED",
      createdAt: new Date().toLocaleTimeString("ar-MA", { hour: "2-digit", minute: "2-digit" }),
      cafeIce: cafe.ice,
      cafeName: cafe.name,
    };

    setLastOrder(orderRecord);
    onOrderCreated(cafe.id, orderRecord);
    setCart({});
  }

  return (
    <div className="customer-view">
      {/* Banner */}
      <div className="role-banner">
        <div className="role-banner-content">
          <h2>بوابة الزبون — استكشف واطلب من: {cafe.name}</h2>
          <p>
            كل مقهى يتمتع بنظام فوترة مستقل، قائمة طعام فريدة، ورقم تعريف ضريبي وموحد (ICE: {cafe.ice})
            معتمد لدى إدارة الضرائب المغربية.
          </p>
        </div>
        <div className="role-banner-badge">📍 {cafe.city}</div>
      </div>

      {/* Customer Hero Banner */}
      <div className="customer-hero">
        <div>
          <h2>
            أهلاً بك في <span>{cafe.name}</span>
          </h2>
          <p>
            تصفح القائمة الحصرية لهذا المقهى، أضف طلباتك للسلة واستلم فاتورتك الإلكترونية المعتمدة
            فورياً برقم ICE المستقل.
          </p>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder={`ابحث داخل منيو ${cafe.name}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="hero-feature-card">
          <h4>✨ هوية المقهى المستقلة (Données Café)</h4>
          <div className="hero-steps">
            <div className="hero-step-item">
              <span className="step-num">ICE</span>
              <span>رقم المقاولة الموحد: {cafe.ice}</span>
            </div>
            <div className="hero-step-item">
              <span className="step-num">📍</span>
              <span>العنوان: {cafe.address}</span>
            </div>
            <div className="hero-step-item">
              <span className="step-num">📞</span>
              <span>الهاتف المباشر: {cafe.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Cafe Selector Cards Grid */}
      <div className="q-section-header">
        <div>
          <h3>🏪 اختر المقهى المستقل الذي تريد الطلب منه</h3>
          <p>كل مقهى له قائمته الخاصة، أسعاره، وفواتيره المعزولة كلياً</p>
        </div>
        <span style={{ fontSize: "13px", color: "var(--caramel-gold)", fontWeight: 700 }}>
          {cafes.length} مقاهي مستقلة تماماً
        </span>
      </div>

      <div className="cafes-grid">
        {cafes.map((c) => {
          const isSelected = c.id === cafe.id;
          return (
            <div
              key={c.id}
              className={`cafe-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectCafe(c.id)}
            >
              <div
                className="cafe-card-image"
                style={{ backgroundImage: `url(${c.image})` }}
              >
                <span className="cafe-status-badge">
                  {isSelected ? "✓ المقهى المختار حالياً" : "● اضغط للاختيار"}
                </span>
                <span className="cafe-ice-badge">ICE: {c.ice}</span>
              </div>
              <div className="cafe-card-body">
                <div>
                  <div className="cafe-card-title">
                    <h4>{c.name}</h4>
                    <span className="cafe-rating">★ {c.rating}</span>
                  </div>
                  <div className="cafe-type">{c.type}</div>
                </div>
                <div className="cafe-meta">
                  <span>📍 {c.city}</span>
                  <span>⏱️ {c.deliveryMinutes} دقيقة</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Menu Section for Currently Selected Cafe */}
      <div className="q-section-header">
        <div>
          <h3>☕ قائمة مشروبات ومأكولات — {cafe.name}</h3>
          <p>قائمة المنتجات الخاصة بهذا المقهى حصراً</p>
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
          <h3>🛒 سلة الطلب لدى: {cafe.name}</h3>
          <p>الفاتورة تصدر برقم ICE الخاص بهذا المقهى: {cafe.ice}</p>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-items-panel">
          <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px" }}>
            عناصر الطلب ({totalItems} قطع)
          </h4>

          {totalItems === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>☕</div>
              <p>السلة فارغة. اختر مشروباتك أو وجباتك من القائمة أعلاه!</p>
            </div>
          ) : (
            cafe.products.filter((p) => cart[p.id]).map((p) => (
              <div key={p.id} className="cart-item-row">
                <div className="cart-item-info">
                  <h5>{p.name}</h5>
                  <span>{p.priceMad} د.م للقطعة · شامل TVA 10%</span>
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

          <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #eee" }}>
            <label style={{ fontSize: "13px", fontWeight: 800, color: "var(--primary-espresso)" }}>
              نوع الاستهلاك:
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

        {/* Cart Summary */}
        <div className="cart-summary-panel">
          <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px" }}>
            الفاتورة القانونية الخاصة بـ {cafe.name}
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
            تأكيد الطلب وإصدار فاتورة {cafe.name} ({totalTtc} د.م)
          </button>
        </div>
      </div>

      {/* 4. Instant Receipt */}
      {lastOrder && (
        <div className="receipt-card">
          <div className="receipt-header">
            <h4>🧾 فاتورة قانونية صادرة عن — {lastOrder.cafeName}</h4>
            <div className="receipt-legal">
              رقم الفاتورة: <strong>FAC-{new Date().getFullYear()}-{lastOrder.invoiceNumber}</strong> ·
              رقم التعريف الموحد (ICE): <strong>{lastOrder.cafeIce}</strong> · الحالة:{" "}
              <span className="badge-tag paid">مدفوعة ومسجلة في صندوق {cafe.name}</span>
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
                onClick={() => alert(`تم تحميل فاتورة ${lastOrder.cafeName} الرسمية FAC-${new Date().getFullYear()}-${lastOrder.invoiceNumber}.pdf بنجاح!`)}
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
