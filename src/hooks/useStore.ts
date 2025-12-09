import { useAtom } from "jotai";
import { categoriesAtom, summaryAtom, transactionsAtom } from "../store/store";

export function useStore() {
	const [transactions, setTransactions] = useAtom(transactionsAtom);
	const [summary, setSummary] = useAtom(summaryAtom);
	const [categories, setCategories] = useAtom(categoriesAtom);

	return {
		transactions,
		setTransactions,
		summary,
		setSummary,
		categories,
		setCategories,
	};
}
