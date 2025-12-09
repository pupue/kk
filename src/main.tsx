import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
	ensureDefaultCategories,
	getAllCategories,
} from "./db/category-repo.ts";
import { getSummary } from "./db/summary-repo";
import { getTransactions } from "./db/tx-repo";

await ensureDefaultCategories();
const [summary, transactions, categories] = await Promise.all([
	getSummary(),
	getTransactions(50),
	getAllCategories(),
]);

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<App data={{ summary, transactions, categories }} />
	</StrictMode>,
);
