import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import {
	Button,
	FieldError,
	Form,
	Input,
	TextField,
} from "react-aria-components";
import { addTransactionMutation } from "../db/mutation";
import { parseAmountToNumber, type TransactionType } from "../db/tx-repo";
import { useStore } from "../hooks/useStore";
import { TypeSwitcher } from "./type-switcher";

export function TransactionForm() {
	const { setTransactions, setSummary } = useStore();
	const [selectedTransactionType, setSelectedTransactionType] =
		useState<TransactionType>("income");

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const amountInputValue = String(formData.get("amount") ?? "");
		const amount = parseAmountToNumber(amountInputValue);
		if (!amount) return;

		const { tx, summary } = await addTransactionMutation({
			type: selectedTransactionType,
			amount,
			createdAt: Date.now(),
		});

		setTransactions((prev) => [tx, ...prev]);
		setSummary(summary);
	}

	return (
		<Form
			onSubmit={handleSubmit}
			className="space-y-2 rounded-lg bg-white p-4 shadow-xs"
		>
			<TypeSwitcher
				value={selectedTransactionType}
				onChange={setSelectedTransactionType}
			/>

			<div className="grid grid-cols-[1fr_auto] gap-2">
				<TextField aria-label="金額" name="amount" type="decimal">
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
	);
}
