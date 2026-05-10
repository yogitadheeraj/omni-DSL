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

function findTokenEntry(tokenEntries, exactNames = [], regex = null) {
  for (const name of exactNames) {
    const exact = tokenEntries.find((token) => token.name === name);
    if (exact) return exact;
  }

  if (regex) {
    const matched = tokenEntries.find((token) => regex.test(token.name.toLowerCase()));
    if (matched) return matched;
  }

  return null;
}

function TopNav({
  layoutContainerMaxWidth,
  previewPrimary,
  isTestButtonHovered,
  buttonHoverBg,
  buttonBaseBg,
  buttonHoverText,
  buttonBaseText,
  buttonHoverBorder,
  buttonBaseBorder,
  setIsTestButtonHovered,
  syncTokens,
  forceRefresh,
  loading
}) {
  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-40">
      <div className="mx-auto flex items-center justify-between px-6 py-4" style={{ maxWidth: layoutContainerMaxWidth }}>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-white" style={{ background: previewPrimary }}>
            O
          </span>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Omni DSL</h1>
            <p className="text-xs text-slate-500">Design System Library</p>
          </div>
        </div>
        <button
          onClick={() => syncTokens(forceRefresh)}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all"
          style={{
            background: isTestButtonHovered ? buttonHoverBg : buttonBaseBg,
            color: isTestButtonHovered ? buttonHoverText : buttonBaseText,
            border: `1px solid ${isTestButtonHovered ? buttonHoverBorder : buttonBaseBorder}`
          }}
          onMouseEnter={() => setIsTestButtonHovered(true)}
          onMouseLeave={() => setIsTestButtonHovered(false)}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          {loading ? "Syncing..." : "Sync"}
        </button>
      </div>
    </nav>
  );
}

function HeroSection({ layoutSectionPadding, layoutPagePadding, previewPrimary }) {
  return (
    <section
      className="py-16 text-center"
      style={{
        borderBottom: "1px solid #e2e8f0",
        padding: `${layoutSectionPadding} ${layoutPagePadding}`
      }}
    >
      <h1 className="text-5xl font-bold text-slate-900 mb-3">Full-featured design system</h1>
      <p className="text-xl text-slate-600 mb-8">Everything you need to design at scale</p>
      <p className="text-sm text-slate-500 mb-6 max-w-2xl mx-auto">
        A comprehensive, accessible, and well-crafted design system built on research-backed principles.
        Consistent, clear, mindful, and compliant with enterprise standards.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button className="px-6 py-3 text-sm font-semibold rounded-lg text-white transition-all" style={{ background: previewPrimary }}>
          Get Started
        </button>
        <button className="px-6 py-3 text-sm font-semibold rounded-lg border transition-all" style={{ borderColor: previewPrimary, color: previewPrimary }}>
          View Documentation
        </button>
      </div>
    </section>
  );
}

function QuickNavSection({ layoutSectionPadding, layoutGridGutter, radiusSection, navCards, previewPrimary }) {
  return (
    <section style={{ padding: layoutSectionPadding }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gap: layoutGridGutter }}>
        {navCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-6 rounded-lg border border-slate-200 bg-white hover:shadow-lg transition-all cursor-pointer group"
              style={{ borderRadius: radiusSection }}
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform"
                  style={{ background: previewPrimary }}
                >
                  <Icon size={20} />
                </span>
                <h3 className="font-semibold text-slate-900">{card.title}</h3>
              </div>
              <p className="text-sm text-slate-600">{card.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FundamentalsSection({
  layoutSectionPadding,
  layoutGridGutter,
  layoutCardGutter,
  radiusSection,
  radiusPanel,
  activeTheme,
  themes,
  setActiveTheme,
  selectedFundamental,
  setSelectedFundamental,
  fundamentalMenu,
  fundamentalGroups,
  selectedFundamentalTokens,
  semanticGroupRows,
  semanticGroupsJson,
  headingGuidelines,
  typographyProfile,
  previewPrimary,
  previewInverse,
  activeBrandName
}) {
  const activeSectionLabel = fundamentalMenu.find((item) => item.key === selectedFundamental)?.label || "Guidelines";
  const sortedTokens = [...selectedFundamentalTokens].sort((a, b) => a.name.localeCompare(b.name));
  const [expandedGroups, setExpandedGroups] = useState({});

  function toggleGroup(groupName) {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  }

  return (
    <section style={{ padding: layoutSectionPadding, borderTop: "1px solid #d4d4d8", background: "#f3f4f6" }}>
      <div className="mb-3">
        <h2 className="text-2xl font-bold text-slate-900">Design Tokens</h2>
        <p className="text-sm text-slate-600">Specification pattern view for the selected brand, aligned to token documentation style.</p>
      </div>

      {!activeTheme ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
          Select a brand from Admin Connection below to view brand-wise token guidelines.
        </div>
      ) : (
        <div className="grid lg:grid-cols-[240px_1fr]" style={{ gap: layoutGridGutter }}>
          <aside className="rounded-lg border border-slate-300 bg-white p-3" style={{ borderRadius: radiusSection }}>
            <div className="mb-3 rounded bg-black px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-white">Fundamentals Menu</div>
            <div className="grid gap-2">
              {fundamentalMenu.map((item) => {
                const active = selectedFundamental === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedFundamental(item.key)}
                    className="flex items-center justify-between rounded border px-2.5 py-2 text-left text-xs font-medium transition-all"
                    style={{
                      background: active ? "#0f172a" : "#f8fafc",
                      color: active ? "#ffffff" : "#0f172a",
                      borderColor: active ? "#0f172a" : "#d4d4d8"
                    }}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs opacity-80">{item.count ?? 0}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <article className="rounded-lg border border-slate-300 bg-white" style={{ borderRadius: radiusSection }}>
            <div className="rounded-t-lg bg-black px-4 py-3 text-white" style={{ borderTopLeftRadius: radiusSection, borderTopRightRadius: radiusSection }}>
              <p className="text-[11px] uppercase tracking-[0.15em] opacity-80">Design Tokens Spec</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{activeSectionLabel}</h3>
                <div className="flex items-center gap-2">
                  <label htmlFor="design-token-brand" className="text-[11px] uppercase tracking-wider text-white/80">
                    Brand
                  </label>
                  <select
                    id="design-token-brand"
                    value={activeTheme}
                    onChange={(e) => setActiveTheme(e.target.value)}
                    className="rounded border border-white/30 bg-slate-900 px-2 py-1 text-[11px] text-white outline-none"
                  >
                    <option value="">Select brand</option>
                    {themes.map((theme) => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="px-4 py-3" style={{ display: "grid", gap: layoutCardGutter }}>
              <div className="grid md:grid-cols-2 gap-2">
                <div className="rounded border border-slate-200 bg-slate-50 p-2">
                  <p className="text-[10px] uppercase text-slate-500">Token Count</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedFundamentalTokens.length}</p>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 p-2">
                  <p className="text-[10px] uppercase text-slate-500">Font Base</p>
                  <p className="text-xs font-mono text-slate-900 truncate">{typographyProfile.fontFamilyBase}</p>
                </div>
              
              </div>

              {selectedFundamental === "semantic-json" ? (
                <>
                  <div>
                    <div className="mb-2 rounded bg-black px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white">Business Group View</div>
                    <div className="grid md:grid-cols-2" style={{ gap: layoutCardGutter }}>
                      {semanticGroupRows.map((group) => (
                        <div key={group.group} className="rounded border border-slate-200 bg-slate-50 p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">{group.group}</p>
                            <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">{group.count}</span>
                          </div>
                          {(() => {
                            const isExpanded = Boolean(expandedGroups[group.group]);
                            const visibleTokens = isExpanded ? group.tokens : group.tokens.slice(0, 8);
                            return (
                          <div className="space-y-1">
                            {visibleTokens.map((token) => (
                              <div key={token.name} className="flex items-center justify-between gap-2 text-[11px]">
                                <span className="font-mono text-slate-600 truncate">{token.name}</span>
                                <span className="font-mono text-slate-800">{token.resolvedValue || token.value || "-"}</span>
                              </div>
                            ))}
                            {group.count > 8 && !isExpanded && (
                              <button
                                type="button"
                                onClick={() => toggleGroup(group.group)}
                                className="text-[10px] text-slate-500 underline hover:text-slate-800"
                              >
                                +{group.count - 8} more
                              </button>
                            )}
                            {group.count > 8 && isExpanded && (
                              <button
                                type="button"
                                onClick={() => toggleGroup(group.group)}
                                className="text-[10px] text-slate-500 underline hover:text-slate-800"
                              >
                                Show less
                              </button>
                            )}
                          </div>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 rounded bg-black px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white">Semantic Groups JSON (Brand-wise)</div>
                    <div className="overflow-auto rounded border border-slate-200 bg-slate-950 p-3" style={{ maxHeight: 360 }}>
                      <pre className="text-[11px] leading-5 text-emerald-300">{JSON.stringify(semanticGroupsJson, null, 2)}</pre>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {selectedFundamental === "headings" && (
                    <div>
                      <div className="mb-2 rounded bg-black px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white">Headings Guideline</div>
                      <div className="overflow-x-auto rounded border border-slate-200">
                        <table className="w-full border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100 text-left uppercase tracking-wider text-slate-500">
                              <th className="border-b border-slate-200 px-3 py-2">Heading</th>
                              <th className="border-b border-slate-200 px-3 py-2">Class</th>
                              <th className="border-b border-slate-200 px-3 py-2">Token</th>
                              <th className="border-b border-slate-200 px-3 py-2">Properties</th>
                            </tr>
                          </thead>
                          <tbody>
                            {headingGuidelines.map((row) => (
                              <tr key={row.label}>
                                <td className="border-b border-slate-100 px-3 py-2 font-semibold text-slate-700">{row.label}</td>
                                <td className="border-b border-slate-100 px-3 py-2 font-mono text-rose-700">{row.className}</td>
                                <td className="border-b border-slate-100 px-3 py-2 font-mono text-slate-500">{row.tokenName || "(fallback)"}</td>
                                <td className="border-b border-slate-100 px-3 py-2 font-mono text-emerald-800">font-size:{row.value};</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="mb-2 rounded bg-black px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white">Token Table</div>
                    <div className="overflow-x-auto rounded border border-slate-200">
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-left uppercase tracking-wider text-slate-500">
                            <th className="border-b border-slate-200 px-3 py-2">Token</th>
                            <th className="border-b border-slate-200 px-3 py-2">Value</th>
                            <th className="border-b border-slate-200 px-3 py-2">Type</th>
                            <th className="border-b border-slate-200 px-3 py-2">Collection</th>
                            <th className="border-b border-slate-200 px-3 py-2">Preview</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedTokens.map((token) => {
                            const tokenValue = token.resolvedValue || token.value || "-";
                            const isColorLike = /^(#|rgb\(|hsl\()/i.test(String(tokenValue));
                            return (
                              <tr key={token.name}>
                                <td className="border-b border-slate-100 px-3 py-2 font-mono text-slate-700">{token.name}</td>
                                <td className="border-b border-slate-100 px-3 py-2 font-mono text-slate-900">{tokenValue}</td>
                                <td className="border-b border-slate-100 px-3 py-2 text-slate-500">{token.type}</td>
                                <td className="border-b border-slate-100 px-3 py-2 text-slate-500">{token.collection || "-"}</td>
                                <td className="border-b border-slate-100 px-3 py-2">
                                  {isColorLike ? (
                                    <span className="inline-flex h-5 w-10 rounded border border-slate-300" style={{ background: tokenValue }} />
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

function MetricsSection({ layoutSectionPadding, layoutCardGutter, radiusSection, metricCards, previewPrimary }) {
  return (
    <section style={{ padding: layoutSectionPadding, borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ gap: layoutCardGutter }}>
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="p-6 rounded-lg bg-white border border-slate-200 text-center" style={{ borderRadius: radiusSection }}>
              <div className="flex justify-center mb-3">
                <span className="h-12 w-12 rounded-lg flex items-center justify-center text-white" style={{ background: previewPrimary }}>
                  <Icon size={24} />
                </span>
              </div>
              <p className="text-4xl font-bold text-slate-900 mb-1">{metric.value}</p>
              <p className="text-sm text-slate-600">{metric.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function UpdatesSection({ layoutSectionPadding, layoutGridGutter, radiusSection, announcements, previewPrimary }) {
  return (
    <section style={{ padding: layoutSectionPadding }}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Latest Updates</h2>
        <p className="text-slate-600">Stay informed about the latest developments and opportunities</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ gap: layoutGridGutter }}>
        {announcements.map((ann, idx) => (
          <div
            key={idx}
            className="p-6 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group"
            style={{ borderRadius: radiusSection }}
          >
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: previewPrimary }}>
                {ann.category}
              </span>
              <p className="text-xs text-slate-500 mt-2">{ann.date}</p>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{ann.title}</h3>
            <ul className="space-y-2">
              {ann.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="h-1 w-1 rounded-full" style={{ background: previewPrimary }} />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function PrinciplesSection({ layoutSectionPadding, layoutGridGutter, radiusSection, principles, previewPrimary }) {
  return (
    <section
      style={{
        padding: layoutSectionPadding,
        borderTop: "1px solid #e2e8f0",
        borderBottom: "1px solid #e2e8f0",
        background: "#f8fafc"
      }}
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Design Principles</h2>
        <p className="text-slate-600">Crafted based on research by users, for users</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ gap: layoutGridGutter }}>
        {principles.map((p, idx) => (
          <div key={idx} className="p-6 rounded-lg bg-white border border-slate-200 text-center" style={{ borderRadius: radiusSection }}>
            <div className="text-4xl mb-3 font-bold" style={{ color: previewPrimary }}>{p.icon}</div>
            <h3 className="font-semibold text-slate-900 mb-2 text-lg">{p.title}</h3>
            <p className="text-sm text-slate-600">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResourcesSection({ layoutSectionPadding, layoutCardGutter }) {
  return (
    <section style={{ padding: layoutSectionPadding }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Resources & Tools</h2>
        <p className="text-slate-600">Everything you need to get started</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ gap: layoutCardGutter }}>
        <div className="p-6 rounded-lg border border-slate-200 bg-white text-center hover:shadow-lg transition-all">
          <p className="text-3xl mb-2">📚</p>
          <h3 className="font-semibold text-slate-900 mb-2">Guidelines</h3>
          <p className="text-sm text-slate-600 mb-4">Comprehensive design and usage guidelines</p>
          <button className="text-sm font-semibold text-blue-600 hover:underline">Learn more →</button>
        </div>
        <div className="p-6 rounded-lg border border-slate-200 bg-white text-center hover:shadow-lg transition-all">
          <p className="text-3xl mb-2">🎨</p>
          <h3 className="font-semibold text-slate-900 mb-2">Assets & Templates</h3>
          <p className="text-sm text-slate-600 mb-4">Download design files and components</p>
          <button className="text-sm font-semibold text-blue-600 hover:underline">Download →</button>
        </div>
        <div className="p-6 rounded-lg border border-slate-200 bg-white text-center hover:shadow-lg transition-all">
          <p className="text-3xl mb-2">🚀</p>
          <h3 className="font-semibold text-slate-900 mb-2">Get Started</h3>
          <p className="text-sm text-slate-600 mb-4">Installation and setup instructions</p>
          <button className="text-sm font-semibold text-blue-600 hover:underline">Install now →</button>
        </div>
      </div>
    </section>
  );
}

function AdminFooterSection({
  layoutSectionPadding,
  fileKey,
  setFileKey,
  activeTheme,
  setActiveTheme,
  themes,
  data,
  forceRefresh,
  setForceRefresh
}) {
  return (
    <footer
      style={{
        borderTop: "1px solid #e2e8f0",
        padding: layoutSectionPadding,
        background: "#f8fafc"
      }}
    >
      <div className="grid lg:grid-cols-[1fr_auto] gap-8">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Admin Connection</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                value={fileKey}
                onChange={(e) => setFileKey(e.target.value)}
                placeholder="Figma File Key"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-slate-400"
              />
              <select
                value={activeTheme}
                onChange={(e) => setActiveTheme(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-slate-400"
              >
                <option value="">Brand</option>
                {themes.map((theme) => (
                  <option key={theme} value={theme}>{data?.brands?.[theme]?.name ?? theme}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 text-xs">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={forceRefresh}
                  onChange={(e) => setForceRefresh(e.target.checked)}
                  className="h-3 w-3"
                />
                Force refresh
              </label>
            </div>
          </div>
        </div>

        <div className="text-right text-xs text-slate-500">
          <p className="mb-1"><strong>Source:</strong> {data?.source ?? "-"}</p>
          <p className="mb-1"><strong>Cache:</strong> {data?.cache?.hit ? "hit" : "miss"}</p>
          <p><strong>Themes:</strong> {data?.omniDsl?.themeCount ?? 0}</p>
        </div>
      </div>
    </footer>
  );
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
  const [selectedFundamental, setSelectedFundamental] = useState("typography");

  const themes = Object.keys(data?.brands ?? {});
  const activeTokens = data?.brands?.[activeTheme]?.tokens ?? {};
  const activeBrandName = data?.brands?.[activeTheme]?.name ?? "No theme selected";
  const tokenEntries = useMemo(() => Object.entries(activeTokens).map(([name, token]) => ({
    name,
    value: token?.value ?? "",
    resolvedValue: token?.resolvedValue ?? token?.value ?? "",
    type: token?.type ?? "UNKNOWN",
    collection: token?.collection ?? "unassigned",
    isColor: isColorToken(token?.type, token?.resolvedValue ?? token?.value)
  })), [activeTokens]);

  const colorTokens = useMemo(() => tokenEntries.filter((token) => token.isColor).slice(0, 5), [tokenEntries]);

  const baseFundamentalMenu = [
    { key: "semantic-json", label: "Semantic Groups JSON" },
    { key: "typography", label: "Typography" },
    { key: "color", label: "Color" },
    { key: "spacing", label: "Spacing" },
    { key: "radius", label: "Radius" },
    { key: "headings", label: "Headings" }
  ];

  const fundamentalGroups = useMemo(() => {
    const byName = (regex) => tokenEntries.filter((token) => regex.test(token.name.toLowerCase()));

    const typography = byName(/(^font\.|typography|text\.(size|weight|line-height|letter-spacing)|line-height|letter-spacing)/);
    const color = tokenEntries.filter((token) => token.isColor || /(^color\.|\.color\.|text\.inverse|text\.default)/.test(token.name.toLowerCase()));
    const spacing = byName(/(spacing|padding|margin|gap|gutter|inset|space)/);
    const radius = byName(/(radius|rounded|border-radius)/);
    const headings = byName(/(display|heading|text\.h[1-6]|typography\.h[1-6]|^h[1-6]\.)/);

    return {
      "semantic-json": tokenEntries,
      typography,
      color,
      spacing,
      radius,
      headings
    };
  }, [tokenEntries]);

  const semanticGroupRows = useMemo(() => {
    const buckets = {
      "Brand Colors": [],
      "Text & Content": [],
      "Surfaces & Backgrounds": [],
      "Borders & Strokes": [],
      "Typography": [],
      "Spacing & Layout": [],
      "Radius & Shape": [],
      "Component Tokens": [],
      "Other": []
    };

    tokenEntries.forEach((token) => {
      const n = token.name.toLowerCase();
      if (/^color\.brand|^brand\./.test(n)) buckets["Brand Colors"].push(token);
      else if (/text|content|label|typography\.content/.test(n)) buckets["Text & Content"].push(token);
      else if (/surface|background|bg\b|canvas/.test(n)) buckets["Surfaces & Backgrounds"].push(token);
      else if (/border|stroke|outline/.test(n)) buckets["Borders & Strokes"].push(token);
      else if (/^font\.|typography|line-height|letter-spacing|text\.h[1-6]/.test(n)) buckets["Typography"].push(token);
      else if (/spacing|padding|margin|gap|gutter|layout|grid|inset/.test(n)) buckets["Spacing & Layout"].push(token);
      else if (/radius|rounded|corner/.test(n)) buckets["Radius & Shape"].push(token);
      else if (/^(button|input|select|card|modal|tabs|checkbox|badge|alert|form)\./.test(n)) buckets["Component Tokens"].push(token);
      else buckets["Other"].push(token);
    });

    return Object.entries(buckets)
      .map(([group, tokens]) => ({ group, tokens, count: tokens.length }))
      .filter((row) => row.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [tokenEntries]);

  const semanticGroupsJson = useMemo(() => {
    const groups = {};
    semanticGroupRows.forEach((row) => {
      groups[row.group] = row.tokens.map((token) => ({
        name: token.name,
        value: token.resolvedValue || token.value || "",
        type: token.type,
        collection: token.collection || "unassigned"
      }));
    });

    return {
      brand: activeBrandName,
      brandKey: activeTheme,
      totalVariables: tokenEntries.length,
      groups
    };
  }, [semanticGroupRows, activeBrandName, activeTheme, tokenEntries.length]);

  const collectionTokenGroups = useMemo(() => {
    const grouped = {};
    tokenEntries.forEach((token) => {
      const collectionName = token.collection || "unassigned";
      if (!grouped[collectionName]) grouped[collectionName] = [];
      grouped[collectionName].push(token);
    });
    return grouped;
  }, [tokenEntries]);

  const collectionMenuItems = useMemo(() => {
    const apiCollectionNames = (data?.collections ?? []).map((collection) => collection.name);
    const tokenCollectionNames = Object.keys(collectionTokenGroups);
    const uniqueNames = [...new Set([...apiCollectionNames, ...tokenCollectionNames])];

    return uniqueNames.map((name) => ({
      key: `collection:${name}`,
      label: `Collection / ${name}`,
      count: collectionTokenGroups[name]?.length ?? 0
    }));
  }, [data, collectionTokenGroups]);

  const fundamentalMenu = useMemo(() => {
    const base = baseFundamentalMenu.map((item) => ({
      ...item,
      count: (fundamentalGroups[item.key] ?? []).length
    }));
    return [...base, ...collectionMenuItems];
  }, [fundamentalGroups, collectionMenuItems]);

  const headingGuidelines = useMemo(() => {
    const def = [
      { id: "display", label: "H1 DISPLAY", className: "text-display", fallback: "4.75rem", exact: ["text.display", "typography.display.size", "font.size.display"], rx: /(text\.display|typography\.display|font\.size\.display)/ },
      { id: "h1", label: "H1", className: "text-h1", fallback: "3.875rem", exact: ["text.h1", "typography.h1.size", "font.size.h1"], rx: /(text\.h1|typography\.h1|font\.size\.h1)/ },
      { id: "h2", label: "H2", className: "text-h2", fallback: "3rem", exact: ["text.h2", "typography.h2.size", "font.size.h2"], rx: /(text\.h2|typography\.h2|font\.size\.h2)/ },
      { id: "h3", label: "H3", className: "text-h3", fallback: "2.5rem", exact: ["text.h3", "typography.h3.size", "font.size.h3"], rx: /(text\.h3|typography\.h3|font\.size\.h3)/ },
      { id: "h4", label: "H4", className: "text-h4", fallback: "2rem", exact: ["text.h4", "typography.h4.size", "font.size.h4"], rx: /(text\.h4|typography\.h4|font\.size\.h4)/ },
      { id: "h5", label: "H5", className: "text-h5", fallback: "1.625rem", exact: ["text.h5", "typography.h5.size", "font.size.h5"], rx: /(text\.h5|typography\.h5|font\.size\.h5)/ },
      { id: "h6", label: "H6", className: "text-h6", fallback: "1.25rem", exact: ["text.h6", "typography.h6.size", "font.size.h6"], rx: /(text\.h6|typography\.h6|font\.size\.h6)/ }
    ];

    return def.map((row) => {
      const token = findTokenEntry(tokenEntries, row.exact, row.rx);
      return {
        label: row.label,
        className: row.className,
        tokenName: token?.name ?? "",
        value: token?.resolvedValue || token?.value || row.fallback
      };
    });
  }, [tokenEntries]);

  const typographyProfile = {
    fontFamilyBase: firstTokenValue(activeTokens, ["font.family.base", "font.family.primary", "typography.font.family.base", "typography.family"], "Inter"),
    fontFamilyHeading: firstTokenValue(activeTokens, ["font.family.heading", "typography.heading.font.family", "font.family.base", "typography.family"], "Inter"),
   };

  const selectedFundamentalTokens = useMemo(() => {
    if (selectedFundamental.startsWith("collection:")) {
      const collectionName = selectedFundamental.replace("collection:", "");
      return collectionTokenGroups[collectionName] ?? [];
    }
    return fundamentalGroups[selectedFundamental] ?? [];
  }, [selectedFundamental, fundamentalGroups, collectionTokenGroups]);

  const summary = useMemo(() => {
    const colorCount = tokenEntries.filter((token) => token.isColor).length;
    return {
      pages: 0,
      components: tokenEntries.length,
      brands: themes.length,
      patterns: colorCount
    };
  }, [tokenEntries, themes.length]);

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
    { label: "Components", value: summary.components, icon: Layers },
    { label: "Brands", value: summary.brands, icon: Palette },
    { label: "Patterns", value: summary.patterns, icon: Type },
    { label: "Color Tokens", value: tokenEntries.filter((t) => t.isColor).length, icon: Figma }
  ];

  const navCards = [
    { title: "Components", icon: Layers, desc: "Accessible, well-crafted components for your web project" },
    { title: "Blocks", icon: Palette, desc: "Reusable block patterns and compositions" },
    { title: "Patterns", icon: Type, desc: "Design patterns and best practices" },
    { title: "Guidelines", icon: Figma, desc: "Design system documentation and usage" },
    { title: "Resources", icon: Layers, desc: "Assets, tools, and templates" },
    { title: "Documentation", icon: Type, desc: "Getting started and API reference" }
  ];

  const principles = [
    { title: "Consistent", icon: "✓", desc: "Guidelines, applications and components follow a consistent format" },
    { title: "Clear", icon: "→", desc: "Clear purpose and unified message for component usage" },
    { title: "Mindful", icon: "◆", desc: "Designed with current and future needs in mind" },
    { title: "Compliant", icon: "✔", desc: "Easily adapted while maintaining unification best practices" }
  ];

  const announcements = [
    {
      title: "Major Release: Version 3.0",
      category: "New Release",
      date: "Nov 11, 2025",
      highlights: [
        "Official package release",
        "TailwindCSS 4.x compatibility",
        "Component UI upgrades",
        "Enhanced hover effects"
      ]
    },
    {
      title: "Design System Excellence Program",
      category: "Program",
      date: "Ongoing",
      highlights: [
        "Official expert certification",
        "Private & Government pathways",
        "Community recognition",
        "Implementation support"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: previewFont }}>
      <TopNav
        layoutContainerMaxWidth={layoutContainerMaxWidth}
        previewPrimary={previewPrimary}
        isTestButtonHovered={isTestButtonHovered}
        buttonHoverBg={buttonHoverBg}
        buttonBaseBg={buttonBaseBg}
        buttonHoverText={buttonHoverText}
        buttonBaseText={buttonBaseText}
        buttonHoverBorder={buttonHoverBorder}
        buttonBaseBorder={buttonBaseBorder}
        setIsTestButtonHovered={setIsTestButtonHovered}
        syncTokens={syncTokens}
        forceRefresh={forceRefresh}
        loading={loading}
      />

      <div className="mx-auto" style={{ maxWidth: layoutContainerMaxWidth }}>
        <HeroSection
          layoutSectionPadding={layoutSectionPadding}
          layoutPagePadding={layoutPagePadding}
          previewPrimary={previewPrimary}
        />

        <QuickNavSection
          layoutSectionPadding={layoutSectionPadding}
          layoutGridGutter={layoutGridGutter}
          radiusSection={radiusSection}
          navCards={navCards}
          previewPrimary={previewPrimary}
        />

        <FundamentalsSection
          layoutSectionPadding={layoutSectionPadding}
          layoutGridGutter={layoutGridGutter}
          layoutCardGutter={layoutCardGutter}
          radiusSection={radiusSection}
          radiusPanel={radiusPanel}
          activeTheme={activeTheme}
          themes={themes}
          setActiveTheme={setActiveTheme}
          selectedFundamental={selectedFundamental}
          setSelectedFundamental={setSelectedFundamental}
          fundamentalMenu={fundamentalMenu}
          fundamentalGroups={fundamentalGroups}
          selectedFundamentalTokens={selectedFundamentalTokens}
          semanticGroupRows={semanticGroupRows}
          semanticGroupsJson={semanticGroupsJson}
          headingGuidelines={headingGuidelines}
          typographyProfile={typographyProfile}
          previewPrimary={previewPrimary}
          previewInverse={previewInverse}
          activeBrandName={activeBrandName}
        />

        <MetricsSection
          layoutSectionPadding={layoutSectionPadding}
          layoutCardGutter={layoutCardGutter}
          radiusSection={radiusSection}
          metricCards={metricCards}
          previewPrimary={previewPrimary}
        />

        <UpdatesSection
          layoutSectionPadding={layoutSectionPadding}
          layoutGridGutter={layoutGridGutter}
          radiusSection={radiusSection}
          announcements={announcements}
          previewPrimary={previewPrimary}
        />

        <PrinciplesSection
          layoutSectionPadding={layoutSectionPadding}
          layoutGridGutter={layoutGridGutter}
          radiusSection={radiusSection}
          principles={principles}
          previewPrimary={previewPrimary}
        />

        <ResourcesSection
          layoutSectionPadding={layoutSectionPadding}
          layoutCardGutter={layoutCardGutter}
        />

        <AdminFooterSection
          layoutSectionPadding={layoutSectionPadding}
          fileKey={fileKey}
          setFileKey={setFileKey}
          activeTheme={activeTheme}
          setActiveTheme={setActiveTheme}
          themes={themes}
          data={data}
          forceRefresh={forceRefresh}
          setForceRefresh={setForceRefresh}
        />
      </div>
    </div>
  );
}
