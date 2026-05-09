import React from "react";
import { Button } from "./Button";

export function Modal({ open = true, title = "Confirm Action", description = "Are you sure you want to continue?" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-md"
        style={{
          background: "var(--color-surface-default, #ffffff)",
          color: "var(--color-text-default, #111827)",
          borderRadius: "var(--radius-xl, 24px)",
          padding: "var(--spacing-lg, 24px)",
          fontFamily: "var(--font-family-base, Inter)",
        }}
      >
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 opacity-70">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </div>
      </div>
    </div>
  );
}