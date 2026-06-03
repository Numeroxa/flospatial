import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import FloSpatialPrototype from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FloSpatialPrototype />
  </StrictMode>
);
