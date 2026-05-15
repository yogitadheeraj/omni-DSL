import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { applyTokensToRoot } from "./tokenUtils";

const TokenContext = createContext(null);
const DEFAULT_FILE_KEY = import.meta.env.VITE_FIGMA_FILE_KEY || import.meta.env.VITE_FIGMA_FILE_ID ;

function normalizeThemeName(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function resolveDefaultThemeKey(brands = {}) {
  const keys = Object.keys(brands);
  if (keys.length === 0) return "";

  const preferred = ["whitelabel"];
  const preferredSet = new Set(preferred);

  const keyMatch = keys.find((key) => preferredSet.has(normalizeThemeName(key)));
  if (keyMatch) return keyMatch;

  const nameMatch = keys.find((key) => preferredSet.has(normalizeThemeName(brands[key]?.name)));
  if (nameMatch) return nameMatch;

  return keys[0];
}

export function TokenProvider({ children }) {
  const [fileKey, setFileKey] = useState(DEFAULT_FILE_KEY);
  const [data, setData] = useState(null);
  const [activeTheme, setActiveTheme] = useState("");
  const [loading, setLoading] = useState(false);
  // brandJsonMap: { [brandKey]: { brandKey, brandName, tokens, generatedAt } }
  const [brandJsonMap, setBrandJsonMap] = useState({});

  async function syncTokens(forceRefresh = false) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (forceRefresh) params.set("forceRefresh", "true");
      const qs = params.toString();
      const response = await fetch(
        `http://localhost:4000/api/figma/${fileKey}/variables${qs ? `?${qs}` : ""}`
      );
      const json = await response.json();
      setData(json);

      const defaultTheme = resolveDefaultThemeKey(json.brands ?? {});
      setActiveTheme(defaultTheme);

      if (defaultTheme && json.brands?.[defaultTheme]?.tokens) {
        applyTokensToRoot(json.brands[defaultTheme].tokens);
      }

      // Load every brand JSON file the server just wrote
      try {
        const listRes = await fetch("http://localhost:4000/api/brand-tokens");
        const listJson = await listRes.json();
        const brandFiles = listJson.brands ?? [];

        const entries = await Promise.all(
          brandFiles.map(async ({ brandKey, path }) => {
            try {
              const r = await fetch(`http://localhost:4000${path}`);
              const bJson = await r.json();
              return [brandKey, bJson];
            } catch {
              return [brandKey, null];
            }
          })
        );

        const map = {};
        for (const [key, val] of entries) {
          if (val) map[key] = val;
        }
        setBrandJsonMap(map);
      } catch {
        // brand-tokens endpoint not yet seeded; ignore
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (data?.brands?.[activeTheme]) {
      applyTokensToRoot(data.brands[activeTheme].tokens);
    }
  }, [activeTheme, data]);

  const value = useMemo(() => ({
    fileKey,
    setFileKey,
    data,
    activeTheme,
    setActiveTheme,
    loading,
    syncTokens,
    brandJsonMap
  }), [fileKey, data, activeTheme, loading, brandJsonMap]);

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
}

export function useTokens() {
  const context = useContext(TokenContext);
  if (!context) throw new Error("useTokens must be used inside TokenProvider");
  return context;
}