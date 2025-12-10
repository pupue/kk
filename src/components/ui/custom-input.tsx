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
		<TextField {...props}>
			<Input
				className="h-full w-full rounded-lg bg-slate-50 p-3"
				placeholder={placeholder}
			/>
			<FieldError />
		</TextField>
	);
}
