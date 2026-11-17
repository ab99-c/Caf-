"use client";

import React, { useState } from "react";
import { CafeTenant } from "../portal/types";

interface AccountantViewProps {
  cafe: CafeTenant;
  cafes: CafeTenant[];
  onSelectCafe: (cafeId: string) => void;
  onCancelInvoice: (cafeId: string, invoiceId: string, number: number) => void;
}

export default function AccountantView({
  cafe,
  cafes,
  onSelectCafe,
  onCancelInvoice,
}: AccountantViewProps) {
  const [filterMethod, setFilterMethod] = useState<string>("ALL");
  const [feedback, setFeedback] = useState<string>("");

  const validInvoices = cafe.invoices.filter((i) => i.status !== "CANCELLED");

  const totalHt = validInvoices.reduce((sum, i) => sum + i.subtotalHt, 0);
  const totalVat = validInvoices.reduce((sum, i) => sum + i.vatMad, 0);
  const totalTtc = validInvoices.reduce((sum, i) => sum + i.totalTtc, 0);

  const filteredInvoices = cafe.invoices.filter((i) => {
    if (filterMethod === "ALL") return true;
    return i.paymentMethod === filterMethod;
  });

  function handleCancel(invoiceId: string, number: number) {
    if (!confirm(`هل تريد إلغاء الفاتورة FAC-${new Date().getFullYear()}-${number} وإصدار إشعار دائن (Facture d'Avoir)؟`)) {
      return;
    }
    onCancelInvoice(cafe.id, invoiceId, number);
    setFeedback(`✓ تم إلغاء الفاتورة FAC-${new Date().getFullYear()}-${number} وقيد إشعار الدائن`);
    setTimeout(() => setFeedback(""), 4000);
  }

  function handleExportCsv() {
    alert(`تم تصدير سجل مبيعات ${cafe.name} (ICE: ${cafe.ice}) بصيغة CSV المتوافقة مع برامج المحاسبة.`);
  }

  return (
    <div className="accountant-view">
      {/* Top Header */}
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
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 900, margin: 0, color: "var(--primary-espresso)" }}>
            دفتر المبيعات والحسابات — {cafe.name}
          </h2>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            رقم الـ ICE: {cafe.ice} · السجل التجاري: {cafe.rc} · المعرف الضريبي: {cafe.taxId}
          </div>
        </div>

        <button className="btn-export" onClick={handleExportCsv} type="button">
          📥 تصدير السجل المحاسبي (Excel / CSV)
        </button>
      </div>

      {feedback && (
        <div
          style={{
            background: "var(--success-bg)",
            color: "var(--success)",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: 800,
            fontSize: "13px",
            marginBottom: "16px",
          }}
        >
          {feedback}
        </div>
      )}

      {/* Financial Metrics Summary */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">
            <span>المبيعات الصافية (HT)</span>
            <span>📑</span>
          </div>
          <div className="metric-value">{totalHt.toFixed(2)} د.م</div>
          <div className="metric-hint">القاعدة الخاضعة للضريبة</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>الضريبة المحصلة (TVA 10%)</span>
            <span>🏛️</span>
          </div>
          <div className="metric-value" style={{ color: "var(--caramel-gold)" }}>
            {totalVat.toFixed(2)} د.م
          </div>
          <div className="metric-hint">واجبة الأداء لإدارة الضرائب</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>المبيعات الإجمالية (TTC)</span>
            <span>💵</span>
          </div>
          <div className="metric-value">{totalTtc.toFixed(2)} د.م</div>
          <div className="metric-hint">إجمالي المقبوضات الموثقة</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>الفواتير المصرح بها</span>
            <span>✅</span>
          </div>
          <div className="metric-value">
            {validInvoices.length} <small style={{ fontSize: "14px", color: "var(--text-muted)" }}>/ {cafe.invoices.length}</small>
          </div>
          <div className="metric-hint">تسلسل رقمي بدون انقطاع</div>
        </div>
      </div>

      {/* Journal des Ventes Filter */}
      <div className="q-section-header" style={{ marginBottom: "14px" }}>
        <div>
          <h3>📋 دفتر مبيعات الفواتير الصادرة</h3>
          <p>سجل الفواتير المرتبطة قانونياً بـ ICE: {cafe.ice}</p>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          <button
            className={`cat-pill ${filterMethod === "ALL" ? "active" : ""}`}
            onClick={() => setFilterMethod("ALL")}
            type="button"
          >
            الكل
          </button>
          <button
            className={`cat-pill ${filterMethod === "CASH" ? "active" : ""}`}
            onClick={() => setFilterMethod("CASH")}
            type="button"
          >
            نقداً
          </button>
          <button
            className={`cat-pill ${filterMethod === "CARD" ? "active" : ""}`}
            onClick={() => setFilterMethod("CARD")}
            type="button"
          >
            بطاقة بنكية
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="q-table">
          <thead>
            <tr>
              <th>رقم الفاتورة</th>
              <th>التاريخ والوقت</th>
              <th>البيان / العميل</th>
              <th>طريقة الدفع</th>
              <th>المبلغ الصافي (HT)</th>
              <th>نسبة TVA</th>
              <th>مبلغ TVA</th>
              <th>المجموع الإجمالي (TTC)</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: "24px" }}>
                  لا توجد فواتير مسجلة في هذا المقهى حالياً.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 900, color: "var(--primary-espresso)" }}>
                    FAC-{inv.year}-{inv.number}
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{inv.date}</td>
                  <td>{inv.client}</td>
                  <td>
                    {inv.paymentMethod === "CASH" ? (
                      <span style={{ color: "var(--warm-roast)", fontWeight: 700 }}>💵 نقداً</span>
                    ) : (
                      <span style={{ color: "#2563eb", fontWeight: 700 }}>💳 بطاقة بنكية</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 700 }}>{inv.subtotalHt.toFixed(2)} د.م</td>
                  <td>10%</td>
                  <td style={{ color: "var(--caramel-gold)", fontWeight: 800 }}>
                    {inv.vatMad.toFixed(2)} د.م
                  </td>
                  <td style={{ fontWeight: 900, fontSize: "14px" }}>{inv.totalTtc.toFixed(2)} د.م</td>
                  <td>
                    {inv.status === "PAID" && <span className="badge-tag paid">مدفوعة</span>}
                    {inv.status === "ISSUED" && <span className="badge-tag issued">صادرة</span>}
                    {inv.status === "CANCELLED" && <span className="badge-tag cancelled">ملغاة (Avoir)</span>}
                  </td>
                  <td>
                    {inv.status !== "CANCELLED" ? (
                      <button
                        type="button"
                        onClick={() => handleCancel(inv.id, inv.number)}
                        style={{
                          background: "transparent",
                          color: "var(--danger)",
                          border: "1px solid var(--danger)",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        إلغاء وإصدار Avoir
                      </button>
                    ) : (
                      <span style={{ fontSize: "11px", color: "var(--text-light)" }}>تم الإشعار</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
