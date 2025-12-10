import { SendHorizontal } from "lucide-react";
import { Button, type ButtonProps } from "react-aria-components";

type Props = ButtonProps;

export function SubmitButton({ ...props }: Props) {
	return (
		<Button
			type="submit"
			className="flex aspect-square items-center justify-center rounded-lg bg-blue-light p-2"
			{...props}
		>
			<SendHorizontal color="#66B6FF" />
		</Button>
	);
}
