import React from "react";
import { TokenProvider } from "./theme/TokenProvider";
import { BrandPreview } from "./components/BrandPreview";
import "./style.css";

export default function App() {
  return (
    <TokenProvider>
      <BrandPreview />
    </TokenProvider>
  );
}