import { Fragment, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, Button, Spinner, Modal } from "../../src/components/atoms";
import { TextField, Footer } from "../../src/components/molecules";
import { InfoIcon, CheckIcon } from "../../src/components/icons";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { session } from "../../lib/session";

export default function LoginAdmin({}) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm();

	const onSubmit = async ({ email, password }) => {
		try {
			setIsLoading(true);
			const request = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					password,
				}),
			});
			setIsLoading(false);
			const response = await request.json();

			if (request.status === 200) {
				router.push("/admin/ordenes");
			} else if (request.status === 400) {
				if (response.error) {
					setIsOpen(true);
				}
			}
		} catch (e) {}
	};

	return (
		<Grid container sx={{ justifyContent: "center" }}>
			<Spinner loading={isLoading} />
			<Grid
				item
				md={12}
				xs={12}
				container
				justifyContent="center"
				sx={{
					padding: "35px 0",
					backgroundColor: "#0E1727",
					boxSizing: "content-box",
					zIndex: 0,
				}}
			>
				<Grid component={"img"} src="/logo-b9.svg" alt="Back9" width="80px" />
			</Grid>
			<Grid
				onSubmit={handleSubmit(onSubmit)}
				item
				xs={12}
				sm={6}
				md={6}
				container
				justifyContent="center"
				sx={{ zIndex: 0, margin: "30px", minHeight: "calc(100vh - 345px)" }}
				spacing={2}
				component={"form"}
			>
				<Grid item md={6} xs={12}>
					<Typography
						sx={{
							fontWeight: "700",
							color: "#585858",
							textAlign: "center",
							fontSize: "1.5rem",
						}}
						component={"h1"}
						variant="h5"
					>
						Inicia sesión como Administrador
					</Typography>
				</Grid>
				<Grid item md={12} sm={12} xs={12} container justifyContent="center">
					<TextField
						placeholder="Email"
						name="email"
						inputRef={register("email", {
							required: "No olvides ingresar tu correo electronico!",
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: "Formato de correo inválido",
							},
						})}
						onChange={(e) => setValue("email", e.target.value.trim())}
						error={errors.username ? true : false}
						helperText={errors.username ? errors.username.message : ""}
					/>
				</Grid>
				<Grid item md={12} sm={12} xs={12} container justifyContent="center">
					<TextField
						type="password"
						placeholder="Contraseña"
						inputRef={register("password", {
							required: "No olvides ingresar tu contraseña!",
						})}
						error={errors.password ? true : false}
						helperText={errors.password ? errors.password.message : ""}
					/>
				</Grid>
				<Grid item md={4} sm={6} xs={8} container alignItems={"center"}>
					<Link
						href={"/update-password"}
						sx={{
							color: "#585858",
							textDecoration: "unset",
							justifyContent: {
								xs: "space-between",
								sm: "space-around",
								md: "space-around",
							},
						}}
					>
						<Fragment>
							<InfoIcon /> <Typography sx={{ fontFamily: "Lato, sans-serif" }}>Olvidaste tu contraseña</Typography>
						</Fragment>
					</Link>
				</Grid>
				<Grid item md={12} sm={12} xs={12} container justifyContent="center" alignItems={"center"}>
					<Button fullWidth type="submit">
						Iniciar Sesión
					</Button>
				</Grid>
			</Grid>
			<Footer logoSx={{ bottom: { xs: "2%", md: "3%" } }} />
			<Modal open={isOpen} onClose={() => setIsOpen(false)}>
				<CheckIcon />
				<Typography
					sx={{
						fontStyle: "normal",
						fontWeight: "700",
						fontSize: "1.5rem",
						textAlign: "center",
						color: "#585858",
						margin: "20px",
					}}
				>
					Usuario o contraseña incorrectos
				</Typography>
				<Button fullWidth onClick={() => setIsOpen(false)}>
					Continuar
				</Button>
			</Modal>
		</Grid>
	);
}

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
	const coockie = req.session.admin;
	if (coockie) {
		return {
			redirect: {
				destination: "/admin/ordenes",
				permanent: false,
			},
		};
	}
	return {
		props: {
			//	coockie,
		},
	};
}, session.admin);
