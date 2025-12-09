import { useHydrateAtoms } from "jotai/utils";
import { SummaryData } from "./components/summary-data";
import { TransactionForm } from "./components/transaction-form";
import { TransactionList } from "./components/transaction-list";
import { Container } from "./components/ui/container";
import type { SummaryRecord } from "./db/summary-repo";
import type { TransactionRecord } from "./db/tx-repo";
import { useStore } from "./hooks/useStore";
import { summaryAtom, transactionsAtom } from "./store/store";

type Props = {
	data: {
		summary: SummaryRecord;
		transactions: TransactionRecord[];
	};
};

export default function App({ data }: Props) {
	useHydrateAtoms([[transactionsAtom, data.transactions]]);
	useHydrateAtoms([[summaryAtom, data.summary]]);

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
