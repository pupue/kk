import { useState } from "react";
import { useDrag } from "@use-gesture/react";
import type { TransactionRecord } from "../functions";
import { cn } from "../utils/cn";
import { Button } from "react-aria-components";

type Props = {
  data: TransactionRecord;
  className?: string;
  onDelete: () => void;
};

export function TransactionListItem({ data, className, onDelete }: Props) {
  const max = 80; // 露出幅(px)
  const [x, setX] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const bind = useDrag(
    ({ active, movement: [mx, my], last, cancel }) => {
      // 縦スクロール優先（最小ガード）
      if (active && Math.abs(my) > Math.abs(mx)) {
        cancel?.();
        return;
      }

      const next = Math.max(-max, Math.min(0, mx));
      setX(next);

      if (last) setX((cur) => (cur < -max * 0.45 ? -max : 0));
    },
    {
      axis: "x",
      pointer: { touch: true },
      filterTaps: true,
      rubberband: true,
    }
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg transition-[opacity,transform] duration-300 ease-out",
        isDeleting && "opacity-0 scale-[0.98] -translate-y-0.5"
      )}
      onTransitionEnd={(e) => {
        if (isDeleting && e.propertyName === "opacity") {
          void onDelete();
        }
      }}
    >
      <div
        {...bind()}
        className={cn("relative  z-10 p-4 touch-pan-y", className)}
        style={{
          transform: `translateX(${x}px)`,
          transition:
            x === 0 || x === -max ? "transform 180ms ease" : undefined,
        }}
      >
        <span className="text-sm">¥{data.amount.toLocaleString()}</span>
      </div>

      <Button
        onPress={() => setIsDeleting(true)}
        className="absolute top-2/4 -translate-y-2/4  h-[calc(100%-2px)] right-1 rounded-r-lg w-20 bg-alert text-white text-sm font-semibold"
      >
        削除
      </Button>
    </div>
  );
}
