"use client";

import React from "react";

export type PortalRole = "CUSTOMER" | "CAFE_OWNER" | "ACCOUNTANT" | "TAX_AUDITOR";

interface PortalHeaderProps {
  currentRole: PortalRole;
  onSelectRole: (role: PortalRole) => void;
  cartCount: number;
  onOpenCart?: () => void;
}

export default function PortalHeader({
  currentRole,
  onSelectRole,
  cartCount,
  onOpenCart,
}: PortalHeaderProps) {
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
            <span>Qahwati Enterprise</span>
          </div>
        </div>

        <div className="q-header-status">
          <div className="q-status-pill">
            <span className="q-status-dot"></span>
            <span>نظام التشغيل: حي ومباشر (v2.0)</span>
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
