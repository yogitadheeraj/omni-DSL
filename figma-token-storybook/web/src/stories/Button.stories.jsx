import React from "react";
import { Button } from "../components/Button";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    children: { control: "text" },
    background: { control: "color" },
    color: { control: "color" },
    fontSize: { control: "text" },
    fontFamily: { control: "text" },
    borderRadius: { control: "text" },
    padding: { control: "text" },
    fontWeight: { control: { type: "radio" }, options: [400, 500, 600, 700] },
    boxShadow: { control: "text" },
    letterSpacing: { control: "text" }
  }
};

export const Primary = {
  args: {
    children: "Book Test Drive",
    background: "var(--color-brand-primary, #111827)",
    color: "var(--color-text-inverse, #ffffff)",
    fontSize: "16px",
    fontFamily: "var(--font-family-base, Inter)",
    borderRadius: "var(--radius-card, 12px)",
    padding: "var(--spacing-md, 16px)",
    fontWeight: 600,
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.15)",
    letterSpacing: "0px"
  }
};