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
  "طاولة 1",
  "طاولة 2",
  "طاولة 3",
  "طاولة 4",
  "طاولة 5",
  "شرفة 1",
  "شرفة 2",
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
  const [selectedTable, setSelectedTable] = useState<string>("طاولة 4");
  const [customerNote, setCustomerNote] = useState<string>("");
  const [lastOrder, setLastOrder] = useState<CreatedOrder | null>(null);
  const [waiterCalledMsg, setWaiterCalledMsg] = useState<string>("");

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

  function handleCallWaiter() {
    setWaiterCalledMsg(`🔔 تم إشعار النادل، السرباي في طريقه الآن إلى ${selectedTable}!`);
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
      tableNumber: selectedTable,
      customerNote: customerNote.trim() || undefined,
      orderSource: "PHONE_TABLE_QR",
    };

    setLastOrder(orderRecord);
    onOrderCreated(cafe.id, orderRecord);
    setCart({});
  }

  return (
    <div className="customer-view">
      {/* 1. In-Cafe Table Selection Bar */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--card-border)",
          borderRadius: "16px",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>📱</span>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 900, color: "var(--primary-espresso)" }}>
              طلب مباشر من الهاتف على الطاولة
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              اختر رقم طاولتك وسيتوجه النادل بطلبك فور تحضيره
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", fontWeight: 800 }}>رقم الطاولة:</span>
          {AVAILABLE_TABLES.map((tbl) => (
            <button
              key={tbl}
              type="button"
              className={`table-pill-btn ${selectedTable === tbl ? "active" : ""}`}
              onClick={() => setSelectedTable(tbl)}
              style={{ padding: "6px 12px", fontSize: "12px" }}
            >
              {tbl}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Search & Category Filter */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "20px", alignItems: "center", flexWrap: "wrap" }}>
        <div className="search-box" style={{ flex: 1, minWidth: "260px" }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={`ابحث في منيو ${cafe.name}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-pills" style={{ margin: 0, padding: 0 }}>
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
      </div>

      {/* 3. Products Grid */}
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

      {/* 4. Cart & Checkout Drawer */}
      <div className="q-section-header" id="cart-section" style={{ marginTop: "30px" }}>
        <div>
          <h3>🛒 سلة المشتريات — {selectedTable}</h3>
          <p>تأكيد الطلب المباشر من الهاتف وإرساله لكاونتر {cafe.name}</p>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-items-panel">
          <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "16px" }}>
            عناصر الطلب ({totalItems} قطع)
          </h4>

          {totalItems === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>☕</div>
              <p>السلة فارغة. اختر مشروباتك من المنيو أعلاه!</p>
            </div>
          ) : (
            cafe.products.filter((p) => cart[p.id]).map((p) => (
              <div key={p.id} className="cart-item-row">
                <div className="cart-item-info">
                  <h5>{p.name}</h5>
                  <span>{p.priceMad} د.م للقطعة</span>
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

          {/* Special note for barista */}
          <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid #eee" }}>
            <label style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-main)" }}>
              ملاحظة للباريستا (اختياري):
            </label>
            <input
              type="text"
              className="barista-notes-input"
              placeholder="مثال: سكر ناقص، نص-نص سخونة بزاف..."
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
            />
          </div>
        </div>

        {/* Checkout Summary */}
        <div className="cart-summary-panel">
          <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "14px" }}>
            ملخص الحساب
          </h4>

          <div className="summary-row">
            <span>تسليم إلى:</span>
            <b style={{ color: "var(--caramel-gold)" }}>{selectedTable}</b>
          </div>

          <div className="summary-row">
            <span>المجموع الصافي (HT):</span>
            <b>{subtotalHt.toFixed(2)} د.م</b>
          </div>

          <div className="summary-row">
            <span>الضريبة (TVA 10%):</span>
            <b>{vatMad.toFixed(2)} د.م</b>
          </div>

          <div className="summary-row total">
            <span>المجموع الإجمالي:</span>
            <b style={{ color: "var(--caramel-gold)" }}>{totalTtc} د.م</b>
          </div>

          <div style={{ marginTop: "16px" }}>
            <label style={{ fontSize: "12px", fontWeight: 800, display: "block", marginBottom: "6px" }}>
              طريقة الأداء عند الطاولة:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                type="button"
                className={`cat-pill ${paymentMethod === "CASH" ? "active" : ""}`}
                onClick={() => setPaymentMethod("CASH")}
                style={{ textAlign: "center", fontSize: "12px" }}
              >
                💵 نقداً
              </button>
              <button
                type="button"
                className={`cat-pill ${paymentMethod === "CARD" ? "active" : ""}`}
                onClick={() => setPaymentMethod("CARD")}
                style={{ textAlign: "center", fontSize: "12px" }}
              >
                💳 بطاقة TPE
              </button>
            </div>
          </div>

          <button
            className="btn-checkout"
            disabled={totalItems === 0}
            onClick={handleCheckout}
          >
            تأكيد الطلب ({totalTtc} د.م)
          </button>
        </div>
      </div>

      {/* 5. Live Table Order Tracking & Waiter Call */}
      {lastOrder && (
        <div className="receipt-card" style={{ border: "2px solid var(--caramel-gold)", marginTop: "30px" }}>
          <div className="receipt-header">
            <h4>☕ جاري تحضير طلب: {lastOrder.tableNumber}</h4>
            <div className="receipt-legal">
              رقم الطلب: <strong>{lastOrder.id}</strong> · الفاتورة:{" "}
              <strong>FAC-{new Date().getFullYear()}-{lastOrder.invoiceNumber}</strong>
            </div>
          </div>

          <div style={{ maxWidth: "560px", margin: "16px auto" }}>
            {/* Stepper */}
            <div className="stepper-container">
              <div className="stepper-step completed">
                <div className="stepper-circle">✓</div>
                <div className="stepper-label">تم الاستلام</div>
              </div>
              <div className="stepper-step active">
                <div className="stepper-circle">☕</div>
                <div className="stepper-label">قيد التحضير</div>
              </div>
              <div className="stepper-step">
                <div className="stepper-circle">🏃</div>
                <div className="stepper-label">في الطريق لطاولتك</div>
              </div>
            </div>

            {/* Actions for in-cafe customer */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "18px 0" }}>
              <button
                type="button"
                className="btn-call-waiter"
                onClick={handleCallWaiter}
              >
                🔔 استدعاء السرباي للطاولة ({lastOrder.tableNumber})
              </button>
              <button
                type="button"
                className="btn-export"
                onClick={() => alert(`تم إشعار الكاشير! السرباي سيحضر فاتورة ${lastOrder.totalTtc} د.م وجهاز TPE إلى طاولتك.`)}
              >
                🧾 طلب الحساب عند الطاولة
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
                  marginBottom: "14px",
                }}
              >
                {waiterCalledMsg}
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: "14px" }}>
              <button
                className="btn-export"
                onClick={() => alert(`تم تحميل فاتورة الهاتف الرسمية FAC-${new Date().getFullYear()}-${lastOrder.invoiceNumber}.pdf بنجاح!`)}
              >
                📥 تحميل الفاتورة (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
