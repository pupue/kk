import { useHydrateAtoms } from "jotai/utils";
import { SummaryData } from "./components/summary-data";
import { TransactionForm } from "./components/transaction-form";
import { TransactionList } from "./components/transaction-list";
import { Container } from "./components/ui/container";
import type { CategoryRecord } from "./db/category-repo";
import type { SummaryRecord } from "./db/summary-repo";
import type { TransactionRecord } from "./db/tx-repo";
import { useStore } from "./hooks/useStore";
import { categoriesAtom, summaryAtom, transactionsAtom } from "./store/store";

type Props = {
	data: {
		summary: SummaryRecord;
		transactions: TransactionRecord[];
		categories: CategoryRecord[];
	};
};

export default function App({ data }: Props) {
	useHydrateAtoms([[transactionsAtom, data.transactions]]);
	useHydrateAtoms([[summaryAtom, data.summary]]);
	useHydrateAtoms([[categoriesAtom, data.categories]]);

	const { transactions, summary } = useStore();

	return (
		<Container>
			<SummaryData
				balance={summary.balance}
				savingTotal={summary.savingTotal}
			/>
			<TransactionList data={transactions} />
			<TransactionForm />
		</Container>
	);
}
