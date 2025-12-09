import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { getSummary } from "./db/summary-repo";
import { getTransactions } from "./db/tx-repo";

const [summary, transactions] = await Promise.all([
	getSummary(),
	getTransactions(50),
]);

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<App data={{ summary, transactions }} />
	</StrictMode>,
);
