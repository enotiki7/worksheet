import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Prototype } from "../prototypes/teacher-assistant/Prototype";
import "../prototypes/teacher-assistant/teacher-assistant.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Prototype />
    </BrowserRouter>
  </StrictMode>,
);
