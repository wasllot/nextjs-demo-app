import { Grid, Typography, IconButton, styled, Box } from "@mui/material";
import { withIronSessionSsr } from "iron-session/next";
import { session } from "../../lib/session";
import { Footer } from "../../src/components/molecules";
import { Link } from "../../src/components/atoms";
import { commerceServices } from "../../src/services/";
export default function Shop({ id, products }) {
	return (
		<Grid container sx={{ backgroundColor: "#FFF" }} justifyContent="center">
			<Grid item md={12} xs={12} sx={{ backgroundColor: "#68C5DC" }}>
				<Grid
					item
					md={12}
					xs={12}
					p={2}
					container
					sx={{
						boxSizing: "content-box",
						zIndex: 1,
					}}
				>
					<Link href="/" sx={{ justifyContent: "center" }}>
						<Grid component={"img"} src="/logo-2.svg" alt="Cusica" width="40px" />
					</Link>
				</Grid>
			</Grid>
			<Grid item xs={12} md={12} container justifyContent="center" sx={{ zIndex: 2, margin: 0, minHeight: "calc(100vh - 425px)" }}>
				<Grid item md={8} xs={12} container sx={{ padding: { xs: "36px 25px 20px" }, justifyContent: { xs: "space-between" } }}>
					<Typography
						sx={{ fontFamily: "Lato, sans-serif", fontWeight: "700", color: "#0E1727", textAlign: "center", fontSize: "1.5rem" }}
						component={"h1"}
						variant="h5"
					>
						MENÚ
					</Typography>
					<Typography
						sx={{ fontFamily: "Lato, sans-serif", fontWeight: "700", color: "#0E1727", textAlign: "center", fontSize: "1.5rem" }}
						component={"h1"}
						variant="h5"
					>
						{id.toUpperCase()}
					</Typography>
				</Grid>
				<Grid item md={8} xs={12} container spacing={2} sx={{ margin: 0, height: "100%" }}>
					{products.map((product, key) => (
						<Grid key={key} item xs={12} md={6} sx={{ padding: "16px" }}>
							<StyledIconButton>
								<Box sx={{ width: "60%", height: "100%", padding: "20px 40px" }}>
									<Grid component={"ul"} sx={{ padding: 0, margin: { xs: "0 0 10px 0" } }}>
										<Typography
											align="left"
											component={"li"}
											sx={{ fontSize: ".8rem", fontFamily: "Lato, sans-serif", fontWeight: "400", color: "#000" }}
										>
											{product.name} <br /> {product.description}
										</Typography>
									</Grid>
									<Typography align="left" sx={{ fontSize: "1.25rem", fontFamily: "Lato, sans-serif", fontWeight: "400", color: "#000" }}>
										$ {product.price}
									</Typography>
								</Box>
								<StyledBox
									sx={{ backgroundImage: `url('${product.img_url}')`, backgroundSize: "cover", height: product.img_url ? "100%" : "unset" }}
								></StyledBox>
							</StyledIconButton>
						</Grid>
					))}
				</Grid>
			</Grid>
			<Grid item md={12} xs={12} container sx={{ position: "relative", height: 340, alignItems: "flex-end", backgroundColor: "#FFF" }}>
				<Grid
					component={"img"}
					src="/monster-2.svg"
					alt="Cusica"
					style={{ zIndex: 1, position: "absolute", bottom: "0%", right: 0 }}
				/>
				<Grid
					component={"img"}
					src="/cloud-1.svg"
					alt="Cusica"
					width={"30%"}
					style={{ zIndex: 1, position: "absolute", bottom: "35%" }}
				/>
				<Footer logoSx={{ bottom: { xs: 8, md: "6%" } }} />
			</Grid>
		</Grid>
	);
}

const StyledIconButton = styled(IconButton)((theme) => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	background: "#FFFFFF",
	boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
	width: "100%",
	height: "100%",
	borderRadius: 10,
	padding: 0,
	"&:hover": {
		background: "#FFFFFF",
	},
}));

const StyledBox = styled(Box)((theme) => ({
	width: "40%",
	height: "100%",
	backgroundColor: "#58256D",
	borderTopRightRadius: "10px",
	borderBottomRightRadius: "10px",
}));

export const getServerSideProps = withIronSessionSsr(async function ({ req, res, query }) {
	const { status, response } = await commerceServices.getProducts({ _id: query._id, isActive: true });
	return {
		props: {
			id: query.id,
			products: response,
		},
	};
}, session.user);
