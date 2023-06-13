import { makeStyles } from "@mui/styles";

export default function Transition(props) {
	const classes = useStyles();

	return (
		<svg focusable="false" className={classes.transition} viewBox="0 0 24 24" aria-hidden="true">
			<path fill={"#000"} d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"></path>
		</svg>
	);
}

const useStyles = makeStyles((theme) => ({
	transition: {
		animationName: "$example",
		animationDuration: "4s",
		animationIterationCount: "infinite",
		position: "absolute",
		width: "40px",
	},
	"@keyframes example": {
		"0%": { top: 5 },
		"50%": { top: 50 },
		"100%": { top: 5 },
	},
}));
