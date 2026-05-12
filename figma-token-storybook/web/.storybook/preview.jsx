import React, { useEffect, useMemo, useRef, useState } from "react";
import { TokenProvider } from "../src/theme/TokenProvider";
import { useTokens } from "../src/theme/TokenProvider";
import "../src/style.css";

function normalizeThemeName(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolveDefaultTheme(themes = []) {
  const preferred = new Set(["whitelabel", "whitelable"]);
  const match = themes.find((theme) => preferred.has(normalizeThemeName(theme)));
  return match || themes[0] || "";
}

function StorybookBrandShell({ Story }) {
  const { data, activeTheme, setActiveTheme, syncTokens, loading } = useTokens();
  const hasAutoSynced = useRef(false);
  const [brandSwitching, setBrandSwitching] = useState(false);

  useEffect(() => {
    if (hasAutoSynced.current) return;
    if (!data && !loading) {
      hasAutoSynced.current = true;
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

  const brandName = data?.brands?.[activeTheme]?.name ?? activeTheme ?? "Whitelable";

  function handleThemeChange(theme) {
    setBrandSwitching(true);
    setActiveTheme(theme);
  }

  const showLoader = loading || brandSwitching;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-5 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Brand</p>
            <h1 className="text-base font-bold text-slate-900">{brandName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500" htmlFor="storybook-brand-switcher">
              Brand label
            </label>
            <select
              id="storybook-brand-switcher"
              value={activeTheme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="min-w-44 rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
              disabled={themes.length === 0}
            >
              {themes.length === 0 ? (
                <option value="">No brands loaded</option>
              ) : (
                themes.map((theme) => (
                  <option key={theme} value={theme}>
                    {data?.brands?.[theme]?.name ?? theme}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-medium text-slate-700">{showLoader ? "Loading token entries..." : "Token styling ready"}</p>
            <p>Active theme: {activeTheme || "-"}</p>
          </div>
        </div>
      </div>

      {showLoader && !data ? (
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-16">
          <div className="rounded-xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
            <p className="mt-4 text-sm font-semibold text-slate-700">Loading brand token entries...</p>
            <p className="mt-1 text-xs text-slate-500">Applying styles from the selected brand.</p>
          </div>
        </div>
      ) : (
        <>
          {showLoader ? (
            <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
                Switching brand styling...
              </div>
            </div>
          ) : null}
          <Story />
        </>
      )}
    </div>
  );
}

export const decorators = [
  (Story) => (
    <TokenProvider>
      <StorybookBrandShell Story={Story} />
    </TokenProvider>
  )
];