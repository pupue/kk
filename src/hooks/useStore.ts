import { useAtom } from "jotai";
import { summaryAtom, transactionsAtom } from "../store/store";

export function useStore() {
	const [transactions, setTransactions] = useAtom(transactionsAtom);
	const [summary, setSummary] = useAtom(summaryAtom);

	return { transactions, setTransactions, summary, setSummary };
}
