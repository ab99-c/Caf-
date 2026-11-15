"use client";

import React, { useState } from "react";

interface InvoiceRecord {
  id: string;
  number: number;
  year: number;
  orderId: string;
  date: string;
  subtotalHt: number;
  vatMad: number;
  totalTtc: number;
  paymentMethod: "CASH" | "CARD";
  status: "PAID" | "ISSUED" | "CANCELLED";
  client: string;
}

const INITIAL_INVOICES: InvoiceRecord[] = [
  {
    id: "inv_1",
    number: 1041,
    year: 2026,
    orderId: "CMD-7712",
    date: "15/11/2026 09:15",
    subtotalHt: 25.45,
    vatMad: 2.55,
    totalTtc: 28.0,
    paymentMethod: "CASH",
    status: "PAID",
    client: "زبون كاونتر",
  },
  {
    id: "inv_2",
    number: 1042,
    year: 2026,
    orderId: "CMD-7713",
    date: "15/11/2026 09:40",
    subtotalHt: 50.0,
    vatMad: 5.0,
    totalTtc: 55.0,
    paymentMethod: "CARD",
    status: "PAID",
    client: "شركة الاستشارات الدولية",
  },
  {
    id: "inv_3",
    number: 1043,
    year: 2026,
    orderId: "CMD-7714",
    date: "15/11/2026 10:12",
    subtotalHt: 14.55,
    vatMad: 1.45,
    totalTtc: 16.0,
    paymentMethod: "CASH",
    status: "PAID",
    client: "زبون شرفة",
  },
  {
    id: "inv_4",
    number: 1044,
    year: 2026,
    orderId: "CMD-7715",
    date: "15/11/2026 11:05",
    subtotalHt: 109.09,
    vatMad: 10.91,
    totalTtc: 120.0,
    paymentMethod: "CARD",
    status: "PAID",
    client: "مكتب المحاماة الشرايبي",
  },
  {
    id: "inv_5",
    number: 1045,
    year: 2026,
    orderId: "CMD-7716",
    date: "15/11/2026 11:45",
    subtotalHt: 37.27,
    vatMad: 3.73,
    totalTtc: 41.0,
    paymentMethod: "CASH",
    status: "PAID",
    client: "زبون كاونتر",
  },
  {
    id: "inv_6",
    number: 1046,
    year: 2026,
    orderId: "CMD-7717",
    date: "15/11/2026 12:20",
    subtotalHt: 72.73,
    vatMad: 7.27,
    totalTtc: 80.0,
    paymentMethod: "CARD",
    status: "CANCELLED",
    client: "طلب ملغى (خطأ باريستا)",
  },
  {
    id: "inv_7",
    number: 1047,
    year: 2026,
    orderId: "CMD-7718",
    date: "15/11/2026 12:50",
    subtotalHt: 29.09,
    vatMad: 2.91,
    totalTtc: 32.0,
    paymentMethod: "CASH",
    status: "PAID",
    client: "زبون خارجي",
  },
];

export default function AccountantView() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [filterMethod, setFilterMethod] = useState<string>("ALL");
  const [feedback, setFeedback] = useState<string>("");

  const validInvoices = invoices.filter((i) => i.status !== "CANCELLED");

  const totalHt = validInvoices.reduce((sum, i) => sum + i.subtotalHt, 0);
  const totalVat = validInvoices.reduce((sum, i) => sum + i.vatMad, 0);
  const totalTtc = validInvoices.reduce((sum, i) => sum + i.totalTtc, 0);

  const filteredInvoices = invoices.filter((i) => {
    if (filterMethod === "ALL") return true;
    return i.paymentMethod === filterMethod;
  });

  function handleCancelInvoice(invoiceId: string, number: number) {
    if (!confirm(`هل تريد إلغاء الفاتورة FAC-2026-${number} وإصدار إشعار دائن (Facture d'Avoir) معتمد؟`)) {
      return;
    }

    setInvoices((prev) =>
      prev.map((i) => (i.id === invoiceId ? { ...i, status: "CANCELLED" } : i))
    );
    setFeedback(`✓ تم إلغاء الفاتورة FAC-2026-${number} وقيد إشعار الدائن في السجل المحاسبي`);
    setTimeout(() => setFeedback(""), 4000);
  }

  function handleExportCsv() {
    alert("تم تصدير سجل المبيعات والضريبة بصيغة CSV المتوافقة مع برامج المحاسبة (Sage, Odoo, Ciel)!");
  }

  return (
    <div className="accountant-view">
      {/* Banner */}
      <div className="role-banner">
        <div className="role-banner-content">
          <h2>بوابة المحاسب — دفتر المبيعات، تفصيل TVA والإقرارات الضريبية</h2>
          <p>
            متابعة السجلات المحاسبية الدقيقة، تفصيل القاعدة الخاضعة للضريبة (HT) ومبلغ الضريبة على
            القيمة المضافة (10% TVA)، مع إمكانية إلغاء الفواتير وإصدار إشعارات الخصم (Avoirs) وفق
            القانون المغربي.
          </p>
        </div>
        <div className="role-banner-badge">📊 صلاحيات المحاسب القانوني (ACCOUNTANT)</div>
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

      {/* Financial Metrics Summary */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">
            <span>إجمالي المبيعات الصافية (HT)</span>
            <span>📑</span>
          </div>
          <div className="metric-value">{totalHt.toFixed(2)} د.م</div>
          <div className="metric-hint">القاعدة الخاضعة للضريبة</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>مجموع الضريبة المحصلة (TVA 10%)</span>
            <span>🏛️</span>
          </div>
          <div className="metric-value" style={{ color: "var(--caramel-gold)" }}>
            {totalVat.toFixed(2)} د.م
          </div>
          <div className="metric-hint">واجبة الدفع لإدارة الضرائب (DGI)</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>إجمالي المبيعات شامل الضريبة (TTC)</span>
            <span>💵</span>
          </div>
          <div className="metric-value">{totalTtc.toFixed(2)} د.م</div>
          <div className="metric-hint">المدخول الإجمالي الموثق</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">
            <span>الفواتير المؤداة</span>
            <span>✅</span>
          </div>
          <div className="metric-value">
            {validInvoices.length} <small style={{ fontSize: "14px", color: "var(--text-muted)" }}>/ {invoices.length}</small>
          </div>
          <div className="metric-hint">تسلسل رقمي سليم 100%</div>
        </div>
      </div>

      {/* Journal des Ventes Header & Actions */}
      <div className="q-section-header">
        <div>
          <h3>📋 دفتر المبيعات اليومي (Journal des Ventes)</h3>
          <p>سجل الفواتير الصادرة المرتبطة بـ ICE: 001234567000089</p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* Filters */}
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
            📥 تصدير السجل (Excel/CSV)
          </button>
        </div>
      </div>

      {/* Invoices Table */}
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
            {filteredInvoices.map((inv) => (
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
                    <span style={{ color: "#2563eb", fontWeight: 700 }}>💳 بطاقة CMI</span>
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
                      onClick={() => handleCancelInvoice(inv.id, inv.number)}
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
            ))}
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
            📑 بيان الإقرار الضريبي الإلكتروني المسبق
          </h4>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>
            يتم تجهيز هذه البيانات تلقائياً للتوافق مع بوابة Simpl-TVA التابعة للمديرية العامة للضرائب،
            بحيث لا تتطلب أي إعادة إدخال يدوي.
          </p>
        </div>

        <div style={{ background: "var(--crema-bg)", padding: "16px", borderRadius: "12px", textAlign: "left" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
            صافي الضريبة المستحقة للتصريح:
          </div>
          <div style={{ fontSize: "26px", fontWeight: 900, color: "var(--primary-espresso)" }}>
            {totalVat.toFixed(2)} درهم مغربي
          </div>
          <div style={{ fontSize: "11px", color: "var(--success)", fontWeight: 700, marginTop: "4px" }}>
            ✓ متطابقة مع سجلات الصندوق والـ ICE
          </div>
        </div>
      </div>
    </div>
  );
}
