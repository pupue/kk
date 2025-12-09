import type { TransactionRecord } from "../db/tx-repo";
import { TransactionListItem } from "./transaction-list-item";

type Props = {
	data: TransactionRecord[];
};
export function TransactionList({ data }: Props) {
	return (
		<div className="overflow-y-scroll rounded-lg bg-white p-4">
			{data.length === 0 ? (
				<p className="p-4 text-center text-sm">まだ何もありません</p>
			) : (
				data.map((record) => (
					<TransactionListItem key={record.id} data={record} />
				))
			)}
		</div>
	);
}
