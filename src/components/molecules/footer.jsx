import { Grid, Typography, styled, Box, Tooltip, ClickAwayListener } from "@mui/material";
import { useState, Fragment } from "react";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

export default function Footer({ position, logoSx }) {
  const [toolTipTyc, setToolTipTyc] = useState(false);

  return (
    <Grid
      container
      sx={{
        zIndex: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0E1727",
        overflow: "hidden",
        height: 190,
        bottom: 0,
        flexDirection: "column",
        textAlign: "center"
      }}
      alignItems="center"
    >
      <Grid
        component={"img"}
        src="/back-9-w.svg"
        alt="Back9"
        sx={[{ display: "flex",justifyContent: "center", alignItems: "center", zIndex: 2 }, { ...logoSx }]}
      />
      <Grid container spacing={2} justifyContent="center" gap={1}>
        <Grid item>
          <Facebook style={{ color: 'white' }}/>
        </Grid>
        <Grid item>
          <Twitter style={{ color: 'white' }} />
        </Grid>
        <Grid item>
          <Instagram style={{ color: 'white' }}/>
        </Grid>
        <Grid item>
          <LinkedIn style={{ color: 'white' }}/>
        </Grid>
      </Grid>
      <Typography
        sx={{
          fontFamily: "Raleway, sans-serif",
          position: "relative",
          zIndex: 2,
          color: "#FFF",
          fontSize: "1rem",
          mt: 2,
        }}
      >
        © 2023 Back9. Todos los derechos reservados.
        <br />
        <ClickAwayListener onClickAway={() => setToolTipTyc(false)}>
          <Tooltip
            PopperProps={{
              disablePortal: true,
            }}
            onClose={() => setToolTipTyc(false)}
            open={toolTipTyc}
            placement="top-start"
            disableFocusListener
            disableHoverListener
            disableTouchListener
            TransitionProps={{ style: { fontFamily: "Lato, sans-serif" } }}
            title={
              <Fragment>
                <Typography color="inherit">Términos y condiciones</Typography>
                <Box component={"p"} sx={{ width: "12rem", textAlign: "left" }}>
                  <p>- Las recargas hechas en tu cuenta Cusica FastPass son reembolsables.</p>
                  <p>- El costo de la emisión del plástico es de 5 dólares americanos, no es reembolsable, solo lo pagaras una vez.</p>
                  <p>- En caso de extraviar tu tarjeta, la misma no podrá volver a emitir, sin embargo contaras con tu código QR único en el perfil de tu cuenta en consumo.back9.com.ve</p>
                  <p>- Los créditos disponibles en tu cuenta Cusica FastPass son equivalentes al valor de la misma cantidad en USD.</p>
                  <p>- Back9 C.A y Cusica no se hacen responsables por el uso indebido del sistema.</p>
                  <p>- Back9 C.A y Cusica no se hace responsable por cargos indebidos en los comercios afiliados.</p>
                  <p>- Todos los comercios aceptaran este método de pago.</p>
                  {/*<p>* El sistema aplicara una comisión del 5% sobre el total de las recargas realizadas, no existen excepciones.</p>*/}
                </Box>
              </Fragment>
            }
          >
            <Typography
              onClick={() => setToolTipTyc(true)}
              component={"span"}
              sx={{
                fontFamily: "Lato, sans-serif",
                fontSize: { md: ".6rem", xs: ".6rem" },
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              
            </Typography>
          </Tooltip>
        </ClickAwayListener>
      </Typography>

    </Grid>
  );
}
