import React from "react";

export function Button({ children = "Primary Button" }) {
  return (
    <button
      style={{
        background: "var(--color-brand-primary)",
        color: "var(--color-text-inverse, #ffffff)",
        borderRadius: "var(--radius-card, 12px)",
        padding: "var(--spacing-md, 16px)",
        fontFamily: "var(--font-family-base, Inter)"
      }}
      className="font-semibold shadow-md transition hover:opacity-90"
    >
      {children}
    </button>
  );
}