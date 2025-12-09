import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { getTransactions } from "./functions/index.ts";

const data = await getTransactions();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App data={data} />
  </StrictMode>
);
