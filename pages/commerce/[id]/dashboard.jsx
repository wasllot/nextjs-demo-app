import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { useForm } from "react-hook-form";
import { Grid, Typography, styled, Box, Toolbar } from "@mui/material";
import { session } from "../../../lib/session";
import { TextField, Layout } from "../../../src/components/molecules";
import { Button, Modal, Spinner } from "../../../src/components/atoms";
import { CheckIcon, DangerIcon } from "../../../src/components/icons";
import { commerceServices, userServices } from "../../../src/services";
import { useModal } from "../../../src/hooks";

export default function Dashboard({ user }) {
	const [isLoading, setIsLoading] = useState(false);
	const [employees, setEmployees] = useState([]);
	const [reset, setReset] = useState(false);
	const { isOpen, error, message, setIsOpen, setError, setMessage } = useModal();

	useEffect(() => {
		async function getEmployees() {
			try {
				setIsLoading(true);
				const { response } = await commerceServices.getEmployees({ token: user.token });
				setEmployees(response.employees);
				setIsLoading(false);
			} catch (e) {
				console.log(e);
				setIsLoading(false);
			}
			setReset(false);
		}
		getEmployees();
	}, [reset]);

	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		firstName: "",
		lastName: "",
		email: "",
		userName: "",
		password: "",
		confirm: "",
	});

	const onSubmit = async (data) => {
		const { email, password, firstName, lastName, userName } = data;
		try {
			setIsLoading(true);
			const { status, response } = await commerceServices.addEmployee({ email, password, firstName, lastName, token: user.token, userName });
			setIsLoading(false);
			if (status === 200) {
				setError(false);
				setMessage("Usuario agregado con exito.");
				setReset(true);
			} else if (status === 400) {
				if (response.error) {
					setError(true);
					setMessage(response.error.message);
				}
			}
			setIsOpen(true);
		} catch (e) {
			setIsLoading(false);
			console.log(e);
		}
	};

	const updateUsertStatus = async ({ _id, status: userStatus }) => {
		try {
			setIsLoading(true);
			const { status, response } = await commerceServices.updateEmployeeStatus({ _id, status: !userStatus, token: user.token });
			setIsLoading(false);
			if (status === 200) {
				setReset(true);
				setMessage("Usuario actualizado con exito");
				setError(false);
			} else if (status === 400) {
				if (response.error) {
					setMessage(response.error.message);
					setError(true);
				}
			}
			setIsOpen(true);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<Grid container sx={{ backgroundColor: "#FFF", position: "relative" }} justifyContent="center">
			<Spinner loading={isLoading} />
			<Grid component="main" container alignItems={"center"} sx={{ minHeight: "calc(100vh - 214px)" }}>
				<Toolbar />
				<Grid container justifyContent={"center"} alignItems="baseline">
                    <Grid container item xs={10} justifyContent="center" alignItems="center">
                        <Grid item sm={12} xs={12}>
							<Typography align="center" sx={{ color: "#0E1727", fontSize: "2.5rem" }}>
								Saldo {user.balance}$
							</Typography>
						</Grid>
                    </Grid>
					<Grid container item xs={10} md={6} justifyContent="center" alignItems="center" sx={{ margin: { xs: "30px 0 0 0" } }}>
						<Grid item sm={12} xs={12}>
							<Typography align="center" sx={{ color: "#0E1727", fontSize: "2.5rem" }}>
								USUARIOS ACTIVOS / INACTIVOS
							</Typography>
						</Grid>
						<Grid sx={{ border: "2pt solid #DAD8D8", margin: 0, minHeight: "400px" }} item xs={12} md={8} p={2}>
							{employees.map((item, index) => (
								<Box
									display={"flex"}
									justifyContent="space-between"
									alignItems={"baseline"}
									p={2}
									bgcolor={index % 2 == 0 ? "#FFF" : "#F5F5F5"}
								>
									<Lato>
										{item.firstName.toUpperCase()} {item.lastName.toUpperCase()} Balance 1$
									</Lato>
									{item.userRoll !== "commerce_admin" && (
										<Button
											onClick={() => updateUsertStatus({ _id: item._id, status: item.isActive })}
											sx={{ fontSize: "0.813rem", minHeight: "unset" }}
										>
											{item.isActive ? "Desactivar" : "Activar"}
										</Button>
									)}
								</Box>
							))}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
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
				<Button fullWidth onClick={() => setIsOpen(false)}>
					Continuar
				</Button>
			</Modal>
		</Grid>
	);
}

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
    const { status, response } = await commerceServices.getCommercBalance({ token })
    console.log(response)
	return {
		props: {
			user: {
				...user,
				commerce,
				token,
                balance: response.balance,
				isLoggedIn,
			},
		},
	};
}, session.commerce);

Dashboard.getLayout = function getLayout(page) {
	return <Layout user={page.props.user}>{page}</Layout>;
};
