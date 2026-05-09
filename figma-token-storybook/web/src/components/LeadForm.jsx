import React from "react";
import { Input } from "./Input";
import { Select } from "./Select";
import { Checkbox } from "./Checkbox";
import { Button } from "./Button";

export function LeadForm() {
  return (
    <div
      className="space-y-4"
      style={{
        background: "var(--color-surface-default, #ffffff)",
        border: "1px solid var(--color-border-default, #e5e7eb)",
        borderRadius: "var(--radius-xl, 24px)",
        padding: "var(--spacing-lg, 24px)",
        fontFamily: "var(--font-family-base, Inter)",
      }}
    >
      <h3 className="text-xl font-bold">Book a Test Drive</h3>
      <Input label="Full Name" placeholder="Enter full name" />
      <Input label="Mobile Number" placeholder="Enter mobile number" />
      <Input label="Email" placeholder="Enter email address" />
      <Select label="Preferred Location" options={["Dubai", "Abu Dhabi", "Sharjah"]} />
      <Checkbox label="I agree to receive updates and offers" />
      <Button fullWidth>Submit Lead</Button>
    </div>
  );
}