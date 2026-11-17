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

const QR_TABLE_LIST = [
  "طاولة 1",
  "طاولة 2",
  "طاولة 3",
  "طاولة 4",
  "طاولة 5",
  "شرفة 1",
  "شرفة 2",
];

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
  const [showQrGenerator, setShowQrGenerator] = useState(false);

  const expectedCashInDrawer = cafe.cashSession.openingBalance + cafe.cashSession.cashSales;

  function handleQuickPos(productName: string, price: number) {
    onAddQuickPosOrder(cafe.id, productName, price);
    setQuickPosFeedback(`✓ تم تسجيل ${productName} (${price} د.م)`);
    setTimeout(() => setQuickPosFeedback(""), 3000);
  }

  function handleClose() {
    if (!confirm(`هل أنت متأكد من إغلاق جلسة الصندوق (${cafe.cashSession.sessionNumber})؟`)) return;
    onCloseSession(cafe.id);
  }

  function handleOpen() {
    onOpenSession(cafe.id);
  }

  return (
    <div className="owner-view">
      {/* Top Controls Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>🏪</span>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 900, margin: 0, color: "var(--primary-espresso)" }}>
              {cafe.name} — شاشة الكاشير والمطبخ
            </h2>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              المسؤول: {cafe.ownerName} · ICE: {cafe.ice}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowQrGenerator(!showQrGenerator)}
          className="btn-export"
        >
          {showQrGenerator ? "✕ إخفاء ملصقات QR" : "🖨️ طباعة ملصقات QR للطاولات"}
        </button>
      </div>

      {/* QR Codes Table Generator Section for Cafe Owner */}
      {showQrGenerator && (
        <div
          style={{
            background: "#fff",
            border: "2px solid var(--caramel-gold)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            marginBottom: "24px",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div className="q-section-header" style={{ marginBottom: "14px" }}>
            <div>
              <h3>🖨️ ملصقات QR لطاولات المقهى</h3>
              <p>اطبع هذه الملصقات وضعها على كل طاولة لتمكين الزبائن من مسحها والطلب مباشرة من هواتفهم</p>
            </div>
            <button
              type="button"
              className="btn-export"
              onClick={() => alert(`جاري تجهيز ملف PDF جاهز للطباعة لـ ${cafe.name}...`)}
            >
              طباعة الكل (PDF)
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            {QR_TABLE_LIST.map((tbl, idx) => (
              <div key={idx} className="qr-sticker-card" style={{ padding: "14px" }}>
                <div style={{ fontWeight: 900, fontSize: "14px", color: "var(--primary-espresso)" }}>
                  {tbl}
                </div>
                <div className="qr-code-box" style={{ width: "110px", height: "110px" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "28px" }}>📱</div>
                    <div style={{ fontSize: "10px", fontWeight: 800 }}>Scan & Order</div>
                  </div>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--caramel-gold)" }}>
                  امسح واطلب من هاتفك
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">
            <span>مبيعات اليوم الإجمالية</span>
            <span>💰</span>
          </div>
          <div className="metric-value">
            {cafe.cashSession.cashSales + cafe.cashSession.cardSales} د.م
          </div>
          <div className="metric-hint">خاصة بـ {cafe.name.split(" ")[0]}</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>مبيعات الكاش (نقداً)</span>
            <span>💵</span>
          </div>
          <div className="metric-value">{cafe.cashSession.cashSales} د.م</div>
          <div className="metric-hint">الموجود بالدرج: {expectedCashInDrawer} د.م</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>مبيعات TPE (البطاقة)</span>
            <span>💳</span>
          </div>
          <div className="metric-value">{cafe.cashSession.cardSales} د.م</div>
          <div className="metric-hint">تحويلات الحساب البنكي</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>الطلبات النشطة (بالمطبخ)</span>
            <span>☕</span>
          </div>
          <div className="metric-value">
            {cafe.tickets.filter((t) => t.status !== "COMPLETED").length} طلبات
          </div>
          <div className="metric-hint">تشمل طلبات الهواتف للطاولات</div>
        </div>
      </div>

      <div className="owner-grid">
        {/* Left Column: Quick POS & Live Orders Queue */}
        <div>
          {/* Quick POS */}
          <div className="orders-queue-panel" style={{ marginBottom: "24px" }}>
            <div className="q-section-header" style={{ marginBottom: "14px" }}>
              <div>
                <h3>⚡ كاشير الكاونتر السريع</h3>
                <p>تسجيل فوري لطلبات الكاونتر بنقرة واحدة</p>
              </div>
            </div>

            {quickPosFeedback && (
              <div
                style={{
                  background: "var(--success-bg)",
                  color: "var(--success)",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                {quickPosFeedback}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
              {cafe.products.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleQuickPos(item.name, item.priceMad)}
                  className="cat-pill"
                  style={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    background: "#fff",
                    borderColor: "var(--card-border)",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>☕</span>
                  <span style={{ fontWeight: 800, fontSize: "12px" }}>{item.name}</span>
                  <span style={{ fontSize: "12px", color: "var(--caramel-gold)", fontWeight: 900 }}>
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
                <h3>🔔 طلبات الباريستا والمطبخ المباشرة</h3>
                <p>تحديث فوري للطلبات الواردة من الهواتف والكاونتر</p>
              </div>
              <span className="badge-tag paid">
                {cafe.tickets.filter((t) => t.status !== "COMPLETED").length} قيد التحضير
              </span>
            </div>

            <div className="tickets-list">
              {cafe.tickets.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
                  لا توجد طلبات معلقة حالياً.
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
                        {ticket.isPhoneOrder && (
                          <span
                            style={{
                              background: "#fef3c7",
                              color: "#92400e",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: 800,
                              marginRight: "8px",
                            }}
                          >
                            📱 طلب هاتف
                          </span>
                        )}
                      </div>
                      <span className="ticket-time">⏱️ {ticket.time}</span>
                    </div>

                    {ticket.notes && (
                      <div
                        style={{
                          background: "#fff9f2",
                          border: "1px dashed var(--caramel-gold)",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          color: "#78350f",
                          margin: "6px 0 10px",
                          fontWeight: 700,
                        }}
                      >
                        📝 ملاحظة الزبون: "{ticket.notes}"
                      </div>
                    )}

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
                            تم التسليم للطاولة ✓
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

        {/* Right Column: Cash Session */}
        <div>
          <div className="caisse-session-card">
            <h3 style={{ fontSize: "17px", fontWeight: 900, marginBottom: "14px" }}>
              💵 صندوق المقهى (Caisse)
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
                    <span>رصيد الافتتاح:</span>
                    <b>{cafe.cashSession.openingBalance} د.م</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>مبيعات الكاش:</span>
                    <b style={{ color: "var(--success)" }}>+{cafe.cashSession.cashSales} د.م</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>مبيعات TPE:</span>
                    <b>{cafe.cashSession.cardSales} د.م</b>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "15px",
                      fontWeight: 900,
                      borderTop: "2px dashed var(--card-border)",
                      paddingTop: "12px",
                      marginTop: "6px",
                    }}
                  >
                    <span>السيولة الإجمالية بالدرج:</span>
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
                  🔒 إغلاق الصندوق وطباعة تقرير Z
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "var(--danger)", fontWeight: 800, marginBottom: "14px" }}>
                  الصندوق مغلق حالياً
                </p>
                <button
                  type="button"
                  className="btn-checkout"
                  onClick={handleOpen}
                >
                  🔓 فتح جلسة صندوق جديدة
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
