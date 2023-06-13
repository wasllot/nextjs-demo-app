import { useState } from "react";
import { Grid, Typography, styled, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
export default function MenuBox({ name, price, isSelect, description, onSelect, quantity, img, onUpdateQuantity }) {
	return (
		<StyledGrid container>
			<Grid item xs={2} md={2} container justifyContent={"center"} alignItems="center">
				<Checkbox
					onClick={onSelect}
					checked={isSelect}
					value={isSelect}
					icon={<SquareRoundedIcon sx={{ color: "#D2D2D2", background: "#68C5DC", borderRadius: "4px" }} />}
					checkedIcon={<CheckBoxOutlinedIcon sx={{ color: "#68C5DC", borderRadius: "4px" }} />}
				/>
			</Grid>
			<Grid item xs={3} md={2} container alignItems="center">
				<Grid sx={{ padding: 0 }}>
					<Typography
						align="left"
						sx={{ fontSize: { xs: ".7rem", md: "1rem" }, fontFamily: "Lato, sans-serif", fontWeight: "400", color: "#000" }}
					>
						{name} <br /> {description}
						<br /> precio: {price}$
					</Typography>
				</Grid>
			</Grid>
			<Grid item xs={3} md={4} sx={{ justifyContent: { md: "center" } }} container alignItems="center">
				<IconButton onClick={() => onUpdateQuantity(quantity === 0 ? quantity : quantity - 1)}>
					<StyledButtonBox>-</StyledButtonBox>
				</IconButton>
				<Typography sx={{ fontFamily: "Lato, sans-serif", fontSize: { xs: ".7rem", md: "2rem" }, fontWeight: "500", color: "#0E1727" }}>
					{quantity}
				</Typography>
				<IconButton onClick={() => onUpdateQuantity(quantity + 1)}>
					<StyledButtonBox>+</StyledButtonBox>
				</IconButton>
			</Grid>
			<Grid item xs={4} md={4} container justifyContent="flex-end">
				<StyledBox
					item
					xs={12}
					md={6}
					sx={{ backgroundImage: `url('${img}')`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}
				></StyledBox>
			</Grid>
		</StyledGrid>
	);
}

const StyledGrid = styled(Grid)((theme) => ({
	justifyContent: "center",
	alignItems: "center",
	background: "#FFFFFF",
	boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
	width: "100%",
	minHeight: 120,
	borderRadius: 10,
	"&:hover": {
		background: "#FFFFFF",
	},
}));

const StyledBox = styled(Grid)((theme) => ({
	width: "100%",
	minHeight: 120,
	borderTopRightRadius: "10px",
	borderBottomRightRadius: "10px",
	backgroundColor: "#D31B76",
}));

const StyledButtonBox = styled(Box)(({ theme }) => ({
	width: 40,
	height: 40,
	[theme.breakpoints.down("sm")]: {
		width: 20,
		height: 20,
	},
	borderRadius: "50%",
	boxShadow: "0px 4px 10px rgba(160, 160, 160, 0.25)",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
}));
