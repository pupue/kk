export type TransactionType = "income" | "expense" | "saving";

export type TransactionRecord = {
	id: number;
	type: TransactionType;
	amount: number;
	createdAt: number;
};

const INDEXED_DB_NAME = "money-db";
const TRANSACTIONS_STORE_NAME = "transactions";
const INDEXED_DB_VERSION = 1;

function openIndexedDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);

		request.onupgradeneeded = () => {
			const database = request.result;
			if (!database.objectStoreNames.contains(TRANSACTIONS_STORE_NAME)) {
				const transactionStore = database.createObjectStore(
					TRANSACTIONS_STORE_NAME,
					{
						keyPath: "id",
						autoIncrement: true,
					},
				);
				transactionStore.createIndex("createdAt", "createdAt");
			}
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function addTransactionToIndexedDB(
	transaction: Omit<TransactionRecord, "id">,
) {
	const database = await openIndexedDB();
	try {
		await new Promise<void>((resolve, reject) => {
			const dbTransaction = database.transaction(
				TRANSACTIONS_STORE_NAME,
				"readwrite",
			);
			const transactionStore = dbTransaction.objectStore(
				TRANSACTIONS_STORE_NAME,
			);

			transactionStore.add(transaction);

			dbTransaction.oncomplete = () => resolve();
			dbTransaction.onerror = () => reject(dbTransaction.error);
		});
	} finally {
		database.close();
	}
}

export async function getTransactions(
	limit = 50,
): Promise<TransactionRecord[]> {
	const database = await openIndexedDB();
	try {
		return await new Promise<TransactionRecord[]>((resolve, reject) => {
			const dbTransaction = database.transaction(
				TRANSACTIONS_STORE_NAME,
				"readonly",
			);
			const transactionStore = dbTransaction.objectStore(
				TRANSACTIONS_STORE_NAME,
			);
			const createdAtIndex = transactionStore.index("createdAt");

			const transactions: TransactionRecord[] = [];
			const cursorRequest = createdAtIndex.openCursor(null, "prev");

			cursorRequest.onsuccess = () => {
				const cursor = cursorRequest.result;
				if (!cursor || transactions.length >= limit)
					return resolve(transactions);
				transactions.push(cursor.value as TransactionRecord);
				cursor.continue();
			};

			cursorRequest.onerror = () => reject(cursorRequest.error);
		});
	} finally {
		database.close();
	}
}

export async function fetchLatestTransactionsFromIndexedDB(
	limit = 50,
): Promise<TransactionRecord[]> {
	const database = await openIndexedDB();
	try {
		return await new Promise<TransactionRecord[]>((resolve, reject) => {
			const dbTransaction = database.transaction(
				TRANSACTIONS_STORE_NAME,
				"readonly",
			);
			const transactionStore = dbTransaction.objectStore(
				TRANSACTIONS_STORE_NAME,
			);
			const createdAtIndex = transactionStore.index("createdAt");

			const transactions: TransactionRecord[] = [];
			const cursorRequest = createdAtIndex.openCursor(null, "prev");

			cursorRequest.onsuccess = () => {
				const cursor = cursorRequest.result;
				if (!cursor || transactions.length >= limit)
					return resolve(transactions);
				transactions.push(cursor.value as TransactionRecord);
				cursor.continue();
			};

			cursorRequest.onerror = () => reject(cursorRequest.error);
		});
	} finally {
		database.close();
	}
}

export function parseAmountToNumber(amountInput: string): number | null {
	const normalized = amountInput.replace(/,/g, "").trim();
	const amount = Number(normalized);
	if (!Number.isFinite(amount) || amount <= 0) return null;
	return amount;
}

export async function deleteTransaction(id: number) {
	const database = await openIndexedDB();
	try {
		await new Promise<void>((resolve, reject) => {
			const tx = database.transaction(TRANSACTIONS_STORE_NAME, "readwrite");
			const store = tx.objectStore(TRANSACTIONS_STORE_NAME);

			store.delete(id);

			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
			tx.onabort = () => reject(tx.error);
		});
	} finally {
		database.close();
	}
}
