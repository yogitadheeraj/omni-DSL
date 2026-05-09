const FIGMA_API_BASE_URL = "https://api.figma.com/v1";
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;

const variablesCache = new Map();
const fileCache = new Map();

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

function getCacheTtlMs() {
  const fromEnv = Number(process.env.FIGMA_CACHE_TTL_MS);
  return Number.isFinite(fromEnv) && fromEnv >= 0 ? fromEnv : DEFAULT_CACHE_TTL_MS;
}

function getCached(map, key) {
  const entry = map.get(key);
  if (!entry) return null;

  const ageMs = Date.now() - entry.fetchedAt;
  if (ageMs > getCacheTtlMs()) {
    map.delete(key);
    return null;
  }

  return {
    data: entry.data,
    ageMs
  };
}

function setCached(map, key, data) {
  map.set(key, {
    data,
    fetchedAt: Date.now()
  });
}

async function getFigmaWithCache(map, cacheKey, path, options = {}) {
  const { forceRefresh = false } = options;

  if (!forceRefresh) {
    const cached = getCached(map, cacheKey);
    if (cached) {
      return {
        data: cached.data,
        cache: {
          hit: true,
          ageMs: cached.ageMs,
          ttlMs: getCacheTtlMs(),
          forceRefresh: false
        }
      };
    }
  }

  const data = await figmaGet(path);
  setCached(map, cacheKey, data);

  return {
    data,
    cache: {
      hit: false,
      ageMs: 0,
      ttlMs: getCacheTtlMs(),
      forceRefresh
    }
  };
}

export async function getFigmaVariablesCached(fileKey, options = {}) {
  return getFigmaWithCache(variablesCache, fileKey, `/files/${fileKey}/variables/local`, options);
}

export async function getFigmaFileCached(fileKey, options = {}) {
  return getFigmaWithCache(fileCache, fileKey, `/files/${fileKey}`, options);
}

export async function getFigmaVariables(fileKey, options = {}) {
  const { data } = await getFigmaVariablesCached(fileKey, options);
  return data;
}

export async function getFigmaFile(fileKey, options = {}) {
  const { data } = await getFigmaFileCached(fileKey, options);
  return data;
}