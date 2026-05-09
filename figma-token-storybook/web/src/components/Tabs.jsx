import React, { useState } from "react";

export function Tabs({ items = ["Overview", "Specs", "Pricing"] }) {
  const [active, setActive] = useState(items[0]);

  return (
    <div
      className="rounded-2xl border"
      style={{
        fontFamily: "var(--font-family-base, Inter)",
        borderColor: "var(--color-border-default, #e5e7eb)",
        background: "var(--color-surface-default, #ffffff)",
        boxShadow: "var(--shadow-card, 0 10px 30px rgba(15,23,42,0.08))"
      }}
    >
      <div
        className="rounded-t-2xl border-b p-3"
        style={{
          borderColor: "var(--color-border-default, #e5e7eb)",
          background: "var(--color-surface-muted, #f8fafc)"
        }}
      >
        <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const selected = active === item;
          return (
            <button
              key={item}
              onClick={() => setActive(item)}
              type="button"
              aria-pressed={selected}
              style={{
                background: selected ? "var(--color-brand-primary, #111827)" : "transparent",
                color: selected ? "var(--color-text-inverse, #ffffff)" : "var(--color-text-default, #111827)",
                borderRadius: "var(--radius-full, 999px)",
                padding: "var(--spacing-sm, 8px) var(--spacing-md, 16px)",
                border: selected ? "1px solid var(--color-brand-primary, #111827)" : "1px solid var(--color-border-default, #e5e7eb)",
              }}
              className="font-semibold transition"
            >
              {item}
            </button>
          );
        })}
        </div>
      </div>

      <div
        className="grid gap-4 p-5 md:grid-cols-2"
        style={{
          color: "var(--color-text-default, #111827)",
        }}
      >
        <section className="rounded-xl border p-4" style={{ borderColor: "var(--color-border-default, #e5e7eb)" }}>
          <p className="text-xs uppercase tracking-wider opacity-70">Selected Section</p>
          <h3 className="mt-2 text-xl font-bold">{active}</h3>
          <p className="mt-2 text-sm opacity-80">
            Business-ready preview of brand variables with visual examples for quick sign-off.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg border p-2 text-center text-xs" style={{ borderColor: "var(--color-border-default, #e5e7eb)" }}>
              <div className="mx-auto mb-2 h-8 w-8 rounded-md border" style={{ background: "var(--color-brand-primary, #111827)", borderColor: "var(--color-border-default, #e5e7eb)" }} />
              Primary
            </div>
            <div className="rounded-lg border p-2 text-center text-xs" style={{ borderColor: "var(--color-border-default, #e5e7eb)" }}>
              <div className="mx-auto mb-2 h-8 w-8 rounded-md border" style={{ background: "var(--color-surface-default, #ffffff)", borderColor: "var(--color-border-default, #e5e7eb)" }} />
              Surface
            </div>
            <div className="rounded-lg border p-2 text-center text-xs" style={{ borderColor: "var(--color-border-default, #e5e7eb)" }}>
              <div className="mx-auto mb-2 h-8 w-8 rounded-md border" style={{ background: "var(--color-text-default, #111827)", borderColor: "var(--color-border-default, #e5e7eb)" }} />
              Text
            </div>
          </div>
        </section>

        <section className="rounded-xl border p-4" style={{ borderColor: "var(--color-border-default, #e5e7eb)" }}>
          <p className="text-xs uppercase tracking-wider opacity-70">UI Snapshot</p>
          <p className="mt-2 text-sm" style={{ fontSize: "var(--font-size-md, 14px)", lineHeight: "1.5" }}>
            The quick brown fox jumps over the lazy dog.
          </p>

          <div className="mt-4 space-y-2">
            <div className="h-2 rounded-full" style={{ width: "var(--spacing-xl, 32px)", background: "var(--color-brand-primary, #111827)" }} />
            <div className="h-2 rounded-full opacity-70" style={{ width: "var(--spacing-lg, 24px)", background: "var(--color-brand-primary, #111827)" }} />
            <div className="h-2 rounded-full opacity-40" style={{ width: "var(--spacing-md, 16px)", background: "var(--color-brand-primary, #111827)" }} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="font-semibold"
              style={{
                background: "var(--color-brand-primary, #111827)",
                color: "var(--color-text-inverse, #ffffff)",
                borderRadius: "var(--radius-card, 12px)",
                padding: "var(--spacing-sm, 8px) var(--spacing-md, 16px)",
                border: "1px solid var(--color-brand-primary, #111827)"
              }}
            >
              Primary
            </button>
            <button
              type="button"
              className="font-semibold"
              style={{
                background: "transparent",
                color: "var(--color-brand-primary, #111827)",
                borderRadius: "var(--radius-card, 12px)",
                padding: "var(--spacing-sm, 8px) var(--spacing-md, 16px)",
                border: "1px solid var(--color-brand-primary, #111827)"
              }}
            >
              Outline
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}