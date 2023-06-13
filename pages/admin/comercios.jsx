import { useState, useEffect, useReducer } from "react";
import { Font, Spinner } from "../../src/components/atoms";
import { Layout } from "../../src/components/molecules";
import { withIronSessionSsr } from "iron-session/next";
import { session } from "../../lib/session";
import {
	Box,
	Button,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Modal,
	CircularProgress,
	InputAdornment,
	IconButton,
} from "@mui/material";
import { adminServices } from "../../src/services";
import { useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Router from "next/router";

const reducer = (prevState, action) => {
	switch (action.type) {
		case "LOAD":
			return {
				loadingQueue: prevState.loadingQueue + 1,
				isLoading: true,
			};
		case "READY":
			if (prevState.loadingQueue <= 1) {
				return {
					loadingQueue: 0,
					isLoading: false,
				};
			}
			return {
				loadingQueue: prevState.loadingQueue - 1,
				isLoading: true,
			};
		default:
			break;
	}
};

export default function Comercios({ user }) {
	const [filter, setFilter] = useState("pendding");
	const [commerces, setCommerces] = useState([]);
	const [openCard, setOpenCard] = useState(false);
	const [openCommerce, setOpenCommerce] = useState(false);
	const [message, setMessage] = useState("");
	const [openMessage, setOpenMessage] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loaderState, loaderDispatch] = useReducer(reducer, {
		loadingQueue: 0,
		isLoading: false,
	});
	const [show, setShow] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm();

	const approveOrder = async (orderId) => {
		try {
			loaderDispatch({ type: "LOAD" });
			const { status, response } = await adminServices.approveOrder({
				token: user.token,
				orderId,
			});
			if (status === 200) {
				getCommerces();
			}
		} catch (error) {
			console.log({ error });
		} finally {
			loaderDispatch({ type: "READY" });
		}
	};

	const rejectOrder = async (orderId) => {
		try {
			loaderDispatch({ type: "LOAD" });
			const { status, response } = await adminServices.rejectOrder({
				token: user.token,
				orderId,
			});
			if (status === 200) {
				getCommerces();
			}
		} catch (error) {
			console.log({ error });
		} finally {
			loaderDispatch({ type: "READY" });
		}
	};

	const getCommerces = async () => {
		try {
			loaderDispatch({ type: "LOAD" });
			const { status, response } = await adminServices.getCommerces({
				token: user.token,
			});
			if (status === 200) {
				setCommerces(response);
			}
		} catch (error) {
			console.log({ error });
		} finally {
			loaderDispatch({ type: "READY" });
		}
	};

	useEffect(() => {
		getCommerces();
	}, []);

	// const handleCardClose = () => {};

	const addCommerce = async ({ commerceName, ...data }) => {
		console.log({ data: { user: { ...data }, commerceName } });
		try {
			setLoading(true);
			const { response, status } = await adminServices.addCommerce({
				token: user.token,
				data: { user: { ...data }, commerce: { name: commerceName } },
			});
			if (status === 200) {
				getCommerces();
				setMessage("Comercio agregado exitosamente");
			} else {
				setMessage(response.error.message);
			}
		} catch (error) {
			console.log({ error });
		} finally {
			setLoading(false);
			handleCloseCommerce();
			setOpenMessage(true);
		}
	};

	const handleCloseCommerce = () => {
		reset();
		setOpenCommerce(false);
	};

	return (
		<Box
			component="main"
			sx={{
				py: 6,
				px: 5,
				maxWidth: 1250,
				m: "auto",
				minHeight: "calc(100vh - 214px)",
			}}
		>
			<Spinner loading={loading} />
			<Modal
				open={openMessage}
				onClose={() => setOpenMessage(false)}
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					px: 2,
				}}
			>
				<Paper
					component="form"
					sx={{
						maxWidth: 350,
						display: "flex",
						flexDirection: "column",
						p: 3,
						gap: 4,
						position: "relative",
					}}
				>
					<Font family="brother" variant="h3" align="center">
						{message}
					</Font>
					<Button variant="contained" size="large" sx={{ fontFamily: "Lato, sans-serif" }} onClick={() => setOpenMessage(false)}>
						Aceptar
					</Button>
				</Paper>
			</Modal>
			<Modal
				open={openCommerce}
				onClose={handleCloseCommerce}
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					px: 2,
				}}
			>
				<Paper
					component="form"
					sx={{
						maxWidth: 500,
						width: "100%",
						display: "flex",
						flexDirection: "column",
						p: 3,
						gap: 2,
						position: "relative",
					}}
					onSubmit={handleSubmit(addCommerce)}
				>
					<Button
						variant="contained"
						sx={{
							borderRadius: "50%",
							minWidth: 0,
							p: 3,
							width: 20,
							height: 20,
							position: "absolute",
							top: -20,
							right: -20,
						}}
						onClick={handleCloseCommerce}
					>
						X
					</Button>
					<Font family="brother" variant="h3" align="center">
						Agregar comercio
					</Font>
					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							fullWidth
							placeholder="Nombre"
							InputProps={{
								sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
							}}
							inputProps={{
								...register("firstName", {
									required: "Ingre el nombre",
								}),
							}}
							FormHelperTextProps={{ sx: { fontFamily: "Lato, sans-serif" } }}
							helperText={errors.firstName?.message}
							error={errors.firstName}
						/>
						<TextField
							fullWidth
							placeholder="Apellido"
							InputProps={{
								sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
							}}
							inputProps={{
								...register("lastName", {
									required: "Ingrese el apellido",
								}),
							}}
							FormHelperTextProps={{ sx: { fontFamily: "Lato, sans-serif" } }}
							helperText={errors.lastName?.message}
							error={errors.lastName}
						/>
					</Box>
					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							fullWidth
							placeholder="Correo electrónico"
							InputProps={{
								sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
							}}
							inputProps={{
								...register("email", {
									required: "Ingrese el correo electrónico",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: "Ingrese un correo electrónico válido",
									},
								}),
							}}
							onChange={(e) => setValue("email", e.target.value.trim())}
							FormHelperTextProps={{ sx: { fontFamily: "Lato, sans-serif" } }}
							helperText={errors.email?.message}
							error={errors.email}
						/>
						<TextField
							fullWidth
							placeholder="Documento"
							InputProps={{
								sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
							}}
							inputProps={{
								...register("document", {
									required: "Ingrese el documento",
								}),
							}}
							FormHelperTextProps={{ sx: { fontFamily: "Lato, sans-serif" } }}
							helperText={errors.document?.message}
							error={errors.document}
						/>
					</Box>
					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							fullWidth
							placeholder="Contraseña"
							inputProps={{
								...register("password", {
									required: "Ingrese la contraseña",
								}),
							}}
							InputProps={{
								sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
								endAdornment: (
									<InputAdornment position="end">
										<IconButton aria-label="toggle password visibility" onClick={() => setShow(!show)} onMouseDown={() => { }} edge="end">
											{show ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
							type={show ? "text" : "password"}
							FormHelperTextProps={{ sx: { fontFamily: "Lato, sans-serif" } }}
							helperText={errors.password?.message}
							error={errors.password}
						/>
						<TextField
							fullWidth
							placeholder="Confirmar contraseña"
							inputProps={{
								...register("confirmPassword", {
									required: "Repita su contraseña",
									validate: (value) => watch("password") === value || "Las contraseñas no coinciden",
								}),
							}}
							InputProps={{
								sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
								endAdornment: (
									<InputAdornment position="end">
										<IconButton aria-label="toggle password visibility" onClick={() => setShow(!show)} onMouseDown={() => { }} edge="end">
											{show ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
							type={show ? "text" : "password"}
							FormHelperTextProps={{ sx: { fontFamily: "Lato, sans-serif" } }}
							helperText={errors.confirmPassword?.message}
							error={errors.confirmPassword}
						/>
					</Box>
					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							fullWidth
							placeholder="Teléfono"
							InputProps={{
								sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
							}}
							inputProps={{
								...register("phone", {
									required: "Ingrese el teléfono",
								}),
							}}
							FormHelperTextProps={{ sx: { fontFamily: "Lato, sans-serif" } }}
							helperText={errors.phone?.message}
							error={errors.phone}
						/>
						<TextField
							fullWidth
							placeholder="Pin"
							InputProps={{
								sx: {
									fontFamily: "Lato, sans-serif",
									borderRadius: 25,
								},
								endAdornment: (
									<InputAdornment position="end">
										<IconButton aria-label="toggle password visibility" onClick={() => setShow(!show)} onMouseDown={() => { }} edge="end">
											{show ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
							type={show ? "text" : "password"}
							inputProps={{
								...register("pin", {
									required: "Ingrese el pin",
								}),
								maxLength: 4,
							}}
							onChange={(e) => setValue("pin", e.target.value.replace(/[^0-9]/g, ""))}
							FormHelperTextProps={{ sx: { fontFamily: "Lato, sans-serif" } }}
							helperText={errors.pin?.message}
							error={errors.pin}
						/>
					</Box>
					<TextField
						fullWidth
						placeholder="Nombre del comercio"
						InputProps={{
							sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
						}}
						inputProps={{
							...register("commerceName", {
								required: "Ingrese el nombre del comercio",
							}),
						}}
						FormHelperTextProps={{ sx: { fontFamily: "Lato, sans-serif" } }}
						helperText={errors.commerceName?.message}
						error={errors.commerceName}
					/>
					<TextField
						fullWidth
						placeholder="Nombre de usuario para comercio"
						InputProps={{
							sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
						}}
						inputProps={{
							...register("userName", {
								required: "Ingrese el nombre usuario",
							}),
						}}
						FormHelperTextProps={{ sx: { fontFamily: "Lato, sans-serif" } }}
						helperText={errors.userName?.message}
						error={errors.userName}
					/>
					<Button
						variant="contained"
						color="primary"
						sx={{
							whiteSpace: "nowrap",
							borderRadius: 15,
							fontFamily: "Lato, sans-serif",
							px: 6,
						}}
						size="large"
						type="submit"
					>
						Agregar
					</Button>
				</Paper>
			</Modal>
			<Modal
				open={openCard}
				onClose={() => setOpenCard(false)}
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					px: 2,
				}}
			>
				<Paper
					sx={{
						maxWidth: 300,
						display: "flex",
						flexDirection: "column",
						p: 3,
						gap: 4,
						position: "relative",
					}}
				>
					<Font family="lato" variant="h5" align="center" sx={{ fontWeight: 600 }}>
						¿Estás seguro de realizar esta acción?
					</Font>
					<Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
						<Button
							variant="contained"
							color="primary"
							sx={{
								borderRadius: 25,
								fontFamily: "Lato, sans-serif",
							}}
							fullWidth
						>
							CANCELAR
						</Button>
						<Button
							variant="contained"
							color="secondary"
							sx={{
								bgcolor: "#68C5DC",
								borderRadius: 25,
								fontFamily: "Lato, sans-serif",
							}}
							fullWidth
						>
							ACEPTAR
						</Button>
					</Box>
				</Paper>
			</Modal>
			<Font family="brother" variant="h2" align="center">
				Comercios
			</Font>
			<Box sx={{ display: "flex", my: 4, gap: 2 }}>
				<TextField
					fullWidth
					onChange={getCommerces}
					placeholder="Buscar"
					InputProps={{
						sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
					}}
					//   InputLabelProps={{
					//     sx: { fontFamily: "Lato, sans-serif" },
					//   }}
					size="small"
				/>
				<Button
					variant="contained"
					color="primary"
					sx={{
						whiteSpace: "nowrap",
						borderRadius: 15,
						fontFamily: "Lato, sans-serif",
						px: 6,
					}}
					onClick={() => setOpenCommerce(true)}
				>
					Agregar comercio
				</Button>
			</Box>
			<TableContainer component={Paper} sx={{ my: 4 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align="center">Comercio</TableCell>
							<TableCell align="center">Administrador de comercio</TableCell>
							<TableCell align="center">Email</TableCell>
							<TableCell align="center">Balance</TableCell>
							<TableCell align="center">Transacciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{!loaderState.isLoading &&
							commerces.map(({ name, admin, balance, _id }, index) => (
								<TableRow key={index}>
									<TableCell align="center">{name}</TableCell>
									<TableCell align="center">{admin.firstName} {admin.lastName}</TableCell>
									<TableCell align="center">{admin.email}</TableCell>
									<TableCell align="center">{balance}</TableCell>
									<TableCell align="center">
										<Button
											color="primary"
											variant={filter === "pendding" ? "contained" : "outlined"}
											sx={{
												fontFamily: "Lato, sans-serif",
												borderRadius: 25,
												minWidth: 185,
											}}
											// onClick={exportTransaction}
											onClick={() => Router.push(`/admin/transacciones?commerceId=${_id}`)}
										>
											Ver transacciones
										</Button>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
				{loaderState.isLoading ? (
					<Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
						<CircularProgress />
					</Box>
				) : (
					!Boolean(commerces.length) && (
						<Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
							<Font family="lato">No se encontraron resultados</Font>
						</Box>
					)
				)}
			</TableContainer>
		</Box>
	);
}

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
	const cookie = req.session.admin;
	if (!cookie) {
		return {
			redirect: {
				destination: "/admin",
				permanent: false,
			},
		};
	}

	const { user, token, isLoggedIn } = cookie;

	return {
		props: {
			user: { ...user, token, isLoggedIn },
		},
	};
}, session.admin);

Comercios.getLayout = function getLayout(page) {
	return <Layout user={page.props.user}>{page}</Layout>;
};
