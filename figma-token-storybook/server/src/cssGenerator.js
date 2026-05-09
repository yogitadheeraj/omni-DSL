function tokenToCssVariableName(tokenName) {
  return `--${tokenName.replaceAll(".", "-")}`;
}

export function generateCssVariables(normalizedTokens) {
  const blocks = [];

  Object.entries(normalizedTokens.brands).forEach(([brandKey, brand]) => {
    const lines = [`[data-theme="${brandKey}"] {`];

    Object.entries(brand.tokens).forEach(([tokenName, token]) => {
      if (!String(token.value).startsWith("alias:")) {
        lines.push(`  ${tokenToCssVariableName(tokenName)}: ${token.value};`);
      }
    });

    lines.push("}");
    blocks.push(lines.join("\n"));
  });

  return blocks.join("\n\n");
}