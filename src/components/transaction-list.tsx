import { useEffect } from "react";
import type { TransactionRecord } from "../db/tx-repo";
import { TransactionListItem } from "./transaction-list-item";

type Props = {
	data: TransactionRecord[];
	listRef: React.RefObject<HTMLDivElement | null>;
};

export function TransactionList({ data, listRef }: Props) {
	useEffect(() => {
		if (!listRef.current) return;
		listRef.current.scrollTop = listRef.current.scrollHeight;
	}, [listRef]);

	return (
		<div ref={listRef} className="overflow-y-scroll rounded-lg bg-white p-4">
			{data.length === 0 ? (
				<p className="p-4 text-center text-sm">まだ何もありません</p>
			) : (
				[...data]
					.reverse()
					.map((record, index) => (
						<TransactionListItem
							key={record.id}
							data={record}
							isLast={index === data.length - 1}
						/>
					))
			)}
		</div>
	);
}
