import { useState, Fragment } from "react";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { Grid, Typography, Box, IconButton, Divider, Tooltip, ClickAwayListener } from "@mui/material";
import { Button, Link } from "../src/components/atoms";
import { Footer, Navbar } from "../src/components/molecules";
import { session } from "../lib/session";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Checkbox from "@mui/material/Checkbox";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";


export default function Credits({ user, fee }) {
  const [credits, setCredits] = useState(0);
  const [isSelect, setIsSelect] = useState(false);
  const router = useRouter();
  const [toolTipCard, setToolTipCard] = useState(false);
  const [toolTipFee, setToolTipFee] = useState(false);
  const [toolTipTyc, setToolTipTyc] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <Grid container sx={{ backgroundColor: "#F5F5F5", justifyContent: "center" }}>
      <Navbar />

      {/* <Grid item xs={12} sm={12} md={12} container justifyContent="center" sx={{ zIndex: 1, margin: 0, width: "100%", minHeight: "calc(100vh - 380px)" }}> */}
        <Grid container  justifyContent="center" alignItems="center"rowSpacing={10} columnSpacing={20} sx={{ marginTop:"10%", marginBottom: "10%" }}>
          <Grid item direction="column"sx={{ padding: 0}} >
            <Typography sx={{ fontWeight: "700", color: "#0E1727", textAlign: "center", fontSize: "1.5rem" }} component={"h1"} variant="h5">
              Compra de Créditos
            </Typography>
            <Typography
              sx={{
                fontStyle: "normal",
                fontWeight: "700",
                fontSize: "1.25rem",
                textAlign: "center",
                color: "#BDBDBD",
              }}
            >
              Selecciona la cantidad
            </Typography>
          
            <Grid item md={12} xs={12} container justifyContent="center" alignItems={"center"} sx={{ paddingTop: "35px" }}>
              <IconButton onClick={() => setCredits(credits - 1)} disabled={credits === 0}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "transparent ",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    paddingTop: "5px",
                    padding: "7px",
                    border: "5px solid #0E1727 ",
                  }}
                >
                  <Typography sx={{ fontStyle: "normal", fontWeight: "700", fontSize: "2rem", textAlign: "center", color: "#0E1727" }}>-</Typography>
                </Box>
              </IconButton>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#0E1727",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                  borderRadius: "10px",
                  paddingTop: "5px",
                  marginLeft: "20px",
                  marginRight: "20px",
                  padding: "7px",
                  width: "145px",
                  height: "95px",
                }}
              >
                <Typography sx={{ fontFamily: "Gotham", fontStyle: "normal", fontWeight: "500", fontSize: "48px", textAlign: "center", color: "#FFF" }}>{credits}</Typography>
              </Box>
              <IconButton onClick={() => setCredits(credits + 1)}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "transparent",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    paddingTop: "5px",
                    padding: "7px",
                    border: "5px solid #0E1727",
                  }}
                >
                  <Typography sx={{ fontStyle: "normal", fontWeight: "700", fontSize: "2rem", textAlign: "center", color: "#0E1727" }}>+</Typography>
                </Box>
              </IconButton>
            </Grid>
          </Grid>
          <Grid item  sx={{ padding: 0}} >
            <Grid item container justifyContent={"center"} alignItems="center" spacing={2} 
              sx={{
                backgroundColor: "#E2E2E2",
                borderRadius: "20px",
                width: "394px",
                height: "322px",
                padding: 0,

              }}>
                <Grid item md={12} sm={12} xs={12} sx={{ padding: "0px 5px" }} justifyContent="space-between" alignItems={"center"}>
                  <Typography
                      component={"span"}
                      sx={{
                        fontStyle: "normal",
                        fontFamily: "Raleway",
                        fontWeight: "500",
                        fontSize: "1.5rem",
                        textAlign: "center",
                        color: "#0E1727",
                      }}
                    >
                      Resumen de pago
                    </Typography>
                </Grid>
              <Grid item  md={12} sm={12} xs={12} style={{ paddingLeft: 0 }} sx={{ padding: "0px 5zpx" }} container justifyContent="space-between" alignItems={"center"}>
                <Grid item xs={12} md={12} container justifyContent="space-between" sx={{backgroundColor: "#D8D8D8", padding:"10px 30px"}}>
                  <Typography sx={{ fontWeight: "400", color: "#0E1727", fontSize: "1rem", fontFamily: "Lato, sans-serif" }}>Créditos</Typography>
                  <Typography sx={{ fontWeight: "400", color: "#0E1727", fontSize: "1rem", fontFamily: "Lato, sans-serif" }}>${credits}</Typography>
                </Grid>

                <Grid item xs={12} md={12} container justifyContent="space-between" sx={{padding: "10px 30px"}}>
                  <Typography sx={{ fontWeight: "400", color: "#0E1727", fontSize: "1rem", fontFamily: "Lato, sans-serif" }}>
                    Comisión Fee 5% {" "}
    
                  </Typography>
                  <Typography sx={{ fontWeight: "400", color: "#0E1727", fontSize: "1rem", fontFamily: "Lato, sans-serif" }}>${(credits*0.05).toFixed(2)}</Typography>
                </Grid>

                <Grid item xs={12} md={12} container justifyContent="space-between" sx={{backgroundColor: "#D8D8D8", padding:"10px 30px"}}>
                  <Typography
                    component={"span"}
                    sx={{
                      fontStyle: "normal",
                      fontWeight: "400",
                      fontSize: "1.2rem",
                      fontFamily: "Lato, sans-serif",
                      textAlign: "center",
                      color: "#0E1727",
                    }}
                  >
                    Total
                  </Typography>
                  <Typography
                    component={"span"}
                    sx={{
                      fontStyle: "normal",
                      fontWeight: "700",
                      fontFamily: "Lato, sans-serif",
                      fontSize: "1.2rem",
                      textAlign: "center",
                      color: "#0E1727",
                    }}
                  >
                    
                  ${credits+credits*0.05}
                  </Typography>
                </Grid>
              
                <Grid item xs={12} md={12} container justifyContent="center" mt={2}>
                  <Button
                    disabled={credits === 0  || credits < 1}
                    onClick={() =>
                      router.push({
                        pathname: "/payment-methods",
                        query: { amount: credits },
                      })
                    }
                    sx={{ fontSize: "1.125rem", width: "200px",padding: "10px" , marginBottom: "30px", "&[disabled]": { backgroundColor: "white", borderColor: "gray" } }}
                  >
                    Continuar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      {/* </Grid> */}
      <Grid container item md={12} xs={12} sx={{ position: "relative", height: { xs: 450, md: 220 }, alignItems: "flex-end" }}>
        <Footer logoSx={{ bottom: { xs: "3%", md: "8%" } }} />
      </Grid>
    </Grid>
    
  );
}

/* export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
  //return {
  //	redirect: {
  //		destination: "/profile",
  //		permanent: false,
  //	},
  //};

  const cookie = req.session.user;

  if (!cookie) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { user, token, isLoggedIn } = cookie;

  return {
    props: {
      user: {
        ...user,
        token,
        isLoggedIn,
      },
      fee: 0,
    },
  };
}, session.user); */
