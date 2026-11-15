"use client";

import React, { useState } from "react";
import { CafeTenant, LiveTicket } from "../portal/types";

interface OwnerViewProps {
  cafe: CafeTenant;
  cafes: CafeTenant[];
  onSelectCafe: (cafeId: string) => void;
  onUpdateTicket: (cafeId: string, ticketId: string, status: LiveTicket["status"]) => void;
  onAddQuickPosOrder: (cafeId: string, productName: string, price: number) => void;
  onCloseSession: (cafeId: string) => void;
  onOpenSession: (cafeId: string) => void;
}

export default function OwnerView({
  cafe,
  cafes,
  onSelectCafe,
  onUpdateTicket,
  onAddQuickPosOrder,
  onCloseSession,
  onOpenSession,
}: OwnerViewProps) {
  const [quickPosFeedback, setQuickPosFeedback] = useState("");

  const expectedCashInDrawer = cafe.cashSession.openingBalance + cafe.cashSession.cashSales;

  function handleQuickPos(productName: string, price: number) {
    onAddQuickPosOrder(cafe.id, productName, price);
    setQuickPosFeedback(`✓ تم تسجيل طلب ${productName} (${price} د.م) في كاسة ${cafe.name}`);
    setTimeout(() => setQuickPosFeedback(""), 3500);
  }

  function handleClose() {
    if (!confirm(`هل أنت متأكد من إغلاق جلسة الصندوق (${cafe.cashSession.sessionNumber}) الخاصة بـ ${cafe.name}؟`)) return;
    onCloseSession(cafe.id);
  }

  function handleOpen() {
    onOpenSession(cafe.id);
  }

  return (
    <div className="owner-view">
      {/* Banner */}
      <div className="role-banner">
        <div className="role-banner-content">
          <h2>بوابة صاحب المقهى — إدارة مستقلة لـ: {cafe.name}</h2>
          <p>
            تتبع الكاشير الفوري، شاشة الباريستا الخاصة بهذا الفرع فقط، ومراقبة رصيد الصندوق
            (Fond de Caisse) دون أي تداخل مع الفروع أو المقاهي الأخرى.
          </p>
        </div>
        <div className="role-banner-badge">👤 المسير: {cafe.ownerName}</div>
      </div>

      {/* Cafe Quick Switcher Tab */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-muted)" }}>
          اختر المقهى الذي تديره حالياً:
        </span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {cafes.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCafe(c.id)}
              className={`cat-pill ${c.id === cafe.id ? "active" : ""}`}
            >
              🏪 {c.name} ({c.city.split(" ")[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">
            <span>مبيعات {cafe.name.split(" ")[0]} اليوم</span>
            <span>💰</span>
          </div>
          <div className="metric-value">
            {cafe.cashSession.cashSales + cafe.cashSession.cardSales} د.م
          </div>
          <div className="metric-hint">📈 مستقلة تماماً عن المقاهي الأخرى</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>مبيعات الصندوق (نقداً)</span>
            <span>💵</span>
          </div>
          <div className="metric-value">{cafe.cashSession.cashSales} د.م</div>
          <div className="metric-hint">السيولة الإجمالية بالدرج: {expectedCashInDrawer} د.م</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>مبيعات البطاقة (TPE)</span>
            <span>💳</span>
          </div>
          <div className="metric-value">{cafe.cashSession.cardSales} د.م</div>
          <div className="metric-hint">حساب بنكي خاص برقم: {cafe.rc}</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>الطلبات النشطة بالمطبخ</span>
            <span>☕</span>
          </div>
          <div className="metric-value">
            {cafe.tickets.filter((t) => t.status !== "COMPLETED").length} طلبات
          </div>
          <div className="metric-hint">خاصة بهذا المقهى فقط</div>
        </div>
      </div>

      <div className="owner-grid">
        {/* Left Column: Quick POS & Live Orders Queue */}
        <div>
          {/* Quick POS */}
          <div className="orders-queue-panel" style={{ marginBottom: "24px" }}>
            <div className="q-section-header" style={{ marginBottom: "16px" }}>
              <div>
                <h3>⚡ كاشير سريع خاص بـ {cafe.name}</h3>
                <p>تسجيل فوري لطلبات الكاونتر بمنتجات هذا المقهى حصراً</p>
              </div>
            </div>

            {quickPosFeedback && (
              <div
                style={{
                  background: "var(--success-bg)",
                  color: "var(--success)",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  marginBottom: "14px",
                }}
              >
                {quickPosFeedback}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
              {cafe.products.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleQuickPos(item.name, item.priceMad)}
                  className="cat-pill"
                  style={{
                    padding: "14px 10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    background: "#fff",
                    borderColor: "var(--card-border)",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>☕</span>
                  <span style={{ fontWeight: 800, fontSize: "12px", textAlign: "center" }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: "13px", color: "var(--caramel-gold)", fontWeight: 900 }}>
                    {item.priceMad} د.م
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Barista & Kitchen Stream */}
          <div className="orders-queue-panel">
            <div className="q-section-header">
              <div>
                <h3>🔔 طلبات باريستا {cafe.name}</h3>
                <p>طلبات هذا المقهى المعزولة عن أي مقهى آخر</p>
              </div>
              <span className="badge-tag paid">
                {cafe.tickets.filter((t) => t.status !== "COMPLETED").length} طلبات قيد العمل
              </span>
            </div>

            <div className="tickets-list">
              {cafe.tickets.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
                  لا توجد طلبات معلقة حالياً في هذا المقهى.
                </div>
              ) : (
                cafe.tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`order-ticket ${
                      ticket.status === "NEW"
                        ? "new"
                        : ticket.status === "PREPARING"
                        ? "preparing"
                        : ticket.status === "READY"
                        ? "ready"
                        : ""
                    }`}
                  >
                    <div className="ticket-header">
                      <div>
                        <span className="ticket-id">{ticket.id}</span> —{" "}
                        <strong style={{ fontSize: "14px" }}>{ticket.tableOrClient}</strong>
                      </div>
                      <span className="ticket-time">⏱️ {ticket.time}</span>
                    </div>

                    <div className="ticket-items">
                      {ticket.items.map((it, idx) => (
                        <div key={idx} style={{ padding: "2px 0", fontWeight: 700 }}>
                          • {it}
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #ebe4dc",
                        paddingTop: "10px",
                      }}
                    >
                      <div>
                        <span style={{ fontSize: "14px", fontWeight: 900, color: "var(--primary-espresso)" }}>
                          {ticket.totalMad} د.م
                        </span>{" "}
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          ({ticket.paymentMethod === "CASH" ? "💵 نقداً" : "💳 بطاقة"})
                        </span>
                      </div>

                      <div className="ticket-actions">
                        {ticket.status === "NEW" && (
                          <button
                            className="btn-ticket-action prepare"
                            onClick={() => onUpdateTicket(cafe.id, ticket.id, "PREPARING")}
                          >
                            بدء التحضير ⏳
                          </button>
                        )}
                        {ticket.status === "PREPARING" && (
                          <button
                            className="btn-ticket-action ready"
                            onClick={() => onUpdateTicket(cafe.id, ticket.id, "READY")}
                          >
                            جاهز للتسليم 🔔
                          </button>
                        )}
                        {ticket.status === "READY" && (
                          <button
                            className="btn-ticket-action close"
                            onClick={() => onUpdateTicket(cafe.id, ticket.id, "COMPLETED")}
                          >
                            تم التسليم ✓
                          </button>
                        )}
                        {ticket.status === "COMPLETED" && (
                          <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 800 }}>
                            ✓ تم التسليم والأداء
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Independent Cash Session (Caisse) */}
        <div>
          <div className="caisse-session-card">
            <h3 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "14px" }}>
              💵 صندوق كاش {cafe.name}
            </h3>

            {cafe.cashSession.isOpen ? (
              <div>
                <div className="caisse-status-badge">
                  <span>● الجلسة مفتوحة: {cafe.cashSession.sessionNumber}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>وقت الفتح:</span>
                    <b>{cafe.cashSession.openedAt}</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>رصيد الافتتاح (Fond de caisse):</span>
                    <b>{cafe.cashSession.openingBalance} د.م</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>المبيعات النقدية المسجلة:</span>
                    <b style={{ color: "var(--success)" }}>+{cafe.cashSession.cashSales} د.م</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>مبيعات البطاقة البنكية:</span>
                    <b>{cafe.cashSession.cardSales} د.م</b>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "16px",
                      fontWeight: 900,
                      borderTop: "2px dashed var(--card-border)",
                      paddingTop: "12px",
                      marginTop: "6px",
                    }}
                  >
                    <span>السيولة الواجب وجودها بالدرج:</span>
                    <span style={{ color: "var(--primary-espresso)" }}>{expectedCashInDrawer} د.م</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-checkout"
                  style={{
                    background: "linear-gradient(135deg, #b91c1c, #7f1d1d)",
                    marginTop: "20px",
                  }}
                  onClick={handleClose}
                >
                  🔒 إغلاق صندوق {cafe.name.split(" ")[0]} وطباعة تقرير Z
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "var(--danger)", fontWeight: 800, marginBottom: "14px" }}>
                  صندوق {cafe.name} مغلق حالياً
                </p>
                <button
                  type="button"
                  className="btn-checkout"
                  onClick={handleOpen}
                >
                  🔓 فتح جلسة جديدة للمقهى (500 د.م)
                </button>
              </div>
            )}

            {/* Legal Tenant Info */}
            <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #eee", fontSize: "12px", color: "var(--text-muted)" }}>
              <div><strong>المسير:</strong> {cafe.ownerName}</div>
              <div><strong>العنوان:</strong> {cafe.address}</div>
              <div><strong>رقم ICE المعتمد:</strong> {cafe.ice}</div>
              <div><strong>السجل التجاري:</strong> {cafe.rc} · {cafe.taxId}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
