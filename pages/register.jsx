import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { Grid, Typography, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, Button, Spinner, Modal } from "../src/components/atoms";
import { TextField, Footer } from "../src/components/molecules";
import { MailIcon, DangerIcon } from "../src/components/icons";
import { userServices } from "../src/services";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";

export default function Register({}) {
  const [registerComplete, setRegisterComplete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      document: "",
      password: "",
      confirm: "",
      pin: "",
    },
  });

  const onSubmit = async (data) => {
    if (registerComplete) {
      const { firstName, lastName, email, phone, document, password, pin } = data;
      try {
        setloading(true);
        const { status, response } = await userServices.register({ firstName, lastName, email, phone, document, password, pin });
        setloading(false);
        if (status === 200) {
          setError(false);
          setMessage("Se envió un correo electrónico para verificar tu cuenta");
        } else if (status === 400) {
          if (response.error) {
            setError(true);
            setMessage(response.error.message);
          }
        }
        setIsOpen(true);
      } catch (e) {
        setloading(false);
        console.log(e);
      }
      return;
    }

    setRegisterComplete(true);
  };

  return (
    <Grid container sx={{ bgColor: "#F5F5F5", justifyContent: "center" }}>
      <Spinner loading={loading} />
      <Grid item md={12} sm={12} xs={12} container justifyContent={"center"} sx={{ padding: "35px 0 0 0", boxSizing: "content-box", zIndex: 0 }}>
        <Grid component={"img"} sx={{ width: "200px", cursor: "pointer" }} onClick={() => router.push("/profile")} src="/logo-b9.svg" alt="Back9" />

      </Grid>
      <Grid component={"form"} xs={12} sm={12} md={12} onSubmit={handleSubmit(onSubmit)} sx={{ zIndex: 0, minHeight: "calc(100vh - 335px)" , marginBottom: "200px" }} container spacing={2} justifyContent="center">
        {!registerComplete ? (
          <Fragment>
            <Grid item md={12} sm={12} xs={8} container justifyContent="center" alignItems={"center"} sx={{ minWidth: "428px", marginTop: 10 , marginBottom: 5}}>
              <Button  onClick={() =>router.push({pathname: "/login",})}
                  sx={{ 
                  width:"205px", height:"57px", borderRadius:0, boxShadow:0, backgroundColor:"#E9E9E9", fontWeight: "900", color:"#FFF", fontSize: "1rem"}} component={"button"} >
                  LOGIN 
              </Button>

              <Button  onClick={() =>router.push({pathname: "/register",})}
                sx={{width:"205px", height:"57px", borderRadius:0, boxShadow:0, backgroundColor:"#F6F6F6", textAlign: "center", color: "#FFF", textDecoration: "unset", fontWeight: "900", color:"#E2E2E2", fontSize: "1rem" }} component={"button"}>
                REGISTER
              </Button>
            </Grid>
            <Grid container justifyContent= "center" alignItems="center" sx={{ maxWidth: "270px" }}>
            <Grid item md={12} sm={12} xs={12} container justifyContent="center" marginBottom="5px">
              <Grid item md={12} xs={12} container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Typography sx={{ fontWeight: "500", color: "#AAAAAA", fontSize: "10px", fontFamily: "Raleway",paddingBottom: "10px"  }} component={"h2"} variant="h5">
                  USUARIO *
                </Typography>
              </Grid>
              <TextField
                placeholder="Nombre"
                inputRef={register("firstName", {
                  required: "No olvides ingresar tu nombre!",
                })}
                type="text"
                error={errors.firstName ? true : false}
                helperText={errors.firstName ? errors.firstName.message : ""}
                style={{ width: '268px'}}
              />
            </Grid>
            
            <Grid item md={12} sm={12} xs={12} container justifyContent="center" marginBottom="5px">
              <Grid item md={12} xs={12} container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Typography sx={{ fontWeight: "500", color: "#AAAAAA", fontSize: "10px", fontFamily: "Raleway",paddingBottom: "10px" }} component={"h2"} variant="h5">
                  CORREO ELECTRONICO *
                </Typography>
              </Grid>
              <TextField
                placeholder="your@mail.com"
                inputRef={register("email", {
                  required: "No olvides ingresar tu correo electronico!",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Formato de correo inválido",
                  },
                })}
                onChange={(e) => setValue("email", e.target.value.trim())}
                error={errors.email ? true : false}
                helperText={errors.email ? errors.email.message : ""}
                style={{ width: '268px'}}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12} container justifyContent="center" marginBottom="5px">
              <Grid item md={12} xs={12} container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Typography sx={{ fontWeight: "500", color: "#AAAAAA", fontSize: "10px", fontFamily: "Raleway",paddingBottom: "10px" }} component={"h2"} variant="h5">
                  CONFIRMA CORREO ELECTRONICO *
                </Typography>
              </Grid>
              <TextField
                placeholder="your@mail.com"
                inputRef={register("confirm", {
                  required: "No olvides ingresar tu correo electronico!",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Formato de correo inválido",
                  },
                  validate: (value) => watch("email") === value || "Las correos no coinciden.",
                })}
                error={errors.confirm ? true : false}
                helperText={errors.confirm ? errors.confirm.message : ""}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12} container justifyContent="center" marginBottom="5px">
              <Grid item md={12} xs={12}  container direction="row" justifyContent="flex-start" alignItems="flex-start">
                <Typography sx={{ fontWeight: "500", color: "#AAAAAA", fontSize: "10px", fontFamily: "Raleway" ,paddingBottom: "10px"}} component={"h2"} variant="h5">
                  CONTRASEÑA *
                </Typography>
              </Grid>
              <TextField
                placeholder="xxxxx"
                inputRef={register("password", {
                  required: "No olvides ingresar tu contraseña!",
                })}
                type={show ? "text" : "password"}
                icon={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={() => setShow(!show)} onMouseDown={() => {}} edge="end">
                      {show ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                error={errors.password ? true : false}
                helperText={errors.password ? errors.password.message : ""}
                style={{ width: '268px'}}
              />
            </Grid>
            </Grid>
            <Grid item md={12} sm={12} xs={8}>
              <Link href={"/login"} style={{ color: "#585858", textDecoration: "unset", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography sx={{ fontFamily: "Raleway, sans-serif", fontSize: "12px" }}>
                  ¿Tienes cuenta? <span style={{ color: "#FECC1D" }}>Inicia sesión</span>
                </Typography>
              </Link>
            </Grid>
            <Grid item md={12} sm={12} xs={12} container justifyContent="center" alignItems={"center"}>
              <Button fullWidth type="submit" style={{width: '220px'}}>
                Registrarte
              </Button>
            </Grid>
            
          </Fragment>
        ) : (
          <Fragment>
            <Grid item md={12} sm={12} xs={12}>
              <Typography sx={{ fontWeight: "700", color: "#000", textAlign: "center", fontSize: "1.5rem" }} component={"h1"} variant="h5">
                Crea tu{" "}
                <Typography sx={{ fontWeight: "700", textAlign: "center", fontSize: "1.5rem" }} component={"span"} color="primary">
                  PIN
                </Typography>
                <br />
                de seguridad
              </Typography>
              <Typography
                sx={{
                  color: "#000",
                  fontWeight: "500",
                  textAlign: "center",
                  fontSize: "1rem",
                  fontFamily: "Lato, sans-serif",
                  margin: { xs: "20px" },
                }}
              >
                Será necesario para aprobar
                <br />
                los consumos con tu FastPass
              </Typography>
            </Grid>
            <Grid item md={12} sm={12} xs={8} container justifyContent="center">
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
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Typography sx={{ color: "#0000", fontWeight: "700", textAlign: "center", fontSize: "0.813rem", fontFamily: "Lato, sans-serif" }}>
                Recuerda anotarlo en <br /> un lugar secreto, no <br /> se te vaya a olvidar.
              </Typography>
            </Grid>
            <Grid item md={12} sm={12} xs={8} container justifyContent="center" alignItems={"center"}>
              <Button type="submit" fullWidth>
                Continuar
              </Button>
            </Grid>
          </Fragment>
        )}
      </Grid>
      <Grid container item md={12} xs={12} sx={{ position: "relative", height: { xs: 450, md: 220 }, alignItems: "flex-end" }}>
        <Footer logoSx={{ bottom: { xs: "3%", md: "8%" } }} />
      </Grid>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        {!error ? <MailIcon /> : <DangerIcon />}
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
          {message}
        </Typography>
        <Button
          onClick={() => {
            if (error) {
              setIsOpen(false);
            } else {
              router.push("/login");
            }
          }}
        >
          Continuar
        </Button>
      </Modal>
    </Grid>
  );
}

//export async function getServerSideProps({ req, res }) {
//	return {
//		redirect: {
//			destination: "/profile",
//			permanent: false,
//		},
//	};
//}
