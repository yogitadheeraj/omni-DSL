
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getFigmaVariables, getFigmaFile } from "./figmaClient.js";
import { normalizeFigmaVariables } from "./tokenNormalizer.js";
import { generateCssVariables } from "./cssGenerator.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/figma/:fileKey/variables", async (req, res) => {
  try {
    const { fileKey } = req.params;
    const rawVariables = await getFigmaVariables(fileKey);
    const normalized = normalizeFigmaVariables(rawVariables);

    res.json({
      fileKey,
      source: "figma",
      generatedAt: new Date().toISOString(),
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
    const rawVariables = await getFigmaVariables(fileKey);
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
    const figmaFile = await getFigmaFile(fileKey);

    const pages = figmaFile.document.children.map((page) => ({
      id: page.id,
      name: page.name,
      type: page.type,
      childrenCount: page.children?.length ?? 0
    }));

    res.json({ fileKey, pages });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch Figma pages",
      error: error.message
    });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Figma token server running on http://localhost:${port}`);
});