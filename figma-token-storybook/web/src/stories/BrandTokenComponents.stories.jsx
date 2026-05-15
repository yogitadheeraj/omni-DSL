/**
 * Brand Token Components
 * Reads keys from the active brand's JSON file (loaded via /api/brand-tokens/:brandKey)
 * and renders every component using those token values directly.
 *
 * After the first sync, a JSON file is written for each brand under server/brand-tokens/.
 * This story demonstrates those files driving real component styles.
 */

import React, { useEffect, useMemo, useState } from "react";
import { useTokens } from "../theme/TokenProvider";

// ─── Token helpers ────────────────────────────────────────────────────────────

function tv(tokens, key, fallback = "") {
  return tokens?.[key]?.resolvedValue || tokens?.[key]?.value || fallback;
}

function isColorEntry(entry) {
  return entry?.type === "COLOR" || /^#|^rgb|^hsl/.test(String(entry?.resolvedValue || entry?.value || ""));
}

function collectColors(tokens) {
  return Object.entries(tokens || {})
    .filter(([, v]) => isColorEntry(v))
    .map(([k, v]) => ({ name: k, value: v.resolvedValue || v.value }));
}

function collectFontFamilies(tokens) {
  return Object.entries(tokens || {})
    .filter(([k]) => /font\.family|typography\.family/i.test(k))
    .map(([k, v]) => ({ name: k, value: v.resolvedValue || v.value }));
}

function collectTypography(tokens, pattern) {
  return Object.entries(tokens || {})
    .filter(([k]) => pattern.test(k))
    .map(([k, v]) => ({ name: k, value: v.resolvedValue || v.value, type: v.type }));
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function TokenBadge({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px]">
      <span className="text-slate-500">{label}</span>
      <span className="font-mono font-medium text-slate-900">{String(value)}</span>
    </span>
  );
}

function SectionBlock({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-5 text-lg font-bold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}

// ─── Color swatches ───────────────────────────────────────────────────────────

function ColorSwatches({ tokens }) {
  const colors = useMemo(() => collectColors(tokens).slice(0, 24), [tokens]);

  if (!colors.length) return <p className="text-sm text-slate-500">No color tokens in this brand.</p>;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {colors.map(({ name, value }) => (
        <div key={name} className="overflow-hidden rounded-lg border border-slate-200">
          <div className="h-14" style={{ background: String(value) }} />
          <div className="p-2">
            <p className="truncate text-[11px] font-mono text-slate-600">{name}</p>
            <p className="text-[11px] font-semibold text-slate-900">{String(value)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Font specimens ───────────────────────────────────────────────────────────

function FontSpecimens({ tokens }) {
  const families = useMemo(() => collectFontFamilies(tokens).slice(0, 6), [tokens]);

  if (!families.length) return <p className="text-sm text-slate-500">No font-family tokens in this brand.</p>;

  return (
    <div className="space-y-4">
      {families.map(({ name, value }) => (
        <div key={name} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-[11px] font-mono text-slate-500">{name} → {String(value)}</p>
          <p className="text-2xl text-slate-900" style={{ fontFamily: String(value) }}>
            Brand typeface
          </p>
          <p className="text-sm text-slate-600" style={{ fontFamily: String(value) }}>
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Brand Button ─────────────────────────────────────────────────────────────

function BrandButton({ tokens, label = "Get started", size = "md", variant = "primary" }) {
  const primary = tv(tokens, "color.brand.primary", "#111827");
  const textInverse = tv(tokens, "color.text.inverse", "#ffffff");
  const fontFamily = tv(tokens, "font.family.base", "inherit");

  const paddingMap = { sm: "8px 14px", md: "12px 20px", lg: "16px 28px" };
  const fontSizeMap = { sm: "13px", md: "15px", lg: "17px" };
  const radiusToken = tv(tokens, "radius.card", "10px");

  const baseStyle = {
    fontFamily,
    borderRadius: radiusToken,
    padding: paddingMap[size] || paddingMap.md,
    fontSize: fontSizeMap[size] || fontSizeMap.md,
    fontWeight: 600,
    transition: "opacity 0.15s"
  };

  if (variant === "primary") {
    return (
      <button style={{ ...baseStyle, background: primary, color: textInverse, border: "none" }}
        className="cursor-pointer hover:opacity-90 shadow-sm">{label}</button>
    );
  }
  if (variant === "outline") {
    return (
      <button style={{ ...baseStyle, background: "transparent", color: primary, border: `2px solid ${primary}` }}
        className="cursor-pointer hover:opacity-80">{label}</button>
    );
  }
  return (
    <button style={{ ...baseStyle, background: "transparent", color: primary, border: "none" }}
      className="cursor-pointer hover:underline">{label}</button>
  );
}

function ButtonShowcase({ tokens }) {
  const sizes = ["sm", "md", "lg"];
  const variants = ["primary", "outline", "ghost"];
  return (
    <div className="space-y-4">
      {variants.map((variant) => (
        <div key={variant}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{variant}</p>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <BrandButton key={size} tokens={tokens} label={`${size.toUpperCase()} Button`} size={size} variant={variant} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Brand Input ──────────────────────────────────────────────────────────────

function BrandInput({ tokens, label = "Full name", placeholder = "Enter value", size = "md" }) {
  const fontFamily = tv(tokens, "font.family.base", "inherit");
  const primary = tv(tokens, "color.brand.primary", "#111827");
  const radius = tv(tokens, "radius.card", "8px");

  const paddingMap = { sm: "7px 10px", md: "10px 14px", lg: "13px 18px" };
  const fontSizeMap = { sm: "13px", md: "14px", lg: "16px" };

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-700"
        style={{ fontFamily }}>{label}</label>
      <input
        placeholder={placeholder}
        className="w-full border border-slate-300 bg-white outline-none transition-all focus:ring-2"
        style={{
          fontFamily,
          borderRadius: radius,
          padding: paddingMap[size] || paddingMap.md,
          fontSize: fontSizeMap[size] || fontSizeMap.md,
          "--tw-ring-color": primary
        }}
      />
    </div>
  );
}

function InputShowcase({ tokens }) {
  const sizes = ["sm", "md", "lg"];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {sizes.map((size) => (
        <BrandInput key={size} tokens={tokens} label={`Input ${size.toUpperCase()}`}
          placeholder={`${size} placeholder`} size={size} />
      ))}
    </div>
  );
}

// ─── Brand Card ───────────────────────────────────────────────────────────────

function BrandCard({ tokens, title = "Card title", body = "Body copy driven by brand token values.", index = 0 }) {
  const fontFamily = tv(tokens, "font.family.base", "inherit");
  const primary = tv(tokens, "color.brand.primary", "#111827");
  const surface = tv(tokens, "color.surface.default", "#ffffff");
  const radius = tv(tokens, "radius.card", "12px");
  const shadow = tv(tokens, "shadow.card", "0 4px 16px rgba(0,0,0,0.08)");
  const textInverse = tv(tokens, "color.text.inverse", "#ffffff");

  return (
    <div style={{ background: surface, borderRadius: radius, boxShadow: shadow, fontFamily, overflow: "hidden" }}>
      <div className="h-24" style={{ background: `linear-gradient(135deg, ${primary}cc, ${primary})` }}>
        <div className="flex h-full items-center justify-center text-white text-sm font-semibold opacity-80">
          Card {index + 1}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-slate-900 mb-1" style={{ fontFamily }}>{title}</h4>
        <p className="text-sm text-slate-600" style={{ fontFamily }}>{body}</p>
        <div className="mt-4">
          <BrandButton tokens={tokens} label="Learn more" size="sm" variant="outline" />
        </div>
      </div>
    </div>
  );
}

function CardShowcase({ tokens }) {
  const titles = ["Design Tokens", "Components", "Brand System"];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {titles.map((title, idx) => (
        <BrandCard key={title} tokens={tokens} title={title}
          body="Token-driven surface using brand JSON keys." index={idx} />
      ))}
    </div>
  );
}

// ─── Label & Typography ───────────────────────────────────────────────────────

function LabelShowcase({ tokens }) {
  const fontFamily = tv(tokens, "font.family.base", "inherit");
  const primary = tv(tokens, "color.brand.primary", "#111827");

  const rows = [
    { label: "SM Label", size: "12px" },
    { label: "MD Label", size: "14px" },
    { label: "LG Label", size: "16px" },
    { label: "XL Label", size: "18px" }
  ];

  return (
    <div className="space-y-4">
      {rows.map(({ label, size }) => (
        <div key={size} className="flex flex-wrap items-baseline gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <span className="w-24 text-xs text-slate-500">{size}</span>
          <span style={{ fontFamily, fontSize: size, fontWeight: 400, color: "#374151" }}>{label} Regular</span>
          <span style={{ fontFamily, fontSize: size, fontWeight: 600, color: "#111827" }}>{label} Semibold</span>
          <span style={{ fontFamily, fontSize: size, fontWeight: 700, color: primary }}>{label} Bold</span>
        </div>
      ))}
    </div>
  );
}

// ─── Grid / Column visualiser ─────────────────────────────────────────────────

function GridShowcase({ tokens }) {
  const primary = tv(tokens, "color.brand.primary", "#111827");

  const breakpoints = Object.entries(tokens || {})
    .filter(([k]) => /^layout\.breakpoint\./i.test(k))
    .map(([k, v]) => ({ name: k.split(".").pop(), value: v.resolvedValue || v.value }));

  const columns = Object.entries(tokens || {})
    .filter(([k]) => /^layout\.grid\.columns\./i.test(k))
    .map(([k, v]) => ({ name: k.split(".").pop(), count: Math.max(1, Math.min(12, Number.parseInt(v.resolvedValue || v.value, 10) || 1)) }));

  const gutters = Object.entries(tokens || {})
    .filter(([k]) => /^layout\.grid\.gutter\./i.test(k))
    .map(([k, v]) => ({ name: k.split(".").pop(), value: v.resolvedValue || v.value }));

  return (
    <div className="space-y-6">
      {breakpoints.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Breakpoints</p>
          <div className="space-y-2">
            {breakpoints.map(({ name, value }) => {
              const px = Number.parseInt(String(value), 10);
              const pct = Number.isFinite(px) ? Math.min(px / 14.4, 100) : 40;
              return (
                <div key={name}>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span className="font-medium">{name}</span>
                    <span className="font-mono">{String(value)}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-slate-200">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: primary }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {columns.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Grid Columns</p>
          <div className="space-y-3">
            {columns.map(({ name, count }) => (
              <div key={name}>
                <p className="mb-1 text-xs text-slate-600">{name} — {count} cols</p>
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
                  {Array.from({ length: count }).map((_, idx) => (
                    <div key={`${name}-${idx}`} className="h-8 rounded"
                      style={{ background: `${primary}22`, border: `1px solid ${primary}55` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gutters.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Gutter Spacing</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {gutters.map(({ name, value }) => (
              <div key={name} className="rounded border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-[11px] font-mono text-slate-500">{name} → {String(value)}</p>
                <div className="grid grid-cols-2" style={{ gap: String(value) }}>
                  <div className="h-6 rounded" style={{ background: `${primary}33` }} />
                  <div className="h-6 rounded" style={{ background: `${primary}33` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!breakpoints.length && !columns.length && !gutters.length && (
        <p className="text-sm text-slate-500">No layout tokens in this brand.</p>
      )}
    </div>
  );
}

// ─── Token table ──────────────────────────────────────────────────────────────

function TokenTable({ tokens, pattern, limit = 30 }) {
  const rows = useMemo(
    () => Object.entries(tokens || {})
      .filter(([k]) => pattern.test(k))
      .slice(0, limit),
    [tokens, pattern, limit]
  );

  if (!rows.length) return <p className="text-sm text-slate-500">No matching tokens.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-3 py-2 text-left font-semibold text-slate-700">Token key</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-700">Value</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-700">Type</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b border-slate-100">
              <td className="px-3 py-2 font-mono text-slate-700">{k}</td>
              <td className="px-3 py-2 font-mono text-slate-900">{String(v.resolvedValue || v.value)}</td>
              <td className="px-3 py-2 font-mono text-slate-400">{v.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main story component ──────────────────────────────────────────────────────

function BrandTokenComponents() {
  const { data, activeTheme, setActiveTheme, loading, syncTokens, brandJsonMap } = useTokens();
  const [brandSwitching, setBrandSwitching] = useState(false);

  useEffect(() => {
    if (!data && !loading) syncTokens();
  }, [data, loading, syncTokens]);

  const themes = useMemo(() => Object.keys(data?.brands ?? {}), [data]);

  const activeBrandJson = brandJsonMap[activeTheme];
  const tokens = activeBrandJson?.tokens ?? data?.brands?.[activeTheme]?.tokens ?? {};
  const brandName = activeBrandJson?.brandName ?? data?.brands?.[activeTheme]?.name ?? activeTheme ?? "Brand";

  useEffect(() => {
    if (!brandSwitching) return;
    const t = window.setTimeout(() => setBrandSwitching(false), 160);
    return () => window.clearTimeout(t);
  }, [activeTheme, brandSwitching]);

  function handleBrandChange(theme) {
    setBrandSwitching(true);
    setActiveTheme(theme);
  }

  const showLoader = loading || brandSwitching;

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Brand bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm px-6 py-3">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Brand label</p>
            <h1 className="text-base font-bold text-slate-900">
              {brandName}
              {activeBrandJson && (
                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                  from JSON
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400" htmlFor="btc-brand">
              Switch brand
            </label>
            <select
              id="btc-brand"
              value={activeTheme}
              disabled={themes.length === 0}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="rounded border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {themes.map((t) => (
                <option key={t} value={t}>{data?.brands?.[t]?.name ?? t}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => syncTokens(true)}
              className="rounded bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
            >
              {loading ? "Syncing..." : "Sync & export JSON"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <TokenBadge label="theme" value={activeTheme || "—"} />
            <TokenBadge label="tokens" value={Object.keys(tokens).length} />
            {activeBrandJson && <TokenBadge label="generatedAt" value={activeBrandJson.generatedAt?.slice(0, 10) ?? "—"} />}
          </div>
        </div>
      </header>

      {showLoader ? (
        <div className="flex justify-center pt-20">
          <div className="rounded-xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
            <p className="mt-4 text-sm font-semibold text-slate-700">Loading brand token JSON…</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl space-y-6 p-6">
          <SectionBlock title="Buttons — all sizes & variants">
            <ButtonShowcase tokens={tokens} />
          </SectionBlock>

          <SectionBlock title="Inputs — all sizes">
            <InputShowcase tokens={tokens} />
          </SectionBlock>

          <SectionBlock title="Cards">
            <CardShowcase tokens={tokens} />
          </SectionBlock>

          <SectionBlock title="Labels & Typography scale">
            <LabelShowcase tokens={tokens} />
          </SectionBlock>

          <SectionBlock title="Grid, Columns & Breakpoints">
            <GridShowcase tokens={tokens} />
          </SectionBlock>

          <SectionBlock title="Brand Colors">
            <ColorSwatches tokens={tokens} />
          </SectionBlock>

          <SectionBlock title="Brand Font Families">
            <FontSpecimens tokens={tokens} />
          </SectionBlock>

          <SectionBlock title="All color tokens">
            <TokenTable tokens={tokens} pattern={/^color\./i} />
          </SectionBlock>

          <SectionBlock title="All typography tokens">
            <TokenTable tokens={tokens} pattern={/^(font\.|typography\.)/i} />
          </SectionBlock>
        </div>
      )}
    </div>
  );
}

// ─── Storybook exports ────────────────────────────────────────────────────────

export default {
  title: "Design System/Brand Token Components",
  component: BrandTokenComponents
};

export const AllBrandComponents = {};
