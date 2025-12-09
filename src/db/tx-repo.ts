import { db, TRANSACTIONS_STORE_NAME } from "./db";

export type TransactionType = "income" | "expense" | "saving";

export type TransactionRecord = {
	id: number;
	type: TransactionType;
	amount: number;
	createdAt: number;
};

export async function addTransaction(
	transaction: Omit<TransactionRecord, "id">,
) {
	await db.add(TRANSACTIONS_STORE_NAME, transaction);
}

export async function getTransactions(
	limit = 50,
): Promise<TransactionRecord[]> {
	const index = db
		.transaction(TRANSACTIONS_STORE_NAME)
		.store.index("createdAt");

	const res: TransactionRecord[] = [];
	for await (const cursor of index.iterate(null, "prev")) {
		res.push(cursor.value as TransactionRecord);
		if (res.length >= limit) break;
	}
	return res;
}

export async function deleteTransaction(id: number) {
	await db.delete(TRANSACTIONS_STORE_NAME, id);
}

export function parseAmountToNumber(amountInput: string): number | null {
	const normalized = amountInput.replace(/,/g, "").trim();
	const amount = Number(normalized);
	if (!Number.isFinite(amount) || amount <= 0) return null;
	return amount;
}
