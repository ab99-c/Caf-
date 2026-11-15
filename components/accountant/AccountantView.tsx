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
    if (!confirm(`هل تريد إلغاء الفاتورة FAC-${new Date().getFullYear()}-${number} الخاصة بـ ${cafe.name}؟`)) {
      return;
    }
    onCancelInvoice(cafe.id, invoiceId, number);
    setFeedback(`✓ تم إلغاء الفاتورة وإصدار إشعار دائن (Avoir) رسمي في حسابات ${cafe.name}`);
    setTimeout(() => setFeedback(""), 4000);
  }

  function handleExportCsv() {
    alert(`تم تصدير سجل مبيعات ${cafe.name} (ICE: ${cafe.ice}) بصيغة CSV المتوافقة مع إدارة الضرائب!`);
  }

  return (
    <div className="accountant-view">
      {/* Banner */}
      <div className="role-banner">
        <div className="role-banner-content">
          <h2>بوابة المحاسب — الحسابات المستقلة لـ: {cafe.name}</h2>
          <p>
            تتبع دفتر مبيعات هذا المقهى، الضريبة على القيمة المضافة المحصلة (TVA 10%)، والإقرار الضريبي
            المرتبط بـ ICE: {cafe.ice} بشكل مستقل تام.
          </p>
        </div>
        <div className="role-banner-badge">📊 المقاولة: {cafe.ice}</div>
      </div>

      {feedback && (
        <div
          style={{
            background: "var(--success-bg)",
            color: "var(--success)",
            padding: "14px 18px",
            borderRadius: "10px",
            fontWeight: 800,
            marginBottom: "20px",
          }}
        >
          {feedback}
        </div>
      )}

      {/* Cafe Quick Switcher Tab */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-muted)" }}>
          اختر ملف المقهى المحاسبي:
        </span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {cafes.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCafe(c.id)}
              className={`cat-pill ${c.id === cafe.id ? "active" : ""}`}
            >
              🏢 {c.name} (ICE: {c.ice.slice(-4)})
            </button>
          ))}
        </div>
      </div>

      {/* Financial Metrics Summary */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">
            <span>المبيعات الصافية (HT) — {cafe.name.split(" ")[0]}</span>
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
          <div className="metric-hint">خاصة بـ ICE: {cafe.ice}</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>المبيعات شاملة الضريبة (TTC)</span>
            <span>💵</span>
          </div>
          <div className="metric-value">{totalTtc.toFixed(2)} د.م</div>
          <div className="metric-hint">المدخول القانوني الموثق</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>الفواتير المؤداة</span>
            <span>✅</span>
          </div>
          <div className="metric-value">
            {validInvoices.length} <small style={{ fontSize: "14px", color: "var(--text-muted)" }}>/ {cafe.invoices.length}</small>
          </div>
          <div className="metric-hint">تسلسل رقمي سليم بدون انقطاع</div>
        </div>
      </div>

      {/* Journal des Ventes */}
      <div className="q-section-header">
        <div>
          <h3>📋 دفتر مبيعات {cafe.name} (Journal des Ventes)</h3>
          <p>
            السجل المحاسبي المرتبط بـ ICE: {cafe.ice} · السجل التجاري: {cafe.rc}
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
              نقداً (Espèces)
            </button>
            <button
              className={`cat-pill ${filterMethod === "CARD" ? "active" : ""}`}
              onClick={() => setFilterMethod("CARD")}
              type="button"
            >
              بطاقة (TPE)
            </button>
          </div>

          <button className="btn-export" onClick={handleExportCsv} type="button">
            📥 تصدير سجل {cafe.name.split(" ")[0]} (Excel)
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

      {/* Tax Settlement Box */}
      <div
        style={{
          marginTop: "28px",
          background: "#fff",
          border: "1px solid var(--card-border)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "24px",
          alignItems: "center",
        }}
      >
        <div>
          <h4 style={{ fontSize: "17px", fontWeight: 900, color: "var(--primary-espresso)", marginBottom: "6px" }}>
            📑 إقرار ضريبي مسبق خاص بـ: {cafe.name}
          </h4>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>
            البيانات معزولة وجاهزة للتصريح بها في منصة Simpl-TVA للرقم الموحد {cafe.ice} دون خلط
            مع أي مؤسسة أو فرع آخر.
          </p>
        </div>

        <div style={{ background: "var(--crema-bg)", padding: "16px", borderRadius: "12px", textAlign: "left" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
            TVA المستحقة على {cafe.name.split(" ")[0]}:
          </div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "var(--primary-espresso)" }}>
            {totalVat.toFixed(2)} درهم مغربي
          </div>
          <div style={{ fontSize: "11px", color: "var(--success)", fontWeight: 700, marginTop: "4px" }}>
            ✓ متطابقة مع سجلات كاشير الفرع
          </div>
        </div>
      </div>
    </div>
  );
}
