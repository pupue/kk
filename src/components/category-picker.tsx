import { SquarePen, X } from "lucide-react";
import { useState } from "react";
import {
	Button,
	Dialog,
	DialogTrigger,
	Form,
	Modal,
	Radio,
	RadioGroup,
} from "react-aria-components";
import {
	addCategory,
	type CategoryRecord,
	updateCategory,
} from "../db/category-repo";
import type { TransactionType } from "../db/tx-repo";
import { useStore } from "../hooks/useStore";
import { cn } from "../utils/cn";
import { CustomInput } from "./ui/custom-input";
import { SubmitButton } from "./ui/submit-button";

type Props = {
	value: string;
	onChange: (v: string | null) => void;
	categories: CategoryRecord[];
	type: TransactionType;
};

export function CategoryPicker({ value, onChange, categories, type }: Props) {
	const { setCategories } = useStore();
	const [editCategory, setEditCategory] = useState<CategoryRecord | null>(null);

	function handleDeleteCategory() {
		if (window.confirm("本当に削除しますか？")) {
			setCategories((prev) =>
				prev.filter((category) => category.id !== editCategory?.id),
			);
			setEditCategory(null);
		}
	}

	async function handleUpdateCategory(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		event.stopPropagation();
		if (!editCategory) return;
		const form = event.currentTarget;

		const formData = new FormData(event.currentTarget);
		const name = String(formData.get("editCategoryName") ?? "");
		const updated = await updateCategory(editCategory.id, name);
		if (!updated) return;

		form.reset();
		setEditCategory(null);
		setCategories((prev) =>
			prev.map((c) => (c.id === updated.id ? updated : c)),
		);
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		event.stopPropagation();

		const form = event.currentTarget;

		const formData = new FormData(event.currentTarget);
		const name = String(formData.get("categoryName") ?? "");
		const category = await addCategory({ name, type, createdAt: Date.now() });

		form.reset();
		setCategories((prev) => [category, ...prev]);
	}

	return (
		<div className="flex gap-2 overflow-x-scroll">
			<RadioGroup
				value={value}
				onChange={onChange}
				className="flex shrink-0 gap-2"
				aria-label="カテゴリ"
			>
				{categories.map((category) => (
					<Radio
						aria-label={category.name}
						key={category.id}
						value={category.name}
						className={cn(
							"flex min-h-11 min-w-16 shrink-0 items-center justify-center rounded-lg border border-slate-300 p-2 text-sm transition-colors",
							value === category.name &&
								"border-slate-500 bg-slate-500 font-semibold text-white",
						)}
					>
						{category.name}
					</Radio>
				))}
			</RadioGroup>

			<DialogTrigger>
				<Button className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-300 p-2 text-sm">
					カテゴリの編集
					<SquarePen color="var(--color-base)" size={14} />
				</Button>
				<Modal isDismissable className="w-full max-w-sm px-5">
					<Dialog className="rounded-lg bg-white p-5">
						{({ close }) => (
							<>
								<Button onPress={close} className="ml-auto flex p-2">
									<X color="var(--color-base)" size={16} />
								</Button>
								<div className="grid gap-5 divide-y divide-slate-200">
									<Form
										onSubmit={handleSubmit}
										className="!rounded-none !shadow-none !p-0 !pb-5"
									>
										<div>
											<SectionTitle>
												新規追加するカテゴリを入力してください
											</SectionTitle>
											<div className="grid grid-cols-[1fr_auto] gap-2">
												<CustomInput
													aria-label="カテゴリ名"
													name="categoryName"
													type="text"
													placeholder="カテゴリ名"
												/>
												<SubmitButton />
											</div>
										</div>
									</Form>
									<div>
										{editCategory ? (
											<div>
												<Form
													onSubmit={handleUpdateCategory}
													className="!rounded-none !shadow-none !p-0"
												>
													<div className="grid grid-cols-[1fr_auto] gap-2">
														<CustomInput
															aria-label="カテゴリ名を編集"
															name="editCategoryName"
															type="text"
															defaultValue={editCategory.name}
														/>
														<SubmitButton />
													</div>
												</Form>
												<div className="mx-auto mt-4 grid w-4/5 grid-cols-2 gap-2">
													<Button
														className="min-h-11 rounded-lg border border-slate-300 p-2 text-sm"
														onPress={() => setEditCategory(null)}
													>
														キャンセル
													</Button>
													<Button
														className="min-h-11 rounded-lg bg-alert p-2 text-sm text-white"
														onPress={handleDeleteCategory}
													>
														削除
													</Button>
												</div>
											</div>
										) : (
											<div>
												<SectionTitle>
													編集するカテゴリを選択してください
												</SectionTitle>
												<div className="flex flex-wrap items-center gap-2">
													{categories.map((category) => (
														<Button
															key={category.id}
															className="min-h-11 min-w-16 rounded-lg border border-slate-300 p-2 text-sm"
															onPress={() => setEditCategory(category)}
														>
															{category.name}
														</Button>
													))}
												</div>
											</div>
										)}

										{/* <Button
                        onPress={handleDeleteCategory}
                        className="mt-4 flex mx-auto text-sm bg-alert px-4 py-2 rounded-lg text-white"
                      >
                        削除
                      </Button> */}
									</div>
								</div>
							</>
						)}
					</Dialog>
				</Modal>
			</DialogTrigger>
		</div>
	);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
	return <p className="mb-2 text-gray-dark text-sm">{children}</p>;
}
