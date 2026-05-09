import React, { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTokens } from "../theme/TokenProvider";

function tokenNameToCssVar(tokenName) {
  return `--${tokenName.replaceAll(".", "-")}`;
}

function isColorToken(type, value) {
  if (String(type).toUpperCase() === "COLOR") return true;
  return /^(#([\da-f]{3,8})|rgb\(|rgba\(|hsl\(|hsla\()/i.test(String(value).trim());
}

function isSizeLike(value) {
  return /^-?\d*\.?\d+(px|rem|em|%)$/i.test(String(value).trim());
}

function getTokenCategory(tokenName, tokenType) {
  const type = String(tokenType).toLowerCase();
  const name = tokenName.toLowerCase();

  if (type.includes("color") || name.includes("color") || name.includes("brand")) return "Color";
  if (name.includes("font") || name.includes("text") || name.includes("typography")) return "Typography";
  if (name.includes("space") || name.includes("padding") || name.includes("margin") || name.includes("gap")) return "Spacing";
  if (name.includes("radius") || name.includes("corner")) return "Border Radius";
  if (name.includes("shadow") || name.includes("elevation")) return "Shadows";
  if (name.includes("size") || name.includes("width") || name.includes("height")) return "Sizing";

  return "Other";
}

function prettifyTokenName(tokenName) {
  return tokenName
    .replaceAll(".", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
  const [query, setQuery] = useState("");
  const [isTestButtonHovered, setIsTestButtonHovered] = useState(false);

  const themes = Object.keys(data?.brands ?? {});
  console.log("Available themes:", themes, activeTheme, data?.brands?.[activeTheme]);
  const activeTokens = data?.brands?.[activeTheme]?.tokens ?? {};
  const tokenEntries = useMemo(() => {
    return Object.entries(activeTokens).map(([name, token]) => {
      const value = token?.value ?? "";
      const resolvedValue = token?.resolvedValue ?? value;
      const type = token?.type ?? "UNKNOWN";
      const cssVar = tokenNameToCssVar(name);

      return {
        name,
        displayName: prettifyTokenName(name),
        value,
        resolvedValue,
        type,
        cssVar,
        isAlias: String(value).startsWith("alias:"),
        isColor: isColorToken(type, resolvedValue),
        isSizeLike: isSizeLike(resolvedValue),
        category: getTokenCategory(name, type)
      };
    });
  }, [activeTokens]);

  const filteredTokens = useMemo(() => {
    if (!query.trim()) return tokenEntries;

    const lowerQuery = query.trim().toLowerCase();
    return tokenEntries.filter((token) => {
      return (
        token.name.toLowerCase().includes(lowerQuery) ||
        token.displayName.toLowerCase().includes(lowerQuery) ||
        String(token.value).toLowerCase().includes(lowerQuery) ||
        String(token.resolvedValue).toLowerCase().includes(lowerQuery) ||
        String(token.type).toLowerCase().includes(lowerQuery) ||
        token.category.toLowerCase().includes(lowerQuery)
      );
    });
  }, [query, tokenEntries]);

  const groupedTokens = useMemo(() => {
    return filteredTokens.reduce((accumulator, token) => {
      if (!accumulator[token.category]) {
        accumulator[token.category] = [];
      }
      accumulator[token.category].push(token);
      return accumulator;
    }, {});
  }, [filteredTokens]);

  const summary = useMemo(() => {
    const colorCount = tokenEntries.filter((token) => token.isColor).length;
    const aliasCount = tokenEntries.filter((token) => token.isAlias).length;
    const categories = new Set(tokenEntries.map((token) => token.category)).size;

    return {
      total: tokenEntries.length,
      colorCount,
      aliasCount,
      categories
    };
  }, [tokenEntries]);

  // Test variables
  const activeBrandName = data?.brands?.[activeTheme]?.name ?? "No theme selected";
  const previewPrimary = firstTokenValue(activeTokens, ["color.brand.primary.base", "color.primary", "brand.primary"], "#111827");
  const previewInverse = firstTokenValue(activeTokens, ["color.text.inverse", "text.inverse"], "#ffffff");
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-cyan-50 p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header Section */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm mb-6">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white">
            <h1 className="text-3xl font-bold">Token Testing - Classes & Styles</h1>
            <p className="mt-2 text-sm text-slate-200">Test single label, input, and button with all applied classes</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid gap-3">
              <input
                value={fileKey}
                onChange={(e) => setFileKey(e.target.value)}
                placeholder="Figma file key"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />

              <select
                value={activeTheme}
                onChange={(e) => setActiveTheme(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              >
                <option value="">Select theme</option>
                {themes.map((theme) => (
                  <option key={theme} value={theme}>{data.brands[theme].name}</option>
                ))}
              </select>

              <button
                onClick={syncTokens}
                className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
                style={{
                  background: previewPrimary,
                  color: previewInverse,
                  border: `1px solid ${previewPrimary}`,
                  borderRadius: previewRadius,
                  fontFamily: previewFont
                }}
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                {loading ? "Syncing" : "Sync Tokens"}
              </button>
            </div>
          </div>
        </section>

        {/* Test Section - Single Label, Input, Button */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Test Elements</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Minimal Testing UI</h2>
          
          <div className="mt-6 space-y-6">
            {/* Test Input with Label */}
            <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
              <label htmlFor="testInput" className="text-sm font-semibold text-slate-900 block mb-3">
                Test Label for Input
              </label>
              <input
                id="testInput"
                type="text"
                placeholder="Test input with all classes"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Test Button */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-900 mb-3">Test Button</p>
              <button
                type="button"
                onMouseEnter={() => setIsTestButtonHovered(true)}
                onMouseLeave={() => setIsTestButtonHovered(false)}
                className="font-semibold transition-all duration-200"
                style={{
                  background: isTestButtonHovered ? buttonHoverBg : buttonBaseBg,
                  color: isTestButtonHovered ? buttonHoverText : buttonBaseText,
                  borderRadius: isTestButtonHovered ? buttonHoverRadius : buttonBaseRadius,
                  padding: `${buttonPaddingY} ${buttonPaddingX}`,
                  border: `1px solid ${isTestButtonHovered ? buttonHoverBorder : buttonBaseBorder}`,
                  fontFamily: previewFont
                }}
              >
                Test Button with Token Styles
              </button>
              <p className="mt-3 text-xs text-slate-600">
                Base: {buttonBaseBg} | Hover: {buttonHoverBg} | Radius: {isTestButtonHovered ? buttonHoverRadius : buttonBaseRadius}
              </p>
            </div>

            {/* Brand Info */}
            <div className="rounded-2xl border border-slate-200 p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
              <p className="text-xs uppercase tracking-wide text-slate-500">Active Brand : {activeBrandName}</p>

              <div className="mt-4 flex items-center gap-3">
                <span 
                  className="h-8 w-8 rounded-lg border border-slate-300"
                  style={{ background: previewPrimary }}
                  title="Primary Color"
                />
                <span className="text-sm text-slate-600">Primary Color: {previewPrimary}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}