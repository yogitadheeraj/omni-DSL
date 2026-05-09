import React from "react";
import { statusVariants } from "./componentTokens";

export function Alert({ title = "Alert title", description = "Alert description", variant = "info" }) {
  const style = statusVariants[variant] ?? statusVariants.info;

  return (
    <div
      style={{
        ...style,
        borderRadius: "var(--radius-lg, 16px)",
        padding: "var(--spacing-md, 16px)",
        fontFamily: "var(--font-family-base, Inter)",
      }}
    >
      <h4 className="font-bold">{title}</h4>
      <p className="mt-1 text-sm opacity-80">{description}</p>
    </div>
  );
}