import type { TransactionRecord, TransactionType } from "../db/tx-repo";
import { db, SUMMARY_STORE_NAME, TRANSACTIONS_STORE_NAME } from "./db";
import type { SummaryRecord } from "./summary-repo";

const SUMMARY_KEY: SummaryRecord["key"] = "main";

function calcDelta(type: TransactionType, amount: number) {
	return type === "income" ? amount : -amount;
}

export async function addTransactionMutation(
	tx: Omit<TransactionRecord, "id">,
) {
	const t = db.transaction(
		[TRANSACTIONS_STORE_NAME, SUMMARY_STORE_NAME],
		"readwrite",
	);
	const txStore = t.objectStore(TRANSACTIONS_STORE_NAME);
	const summaryStore = t.objectStore(SUMMARY_STORE_NAME);

	const id = (await txStore.add(tx)) as number;

	const current = ((await summaryStore.get(SUMMARY_KEY)) as
		| SummaryRecord
		| undefined) ?? {
		key: SUMMARY_KEY,
		balance: 0,
		savingTotal: 0,
	};

	const next: SummaryRecord = {
		key: SUMMARY_KEY,
		balance: current.balance + calcDelta(tx.type, tx.amount),
		savingTotal: current.savingTotal + (tx.type === "saving" ? tx.amount : 0),
	};

	await summaryStore.put(next);
	await t.done;

	const created: TransactionRecord = { ...tx, id };
	return { tx: created, summary: next };
}

export async function deleteTransactionMutation(id: number) {
	const t = db.transaction(
		[TRANSACTIONS_STORE_NAME, SUMMARY_STORE_NAME],
		"readwrite",
	);
	const txStore = t.objectStore(TRANSACTIONS_STORE_NAME);
	const sumStore = t.objectStore(SUMMARY_STORE_NAME);

	const record = (await txStore.get(id)) as TransactionRecord | undefined;
	if (!record) {
		await t.done;
		return { summary: await getSummaryFallback(sumStore) };
	}

	await txStore.delete(id);

	const current = await getSummaryFallback(sumStore);

	// 追加時の効果を取り消す（符号を反転）
	const undo = -calcDelta(record.type, record.amount);

	const next: SummaryRecord = {
		key: SUMMARY_KEY,
		balance: current.balance + undo,
		savingTotal:
			current.savingTotal - (record.type === "saving" ? record.amount : 0),
	};

	await sumStore.put(next);
	await t.done;

	return { txId: id, summary: next };
}

async function getSummaryFallback(sumStore: any): Promise<SummaryRecord> {
	const current = (await sumStore.get(SUMMARY_KEY)) as
		| SummaryRecord
		| undefined;
	if (current) return current;

	const init: SummaryRecord = { key: SUMMARY_KEY, balance: 0, savingTotal: 0 };
	await sumStore.put(init);
	return init;
}
