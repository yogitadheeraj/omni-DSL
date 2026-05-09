import React, { useMemo, useState } from "react";
import { Palette as Figma, Layers, Palette, RefreshCw, Tablet, Type } from "lucide-react";
import { useTokens } from "../theme/TokenProvider";

function isColorToken(type, value) {
  if (String(type).toUpperCase() === "COLOR") return true;
  return /^(#([\da-f]{3,8})|rgb\(|rgba\(|hsl\(|hsla\()/i.test(String(value).trim());
}

function firstTokenValue(tokens, names, fallback) {
  for (const name of names) {
    const token = tokens?.[name];
    const value = token?.resolvedValue ?? token?.value;
    if (value && !String(value).startsWith("alias:")) {
      return value;
    }
  }
  return fallback;
}

export function BrandPreview() {
  const {
    fileKey,
    setFileKey,
    data,
    activeTheme,
    setActiveTheme,
    loading,
    syncTokens
  } = useTokens();
  const [figmaToken, setFigmaToken] = useState("");
  const [isTestButtonHovered, setIsTestButtonHovered] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");

  const themes = Object.keys(data?.brands ?? {});
  console.log("Available themes:", themes, activeTheme, data?.brands?.[activeTheme]);
  const activeTokens = data?.brands?.[activeTheme]?.tokens ?? {};
  const tokenEntries = useMemo(() => Object.entries(activeTokens).map(([name, token]) => ({
    name,
    value: token?.value ?? "",
    resolvedValue: token?.resolvedValue ?? token?.value ?? "",
    type: token?.type ?? "UNKNOWN",
    isColor: isColorToken(token?.type, token?.resolvedValue ?? token?.value)
  })), [activeTokens]);

  const colorTokens = useMemo(() => tokenEntries.filter((token) => token.isColor).slice(0, 5), [tokenEntries]);

  const summary = useMemo(() => {
    const colorCount = tokenEntries.filter((token) => token.isColor).length;
    return {
      pages: 0,
      components: tokenEntries.length,
      brands: themes.length,
      patterns: colorCount
    };
  }, [tokenEntries, themes.length]);

  const activeBrandName = data?.brands?.[activeTheme]?.name ?? "No theme selected";
  const previewPrimary = firstTokenValue(activeTokens, ["color.brand.primary.base", "color.primary", "brand.primary"], "#111827");
  const previewSecondary = firstTokenValue(activeTokens, ["color.brand.secondary.base", "color.secondary", "brand.secondary"], "#e5e7eb");
  const previewInverse = firstTokenValue(activeTokens, ["color.text.inverse", "text.inverse"], "#ffffff");
  const previewText = firstTokenValue(activeTokens, ["color.text.default", "text.default"], "#111827");
  const previewRadius = firstTokenValue(activeTokens, ["radius.card", "radius.md", "radius.lg"], "12px");
  const previewFont = firstTokenValue(activeTokens, ["font.family.base", "font.family.primary"], "Inter");
  const buttonPaddingY = firstTokenValue(activeTokens, ["button.md.padding-y", "button.padding-y", "spacing.sm"], "8px");
  const buttonPaddingX = firstTokenValue(activeTokens, ["button.md.padding-x", "button.padding-x", "spacing.md"], "16px");
  const buttonBaseBg = firstTokenValue(
    activeTokens,
    ["button.primary.background", "button.primary.bg", "color.button.primary", "color.brand.primary.base", "color.primary", "brand.primary"],
    previewPrimary
  );
  const buttonBaseText = firstTokenValue(
    activeTokens,
    ["button.primary.text", "color.button.primary.text", "color.text.inverse", "text.inverse"],
    previewInverse
  );
  const buttonBaseBorder = firstTokenValue(
    activeTokens,
    ["button.primary.border", "color.button.primary.border", "color.border.primary"],
    buttonBaseBg
  );
  const buttonBaseRadius = firstTokenValue(activeTokens, ["button.primary.radius", "button.radius", "radius.button", "radius.md", "radius.card", 'radius.button.xs'], previewRadius);
  const buttonHoverBg = firstTokenValue(
    activeTokens,
    ["button.primary.hover.background", "button.primary.hover.bg", "button.primary.background.hover", "color.button.primary.hover", "color.brand.primary.hover"],
    buttonBaseBg
  );
  const buttonHoverText = firstTokenValue(
    activeTokens,
    ["button.primary.hover.text", "button.primary.text.hover", "color.button.primary.text.hover", "color.text.inverse"],
    buttonBaseText
  );
  const buttonHoverBorder = firstTokenValue(
    activeTokens,
    ["button.primary.hover.border", "button.primary.border.hover", "color.button.primary.border.hover"],
    buttonHoverBg
  );
  const buttonHoverRadius = firstTokenValue(
    activeTokens,
    ["button.primary.hover.radius", "button.primary.radius.hover"],
    buttonBaseRadius
  );

  const metricCards = [
    { label: "Figma Pages", value: summary.pages, icon: Figma },
    { label: "Components", value: summary.components, icon: Layers },
    { label: "Brands", value: summary.brands, icon: Palette },
    { label: "Patterns", value: summary.patterns, icon: Type }
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb] p-4 md:p-6" style={{ fontFamily: previewFont }}>
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            
            </span>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Brand Storybook Portal</h1>
              <p className="text-xs text-slate-500">Live Figma sync + multi-brand React design system</p>
            </div>
          </div>
          <button
            onClick={() => syncTokens(forceRefresh)}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
            style={{
              background: isTestButtonHovered ? buttonHoverBg : buttonBaseBg,
              color: isTestButtonHovered ? buttonHoverText : buttonBaseText,
              border: `1px solid ${isTestButtonHovered ? buttonHoverBorder : buttonBaseBorder}`,
              borderRadius: isTestButtonHovered ? buttonHoverRadius : buttonBaseRadius
            }}
            onMouseEnter={() => setIsTestButtonHovered(true)}
            onMouseLeave={() => setIsTestButtonHovered(false)}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {loading ? "Syncing..." : "Sync Figma"}
          </button>
        </header>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-900">Figma Connection</h2>
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-500">Figma File Key</p>
                  <input
                    value={fileKey}
                    onChange={(e) => setFileKey(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-slate-500">Figma Token</p>
                  <input
                    type="password"
                    value={figmaToken}
                    onChange={(e) => setFigmaToken(e.target.value)}
                    placeholder="************************"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                </div>
                <button
                  onClick={() => syncTokens(forceRefresh)}
                  className="w-full rounded-lg px-3 py-2 text-sm font-semibold text-white cursor-pointer transition-all"
                  style={{ background: previewPrimary }}
                >
                  Fetch Figma Pages
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600"
                >
                  Run Enterprise Sync
                </button>
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={forceRefresh}
                    onChange={(e) => setForceRefresh(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Force refresh cache
                </label>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                  Recommended: keep token on backend only.
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">Brand</h3>
              <select
                value={activeTheme}
                onChange={(e) => setActiveTheme(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              >
                <option value="">Select brand</option>
                {themes.map((theme) => (
                  <option key={theme} value={theme}>{data?.brands?.[theme]?.name ?? theme}</option>
                ))}
              </select>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">Preview</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
                  style={{ background: previewMode === "desktop" ? previewPrimary : "#f1f5f9", color: previewMode === "desktop" ? previewInverse : "#0f172a" }}
                >
                  <Layers size={14} /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("tablet")}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
                  style={{ background: previewMode === "tablet" ? previewPrimary : "#f1f5f9", color: previewMode === "tablet" ? previewInverse : "#0f172a" }}
                >
                  <Tablet size={14} /> Tablet
                </button>
              </div>
            </section>
          </aside>

          <main className="space-y-4">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metricCards.map((metric) => {
                const Icon = metric.icon;
                return (
                  <article key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                      <Icon size={15} />
                    </span>
                    <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
                    <p className="text-sm text-slate-500">{metric.label}</p>
                  </article>
                );
              })}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Live Figma Pages</h2>
                  <p className="text-sm text-slate-500">Fetch page-wise nodes and convert them into Storybook review items.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">No Data Yet</span>
              </div>
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                No pages loaded yet. Enter file key and click Fetch Figma Pages.
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[2fr_1.3fr]">
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900">Storybook Page Preview</h3>
                    <p className="text-sm text-slate-500">Selected Figma page rendered as business review preview.</p>
                  </div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Default / {previewMode}</span>
                </div>

                <div className="rounded-2xl bg-slate-100 p-6">
                  <div
                    className="mx-auto max-w-md rounded-2xl p-6 text-white"
                    style={{
                      background: `linear-gradient(145deg, ${previewPrimary}, #0f172a)`,
                      borderRadius: previewRadius
                    }}
                  >
                    <p className="text-sm opacity-80">Figma Page</p>
                    <h4 className="mt-2 text-lg font-semibold">Business Review</h4>
                    <p className="mt-2 text-sm opacity-90">
                      This section represents a live Storybook preview generated from Figma metadata and mapped React components.
                    </p>
                    <button
                      type="button"
                      className="mt-4 text-sm font-semibold transition-all"
                      style={{
                        background: isTestButtonHovered ? buttonHoverBg : buttonBaseBg,
                        color: isTestButtonHovered ? buttonHoverText : buttonBaseText,
                        borderRadius: isTestButtonHovered ? buttonHoverRadius : buttonBaseRadius,
                        padding: `${buttonPaddingY} ${buttonPaddingX}`,
                        border: `1px solid ${isTestButtonHovered ? buttonHoverBorder : buttonBaseBorder}`
                      }}
                      onMouseEnter={() => setIsTestButtonHovered(true)}
                      onMouseLeave={() => setIsTestButtonHovered(false)}
                    >
                      Review Action
                    </button>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-2xl font-semibold text-slate-900">Design Tokens</h3>
                <p className="mb-4 text-sm text-slate-500">Synced from Figma variables and applied per selected brand mode.</p>
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                    Active Brand: <span className="font-semibold">{activeBrandName}</span><br />
                    Source: {data?.source ?? "-"} | Cache: {data?.cache?.hit ? "hit" : "miss"} | Omni DSL themes: {data?.omniDsl?.themeCount ?? 0}
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Semantic / Primary</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{previewPrimary}</span>
                      <span className="h-7 w-7 rounded-lg border border-slate-300" style={{ background: previewPrimary }} />
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Semantic / Secondary</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{previewSecondary}</span>
                      <span className="h-7 w-7 rounded-lg border border-slate-300" style={{ background: previewSecondary }} />
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Text / Default</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{previewText}</span>
                      <span className="h-7 w-7 rounded-lg border border-slate-300" style={{ background: previewText }} />
                    </div>
                  </div>

                  {colorTokens.map((token) => (
                    <div key={token.name} className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-xs text-slate-500">{token.name}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900">{token.resolvedValue}</span>
                        <span className="h-7 w-7 rounded-lg border border-slate-300" style={{ background: token.resolvedValue }} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}