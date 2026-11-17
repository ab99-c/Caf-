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
  tableNumber?: string;
  customerNote?: string;
  orderSource?: "PHONE_TABLE_QR" | "WEB" | "COUNTER";
}

interface CustomerViewProps {
  cafe: CafeTenant;
  cafes: CafeTenant[];
  onSelectCafe: (cafeId: string) => void;
  onOrderCreated: (cafeId: string, order: CreatedOrder) => void;
}

const AVAILABLE_TABLES = [
  "طاولة 1 (نافذة)",
  "طاولة 2 (وسط)",
  "طاولة 3 (صالون)",
  "طاولة 4 (ركن هادئ)",
  "طاولة 5 (VIP)",
  "شرفة 1 (إطلالة خارجية)",
  "شرفة 2 (تراس)",
  "شرفة 3 (تراس)",
];

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
  const [selectedTable, setSelectedTable] = useState<string>("طاولة 4 (ركن هادئ)");
  const [customerNote, setCustomerNote] = useState<string>("");
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);
  const [lastOrder, setLastOrder] = useState<CreatedOrder | null>(null);
  const [waiterCalledMsg, setWaiterCalledMsg] = useState<string>("");
  const [qrScannedFeedback, setQrScannedFeedback] = useState<string>("");

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

  function handleScanQr(table: string) {
    setSelectedTable(table);
    setDiningOption("DINE_IN");
    setQrScannedFeedback(`📸 تم مسح كود QR بنجاح! أنت جالس في: ${table}`);
    setTimeout(() => setQrScannedFeedback(""), 4000);
  }

  function handleCallWaiter() {
    setWaiterCalledMsg(`🔔 تم إشعار النادل! السرباي في طريقه الآن إلى ${selectedTable}`);
    setTimeout(() => setWaiterCalledMsg(""), 5000);
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
      tableNumber: diningOption === "DINE_IN" ? selectedTable : undefined,
      customerNote: customerNote.trim() || undefined,
      orderSource: "PHONE_TABLE_QR",
    };

    setLastOrder(orderRecord);
    onOrderCreated(cafe.id, orderRecord);
    setCart({});
  }

  const renderMainContent = () => (
    <>
      {/* Phone Table Order Feature Banner */}
      <div className="phone-order-banner">
        <div>
          <div className="phone-order-badge">
            <span>📱 طلب مباشر من الهاتف على الطاولة (QR Code)</span>
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: 900, margin: "8px 0 4px" }}>
            جالس فالمقهى؟ اطلب ها من تيليفونك بلا ما تعيط على السرباي!
          </h3>
          <p style={{ fontSize: "13px", opacity: 0.9, margin: 0 }}>
            امسح كود QR أو اختار رقم الطاولة ديالك، دوز الطلب، وغيوصلك حتى لطاولتك سخون وطازج.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            className="cat-pill active"
            onClick={() => handleScanQr("طاولة 4 (ركن هادئ)")}
            style={{ background: "var(--caramel-gold)", border: 0 }}
          >
            📸 محاكاة مسح كود QR للطاولة
          </button>
          <button
            type="button"
            className="cat-pill"
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: 0 }}
          >
            {isPhoneFrame ? "🖥️ عرض الشاشة الكاملة" : "📱 عرض شاشة الهاتف"}
          </button>
        </div>
      </div>

      {qrScannedFeedback && (
        <div
          style={{
            background: "var(--success-bg)",
            color: "var(--success)",
            padding: "12px 18px",
            borderRadius: "10px",
            fontWeight: 800,
            fontSize: "14px",
            marginBottom: "20px",
            border: "1px solid rgba(30,130,76,0.2)",
          }}
        >
          {qrScannedFeedback}
        </div>
      )}

      {/* Table Selector Box for In-Cafe Customer */}
      <div className="table-selector-box" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: 900, color: "var(--primary-espresso)" }}>
              📍 أنت جالس حالياً في: <span style={{ color: "var(--caramel-gold)" }}>{selectedTable}</span>
            </h4>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0" }}>
              اختر رقم الطاولة لي جالس فيها دابا باش السرباي والباريستا يعرفو فين يوصلو ليك القهوة:
            </p>
          </div>
          <span style={{ fontSize: "12px", background: "#f5ece2", padding: "4px 10px", borderRadius: "6px", fontWeight: 700 }}>
            {cafe.name}
          </span>
        </div>

        <div className="tables-pills-row">
          {AVAILABLE_TABLES.map((tbl) => (
            <button
              key={tbl}
              type="button"
              className={`table-pill-btn ${selectedTable === tbl ? "active" : ""}`}
              onClick={() => setSelectedTable(tbl)}
            >
              🍽️ {tbl}
            </button>
          ))}
        </div>

        {/* Special Instructions for Barista / Waiter */}
        <div style={{ marginTop: "12px" }}>
          <label style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-main)" }}>
            📝 ملاحظة للباريستا (طلب خاص على ذوقك):
          </label>
          <input
            type="text"
            className="barista-notes-input"
            placeholder="مثال: سكر ناقص، نص-نص سخونة بزاف، حليب خفيف، كاس ماء بارد مع القهوة..."
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
          />
        </div>
      </div>

      {/* 1. Cafe Selection Section */}
      <div className="q-section-header">
        <div>
          <h3>🏪 اختر المقهى</h3>
          <p>كل مقهى له قائمته الخاصة، أسعاره، وفواتيره المعزولة كلياً</p>
        </div>
        <span style={{ fontSize: "13px", color: "var(--caramel-gold)", fontWeight: 700 }}>
          {cafes.length} مقاهي متاحة
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
          <p>اطلب مباشرة من هاتفك لطاولتك في المقهى</p>
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
          <p>
            الطلب سيوجه للباريستا والسرباي إلى: <strong>{selectedTable}</strong>
          </p>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-items-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: 800 }}>
              عناصر الطلب ({totalItems} قطع)
            </h4>
            <span style={{ fontSize: "12px", background: "#fef3c7", color: "#92400e", padding: "4px 8px", borderRadius: "6px", fontWeight: 800 }}>
              📱 طلب هاتف: {selectedTable}
            </span>
          </div>

          {totalItems === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>☕</div>
              <p>السلة فارغة. اختر مشروباتك من المنيو أعلاه!</p>
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
              مكان الاستهلاك:
            </label>
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              {[
                { id: "DINE_IN", label: `🍽️ داخل المقهى (${selectedTable.split(" ")[0]} ${selectedTable.split(" ")[1]})` },
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
            تأكيد الطلب المباشر من الهاتف
          </h4>

          <div className="summary-row">
            <span>وجهة التسليم:</span>
            <b style={{ color: "var(--caramel-gold)" }}>{selectedTable}</b>
          </div>

          {customerNote && (
            <div className="summary-row" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              <span>ملاحظة الباريستا:</span>
              <i>"{customerNote}"</i>
            </div>
          )}

          <div className="summary-row">
            <span>المجموع الصافي (HT):</span>
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
                💵 نقداً عند الطاولة
              </button>
              <button
                type="button"
                className={`cat-pill ${paymentMethod === "CARD" ? "active" : ""}`}
                onClick={() => setPaymentMethod("CARD")}
                style={{ textAlign: "center" }}
              >
                💳 بطاقة TPE مع السرباي
              </button>
            </div>
          </div>

          <button
            className="btn-checkout"
            disabled={totalItems === 0}
            onClick={handleCheckout}
          >
            🚀 إرسال الطلب للباريستا للطاولة ({totalTtc} د.م)
          </button>
        </div>
      </div>

      {/* 4. Live Table Order Tracking on Customer Phone */}
      {lastOrder && (
        <div className="receipt-card" style={{ border: "2px solid var(--caramel-gold)" }}>
          <div className="receipt-header">
            <span
              style={{
                background: "#fef3c7",
                color: "#92400e",
                padding: "4px 12px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 800,
                display: "inline-block",
                marginBottom: "8px",
              }}
            >
              📱 تم إرسال الطلب بنجاح من هاتفك إلى كاونتر {lastOrder.cafeName}
            </span>
            <h4>☕ تتبع طلب الطاولة: {lastOrder.tableNumber || "طلب مباشر"}</h4>
            <div className="receipt-legal">
              رقم الطلب: <strong>{lastOrder.id}</strong> · الفاتورة:{" "}
              <strong>FAC-{new Date().getFullYear()}-{lastOrder.invoiceNumber}</strong> · ICE:{" "}
              <strong>{lastOrder.cafeIce}</strong>
            </div>
          </div>

          {/* Live Preparation Stepper */}
          <div style={{ maxWidth: "560px", margin: "20px auto" }}>
            <div className="stepper-container">
              <div className="stepper-step completed">
                <div className="stepper-circle">✓</div>
                <div className="stepper-label">تم استلام الطلب بالصندوق</div>
              </div>
              <div className="stepper-step active">
                <div className="stepper-circle">☕</div>
                <div className="stepper-label">الباريستا يحضر الآن</div>
              </div>
              <div className="stepper-step">
                <div className="stepper-circle">🏃</div>
                <div className="stepper-label">السرباي في الطريق لطاولتك</div>
              </div>
            </div>

            {lastOrder.customerNote && (
              <div
                style={{
                  background: "#fdf8f4",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#7d5a3c",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                📝 ملاحظتك للباريستا: <strong>"{lastOrder.customerNote}"</strong>
              </div>
            )}

            {/* In-Cafe Actions: Call Waiter / Request Bill */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                flexWrap: "wrap",
                margin: "18px 0",
              }}
            >
              <button
                type="button"
                className="btn-call-waiter"
                onClick={handleCallWaiter}
              >
                🔔 استدعاء السرباي للطاولة ({lastOrder.tableNumber || "الطاولة"})
              </button>
              <button
                type="button"
                className="btn-export"
                onClick={() => alert(`تم إشعار الكاشير! السرباي سيحضر فاتورة ${lastOrder.totalTtc} د.م وجهاز TPE إلى طاولتك.`)}
              >
                🧾 طلب الحساب عند الطاولة ({lastOrder.totalTtc} د.م)
              </button>
            </div>

            {waiterCalledMsg && (
              <div
                style={{
                  background: "var(--success-bg)",
                  color: "var(--success)",
                  padding: "10px",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontWeight: 800,
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              >
                {waiterCalledMsg}
              </div>
            )}

            {/* Order Items Table */}
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
                onClick={() => alert(`تم تحميل فاتورة الهاتف الرسمية FAC-${new Date().getFullYear()}-${lastOrder.invoiceNumber}.pdf بنجاح!`)}
              >
                📥 حفظ الفاتورة الإلكترونية على هاتفك (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="customer-view">
      {isPhoneFrame ? (
        <div>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-muted)" }}>
              📱 أنت تشاهد الآن شاشة الهاتف الذكي للزبون الجالس في المقهى
            </span>
            <button
              type="button"
              onClick={() => setIsPhoneFrame(false)}
              className="cat-pill"
              style={{ marginRight: "10px" }}
            >
              ✕ إغلاق وضع الهاتف
            </button>
          </div>
          <div className="phone-frame-mockup">
            <div className="phone-notch"></div>
            <div className="phone-screen">{renderMainContent()}</div>
          </div>
        </div>
      ) : (
        renderMainContent()
      )}
    </div>
  );
}
