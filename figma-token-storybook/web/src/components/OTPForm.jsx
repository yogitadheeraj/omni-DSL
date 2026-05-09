import React from "react";
import { Button } from "./Button";

export function OTPForm() {
  return (
    <div
      style={{
        background: "var(--color-surface-default, #ffffff)",
        border: "1px solid var(--color-border-default, #e5e7eb)",
        borderRadius: "var(--radius-xl, 24px)",
        padding: "var(--spacing-lg, 24px)",
        fontFamily: "var(--font-family-base, Inter)",
      }}
      className="max-w-md space-y-5"
    >
      <div>
        <h3 className="text-xl font-bold">Verify OTP</h3>
        <p className="mt-1 text-sm opacity-70">Enter the 4-digit code sent to your mobile.</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((item) => (
          <input
            key={item}
            maxLength={1}
            style={{
              height: "var(--size-xl-height, 56px)",
              borderRadius: "var(--radius-md, 12px)",
              border: "1px solid var(--color-border-default, #d1d5db)",
              fontSize: "var(--font-size-xl, 18px)",
              color: "var(--color-text-default, #111827)",
              background: "var(--color-surface-default, #ffffff)",
            }}
            className="text-center font-bold outline-none"
          />
        ))}
      </div>

      <Button fullWidth>Verify OTP</Button>
      <Button fullWidth variant="ghost">Resend OTP</Button>
    </div>
  );
}