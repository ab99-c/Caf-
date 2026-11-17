"use client";

import React, { useState } from "react";
import { PortalRole, CafeTenant } from "./types";

interface PortalHeaderProps {
  currentRole: PortalRole;
  onSelectRole: (role: PortalRole) => void;
  cartCount: number;
  onOpenCart?: () => void;
  cafes: CafeTenant[];
  selectedCafeId: string;
  onSelectCafe: (cafeId: string) => void;
}

export default function PortalHeader({
  currentRole,
  onSelectRole,
  cartCount,
  onOpenCart,
  cafes,
  selectedCafeId,
  onSelectCafe,
}: PortalHeaderProps) {
  const [showPortalGate, setShowPortalGate] = useState(false);
  const selectedCafe = cafes.find((c) => c.id === selectedCafeId) || cafes[0];

  function handleSwitch(role: PortalRole) {
    onSelectRole(role);
    setShowPortalGate(false);
  }

  return (
    <>
      <header className="q-header">
        <div className="q-header-top">
          {/* Logo & Current Space Indicator */}
          <div className="q-brand">
            <div className="q-brand-logo">☕</div>
            <div className="q-brand-text">
              <h1>قهوتي</h1>
              <span>
                {currentRole === "CUSTOMER" && "تطبيق الطلب والمقاهي"}
                {currentRole === "CAFE_OWNER" && `كاشير ومطبخ — ${selectedCafe.name}`}
                {currentRole === "ACCOUNTANT" && "فضاء المحاسب القانوني"}
                {currentRole === "TAX_AUDITOR" && "المديرية العامة للضرائب (DGI)"}
              </span>
            </div>
          </div>

          {/* Center: Cafe selector visible only for Owner / Accountant / DGI or Customer exploring */}
          {currentRole !== "CUSTOMER" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#fff",
                border: "1px solid var(--card-border)",
                borderRadius: "10px",
                padding: "6px 14px",
                fontSize: "13px",
              }}
            >
              <span style={{ fontWeight: 800 }}>المؤسسة:</span>
              <select
                value={selectedCafeId}
                onChange={(e) => onSelectCafe(e.target.value)}
                style={{
                  border: 0,
                  outline: "none",
                  fontWeight: 900,
                  color: "var(--primary-espresso)",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                {cafes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city.split(" ")[0]})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#fff",
                border: "1px solid var(--card-border)",
                borderRadius: "999px",
                padding: "4px 14px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              <span>📍 تطلب حالياً من:</span>
              <strong style={{ color: "var(--caramel-gold)" }}>{selectedCafe.name}</strong>
            </div>
          )}

          {/* Right Action: Cart for customer, or switch portal gate */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {currentRole === "CUSTOMER" && (
              <button
                type="button"
                className="btn-add"
                onClick={onOpenCart}
                style={{ padding: "8px 18px", borderRadius: "999px" }}
              >
                🛒 السلة ({cartCount})
              </button>
            )}

            {/* Portal Switcher Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowPortalGate(true)}
              style={{
                background: currentRole === "TAX_AUDITOR" ? "#0f3d63" : "var(--primary-espresso)",
                color: "#fff",
                border: 0,
                borderRadius: "10px",
                padding: "8px 14px",
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>🔐</span>
              <span>
                {currentRole === "CUSTOMER" ? "فضاء المهنيين و DGI" : "تبديل الفضاء"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Discrete Secure Gate Modal (عزل الأدوار: لا يرى أي طرف واجهة الآخر إلا بالدخول المخصص) */}
      {showPortalGate && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: "20px",
          }}
          onClick={() => setShowPortalGate(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "28px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 900, color: "var(--primary-espresso)", margin: 0 }}>
                  بوابة الدخول المعزولة (Accès Sécurisé)
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "4px 0 0" }}>
                  كل مستخدم يدخل لفضاء العمل المخصص له فقط
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPortalGate(false)}
                style={{
                  background: "transparent",
                  border: 0,
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* 1. Customer */}
              <button
                type="button"
                onClick={() => handleSwitch("CUSTOMER")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px",
                  borderRadius: "12px",
                  border: currentRole === "CUSTOMER" ? "2px solid var(--caramel-gold)" : "1px solid #e2d9cf",
                  background: currentRole === "CUSTOMER" ? "#fbf6f0" : "#fff",
                  cursor: "pointer",
                  textAlign: "right",
                  width: "100%",
                }}
              >
                <span style={{ fontSize: "28px" }}>☕</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: "14px", color: "var(--primary-espresso)" }}>
                    تطبيق الزبون (Espace Client)
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    طلب فوري من الطاولة عبر الهاتف، استعراض المنيو وتتبع الطلب
                  </div>
                </div>
              </button>

              {/* 2. Cafe Owner */}
              <button
                type="button"
                onClick={() => handleSwitch("CAFE_OWNER")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px",
                  borderRadius: "12px",
                  border: currentRole === "CAFE_OWNER" ? "2px solid var(--caramel-gold)" : "1px solid #e2d9cf",
                  background: currentRole === "CAFE_OWNER" ? "#fbf6f0" : "#fff",
                  cursor: "pointer",
                  textAlign: "right",
                  width: "100%",
                }}
              >
                <span style={{ fontSize: "28px" }}>🏪</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: "14px", color: "var(--primary-espresso)" }}>
                    فضاء صاحب المقهى والكاشير (Espace Gérant & POS)
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    نقطة البيع، شاشة الباريستا للطلبات الحية، وإدارة صندوق الكاش
                  </div>
                </div>
              </button>

              {/* 3. Accountant */}
              <button
                type="button"
                onClick={() => handleSwitch("ACCOUNTANT")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px",
                  borderRadius: "12px",
                  border: currentRole === "ACCOUNTANT" ? "2px solid var(--caramel-gold)" : "1px solid #e2d9cf",
                  background: currentRole === "ACCOUNTANT" ? "#fbf6f0" : "#fff",
                  cursor: "pointer",
                  textAlign: "right",
                  width: "100%",
                }}
              >
                <span style={{ fontSize: "28px" }}>💼</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: "14px", color: "var(--primary-espresso)" }}>
                    فضاء المحاسب القانوني (Espace Comptable)
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    دفتر المبيعات اليومي، الضريبة TVA 10%، وإصدار إشعارات الخصم Avoir
                  </div>
                </div>
              </button>

              {/* 4. Tax Auditor / Government */}
              <button
                type="button"
                onClick={() => handleSwitch("TAX_AUDITOR")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px",
                  borderRadius: "12px",
                  border: currentRole === "TAX_AUDITOR" ? "2px solid #0f3d63" : "1px solid #cbd5e1",
                  background: currentRole === "TAX_AUDITOR" ? "#f0f7ff" : "#fff",
                  cursor: "pointer",
                  textAlign: "right",
                  width: "100%",
                }}
              >
                <span style={{ fontSize: "28px" }}>🏛️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: "14px", color: "#0f3d63" }}>
                    المديرية العامة للضرائب (Portail DGI)
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    المراقبة الجبائية الرسمية، التحقق من ICE و TVA والتسلسل اللامتغير
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
