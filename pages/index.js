import { Grid, Typography, IconButton, styled, Divider, Box, Container } from "@mui/material";
import { Footer } from "../src/components/molecules";
import { Button } from "../src/components/atoms";
import { useRouter } from "next/router";
import Image from "next/image";
import Cloud6 from "../public/cloud-6.svg";
import { userServices } from "../src/services";
import { Transition } from "../src/components/atoms";
import { withIronSessionSsr } from "iron-session/next";
import { session } from "../lib/session";
export default function Shops({ commerces }) {
  const router = useRouter();

  return (
    <Grid container sx={{ backgroundColor: "#FFF" }} justifyContent="center">
      <Grid item md={12} xs={12} container justifyContent="center" sx={{ height: "60vh", bgcolor: "#F9E724" }}>
        <Box sx={{ width: 80, height: 80, borderRadius: "50%", top: "80%", left: "2%", zIndex: 2, position: "fixed" }}>
          <Transition />
        </Box>
        <Grid container item md={12} xs={12} justifyContent="flex-end" alignItems="center">
          <Image src={Cloud6} />
        </Grid>
        <Grid item md={12} xs={12} sx={{ zIndex: 3 }}>
          <Typography
            sx={{
              fontStyle: "normal",
              fontWeight: "700",
              fontSize: "3rem",
              textAlign: "center",
              color: "#0E1727",
              lineHeight: 1,
            }}
          >
            Bienvenido a<br />
            <Typography color="primary" component={"span"} sx={{ fontSize: "3rem" }}>
              Experiencia
            </Typography>{" "}
            <br /> Cusica
          </Typography>
        </Grid>
        <Grid container item md={12} xs={12} justifyContent="flex-start" alignItems="center" sx={{ position: "relative" }}>
          <Box component={"img"} src="../cloud-7.svg" sx={{ position: "absolute", left: 0, bottom: { xs: 0, md: "100px" }, zIndex: 2 }} />
          <Box component={"img"} src="../cloud-8.svg" sx={{ position: "absolute", right: 0, bottom: 0, zIndex: 2 }} />
          <Box component={"img"} src="../monster-3.svg" sx={{ position: "absolute", right: 0, bottom: 0, zIndex: 1 }} />
        </Grid>

        <Grid item md={12} xs={12}>
          {/*<Typography
						sx={{
							fontFamily: "BrightSight, sans-serif",
							fontStyle: "normal",
							fontWeight: "400",
							fontSize: "3rem",
							textAlign: "center",
							color: "#0E1727",
							lineHeight: 1,
						}}
					>
						Selecciona el comercio <br />
						para mirar su menu
					</Typography>*/}
        </Grid>
      </Grid>
      <Grid item xs={12} md={12} container justifyContent="center" sx={{ zIndex: 2, margin: 0 }}>
        <Divider
          sx={[
            (theme) => ({
              margin: "50px 0",
              width: "100%",
              fontSize: "2rem",
              "&:before": {
                border: `2pt solid ${theme.palette.primary.main}`,
                height: "20%",
                borderLeft: "unset",
                borderRight: "unseT",
                top: "25%",
              },
              "&:after": {
                border: `2pt solid ${theme.palette.primary.main}`,
                height: "20%",
                borderLeft: "unset",
                borderRight: "unseT",
                top: "25%",
              },
            }),
          ]}
        >
          Cusica FastPass
        </Divider>
        <Grid item xs={12} md={12}>
          <Typography align="center" sx={{ fontSize: "2rem" }}>
            Carga créditos rápido
          </Typography>
          <Typography align="center" sx={{ fontSize: "2rem" }}>
            Ahórrate colas
          </Typography>
          <Typography align="center" sx={{ fontSize: "2rem" }}>
            Disfruta del Cusica sin interrupciones
          </Typography>
        </Grid>
        <Divider
          sx={[
            (theme) => ({
              margin: "50px 0",
              width: "100%",
              fontSize: "2rem",
              "&:before": {
                border: `2pt solid ${theme.palette.primary.main}`,
                height: "20%",
                borderLeft: "unset",
                borderRight: "unseT",
                top: "25%",
              },
              "&:after": {
                border: `2pt solid ${theme.palette.primary.main}`,
                height: "20%",
                borderLeft: "unset",
                borderRight: "unseT",
                top: "25%",
              },
            }),
          ]}
        >
          Términos y condiciones
        </Divider>
        <Container>
          <Grid item xs={12} md={12} component="ul">
            <Typography component={"li"} sx={{ fontFamily: "Lato, sans-serif", fontSize: "1.4rem", textAlign: "justify" }}>
              Las recargas hechas en tu cuenta Sunset Card son reembolsables.
            </Typography>
            <Typography component={"li"} sx={{ fontFamily: "Lato, sans-serif", fontSize: "1.4rem", textAlign: "justify" }}>
              El costo de la emisión del plástico es de 5 dólares americanos, no es reembolsable, solo lo pagaras una vez.
            </Typography>
            <Typography component={"li"} sx={{ fontFamily: "Lato, sans-serif", fontSize: "1.4rem", textAlign: "justify" }}>
              En caso de extraviar tu tarjeta, la misma no podrá volver a emitir, sin embargo contarás con tu código QR único en el perfil de tu cuenta en experiencia.sunsetroll.com.
            </Typography>
            <Typography component={"li"} sx={{ fontFamily: "Lato, sans-serif", fontSize: "1.4rem", textAlign: "justify" }}>
              Los créditos disponibles en tu cuenta Sunset Card son equivalentes al valor de la misma cantidad en USD.
            </Typography>
            <Typography component={"li"} sx={{ fontFamily: "Lato, sans-serif", fontSize: "1.4rem", textAlign: "justify" }}>
              El sistema aplicará una comisión del 5% sobre el total de las recargas realizadas, no existen excepciones.
            </Typography>
            <Typography component={"li"} sx={{ fontFamily: "Lato, sans-serif", fontSize: "1.4rem", textAlign: "justify" }}>
              Back9 C.A y Sunset Roll no se hacen responsables por el uso indebido del sistema.
            </Typography>
            <Typography component={"li"} sx={{ fontFamily: "Lato, sans-serif", fontSize: "1.4rem", textAlign: "justify" }}>
              Back9 C.A y Sunset Roll no se hace responsable por cargos indebidos en los comercios afiliados.
            </Typography>
            <Typography component={"li"} sx={{ fontFamily: "Lato, sans-serif", fontSize: "1.4rem", textAlign: "justify" }}>
              Todos los comercios aceptaran este método de pago.
            </Typography>
          </Grid>
        </Container>

        <Divider
          sx={[
            (theme) => ({
              margin: "50px 0",
              width: "100%",
              fontSize: "2rem",
              "&:before": {
                border: `2pt solid ${theme.palette.primary.main}`,
                height: "20%",
                borderLeft: "unset",
                borderRight: "unseT",
                top: "25%",
              },
              "&:after": {
                border: `2pt solid ${theme.palette.primary.main}`,
                height: "20%",
                borderLeft: "unset",
                borderRight: "unseT",
                top: "25%",
              },
            }),
          ]}
        >
          Comercios
        </Divider>

        {/*<Grid item md={6} xs={12} container spacing={2} sx={{ margin: 0 }}>
					{commerces.map((commerce, key) => (
						<Grid key={key} item xs={6} md={4} sx={{ padding: "16px" }}>
							<StyledIconButton
								onClick={() =>
									router.push({
										pathname: `/shops/${commerce.name.toLowerCase()}`,
										query: { _id: commerce._id },
									})
								}
							>
								<Grid component={"img"} src={commerce.img_url} alt={commerce.name} width={commerce.name === "El Toque" ? "50%" : "80%"} />
							</StyledIconButton>
						</Grid>
					))}
				</Grid>*/}
        <Grid container justifyContent={"center"} item md={12} xs={12}>
          <Grid container item md={3} xs={6} justifyContent="center" alignItems="center" sx={{ position: "relative", height: "50px" }}>
            <Button onClick={() => router.push("/profile")} fullWidth sx={{ fontWeight: "bold", mt: 3 }}>
              Entrar
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item md={12} xs={12} container sx={{ position: "relative", height: 340, alignItems: "flex-end", backgroundColor: "#FFF" }}>
        <Grid component={"img"} src="/monster-2.svg" alt="Cusica" style={{ zIndex: 1, position: "absolute", bottom: "0%", right: 0 }} />
        <Grid component={"img"} src="/cloud-1.svg" alt="Cusica" width={"30%"} style={{ zIndex: 1, position: "absolute", bottom: "35%" }} />
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
  height: 200,
  borderRadius: 10,
  "&:hover": {
    background: "#FFFFFF",
  },
}));

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
  const cookie = req.session.user;
  if (!cookie) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  if (cookie) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  const { user, token, isLoggedIn } = cookie;
  const { status, response } = await userServices.getBalance({ id: user._id });
  return {
    props: {
      user: {
        ...user,
      },
      token,
      isLoggedIn,
      balance: response.balance,
      wallet: response.wallet || null,
    },
  };
}, session.user);
//export async function getServerSideProps({ req, res }) {
//	const { status, response } = await userServices.getBusiness();
//	return {
//		props: {
//			commerces: response,
//		},
//	};
//}
