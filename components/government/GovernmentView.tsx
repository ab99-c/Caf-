"use client";

import React, { useState } from "react";

export default function GovernmentView() {
  const [searchInvoice, setSearchInvoice] = useState("");
  const [auditResult, setAuditResult] = useState<any | null>(null);

  function handleAudit() {
    if (!searchInvoice.trim()) return;

    // Simulation of official DGI verification
    const num = parseInt(searchInvoice.replace(/\D/g, "")) || 1045;
    setAuditResult({
      verified: true,
      invoiceRef: `FAC-2026-${num}`,
      ice: "001234567000089",
      establishment: "مقهى ومحمصة الأصالة S.A.R.L",
      date: "15/11/2026",
      subtotalHt: "37.27 د.م",
      vatRate: "10% (خدمات المقاهي والمشروبات)",
      vatMad: "3.73 د.م",
      totalTtc: "41.00 د.م",
      tamperProofHash: "SHA256: 4f8a81bc772e091d8e124fa10319bcf820938472",
      sequenceStatus: "متسلسلة وسليمة (بدون أي انقطاع في الأرقام)",
    });
  }

  return (
    <div className="government-view">
      {/* Official DGI Header Banner */}
      <div className="dgi-banner">
        <div className="dgi-title-wrap">
          <div className="dgi-seal">🏛️</div>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "4px" }}>
              المملكة المغربية — المديرية العامة للضرائب (DGI)
            </h2>
            <p style={{ fontSize: "13px", opacity: 0.9 }}>
              منصة المراقبة الجبائية الآلية والتحقق من الفوترة الإلكترونية للمقاهي والمطاعم
            </p>
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          نظام المراقبة عن بعد (Remote Audit System)
        </div>
      </div>

      {/* Tax Identity Cards */}
      <div className="dgi-info-grid">
        <div className="dgi-card verified">
          <div className="dgi-card-title">رقم التعريف الموحد للمقاولة (ICE)</div>
          <div className="dgi-card-value">001234567000089</div>
          <span className="dgi-card-code">✓ ساري المفعول ونظامي في السجل المركزي</span>
        </div>

        <div className="dgi-card">
          <div className="dgi-card-title">الرقم الضريبي (IF) ورقم السجل (RC)</div>
          <div className="dgi-card-value">IF: 12345678 · RC: 1001</div>
          <span className="dgi-card-code">محكمة التجارة - الدار البيضاء</span>
        </div>

        <div className="dgi-card">
          <div className="dgi-card-title">النظام الضريبي المطبق</div>
          <div className="dgi-card-value">TVA 10% (قانون المالية)</div>
          <span className="dgi-card-code">Prestations de boissons et restauration</span>
        </div>

        <div className="dgi-card verified">
          <div className="dgi-card-title">مؤشر سلامة التسلسل الرقمي</div>
          <div className="dgi-card-value" style={{ color: "#15803d" }}>
            100% متطابق
          </div>
          <span className="dgi-card-code">لا توجد أي فجوة تسلسلية (Gapless Sequence)</span>
        </div>
      </div>

      {/* Audit Tool Section */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #d0dbe5",
          borderRadius: "var(--radius-lg)",
          padding: "26px",
          marginBottom: "30px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="q-section-header" style={{ marginBottom: "18px" }}>
          <div>
            <h3 style={{ color: "var(--dgi-blue)" }}>
              🔍 أداة فحص وتدقيق الفواتير الفورية (Auditeur Fiscal)
            </h3>
            <p>أدخل رقم الفاتورة أو المعرف للتأكد من تسجيلها في السجل الرقمي غير القابل للتعديل</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", maxWidth: "600px" }}>
          <input
            type="text"
            placeholder="مثال: FAC-2026-1045 أو رقم الفاتورة 1045"
            value={searchInvoice}
            onChange={(e) => setSearchInvoice(e.target.value)}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            type="button"
            className="btn-export"
            onClick={handleAudit}
            style={{
              background: "var(--dgi-blue)",
              color: "#fff",
              border: "0",
              fontWeight: 800,
            }}
          >
            فحص المطابقة
          </button>
        </div>

        {auditResult && (
          <div
            style={{
              marginTop: "24px",
              background: "#f8fafc",
              border: "1px solid #94a3b8",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "12px",
                marginBottom: "14px",
              }}
            >
              <div>
                <strong style={{ fontSize: "16px", color: "var(--dgi-blue)" }}>
                  نتيجة فحص الفاتورة: {auditResult.invoiceRef}
                </strong>
                <span
                  style={{
                    marginRight: "10px",
                    background: "#dcfce7",
                    color: "#166534",
                    fontSize: "12px",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontWeight: 700,
                  }}
                >
                  ✓ فاتورة قانونية أصلية وموثقة
                </span>
              </div>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                التاريخ: {auditResult.date}
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "14px",
                fontSize: "13px",
              }}
            >
              <div>
                <span style={{ color: "#64748b" }}>المنشأة:</span>{" "}
                <strong>{auditResult.establishment}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>رقم ICE:</span>{" "}
                <strong>{auditResult.ice}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>المبلغ الصافي (HT):</span>{" "}
                <strong>{auditResult.subtotalHt}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>الضريبة المحصلة (TVA 10%):</span>{" "}
                <strong style={{ color: "var(--caramel-gold)" }}>{auditResult.vatMad}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>المجموع الإجمالي (TTC):</span>{" "}
                <strong style={{ color: "var(--dgi-blue)" }}>{auditResult.totalTtc}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>حالة التسلسل:</span>{" "}
                <strong style={{ color: "#166534" }}>{auditResult.sequenceStatus}</strong>
              </div>
            </div>

            <div
              style={{
                marginTop: "14px",
                paddingTop: "12px",
                borderTop: "1px dashed #cbd5e1",
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#475569",
              }}
            >
              البصمة الرقمية للتوثيق (Digital Seal): {auditResult.tamperProofHash}
            </div>
          </div>
        )}
      </div>

      {/* Inalterable Tax Audit Ledger */}
      <div className="q-section-header">
        <div>
          <h3 style={{ color: "var(--dgi-blue)" }}>
            📜 سجل الرقابة الضريبية المباشر (Audit Log Inaltérable)
          </h3>
          <p>تدفق المعاملات اللحظية المشفوعة بتوقيع رقمي يمنع أي تلاعب أو حذف</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="q-table">
          <thead>
            <tr>
              <th>التسلسل الجبائي</th>
              <th>التاريخ والوقت</th>
              <th>رقم الفاتورة</th>
              <th>رقم ICE للمنشأة</th>
              <th>المعاملة الصافية (HT)</th>
              <th>الضريبة المستحقة (TVA 10%)</th>
              <th>الإجمالي (TTC)</th>
              <th>طريقة التحصيل</th>
              <th>حالة المطابقة</th>
            </tr>
          </thead>
          <tbody>
            {[
              { seq: "#001047", time: "15/11/2026 12:50", ref: "FAC-2026-1047", ht: "29.09", vat: "2.91", ttc: "32.00", pay: "نقداً (درج)", status: "مطابق وموثق" },
              { seq: "#001046", time: "15/11/2026 12:20", ref: "FAC-2026-1046", ht: "72.73", vat: "7.27", ttc: "80.00", pay: "بطاقة بنكية", status: "إشعار دائن ملغى نظامياً" },
              { seq: "#001045", time: "15/11/2026 11:45", ref: "FAC-2026-1045", ht: "37.27", vat: "3.73", ttc: "41.00", pay: "نقداً (درج)", status: "مطابق وموثق" },
              { seq: "#001044", time: "15/11/2026 11:05", ref: "FAC-2026-1044", ht: "109.09", vat: "10.91", ttc: "120.00", pay: "بطاقة بنكية", status: "مطابق وموثق" },
              { seq: "#001043", time: "15/11/2026 10:12", ref: "FAC-2026-1043", ht: "14.55", vat: "1.45", ttc: "16.00", pay: "نقداً (درج)", status: "مطابق وموثق" },
            ].map((row, idx) => (
              <tr key={idx}>
                <td style={{ fontFamily: "monospace", fontWeight: 800 }}>{row.seq}</td>
                <td>{row.time}</td>
                <td style={{ fontWeight: 800 }}>{row.ref}</td>
                <td style={{ fontFamily: "monospace" }}>001234567000089</td>
                <td>{row.ht} د.م</td>
                <td style={{ color: "var(--caramel-gold)", fontWeight: 800 }}>{row.vat} د.م</td>
                <td style={{ fontWeight: 900 }}>{row.ttc} د.م</td>
                <td>{row.pay}</td>
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      background: row.status.includes("ملغى") ? "#fef3c7" : "#dcfce7",
                      color: row.status.includes("ملغى") ? "#b45309" : "#15803d",
                    }}
                  >
                    ✓ {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
