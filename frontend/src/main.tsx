import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

/** Mounts the application in the page root using React strict mode. */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
