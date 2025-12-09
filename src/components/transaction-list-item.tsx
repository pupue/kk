import { useDrag } from "@use-gesture/react";
import { useState } from "react";
import { Button } from "react-aria-components";
import { deleteTransactionMutation } from "../db/mutation";
import type { TransactionRecord } from "../db/tx-repo";
import { useStore } from "../hooks/useStore";
import { cn } from "../utils/cn";

type Props = {
	data: TransactionRecord;
	className?: string;
};

export function TransactionListItem({ data, className }: Props) {
	const max = 80;
	const [x, setX] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);
	const { setTransactions, setSummary } = useStore();

	const bind = useDrag(
		({ active, movement: [mx, my], last, cancel }) => {
			// 縦スクロールを妨げないようにする
			if (active && Math.abs(my) > Math.abs(mx)) {
				cancel?.();
				return;
			}

			const next = Math.max(-max, Math.min(0, mx));
			setX(next);

			if (last) setX((cur) => (cur < -max * 0.45 ? -max : 0));
		},
		{
			axis: "x",
			pointer: { touch: true },
			filterTaps: true,
			rubberband: true,
		},
	);

	async function handleDelete(id: number) {
		const { txId, summary } = await deleteTransactionMutation(id);

		setTransactions((prev) => prev.filter((tx) => tx.id !== txId));
		setSummary(summary);
	}

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-lg transition-[opacity,transform] duration-300 ease-out",
				isDeleting && "-translate-y-0.5 scale-[0.98] opacity-0",
			)}
			onTransitionEnd={(e) => {
				if (isDeleting && e.propertyName === "opacity") {
					void handleDelete(data.id);
				}
			}}
		>
			<div
				{...bind()}
				className={cn("relative z-10 touch-pan-y p-4", className)}
				style={{
					transform: `translateX(${x}px)`,
					transition:
						x === 0 || x === -max ? "transform 180ms ease" : undefined,
				}}
			>
				<span className="text-sm">¥{data.amount.toLocaleString()}</span>
			</div>

			<Button
				onPress={() => setIsDeleting(true)}
				className="-translate-y-2/4 absolute top-2/4 right-1 h-[calc(100%-2px)] w-20 rounded-r-lg bg-alert font-semibold text-sm text-white"
			>
				削除
			</Button>
		</div>
	);
}
