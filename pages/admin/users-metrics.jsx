import { Grid, Paper, Typography } from "@mui/material";
import { withIronSessionSsr } from "iron-session/next";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { session } from "../../lib/session";
import { Layout } from "../../src/components/molecules";
import { getUserMetrics } from "../../src/services/users";


export default function UsersMetricsContainer() {

  const [userMetrics, setUsersMetrics] = useState(null)
  useEffect(() => {
    (async () => {
      const { response } = await getUserMetrics()
      setUsersMetrics(response)
      console.log(response)
    })()
  }, [])

  return (
    <>
      <Paper sx={{ margin: '1rem' }}>
        <Grid container>
          <Grid item container justifyContent='center'>
            <Typography>Resumen Usuarios</Typography>
          </Grid>
          <Grid item container>
            <Grid item xs={6} sx={{ padding: '1rem', border: '1px solid black' }}>Usuarios Totales</Grid>
            <Grid item xs={6} sx={{ padding: '1rem', border: '1px solid black' }}>{userMetrics?.totalUsers}</Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={6} sx={{ padding: '1rem', border: '1px solid black' }}>Saldo Total de Usuarios:</Grid>
            <Grid item xs={6} sx={{ padding: '1rem', border: '1px solid black' }}>{userMetrics?.totalBalance}</Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={6} sx={{ padding: '1rem', border: '1px solid black' }}>Usuarios con Creditos:</Grid>
            <Grid item xs={6} sx={{ padding: '1rem', border: '1px solid black' }}>{userMetrics?.userWihBalance}</Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={6} sx={{ padding: '1rem', border: '1px solid black' }}>Usuarios con Saldo 0:</Grid>
            <Grid item xs={6} sx={{ padding: '1rem', border: '1px solid black' }}>{userMetrics?.userWihOutBalance}</Grid>
          </Grid>
          <Grid item container>
            <Grid item xs={6} sx={{ padding: '1rem', border: '1px solid black' }}>Saldo por Recargar:</Grid>
            <Grid item xs={6} sx={{ padding: '1rem', border: '1px solid black' }}>{userMetrics?.totalUnPaidBalance}</Grid>
          </Grid>
        </Grid>
      </Paper>

    </>
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
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
}, session.admin);


UsersMetricsContainer.getLayout = function getLayout(page) {
  return <Layout user={page.props.user}>{page}</Layout>;
};
