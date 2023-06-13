import { Fragment, useState, useEffect } from "react";
import { Grid, Typography, IconButton, styled, Box, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useForm } from "react-hook-form";
import { withIronSessionSsr } from "iron-session/next";
import { Button, Modal, Link, Spinner } from "../src/components/atoms";
import { TextField, Footer, Navbar } from "../src/components/molecules";
import { ArrowIcon, CheckIcon, DangerIcon } from "../src/components/icons";
import { useRouter } from "next/router";
import { userServices } from "../src/services";
import { session } from "../lib/session";
import PaymentIframe from "../src/components/atoms/PaymentIframe";

export default function PaymentMethod({ amount, token, user, fee, price }) {
  const [isOpen, setIsOpen] = useState(false);
  const [method, setMethod] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [validating, setValidating] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    txId: "",
  });

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
    <Grid container sx={{ backgroundColor: "#FBFBFB" }} justifyContent="center">
      <Spinner loading={isLoading} />
      <Navbar />
      
      <Grid
        item
        container
        // xs={9}
        // md={12}
        sx={{ height: "fit-contend", zIndex: 2, margin: 0, minHeight: "calc(100vh - 580px)" }}
        spacing={2}
      >
        <Grid item xs={12} sx={{ padding: 0, marginTop: "5%",display: "flex", alignItems: "center", justifyContent: "center"}}>
          <Typography
            sx={{
              fontWeight: "500",
              color: "#040F23",
              textAlign: "center",
              fontSize: "2rem",
              fontStyle: "normal",
              width: "300px",
              fontFamily: "Raleway",
            }}
            component={"h1"}
            variant="h5"
          >
            Selecciona tu método de pago
          </Typography>
        </Grid>
        <Grid item xs={12} container justifyContent="center" alignItems={"center"} sx={{ padding: 0, gap: 2, paddingBottom: "50px", marginTop: "40px"}}>
          <StyledIconButton 
            sx={{height: "90px", width: "99px" }}
            onClick={() => {
              onSelectMethod("bss");
              setTransferTo("");
            }}
          >
            <Grid component={"img"} src="/bs.svg" alt="bolivares" />
          </StyledIconButton>
          <StyledIconButton
            sx={{height: "90px", width: "99px" }}
            onClick={() => {
              onSelectMethod("cash");
              setTransferTo("");
            }}
          >
            <Grid component={"img"} src="/cash.svg" alt="Cash" />
          </StyledIconButton>
          <StyledIconButton
            sx={{height: "90px", width: "99px" }}
            onClick={() => {
              onSelectMethod("zelle");
              setTransferTo("Sunset@home.com");
            }}
          >
            <Grid component={"img"} src="/zelle.svg" alt="Cash" />
          </StyledIconButton>
          {/*<StyledIconButton
						onClick={() => {
							onSelectMethod("reserve");
							setTransferTo("Sunset");
						}}
					>
						<Grid component={"img"} src="/rsv.svg" alt="Cash" />
					</StyledIconButton>*/}
        </Grid>
      </Grid>

      <Grid style={{ display: isOpen ? "block" : "none" }}>
        {!validating ? (
          <>
            
            <Grid component={"form"} onSubmit={handleSubmit(onSubmit)} sx={{ zIndex: 0, margin: { xs: "40px 0 10px 0" }, width: {xs:"400px", sm: "572px"}, backgroundColor: "#F5F5F5" }} container spacing={2}  alignItems="center" justifyContent="center">
              {(() => {
                switch (method) {
                  case "zelle":
                    return (
                      <Fragment>
                        <Grid item xs={12} md={12} style={{ padding: 0 }}>
                          <Accordion sx={{backgroundColor: "#F3F3F3", borderRadius: "5px 5px 0px 0px"}} >
                              <AccordionSummary  >
                              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                  <ArrowIcon />
                              </div>
                              
                              </AccordionSummary>
                              <AccordionDetails>
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
                                  back9example@gmail.com
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
                                  Back9
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          <br />
                        </Grid>

                        <Grid container justifyContent="center" alignItems="center" item style={{  padding: "20px 50px 20px 80px"}}>
                          <Grid item xs={12} md={6}>
                            <Typography
                              sx={{
                                color: "#C4C4C4",
                                fontWeight: "700",
                                textAlign: "left",
                                fontFamily: "Lato, sans-serif",
                                marginBottom: "6px",
                              }}
                            >
                              Usuario a depositar
                            </Typography>
                            <Typography
                              sx={{
                                color: "#0E1727",
                                fontWeight: "700",
                                textAlign: "left",
                                fontFamily: "Lato, sans-serif",
                                marginBottom: "6px",
                              }}
                            >
                              Back9
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Typography
                              sx={{
                                color: "#B0B0B0",
                                fontWeight: "700",
                                textAlign: "left",
                                fontSize: "0.813rem",
                                fontFamily: "Lato, sans-serif",
                                marginBottom: "10px"
                              }}
                            >
                              Nro° de referencia
                            </Typography>
                          <TextField
                            sx={{ color: "#585858", fontWeight: "700", fontSize:"12px"}}
                            placeholder="Ejemplo: x850jrm"
                            inputRef={register("txId", {
                              required: "Debes ingresar el código de la transaccion",
                            })}
                            type="text"
                            error={errors.txId ? true : false}
                            helperText={errors.txId ? errors.txId.message : ""}
                          />
                        </Grid>
                        </Grid>
                      </Fragment>
                    );
                  case "reserve":
                    return (
                      <Fragment>
                        <Grid item xs={12} md={12}>
                          
                          <Typography
                            sx={{
                              color: "#C4C4C4",
                              fontWeight: "700",
                              textAlign: "left",
                              fontSize: "0.813rem",
                              fontFamily: "Lato, sans-serif",
                            }}
                          >
                            Usuario a depositar
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
                            SUNSETROLL
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
                  case "bss":
                    return (
                      <Fragment>
                        {/* importante <PaymentIframe currency={'VES'} reserveToken={} /> */}
                        <Grid item xs={12} md={12} style={{ padding: 0 }}>
                        <Accordion sx={{backgroundColor: "#F3F3F3", borderRadius: "5px 5px 0px 0px"}} >
                            <AccordionSummary  >
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <ArrowIcon />
                            </div>
                            
                            </AccordionSummary>
                            <AccordionDetails>
                            <Grid item xs={12} md={12}>
                              <Typography
                              sx={{
                                color: "#fe4740",
                                fontWeight: "700",
                                textAlign: "left",
                                fontFamily: "Lato, sans-serif",
                              }}>
                              Datos de la Cuenta a Debitar:
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
                            0424-8106014
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
                            BANCAMIGA

                          </Typography>
                          </Grid>
                            </AccordionDetails>
                          </Accordion>
                          
                          
                        </Grid>
             
                        <Grid container justifyContent="center" alignItems="center" item style={{  padding: "20px 50px 20px 80px"}}>
                          <Grid item xs={12} md={6}>
                            <Typography
                              sx={{
                                color: "#C4C4C4",
                                fontWeight: "700",
                                textAlign: "left",
                                fontFamily: "Lato, sans-serif",
                                marginBottom: "6px",
                              }}
                            >
                              Usuario a depositar
                            </Typography>
                            <Typography
                              sx={{
                                color: "#0E1727",
                                fontWeight: "700",
                                textAlign: "left",
                                fontFamily: "Lato, sans-serif",
                                marginBottom: "6px",
                              }}
                            >
                              Back9
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography
                              sx={{
                                color: "#B0B0B0",
                                fontWeight: "700",
                                textAlign: "left",
                                fontSize: "0.813rem",
                                fontFamily: "Lato, sans-serif",
                                marginBottom: "10px"
                              }}
                            >
                              Nro° de referencia
                            </Typography>
                            <TextField
                              sx={{ color: "#585858", fontWeight: "700", fontSize:"12px" }}
                              placeholder="Ingresa el numero de transacción"
                              inputRef={register("txId", {
                                required: "Debes ingresar el codigo de la transaccion",
                              })}
                              type="text"
                              error={errors.txId ? true : false}
                              helperText={errors.txId ? errors.txId.message : ""}
                            />
                          
                          </Grid>
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
                            Para completar el proceso de su pago debe dirigirse al stand oficial del Fast Pass el día del evento.
                            <br /> <br />
                          </Typography>
                        </Grid>
                      </Fragment>
                    );
                  default:
                    return null;
                }
              })()}
              <Fragment>
                {method === "bss" && (
                  <Grid item xs={12} md={12} style={{ padding: "0px 50px 20px 80px"}}>
                  
                    <Typography
                      sx={{
                        color: "#0E1727",
                        fontWeight: "700",
                        textAlign: "left",
                        fontSize: "2rem",
                        fontFamily: "Lato, sans-serif",
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
                          fontFamily: "Lato, sans-serif",
                        }}
                      >
                        Bs {price}
                      </Typography>
                    </Typography>
                  </Grid>
                )}
                <Grid container item style={{ padding: "0px 50px 40px 80px"}}>

                  <Grid item xs={12} md={6}>
                    <Typography
                      sx={{
                        color: "#0E1727",
                        fontWeight: "700",
                        textAlign: "center",
                        fontSize: "1rem",
                        fontStyle:"normal",
                        fontFamily: "Gotham, sans-serif",
                        display: "flex",
                        justifyContent: {md:"space-between", xs:"center"},
                        alignItems: {md:"baseline", xs:"center"},
                      }}
                     >
                      Monto total:  {" "}
                      </Typography>
                      <Typography
                      component={"span"}
                      sx={{
                        color: "#0E1727",
                        fontWeight: "700",
                        fontSize: "2.5rem",
                        textAlign: "center",
                        fontFamily: "Gotham, sans-serif",
                        display: "flex",
                        justifyContent: {md:"space-between", xs:"center"},
                        alignItems: {md:"baseline", xs:"center"},
                      }}
                    > $ 10.50
                     {/*  { method !== "bss"
                        ? parseFloat(parseInt(amount) + (user.wallet ? 0 : 5) + amount * parseFloat(fee).toFixed(2)).toFixed(2) + " $"
                        : "Bs " + parseFloat((parseInt(amount) + (user.wallet ? 0 : 5) + amount * parseFloat(fee).toFixed(2)) * price).toFixed(2)}  */}
                    </Typography> 
                  </Grid>
                  <Grid  item xs={12} md={6} sx={{ display: "flex",
                        justifyContent: {md:"space-between", xs:"center"},
                        alignItems: "center",}}>
                      <Button type="submit" sx={{width: "200px"}}>
                        Continuar
                      </Button>
                    
                  </Grid> 
                </Grid>

                
              </Fragment>
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
      </Grid>
      <Grid item md={12} xs={12} container
        sx={{
          position: "relative",
          height: 200,
          alignItems: "flex-end",
          backgroundColor: "transparent",
        }}
      >
        
      </Grid>
      <Footer logoSx={{ bottom: { xs: "4%", md: "5%" } }} />
    </Grid>
  );
}

const StyledIconButton = styled(IconButton)((theme) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#FFFFFF",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
  width: 100,
  height: 125,
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

/* export const getServerSideProps = withIronSessionSsr(async function ({ req, res, query: { amount } }) {
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
    },
  };
}, session.user);  */
