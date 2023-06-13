import { useState } from "react";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Font } from "../../src/components/atoms";
import { Layout } from "../../src/components/molecules";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/logo.svg";
import Avatar from "@mui/icons-material/AccountCircle";
import { LogoutIcon } from "../../src/components/icons";
import { userServices } from "../../src/services";
import { session } from "../../lib/session";
import { withIronSessionSsr } from "iron-session/next";
import { CameraIcon } from "../../src/components/icons";
import dynamic from "next/dynamic";

const QrReader = dynamic(
  () => import("react-qr-reader").then((module) => module.QrReader),
  { ssr: false }
);

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

export default function Registro() {
  const [scanner, setScanner] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [quantity, setQuantity] = useState(10);

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
    if (quantity + operation >= 10) {
      setQuantity(quantity + operation);
    }
  };

  return (
    <Box component="main" sx={{ py: 6, px: 5, maxWidth: 1200, m: "auto" }}>
      <Font
        family="brother"
        variant="h4"
        align="center"
        sx={{ maxWidth: 240, margin: "auto" }}
      >
        Registro de créditos a usuario
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
              onClick={() => updateQuantity(-10)}
            >
              -10
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
              onClick={() => updateQuantity(10)}
            >
              +10
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
            {quantity * 1.05} $
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
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
  resolvedUrl,
}) {
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

  return {
    props: {
      user: { ...user, token, isLoggedIn },
      route,
    },
  };
},
session.admin);

Registro.getLayout = function getLayout(page) {
  return <Layout user={page.props.user}>{page}</Layout>;
};
