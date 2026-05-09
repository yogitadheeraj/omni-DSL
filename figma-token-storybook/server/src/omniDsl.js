function pickToken(tokens, names, fallback = "") {
  for (const name of names) {
    const token = tokens?.[name];
    const value = token?.resolvedValue ?? token?.value;
    if (value && !String(value).startsWith("alias:")) {
      return value;
    }
  }
  return fallback;
}

function toThemeDsl(themeKey, theme) {
  const tokens = theme?.tokens ?? {};

  const colorPrimary = pickToken(tokens, ["color.brand.primary.base", "color.primary", "brand.primary"], "#111827");
  const colorOnPrimary = pickToken(tokens, ["color.text.inverse", "text.inverse"], "#ffffff");
  const colorSurface = pickToken(tokens, ["color.surface.default", "surface.default"], "#ffffff");
  const colorText = pickToken(tokens, ["color.text.default", "text.default"], "#111827");

  const buttonRadius = pickToken(tokens, ["button.primary.radius", "button.radius", "radius.button", "radius.md"], "12px");
  const buttonPaddingY = pickToken(tokens, ["button.md.padding-y", "button.padding-y", "spacing.sm"], "8px");
  const buttonPaddingX = pickToken(tokens, ["button.md.padding-x", "button.padding-x", "spacing.md"], "16px");

  const buttonHoverBg = pickToken(
    tokens,
    ["button.primary.hover.background", "button.primary.hover.bg", "button.primary.background.hover", "color.button.primary.hover"],
    colorPrimary
  );
  const buttonHoverText = pickToken(tokens, ["button.primary.hover.text", "button.primary.text.hover"], colorOnPrimary);
  const buttonHoverRadius = pickToken(tokens, ["button.primary.hover.radius", "button.primary.radius.hover"], buttonRadius);

  return {
    id: themeKey,
    name: theme?.name ?? themeKey,
    collection: theme?.collection ?? "default",
    primitives: {
      color: {
        primary: colorPrimary,
        onPrimary: colorOnPrimary,
        surface: colorSurface,
        text: colorText
      },
      radius: {
        md: buttonRadius
      },
      spacing: {
        buttonPaddingY,
        buttonPaddingX
      }
    },
    components: {
      button: {
        base: {
          background: colorPrimary,
          text: colorOnPrimary,
          radius: buttonRadius,
          padding: `${buttonPaddingY} ${buttonPaddingX}`
        },
        hover: {
          background: buttonHoverBg,
          text: buttonHoverText,
          radius: buttonHoverRadius
        }
      },
      input: {
        base: {
          background: colorSurface,
          text: colorText,
          radius: pickToken(tokens, ["input.radius", "radius.sm", "radius.md"], "8px")
        },
        focus: {
          border: pickToken(tokens, ["input.focus.border", "color.border.focus", "color.primary"], colorPrimary)
        }
      }
    }
  };
}

export function createOmniDsl(normalized, fileKey) {
  const themes = normalized?.brands ?? {};

  return {
    schema: "omni-dsl.v1",
    generatedAt: new Date().toISOString(),
    source: {
      provider: "figma",
      fileKey
    },
    themeCount: Object.keys(themes).length,
    themes: Object.entries(themes).map(([themeKey, theme]) => toThemeDsl(themeKey, theme))
  };
}
