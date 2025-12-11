import { CATEGORIES_STORE_NAME, db } from "./db";
import type { TransactionType } from "./tx-repo";

export type CategoryRecord = {
	id: number;
	type: TransactionType;
	name: string;
	createdAt: number;
};

export async function addCategory(input: Omit<CategoryRecord, "id">) {
	const id = (await db.add(CATEGORIES_STORE_NAME, input)) as number;
	return { ...input, id } satisfies CategoryRecord;
}

export async function getCategories(type: TransactionType) {
	const res = (await db.getAllFromIndex(
		CATEGORIES_STORE_NAME,
		"type",
		type,
	)) as CategoryRecord[];

	res.sort((a, b) => b.createdAt - a.createdAt);
	return res;
}

export async function getAllCategories() {
	const res = (await db.getAll(CATEGORIES_STORE_NAME)) as CategoryRecord[];
	res.sort((a, b) => b.createdAt - a.createdAt);
	return res;
}

export async function updateCategory(id: number, name: string) {
	const current = (await db.get(CATEGORIES_STORE_NAME, id)) as
		| CategoryRecord
		| undefined;
	if (!current) return null;

	const next: CategoryRecord = { ...current, name };
	await db.put(CATEGORIES_STORE_NAME, next);
	return next;
}

export async function deleteCategory(id: number) {
	await db.delete(CATEGORIES_STORE_NAME, id);
}

// 初期値
const DEFAULT_CATEGORIES: Record<
	Exclude<TransactionType, "saving">,
	string[]
> = {
	income: ["給与", "副業", "臨時収入", "その他"],
	expense: ["食費", "日用品", "交際費", "医療費", "光熱費", "その他"],
};

const DEFAULT_CATEGORIES_ENSURED_KEY = "defaultCategoriesEnsured";
export async function ensureDefaultCategories() {
	if (localStorage.getItem(DEFAULT_CATEGORIES_ENSURED_KEY)) return;

	const existingCount = await db.count(CATEGORIES_STORE_NAME);
	if (existingCount > 0) {
		localStorage.setItem(DEFAULT_CATEGORIES_ENSURED_KEY, "true");
		return;
	}

	const now = Date.now();
	const tx = db.transaction(CATEGORIES_STORE_NAME, "readwrite");
	for (const [type, names] of Object.entries(DEFAULT_CATEGORIES) as Array<
		[TransactionType, string[]]
	>) {
		for (const name of names) {
			await tx.store.add({ type, name, createdAt: now });
		}
	}
	await tx.done;
}
