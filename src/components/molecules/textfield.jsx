import { TextField as MuiTextField, styled } from "@mui/material";

const StyledTextField = styled(MuiTextField)({
	minHeight: 47,
	
	"& label.Mui-focused": {
		border: "1px solid #E8E8E8",
	},
	"& .MuiInput-underline:after": {
		border: "1px solid #E8E8E8",
	},
	"& .MuiOutlinedInput-root": {
		"& fieldset": {
			border: "1px solid #E8E8E8",
		},
		"&:hover fieldset": {
			border: "1px solid #E8E8E8",
		},
		"&.Mui-focused fieldset": {
			border: "1px solid #E8E8E8",
		},
	},
});

export default function TextField(props) {
	const { placeholder, error, onChange, helperText, icon, inputRef, id, name, type, sx, maxLength, rootSx, ...rest } = props;

	return (
		<StyledTextField
			id={id}
			name={name}
			type={type}
			onChange={onChange}
			inputProps={{ maxLength, ...inputRef }}
			error={error}
			helperText={helperText}
			placeholder={placeholder}
			sx={{...rootSx }}
			FormHelperTextProps={{ sx: { fontFamily: "Raleway, sans-serif" } }}
			fullWidth
			InputProps={{
				sx: [{ fontFamily: "Raleway ,sans-serif", backgroundColor: "#E8E8E8", color: "#fff", borderRadius: 100, marginBottom: "5px", maxHeight: "37px"}, { ...sx }],
				endAdornment: icon,
			}}
			{...rest}
		/>
	);
}
