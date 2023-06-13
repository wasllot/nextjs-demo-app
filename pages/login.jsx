import { Fragment, useState, useEffect } from "react";
import { Grid, Typography, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, Button, Spinner, Modal } from "../src/components/atoms";
import { TextField, Footer } from "../src/components/molecules";
import { InfoIcon, CheckIcon, DangerIcon } from "../src/components/icons";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { session } from "../lib/session";
import { userServices } from "../src/services";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import useUser from "../lib/useUser";
import { Checkbox } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
import UpdatePassword from "./update-password";
export default function Login({ token }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [errorMail, setErrorMail] = useState(false);
  const [message, setMessage] = useState("");
  const { mutateUser } = useUser();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const handleOpenModal = () => {
    setModal(true);
  };
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
        mutateUser({ ...response });
        setError(false);
        setErrorMail(false);
        router.push("/profile");
      } else if (request.status === 400) {
        if (response.error) {
          if (response.error.code === 401) {
            setErrorMail(true);
            setMessage("Cuenta no verificada");
          } else {
            setErrorMail(false);
            setMessage("Usuario o contraseña incorrectos");
          }
          setIsOpen(true);
          setError(true);
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      setError(false);
      setErrorMail(false);
    }
  };

  useEffect(() => {
    async function validate() {
      if (token) {
        try {
          setIsLoading(true);
          const { status, response } = await userServices.validateAccount({ token });
          setIsLoading(false);
          if (status === 400) {
            setError(true);
            setMessage(response.error.message);
          } else {
            setError(false);
            setMessage(response.message);
          }
          setIsOpen(true);
        } catch (e) {
          setIsLoading(false);
          console.log(e);
        }
      }
    }
    validate();
  }, [token]);

  const resendEmail = async () => {
    setIsOpen(false);
    setError(false);
    setErrorMail(false);
    try {
      setIsLoading(true);
      const { status, response } = await userServices.resendEmail({ email: watch("email") });
      setIsLoading(false);
      if (status === 200) {
        setMessage("Se envió un correo electrónico para verificar tu cuenta");
      }
      setIsOpen(true);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  return (
    <Grid container sx={{ bgColor: "#F5F5F5", justifyContent: "center" }}>
      <Spinner loading={isLoading} />
      <Grid item md={12} xs={12} container justifyContent="center" sx={{ padding: "35px 0 0 0", boxSizing: "content-box", zIndex: 0 }}>
        <Grid component={"img"} src="/logo-b9.svg" alt="Back9" width="200px" />
      </Grid>
      <Grid onSubmit={handleSubmit(onSubmit)} item xs={12} sm={12} md={12} container sx={{ display: "flex",justifyContent: "center", alignItems: "center", zIndex: 0, minHeight: "calc(100vh - 355px)", marginBottom: "200px"}} spacing={2} component={"form"}>
        <Grid item md={12} sm={12} xs={12} container justifyContent="center" alignItems={"center"} sx={{ marginTop: 10 , marginBottom: 5}}>
          <Button  onClick={() =>router.push({pathname: "/login",})}
                    sx={{ width:"205px", height:"57px", borderRadius:0, boxShadow:0, backgroundColor:"#E9E9E9", fontWeight: "900", color:"#FFF", fontSize: "1rem"}} component={"button"} >
                    LOGIN 
          </Button>

          <Button  onClick={() =>router.push({pathname: "/register",})}
                    sx={{width:"205px", height:"57px", borderRadius:0, boxShadow:0, backgroundColor:"#F6F6F6", textAlign: "center", color: "#FFF", textDecoration: "unset", fontWeight: "900", color:"#E2E2E2", fontSize: "1rem" }} component={"button"}>
                    REGISTER
          </Button>
        </Grid>

        <Grid container justifyContent= "center" alignItems="center" sx={{ maxWidth: "270px" }}>
        <Grid item md={12} sm={12} xs={12} container justifyContent="center" marginBottom= "5px">
          <Grid item md={12} xs={12}  container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Typography sx={{ fontWeight: "500", color: "#AAAAAA", fontSize: "10px", fontFamily: "Raleway !important", paddingBottom:"10px"}} component={"h2"} variant="h5">
              EMAIL *
            </Typography>
          </Grid>
          <TextField
            placeholder="your@mail.com"
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
            helperText={errors.username?.message}
            style={{ width: '268px'}}
          />
        </Grid>
        <Grid item md={12} sm={12} xs={12} container justifyContent="center"  marginBottom= "5px">
          <Grid item md={12} xs={12} container direction="row" justifyContent="flex-start" alignItems="flex-start">
            <Typography sx={{textAlign: "left", fontWeight: "500", color: "#AAAAAA", fontSize: "10px", fontFamily: "Raleway", paddingBottom:"10px"}} component={"h2"} variant="h5">
              PASSWORD *
            </Typography>
          </Grid>
          <TextField
            type={show ? "text" : "password"}
            placeholder="xxxxxx"
            inputRef={register("password", {
              required: "No olvides ingresar tu contraseña!",
            })}
            
            error={errors.password ? true : false}
            helperText={errors.password ? errors.password.message : ""}
            style={{ width: '268px'}}
          />
        </Grid>
        </Grid>
        <Grid item xs={12} container justifyContent="center" alignItems={"center"}>
          <CheckBox defaultChecked sx={{width: "14px", height: "14px"}}/><label><Typography sx={{ fontFamily: "Raleway, sans-serif !important" , whiteSpace: "nowrap", color:"#AAAAAA", fontSize: "12px" }}>
              Recordarme
          </Typography></label>
          
        </Grid>
        <Grid item md={6} sm={6} xs={12} container justifyContent="center" alignItems="center">
          
          <Link
             href="#" onClick={handleOpenModal}
            sx={{
              color: "#fff",
              textDecoration: "unset",
            }}
           /* component="button"
             variant="body2"
            onClick={() => {
            console.info("I'm a button.");}} */
          >
            <Typography sx={{ fontFamily: "Raleway, sans-serif", whiteSpace: "nowrap", margin: "0 auto", color:"#AAAAAA"}}>
              ¿Olvidaste tu contraseña? <span style={{ color: "#FECC1D" }}> Clic aqui</span>
            </Typography>
          </Link>
        </Grid>
        <Grid item md={12} sm={12} xs={8} container justifyContent="center" alignItems={"center"}>
          <Button fullWidth type="submit" style={{width: '220px'}}>
            Iniciar Sesión
          </Button>
        </Grid>
        
      </Grid>

      <Grid item md={12} xs={12} container sx={{ display: "flex",justifyContent: "center", alignItems: "center", height: { xs: 200, md: 240 }, alignItems: "flex-end" }}>
        <Footer logoSx={{ bottom: { xs: "3%", md: "8%" } }} />
      </Grid>
      
       <Modal open={modal} onClose={() => setModal(false)}  sx={{width:"381px", height: "390px"}} >
        <UpdatePassword />
      </Modal> 
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        {error ? <DangerIcon /> : <CheckIcon />}
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
        {!errorMail ? (
          <Button fullWidth onClick={() => setIsOpen(false)}>
            Continuar
          </Button>
        ) : (
          <Button fullWidth onClick={resendEmail}>
            Reenviar correo electronico
          </Button>
        )}
      </Modal> 
    </Grid>
  );
}


export const getServerSideProps = withIronSessionSsr(async function ({ req, res, query }) {
  const user = req.session.user;
  const { token } = query;

  //console.log("user index.js", user);
  if (user) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }
  if (token) {
    return {
      props: {
        user,
        token,
      },
    };
  }

  return {
    props: {},
  };
}, session.user);
