"use client";

import React, { useState } from "react";
import { AiOrchestrator, AiAuditResult } from "../../server/services/ai/aiOrchestrator";
import { CafeTenant } from "../portal/types";

interface ArchitectureViewProps {
  cafe: CafeTenant;
}

export default function ArchitectureView({ cafe }: ArchitectureViewProps) {
  const [testAmount, setTestAmount] = useState<number>(45);
  const [testIce, setTestIce] = useState<string>(cafe.ice);
  const [isSimulating, setIsSimulating] = useState(false);
  const [aiResult, setAiResult] = useState<AiAuditResult | null>(null);

  // Manual Review Queue (HITL items)
  const [reviewQueue, setReviewQueue] = useState([
    {
      id: "REV-901",
      cafeName: cafe.name,
      amount: "5,800 د.م",
      reason: "مبلغ مرتفع غير معتاد (تنبيه وكيل الاحتيال Fraud Agent)",
      confidence: "62%",
      time: "منذ 10 دقائق",
      status: "PENDING",
    },
    {
      id: "REV-902",
      cafeName: cafe.name,
      amount: "340 د.م",
      reason: "فارق حسابي طفيف في قاعدة الضريبة (تنبيه وكيل التدقيق Audit Agent)",
      confidence: "74%",
      time: "منذ 25 دقيقة",
      status: "PENDING",
    },
  ]);

  async function handleRunSimulation() {
    setIsSimulating(true);
    const subtotalHt = Math.round((testAmount / 1.1) * 100) / 100;
    const vatMad = Math.round((testAmount - subtotalHt) * 100) / 100;

    const result = await AiOrchestrator.evaluateTransaction({
      orderId: `SIM-${Date.now().toString().slice(-4)}`,
      cafeId: cafe.id,
      cafeIce: testIce,
      amountMad: testAmount,
      subtotalHt,
      vatMad,
      customerPhone: "+212661234567",
      items: [{ name: "طلب تجريبي لاختبار المعمارية", quantity: 1, price: testAmount }],
    });

    setAiResult(result);
    setIsSimulating(false);
  }

  function handleDecision(id: string, decision: "ACCEPTED" | "REJECTED") {
    setReviewQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: decision } : item))
    );
  }

  return (
    <div className="architecture-view">
      {/* Banner */}
      <div className="role-banner">
        <div className="role-banner-content">
          <h2>مخطط المعمارية المعتمدة ونظام الذكاء الاصطناعي (Enterprise Architecture)</h2>
          <p>
            تطبيق صارم لمخطط المنظومة: طبقة الواجهات (HITL)، بوابات الحماية (Gateways)، وكلاء الذكاء
            (LangGraph)، الخدمات المصغرة (Saga Microservices)، طابور الأحداث (Kafka/RabbitMQ)، وعزل
            قواعد البيانات (DB per Service).
          </p>
        </div>
        <div className="role-banner-badge">📐 المعمارية الرسمية للمشروع</div>
      </div>

      {/* 7 Architectural Pillars Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "14px",
          marginBottom: "30px",
        }}
      >
        <div className="metric-card" style={{ borderTop: "4px solid #1374ce" }}>
          <div className="metric-title">
            <span>1. Clients & HITL</span>
            <span>📱</span>
          </div>
          <div style={{ fontSize: "14px", fontWeight: 800, marginTop: "8px" }}>
            Next.js / Expo Mobile / POS / التدخل البشري
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            تجربة متعددة الأدوار مع عزل تام لكل مقهى
          </div>
        </div>

        <div className="metric-card" style={{ borderTop: "4px solid #8b5cf6" }}>
          <div className="metric-title">
            <span>2. Security & Gateways</span>
            <span>🛡️</span>
          </div>
          <div style={{ fontSize: "14px", fontWeight: 800, marginTop: "8px" }}>
            WAF / API Gateway / Rate Limiting
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            حماية البوابة وإدارة وتيرة الطلبات وتوثيق Swagger
          </div>
        </div>

        <div className="metric-card" style={{ borderTop: "4px solid #f59e0b" }}>
          <div className="metric-title">
            <span>3. AI Agents (LangGraph)</span>
            <span>🤖</span>
          </div>
          <div style={{ fontSize: "14px", fontWeight: 800, marginTop: "8px" }}>
            Audit Agent & Fraud Agent
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            تدقيق ضريبي، كشف احتيال، وحجب البيانات الحساسة
          </div>
        </div>

        <div className="metric-card" style={{ borderTop: "4px solid #10b981" }}>
          <div className="metric-title">
            <span>4. Microservices (Saga)</span>
            <span>⚙️</span>
          </div>
          <div style={{ fontSize: "14px", fontWeight: 800, marginTop: "8px" }}>
            Commerce / Payments / TradeTax Core
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            تنسيق المعاملات بنمط Saga لضمان الاتساق
          </div>
        </div>

        <div className="metric-card" style={{ borderTop: "4px solid #ec4899" }}>
          <div className="metric-title">
            <span>5. Message Queue</span>
            <span>📬</span>
          </div>
          <div style={{ fontSize: "14px", fontWeight: 800, marginTop: "8px" }}>
            RabbitMQ / Apache Kafka Broker
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            طابور رسائل للأحداث اللحظية غير المتزامنة
          </div>
        </div>

        <div className="metric-card" style={{ borderTop: "4px solid #3b82f6" }}>
          <div className="metric-title">
            <span>6. DB Per Service</span>
            <span>🗄️</span>
          </div>
          <div style={{ fontSize: "14px", fontWeight: 800, marginTop: "8px" }}>
            PostgreSQL / MongoDB / Redis Cache
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            عزل كامل لقواعد البيانات ومطابقة ACID
          </div>
        </div>

        <div className="metric-card" style={{ borderTop: "4px solid #06b6d4" }}>
          <div className="metric-title">
            <span>7. Observability</span>
            <span>📊</span>
          </div>
          <div style={{ fontSize: "14px", fontWeight: 800, marginTop: "8px" }}>
            Langfuse / CloudWatch / Datadog
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            تتبع أداء الوكلاء ورصد الهلوسة والـ Tracing
          </div>
        </div>
      </div>

      {/* Interactive AI Agent & LangGraph Sandbox */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--card-border)",
          borderRadius: "var(--radius-lg)",
          padding: "26px",
          marginBottom: "30px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="q-section-header" style={{ marginBottom: "16px" }}>
          <div>
            <h3>🤖 منصة اختبار وكلاء الذكاء الاصطناعي (LangGraph AI Sandbox)</h3>
            <p>
              تجربة عملية لتدفق المعاملة عبر وكيل التدقيق (Audit Agent) ووكيل مكافحة التلاعب (Fraud Agent)
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "12px", alignItems: "flex-end" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
              مبلغ المعاملة للتجربة (درهم مغربي):
            </label>
            <input
              type="number"
              value={testAmount}
              onChange={(e) => setTestAmount(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: 800, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
              رقم الـ ICE الخاص بالمقهى:
            </label>
            <input
              type="text"
              value={testIce}
              onChange={(e) => setTestIce(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                fontFamily: "monospace",
              }}
            />
          </div>

          <button
            type="button"
            className="btn-checkout"
            style={{ margin: 0, padding: "12px 24px" }}
            onClick={handleRunSimulation}
            disabled={isSimulating}
          >
            {isSimulating ? "جارٍ التدقيق الذكي..." : "🚀 تشغيل فحص LangGraph"}
          </button>
        </div>

        {aiResult && (
          <div
            style={{
              marginTop: "20px",
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <strong style={{ fontSize: "16px", color: "var(--primary-espresso)" }}>
                  نتيجة فحص وكلاء الذكاء الاصطناعي:
                </strong>
                <span
                  style={{
                    marginRight: "10px",
                    background: aiResult.passed ? "#dcfce7" : "#fef3c7",
                    color: aiResult.passed ? "#166534" : "#b45309",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 800,
                  }}
                >
                  {aiResult.passed ? "✓ مقبولة آلياً (Confidence High)" : "⚠️ تتطلب مراجعة بشرية (HITL)"}
                </span>
              </div>
              <div style={{ fontSize: "13px", fontWeight: 800 }}>
                نسبة الثقة (Confidence Score):{" "}
                <span style={{ color: aiResult.confidenceScore >= 0.85 ? "#166534" : "#b45309", fontSize: "16px" }}>
                  {(aiResult.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "13px" }}>
              {/* Audit Agent */}
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "14px", borderRadius: "8px" }}>
                <h5 style={{ fontSize: "13px", fontWeight: 800, color: "#1e40af", marginBottom: "6px" }}>
                  🔍 وكيل التدقيق الجبائي (Audit Agent)
                </h5>
                <div>مطابقة الـ ICE (15 رقماً): <strong>{aiResult.auditAgentVerdict.iceVerified ? "✓ مطابق" : "❌ غير مطابق"}</strong></div>
                <div>صحة حسابات TVA 10%: <strong>{aiResult.auditAgentVerdict.vatMathValid ? "✓ صحيحة" : "❌ غير دقيقة"}</strong></div>
                <div style={{ marginTop: "4px", color: "var(--text-muted)" }}>{aiResult.auditAgentVerdict.notes}</div>
              </div>

              {/* Fraud Agent */}
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "14px", borderRadius: "8px" }}>
                <h5 style={{ fontSize: "13px", fontWeight: 800, color: "#b45309", marginBottom: "6px" }}>
                  🛡️ وكيل كشف التلاعب (Fraud Agent)
                </h5>
                <div>مستوى الخطر: <strong>{aiResult.fraudAgentVerdict.riskLevel}</strong></div>
                <div>شذوذ في الحجم: <strong>{aiResult.fraudAgentVerdict.anomalyDetected ? "نعم (مبلغ مرتفع)" : "لا (طبيعي)"}</strong></div>
                <div style={{ marginTop: "4px", color: "var(--text-muted)" }}>{aiResult.fraudAgentVerdict.notes}</div>
              </div>
            </div>

            <div
              style={{
                marginTop: "14px",
                paddingTop: "10px",
                borderTop: "1px dashed #cbd5e1",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "#64748b",
                fontFamily: "monospace",
              }}
            >
              <span>بيانات مشفرة ومحجوبة (Masked Phone): {aiResult.maskedData.maskedPhone}</span>
              <span>Langfuse Observability Trace ID: {aiResult.langfuseTraceId}</span>
            </div>
          </div>
        )}
      </div>

      {/* Human-in-the-Loop Review Queue (لوحة المحاسب - التدخل البشري) */}
      <div className="q-section-header">
        <div>
          <h3>🧑‍💼 طابور التدخل البشري والمراجعة اليدوية (HITL - Manual Review Queue)</h3>
          <p>
            المعاملات التي شك فيها وكيل الذكاء الاصطناعي (Confidence &lt; 85%) تحول للمحاسب/المسير لقرار القبول أو الرفض
          </p>
        </div>
        <span className="badge-tag issued">
          {reviewQueue.filter((q) => q.status === "PENDING").length} حالات قيد الانتظار
        </span>
      </div>

      <div className="table-responsive">
        <table className="q-table">
          <thead>
            <tr>
              <th>رقم المعاملة</th>
              <th>المقهى</th>
              <th>المبلغ</th>
              <th>سبب الإحالة للتدخل البشري</th>
              <th>نسبة ثقة الـ AI</th>
              <th>الوقت</th>
              <th>قرار المحاسب (Human Decision)</th>
            </tr>
          </thead>
          <tbody>
            {reviewQueue.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 800, fontFamily: "monospace" }}>{item.id}</td>
                <td>{item.cafeName}</td>
                <td style={{ fontWeight: 900 }}>{item.amount}</td>
                <td style={{ color: "#b45309", fontSize: "12px" }}>{item.reason}</td>
                <td style={{ fontWeight: 800 }}>{item.confidence}</td>
                <td style={{ color: "var(--text-muted)" }}>{item.time}</td>
                <td>
                  {item.status === "PENDING" ? (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => handleDecision(item.id, "ACCEPTED")}
                        style={{
                          background: "#16a34a",
                          color: "#fff",
                          border: 0,
                          borderRadius: "6px",
                          padding: "5px 10px",
                          fontSize: "11px",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        ✓ قبول المعاملة
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecision(item.id, "REJECTED")}
                        style={{
                          background: "#dc2626",
                          color: "#fff",
                          border: 0,
                          borderRadius: "6px",
                          padding: "5px 10px",
                          fontSize: "11px",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        ✕ رفض وحظر
                      </button>
                    </div>
                  ) : item.status === "ACCEPTED" ? (
                    <span className="badge-tag paid">✓ تم القبول بشرياً</span>
                  ) : (
                    <span className="badge-tag cancelled">✕ تم الرفض بشرياً</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
