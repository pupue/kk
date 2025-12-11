type Props = {
	balance: number;
	savingTotal: number;
};

export function SummaryData({ balance, savingTotal }: Props) {
	return (
		<div className="break-all">
			<div className="text-center font-bold text-2xl">
				¥{balance.toLocaleString()}
			</div>
			<div className="text-center text-gray-500 text-sm">
				¥{savingTotal.toLocaleString()}
			</div>
		</div>
	);
}
