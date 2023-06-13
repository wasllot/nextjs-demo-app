import { useEffect, useReducer, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { withIronSessionSsr } from "iron-session/next";
import { useForm } from "react-hook-form";
import { Grid, Typography, styled, Box, Toolbar, useTheme, useMediaQuery } from "@mui/material";
import { session } from "../../../lib/session";
import { TextField, MenuBox, Layout } from "../../../src/components/molecules";
import { Button, Modal, Spinner } from "../../../src/components/atoms";
import { CameraIcon, CheckIcon, DangerIcon } from "../../../src/components/icons";
import { commerceServices } from "../../../src/services";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import QRCode from "react-qr-code";
const QrReader = dynamic(() => import("react-qr-reader").then((module) => module.QrReader), { ssr: false });

export default function Commerce({ user, commerce, products: productsFromApi }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenScanner, setIsOpenScanner] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [scanner, setScanner] = useState(false);
	const [isOpenPin, setIsOpenPin] = useState(false);
	const [userId, setUserId] = useState("");
	const [filter, setFilter] = useState(false);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [error, setError] = useState(false);
	const [message, setMessage] = useState("");
	const [reset, setReset] = useState(false);
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		pin: "",
		// defaultValues: {}; you can populate the fields by this attribute
	});

	const [products, dispatch] = useReducer((myArray, { type, value }) => {
		switch (type) {
			case "add":
				return [...myArray, value];
			case "updateIsSelect":
				return myArray.map((element, index) => {
					if (index === value) {
						return {
							...element,
							isSelect: !element.isSelect,
						};
					}
					return { ...element };
				});

			case "updateQuantity":
				return myArray.map((element, index) => {
					if (index === value.index) {
						return {
							...element,
							quantity: value.quantity,
						};
					}
					return { ...element };
				});
			case "reset":
				return [];
			default:
				return myArray;
		}
	}, []);

	useEffect(() => {
		async function listProducts() {
			dispatch({ type: "reset" });
			productsFromApi.forEach((product) => {
				dispatch({
					type: "add",
					value: {
						...product,
						product: product._id,
						isSelect: false,
						quantity: 0,
					},
				});
			});
			setReset(false);
		}
		listProducts();
	}, [reset]);

	const updateIsSelect = ({ index }) => {
		dispatch({ type: "updateIsSelect", value: index });
	};

	const updateQuantity = ({ index, quantity }) => {
		dispatch({ type: "updateQuantity", value: { index, quantity } });
	};

	const onScan = async (result, error) => {
		if (!!result) {
			setUserId(result?.text);
			setScanner(false);
			setIsOpenScanner(false);
			setIsOpenPin(true);
		}

		if (!!error) {
			console.info(error);
		}
	};

	const onSubmit = async (data) => {
		setIsOpenPin(false);
		const productsToSend = products.filter((product) => product.isSelect);
		try {
			setIsLoading(true);
			const { status, response } = await commerceServices.purchase({ userId, products: productsToSend, pin: data.pin, token: user.token });
			setIsLoading(false);
			if (status === 200) {
				setError(false);
				setMessage("Compra exitosa");
			} else if (status === 400) {
				if (response.error) {
					setError(true);
					setMessage(response.error.message);
				}
			}
			setIsOpen(true);
		} catch (e) {
			console.log(e);
		}
	};

	const filterList = (value) => {
		if (value === "") {
			setFilter(false);
		}
		setFilteredProducts(
			products.filter(
				(element, index) =>
					element.name.toLowerCase().includes(value.toLowerCase()) || element.description.toLowerCase().includes(value.toLowerCase())
			)
		);
		setFilter(true);
	};

	return (
		<Grid container sx={{ backgroundColor: "#FFF", position: "relative" }} justifyContent="center">
			<Grid item xs={12} md={12}>
				<Toolbar />
				<Spinner loading={isLoading} />
				<Grid container justifyContent={"center"} spacing={4} sx={{ minHeight: "calc(100vh - 215px)" }}>
					<Grid item xs={12} md={12}>
						<Typography align="center" sx={{ color: "#0E1727", fontSize: "2.5rem" }}>
							Generar venta
						</Typography>
					</Grid>
					
					<Grid item xs={11} md={12} container justifyContent="center" spacing={3}>
						<Grid item xs={6} md={4} container sx={{ justifyContent: { xs: "flex-start", md: "center" } }} alignItems={"center"}>
							<Typography
								sx={{ color: "#000000", fontFamily: "Lato, sans-serif", fontSize: { xs: "1.5rem", md: "2.25rem" }, fontWeight: "900" }}
								align="center"
							>
								{user.commerce.name.toUpperCase()}
							</Typography>
						</Grid>
						<Grid item xs={6} md={4} container sx={{ justifyContent: { xs: "flex-end", md: "center" } }} alignItems={"center"}>
							<Box
								sx={{
									width: 100,
									height: 100,
									boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
									borderRadius: "50%",
									backgroundImage: `url('${user.commerce.img_url}')`,
									backgroundSize: user.commerce.name === "El Toque" ? "50%" : "80%",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
								}}
							></Box>
						</Grid>
						<Grid item xs={10} md={4} container justifyContent={"center"} alignItems={"center"}>
							<TextField
								onChange={(e) => filterList(e.target.value)}
								placeholder="¿Qué estas buscando?"
								sx={{ bgcolor: "#FFF", color: "#000", width: { md: "80%", xs: "100%" } }}
							/>
						</Grid>
					</Grid>
					{!filter &&
						products.map((product, index) => (
							<Grid item xs={11} md={11} spacing={2}>
								<MenuBox
									isSelect={product.isSelect}
									name={product.name}
									price={product.price}
									description={product.description}
									img={product.img_url}
									quantity={product.quantity}
									onSelect={(e) => {
										if (product.isSelect) {
											updateQuantity({ index, quantity: 0 });
										}
										updateIsSelect({ index });
									}}
									onUpdateQuantity={(quantity) => {
										updateQuantity({ index, quantity });
										if (!product.isSelect) {
											updateIsSelect({ index });
										}
										if (quantity === 0 && product.isSelect) {
											updateIsSelect({ index });
										}
									}}
								/>
							</Grid>
						))}
					{filter &&
						filteredProducts.map((product, index) => (
							<Grid item xs={11} md={11} spacing={2}>
								<MenuBox
									isSelect={product.isSelect}
									name={product.name}
									price={product.price}
									img={product.img_url}
									description={product.description}
									quantity={product.quantity}
									onSelect={(e) => updateIsSelect({ index })}
									onUpdateQuantity={(quantity) => updateQuantity({ index, quantity })}
								/>
							</Grid>
						))}
					<Grid item xs={11} md={11}>
						<Lato sx={{ fontSize: "1rem", fontWeight: "700" }}>Resumen</Lato>
					</Grid>
					<Grid justifyContent="center" container item xs={11} md={12}>
						<Grid container item xs={12} md={4} justifyContent="center">
							{products
								.filter((product) => product.isSelect)
								.map((product) => (
									<Grid container justifyContent="space-between" item xs={12} md={12} sx={{ padding: "0 20px" }}>
										<Lato sx={{ fontSize: "1.25rem" }}>{product.name}</Lato>
										<Lato sx={{ fontSize: "1.25rem" }}>
											{product.quantity} x {product.price}$
										</Lato>
									</Grid>
								))}
							<Grid container justifyContent="space-between" sx={{ backgroundColor: "#F5F5F5", padding: "0 20px" }} item xs={12} md={12}>
								<Lato sx={{ fontSize: "1.25rem" }}>Total:</Lato>
								<Lato sx={{ fontSize: "1.25rem" }}>
									{products.filter((product) => product.isSelect).reduce((total, product) => product.quantity * product.price + total, 0)}$
								</Lato>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={11} md={3}>
						<Button fullWidth onClick={() => setIsOpenScanner(true)}>
							Continuar
						</Button>
					</Grid>
					{
						//footer
						//<Grid item xs={12} md={12} sx={{ height: 200 }}>
						//</Grid>
					}
				</Grid>
			</Grid>
			<Modal sx={{ padding: !scanner ? 4 : 2 }} open={isOpenScanner} onClose={() => setIsOpenScanner(false)}>
				{!scanner ? (
					<>
						<CameraIcon />
						<Typography
							sx={{
								fontStyle: "normal",
								fontWeight: "700",
								fontSize: "1.5rem",
								textAlign: "center",
								color: "#0E1727",
								margin: "20px",
							}}
						>
							APLICACION CÁMARA
						</Typography>
						<Lato
							sx={{
								fontStyle: "normal",
								fontWeight: "400",
								fontSize: "1.125rem",
								textAlign: "center",
								color: "#0E1727",
								margin: "20px",
							}}
						>
							Al continuar se abrira la App de tu camara acepta los permisos y podras escanear el código QR del cliente
						</Lato>
						<Button
							fullWidth
							onClick={() => {
								setScanner(true);
							}}
						>
							Continuar
						</Button>
					</>
				) : (
					<Grid container justify="center">
						<StyledQrReader scanDelay={100} videoId={"video"} onResult={onScan} constraints={{ facingMode: "environment" }} />
					</Grid>
				)}
			</Modal>
			<Modal
				sx={{ padding: !scanner ? 4 : 2 }}
				open={isOpen}
				onClose={() => {
					if (error) {
						setIsOpen(false);
					} else {
						setReset(true);
						setIsOpen(false);
					}
				}}
			>
				{!error ? <CheckIcon /> : <DangerIcon />}
				<Typography
					sx={{
						fontStyle: "normal",
						fontWeight: "700",
						fontSize: "1.5rem",
						textAlign: "center",
						color: "#0E1727",
						margin: "20px",
					}}
				>
					{message}
				</Typography>
				{!error && (
					<>
						{products
							.filter((product) => product.isSelect)
							.map((product) => (
								<Grid container justifyContent="space-between" item xs={12} md={12} sx={{ padding: "0 20px" }}>
									<Lato sx={{ fontSize: "1rem" }}>{product.name}</Lato>
									<Lato sx={{ fontSize: "1rem" }}>
										{product.quantity} x {product.price}$
									</Lato>
								</Grid>
							))}
						<Grid
							container
							justifyContent="space-between"
							sx={{ backgroundColor: "#F5F5F5", padding: "0 20px", mb: 2 }}
							item
							xs={12}
							md={12}
						>
							<Lato sx={{ fontSize: "1rem" }}>Total:</Lato>
							<Lato sx={{ fontSize: "1rem" }}>
								{products.filter((product) => product.isSelect).reduce((total, product) => product.quantity * product.price + total, 0)}$
							</Lato>
						</Grid>
					</>
				)}
				<Button
					fullWidth
					onClick={() => {
						if (error) {
							setIsOpen(false);
						} else {
							setReset(true);
							setIsOpen(false);
						}
					}}
				>
					Continuar
				</Button>
			</Modal>
			<Modal sx={{ padding: !scanner ? 4 : 2 }} open={isOpenPin} onClose={() => setIsOpenPin(false)}>
				<GppGoodOutlinedIcon color="primary" fontSize="large" sx={{ fontSize: "80px" }} />
				<Grid container item md={12} xs={12} component="form" onSubmit={handleSubmit(onSubmit)} direction="column">
					<Typography
						sx={{
							fontStyle: "normal",
							fontWeight: "700",
							fontSize: "1.5rem",
							textAlign: "center",
							color: "#0E1727",
							margin: "20px",
						}}
					>
						INGRESA EL PIN DE SEGURIDAD
					</Typography>
					<TextField
						type="password"
						placeholder="XXXX"
						inputRef={register("pin", {
							required: "No olvides confirmar tu contraseña!",
						})}
						onChange={(e) => setValue("pin", e.target.value.replace(/[^0-9]/g, ""))}
						maxLength={4}
						error={errors.confirm ? true : false}
						helperText={errors.confirm ? errors.confirm.message : ""}
					/>{" "}
					<Button fullWidth type="submit" sx={{ margin: "20px 0" }}>
						Continuar
					</Button>
				</Grid>
			</Modal>
		</Grid>
	);
}

const StyledQrReader = styled(QrReader)(() => ({
	width: "100%",
	height: "100%",
	"& > div": {
		paddingTop: "unset!important",
		"& > video": {
			width: "100%",
			height: "100%",
			overflow: "unset",
			position: "static!important",
			top: "unset!important",
			left: "unset!important",
		},
	},
}));

const Lato = styled(Typography)(() => ({
	fontFamily: "Lato, sans-serif",
}));

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
	const cookie = req.session.commerce;

	if (!cookie) {
		return {
			redirect: {
				destination: "/commerce",
				permanent: false,
			},
		};
	}

	const { user, commerce, token, isLoggedIn } = cookie;
	const { status, response } = await commerceServices.getProducts({ _id: commerce._id, isActive: true });
	return {
		props: {
			user: {
				...user,
				commerce,
				token,
				isLoggedIn,
			},
			products: response,
		},
	};
}, session.commerce);

Commerce.getLayout = function getLayout(page) {
	return <Layout user={page.props.user}>{page}</Layout>;
};
