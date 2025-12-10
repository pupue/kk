import { Radio, RadioGroup } from "react-aria-components";
import type { TransactionType } from "../db/tx-repo";
import { cn } from "../utils/cn";

const items = [
	{ value: "income", label: "収入" },
	{ value: "expense", label: "支出" },
	{ value: "saving", label: "貯金" },
] as const satisfies ReadonlyArray<{ value: TransactionType; label: string }>;

const pillBgStyle: Record<TransactionType, string> = {
	income: "bg-green-light",
	expense: "bg-red-light",
	saving: "bg-orange-light",
};
const selectedTextStyle: Record<TransactionType, string> = {
	income: "data-selected:text-green-dark",
	expense: "data-selected:text-red-dark",
	saving: "data-selected:text-orange-dark",
};

type Props = {
	value: TransactionType;
	onChange: (v: TransactionType) => void;
};

export function TypeSwitcher({ value, onChange }: Props) {
	const idx = items.findIndex((x) => x.value === value);

	return (
		<div className="inline-block rounded-lg bg-slate-100 p-1">
			<RadioGroup
				aria-label="種類"
				value={value}
				onChange={(v) => onChange(v as TransactionType)}
				className="relative inline-grid grid-cols-3 rounded-lg"
			>
				{/* moving pill */}
				<div
					aria-hidden
					className={cn(
						"absolute top-0 left-0 h-full w-[calc(100%/3)] rounded-lg bg-white shadow transition-transform duration-500 ease-[cubic-bezier(.2,1,.2,1)]",
						pillBgStyle[value],
					)}
					style={{
						transform: `translateX(calc(${idx} * 100%))`,
					}}
				/>

				{items.map((it) => (
					<Radio
						key={it.value}
						value={it.value}
						className={cn(
							"relative z-10 cursor-pointer select-none rounded-full px-4 py-2 text-center font-semibold text-slate-500 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 data-selected:text-slate-900",
							selectedTextStyle[it.value],
						)}
						aria-label={it.label}
					>
						{it.label}
					</Radio>
				))}
			</RadioGroup>
		</div>
	);
}
