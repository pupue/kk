import { atom } from "jotai";
import type { CategoryRecord } from "../db/category-repo";
import type { SummaryRecord } from "../db/summary-repo";
import type { TransactionRecord } from "../db/tx-repo";

export const transactionsAtom = atom<TransactionRecord[]>([]);
export const summaryAtom = atom<SummaryRecord>({
	key: "main",
	balance: 0,
	savingTotal: 0,
});
export const categoriesAtom = atom<CategoryRecord[]>([]);
