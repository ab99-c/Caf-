"use client";

import React, { useState } from "react";
import PortalHeader from "./PortalHeader";
import CustomerView, { CreatedOrder } from "../customer/CustomerView";
import OwnerView from "../owner/OwnerView";
import AccountantView from "../accountant/AccountantView";
import GovernmentView from "../government/GovernmentView";
import ArchitectureView from "../architecture/ArchitectureView";
import {
  PortalRole,
  CafeTenant,
  INITIAL_CAFES,
  LiveTicket,
  InvoiceRecord,
} from "./types";

export default function QahwatiApp() {
  const [currentRole, setCurrentRole] = useState<PortalRole>("CUSTOMER");
  const [cafes, setCafes] = useState<CafeTenant[]>(INITIAL_CAFES);
  const [selectedCafeId, setSelectedCafeId] = useState<string>("cafe_casa");
  const [cartCount, setCartCount] = useState(0);

  const selectedCafe = cafes.find((c) => c.id === selectedCafeId) || cafes[0];

  function handleSelectCafe(cafeId: string) {
    setSelectedCafeId(cafeId);
  }

  function handleOrderCreated(cafeId: string, order: CreatedOrder) {
    setCartCount(0);

    // Update the specific cafe with this new ticket and invoice
    setCafes((prev) =>
      prev.map((c) => {
        if (c.id !== cafeId) return c;

        const newTicket: LiveTicket = {
          id: order.id,
          tableOrClient: order.tableNumber
            ? `📱 هاتف: ${order.tableNumber}`
            : "طلب إلكتروني (الزبون)",
          items: order.items.map((it) => `${it.quantity}x ${it.name}`),
          totalMad: order.totalTtc,
          time: "الآن",
          status: "NEW",
          paymentMethod: order.paymentMethod,
          tableNumber: order.tableNumber,
          isPhoneOrder: Boolean(order.tableNumber),
          notes: order.customerNote,
        };

        const newInvoice: InvoiceRecord = {
          id: `inv_${Date.now()}`,
          number: order.invoiceNumber,
          year: new Date().getFullYear(),
          orderId: order.id,
          date: new Date().toLocaleString("fr-MA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          subtotalHt: order.subtotalHt,
          vatMad: order.vatMad,
          totalTtc: order.totalTtc,
          paymentMethod: order.paymentMethod,
          status: "PAID",
          client: order.tableNumber ? `زبون هاتف (${order.tableNumber})` : "زبون تطبيق قهوتي",
        };

        const isCash = order.paymentMethod === "CASH";

        return {
          ...c,
          tickets: [newTicket, ...c.tickets],
          invoices: [newInvoice, ...c.invoices],
          cashSession: {
            ...c.cashSession,
            cashSales: isCash ? c.cashSession.cashSales + order.totalTtc : c.cashSession.cashSales,
            cardSales: !isCash ? c.cashSession.cardSales + order.totalTtc : c.cashSession.cardSales,
          },
        };
      })
    );
  }

  function handleUpdateTicket(cafeId: string, ticketId: string, status: LiveTicket["status"]) {
    setCafes((prev) =>
      prev.map((c) => {
        if (c.id !== cafeId) return c;
        return {
          ...c,
          tickets: c.tickets.map((t) => (t.id === ticketId ? { ...t, status } : t)),
        };
      })
    );
  }

  function handleAddQuickPosOrder(cafeId: string, productName: string, price: number) {
    setCafes((prev) =>
      prev.map((c) => {
        if (c.id !== cafeId) return c;
        const newTicket: LiveTicket = {
          id: `POS-${Math.floor(100 + Math.random() * 900)}`,
          tableOrClient: "كاونتر الكاشير المباشر",
          items: [`1x ${productName}`],
          totalMad: price,
          time: "الآن",
          status: "PREPARING",
          paymentMethod: "CASH",
        };
        return {
          ...c,
          tickets: [newTicket, ...c.tickets],
          cashSession: {
            ...c.cashSession,
            cashSales: c.cashSession.cashSales + price,
          },
        };
      })
    );
  }

  function handleCloseSession(cafeId: string) {
    setCafes((prev) =>
      prev.map((c) => {
        if (c.id !== cafeId) return c;
        return {
          ...c,
          cashSession: {
            ...c.cashSession,
            isOpen: false,
          },
        };
      })
    );
  }

  function handleOpenSession(cafeId: string) {
    setCafes((prev) =>
      prev.map((c) => {
        if (c.id !== cafeId) return c;
        return {
          ...c,
          cashSession: {
            isOpen: true,
            sessionNumber: `SES-${c.id.slice(5, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`,
            openingBalance: 500,
            cashSales: 0,
            cardSales: 0,
            openedAt: new Date().toLocaleTimeString("ar-MA", { hour: "2-digit", minute: "2-digit" }),
          },
        };
      })
    );
  }

  function handleCancelInvoice(cafeId: string, invoiceId: string, number: number) {
    setCafes((prev) =>
      prev.map((c) => {
        if (c.id !== cafeId) return c;
        return {
          ...c,
          invoices: c.invoices.map((inv) =>
            inv.id === invoiceId ? { ...inv, status: "CANCELLED" as const } : inv
          ),
        };
      })
    );
  }

  function handleOpenCart() {
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
      {/* Universal Header with Role Switcher and Multi-Tenant Cafe Switcher */}
      <PortalHeader
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        cartCount={cartCount}
        onOpenCart={handleOpenCart}
        cafes={cafes}
        selectedCafeId={selectedCafeId}
        onSelectCafe={handleSelectCafe}
      />

      {/* Main View Portals — Completely Isolated Per Cafe */}
      <main className="q-main">
        {currentRole === "CUSTOMER" && (
          <CustomerView
            cafe={selectedCafe}
            cafes={cafes}
            onSelectCafe={handleSelectCafe}
            onOrderCreated={handleOrderCreated}
          />
        )}

        {currentRole === "CAFE_OWNER" && (
          <OwnerView
            cafe={selectedCafe}
            cafes={cafes}
            onSelectCafe={handleSelectCafe}
            onUpdateTicket={handleUpdateTicket}
            onAddQuickPosOrder={handleAddQuickPosOrder}
            onCloseSession={handleCloseSession}
            onOpenSession={handleOpenSession}
          />
        )}

        {currentRole === "ACCOUNTANT" && (
          <AccountantView
            cafe={selectedCafe}
            cafes={cafes}
            onSelectCafe={handleSelectCafe}
            onCancelInvoice={handleCancelInvoice}
          />
        )}

        {currentRole === "TAX_AUDITOR" && (
          <GovernmentView
            cafe={selectedCafe}
            cafes={cafes}
            onSelectCafe={handleSelectCafe}
          />
        )}

        {currentRole === "ARCHITECTURE" && (
          <ArchitectureView cafe={selectedCafe} />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--card-border)",
          background: "#1a0f0a",
          color: "#9a8b7f",
          padding: "20px 24px",
          textAlign: "center",
          fontSize: "12px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>☕</span>
            <strong style={{ color: "#fff" }}>منصة قهوتي (Qahwati)</strong>
            <span>— نظام الطلب والفوترة السحابية للمقاهي</span>
          </div>
          <div>
            نظام متوافق مع المعايير الجبائية المغربية · ICE & TVA 10%
          </div>
        </div>
      </footer>
    </div>
  );
}
