import {
	FieldError,
	Input,
	TextField,
	type TextFieldProps,
} from "react-aria-components";

type Props = TextFieldProps & {
	placeholder?: string;
};

export function CustomInput({ placeholder, ...props }: Props) {
	return (
		<TextField {...props} className="group relative">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 rounded-lg opacity-0 outline-offset-[-2px] transition-opacity [outline:2px_dashed_var(--color-blue)] group-focus-within:opacity-100"
			/>
			<Input
				className="min-h-11 w-full rounded-lg bg-slate-50 p-2 outline-none"
				placeholder={placeholder}
			/>
			<FieldError />
		</TextField>
	);
}
