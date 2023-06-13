import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { withIronSessionSsr } from "iron-session/next"
import QRCode from "react-qr-code"
import { Box, Grid, Typography, Button as MuiButton } from "@mui/material"
import { Button } from "../src/components/atoms"
import { Footer, Navbar } from "../src/components/molecules"
import { Eye } from "../src/components/icons"
import { session } from "../lib/session"
import { userServices } from "../src/services"
import useUser from "../lib/useUser"
import Transactions from "./transactions"

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from "@mui/system"
const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: '1rem',
    maxWidth: '32rem',
  },
});
export default function Index({ user, token, isLoggedIn, balance, wallet, unPaidBalance }) {
  const router = useRouter()
  const [showPin, setShowPin] = useState(false)
  const { mutateUser } = useUser()

    useEffect(() => {
    async function mutar() {
      if (wallet) {
        await mutateUser(
          await userServices.updateWallet({
            cookie: {
              user: {
                ...user,
                wallet: wallet
              },
              token,
              isLoggedIn
            }
          })
        )
      }
    }
    mutar()
  }, [wallet])

  const logout = async () => {
    await userServices.logout({ role: "user" })
    router.push("/login")
  }

  const [open, setOpen] = React.useState(true);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(!open);
  };

  //const [mounted, setMounted] = useState(false)
  
  return (
    <Grid container sx={{ backgroundColor: "#F5F5F5", justifyContent: "center" }}>
      <Navbar/>
      <Grid container justifyContent="center" alignItems="flex-start" direction="row-reverse"rowSpacing={10} columnSpacing={20} sx={{marginTop:"5%"}} >
        
          
        <Grid  item>
          <Typography
          sx={{
            color: "#0E1727",
            fontWeight: "500",
            textAlign: "center",
            fontSize: "1.5rem",
            fontFamily: "Raleway, sans-serif",
            marginBottom: "30px"
            }}
          >
             Mi Saldo
          </Typography>
          <Grid 
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#0E1727",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                  borderRadius: "10px",
                  paddingTop: "5px",
                  
                  marginRight: "20px",
                  marginBottom:"30px",
                  padding: "7px 20px",
                  width: "100%",
                  height: "95px",
                }}
              >
                <Typography sx={{ fontWeight: "500", fontSize: "48px", fontFamily: "Gotham", textAlign: "center", color: "#FFF" }}>$ 59,99</Typography>
              </Grid>
              <Grid
            sx={{
              gap: 2,
              padding: { xs: "0 20px" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              fullWidth
              onClick={() => router.push("/credits")}
              
            >
              Recarga tus créditos
            </Button>
            </Grid>
        </Grid>
        <Grid item>
            <Typography
              sx={{
                color: "#0E1727",
                fontWeight: "500",
                textAlign: "left",
                fontSize: "1.5rem",
                fontFamily: "Raleway, sans-serif",
                marginBottom: "10px"
                }}
              >
                Mis transacciones
              </Typography>
          
          <Grid item sx={{width:"670px"}} >
            <Transactions/>
          </Grid>
        </Grid>
      </Grid>
      
     
      <Grid
        item
        md={12}
        xs={12}
        container
        sx={{ position: "relative", height: 250, alignItems: "flex-end", backgroundColor: "transparent" }}
      >
        {/*<Grid
					component={"img"}
					src="/cloud-4.svg"
					alt="Cusica"
					style={{ width: { xs: "70%" }, zIndex: 1, position: "absolute", bottom: "52%", left: 0 }}
					/>*/}
        <Footer logoSx={{ bottom: { xs: "5%", md: "8%" } }} />
      </Grid>
    </Grid>
  )
}

/* export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
  const cookie = req.session.user
  console.log("res");
  console.log(res);

  if (!cookie) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    }
  } 

  const { user, token, isLoggedIn } = cookie 
  const { status, response } = await userServices.getBalance({ id: user._id })
  // console.log(response)
  return {
    props: {
      user: {
        ...user
      },
      token,
      isLoggedIn,
      balance: response.balance,
      wallet: response.wallet || null,
      unPaidBalance: response.unPaidBalance
    }
  }

}, session.user)

Index.getUser = function getLayout(page) {
  return null 
  //return page.props.user;
}  
 */
