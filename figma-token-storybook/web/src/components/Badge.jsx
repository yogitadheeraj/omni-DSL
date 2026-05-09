import React from "react";
import { statusVariants } from "./componentTokens";

export function Badge({ children = "Synced", variant = "info" }) {
  const style = statusVariants[variant] ?? statusVariants.info;

  return (
    <span
      style={{
        ...style,
        borderRadius: "var(--radius-full, 999px)",
        padding: "var(--spacing-xs, 4px) var(--spacing-sm, 8px)",
        fontSize: "var(--font-size-xs, 12px)",
        fontWeight: "var(--font-weight-semibold, 600)",
        fontFamily: "var(--font-family-base, Inter)",
      }}
      className="inline-flex items-center"
    >
      {children}
    </span>
  );
}