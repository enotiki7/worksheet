import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Prototype } from "../prototypes/worksheet/Prototype";
import "./ui/tokens.css";
import "../prototypes/worksheet/worksheet.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Prototype />
    </BrowserRouter>
  </StrictMode>,
);
