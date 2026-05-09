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

function toNumber(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
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
  const [previewModeOverridden, setPreviewModeOverridden] = useState(false);
  const [selectedGutterToken, setSelectedGutterToken] = useState(null); // name of selected gutter token

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

  const layoutPagePadding = firstTokenValue(
    activeTokens,
    ["layout.page.padding", "spacing.layout.page", "spacing.lg", "spacing.md"],
    "24px"
  );
  const layoutSectionGap = firstTokenValue(
    activeTokens,
    ["layout.section.gap", "layout.gap.section", "spacing.layout.section", "spacing.md"],
    "16px"
  );
  const layoutGridGutter = firstTokenValue(
    activeTokens,
    ["layout.grid.gutter", "grid.gutter", "spacing.layout.gutter", "spacing.md"],
    "16px"
  );

  // Collect all gutter-related tokens grouped by breakpoint/type
  const gutterTokenEntries = useMemo(() => {
    const gutterPattern = /gutter/i;
    const found = Object.entries(activeTokens)
      .filter(([name]) => gutterPattern.test(name))
      .map(([name, token]) => ({
        name,
        value: token?.resolvedValue ?? token?.value ?? "",
        type: token?.type ?? "UNKNOWN",
      }))
      .filter(({ value }) => value && !String(value).startsWith("alias:"));
    // Derive a short label: last segment of the token name
    return found.map((entry) => {
      const parts = entry.name.split(".");
      const label = parts[parts.length - 1];
      // Detect breakpoint hint
      const breakpoint = ["desktop", "tablet", "mobile", "sm", "md", "lg", "xl"].find(
        (bp) => entry.name.toLowerCase().includes(bp)
      ) ?? null;
      return { ...entry, label, breakpoint };
    });
  }, [activeTokens]);
  const layoutCardGutter = firstTokenValue(
    activeTokens,
    ["layout.card.gap", "layout.grid.card-gap", "spacing.layout.card", "spacing.sm"],
    "12px"
  );
  const layoutSidebarWidth = firstTokenValue(
    activeTokens,
    ["layout.sidebar.width", "layout.grid.sidebar-width"],
    "320px"
  );
  const layoutContainerMaxWidth = firstTokenValue(
    activeTokens,
    ["layout.container.max-width", "layout.max-width", "sizing.container.max"],
    "1280px"
  );
  const metricColumnsDesktop = toNumber(
    firstTokenValue(activeTokens, ["layout.grid.metrics.columns.desktop", "layout.grid.columns.desktop"], "4"),
    4
  );
  const metricColumnsTablet = toNumber(
    firstTokenValue(activeTokens, ["layout.grid.metrics.columns.tablet", "layout.grid.columns.tablet"], "2"),
    2
  );
  const metricColumnMinWidth = firstTokenValue(
    activeTokens,
    ["layout.grid.metrics.min-width", "layout.grid.min-column-width"],
    "190px"
  );
  const layoutHeaderPaddingX = firstTokenValue(
    activeTokens,
    ["layout.header.padding-x", "layout.surface.header.padding-x", "spacing.lg", "spacing.md"],
    "16px"
  );
  const layoutHeaderPaddingY = firstTokenValue(
    activeTokens,
    ["layout.header.padding-y", "layout.surface.header.padding-y", "spacing.md", "spacing.sm"],
    "16px"
  );
  const layoutSectionPadding = firstTokenValue(
    activeTokens,
    ["layout.section.padding", "layout.surface.section.padding", "spacing.md"],
    "16px"
  );
  const layoutPanelPadding = firstTokenValue(
    activeTokens,
    ["layout.panel.padding", "layout.surface.panel.padding", "spacing.md", "spacing.sm"],
    "12px"
  );
  const layoutCanvasPadding = firstTokenValue(
    activeTokens,
    ["layout.canvas.padding", "layout.preview.canvas.padding", "spacing.lg", "spacing.md"],
    "24px"
  );
  const radiusHeader = firstTokenValue(
    activeTokens,
    ["radius.surface.header", "radius.xl", "radius.lg", "radius.card"],
    "16px"
  );
  const radiusSection = firstTokenValue(
    activeTokens,
    ["radius.surface.section", "radius.lg", "radius.card", "radius.md"],
    "16px"
  );
  const radiusPanel = firstTokenValue(
    activeTokens,
    ["radius.surface.panel", "radius.md", "radius.sm"],
    "12px"
  );
  const previewSplitLeft = firstTokenValue(
    activeTokens,
    ["layout.grid.preview.left", "layout.preview.split.left", "layout.grid.preview.columns.left"],
    "2fr"
  );
  const previewSplitRight = firstTokenValue(
    activeTokens,
    ["layout.grid.preview.right", "layout.preview.split.right", "layout.grid.preview.columns.right"],
    "1.3fr"
  );

  // Token-sourced preview mode
  const tokenPreviewModeRaw = firstTokenValue(
    activeTokens,
    ["layout.preview.mode", "layout.grid.preview.mode", "preview.mode", "layout.breakpoint.default"],
    ""
  );
  const tokenPreviewMode = ["tablet", "mobile"].includes(String(tokenPreviewModeRaw).toLowerCase())
    ? String(tokenPreviewModeRaw).toLowerCase()
    : tokenPreviewModeRaw ? "desktop" : "";

  const effectivePreviewMode = previewModeOverridden ? previewMode : (tokenPreviewMode || previewMode);

  function handleSetPreviewMode(mode) {
    setPreviewMode(mode);
    setPreviewModeOverridden(true);
  }

  const metricCards = [
    { label: "Figma Pages", value: summary.pages, icon: Figma },
    { label: "Components", value: summary.components, icon: Layers },
    { label: "Brands", value: summary.brands, icon: Palette },
    { label: "Patterns", value: summary.patterns, icon: Type }
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb]" style={{ fontFamily: previewFont, padding: layoutPagePadding }}>
      <div className="mx-auto" style={{ maxWidth: layoutContainerMaxWidth }}>
        <header
          className="mb-5 flex items-center justify-between border border-slate-200 bg-white shadow-sm"
          style={{
            borderRadius: radiusHeader,
            padding: `${layoutHeaderPaddingY} ${layoutHeaderPaddingX}`
          }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Figma size={18} />
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

        <div className="grid lg:grid-cols-[auto_1fr]" style={{ gap: layoutGridGutter }}>
          <aside style={{ display: "grid", gap: layoutSectionGap, width: layoutSidebarWidth, maxWidth: "100%" }}>
            <section
              className="border border-slate-200 bg-white shadow-sm"
              style={{ borderRadius: radiusSection, padding: layoutSectionPadding }}
            >
              <h2 className="mb-3 text-sm font-semibold text-slate-900">Figma Connection</h2>
              <div style={{ display: "grid", gap: layoutCardGutter }}>
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
                   {loading ? "Fetching..." : "Fetch Figma Pages"}
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
               <h3 className="mb-3 mt-2 text-sm font-semibold text-slate-900">Brand</h3>
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
                 <h2 className="mb-3  mt-2 text-sm font-semibold text-slate-900">Preview</h2>
              <div style={{ display: "grid", gap: layoutCardGutter }}>
                {tokenPreviewMode && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                    Token default: <span className="font-semibold" style={{ color: previewPrimary }}>{tokenPreviewMode}</span>
                  </div>
                )}
                {gutterTokenEntries.length > 0 && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 inline-flex flex-col gap-2">
                    Detected gutter tokens:
                      {gutterTokenEntries.map((token) => (
             
                             <button
                  type="button"
                  onClick={() => handleSetPreviewMode("desktop")}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
                  style={{ background: effectivePreviewMode === "desktop" ? previewPrimary : "#f1f5f9", color: effectivePreviewMode === "desktop" ? previewInverse : "#0f172a" }}
                >
                  <Layers size={14} />  ({token.breakpoint})
                </button>
                         
                      ))}
                  
                  </div>
                )}
              
              </div>
            </section>

           
           
          </aside>

          <main style={{ display: "grid", gap: layoutSectionGap }}>
            <section
              className="grid"
              style={{
                gap: layoutCardGutter,
                gridTemplateColumns: `repeat(${effectivePreviewMode === "desktop" ? metricColumnsDesktop : metricColumnsTablet}, minmax(${metricColumnMinWidth}, 1fr))`
              }}
            >
              {metricCards.map((metric) => {
                const Icon = metric.icon;
                return (
                  <article
                    key={metric.label}
                    className="border border-slate-200 bg-white shadow-sm"
                    style={{ borderRadius: radiusSection, padding: layoutSectionPadding }}
                  >
                    <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                      <Icon size={15} />
                    </span>
                    <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
                    <p className="text-sm text-slate-500">{metric.label}</p>
                  </article>
                );
              })}
            </section>

            <section
              className="border border-slate-200 bg-white shadow-sm"
              style={{ borderRadius: radiusSection, padding: layoutSectionPadding }}
            >
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

            <section
              className="grid gap-4 lg:grid-cols-[var(--layout-preview-left)_var(--layout-preview-right)]"
              style={{
                gap: layoutGridGutter,
                "--layout-preview-left": previewSplitLeft,
                "--layout-preview-right": previewSplitRight
              }}
            >
              <article
                className="border border-slate-200 bg-white shadow-sm"
                style={{ borderRadius: radiusSection, padding: layoutSectionPadding }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900">Storybook Page Preview</h3>
                    <p className="text-sm text-slate-500">Selected Figma page rendered as business review preview.</p>
                  </div>
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Default / {effectivePreviewMode}</span>
                </div>

                <div className="bg-slate-100" style={{ borderRadius: radiusPanel, padding: layoutCanvasPadding }}>
                  <div
                    className="mx-auto max-w-md text-white"
                    style={{
                      background: `linear-gradient(145deg, ${previewPrimary}, #0f172a)`,
                      borderRadius: radiusPanel,
                      padding: layoutCanvasPadding
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

              <article
                className="border border-slate-200 bg-white shadow-sm"
                style={{ borderRadius: radiusSection, padding: layoutSectionPadding }}
              >
                <h3 className="text-2xl font-semibold text-slate-900">Design Tokens</h3>
                <p className="mb-4 text-sm text-slate-500">Synced from Figma variables and applied per selected brand mode.</p>
                <div style={{ display: "grid", gap: layoutCardGutter }}>
                  <div className="border border-slate-200 bg-slate-50 text-xs text-slate-600" style={{ borderRadius: radiusPanel, padding: layoutPanelPadding }}>
                    Active Brand: <span className="font-semibold">{activeBrandName}</span><br />
                    Source: {data?.source ?? "-"} | Cache: {data?.cache?.hit ? "hit" : "miss"} | Omni DSL themes: {data?.omniDsl?.themeCount ?? 0}
                  </div>
                  <div className="border border-slate-200 bg-slate-50" style={{ borderRadius: radiusPanel, padding: layoutPanelPadding }}>
                    <p className="text-xs text-slate-500">Semantic / Primary</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{previewPrimary}</span>
                      <span className="h-7 w-7 rounded-lg border border-slate-300" style={{ background: previewPrimary }} />
                    </div>
                  </div>
                  <div className="border border-slate-200 bg-slate-50" style={{ borderRadius: radiusPanel, padding: layoutPanelPadding }}>
                    <p className="text-xs text-slate-500">Semantic / Secondary</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{previewSecondary}</span>
                      <span className="h-7 w-7 rounded-lg border border-slate-300" style={{ background: previewSecondary }} />
                    </div>
                  </div>
                  <div className="border border-slate-200 bg-slate-50" style={{ borderRadius: radiusPanel, padding: layoutPanelPadding }}>
                    <p className="text-xs text-slate-500">Text / Default</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{previewText}</span>
                      <span className="h-7 w-7 rounded-lg border border-slate-300" style={{ background: previewText }} />
                    </div>
                  </div>

                  {colorTokens.map((token) => (
                    <div
                      key={token.name}
                      className="border border-slate-200 bg-white"
                      style={{ borderRadius: radiusPanel, padding: layoutPanelPadding }}
                    >
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

            {/* Grid & Gutter Visual Preview */}
            <section
              className="border border-slate-200 bg-white shadow-sm"
              style={{ borderRadius: radiusSection, padding: layoutSectionPadding }}
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Grid &amp; Gutter Preview</h2>
                  <p className="text-sm text-slate-500">Live layout token values visualised as measurement guides.</p>
                </div>
                <div className="flex items-center gap-2">
                  {tokenPreviewMode ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                      <span className="h-2 w-2 rounded-full" style={{ background: previewPrimary }} />
                      Token: {tokenPreviewMode}
                    </span>
                  ) : (
                    <span className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs text-slate-400">No mode token</span>
                  )}
                  <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: previewPrimary }}>
                    Active: {effectivePreviewMode}
                  </span>
                </div>
              </div>
              <div
                className="mb-4 flex items-center gap-3 rounded-lg text-xs"
                style={{ padding: layoutPanelPadding, background: tokenPreviewMode ? "#f0fdf4" : "#fafafa", border: tokenPreviewMode ? "1px solid #bbf7d0" : "1px solid #e2e8f0" }}
              >
                <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ background: tokenPreviewMode ? "#16a34a" : "#94a3b8" }} />
                <div className="flex-1">
                  <span className="font-semibold text-slate-700">layout.preview.mode</span>
                  <span className="mx-2 text-slate-400">→</span>
                  <span className="font-mono" style={{ color: tokenPreviewMode ? "#15803d" : "#64748b" }}>
                    {tokenPreviewMode || "(not set — UI default used)"}
                  </span>
                  {previewModeOverridden && <span className="ml-3 text-amber-600">(manually overridden)</span>}
                </div>
                {previewModeOverridden && (
                  <button type="button" onClick={() => setPreviewModeOverridden(false)} className="text-xs text-slate-500 underline hover:text-slate-800">
                    Reset to token
                  </button>
                )}
              </div>

              {/* Gutter type selector — all layout.grid.gutter variants */}
              {gutterTokenEntries.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Grid Gutter Types ({gutterTokenEntries.length} found)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedGutterToken(null)}
                      className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
                      style={{
                        background: selectedGutterToken === null ? previewPrimary : "#f1f5f9",
                        color: selectedGutterToken === null ? previewInverse : "#0f172a",
                        borderColor: selectedGutterToken === null ? previewPrimary : "#e2e8f0",
                      }}
                    >
                      Default ({layoutGridGutter})
                    </button>
                    {gutterTokenEntries.map((entry) => (
                      <button
                        key={entry.name}
                        type="button"
                        onClick={() => setSelectedGutterToken(entry.name)}
                        className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
                        style={{
                          background: selectedGutterToken === entry.name ? previewPrimary : "#f1f5f9",
                          color: selectedGutterToken === entry.name ? previewInverse : "#0f172a",
                          borderColor: selectedGutterToken === entry.name ? previewPrimary : "#e2e8f0",
                        }}
                      >
                        <span className="font-mono">{entry.label}</span>
                        <span className="ml-1.5 opacity-70">{entry.value}</span>
                        {entry.breakpoint && (
                          <span
                            className="ml-1.5 rounded px-1 text-[10px] font-bold uppercase"
                            style={{ background: previewPrimary, opacity: 0.8, color: previewInverse }}
                          >
                            {entry.breakpoint}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedGutterToken && (() => {
                    const sel = gutterTokenEntries.find((e) => e.name === selectedGutterToken);
                    return sel ? (
                      <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                        <span className="font-semibold">{sel.name}</span>
                        <span className="mx-2 text-slate-400">→</span>
                        <span className="font-mono font-semibold" style={{ color: previewPrimary }}>{sel.value}</span>
                        <span className="ml-2 text-slate-400">({sel.type})</span>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Token value rows */}
              {[
                { label: "layout.grid.gutter", token: "Grid Gutter", value: layoutGridGutter, color: previewPrimary },
                { label: "layout.card.gap", token: "Card Gap", value: layoutCardGutter, color: "#6366f1" },
                { label: "layout.section.gap", token: "Section Gap", value: layoutSectionGap, color: "#0ea5e9" },
                { label: "layout.page.padding", token: "Page Padding", value: layoutPagePadding, color: "#10b981" },
                { label: "layout.sidebar.width", token: "Sidebar Width", value: layoutSidebarWidth, color: "#f59e0b" },
                { label: "layout.header.padding-x", token: "Header Pad X", value: layoutHeaderPaddingX, color: "#ec4899" },
                { label: "layout.header.padding-y", token: "Header Pad Y", value: layoutHeaderPaddingY, color: "#8b5cf6" },
                { label: "layout.section.padding", token: "Section Padding", value: layoutSectionPadding, color: "#14b8a6" },
                { label: "layout.panel.padding", token: "Panel Padding", value: layoutPanelPadding, color: "#f97316" },
                { label: "layout.canvas.padding", token: "Canvas Padding", value: layoutCanvasPadding, color: "#ef4444" },
              ].map(({ label, token, value, color }) => {
                const numericPx = Number.parseInt(String(value), 10) || 0;
                const barMaxPx = 320;
                const barWidthPct = Math.min((numericPx / barMaxPx) * 100, 100);
                return (
                  <div
                    key={label}
                    className="mb-3 last:mb-0"
                    style={{ borderRadius: radiusPanel, padding: layoutPanelPadding, background: "#f8fafc", border: "1px solid #e2e8f0" }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-slate-700">{token}</span>
                        <span className="ml-2 text-xs text-slate-400">{label}</span>
                      </div>
                      <span
                        className="rounded px-2 py-0.5 text-xs font-bold text-white"
                        style={{ background: color }}
                      >
                        {value}
                      </span>
                    </div>
                    {/* Visual bar representing the pixel size */}
                    <div className="relative h-4 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                        style={{ width: `${barWidthPct}%`, background: color, opacity: 0.85 }}
                      />
                      {/* Tick marks every 25% */}
                      {[25, 50, 75].map((pct) => (
                        <div
                          key={pct}
                          className="absolute inset-y-0 w-px bg-white/60"
                          style={{ left: `${pct}%` }}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-right text-[10px] text-slate-400">{numericPx}px of {barMaxPx}px scale</p>
                  </div>
                );
              })}

              {/* Live grid simulation */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Live Grid Simulation</p>

                {/* Column gutter demo */}
                <div className="mb-4">
                  {(() => {
                    const sel = gutterTokenEntries.find((e) => e.name === selectedGutterToken);
                    const activeGutter = sel ? sel.value : layoutGridGutter;
                    const activeGutterLabel = sel ? `${sel.label} (${activeGutter})` : `default (${activeGutter})`;
                    return (
                      <>
                        <p className="mb-2 text-xs text-slate-500">
                          Column gutter: <strong>{activeGutterLabel}</strong>
                          {sel && <span className="ml-2 font-mono text-slate-400">{sel.name}</span>}
                        </p>
                        <div className="flex overflow-hidden rounded-lg" style={{ gap: activeGutter }}>
                          {Array.from({ length: effectivePreviewMode === "desktop" ? metricColumnsDesktop : metricColumnsTablet }).map((_, i) => (
                            <div
                              key={i}
                              className="flex-1 py-3 text-center text-xs font-medium text-white"
                              style={{ background: previewPrimary, borderRadius: radiusPanel, opacity: 0.75 + i * 0.05 }}
                            >
                              Col {i + 1}
                            </div>
                          ))}
                        </div>
                        {/* Show all gutter variants as mini demos when no token selected */}
                        {!selectedGutterToken && gutterTokenEntries.length > 1 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">All gutter variants:</p>
                            {gutterTokenEntries.map((entry) => (
                              <div key={entry.name}>
                                <p className="mb-1 text-[10px] text-slate-400">
                                  <span className="font-mono">{entry.name}</span> → <strong>{entry.value}</strong>
                                </p>
                                <div className="flex overflow-hidden rounded" style={{ gap: entry.value }}>
                                  {Array.from({ length: effectivePreviewMode === "desktop" ? metricColumnsDesktop : metricColumnsTablet }).map((_, i) => (
                                    <div
                                      key={i}
                                      className="flex-1 py-2 text-center text-[10px] font-medium text-white"
                                      style={{ background: previewPrimary, borderRadius: radiusPanel, opacity: 0.6 + i * 0.05 }}
                                    >
                                      {i + 1}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Section gap demo */}
                <div className="mb-2">
                  <p className="mb-2 text-xs text-slate-500">Section gap: <strong>{layoutSectionGap}</strong></p>
                  <div style={{ display: "grid", gap: layoutSectionGap }}>
                    {["Section A", "Section B"].map((label) => (
                      <div
                        key={label}
                        className="py-2 text-center text-xs font-medium"
                        style={{ background: "#e0f2fe", borderRadius: radiusPanel, color: "#0369a1" }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card gutter demo */}
                <div>
                  <p className="mb-2 text-xs text-slate-500">Card gap: <strong>{layoutCardGutter}</strong></p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: layoutCardGutter }}>
                    {["Card 1", "Card 2", "Card 3"].map((label) => (
                      <div
                        key={label}
                        className="py-2 text-center text-xs font-medium"
                        style={{ background: "#f3e8ff", borderRadius: radiusPanel, color: "#7c3aed" }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}