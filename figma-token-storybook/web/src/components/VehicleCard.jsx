import React from "react";
import { Button } from "./Button";
import { Badge } from "./Badge";

export function VehicleCard({
  name = "Polestar 2",
  price = "AED 189,000",
  tag = "Available",
  image = "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=900&auto=format&fit=crop",
}) {
  return (
    <div
      style={{
        background: "var(--color-surface-default, #ffffff)",
        color: "var(--color-text-default, #111827)",
        border: "1px solid var(--color-border-default, #e5e7eb)",
        borderRadius: "var(--radius-xl, 24px)",
        overflow: "hidden",
        fontFamily: "var(--font-family-base, Inter)",
        boxShadow: "var(--shadow-card, 0 10px 30px rgba(15,23,42,0.08))",
      }}
    >
      <img src={image} alt={name} className="h-48 w-full object-cover" />
      <div style={{ padding: "var(--spacing-lg, 24px)" }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="mt-1 opacity-70">Starting from {price}</p>
          </div>
          <Badge variant="success">{tag}</Badge>
        </div>
        <div className="mt-5 flex gap-3">
          <Button size="sm">Book Test Drive</Button>
          <Button size="sm" variant="outline">View Details</Button>
        </div>
      </div>
    </div>
  );
}