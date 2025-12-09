import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import {
	Button,
	FieldError,
	Form,
	Input,
	Radio,
	RadioGroup,
	TextField,
} from "react-aria-components";
import { addTransactionMutation } from "../db/mutation";
import { parseAmountToNumber, type TransactionType } from "../db/tx-repo";
import { useStore } from "../hooks/useStore";
import { cn } from "../utils/cn";
import { TypeSwitcher } from "./type-switcher";

export function TransactionForm() {
	const { setTransactions, setSummary, categories } = useStore();
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
			category: selectedCategory ?? "",
		});

		setTransactions((prev) => [tx, ...prev]);
		setSummary(summary);
	}

	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	function handleChangeType(next: TransactionType) {
		setSelectedTransactionType(next);
		setSelectedCategory(null);
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
				<div className="flex gap-2 overflow-x-scroll">
					<RadioGroup
						value={selectedCategory ?? undefined}
						onChange={(v) => setSelectedCategory(String(v))}
						className="flex shrink-0 gap-2"
						aria-label="カテゴリ"
					>
						{filteredCategories.map((category) => (
							<Radio
								aria-label={category.name}
								key={category.id}
								value={category.name}
								className={cn(
									"shrink-0 rounded-lg border border-slate-300 p-2 p-3 text-sm transition-colors",
									selectedCategory === category.name &&
										"border-slate-500 bg-slate-500 font-semibold text-white",
								)}
							>
								{category.name}
							</Radio>
						))}
					</RadioGroup>
					<Button className="flex shrink-0 rounded-lg border border-slate-300 p-3 text-sm">
						＋新規カテゴリを追加
					</Button>
				</div>
			)}

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
