const FIGMA_API_BASE_URL = "https://api.figma.com/v1";

function getHeaders() {
  if (!process.env.FIGMA_TOKEN) {
    throw new Error("Missing FIGMA_TOKEN in server/.env");
  }

  return {
    "X-Figma-Token": process.env.FIGMA_TOKEN
  };
}

async function figmaGet(path) {
  const response = await fetch(`${FIGMA_API_BASE_URL}${path}`, {
    headers: getHeaders()
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Figma API error ${response.status}: ${text}`);
  }

  return response.json();
}

export function getFigmaVariables(fileKey) {
  return figmaGet(`/files/${fileKey}/variables/local`);
}

export function getFigmaFile(fileKey) {
  return figmaGet(`/files/${fileKey}`);
}