import { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  Button,
  AppBar,
  Toolbar,
  List,
  ListItem,
  Link as MuiLink,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Font } from "../atoms";
import { Footer } from "../molecules";
import Image from "next/image";
import Link from "next/link";
import Avatar from "@mui/icons-material/AccountCircle";
import { LogoutIcon } from "../icons";
import { userServices } from "../../services";
import { useRouter } from "next/router";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;
const LINKS = (user) => {
  const commerce_name = user.commerce?.name.toLowerCase();
  return {
    admin: [
      { title: "Dashboard", href: "/admin/dashboard" },
      { title: "Ordenes", href: "/admin/ordenes" },
      { title: "Transacciones", href: "/admin/transacciones" },
      { title: "Recarga", href: "/admin/recarga" },
      { title: "Administradores", href: "/admin/administradores" },
      { title: "Usuarios", href: "/admin/usuarios" },
      { title: "Comercios", href: "/admin/comercios" },
      { title: "Tasa de Cambio", href: "/admin/tasa-de-cambio" },
      { title: "Metricas de Usuarios", href: "/admin/users-metrics" },
      { title: "Formas de Recaudacion", href: "/admin/formas-recaudacion" },
      { title: "Usuarios Internos", href: "/admin/usuarios-internos" },
    ],
    sub_admin: [
      { title: "Dashboard", href: "/admin/dashboard" },
      { title: "Recarga", href: "/admin/recarga" },
      { title: "Ordenes", href: "/admin/ordenes" },
      { title: "Transacciones", href: "/admin/transacciones" },
      //{ title: "Usuarios", href: "/admin/usuarios" },
      //{ title: "Comercios", href: "/admin/comercios" },
      //{ title: "Tasa de Cambio", href: "/admin/tasa-de-cambio" },
    ],
    commerce_admin: [
      { title: "Dashboard", href: `/commerce/${commerce_name}/dashboard` },
      { title: "Generar venta", href: `/commerce/${commerce_name}` },
      {
        title: "Transacciones",
        href: `/commerce/${commerce_name}/transactions`,
      },
      { title: "Productos", href: `/commerce/${commerce_name}/menu` },
      { title: "Configuración", href: `/commerce/${commerce_name}/users` },
    ],
    commerce_employee: [
      { title: "Generar orden", href: `/commerce/${commerce_name}` },
      {
        title: "Transacciones",
        href: `/commerce/${commerce_name}/transactions`,
      },
    ],
  };
};

export default function Layout({ children, route, user }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const logout = async () => {
    if (user.userRoll === "admin") {
      await userServices.logout({ role: "admin" });
      router.push("/admin");
    } else {
      await userServices.logout({ role: "commerce" });
      router.push("/commerce");
    }
  };

  useEffect(()=>{router.prefetch('/admin/recarga')},[])


  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          anchor="left"
          variant={matches ? "temporary" : "permanent"}
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              pt: 6,
            },
          }}
        >
          {/*<Image src={Logo} width={200} height={200} />*/}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Avatar sx={{ width: 46, height: 46, mr: 1 }} color="primary" />
            <Box>
              <Font family="lato" sx={{ fontWeight: 600 }}>
                {user.userRoll === "admin" || user.userRoll === "sub_admin"
                  ? "Administrador"
                  : user.commerce.name}
              </Font>
              <Font sx={{ color: "#C4C4C4" }} variant="body2">
                {user.userRoll === "admin"
                  ? "Super"
                  : user.userRoll === "commerce_admin"
                  ? "Administrador"
                  : "Usuario"}
              </Font>
            </Box>
          </Box>
          <List sx={{ marginInlineStart: 3 }}>
            {LINKS(user)[user.userRoll].map(({ title, href }, index) => (
              <ListItem sx={{ paddingBlockEnd: 0 }} key={index}>
                <Link href={href} passHref>
                  <MuiLink
                    sx={{
                      fontFamily: "Lato, sans-serif",
                      width: 160,
                      color: "#000",
                      p: "4px 20px",
                      borderRadius: 25,
                      ...(href === router.asPath && {
                        color: "#FFF",
                        bgcolor: "#D2D2D2",
                      }),
                    }}
                    underline="none"
                    onClick={() => setOpenDrawer(false)}
                  >
                    {title}
                  </MuiLink>
                </Link>
              </ListItem>
            ))}
            <ListItem>
              <Button
                // variant="button"
                sx={{
                  fontFamily: "Lato, sans-serif",
                  color: "#000",
                  p: "4px 20px",
                  ml: -3,
                  mt: 2,
                  textTransform: "unset",
                  fontSize: "1.1rem",
                }}
                onClick={logout}
                startIcon={<LogoutIcon />}
              >
                Salir
              </Button>
            </ListItem>
          </List>
        </Drawer>
      </Box>
      <Box sx={{ width: "100%", flex: 1, position: "relative" }}>
        <AppBar position="static" sx={{ bgcolor: "#0E1727" }}>
          <Toolbar>
            {matches && (
              <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
                <MenuIcon sx={{ fill: "#fff" }} />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        {children}
        <Footer />
      </Box>
    </Box>
  );
}
