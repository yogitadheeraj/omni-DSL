import React from "react";

export function Checkbox({ label = "I agree", checked = false, disabled = false }) {
  return (
    <label className="inline-flex items-center gap-3" style={{ fontFamily: "var(--font-family-base, Inter)" }}>
      <input
        type="checkbox"
        defaultChecked={checked}
        disabled={disabled}
        style={{ accentColor: "var(--color-brand-primary, #111827)" }}
        className="h-5 w-5"
      />
      <span style={{ color: "var(--color-text-default, #111827)", fontSize: "var(--font-size-md, 14px)" }}>
        {label}
      </span>
    </label>
  );
}