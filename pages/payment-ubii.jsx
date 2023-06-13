import { Fragment, useState, useEffect, useRef } from "react";
import { Grid, Typography, IconButton, styled, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { withIronSessionSsr } from "iron-session/next";
import { Button, Modal, Link, Spinner } from "../src/components/atoms";
import { TextField, Footer } from "../src/components/molecules";
import { CheckIcon, DangerIcon } from "../src/components/icons";
import { useRouter } from "next/router";
import { userServices } from "../src/services";
import { session } from "../lib/session";

export default function PaymentMethod({ amount, token, user, fee, price, url }) {
  const [isOpen, setIsOpen] = useState(false);
  const [method, setMethod] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [validating, setValidating] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isOrderProcessed, setIsOrderProcessed] = useState(false)
  const router = useRouter();
  const botonRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    txId: "",
  });
  useEffect(() => {
    window.addEventListener("message", getMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function getMessage(e) {
    const data = e.data;
    console.log(data)
    if (data.type === "response") {
        if(data.status===200) { 
          if(!isOrderProcessed){
            setIsOrderProcessed(true)
            orderUbii(data.response)
          }
          
        } else {
          setMessage(data.response.codS);
          setError(true);
          setValidating(true);
        }
    }
  }
  const orderUbii = async (data) => {
    try {
      setIsLoading(true);
      const { status, response } = await userServices.addOrderUbii({
        token,
        credits: parseInt(amount),
        payment: {
          type: data.method,
          ref: data.trace
        },
      });
      setIsLoading(false);
      if (status === 200) {
        setMessage("Pago procesado");
        setError(false);
        setValidating(true);
      } else if (status === 400) {
        if (response.error) {
          setMessage(response.error.message);
          setError(true);
          setValidating(true);
        }
      }
    } catch (e) {
      setIsLoading(false);
      setValidating(false);
    }
  };
  const onSubmit = async (data) => {
    //consumir endpoint

    try {
      setIsLoading(true);
      const { status, response } = await userServices.addOrder({
        token,
        credits: parseInt(amount),
        payment: {
          type: method,
          ref: method === "cash" ? null : data.txId,
        },
      });
      setIsLoading(false);
      if (status === 200) {
        setMessage("Estamos validando tu pago, esto tomara un par de minutos.");
        setError(false);
        setValidating(true);
      } else if (status === 400) {
        if (response.error) {
          setMessage(response.error.message);
          setError(true);
          setValidating(true);
        }
      }
    } catch (e) {
      setIsLoading(false);
      setValidating(false);
    }
  };

  const onSelectMethod = async (method) => {
    setMethod(method);
    setIsOpen(true);
  };

  return (
    <Grid container sx={{ backgroundColor: "#000" }} justifyContent="center">
      <Button
        id="botonpago"
        // className={classes.button1}
        ref={botonRef}
        style={{ visibility: "hidden" }}
      />
      <Spinner loading={isLoading} />
      <Grid item md={12} xs={10} container sx={{ padding: "35px 0 0 0", boxSizing: "content-box", zIndex: 1 }}>
        <Link href="/profile" sx={{ justifyContent: "center" }}>
          <Grid component={"img"} src="/logo-2.svg" alt="Cusica" sx={{ width: "70px" }} />
        </Link>
      </Grid>
      <Grid
        item
        container
        sx={{ height: "fit-contend", zIndex: 2, margin: 0, minHeight: "calc(100vh - 580px)" }}
        spacing={2}
      >
        <Grid item xs={12} sx={{ padding: 0 }}>
          <Typography
            sx={{
              fontWeight: "700",
              color: "#fff",
              textAlign: "center",
              fontSize: "2.5rem",
            }}
            component={"h1"}
            variant="h5"
          >
            Selecciona tu método de pago
          </Typography>
        </Grid>
        <Grid item xs={12} container justifyContent="center" alignItems={"center"} sx={{ padding: 0, gap: 2 }}>
          
          
            <StyledIconButton 
            onClick={() => {
              onSelectMethod("ubii");
              setTransferTo("");
            }}> 
              <Grid component={"img"} src="/ubii.png" alt="Cash" width={"100px"} />
            </StyledIconButton>
          <StyledIconButton
            onClick={() => {
              onSelectMethod("zelle");
              setTransferTo("Sunset@home.com");
            }}
          >
            <Grid component={"img"} src="/zelle.svg" alt="Cash" />
          </StyledIconButton>
          <StyledIconButton
            onClick={() => {
              onSelectMethod("cash");
              setTransferTo("");
            }}
          >
            <Grid component={"img"} src="/cash.svg" alt="Cash" />
          </StyledIconButton>
        </Grid>
      </Grid>
      <Grid
        item
        md={12}
        xs={12}
        container
        sx={{
          position: "relative",
          height: 450,
          alignItems: "flex-end",
          backgroundColor: "#000",
        }}
      >
        <Footer logoSx={{ bottom: { xs: "4%", md: "5%" } }} />
      </Grid>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        {!validating ? (
          <>
            <Grid container sx={{ gap: 2 }} justifyContent="center">
              <Box>
                <Typography align="center">Pago Móvil</Typography>
                <StyledMiniIconButton
                  sx={{ opacity: method === "ubii" ? 1 : 0.4 }}
                  onClick={() => {
                    onSelectMethod("ubii");
                    setTransferTo("");
                  }}
                >
                  <Grid component={"img"} src="/ubii.png" alt="Cash" width={"50px"} />
                </StyledMiniIconButton>
              </Box>
              <Box>
                <Typography align="center">Zelle</Typography>
                <StyledMiniIconButton
                  sx={{ opacity: method === "zelle" ? 1 : 0.4 }}
                  onClick={() => {
                    onSelectMethod("zelle");
                    setTransferTo("Sunset@home.com");
                  }}
                >
                  <Grid component={"img"} src="/zelle.svg" width={"70%"} alt="Cash" />
                </StyledMiniIconButton>
              </Box>
              <Box>
                <Typography align="center">Cash</Typography>
                <StyledMiniIconButton
                  sx={{ opacity: method === "cash" ? 1 : 0.4 }}
                  onClick={() => {
                    onSelectMethod("cash");
                    setTransferTo("");
                  }}
                >
                  <Grid component={"img"} src="/cash.svg" width={"70%"} alt="Cash" />
                </StyledMiniIconButton>
              </Box>
            </Grid>
            <Grid component={"form"} onSubmit={handleSubmit(onSubmit)} sx={{ zIndex: 0, margin: { xs: "40px 0 10px 0" }, width: "100%" }} container spacing={2} justifyContent="center">
              {(() => {
                switch (method) {
                  case "zelle":
                    return (
                      <Fragment>
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
                            pagoscusica@gmail.com
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
                            Cusica
                          </Typography>
                          <br />
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
                            inputRef={register("txId", {
                              required: "Debes ingresar el código de la transaccion",
                            })}
                            type="text"
                            error={errors.txId ? true : false}
                            helperText={errors.txId ? errors.txId.message : ""}
                          />
                        </Grid>
                      </Fragment>
                    );
                  case "cash":
                    return (
                      <Fragment>
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
                            Dirígite a las instalaciones de Cusica Studios para completar tu transacción. <br /> <br />
                            Tienes hasta 24H antes del evento para completar tu pago.
                            <br /> <br />
                          </Typography>
                        </Grid>
                      </Fragment>

                    );
                    case "ubii":
                      return (
                        <Fragment>
                          <Grid item xs={12} md={12}>
                          <iframe
                            style={{ border: 0 }}
                            src={`${url}/view/ubii?amount=${parseFloat(parseInt(amount) + (user.wallet ? 0 : 0) + amount * parseFloat(fee).toFixed(2)).toFixed(2)}&bss=${parseFloat((parseInt(amount) + (user.wallet ? 0 : 0) + amount * parseFloat(fee).toFixed(2)) * price).toFixed(2)}`}
                            title="Payment Luka Pay"
                            width="100%"
                            height="150px"
                          />
                          </Grid>
                        </Fragment>
                        
                      );
                  default:
                    return null;
                }
              })()}
              {method!="ubii"&&<Fragment>
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
                    Total:{" "}
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
                      {parseFloat(parseInt(amount) + (user.wallet ? 0 : 0) + amount * parseFloat(fee).toFixed(2)).toFixed(2) + " $"}
                    </Typography>
                  </Typography>
                </Grid>

                <Grid item xs={12} md={12}>
                  <Button type="submit" fullWidth> Continuar </Button>
                  
                </Grid>
              </Fragment>}
            </Grid>
          </>
        ) : (
          <>
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
              onClick={() => {
                setIsOpen(false);
                router.push("/profile");
              }}
              fullWidth
            >
              Continuar
            </Button>
          </>
        )}
      </Modal>
    </Grid>
  );
}

const StyledIconButton = styled(IconButton)((theme) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#FFFFFF",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
  width: "100px !important",
  height: "125px !important",
  borderRadius: 10,
  "&:hover": {
    background: "#FFFFFF",
  },
}));

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

export const getServerSideProps = withIronSessionSsr(async function ({ req, res, query: { amount } }) {
  const cookie = req.session.user;
  if (!cookie || !amount) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { user, token, isLoggedIn } = req.session.user;
  const { status, response } = await userServices.getDolarPrice();
  return {
    props: {
      amount,
      token,
      user,
      fee: 0,
      price: response.price,
      url: process.env.NEXT_PUBLIC_API_URL
    },
  };
}, session.user);
