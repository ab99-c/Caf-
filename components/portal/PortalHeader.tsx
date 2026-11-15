"use client";

import React from "react";
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
  const selectedCafe = cafes.find((c) => c.id === selectedCafeId) || cafes[0];

  const roles = [
    {
      id: "CUSTOMER" as PortalRole,
      title: "الزبون",
      sub: "Client / Commande",
      icon: "☕",
      badge: "تطبيق الزبائن",
    },
    {
      id: "CAFE_OWNER" as PortalRole,
      title: "صاحب المقهى",
      sub: "Gérant / Caisse & POS",
      icon: "🏪",
      badge: "نقطة البيع والطلبات",
    },
    {
      id: "ACCOUNTANT" as PortalRole,
      title: "المحاسب",
      sub: "Comptable / TVA & Factures",
      icon: "📊",
      badge: "دفتر المبيعات والضرائب",
    },
    {
      id: "TAX_AUDITOR" as PortalRole,
      title: "المراقبة الجبائية / الحكومة",
      sub: "DGI / Audit & ICE",
      icon: "🏛️",
      badge: "المطابقة القانونية",
    },
  ];

  return (
    <header className="q-header">
      {/* Top Navbar */}
      <div className="q-header-top">
        <div className="q-brand">
          <div className="q-brand-logo">☕</div>
          <div className="q-brand-text">
            <h1>قهوتي</h1>
            <span>Qahwati Multi-Tenant System</span>
          </div>
        </div>

        {/* Cafe Isolation Switcher ("Koula 9hwa msta9la 3la loukhra") */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#fff",
            border: "1px solid var(--card-border)",
            borderRadius: "12px",
            padding: "4px 12px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span style={{ fontSize: "16px" }}>🏪</span>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700 }}>
              المقهى النشط حالياً:
            </div>
            <select
              value={selectedCafeId}
              onChange={(e) => onSelectCafe(e.target.value)}
              style={{
                border: "0",
                outline: "none",
                fontWeight: 900,
                fontSize: "13px",
                color: "var(--primary-espresso)",
                background: "transparent",
                cursor: "pointer",
                padding: "2px 0",
              }}
            >
              {cafes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.city}
                </option>
              ))}
            </select>
          </div>
          <span
            style={{
              fontSize: "10px",
              background: "var(--amber-soft)",
              color: "var(--warm-roast)",
              fontWeight: 800,
              padding: "4px 8px",
              borderRadius: "6px",
            }}
          >
            🔒 بيانات مستقلة
          </span>
        </div>

        <div className="q-header-status">
          <div className="q-status-pill">
            <span className="q-status-dot"></span>
            <span>نظام التشغيل: عزل تام للبيانات (Multi-Tenant)</span>
          </div>

          {currentRole === "CUSTOMER" && (
            <button
              className="btn-add"
              onClick={onOpenCart}
              style={{ padding: "8px 16px", borderRadius: "999px" }}
            >
              🛒 السلة ({cartCount})
            </button>
          )}
        </div>
      </div>

      {/* Role Navigation Bar - "Koul Wa7id Ira Itjahah" */}
      <nav className="q-role-nav" aria-label="أدوار المنظومة">
        <div className="q-role-container">
          {roles.map((r) => {
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                className={`q-role-btn ${isActive ? "active" : ""}`}
                onClick={() => onSelectRole(r.id)}
                type="button"
              >
                <span className="role-icon">{r.icon}</span>
                <span>{r.title}</span>
                <span className="role-tag">{r.badge}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
