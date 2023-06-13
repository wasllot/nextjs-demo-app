import { useState, useEffect, useReducer } from "react";
import { Font, Spinner, Modal as ModalResponse, Button as ButtonResponse } from "../../src/components/atoms";
import { Layout } from "../../src/components/molecules";
import { withIronSessionSsr } from "iron-session/next";
import { session } from "../../lib/session";
import { Box, Button, TextField, Table, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, CircularProgress, IconButton, Modal } from "@mui/material";
import { adminServices, userServices } from "../../src/services";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MUIDataTable from "mui-datatables";
import { CheckIcon } from "../../src/components/icons";
import Router from "next/router";

const ROLES = {
  commerce_employee: "Empleado de comercio",
  commerce_admin: "Administrador de comercio",
  admin: "Administrador",
  user: "Usuario",
};

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

export default function Usuarios({ user }) {
  const [filter, setFilter] = useState("pendding");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalDocs, setTotalDocs] = useState(0);
  const [openInfo, setOpenInfo] = useState(false);
  const [info, setInfo] = useState();
  const [loading, setLoading] = useState(false);
  const [loaderState, loaderDispatch] = useReducer(reducer, {
    loadingQueue: 0,
    isLoading: false,
  });
  const [openResponse, setOpenResponse] = useState(false);
  const [openResponse1, setOpenResponse1] = useState(false);
  const getUserBalance = async ({ id, walletCode }) => {
    try {
      setLoading(true);
      const { status, response } = await userServices.getBalance({ id });
      console.log({ status, response });
      if (status === 200) {
        setInfo({ ...response, walletCode });
        setOpenInfo(true);
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatName = (firstName, lastName) => {
    return `${firstName.charAt().toUpperCase() + firstName.toLowerCase().slice(1)} ${lastName.charAt().toUpperCase() + lastName.toLowerCase().slice(1)}`;
  };

  const getUsers = async (e) => {
    try {
      loaderDispatch({ type: "LOAD" });
      const { status, response } = await adminServices.getUsers({
        token: user.token,
        limit: rowsPerPage,
        page: page + 1,
        query: e?.target?.value,
      });
      if (status === 200) {
        setUsers(response.docs);
        setTotalDocs(response.totalDocs);
      }
    } catch (error) {
      console.log({ error });
    } finally {
      loaderDispatch({ type: "READY" });
    }
  };

  useEffect(() => {
    getUsers();
  }, [rowsPerPage, page, filter]);
  const [tableData, setTableData] = useState([])
  const dataRender = []
  const blockCard = async (serial) => {
    try {
      loaderDispatch({ type: "LOAD" });
      const { status, response } = await adminServices.blockCard({
        token: user.token,
        data: {
          serial
        }
      });
      if (status === 200) {
        console.log(response)
        setOpenResponse(true)
      }
    } catch (error) {
      console.log({ error });
    } finally {
      loaderDispatch({ type: "READY" });
      getUsers()
    }
  };

  const activateUser = async (userId) => {
    
    try {
      loaderDispatch({ type: "LOAD" });
      const { status, response } = await adminServices.activateUser({
        token: user.token,
        data: {
          _id:userId,
          status: true
        }
      });
      if (status === 200) {
        console.log(response)
        setOpenResponse1(true)
      }
    } catch (error) {
      console.log({ error });
    } finally {
      loaderDispatch({ type: "READY" });
      getUsers()
    }
  };

  useEffect(() => {
    users?.map((user) => dataRender.push({
      name: formatName(user.firstName, user.lastName),
      document: user.document,
      phone: user.phone,
      email: user.email,
      role: ROLES[user.userRoll],
      cardCode: user.wallet && user.wallet.serial ? user.wallet?.cardNumber : "No",
      balance: user.balance,
      unpaidBalance: user.unPaidBalance,
      txs: <Button
        color="primary"
        variant={filter === "pendding" ? "contained" : "outlined"}
        sx={{
          fontFamily: "Lato, sans-serif",
          borderRadius: 25,
          minWidth: 185,
        }}
        onClick={() => Router.push(`/admin/transacciones?userId=${user._id}&redirected=true`)}
      >
        Ver transacciones
      </Button>,

      block: user.wallet && user.wallet.serial ? <Button
        color="primary"
        variant={"contained"}
        sx={{
          fontFamily: "Lato, sans-serif",
          borderRadius: 25,
          minWidth: 185,
        }}
        onClick={() => blockCard(user.wallet.serial)}
      >
        Bloquear Tarjeta
      </Button> : "",
      activate: !user.isActive ? <Button
        color="primary"
        variant={"contained"}
        sx={{
          fontFamily: "Lato, sans-serif",
          borderRadius: 25,
          minWidth: 185,
        }}
        onClick={() => activateUser(user._id)}
      >
        Activar usuario
      </Button>:''
    }))

    setTableData(dataRender)
  }, [users])

  const columns = [
    {
      name: "createdAt",
      label: "Fecha de creación",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "name",
      label: "Nombre",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "document",
      label: "Cédula",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "phone",
      label: "Teléfono",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "email",
      label: "Correo",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "role",
      label: "Rol de usuario",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "cardCode",
      label: "Cod. de Tarjeta",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "balance",
      label: "Saldo",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "unpaidBalance",
      label: "Saldo Diferido",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "txs",
      label: "Transacciones",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "block",
      label: "Block",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "activate",
      label: "Activar Usuario",
      options: {
        filter: false,
        sort: false,
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
    elevation: 0,
    /* textLabels: {
      body: {
        noMatch: !event ? (
          <>{"No hay reservaciones para mostrar, seleccione un evento"}</>
        ) : (
          <CircularProgress />
        ),
      },
    }, */
  };

  return (
    <Box
      component="main"
      sx={{
        py: 6,
        px: 5,
        maxWidth: 1500,
        m: "auto",
        minHeight: "calc(100vh - 214px)",
      }}
    >
      <ModalResponse open={openResponse} onClose={() => setOpenResponse(false)}>
        <CheckIcon />
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
          Tarjeta Bloqueada
        </Typography>
        <ButtonResponse
          onClick={() => {
            setOpenResponse(false);
          }}
          fullWidth
        >
          Continuar
        </ButtonResponse>
      </ModalResponse>
      <ModalResponse open={openResponse1} onClose={() => setOpenResponse1(false)}>
        <CheckIcon />
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
          Perfil Actualizado
        </Typography>
        <ButtonResponse
          onClick={() => {
            setOpenResponse1(false);
          }}
          fullWidth
        >
          Continuar
        </ButtonResponse>
      </ModalResponse>
      <Spinner loading={loaderState.isLoading} />
      <Modal
        open={openInfo}
        onClose={() => setOpenInfo(false)}
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
            width: "100%",
            display: "flex",
            flexDirection: "column",
            p: 3,
            position: "relative",
          }}
        >
          <Font family="brother" variant="h3" align="center" gutterBottom>
            Información
          </Font>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Font family="brightsight" variant="h4">
              Balance
            </Font>
            <Font family="brightsight" variant="h4">
              {info?.balance} $
            </Font>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Font family="brightsight" variant="h4">
              Código
            </Font>
            <Font family="brightsight" variant="h4">
              {info?.walletCode}
            </Font>
          </Box>
          {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Font family="brightsight" variant="h4">
              Fee
            </Font>
            <Font family="brightsight" variant="h4">
              {info?.fee?.toFixed(2)}{" "}
              {info?.payment?.type === "bss" ? "Bs" : "$"}
            </Font>
          </Box>
          {info?.wallet && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Font family="brightsight" variant="h4">
                Tarjeta
              </Font>
              <Font family="brightsight" variant="h4">
                5 $
              </Font>
            </Box>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Font family="brightsight" variant="h4">
              Total
            </Font>
            <Font family="brightsight" variant="h4">
              {info?.amount?.toFixed(2)}{" "}
              {info?.payment?.type === "bss" ? "Bs" : "$"}
            </Font>
          </Box> */}
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 15,
              fontFamily: "Lato, sans-serif",
              mt: 2,
            }}
            onClick={() => setOpenInfo(false)}
          >
            Aceptar
          </Button>
        </Paper>
      </Modal>
      <Font family="brother" variant="h2" align="center">
        Usuarios
      </Font>
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <TextField
          //   label="Buscar"
          onChange={getUsers}
          placeholder="Buscar"
          InputProps={{
            sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
          }}
          //   InputLabelProps={{
          //     sx: { fontFamily: "Lato, sans-serif" },
          //   }}
          size="small"
        />
      </Box>
      <TableContainer component={Paper} sx={{ my: 4 }}>

        <MUIDataTable
          data={tableData}
          columns={columns}
          options={options}
        />
        {loaderState.isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          !Boolean(users.length) && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <Font family="lato">No se encontraron resultados</Font>
            </Box>
          )
        )}
        <TablePagination
          component="div"
          count={totalDocs}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Usuarios por página"
          rowsPerPageOptions={[
            10,
            25,
            50,
            75,
            100,
            1000,
            10000,
            totalDocs && { label: "All", value: totalDocs },
          ]}
        />
      </TableContainer>
    </Box>
  );
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

Usuarios.getLayout = function getLayout(page) {
  return <Layout user={page.props.user}>{page}</Layout>;
};
