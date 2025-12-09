import { SendHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import {
	Button,
	FieldError,
	Form,
	Input,
	TextField,
} from "react-aria-components";
import { RandomEllipses } from "./components/random-ellipses";
import { TransactionListItem } from "./components/transaction-list-item";
import { TypeSwitcher } from "./components/type-switcher";
import {
	addTransactionToIndexedDB,
	deleteTransaction,
	fetchLatestTransactionsFromIndexedDB,
	parseAmountToNumber,
	type TransactionRecord,
	type TransactionType,
} from "./functions";
import { cn } from "./utils/cn";

type Props = {
	data: TransactionRecord[];
};

export default function App({ data }: Props) {
	const [transactions, setTransactions] = useState<TransactionRecord[]>(data);
	const [selectedTransactionType, setSelectedTransactionType] =
		useState<TransactionType>("income");

	const balanceAmount = useMemo(() => {
		return transactions.reduce((total, record) => {
			if (record.type === "income") return total + record.amount;
			if (record.type === "expense") return total - record.amount;
			if (record.type === "saving") return total - record.amount;

			return total;
		}, 0);
	}, [transactions]);

	const savingTotalAmount = useMemo(() => {
		return transactions.reduce(
			(total, record) => total + (record.type === "saving" ? record.amount : 0),
			0,
		);
	}, [transactions]);

	async function reloadTransactions() {
		setTransactions(await fetchLatestTransactionsFromIndexedDB());
	}

	async function handleDelete(id: number) {
		await deleteTransaction(id);
		await reloadTransactions();
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const amountInputValue = String(formData.get("amount") ?? "");
		const amount = parseAmountToNumber(amountInputValue);
		if (amount === null) return;

		await addTransactionToIndexedDB({
			type: selectedTransactionType,
			amount,
			createdAt: Date.now(),
		});

		// event.currentTarget.reset();
		await reloadTransactions();
	}

	return (
		<div className="relative h-svh overflow-hidden">
			<div className="mx-auto h-full max-w-md bg-slate-100 p-5">
				<div className="relative z-10 grid h-full grid-rows-[auto_1fr_auto] gap-4">
					<div className="">
						<div className="text-center font-bold text-2xl">
							¥{balanceAmount.toLocaleString()}
						</div>
						<div className="text-center text-gray-500 text-sm">
							¥{savingTotalAmount.toLocaleString()}
						</div>
					</div>

					<div className="overflow-y-scroll rounded-lg bg-white p-4">
						{transactions.length === 0 ? (
							<p className="p-4 text-center text-sm">まだ何もありません</p>
						) : (
							transactions.map((record, i) => (
								<TransactionListItem
									key={record.id}
									data={record}
									className={cn(i % 2 === 0 ? "bg-slate-50" : "bg-white")}
									onDelete={() => handleDelete(record.id)}
								/>
							))
						)}
					</div>

					<Form
						onSubmit={handleSubmit}
						className="space-y-2 rounded-lg bg-white p-4 shadow-xs"
					>
						<TypeSwitcher
							value={selectedTransactionType}
							onChange={setSelectedTransactionType}
						/>

						<div className="grid grid-cols-[1fr_auto] gap-2">
							<TextField
								aria-label="金額"
								name="amount"
								type="decimal"
								isRequired
							>
								<Input
									className="h-full w-full rounded-lg bg-slate-50 p-3"
									placeholder="1,000"
								/>
								<FieldError />
							</TextField>
							<Button
								type="submit"
								className="flex aspect-square items-center justify-center rounded-lg bg-blue-light p-2"
							>
								<SendHorizontal color="#66B6FF" />
							</Button>
						</div>
					</Form>
				</div>
			</div>
			<RandomEllipses />
		</div>
	);
}
