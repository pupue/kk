import { useMemo } from "react";
import { cn } from "../utils/cn";

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function Ellipsis({
  className,
  size,
  style,
}: {
  className?: string;
  size: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl",
        className
      )}
      style={{ width: size, height: size, ...style }}
    />
  );
}

export function RandomEllipses() {
  // 画面幅に対して “ざっくり” % で配置（はみ出しも許容）
  const blobs = useMemo(
    () =>
      [
        { cls: "bg-ellipsis-orange", size: 240 },
        { cls: "bg-ellipsis-red", size: 240 },
        { cls: "bg-ellipsis-purple", size: 240 },
        { cls: "bg-ellipsis-blue", size: 240 },
      ].map((b) => ({
        ...b,
        style: {
          left: `${rand(-15, 85)}%`,
          top: `${rand(-15, 85)}%`,
          transform: `translate(${rand(-30, 30)}%, ${rand(-30, 30)}%)`,
        } as React.CSSProperties,
      })),
    []
  );

  return (
    <>
      {blobs.map((b) => (
        <Ellipsis key={b.cls} className={b.cls} size={b.size} style={b.style} />
      ))}
    </>
  );
}
