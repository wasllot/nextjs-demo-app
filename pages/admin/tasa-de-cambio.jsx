import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  Typography,
  AppBar,
  Toolbar,
  List,
  ListItem,
  Link as MuiLink,
  SvgIcon,
  Modal,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Font } from "../../src/components/atoms";
import { Layout, TextField } from "../../src/components/molecules";
import { Button } from "../../src/components/atoms";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/logo.svg";
import Avatar from "@mui/icons-material/AccountCircle";
import { LogoutIcon } from "../../src/components/icons";
import { userServices, adminServices } from "../../src/services";
import { useRouter } from "next/router";
import { session } from "../../lib/session";
import { withIronSessionSsr } from "iron-session/next";
import { useForm } from "react-hook-form";

export default function TasaDeCambio({ user }) {
  const router = useRouter();
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [dollarPrice, setDollarPrice] = useState(0);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const getDollarPrice = async () => {
      try {
        const { status, response } = await adminServices.getDollarPrice();
        if (status === 200) {
          setDollarPrice(response.price);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    getDollarPrice();
  }, []);

  const updateDollarPrice = async ({ price }) => {
    try {
      const { status, response } = await adminServices.putDollarPrice({
        token: user.token,
        price,
      });
      if (status === 200) {
        setMessage("Precio actualizado con éxito");
        setDollarPrice(price);
      } else if (status === 400) {
        setMessage("Ha ocurrido un error");
      }
      console.log({ status });
    } catch (error) {
      console.log({ error });
    } finally {
      setOpenMessage(true);
      reset();
    }
  };

  return (
    <Box
      component="main"
      sx={{
        py: 6,
        px: 5,
        maxWidth: 1250,
        m: "auto",
        position: "relative",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <Modal
        open={openMessage}
        onClose={() => setOpenMessage(false)}
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
          <Font family="brother" variant="h3" align="center">
            {message}
          </Font>
          <Button
            variant="contained"
            size="large"
            sx={{ fontFamily: "Lato, sans-serif" }}
            onClick={() => setOpenMessage(false)}
          >
            Aceptar
          </Button>
        </Paper>
      </Modal>
      <Font family="brother" variant="h2" align="center">
        Tasa de Cambio
      </Font>
      <Box
        component="form"
        onSubmit={handleSubmit(updateDollarPrice)}
        sx={{
          maxWidth: 200,
          m: "30px auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          placeholder="Precio del dolar"
          name="price"
          inputRef={register("price", {
            required: "Ingresa un precio",
          })}
          error={errors.price ? true : false}
          helperText={errors.price?.message}
        />
        <Button type="submit" fullWidth>
          Guardar
        </Button>
      </Box>
      <Font
        family="brother"
        variant="h5"
        align="center"
        sx={{ position: "absolute", right: 0, top: 0 }}
      >
        <Font component="span" family="brother" variant="h5">
          Precio del dolar: {dollarPrice} Bs
        </Font>
      </Font>
    </Box>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const cookie = req.session.admin;
  if (!cookie) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const { user, token, isLoggedIn } = cookie;

  return {
    props: {
      user: { ...user, token, isLoggedIn },
    },
  };
},
session.admin);

TasaDeCambio.getLayout = function getLayout(page) {
  return <Layout user={page.props.user}>{page}</Layout>;
};
