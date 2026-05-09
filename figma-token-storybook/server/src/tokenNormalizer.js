function rgbToHex(color) {
  const r = Math.round((color.r ?? 0) * 255);
  const g = Math.round((color.g ?? 0) * 255);
  const b = Math.round((color.b ?? 0) * 255);
  const a = color.a ?? 1;

  const hex = `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;

  if (a < 1) {
    const alpha = Math.round(a * 255).toString(16).padStart(2, "0");
    return `${hex}${alpha}`;
  }

  return hex;
}

function toCssValue(value) {
  if (value == null) return "";

  if (typeof value === "string") return value;
  if (typeof value === "number") return `${value}px`;
  if (typeof value === "boolean") return String(value);

  if (typeof value === "object") {
    if (value.type === "VARIABLE_ALIAS") {
      return `alias:${value.id}`;
    }

    if ("r" in value && "g" in value && "b" in value) {
      return rgbToHex(value);
    }
  }

  return String(value);
}

function getModeIdForVariable(variable, preferredModeId) {
  if (variable?.valuesByMode?.[preferredModeId] !== undefined) {
    return preferredModeId;
  }

  return Object.keys(variable?.valuesByMode ?? {})[0];
}

function resolveVariableValue(variables, variableId, modeId, cache = new Map(), stack = new Set()) {
  const cacheKey = `${variableId}::${modeId}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (stack.has(cacheKey)) {
    return "";
  }

  const variable = variables?.[variableId];
  if (!variable) {
    return "";
  }

  const resolvedModeId = getModeIdForVariable(variable, modeId);
  if (!resolvedModeId) {
    return "";
  }

  const value = variable.valuesByMode?.[resolvedModeId];
  if (!value) {
    return "";
  }

  stack.add(cacheKey);

  let resolved = "";
  if (typeof value === "object" && value.type === "VARIABLE_ALIAS" && value.id) {
    resolved = resolveVariableValue(variables, value.id, resolvedModeId, cache, stack);
  } else {
    resolved = toCssValue(value);
  }

  stack.delete(cacheKey);
  cache.set(cacheKey, resolved);
  return resolved;
}

function safeTokenName(name) {
  return name
    .replaceAll("/", ".")
    .replaceAll(" ", "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .toLowerCase();
}

export function normalizeFigmaVariables(figmaResponse) {
  const collections = figmaResponse.meta.variableCollections ?? {};
  const variables = figmaResponse.meta.variables ?? {};
  const resolveCache = new Map();

  const result = {
    collections: [],
    brands: {},
    rawVariableCount: Object.keys(variables).length
  };

  Object.values(collections).forEach((collection) => {
    const collectionInfo = {
      id: collection.id,
      name: collection.name,
      modes: collection.modes.map((mode) => ({
        modeId: mode.modeId,
        name: mode.name
      }))
    };

    result.collections.push(collectionInfo);

    collection.modes.forEach((mode) => {
      const modeKey = safeTokenName(mode.name);

      if (!result.brands[modeKey]) {
        result.brands[modeKey] = {
          name: mode.name,
          collection: collection.name,
          tokens: {}
        };
      }
    });
  });

  Object.values(variables).forEach((variable) => {
    const collection = collections[variable.variableCollectionId];
    if (!collection) return;

    const tokenName = safeTokenName(variable.name);

    collection.modes.forEach((mode) => {
      const modeKey = safeTokenName(mode.name);
      const value = variable.valuesByMode?.[mode.modeId];
      const rawCssValue = toCssValue(value);
      const resolvedValue = resolveVariableValue(variables, variable.id, mode.modeId, resolveCache);

      if (!result.brands[modeKey]) {
        result.brands[modeKey] = {
          name: mode.name,
          collection: collection.name,
          tokens: {}
        };
      }

      result.brands[modeKey].tokens[tokenName] = {
        value: rawCssValue,
        resolvedValue,
        aliasTargetId: value?.type === "VARIABLE_ALIAS" ? value.id : null,
        type: variable.resolvedType,
        variableId: variable.id,
        collection: collection.name
      };
    });
  });

  return result;
}