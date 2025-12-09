import { SendHorizontal } from "lucide-react";
import { RandomEllipses } from "./components/random-ellipses";
import { TypeSwitcher } from "./components/type-switcher";
import {
  Button,
  FieldError,
  Form,
  Input,
  TextField,
} from "react-aria-components";
import { useMemo, useState } from "react";
import {
  addTransactionToIndexedDB,
  deleteTransaction,
  fetchLatestTransactionsFromIndexedDB,
  parseAmountToNumber,
  type TransactionRecord,
  type TransactionType,
} from "./functions";
import { cn } from "./utils/cn";
import { TransactionListItem } from "./components/transaction-list-item";

type Props = {
  data: TransactionRecord[];
};

export default function App({ data }: Props) {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(data);
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<TransactionType>("income");

  const balanceAmount = useMemo(() => {
    return transactions.reduce((total, record) => {
      if (record.type === "income") return total + record.amount;
      if (record.type === "expense") return total - record.amount;
      if (record.type === "saving") return total - record.amount;

      return total;
    }, 0);
  }, [transactions]);

  const savingTotalAmount = useMemo(() => {
    return transactions.reduce(
      (total, record) => total + (record.type === "saving" ? record.amount : 0),
      0
    );
  }, [transactions]);

  async function reloadTransactions() {
    setTransactions(await fetchLatestTransactionsFromIndexedDB());
  }

  async function handleDelete(id: number) {
    await deleteTransaction(id);
    await reloadTransactions();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const amountInputValue = String(formData.get("amount") ?? "");
    const amount = parseAmountToNumber(amountInputValue);
    if (amount === null) return;

    await addTransactionToIndexedDB({
      type: selectedTransactionType,
      amount,
      createdAt: Date.now(),
    });

    // event.currentTarget.reset();
    await reloadTransactions();
  }

  return (
    <div className="relative h-svh overflow-hidden">
      <div className="bg-slate-100 h-full max-w-md mx-auto p-5">
        <div className="relative z-10 h-full grid grid-rows-[auto_1fr_auto] gap-4">
          <div className="">
            <div className="text-2xl font-bold text-center">
              ¥{balanceAmount.toLocaleString()}
            </div>
            <div className="text-center text-sm text-gray-500">
              ¥{savingTotalAmount.toLocaleString()}
            </div>
          </div>

          <div className="bg-white overflow-y-scroll p-4 rounded-lg">
            {transactions.length === 0 ? (
              <p className="text-center text-sm p-4">まだ何もありません</p>
            ) : (
              transactions.map((record, i) => (
                <TransactionListItem
                  key={record.id}
                  data={record}
                  className={cn(i % 2 === 0 ? "bg-slate-50" : "bg-white")}
                  onDelete={() => handleDelete(record.id)}
                />
              ))
            )}
          </div>

          <Form
            onSubmit={handleSubmit}
            className="space-y-2 bg-white shadow-xs p-4 rounded-lg"
          >
            <TypeSwitcher
              value={selectedTransactionType}
              onChange={setSelectedTransactionType}
            />

            <div className="grid grid-cols-[1fr_auto] gap-2">
              <TextField
                aria-label="金額"
                name="amount"
                type="decimal"
                isRequired
              >
                <Input
                  className="w-full bg-slate-50 rounded-lg h-full p-3"
                  placeholder="1,000"
                />
                <FieldError />
              </TextField>
              <Button
                type="submit"
                className="aspect-square flex justify-center items-center bg-blue-light p-2 rounded-lg"
              >
                <SendHorizontal color="#66B6FF" />
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <RandomEllipses />
    </div>
  );
}
