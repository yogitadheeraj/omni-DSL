import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { applyTokensToRoot } from "./tokenUtils";

const TokenContext = createContext(null);

export function TokenProvider({ children }) {
  const [fileKey, setFileKey] = useState("YMHme3s5OVuqqrgT6qJxii");
  const [data, setData] = useState(null);
  const [activeTheme, setActiveTheme] = useState("");
  const [loading, setLoading] = useState(false);

  async function syncTokens() {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/figma/${fileKey}/variables`);
      const json = await response.json();
      setData(json);

      const firstTheme = Object.keys(json.brands ?? {})[0];
      setActiveTheme(firstTheme);
      applyTokensToRoot(json.brands[firstTheme].tokens);
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