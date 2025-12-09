import { db, SUMMARY_STORE_NAME } from "./db";

export type SummaryRecord = {
	key: "main";
	balance: number; // 収入 - 支出 - 貯金
	savingTotal: number; // 貯金合計
};

export async function getSummary(): Promise<SummaryRecord> {
	const current = (await db.get(SUMMARY_STORE_NAME, "main")) as
		| SummaryRecord
		| undefined;
	if (current) return current;

	const init: SummaryRecord = { key: "main", balance: 0, savingTotal: 0 };
	await db.put(SUMMARY_STORE_NAME, init);

	return init;
}
