import { openDB } from "idb";

const INDEXED_DB_NAME = "kk-db";
const INDEXED_DB_VERSION = 2;
export const TRANSACTIONS_STORE_NAME = "transactions";
export const SUMMARY_STORE_NAME = "summary";

export const db = await openDB(INDEXED_DB_NAME, INDEXED_DB_VERSION, {
	upgrade(db) {
		if (!db.objectStoreNames.contains(TRANSACTIONS_STORE_NAME)) {
			const store = db.createObjectStore(TRANSACTIONS_STORE_NAME, {
				keyPath: "id",
				autoIncrement: true,
			});
			store.createIndex("createdAt", "createdAt");
		}
		if (!db.objectStoreNames.contains(SUMMARY_STORE_NAME)) {
			db.createObjectStore(SUMMARY_STORE_NAME, { keyPath: "key" });
		}
	},
});
