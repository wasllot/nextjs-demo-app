import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

export default function Spinner(props) {
	const { loading } = props;
	return (
		<Backdrop sx={{ zIndex: 10000, color: "#fff" }} open={loading}>
			<CircularProgress/>
			{/*<img src="/spinner.gif" color="primary" />*/}
		</Backdrop>
	);
}
