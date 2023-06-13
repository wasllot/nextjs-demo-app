import { Button as MuiButton } from "@mui/material";

export default function Button(props) {
	const { children, type, onClick, sx, fullWidth, disabled, ...rest } = props;
	return (
		<MuiButton
			type={type}
			onClick={onClick}
			disabled={disabled}
			sx={[
				(theme) => ({
					backgroundColor: theme.palette.primary.main,
					color: "#FFF",
					fontFamily: "Roboto, sans-serif",
					borderRadius: 100,
					minHeight: 47,
					boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
					"&:hover": {
						backgroundColor: theme.palette.primary.main,
					},
				}),
				{ ...sx },
			]}
			fullWidth={fullWidth ? true : false}
			{...rest}
		>
			{children}
		</MuiButton>
	);
}
