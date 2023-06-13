import { useEffect, useState, useReducer } from "react";
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
  useMediaQuery,
  useTheme, Grid,
} from "@mui/material";
import { Font } from "../../src/components/atoms";
import { Layout } from "../../src/components/molecules";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/logo.svg";
import Avatar from "@mui/icons-material/AccountCircle";
import { LogoutIcon } from "../../src/components/icons";
import { adminServices, userServices } from "../../src/services";
import { useRouter } from "next/router";
import { session } from "../../lib/session";
import { withIronSessionSsr } from "iron-session/next";
import MUIDataTable from "mui-datatables";

import TextField from '@mui/material/TextField';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import moment from "moment";
import { getUserMetrics } from "../../src/services/users";
import { getAdminsTotalPaymentMethod, getAdminTotalRegisterAndTopUpBalance, getTotalGeneratePaymentMethod } from "../../src/services/commerce";
import InsideUsersMetrics from "../../src/components/atoms/InsideUsersMetrics";
import UserMetrics from "../../src/components/atoms/UserMetrics";
import PerMethodMetrics from "../../src/components/atoms/PerMethodMetrics";


const reducer = (prevState, action) => {
  switch (action.type) {
    case "LOAD":
      return {
        loadingQueue: prevState.loadingQueue + 1,
        isLoading: true,
      };
    case "READY":
      if (prevState.loadingQueue <= 1) {
        return {
          loadingQueue: 0,
          isLoading: false,
        };
      }
      return {
        loadingQueue: prevState.loadingQueue - 1,
        isLoading: true,
      };
    default:
      break;
  }
};
export default function Dashboard({ route }) {
  const router = useRouter();
  const [ordersList, setOrdersList] = useState([])
  const [dataRender, setDataRender] = useState([])
  const [loaderState, loaderDispatch] = useReducer(reducer, {
    loadingQueue: 0,
    isLoading: false,
  });

  const [start, setStart] = useState(new Date());
  const [apiStart, setApiStart] = useState(new Date());
  const [end, setEnd] = useState(new Date())
  const [apiEnd, setApiEnd] = useState(new Date())

  const handleStartChange = (newValue) => {
    const date = newValue.toLocaleDateString('es-VE')
    const apiDate = date.split('/').reverse().join('-')

    setApiStart(apiDate)
    setStart(newValue);
  };

  const handleEndChange = (newValue) => {
    const date = newValue.toLocaleDateString('es-VE')
    const apiDate = date.split('/').reverse().join('-')

    setApiEnd(apiDate)
    setEnd(newValue);
  };

  const logout = async () => {
    await userServices.logout({ role: "admin" });
    router.push("/admin");
  };

  const getOrders = async (e) => {
    try {
      loaderDispatch({ type: "LOAD" });
      const { status, response } = await adminServices.totalOrders({
        // token: user.token,
        start: moment(apiStart).format("YYYY-MM-DD"),
        end: moment(apiEnd).format("YYYY-MM-DD"),
      });
      if (status === 200) {
        console.log(response)
        setOrdersList(response)
      }
    } catch (error) {
      console.log({ error });
    } finally {
      loaderDispatch({ type: "READY" });
    }
  };

  useEffect(() => {
    getOrders()
  }, [apiStart, apiEnd])

  useEffect(() => {
    const data = []
    ordersList.map(({ _id, name, totalCredits, total }) => data.push({
      _id,
      name,
      totalCredits: `${totalCredits} Créditos`,
      total: parseFloat(totalCredits) < parseFloat(total) ? `${total} Bs.` : `$${total}`
    }))
    setDataRender(data)
  }, [ordersList])

  const columns = [
    {
      name: "_id",
      label: "ID",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "name",
      label: "Método de Pago",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "totalCredits",
      label: "Créditos Totales",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "total",
      label: "Total Generado",
      options: {
        filter: true,
        sort: true,
      },
    },

  ]

  const options = {
    expandableRows: false,
    expandableRowsHeader: false,
    search: false,
    print: false,
    selectableRowsHideCheckboxes: true,
    filter: true,
    pagination: false,
    responsive: "vertical",
    fixedSelectColumn: false,
    elevation: 5,
    textLabels: {
      body: {
        noMatch: "Sorry, no matching records found",
        toolTip: "Sort",
        columnHeaderTooltip: column => `Sort for ${column.label}`,
        textAlign: 'center'
      },
    }
  };

  return (
    <Box component="main" sx={{ py: 6, px: 5, maxWidth: 1200, minHeight: '80vh', m: "auto" }}>
      <Font family="brother" variant="h2" align="center">
        Dashboard
      </Font>

      <Grid container spacing={1} justifyContent='center' flexDirection='column' >
        <Grid item sx={{ display: 'flex', justifyContent: 'space-around' }} >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDatePicker
              label="Fecha Inicial"
              inputFormat="yyyy/MM/dd"
              value={start}
              onChange={handleStartChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDatePicker
              label="Fecha Final"
              inputFormat="yyyy/MM/dd"
              value={end}
              onChange={handleEndChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>

        <Grid container sx={{ marginTop: '20px' }}>

          <Grid container item xs={12} spacing={4} sx={{ minHeight: '30vh' }} >
            <Grid item xs={12} md={6} sx={{ padding: '0px', marginTop: '0px' }} >
              <MUIDataTable
                title={"Resumen"}
                data={dataRender}
                columns={columns}
                options={options}
              />
            </Grid>
            <Grid item xs={12} md={6}  >
              <UserMetrics
                options={options}
                payload={{
                  start: moment(apiStart).format("YYYY-MM-DD"),
                  end: moment(apiEnd).format("YYYY-MM-DD"),
                }} />
            </Grid>
          </Grid>
          <Grid container xs={12} spacing={4} sx={{ marginTop: '0px' }} >

            <Grid item xs={12} md={6}  >
              <InsideUsersMetrics options={options}
                payload={{
                  start: moment(apiStart).format("YYYY-MM-DD"),
                  end: moment(apiEnd).format("YYYY-MM-DD"),
                }} />
            </Grid>
            <Grid item xs={12} md={6}  >
              <PerMethodMetrics options={options}
                payload={{
                  start: moment(apiStart).format("YYYY-MM-DD"),
                  end: moment(apiEnd).format("YYYY-MM-DD"),
                }} />
            </Grid>
          </Grid>
        </Grid>

      </Grid>

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

Dashboard.getLayout = function getLayout(page) {
  return <Layout user={page.props.user}>{page}</Layout>;
};
