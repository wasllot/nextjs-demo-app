import { useEffect, useState } from "react";
import {
	Grid,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	useTheme,
	Typography,
	Box,
	InputAdornment,
	IconButton,
} from "@mui/material";
import { withIronSessionSsr } from "iron-session/next";
import moment from "moment";
import { session } from "../../../lib/session";
import { Spinner, Modal, Button } from "../../../src/components/atoms";
import { TextField, Layout } from "../../../src/components/molecules";
import { commerceServices, userServices } from "../../../src/services";
import { CheckIcon, DangerIcon } from "../../../src/components/icons";
import { useModal } from "../../../src/hooks";
import { useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Transaction({ user }) {
	const theme = useTheme();
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [count, setCount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [transactions, setTransactions] = useState([]);
	const [transactionId, setTransactionId] = useState("");
	const [show, setShow] = useState(false);
	const [addPin, setAddPin] = useState(false);
	const [] = useState();
	const { isOpen, error, message, setIsOpen, setError, setMessage } = useModal();
	const [reset, setReset] = useState(false);
	const {
		handleSubmit,
		register,
		setValue,
		watch,
		formState: { errors },
	} = useForm({ pin: "", query: "" });
	const [query, setQuery] = useState("");

	const getTransactions = async ({ query }) => {
		try {
			setIsLoading(true);
			console.log(user.userRoll)
			const { status, response } =
				user.userRoll === "commerce_admin"
					? await commerceServices.getTransactions({ token: user.token, page, limit, query })
					: await userServices.getTransactions({ token: user.token, page, limit, query });
			setIsLoading(false);
			if (status === 200) {
				setTransactions(response.docs);
				setLimit(response.limit);
				setCount(response.totalDocs);
				setPage(response.page);
			}
			console.log({ status, response });
		} catch (e) {
			console.log(e);
		}
		setReset(false);
	};

	useEffect(() => {
		getTransactions({ query: "" });
	}, [user, page, limit, reset]);

	const addRefund = async (data) => {
		try {
			setIsLoading(true);
			const { status, response } = await commerceServices.addRefund({ transactionId, pin: data.pin, token: user.token });
			setIsLoading(false);
			if (status === 200) {
				setError(false);
				setReset(true);
				setMessage("Reembolso exitoso.");
			} else if (status === 400) {
				if (response.error) {
					setError(true);
					setMessage(response.error.message);
				}
			}

			setAddPin(false);
			setIsOpen(true);
		} catch (e) {
			setIsLoading(false);
			console.log(e);
		}
	};

	const onKeyDownHandler = (e) => {
		if (e.keyCode === 13) {
			getTransactions({ query: e.target.value });
		}
	};

	return (
		<Grid container sx={{ backgroundColor: "#FFF" }} justifyContent="center">
			<Spinner loading={isLoading} />
			<Grid item xs={12} md={12}>
				<Grid item xs={12} md={12} container justifyContent="center" spacing={2}>
					<Grid item md={12} xs={12}>
						<Typography align="center" sx={{ fontSize: "2.5rem" }}>
							transacciones
						</Typography>
					</Grid>
					<Grid item md={4} xs={12}>
						<TextField placeholder="¿Qué estas buscando?" onKeyDown={onKeyDownHandler} onChange={(e) => setQuery(e.target.value)} />
					</Grid>
					<Grid item md={12} xs={12}>
						<TableContainer sx={{ borderRadius: "unset", minHeight: "calc(100vh - 405px)" }}>
							<Table>
								<TableHead>
									<TableRow>
										<StyledTableCell align="center">Tipo</StyledTableCell>
										<StyledTableCell align="center">Fecha</StyledTableCell>
										<StyledTableCell align="center">Monto</StyledTableCell>
										<StyledTableCell align="center">Cliente</StyledTableCell>
										<StyledTableCell align="center">Cajero</StyledTableCell>
										{/*<StyledTableCell align="center">Acción</StyledTableCell>*/}
									</TableRow>
								</TableHead>
								<TableBody>
									{transactions.map((row, index) => (
										<StyledTableRow key={index}>
											<StyledTableCell align="center">{row.description}</StyledTableCell>
											<StyledTableCell align="center">{moment(new Date(row.createdAt)).local().format("DD-MM-YYYY HH:mm")}</StyledTableCell>
											<StyledTableCell align="center">{row.amount}$</StyledTableCell>
											<StyledTableCell align="center">
												{row.description === "Reembolso" ? row.to.firstName.toUpperCase() : row.from.firstName.toUpperCase()}{" "}
												{row.description === "Reembolso" ? row.to.lastName.toUpperCase() : row.from.lastName.toUpperCase()}
											</StyledTableCell>
											<StyledTableCell align="center">
												{row.description === "Reembolso" ? row.from.firstName.toUpperCase() : row.to.firstName.toUpperCase()}{" "}
												{row.description === "Reembolso" ? row.from.lastName.toUpperCase() : row.to.lastName.toUpperCase()}
											</StyledTableCell>
											{/*<StyledTableCell align="center">
												<Button
													disabled={row.isRefeund || row.description === "Reembolso"}
													onClick={(e) => {
														setTransactionId(row._id);
														setAddPin(true);
													}}
													sx={[
														() => ({
															fontFamily: "lato, sans-serif",
															backgroundColor: theme.palette.primary.main,
															color: "#FFF",
															"&:hover": {
																backgroundColor: theme.palette.primary.main,
															},
														}),
													]}
												>
													Reembolso
												</Button>
												</StyledTableCell>*/}
										</StyledTableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
						<TablePagination
							labelRowsPerPage="Registros por página"
							component="div"
							count={count}
							onRowsPerPageChange={(e) => {
								setLimit(e.target.value);
							}}
							onPageChange={(e, page) => {
								setPage(page + 1);
							}}
							page={page - 1}
							rowsPerPage={limit}
							rowsPerPageOptions={[10, 20, 50, 100]}
							sx={[
								(theme) => ({
									color: theme.palette.secondary.main,
									[theme.breakpoints.down("xs")]: {
										position: "absolute",
										bottom: 0,
									},
								}),
							]}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Modal sx={{ padding: 2 }} open={addPin} onClose={() => setAddPin(false)}>
				<Box component={"form"} onSubmit={handleSubmit(addRefund)}>
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
						Ingrese el pin del Adminitrador
					</Typography>
					<TextField
						type={show ? "text" : "password"}
						icon={
							<InputAdornment position="end">
								<IconButton aria-label="toggle password visibility" onClick={() => setShow(!show)} onMouseDown={() => {}} edge="end">
									{show ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
						placeholder="XXXX"
						onChange={(e) => setValue("pin", e.target.value.replace(/[^0-9]/g, ""))}
						inputRef={register("pin", {
							required: "No olvides ingresar tu pin!",
						})}
						maxLength={4}
						error={errors.pin ? true : false}
						helperText={errors.pin ? errors.pin.message : ""}
					/>
					<Button type="submit" fullWidth sx={{ mt: 3 }}>
						Continuar
					</Button>
				</Box>
			</Modal>
			<Modal sx={{ padding: 2 }} open={isOpen} onClose={() => setIsOpen(false)}>
				{error ? <DangerIcon /> : <CheckIcon />}
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

				<Button fullWidth sx={{ mt: 3 }} onClick={() => setIsOpen(false)}>
					Continuar
				</Button>
			</Modal>
		</Grid>
	);
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: "#0E1727",
		color: theme.palette.common.white,
		fontFamily: "Lato, sans-serif",
		fontSize: 14,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 12,
		fontFamily: "Lato, sans-serif",
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
	const cookie = req.session.commerce;
	//console.log("user index.js", user);

	if (!cookie) {
		return {
			redirect: {
				destination: "/commerce",
				permanent: false,
			},
		};
	}

	const { user, commerce, token, isLoggedIn } = cookie;

	return {
		props: {
			user: {
				...user,
				commerce,
				token,
				isLoggedIn,
			},
		},
	};
}, session.commerce);

Transaction.getLayout = function getLayout(page) {
	return <Layout user={page.props.user}>{page}</Layout>;
};
