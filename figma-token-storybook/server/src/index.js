
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getFigmaVariablesCached, getFigmaFileCached } from "./figmaClient.js";
import { normalizeFigmaVariables } from "./tokenNormalizer.js";
import { generateCssVariables } from "./cssGenerator.js";
import { createOmniDsl } from "./omniDsl.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

function isForceRefresh(req) {
  const value = String(req.query.forceRefresh ?? "").toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

app.get("/api/figma/:fileKey/variables", async (req, res) => {
  try {
    const { fileKey } = req.params;
    const forceRefresh = isForceRefresh(req);
    const { data: rawVariables, cache } = await getFigmaVariablesCached(fileKey, { forceRefresh });
    const normalized = normalizeFigmaVariables(rawVariables);
    const omniDsl = createOmniDsl(normalized, fileKey);

    res.json({
      fileKey,
      source: cache.hit ? "figma-cache" : "figma-live",
      generatedAt: new Date().toISOString(),
      cache,
      omniDsl,
      ...normalized
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch Figma variables",
      error: error.message
    });
  }
});

app.get("/api/figma/:fileKey/tokens.css", async (req, res) => {
  try {
    const { fileKey } = req.params;
    const forceRefresh = isForceRefresh(req);
    const { data: rawVariables } = await getFigmaVariablesCached(fileKey, { forceRefresh });
    const normalized = normalizeFigmaVariables(rawVariables);
    const css = generateCssVariables(normalized);

    res.setHeader("Content-Type", "text/css");
    res.send(css);
  } catch (error) {
    res.status(500).send(`/* ${error.message} */`);
  }
});

app.get("/api/figma/:fileKey/pages", async (req, res) => {
  try {
    const { fileKey } = req.params;
    const forceRefresh = isForceRefresh(req);
    const { data: figmaFile, cache } = await getFigmaFileCached(fileKey, { forceRefresh });

    const pages = figmaFile.document.children.map((page) => ({
      id: page.id,
      name: page.name,
      type: page.type,
      childrenCount: page.children?.length ?? 0
    }));

    res.json({
      fileKey,
      source: cache.hit ? "figma-cache" : "figma-live",
      cache,
      pages
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch Figma pages",
      error: error.message
    });
  }
});

app.get("/api/figma/:fileKey/omni-dsl", async (req, res) => {
  try {
    const { fileKey } = req.params;
    const forceRefresh = isForceRefresh(req);
    const { data: rawVariables, cache } = await getFigmaVariablesCached(fileKey, { forceRefresh });
    const normalized = normalizeFigmaVariables(rawVariables);
    const omniDsl = createOmniDsl(normalized, fileKey);

    res.json({
      fileKey,
      source: cache.hit ? "figma-cache" : "figma-live",
      cache,
      omniDsl
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate Omni DSL",
      error: error.message
    });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Figma token server running on http://localhost:${port}`);
});