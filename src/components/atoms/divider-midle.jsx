import * as React from "react";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

const Root = styled("div")(({ theme }) => ({
	width: "100%",
	...theme.typography.body2,
	"& > :not(style) + :not(style)": {
		marginTop: theme.spacing(2),
	},
}));

export default function DividerText({ children }) {
	return (
		<Root>
			<Divider>CENTER</Divider>
			<Divider textAlign="left">LEFT</Divider>
			<Divider textAlign="right">RIGHT</Divider>
			<Divider>
				<Chip label="CHIP" />
			</Divider>
			{content}
		</Root>
	);
}
