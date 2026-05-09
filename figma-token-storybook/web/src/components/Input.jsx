import React from "react";
import { sizes } from "./componentTokens";

export function Input({
  label = "Label",
  placeholder = "Enter value",
  size = "md",
  radius = "md",
  error = "",
  disabled = false,
}) {
  const sizeStyle = sizes[size] ?? sizes.md;

  return (
    <label className="block w-full">
      <span
        className="mb-2 block font-semibold"
        style={{
          color: "var(--color-text-default, #111827)",
          fontSize: "var(--font-size-sm, 12px)",
        }}
      >
        {label}
      </span>
      <input
        disabled={disabled}
        placeholder={placeholder}
        style={{
          minHeight: sizeStyle.height,
          padding: `${sizeStyle.paddingY} ${sizeStyle.paddingX}`,
          fontSize: sizeStyle.fontSize,
          borderRadius: `var(--radius-${radius}, 12px)`,
          border: error
            ? "1px solid var(--color-brand-danger, #dc2626)"
            : "1px solid var(--color-border-default, #d1d5db)",
          background: disabled ? "var(--color-surface-muted, #f3f4f6)" : "var(--color-surface-default, #ffffff)",
          color: "var(--color-text-default, #111827)",
          fontFamily: "var(--font-family-base, Inter, sans-serif)",
          width: "100%",
        }}
        className="outline-none transition focus:ring-2"
      />
      {error && <p className="mt-1 text-xs" style={{ color: "var(--color-brand-danger, #dc2626)" }}>{error}</p>}
    </label>
  );
}