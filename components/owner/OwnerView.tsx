"use client";

import React, { useState } from "react";

interface LiveTicket {
  id: string;
  tableOrClient: string;
  items: string[];
  totalMad: number;
  time: string;
  status: "NEW" | "PREPARING" | "READY" | "COMPLETED";
  paymentMethod: "CASH" | "CARD";
}

const INITIAL_TICKETS: LiveTicket[] = [
  {
    id: "CMD-801",
    tableOrClient: "طاولة 4 (داخل المقهى)",
    items: ["2x إسبريسو سينغل أوريجين", "1x كرواسون زبدة"],
    totalMad: 42,
    time: "منذ دقيقتين",
    status: "NEW",
    paymentMethod: "CASH",
  },
  {
    id: "CMD-802",
    tableOrClient: "زبون خارجي (أخذ سفري)",
    items: ["1x قهوة نص-نص", "1x آيسد لاتيه فانيليا"],
    totalMad: 44,
    time: "منذ 6 دقائق",
    status: "PREPARING",
    paymentMethod: "CARD",
  },
  {
    id: "CMD-803",
    tableOrClient: "طاولة 9 (الشرفة)",
    items: ["1x قهوة مقطرة V60", "1x تشيز كيك توت"],
    totalMad: 58,
    time: "منذ 11 دقيقة",
    status: "READY",
    paymentMethod: "CASH",
  },
];

export default function OwnerView() {
  const [tickets, setTickets] = useState<LiveTicket[]>(INITIAL_TICKETS);
  const [cashSessionOpen, setCashSessionOpen] = useState(true);
  const [openingBalance, setOpeningBalance] = useState(500); // 500 MAD fond de caisse
  const [cashSales, setCashSales] = useState(1340);
  const [cardSales, setCardSales] = useState(980);
  const [quickPosFeedback, setQuickPosFeedback] = useState("");

  const expectedCashInDrawer = openingBalance + cashSales;

  function updateStatus(ticketId: string, nextStatus: LiveTicket["status"]) {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: nextStatus } : t))
    );
  }

  function addQuickPosOrder(productName: string, price: number) {
    const newId = `POS-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket: LiveTicket = {
      id: newId,
      tableOrClient: "كاونتر مباشر (سريع)",
      items: [`1x ${productName}`],
      totalMad: price,
      time: "الآن",
      status: "PREPARING",
      paymentMethod: "CASH",
    };
    setTickets([newTicket, ...tickets]);
    setCashSales((prev) => prev + price);
    setQuickPosFeedback(`✓ تم تسجيل طلب ${productName} (${price} د.م) بنجاح`);
    setTimeout(() => setQuickPosFeedback(""), 3000);
  }

  function handleCloseSession() {
    if (!confirm("هل أنت متأكد من إغلاق جلسة الصندوق وطباعة تقرير الـZ اليومي؟")) return;
    setCashSessionOpen(false);
    alert(`تم إغلاق الصندوق بنجاح!\nالرصيد المحقق نقداً: ${expectedCashInDrawer} د.م\nمبيعات البطاقة: ${cardSales} د.م`);
  }

  function handleOpenSession() {
    setCashSessionOpen(true);
    setOpeningBalance(500);
    setCashSales(0);
    setCardSales(0);
  }

  return (
    <div className="owner-view">
      {/* Banner */}
      <div className="role-banner">
        <div className="role-banner-content">
          <h2>بوابة صاحب المقهى — نقطة البيع (POS)، المطبخ وإدارة الصندوق</h2>
          <p>
            متابعة حية للطلبات الواردة، شاشة الباريستا، مراقبة المبيعات اللحظية، وإدارة جلسة الصندوق
            (Fond de Caisse) بكل دقة وسلاسة.
          </p>
        </div>
        <div className="role-banner-badge">🏪 مقهى ومحمصة الأصالة (Casablanca)</div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">
            <span>مبيعات اليوم الإجمالية</span>
            <span>💰</span>
          </div>
          <div className="metric-value">{cashSales + cardSales} د.م</div>
          <div className="metric-hint">📈 +18% مقارنة بالأسبوع الماضي</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>مبيعات الصندوق (كاش)</span>
            <span>💵</span>
          </div>
          <div className="metric-value">{cashSales} د.م</div>
          <div className="metric-hint">درج النقود: {expectedCashInDrawer} د.م</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>مبيعات الأداء الإلكتروني</span>
            <span>💳</span>
          </div>
          <div className="metric-value">{cardSales} د.م</div>
          <div className="metric-hint">تحويل مباشر للحساب البنكي</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>الطلبات المنجزة اليوم</span>
            <span>☕</span>
          </div>
          <div className="metric-value">{tickets.length + 42} طلب</div>
          <div className="metric-hint">متوسط وقت الخدمة: 3.8 دقائق</div>
        </div>
      </div>

      <div className="owner-grid">
        {/* Left Column: Live Orders Queue & Quick POS */}
        <div>
          {/* Quick POS register */}
          <div className="orders-queue-panel" style={{ marginBottom: "24px" }}>
            <div className="q-section-header" style={{ marginBottom: "16px" }}>
              <div>
                <h3>⚡ كاشير سريع — تسجيل فوري بنقرة واحدة</h3>
                <p>إصدار تذكرة فورية للزبون في الكاونتر دون انتظار</p>
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
              {[
                { name: "إسبريسو", price: 15, icon: "☕" },
                { name: "نص-نص", price: 16, icon: "🥛" },
                { name: "كابتشينو", price: 24, icon: "✨" },
                { name: "كرواسون", price: 12, icon: "🥐" },
                { name: "ماء معدني", price: 6, icon: "💧" },
                { name: "عصير برتقال", price: 20, icon: "🍊" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => addQuickPosOrder(item.name, item.price)}
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
                  <span style={{ fontSize: "20px" }}>{item.icon}</span>
                  <span style={{ fontWeight: 800 }}>{item.name}</span>
                  <span style={{ fontSize: "12px", color: "var(--caramel-gold)", fontWeight: 900 }}>
                    {item.price} د.م
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Kitchen & Barista Stream */}
          <div className="orders-queue-panel">
            <div className="q-section-header">
              <div>
                <h3>🔔 تتبع الطلبات الحية (شاشة الباريستا)</h3>
                <p>تحديث مباشر لحالة كل طلب لضمان سرعة التحضير وجودة التقديم</p>
              </div>
              <span className="badge-tag paid">{tickets.filter((t) => t.status !== "COMPLETED").length} طلبات قيد العمل</span>
            </div>

            <div className="tickets-list">
              {tickets.map((ticket) => (
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
                          onClick={() => updateStatus(ticket.id, "PREPARING")}
                        >
                          بدء التحضير ⏳
                        </button>
                      )}
                      {ticket.status === "PREPARING" && (
                        <button
                          className="btn-ticket-action ready"
                          onClick={() => updateStatus(ticket.id, "READY")}
                        >
                          جاهز للتسليم 🔔
                        </button>
                      )}
                      {ticket.status === "READY" && (
                        <button
                          className="btn-ticket-action close"
                          onClick={() => updateStatus(ticket.id, "COMPLETED")}
                        >
                          تم التسليم ✓
                        </button>
                      )}
                      {ticket.status === "COMPLETED" && (
                        <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 800 }}>
                          ✓ مكتمل ومدفوع
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Cash Session (Fond de Caisse) & Daily Summary */}
        <div>
          <div className="caisse-session-card">
            <h3 style={{ fontSize: "18px", fontWeight: 900, marginBottom: "14px" }}>
              💵 إدارة صندوق المقهى (Caisse)
            </h3>

            {cashSessionOpen ? (
              <div>
                <div className="caisse-status-badge">
                  <span>● الجلسة مفتوحة ومباشرة</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>رصيد الافتتاح (Fond de caisse):</span>
                    <b>{openingBalance} د.م</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>المبيعات النقدية المسجلة:</span>
                    <b style={{ color: "var(--success)" }}>+{cashSales} د.م</b>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>مبيعات الدفع الإلكتروني (TPE):</span>
                    <b>{cardSales} د.م</b>
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
                    <span>السيولة المتوقعة بالدرج:</span>
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
                  onClick={handleCloseSession}
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
                  onClick={handleOpenSession}
                >
                  🔓 فتح جلسة صندوق جديدة (500 د.م)
                </button>
              </div>
            )}

            {/* Quick Cafe Info */}
            <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #eee", fontSize: "12px", color: "var(--text-muted)" }}>
              <div><strong>المسؤول:</strong> محمد القاسمي (Gérant)</div>
              <div><strong>رقم الصندوق:</strong> CAISSE-01 (Casablanca)</div>
              <div><strong>الرقم الضريبي:</strong> ICE 001234567000089</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
