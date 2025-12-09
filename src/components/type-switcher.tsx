import { Radio, RadioGroup } from "react-aria-components";
import { cn } from "../utils/cn";

const items = [
	{ value: "income", label: "収入" },
	{ value: "expense", label: "支出" },
	{ value: "saving", label: "貯金" },
] as const;

const pillBg: Record<Kind, string> = {
	income: "bg-green-light",
	expense: "bg-red-light",
	saving: "bg-orange-light",
};
const selectedText: Record<Kind, string> = {
	income: "data-selected:text-green-dark",
	expense: "data-selected:text-red-dark",
	saving: "data-selected:text-orange-dark",
};

type Kind = (typeof items)[number]["value"];

export function TypeSwitcher({
	value,
	onChange,
}: {
	value: Kind;
	onChange: (v: Kind) => void;
}) {
	const idx = items.findIndex((x) => x.value === value);

	return (
		<div className="inline-block rounded-lg bg-slate-100 p-2">
			<RadioGroup
				aria-label="種類"
				value={value}
				onChange={(v) => onChange(v as Kind)}
				className="relative inline-grid grid-cols-3 rounded-lg"
			>
				{/* moving pill */}
				<div
					aria-hidden
					className={cn(
						"absolute top-0 left-0 h-full w-[calc(100%/3)] rounded-lg bg-white shadow transition-transform duration-500 ease-[cubic-bezier(.2,1,.2,1)]",
						pillBg[value],
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
							selectedText[it.value],
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
