import { Fragment, useState } from "react";
import { Grid, Typography, Box, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { Button, Modal, Spinner } from "../src/components/atoms";
import { TextField, Footer } from "../src/components/molecules";
import { CheckIcon, DangerIcon } from "../src/components/icons";
import { useRouter } from "next/router";
import { userServices } from "../src/services";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";

export default function UpdatePassword({}) {
  const [step, setStep] = useState("0");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      code: "",
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (data) => {
    switch (step) {
      case "0":
        {
          /* try {
            setIsLoading(true);
            const { status, response } = await userServices.resetPassword({
              email: data.email,
            });
            setIsLoading(false);
            if (status === 200) {*/
              setStep("1");/*
            } else if (status === 400) {
              if (response.error) {
                setError(true);
                setMessage(response.error.message);
                setIsOpen(true);
              }
            }
          } catch (e) {
            setIsLoading(false);
            console.log(e);
          }*/
        } 
        break;
      case "1":
        {
          setStep("2");
        }
        break;
      case "2": {
        /* try {
          setIsLoading(true);
          const { status, response } = await userServices.updatePassword({
            token: data.code,
            password: data.password,
          });
          setIsLoading(false);
          if (status === 200) {
            setMessage("¡Listo, Su contraseña ha sido cambiada perfectamente!");
          } else if (status === 400) {
            if (response.error.code === 412) {
              setError(true);
              setMessage("Código de validación incorrecto");
              setStep("1");
            }
          }
          setIsOpen(true);
        } catch (e) {
          setIsLoading(false);
          console.log(e);
        } */
      }
      default:
        return;
    }
  };

  return (
    <Grid container sx={{ backgroundColor: "#fff", justifyContent: "center"}}>
      <Spinner loading={isLoading} />
      
      <Grid
        component={"form"}
        xs={12}
        sm={12}
        md={12}
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          zIndex: 0,
        
          width: "100%",
          minHeight: "calc(100vh - 420px)",
        }}
        container
        spacing={2}
        justifyContent="center"
      >
        {(() => {
          switch (step) {
            case "0":
              return (
                <Fragment>
                  <Grid container item md={12} sm={12} xs={12} sx={{width:"300px"}}>
                    <Typography
                      sx={{
                        fontWeight: "700",
                        color: "#0E1727",
                        textAlign: "center",
                        fontSize: "1.3rem",
                        fontFamily: "Raleway",
                        width: "277x",
                        padding: "20px"
                      }}
                      component={"h1"}
                      variant="h5"
                    >
                      Confirme su correo electrónico
                    </Typography>
                    <Typography
                      sx={{
                        color: "#0E1727",
                        fontWeight: "500",
                        textAlign: "center",
                        fontSize: "1rem",
                        fontFamily: "Raleway, sans-serif",
                        marginBottom: "24px",
                        
                      }}
                    >
                      Ingresa tu Correo Electrónico para recuperar tu contraseña
                    </Typography>
                    <Typography
                      sx={{
                        color: "#585858",
                        fontWeight: "400",
                        textAlign: { xs: "center", md: "left" },
                        padding: { md: "0 0 0 15px" },
                        fontSize: "0.813rem",
                        fontFamily: "Raleway, sans-serif",
                      }}
                    >
                      Correo Electrónico *
                    </Typography>
                  </Grid>
                  <Grid item md={12} sm={12} xs={8} container justifyContent="center">
                    <TextField
                      placeholder="Introduce tu correo electronico"
                      inputRef={register("email", {
                        required: "No olvides ingresar tu correo electronico!",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Formato de correo inválido",
                        },
                      })}
                      type="text"
                      onChange={(e) => setValue("email", e.target.value.trim())}
                      error={errors.email ? true : false}
                      helperText={errors.email ? errors.email.message : ""}
                    />
                  </Grid>
                  <Grid item md={12} sm={12} xs={8} container justifyContent="center" alignItems={"center"}>
                    <Button fullWidth type="submit">
                      Continuar
                    </Button>
                  </Grid>
                </Fragment>
              );
            case "1":
              return (
                <Fragment>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography
                      sx={{
                        fontWeight: "700",
                        color: "#585858",
                        textAlign: "center",
                        fontSize: "1.3rem",
                        marginBottom: "10px",
                      }}
                      component={"h1"}
                      variant="h5"
                    >
                      Ingresa tu
                      correo electrónico
                    </Typography>
                    <Typography
                      sx={{
                        color: "#8C8C8C",
                        fontWeight: "500",
                        textAlign: "center",
                        fontSize: "1rem",
                        fontFamily: "Raleway, sans-serif",
                        padding: "20px",
                        
                        
                      }}
                    >
                     
                      Enviamos un correo electrónico para validar tu registro. Si no lo encuentras revisa tu carpeta de correo no deseado.
                    </Typography>
                    <Typography
                      sx={{
                        color: "#585858",
                        fontWeight: "700",
                        textAlign: { xs: "center", md: "left" },
                        padding: { md: "0 0 0 15px" },
                        fontSize: "0.813rem",
                        fontFamily: "Raleway, sans-serif",
                      }}
                    >
                      Código
                    </Typography>
                  </Grid>
                  <Grid item md={12} sm={12} xs={8} container justifyContent="center">
                    <TextField
                      placeholder="Introduce el código para verificar"
                      inputRef={register("code", {
                        required: "Ingresa el código enviado a tu correo electronico!",
                      })}
                      type="text"
                      error={errors.code ? true : false}
                      helperText={errors.code ? errors.code.message : ""}
                    />
                  </Grid>
                  <Grid item md={12} sm={12} xs={8} container justifyContent="center" alignItems={"center"}>
                    <Button fullWidth type="submit">
                      Continuar
                    </Button>
                  </Grid>
                </Fragment>
              );
            case "2":
              return (
                <Fragment>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography
                      sx={{
                        fontWeight: "700",
                        color: "#585858",
                        textAlign: "center",
                        fontSize: "1.3rem",
                        padding: "20px",

                      }}
                      component={"h1"}
                      variant="h5"
                    >
                      Ingresa tu
                      nueva contraseña
                    </Typography>
                    <Typography
                      sx={{
                        color: "#585858",
                        fontWeight: "700",
                        textAlign: { xs: "center", md: "left" },
                        padding: { md: "0 0 0 15px" },
                        fontSize: "0.813rem",
                        fontFamily: "Lato, sans-serif",
                      }}
                    >
                      Nueva contraseña
                    </Typography>
                  </Grid>
                  <Grid item md={12} sm={12} xs={8} container justifyContent="center">
                    <TextField
                      placeholder="Introduce tu nueva contraseña"
                      inputRef={register("password", {
                        required: "Introduce tu nueva contraseña!",
                      })}
                      icon={
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={() => setShow(!show)} onMouseDown={() => {}} edge="end">
                            {show ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      type={show ? "text" : "password"}
                      error={errors.password ? true : false}
                      helperText={errors.password ? errors.password.message : ""}
                    />
                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>
                    <Typography
                      sx={{
                        color: "#585858",
                        fontWeight: "700",
                        textAlign: { xs: "center", md: "left" },
                        padding: { md: "0 0 0 15px" },
                        fontSize: "0.813rem",
                        fontFamily: "Lato, sans-serif",
                      }}
                    >
                      Confirmar contraseña
                    </Typography>
                  </Grid>
                  <Grid item md={12} sm={12} xs={8} container justifyContent="center">
                    <TextField
                      placeholder="Confirme su nueva contraseña"
                      inputRef={register("confirm", {
                        required: "Confirme su nueva contraseña!",
                        validate: (value) => value === watch("password") || "Las contraseñas no coinciden.",
                      })}
                      type={show ? "text" : "password"}
                      icon={
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={() => setShow(!show)} onMouseDown={() => {}} edge="end">
                            {show ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      error={errors.confirm ? true : false}
                      helperText={errors.confirm ? errors.confirm.message : ""}
                    />
                  </Grid>
                  <Grid item md={12} sm={12} xs={8} container justifyContent="center" alignItems={"center"}>
                    <Button fullWidth type="submit">
                      Continuar
                    </Button>
                  </Grid>
                </Fragment>
              );
            default:
              return null;
          }
        })()}
      </Grid>
      
      <Modal
        open={isOpen}
        onClose={() => {
          setError(false);
          setIsOpen(false);
        }}
      >
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
        <Button
          fullWidth
          onClick={() => {
            if (error) {
              setError(false);
            } else {
              router.push("/login");
            }
            setIsOpen(false);
          }}
        >
          Continuar
        </Button>
      </Modal>
    </Grid>
  );
}
