import { useState } from "react";
import { Form } from "react-aria-components";
import { addTransactionMutation } from "../db/mutation";
import { parseAmountToNumber, type TransactionType } from "../db/tx-repo";
import { useStore } from "../hooks/useStore";
import { CategoryPicker } from "./category-picker";
import { TypeSwitcher } from "./type-switcher";
import { CustomInput } from "./ui/custom-input";
import { SubmitButton } from "./ui/submit-button";

type Props = {
	scrollToBottom: () => void;
};

export function TransactionForm({ scrollToBottom }: Props) {
	const { setTransactions, setSummary, categories } = useStore();
	const [selectedTransactionType, setSelectedTransactionType] =
		useState<TransactionType>("income");

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		event.stopPropagation();

		const form = event.currentTarget;

		const formData = new FormData(event.currentTarget);
		const amountInputValue = String(formData.get("amount") ?? "");
		const amount = parseAmountToNumber(amountInputValue);
		if (!amount) return;

		const { tx, summary } = await addTransactionMutation({
			type: selectedTransactionType,
			amount,
			createdAt: Date.now(),
			category: selectedCategory ?? "",
		});

		setTransactions((prev) => [tx, ...prev]);
		setSummary(summary);
		scrollToBottom();
		form.reset();
	}

	const [selectedCategory, setSelectedCategory] = useState<string>("");
	function handleChangeType(next: TransactionType) {
		setSelectedTransactionType(next);
		setSelectedCategory("");
	}

	const filteredCategories = categories.filter(
		(category) => category.type === selectedTransactionType,
	);

	return (
		<Form
			onSubmit={handleSubmit}
			className="space-y-2 overflow-hidden rounded-lg bg-white p-4 shadow-xs"
		>
			<TypeSwitcher
				value={selectedTransactionType}
				onChange={handleChangeType}
			/>

			{selectedTransactionType !== "saving" && (
				<CategoryPicker
					value={selectedCategory}
					onChange={(v) => setSelectedCategory(v ?? "")}
					categories={filteredCategories}
					type={selectedTransactionType}
				/>
			)}

			<div className="grid grid-cols-[1fr_auto] gap-2">
				<CustomInput
					aria-label="金額"
					name="amount"
					type="decimal"
					placeholder="1,000"
				/>
				<SubmitButton />
			</div>
		</Form>
	);
}
