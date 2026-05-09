import React from "react";

export function Card({ title = "Card Title", description = "Card description goes here.", children }) {
  return (
    <div
      style={{
        background: "var(--color-surface-default, #ffffff)",
        color: "var(--color-text-default, #111827)",
        border: "1px solid var(--color-border-default, #e5e7eb)",
        borderRadius: "var(--radius-xl, 24px)",
        padding: "var(--spacing-lg, 24px)",
        boxShadow: "var(--shadow-card, 0 10px 30px rgba(15,23,42,0.08))",
        fontFamily: "var(--font-family-base, Inter)",
      }}
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 opacity-70">{description}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}