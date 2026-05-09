import React from "react";
import { TokenProvider } from "../src/theme/TokenProvider";
import "../src/style.css";

export const decorators = [
  (Story) => (
    <TokenProvider>
      <Story />
    </TokenProvider>
  )
];