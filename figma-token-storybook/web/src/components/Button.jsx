import React from "react";

export function Button({
  children = "Primary Button",
  background = "var(--color-brand-primary, #111827)",
  color = "var(--color-text-inverse, #ffffff)",
  fontSize = "16px",
  fontFamily = "var(--font-family-base, Inter)",
  borderRadius = "var(--radius-card, 12px)",
  padding = "var(--spacing-md, 16px)",
  fontWeight = 600,
  boxShadow = "0 4px 14px rgba(15, 23, 42, 0.15)",
  letterSpacing = "0px"
}) {
  return (
    <button
      style={{
        background,
        color,
        borderRadius,
        padding,
        fontFamily,
        fontSize,
        fontWeight,
        boxShadow,
        letterSpacing
      }}
      className="font-semibold shadow-md transition hover:opacity-90"
    >
      {children}
    </button>
  );
}