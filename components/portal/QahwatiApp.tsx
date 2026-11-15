"use client";

import React, { useState } from "react";
import PortalHeader, { PortalRole } from "./PortalHeader";
import CustomerView, { CreatedOrder } from "../customer/CustomerView";
import OwnerView from "../owner/OwnerView";
import AccountantView from "../accountant/AccountantView";
import GovernmentView from "../government/GovernmentView";

export default function QahwatiApp() {
  const [currentRole, setCurrentRole] = useState<PortalRole>("CUSTOMER");
  const [cartCount, setCartCount] = useState(2); // Initial demo items in cart

  function handleOrderCreated(order: CreatedOrder) {
    setCartCount(0);
  }

  function handleOpenCart() {
    // Scroll smoothly to cart section if in customer view
    if (currentRole !== "CUSTOMER") {
      setCurrentRole("CUSTOMER");
      setTimeout(() => {
        document.getElementById("cart-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById("cart-section")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="qahwati-app">
      {/* Universal Header with Role Switcher ("Koul Wa7id Ira Itjahah") */}
      <PortalHeader
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        cartCount={cartCount}
        onOpenCart={handleOpenCart}
      />

      {/* Main View Portals */}
      <main className="q-main">
        {currentRole === "CUSTOMER" && (
          <CustomerView onOrderCreated={handleOrderCreated} />
        )}

        {currentRole === "CAFE_OWNER" && (
          <OwnerView />
        )}

        {currentRole === "ACCOUNTANT" && (
          <AccountantView />
        )}

        {currentRole === "TAX_AUDITOR" && (
          <GovernmentView />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--card-border)",
          background: "#1a0f0a",
          color: "#c9b8aa",
          padding: "32px 24px",
          textAlign: "center",
          fontSize: "13px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>☕</span>
            <strong style={{ color: "#fff" }}>منصة قهوتي (Qahwati Enterprise)</strong>
            <span>— معمارية موحدة لخدمة الزبون، صاحب المقهى، المحاسب، والمراقبة الجبائية</span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--amber-light)" }}>
            نظام فوترة مغربي معتمد · ICE: 001234567000089 · TVA 10%
          </div>
        </div>
      </footer>
    </div>
  );
}
