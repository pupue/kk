import { RandomEllipses } from "../random-ellipses";

export function Container({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative h-svh overflow-hidden">
			<div className="mx-auto h-full max-w-md bg-slate-100 p-5">
				<div className="relative z-10 grid h-full grid-rows-[auto_1fr_auto] gap-4">
					{children}
				</div>
			</div>
			<RandomEllipses />
		</div>
	);
}
