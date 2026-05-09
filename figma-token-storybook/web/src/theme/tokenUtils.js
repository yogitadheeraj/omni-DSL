export function tokenNameToCssVar(tokenName) {
  return `--${tokenName.replaceAll(".", "-")}`;
}

export function tokenNameToVar(tokenName) {
  return `var(${tokenNameToCssVar(tokenName)})`;
}

export function applyTokensToRoot(tokens) {
  const root = document.documentElement;

  Object.entries(tokens).forEach(([name, token]) => {
    const cssValue = String(token?.resolvedValue ?? token?.value ?? "");
    if (!cssValue || cssValue.startsWith("alias:")) return;

    root.style.setProperty(tokenNameToCssVar(name), cssValue);
  });
}