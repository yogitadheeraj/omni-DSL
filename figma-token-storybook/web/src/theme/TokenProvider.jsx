import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { applyTokensToRoot } from "./tokenUtils";

const TokenContext = createContext(null);

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
  const [fileKey, setFileKey] = useState("YMHme3s5OVuqqrgT6qJxii");
  const [data, setData] = useState(null);
  const [activeTheme, setActiveTheme] = useState("");
  const [loading, setLoading] = useState(false);

  async function syncTokens(forceRefresh = false) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (forceRefresh) {
        params.set("forceRefresh", "true");
      }
      const queryString = params.toString();
      const response = await fetch(`http://localhost:4000/api/figma/${fileKey}/variables${queryString ? `?${queryString}` : ""}`);
      const json = await response.json();
      setData(json);

      const defaultTheme = resolveDefaultThemeKey(json.brands ?? {});
      setActiveTheme(defaultTheme);

      if (defaultTheme && json.brands?.[defaultTheme]?.tokens) {
        applyTokensToRoot(json.brands[defaultTheme].tokens);
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
    syncTokens
  }), [fileKey, data, activeTheme, loading]);

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
}

export function useTokens() {
  const context = useContext(TokenContext);
  if (!context) throw new Error("useTokens must be used inside TokenProvider");
  return context;
}