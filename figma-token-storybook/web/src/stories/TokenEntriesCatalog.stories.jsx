import React, { useEffect, useMemo, useState } from "react";
import { useTokens } from "../theme/TokenProvider";

function normalizeThemeName(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolveDefaultTheme(themes = []) {
  const preferred = new Set(["whitelabel"]);
  const match = themes.find((theme) => preferred.has(normalizeThemeName(theme)));
  return match || themes[0] || "";
}

function toEntry(name, token) {
  return {
    name,
    value: token?.resolvedValue ?? token?.value ?? "",
    type: token?.type ?? "UNKNOWN"
  };
}

function sortByTailKey(entries) {
  const order = {
    mobile: 1,
    sm: 2,
    tablet: 3,
    md: 4,
    lg: 5,
    desktop: 6,
    xl: 7,
    "2xl": 8,
    xxl: 9
  };

  return [...entries].sort((a, b) => {
    const aKey = a.name.split(".").pop().toLowerCase();
    const bKey = b.name.split(".").pop().toLowerCase();
    const rankDiff = (order[aKey] || 999) - (order[bKey] || 999);
    return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
  });
}

function tokenList(tokens, pattern) {
  return sortByTailKey(tokens.filter((entry) => pattern.test(entry.name)));
}

function PropertyTable({ entries }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-3 py-2 text-left font-semibold text-slate-700">Token</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-700">Value</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-700">Type</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.name} className="border-b border-slate-100">
              <td className="px-3 py-2 font-mono text-slate-700">{entry.name}</td>
              <td className="px-3 py-2 font-mono text-slate-900">{String(entry.value)}</td>
              <td className="px-3 py-2 font-mono text-slate-500">{entry.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionCard({ title, subtitle, entries, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">No matching tokens available for this brand.</p>
      ) : (
        <>
          {children}
          <PropertyTable entries={entries} />
        </>
      )}
    </section>
  );
}

function TypographyPreview({ entries, label }) {
  return (
    <div className="mb-4 space-y-3">
      {entries.slice(0, 6).map((entry) => {
        const style = {
          fontSize: /\.size$/i.test(entry.name) ? entry.value : undefined,
          fontWeight: /\.weight$/i.test(entry.name) ? entry.value : undefined,
          lineHeight: /\.lineheight$/i.test(entry.name) ? entry.value : undefined,
          letterSpacing: /\.letterspacing$/i.test(entry.name) ? entry.value : undefined
        };

        return (
          <div key={entry.name} className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-mono text-slate-500">{entry.name}</p>
            <p className="mt-1 text-slate-900" style={style}>{label}</p>
          </div>
        );
      })}
    </div>
  );
}

function ColorPreview({ entries }) {
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {entries.slice(0, 12).map((entry) => (
        <div key={entry.name} className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <div className="h-16 border-b border-slate-200" style={{ background: String(entry.value) }} />
          <div className="p-3">
            <p className="text-xs font-mono text-slate-500">{entry.name}</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{String(entry.value)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ButtonPreview({ entries }) {
  const sizeOrder = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 };
  const weightOrder = { regular: 1, medium: 2, semibold: 3, bold: 4 };

  const buttonVariants = useMemo(() => {
    const buttons = {};

    entries.forEach((entry) => {
      const match = entry.name.match(/^typography\.button\.([a-z]+)-([a-z]+)\.([a-z]+(?:-[a-z]+)*)$/i);
      if (!match) return;

      const sizeKey = match[1].toLowerCase();
      const weightKey = match[2].toLowerCase();
      const property = match[3].toLowerCase();
      const variantKey = `${sizeKey}-${weightKey}`;

      if (!buttons[variantKey]) {
        buttons[variantKey] = { size: sizeKey, weight: weightKey, properties: {} };
      }

      buttons[variantKey].properties[property] = entry;
    });

    return Object.values(buttons)
      .filter((variant) => Object.keys(variant.properties).length > 0)
      .sort((a, b) => {
        const sizeDiff = (sizeOrder[a.size] || 999) - (sizeOrder[b.size] || 999);
        if (sizeDiff !== 0) return sizeDiff;
        return (weightOrder[a.weight] || 999) - (weightOrder[b.weight] || 999);
      });
  }, [entries]);

  if (buttonVariants.length === 0) {
    return <p className="mb-4 rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">No button tokens found for this brand.</p>;
  }

  return (
    <div className="mb-4 space-y-4">
      {buttonVariants.slice(0, 6).map((variant) => {
        const sizeValue = variant.properties.size?.value || "14px";
        const weightValue = variant.properties.weight?.value || (variant.weight === "bold" ? "700" : "400");
        const familyValue = variant.properties.family?.value || "inherit";
        const radiusValue = variant.properties.radius?.value || "10px";
        const widthValue = variant.properties.width?.value || "auto";
        const paddingValue = variant.properties.padding?.value || "12px 18px";

        return (
          <div key={`${variant.size}-${variant.weight}`} className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-mono text-slate-500">{variant.size}-{variant.weight}</p>
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center font-semibold transition hover:opacity-90"
              style={{
                background: "var(--color-brand-primary, #111827)",
                color: "var(--color-text-inverse, #ffffff)",
                fontSize: sizeValue,
                fontWeight: weightValue,
                fontFamily: familyValue,
                borderRadius: radiusValue,
                width: widthValue,
                padding: paddingValue
              }}
            >
              Brand button
            </button>
          </div>
        );
      })}
    </div>
  );
}

function FontPreview({ entries }) {
  const familyEntries = entries.filter((entry) => /font\.family|typography\.family/i.test(entry.name));
  const weightEntries = entries.filter((entry) => /font\.weight|typography\..*weight/i.test(entry.name));

  return (
    <div className="mb-4 space-y-4">
      {familyEntries.slice(0, 6).map((entry) => (
        <div key={entry.name} className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-mono text-slate-500">{String(entry.value)}</p>
          <p className="mt-2 text-xl text-slate-900" style={{ fontFamily: String(entry.value) }}>
            Brand font preview
          </p>
          <p className="mt-1 text-sm text-slate-600" style={{ fontFamily: String(entry.value) }}>
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      ))}

      {weightEntries.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {weightEntries.slice(0, 8).map((entry) => (
            <div key={entry.name} className="rounded-md border border-slate-200 bg-white p-3">
              <p className="text-xs font-mono text-slate-500">{entry.name}</p>
              <p className="mt-2 text-sm text-slate-900" style={{ fontWeight: String(entry.value) }}>
                Font weight sample
              </p>
              <p className="mt-1 text-xs text-slate-600">{String(entry.value)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GridPreview({ breakpoints, columns, gutters }) {
  return (
    <div className="mb-5 grid gap-4 md:grid-cols-3">
      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-sm font-semibold text-slate-700">Breakpoints</p>
        <div className="space-y-2">
          {breakpoints.slice(0, 8).map((entry) => {
            const px = Number.parseInt(String(entry.value), 10);
            const widthPct = Number.isFinite(px) ? Math.min((px / 14.4), 100) : 40;
            return (
              <div key={entry.name}>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>{entry.name.split(".").pop()}</span>
                  <span className="font-mono">{String(entry.value)}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded bg-slate-200">
                  <div className="h-full rounded bg-slate-700" style={{ width: `${widthPct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-sm font-semibold text-slate-700">Columns</p>
        <div className="space-y-3">
          {columns.slice(0, 6).map((entry) => {
            const count = Math.max(1, Math.min(12, Number.parseInt(String(entry.value), 10) || 1));
            return (
              <div key={entry.name}>
                <div className="mb-1 flex items-center justify-between text-[11px] text-slate-600">
                  <span>{entry.name.split(".").pop()}</span>
                  <span className="font-mono">{String(entry.value)}</span>
                </div>
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
                  {Array.from({ length: count }).map((_, idx) => (
                    <div key={`${entry.name}-${idx}`} className="h-5 rounded-sm border border-slate-300 bg-slate-200" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        <p className="mb-2 text-sm font-semibold text-slate-700">Gutters</p>
        <div className="space-y-3">
          {gutters.slice(0, 6).map((entry) => (
            <div key={entry.name}>
              <div className="mb-1 flex items-center justify-between text-[11px] text-slate-600">
                <span>{entry.name.split(".").pop()}</span>
                <span className="font-mono">{String(entry.value)}</span>
              </div>
              <div className="grid grid-cols-2" style={{ gap: String(entry.value) }}>
                <div className="h-6 rounded border border-slate-300 bg-slate-200" />
                <div className="h-6 rounded border border-slate-300 bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TokenEntriesCatalog() {
  const { data, activeTheme, setActiveTheme, loading, syncTokens } = useTokens();
  const [brandSwitching, setBrandSwitching] = useState(false);

  useEffect(() => {
    if (!data && !loading) {
      syncTokens();
    }
  }, [data, loading, syncTokens]);

  const themes = useMemo(() => Object.keys(data?.brands ?? {}), [data]);

  useEffect(() => {
    if (!activeTheme && themes.length > 0) {
      setActiveTheme(resolveDefaultTheme(themes));
    }
  }, [activeTheme, themes, setActiveTheme]);

  useEffect(() => {
    if (!brandSwitching) return;
    const timer = window.setTimeout(() => setBrandSwitching(false), 180);
    return () => window.clearTimeout(timer);
  }, [activeTheme, brandSwitching]);

  const activeTokens = data?.brands?.[activeTheme]?.tokens ?? {};

  const tokenEntries = useMemo(
    () => Object.entries(activeTokens).map(([name, token]) => toEntry(name, token)),
    [activeTokens]
  );

  const breakpoints = useMemo(() => tokenList(tokenEntries, /^layout\.breakpoint\./i), [tokenEntries]);
  const columns = useMemo(() => tokenList(tokenEntries, /^layout\.grid\.columns\./i), [tokenEntries]);
  const gutters = useMemo(() => tokenList(tokenEntries, /^layout\.grid\.gutter\./i), [tokenEntries]);

  const colors = useMemo(
    () => sortByTailKey(tokenEntries.filter((entry) => entry.type === "COLOR" || /^color\.|\.color\.|text\.inverse|text\.default/i.test(entry.name))),
    [tokenEntries]
  );
  const fonts = useMemo(
    () => sortByTailKey(tokenEntries.filter((entry) => /font\.family|font\.weight|typography\.family|typography\..*weight|line-height|letter-spacing/i.test(entry.name))),
    [tokenEntries]
  );

  const textbox = useMemo(() => tokenList(tokenEntries, /^(typography\.)?input\./i), [tokenEntries]);
  const labels = useMemo(() => tokenList(tokenEntries, /^(typography\.)?label\./i), [tokenEntries]);
  const subtitles = useMemo(() => tokenList(tokenEntries, /^(typography\.)?subtitle\./i), [tokenEntries]);

  const images = useMemo(() => tokenList(tokenEntries, /(^size\.icons\.|^size\.image\.|^image\.|\.image\.)/i), [tokenEntries]);
  const cards = useMemo(() => tokenList(tokenEntries, /(^card\.|\.card\.|^radius\.card|^shadow\.card)/i), [tokenEntries]);
  const buttons = useMemo(() => tokenList(tokenEntries, /^typography\.button\./i), [tokenEntries]);

  function handleThemeChange(theme) {
    setBrandSwitching(true);
    setActiveTheme(theme);
  }

  const showLoader = loading || brandSwitching;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Token Entries Variables Catalog</h2>
              <p className="text-sm text-slate-600">Grid, textbox, labels, images, cards, columns, and all available breakpoints from current brand tokens.</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={activeTheme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="rounded border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {themes.map((theme) => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => syncTokens(true)}
                className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                {loading ? "Syncing..." : "Refresh"}
              </button>
            </div>
          </div>
        </header>

        {showLoader ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
            <p className="mt-4 text-sm font-semibold text-slate-700">Loading brand tokens...</p>
            <p className="mt-1 text-xs text-slate-500">Switching brand and refreshing token entries.</p>
          </div>
        ) : null}

        {!showLoader ? (
          <>
            <SectionCard
              title="Grid and Columns"
              subtitle="layout.breakpoint.*, layout.grid.columns.*, and layout.grid.gutter.*"
              entries={[...breakpoints, ...columns, ...gutters]}
            >
              <GridPreview breakpoints={breakpoints} columns={columns} gutters={gutters} />
            </SectionCard>

            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="Brand Colors" subtitle="Color tokens for the selected brand" entries={colors}>
                <ColorPreview entries={colors} />
              </SectionCard>

              <SectionCard title="Brand Fonts" subtitle="Font family and weight tokens for the selected brand" entries={fonts}>
                <FontPreview entries={fonts} />
              </SectionCard>
            </div>

            <SectionCard title="Brand Buttons" subtitle="Button typography tokens for the selected brand" entries={buttons}>
              <ButtonPreview entries={buttons} />
            </SectionCard>

            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="Textbox Tokens" subtitle="typography.input.*" entries={textbox}>
                <TypographyPreview entries={textbox} label="Textbox sample" />
              </SectionCard>

              <SectionCard title="Label Tokens" subtitle="typography.label.*" entries={labels}>
                <TypographyPreview entries={labels} label="Label sample" />
              </SectionCard>

              <SectionCard title="Subtitle Tokens" subtitle="typography.subtitle.*" entries={subtitles}>
                <TypographyPreview entries={subtitles} label="Subtitle sample" />
              </SectionCard>

              <SectionCard title="Image Tokens" subtitle="size.image.*, image.*, size.icons.*" entries={images}>
                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.slice(0, 9).map((entry) => {
                    const size = Number.parseInt(String(entry.value), 10) || 48;
                    return (
                      <div key={entry.name} className="rounded border border-slate-200 bg-slate-50 p-3 text-center">
                        <div
                          className="mx-auto rounded border border-slate-300 bg-white"
                          style={{ width: `${Math.min(size, 80)}px`, height: `${Math.min(size, 80)}px` }}
                        />
                        <p className="mt-2 text-[11px] text-slate-600">{entry.name.split(".").pop()}</p>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>

              <SectionCard title="Card Tokens" subtitle="card.*, radius.card*, shadow.card*" entries={cards}>
                <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[0, 1].map((idx) => (
                    <article key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <h4 className="text-sm font-semibold text-slate-900">Card Example</h4>
                      <p className="mt-2 text-xs text-slate-600">Card visuals are driven by available card/radius/shadow tokens listed below.</p>
                    </article>
                  ))}
                </div>
              </SectionCard>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default {
  title: "Design System/Token Entries Variables",
  component: TokenEntriesCatalog
};

export const AllVariablesFromTokenEntries = {};
