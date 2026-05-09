import React from "react";
import { sizes } from "./componentTokens";

export function Select({ label = "Select", size = "md", radius = "md", options = ["Dubai", "Abu Dhabi", "Sharjah"] }) {
  const sizeStyle = sizes[size] ?? sizes.md;

  return (
    <label className="block w-full">
      <span className="mb-2 block text-sm font-semibold" style={{ color: "var(--color-text-default, #111827)" }}>
        {label}
      </span>
      <select
        style={{
          minHeight: sizeStyle.height,
          padding: `${sizeStyle.paddingY} ${sizeStyle.paddingX}`,
          fontSize: sizeStyle.fontSize,
          borderRadius: `var(--radius-${radius}, 12px)`,
          border: "1px solid var(--color-border-default, #d1d5db)",
          background: "var(--color-surface-default, #ffffff)",
          color: "var(--color-text-default, #111827)",
          fontFamily: "var(--font-family-base, Inter, sans-serif)",
          width: "100%",
        }}
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}