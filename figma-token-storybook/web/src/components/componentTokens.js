export const sizes = {
  sm: {
    height: "var(--size-sm-height, 32px)",
    paddingX: "var(--spacing-sm, 8px)",
    paddingY: "var(--spacing-xs, 4px)",
    fontSize: "var(--font-size-sm, 12px)",
  },
  md: {
    height: "var(--size-md-height, 40px)",
    paddingX: "var(--spacing-md, 16px)",
    paddingY: "var(--spacing-sm, 8px)",
    fontSize: "var(--font-size-md, 14px)",
  },
  lg: {
    height: "var(--size-lg-height, 48px)",
    paddingX: "var(--spacing-lg, 24px)",
    paddingY: "var(--spacing-md, 16px)",
    fontSize: "var(--font-size-lg, 16px)",
  },
  xl: {
    height: "var(--size-xl-height, 56px)",
    paddingX: "var(--spacing-xl, 32px)",
    paddingY: "var(--spacing-lg, 24px)",
    fontSize: "var(--font-size-xl, 18px)",
  },
};

export const buttonSizes = {
  sm: {
    height: "var(--button-sm-height, 32px)",
    paddingX: "var(--button-sm-padding-x, 12px)",
    paddingY: "var(--button-sm-padding-y, 6px)",
    fontSize: "var(--button-sm-font-size, 12px)",
  },
  md: {
    height: "var(--button-md-height, 40px)",
    paddingX: "var(--button-md-padding-x, 16px)",
    paddingY: "var(--button-md-padding-y, 10px)",
    fontSize: "var(--button-md-font-size, 14px)",
  },
  lg: {
    height: "var(--button-lg-height, 48px)",
    paddingX: "var(--button-lg-padding-x, 20px)",
    paddingY: "var(--button-lg-padding-y, 12px)",
    fontSize: "var(--button-lg-font-size, 16px)",
  },
  xl: {
    height: "var(--button-xl-height, 56px)",
    paddingX: "var(--button-xl-padding-x, 24px)",
    paddingY: "var(--button-xl-padding-y, 14px)",
    fontSize: "var(--button-xl-font-size, 18px)",
  },
};

export const buttonVariants = {
  primary: {
    background: "var(--color-brand-primary, #111827)",
    color: "var(--color-text-inverse, #ffffff)",
    border: "1px solid var(--color-brand-primary, #111827)",
  },
  secondary: {
    background: "var(--color-brand-secondary, #e5e7eb)",
    color: "var(--color-text-default, #111827)",
    border: "1px solid var(--color-brand-secondary, #e5e7eb)",
  },
  outline: {
    background: "transparent",
    color: "var(--color-brand-primary, #111827)",
    border: "1px solid var(--color-brand-primary, #111827)",
  },
  ghost: {
    background: "transparent",
    color: "var(--color-brand-primary, #111827)",
    border: "1px solid transparent",
  },
  danger: {
    background: "var(--color-brand-danger, #dc2626)",
    color: "var(--color-text-inverse, #ffffff)",
    border: "1px solid var(--color-brand-danger, #dc2626)",
  },
};

export const statusVariants = {
  success: {
    background: "var(--color-success-surface, #dcfce7)",
    color: "var(--color-success-text, #166534)",
    border: "1px solid var(--color-success-border, #86efac)",
  },
  warning: {
    background: "var(--color-warning-surface, #fef3c7)",
    color: "var(--color-warning-text, #92400e)",
    border: "1px solid var(--color-warning-border, #fcd34d)",
  },
  danger: {
    background: "var(--color-danger-surface, #fee2e2)",
    color: "var(--color-danger-text, #991b1b)",
    border: "1px solid var(--color-danger-border, #fca5a5)",
  },
  info: {
    background: "var(--color-info-surface, #dbeafe)",
    color: "var(--color-info-text, #1e40af)",
    border: "1px solid var(--color-info-border, #93c5fd)",
  },
};