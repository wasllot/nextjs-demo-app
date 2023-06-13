import { useState, Fragment, useEffect } from "react";
import {
  Box,
  Drawer,
  Typography,
  Button,
  AppBar,
  Toolbar,
  List,
  ListItem,
  Link as MuiLink,
  SvgIcon,
  Modal,
  Grid,
  styled,
  Paper,
  TextField,
  useMediaQuery,
  useTheme,
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Font, Modal as ModalResponse, Button as ButtonResponse, Spinner } from "../../src/components/atoms";
import { Layout } from "../../src/components/molecules";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/logo.svg";
import Avatar from "@mui/icons-material/AccountCircle";
import { LogoutIcon } from "../../src/components/icons";
import { userServices, adminServices } from "../../src/services";
import { session } from "../../lib/session";
import { withIronSessionSsr } from "iron-session/next";
import { CameraIcon } from "../../src/components/icons";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CheckIcon, DangerIcon } from "../../src/components/icons";
import { AddCommentTwoTone } from "@mui/icons-material";

const QrReader = dynamic(() => import("react-qr-reader").then((module) => module.QrReader), { ssr: false });

const StyledMiniIconButton = styled(IconButton)((theme) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#FFFFFF",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
  border: "1px solid #F5F5F5",
  width: 55,
  height: 70,
  borderRadius: 10,
  "&:hover": {
    background: "#FFFFFF",
  },
}));

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

export default function Recarga({ price, user, url }) {
  const [scanner, setScanner] = useState(false);
  const [code, setCode] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [radioHandler, SetRadioHandler] = useState(true)
  const [quantity, setQuantity] = useState(1);
  const [openCard, setOpenCard] = useState(false);
  const [registered, setRegistered] = useState(true);
  const [card, setCard] = useState(true);
  const [openStepper, setOpenStepper] = useState(false);
  const [userData, setUserData] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [show, setShow] = useState(false);
  const [payment, setPayment] = useState(false);
  const [method, setMethod] = useState("bss");
  const [step, setStep] = useState(1);
  const [approved, setApproved] = useState(false);
  const [transferTo, setTransferTo] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [openResponse, setOpenResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const {
    register: registerPayment,
    handleSubmit: handleSubmitPayment,
    reset: resetPayment,
    setValue: setValuePayment,
    watch: watchPayment,
    formState: { errors: errorsPayment },
  } = useForm();

  const {
    register: registerCard,
    handleSubmit: handleSubmitCard,
    reset: resetCard,
    formState: { errors: errorsCard },
  } = useForm();

  const onScan = async (result, error) => {
    if (!!result) {
      console.log(result?.text);
      // setUserId(result?.text);
      // setScanner(false);
      // setIsOpen(false);
      // setIsOpenPin(true);
    }

    if (!!error) {
      console.info(error);
    }
  };

  const updateQuantity = (operation) => {
    if (quantity + operation >= 1) {
      setQuantity(quantity + operation);
    }
  };

  const handleCloseStepper = () => {
    setOpenStepper(false);
    reset();
    resetPayment();
    setScanner(false);
    setCode(false);
    setMethod("bss");
  };

  const addUserData = (data) => {
    // console.log({ userData: data });
    setUserData(data);
    setStep(step + 1);
  };

  const addPaymentData = (data) => {
    setPaymentData(data);
    setStep(step + 1);
  };

  const handleOpenStepper = () => {
    setStep(!registered ? 0 : 1);
    setOpenStepper(true);
  };

  const addCard = async (data) => {
    try {
      if (!!data) {
        setLoading(true);
        const payloadUnregistered = {
          user: { ...userData },
          platform: "web",
          paymentInfo: {
            credits: quantity,
            payment: { ref: paymentData.ref, type: method === "ubii" ? paymentData.type : method }
          },
          //walletcode: data.text,
        };


        const payloadRegistered = {
          user: data.text,
          credits: quantity,
          platform: "web",
          payment: {
            type: method,
            ref: method === "ubii" ? paymentData.type : method,
          },
        };
        handleCloseStepper();
        if (!registered) {
          const { response, status } = await adminServices.addUserWithCredits({
            token: user.token,
            data: payloadUnregistered,
          });
          console.log({ payloadUnregistered });
          console.log({ response, status });
          if (status === 200) {
            setMessage("¡Compra exitosa!");
          } else if (response.error) {
            setError(true);
            setMessage(response.error?.message);
          }
        } else {
          const { response, status } = await adminServices.addApprovedOrder({
            token: user.token,
            data: payloadRegistered,
          });
          console.log({ payloadRegistered });
          console.log({ response, status });
          if (status === 200) {
            setMessage("¡Compra exitosa!");
          } else if (response.error) {
            setError(true);
            setMessage(response.error?.message);
          }
        }
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
      setOpenResponse(true);
    }
  };
  useEffect(() => {
    window.addEventListener("message", getMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function getMessage(e) {
    const data = e.data;
    console.log(data)
    if (data.type === "response") {
      if (data.status === 200) {
        setPaymentData({
          type: data.response.method,
          ref: data.response.trace
        })
        //if(!isOrderProcessed){
        //  setIsOrderProcessed(true)
        //  orderUbii(data.response)
        //}
        setStep(step + 1);
      } else {
        setMessage(data.response.codS);
        setError(true);
      }
    }
  }

  // useEffect(() => { console.log('tajeta', card, 'registrado:', registered) }, [card, registered])

  return (
    <Box component="main" sx={{ py: 6, px: 5, maxWidth: 1200, m: "auto", position: "relative" }}>
      <Spinner loading={loading} />
      <ModalResponse open={openResponse} onClose={() => setOpenResponse(false)}>
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
        <ButtonResponse
          onClick={() => {
            setOpenResponse(false);
          }}
          fullWidth
        >
          Continuar
        </ButtonResponse>
      </ModalResponse>
      <Modal
        open={openStepper}
        onClose={handleCloseStepper}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Paper
          sx={{
            maxWidth: 600,
            width: "100%",
            p: 3,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
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
            onClick={handleCloseStepper}
          >
            X
          </Button>
          {step === 0 ? (
            <Box component="form" id="user" onSubmit={handleSubmit(addUserData)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Font family="brother" variant="h3" align="center">
                Registrar usuario
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
                      required: "Ingrese el nombre",
                    }),
                  }}
                  FormHelperTextProps={{
                    sx: { fontFamily: "Lato, sans-serif" },
                  }}
                  helperText={errors.firstName?.message}
                  error={Boolean(errors.firstName)}
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
                  FormHelperTextProps={{
                    sx: { fontFamily: "Lato, sans-serif" },
                  }}
                  helperText={errors.lastName?.message}
                  error={Boolean(errors.lastName)}
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
                  FormHelperTextProps={{
                    sx: { fontFamily: "Lato, sans-serif" },
                  }}
                  helperText={errors.email?.message}
                  error={Boolean(errors.email)}
                />
                <TextField
                  fullWidth
                  placeholder="Cédula/Pasaporte"
                  InputProps={{
                    sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
                  }}
                  inputProps={{
                    ...register("document", {
                      required: "Ingrese la cédula o el pasaporte",
                    }),
                  }}
                  FormHelperTextProps={{
                    sx: { fontFamily: "Lato, sans-serif" },
                  }}
                  helperText={errors.document?.message}
                  error={Boolean(errors.document)}
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
                  FormHelperTextProps={{
                    sx: { fontFamily: "Lato, sans-serif" },
                  }}
                  helperText={errors.password?.message}
                  error={Boolean(errors.password)}
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
                  FormHelperTextProps={{
                    sx: { fontFamily: "Lato, sans-serif" },
                  }}
                  helperText={errors.confirmPassword?.message}
                  error={Boolean(errors.confirmPassword)}
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
                  FormHelperTextProps={{
                    sx: { fontFamily: "Lato, sans-serif" },
                  }}
                  helperText={errors.phone?.message}
                  error={Boolean(errors.phone)}
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
                      minLength: {
                        value: 4,
                        message: "El código debe tener 4 digitos",
                      },
                    }),
                    maxLength: 4,
                  }}
                  onChange={(e) => setValue("pin", e.target.value.replace(/[^0-9]/g, ""))}
                  FormHelperTextProps={{
                    sx: { fontFamily: "Lato, sans-serif" },
                  }}
                  helperText={errors.pin?.message}
                  error={Boolean(errors.pin)}
                />
              </Box>
            </Box>
          ) : step === 1 ? (
            <div>
              <Grid container sx={{ gap: 2 }} justifyContent="center">
                {/*<Box>
                  <Typography align="center">PM Ubii</Typography>
                  <StyledMiniIconButton
                    sx={{ opacity: method === "ubii" ? 1 : 0.4 }}
                    onClick={() => {
                      setMethod("ubii");
                      setTransferTo("");
                    }}>
                    <Grid component={"img"} src="/bs.svg" width={"70%"} alt="Cash" />
                  </StyledMiniIconButton>
                  </Box>*/}
                <Box>
                  <Typography align="center">Pago móvil</Typography>
                  <StyledMiniIconButton
                    sx={{ opacity: method === "bss" ? 1 : 0.4 }}
                    onClick={() => {
                      setMethod("bss");
                      setTransferTo("");
                    }}
                  >
                    <Grid component={"img"} src="/bs.svg" width={"70%"} alt="Cash" />
                  </StyledMiniIconButton>
                </Box>
                <Box>
                  <Typography align="center">PDV</Typography>
                  <StyledMiniIconButton
                    sx={{ opacity: method === "pdv" ? 1 : 0.4 }}
                    onClick={() => {
                      setMethod("pdv");
                      setTransferTo("");
                    }}
                  >
                    <Grid
                      component={"img"}
                      src="/bs.svg"
                      width={"70%"}
                      alt="Cash"
                    />
                  </StyledMiniIconButton>
                </Box>
                <Box>
                  <Typography align="center">Cash</Typography>
                  <StyledMiniIconButton
                    sx={{ opacity: method === "cash" ? 1 : 0.4 }}
                    onClick={() => {
                      setMethod("cash");
                      setTransferTo("");
                    }}
                  >
                    <Grid
                      component={"img"}
                      src="/cash.svg"
                      width={"70%"}
                      alt="Cash"
                    />
                  </StyledMiniIconButton>
                </Box>
                <Box>
                  <Typography align="center">Zelle</Typography>
                  <StyledMiniIconButton
                    sx={{ opacity: method === "zelle" ? 1 : 0.4 }}
                    onClick={() => {
                      setMethod("zelle");
                      setTransferTo("Sunset@home.com");
                    }}
                  >
                    <Grid component={"img"} src="/zelle.svg" width={"70%"} alt="Cash" />
                  </StyledMiniIconButton>
                </Box>
                <Box>
                  <Typography align="center">Cortesía</Typography>
                  <StyledMiniIconButton
                    sx={{ opacity: method === "courtesy" ? 1 : 0.4 }}
                    onClick={() => {
                      setMethod("courtesy");
                      setTransferTo("");
                    }}
                  >
                    <Grid
                      component={"img"}
                      src="/cash.svg"
                      width={"70%"}
                      alt="Cash"
                    />
                  </StyledMiniIconButton>
                </Box>
              </Grid>
              <Grid
                component={"form"}
                id="payment"
                onSubmit={handleSubmitPayment(addPaymentData)}
                sx={{
                  zIndex: 0,
                  margin: { xs: "40px 0 10px 0" },
                  width: "100%",
                }}
                container
                spacing={1}
                justifyContent="center"
              >
                {(() => {
                  switch (method) {
                    case "zelle":
                      return (
                        <>
                          <Grid item xs={12} md={12}>
                            <Typography
                              sx={{
                                color: "#B0B0B0",
                                fontWeight: "700",
                                textAlign: "left",
                                fontSize: "0.813rem",
                                fontFamily: "Lato, sans-serif",
                              }}
                            >
                              Correos:
                            </Typography>
                            <Typography
                              sx={{
                                color: "#000",
                                fontWeight: "700",
                                textAlign: "left",
                                fontSize: "0.813rem",
                                fontFamily: "Lato, sans-serif",
                              }}
                            >
                              info@back9.com.ve
                            </Typography>
                            <Typography
                              sx={{
                                color: "#000",
                                fontWeight: "700",
                                textAlign: "left",
                                fontSize: "0.813rem",
                                fontFamily: "Lato, sans-serif",
                              }}
                            >
                              Back9 Solutions LLC.
                            </Typography>
                            <br />
                            {/* <Typography
														sx={{
															color: "#000",
															fontWeight: "700",
															textAlign: "left",
															fontSize: "0.813rem",
															fontFamily: "Lato, sans-serif",
														}}
													>
														SAMUELALCEDO@GMAIL.COM
													</Typography>
													<Typography
														sx={{
															color: "#000",
															fontWeight: "700",
															textAlign: "left",
															fontSize: "0.813rem",
															fontFamily: "Lato, sans-serif",
														}}
													>
														SAMUEL ALCEDO SILVA.
													</Typography> */}
                          </Grid>

                          <Grid item xs={12} md={12}>
                            <Typography
                              sx={{
                                color: "#B0B0B0",
                                fontWeight: "700",
                                textAlign: "left",
                                fontSize: "0.813rem",
                                fontFamily: "Lato, sans-serif",
                              }}
                            >
                              Nro° de referencia
                            </Typography>
                            <TextField
                              sx={{ color: "#585858", fontWeight: "700" }}
                              placeholder="Ejemplo: x850jrm"
                              inputProps={registerPayment("ref", {
                                required: "Debes ingresar el codigo de la transaccion",
                              })}
                              type="text"
                              error={errorsPayment.ref ? true : false}
                              helperText={errorsPayment.ref ? errorsPayment.ref.message : ""}
                            />
                          </Grid>
                        </>
                      );
                    case "ubii": return (
                      <Fragment>
                        <Grid item xs={12} md={12}>
                          <iframe
                            style={{ border: 0 }}
                            src={`${url}/view/ubii?amount=${parseFloat(parseInt(quantity)).toFixed(2)}&bss=${parseFloat(quantity * price).toFixed(2)}`}
                            title="Payment Luka Pay"
                            width="100%"
                            height="150px"
                          />
                        </Grid>
                      </Fragment>
                    )
                    case "bss":
                      return (
                        <>
                          <Grid item xs={12} md={12}>
                            <Typography
                              sx={{
                                color: "#B0B0B0",
                                fontWeight: "700",
                                textAlign: "left",
                                fontSize: "0.813rem",
                                fontFamily: "Lato, sans-serif",
                              }}
                            >
                              Documento
                            </Typography>
                            <Typography
                              sx={{
                                color: "#000",
                                fontWeight: "700",
                                textAlign: "left",
                                fontSize: "0.813rem",
                                fontFamily: "Lato, sans-serif",
                              }}
                            >
                              J - 411186236
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <Typography
                              sx={{
                                color: "#B0B0B0",
                                fontWeight: "700",
                                textAlign: "left",
                                fontSize: "0.813rem",
                                fontFamily: "Lato, sans-serif",
                              }}
                            >
                              Nro° de teléfono
                            </Typography>
                            <Typography
                              sx={{
                                color: "#000",
                                fontWeight: "700",
                                textAlign: "left",
                                fontSize: "0.813rem",
                                fontFamily: "Lato, sans-serif",
                              }}
                            >
                              0424-8640621
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <Typography
                              sx={{
                                color: "#B0B0B0",
                                fontWeight: "700",
                                textAlign: "left",
                                fontSize: "0.813rem",
                                fontFamily: "Lato, sans-serif",
                              }}
                            >
                              Banco
                            </Typography>
                            <Typography
                              sx={{
                                color: "#000",
                                fontWeight: "700",
                                textAlign: "left",
                                fontSize: "0.813rem",
                                fontFamily: "Lato, sans-serif",
                              }}
                            >
                              Banca amiga
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <Typography
                              sx={{
                                color: "#B0B0B0",
                                fontWeight: "700",
                                textAlign: "left",
                                fontSize: "0.813rem",
                                fontFamily: "Lato, sans-serif",
                              }}
                            >
                              Nro° de referencia
                            </Typography>
                            <TextField
                              sx={{ color: "#585858", fontWeight: "700" }}
                              placeholder="Ejemplo: x850jrm"
                              inputProps={registerPayment("ref", {
                                required: "Debes ingresar el código de la transaccion",
                              })}
                              type="text"
                              error={errorsPayment.ref ? true : false}
                              helperText={errorsPayment.ref ? errorsPayment.ref.message : ""}
                            />
                          </Grid>
                        </>
                      );
                    case "cash":
                      return (
                        <>
                          <Grid item xs={12} md={12}>
                            <Typography
                              sx={{
                                fontFamily: "Lato, sans-serif",
                                fontStyle: "normal",
                                fontWeight: "700",
                                fontSize: "0.813rem",
                                color: "#B0B0B0",
                              }}
                            >
                              Completa tu pago en efectivo <br /> <br />
                              <br /> <br />
                            </Typography>
                          </Grid>
                        </>
                      );
                    default:
                      return null;
                  }
                })()}
                <>
                  {(method === "bss" || method === "pdv" || method === "ubii") && (
                    <Grid item xs={12} md={12}>
                      <Typography
                        sx={{
                          color: "#0E1727",
                          fontWeight: "400",
                          textAlign: "left",
                          fontSize: "2.25rem",
                          fontFamily: "BrightSight, sans-serif",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                        }}
                      >
                        Tasa:{" "}
                        <Typography
                          component={"span"}
                          sx={{
                            color: "#0E1727",
                            fontWeight: "700",
                            fontSize: "2.5rem",
                            textAlign: "right",
                            fontFamily: "BrightSight, sans-serif",
                          }}
                        >
                          Bs {price}
                        </Typography>
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} md={12}>
                    <Typography
                      sx={{
                        color: "#0E1727",
                        fontWeight: "400",
                        textAlign: "left",
                        fontSize: "2.25rem",
                        fontFamily: "BrightSight, sans-serif",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      Monto total:{" "}
                      <Typography
                        component={"span"}
                        sx={{
                          color: "#0E1727",
                          fontWeight: "700",
                          fontSize: "2.5rem",
                          textAlign: "right",
                          fontFamily: "BrightSight, sans-serif",
                        }}
                      >
                        {(method === "bss" || method === "pdv" || method === "ubii")
                          ? "Bs " +
                          parseFloat(
                            (parseInt(quantity) +
                              (card ? 0 : 5) +
                              quantity * parseFloat(0).toFixed(2)) *
                            price
                          ).toFixed(2) : method === "courtesy" ? parseFloat(0).toFixed(2) :
                            parseFloat(
                              parseInt(quantity) +
                              (card ? 0 : 5) +
                              quantity * parseFloat(0).toFixed(2)
                            ).toFixed(2) + " $"}
                      </Typography>
                    </Typography>
                  </Grid>
                </>
              </Grid>
            </div>
          ) : (
            <>
              <Font family="brother" align="center" variant="h4">
                {card ? "Asociar usuario" : registered ? "Asociar usuario" : "Confirma el registro del usuario"}
              </Font>
              {scanner ? (
                <Grid container justify="center">
                  <StyledQrReader scanDelay={100} videoId={"video"} onResult={addCard} constraints={{ facingMode: "environment" }} />
                </Grid>
              ) : code ? (
                <Box component="form" onSubmit={handleSubmitCard(addCard)} id="card">
                  <TextField
                    fullWidth
                    placeholder="Email"
                    InputProps={{
                      sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
                    }}
                    inputProps={{
                      ...registerCard("text", {
                        required: "Ingrese el correo electrónico del usuario",
                      }),
                    }}
                    FormHelperTextProps={{
                      sx: { fontFamily: "Lato, sans-serif" },
                    }}
                    helperText={errorsCard.text?.message}
                    error={Boolean(errorsCard.text)}
                  />
                </Box>
              ) : (
                <>
                  {/* <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      my: 2,
                    }}
                  > */}
                  {/*<Button
                    variant="contained"
                    sx={{
                      whiteSpace: "nowrap",
                      borderRadius: 15,
                      fontFamily: "Lato, sans-serif",
                      px: 6,
                      alignSelf: "center",
                    }}
                    size="large"
                    onClick={() => {
                      setScanner(true);
                    }}
                  >
                    Cámara
                  </Button>*/}
                  <Button
                    variant="contained"
                    sx={{
                      whiteSpace: "nowrap",
                      borderRadius: 15,
                      fontFamily: "Lato, sans-serif",
                      px: 6,
                      alignSelf: "center",
                    }}
                    size="large"
                    onClick={() => {
                      if (registered) {
                        setCode(true);
                      } else {
                        addCard({});
                      }
                    }}
                  >
                    {registered ? "Email" : "Aceptar"}
                  </Button>
                  {/* </Box> */}
                </>
              )}
            </>
          )}
          {!(step === 1 && method === "ubii") &&
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                whiteSpace: "nowrap",
                borderRadius: 15,
                fontFamily: "Lato, sans-serif",
                px: 6,
                display: step === 2 && !code ? "none" : "block",
              }}
              size="large"
              type="submit"
              form={step === 0 ? "user" : step === 1 ? "payment" : "card"}
            >
              {step === 2 ? "Enviar" : "Siguiente"}
            </Button>}
        </Paper>
      </Modal>
      <FormControlLabel
        sx={{ position: "absolute", top: 0, right: 4 }}
        control={
          <Switch
            checked={registered}
            onChange={(e) => {
              setRegistered(e.target.checked);
              if (e.target.value) {
                setCard(false);
              }
            }}
          />
        }
        label="Registrado"
      />
      {/* <FormControlLabel
        sx={{ position: "absolute", top: 30, right: 0 }}
        control={<Switch checked={card} onChange={() => setCard(!card)} />}
        label={`${card ? "Con" : "Sin"} tarjeta`}
        disabled={!registered}
      /> */}
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue={radioHandler}
        name="radio-buttons-group"
      >
        <FormControlLabel
          value={true}
          sx={{ position: "absolute", top: 30, right: 0 }}
          control={<Radio /* checked={card} */ onChange={() => {SetRadioHandler(true); setCard(true)}} />}
          label={`${"Con"} tarjeta`}
          disabled={!registered}
        />
        <FormControlLabel
          value={false}
          sx={{ position: "absolute", top: 60, right: 7 }}
          control={<Radio /* checked={card} */ onChange={() => {SetRadioHandler(true); setCard(false)}} />}
          label={`${"Sin"} tarjeta`}
          disabled={!registered}
        />
      </RadioGroup>
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
          component="form"
          sx={{
            maxWidth: 300,
            display: "flex",
            flexDirection: "column",
            p: 3,
            gap: 4,
            position: "relative",
          }}
        >
          <Font family="brother" variant="h4" align="center">
            Ingrese los datos del Usuario
          </Font>
          <TextField placeholder="Ingrese el correo o la cédula" InputProps={{ sx: { fontFamily: "Lato, sans-serif" } }} />
          <Button
            variant="contained"
            size="large"
            onClick={() => setOpenCard(false)}
            sx={{
              textTransform: "unset",
              fontFamily: "Lato, sans-serif",
              borderRadius: "15px",
            }}
            fullWidth
          >
            Recargar
          </Button>
        </Paper>
      </Modal>
      <Font family="brother" variant="h4" align="center" sx={{ maxWidth: 240, margin: "auto" }}>
        Recarga de créditos a usuario
      </Font>
      <Box
        sx={{
          my: 10,
          mx: "auto",
          display: "flex",
          justifyContent: "space-evenly",
          gap: 2,
          maxWidth: 800,
          flexFlow: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Font family="brother" color="primary" variant="h4" gutterBottom>
            Cantidad
          </Font>
          <Box
            sx={{
              display: "flex",
              alignItems: "ceter",
              gap: 4,
            }}
          >
            <Button
              sx={{
                fontSize: "2rem",
                borderRadius: "50%",
                bgcolor: "white",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                alignSelf: "center",
              }}
              color="secondary"
              onClick={() => updateQuantity(-1)}
            >
              -1
            </Button>
            <Box
              sx={{
                borderRadius: "10px",
                p: "10px 40px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
              }}
            >
              <Font family="brother" variant="h2">
                {quantity}
              </Font>
            </Box>
            <Button
              sx={{
                fontSize: "2rem",
                borderRadius: "50%",
                bgcolor: "white",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                alignSelf: "center",
              }}
              color="secondary"
              onClick={() => updateQuantity(1)}
            >
              +1
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Font family="brother" color="primary" variant="h4">
            Total:
          </Font>
          <Font family="brother" color="secondary" variant="h1">
            {quantity * 1 + (!registered || !card ? 5 : 0)} $
          </Font>
        </Box>
      </Box>
      <Box sx={{ maxWidth: 600, m: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Font family="brightsight" variant="h4">
            Creditos
          </Font>
          <Font family="brightsight" variant="h4">
            {quantity} $
          </Font>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Font family="brightsight" variant="h4">
            Fee
          </Font>
          <Font family="brightsight" variant="h4">
            {quantity * 0} $
          </Font>
        </Box>
        {(!registered || !card) && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Font family="brightsight" variant="h4">
              Tarjeta
            </Font>
            <Font family="brightsight" variant="h4">
              5 $
            </Font>
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Font family="brightsight" variant="h4">
            Total
          </Font>
          <Font family="brightsight" variant="h4">
            {quantity * 1 + (!card ? 5 : 0)} $
          </Font>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          sx={{
            textTransform: "unset",
            fontFamily: "Lato, sans-serif",
            borderRadius: "15px",
            width: 310,
          }}
          size="large"
          variant="contained"
          onClick={handleOpenStepper}
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({ req, res, resolvedUrl }) {
  console.log({ resolvedUrl });
  const cookie = req.session.admin;
  if (!cookie) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  const route = resolvedUrl.split("/")[2];

  const { user, token, isLoggedIn } = cookie;

  const { status, response } = await userServices.getDolarPrice();

  return {
    props: {
      user: { ...user, token, isLoggedIn },
      route,
      price: response.price,
      url: process.env.NEXT_PUBLIC_API_URL
    },
  };
}, session.admin);

Recarga.getLayout = function getLayout(page) {
  return <Layout user={page.props.user}>{page}</Layout>;
};
