import { useState, useEffect, useReducer } from "react";
import { Font, Spinner } from "../../src/components/atoms";
import { Layout } from "../../src/components/molecules";
import { withIronSessionSsr } from "iron-session/next";
import { session } from "../../lib/session";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Modal,
  CircularProgress,
  IconButton,
  Typography,
  Grid,
  Toolbar
} from "@mui/material";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CancelIcon from '@mui/icons-material/Cancel';
import { adminServices } from "../../src/services";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import MUIDataTable from "mui-datatables";
const FILTERS = {
  approved: "Aprobada",
  rejected: "Rechazada",
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

export default function Ordenes({ user }) {
  const [filter, setFilter] = useState("pendding");
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);
  const [openInfo, setOpenInfo] = useState(false);
  const [info, setInfo] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState();
  const [loaderState, loaderDispatch] = useReducer(reducer, {
    loadingQueue: 0,
    isLoading: false,
  });

  // const {
  //   register,
  //   reset,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const approveOrder = async (orderId) => {
    try {
      loaderDispatch({ type: "LOAD" });
      handleCardClose();
      const { status, response } = await adminServices.approveOrder({
        token: user.token,
        orderId,
        // ...data,
      });
      if (status === 200) {
        setMessage("La orden ha sido aprobada");
      } else {
        setMessage("Ha ocurrido un error");
      }
      getOrders();
    } catch (error) {
      console.log({ error });
    } finally {
      loaderDispatch({ type: "READY" });
      setOpenMessage(true);
    }
  };

  const rejectOrder = async (orderId) => {
    try {
      loaderDispatch({ type: "LOAD" });
      const { status, response } = await adminServices.rejectOrder({
        token: user.token,
        orderId,
      });
      if (status === 200) {
        setMessage("La orden ha sido rechazada");
      } else {
        setMessage("Ha ocurrido un error");
      }
      getOrders();
    } catch (error) {
      console.log({ error });
    } finally {
      loaderDispatch({ type: "READY" });
      setOpenMessage(true);
    }
  };

  const exportOrders = async () => {
    try {
      loaderDispatch({ type: "LOAD" });
      const { response } = await adminServices.exportOrder();
      var blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "orders.xlsx";
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.log({ error });
    } finally {
      loaderDispatch({ type: "READY" });
    }
  }
  // const findOrders = async (e) => {
  //   try {
  //     loaderDispatch({ type: "LOAD" });
  //     const { status, response } = await adminServices.findOrders({
  //       token: user.token,
  //       limit: rowsPerPage,
  //       page: page + 1,
  //       search: e.target.value,
  //     });
  //     if (status === 200) {
  //       setOrders(response.docs);
  //       setTotalDocs(response.totalDocs);
  //     }
  //   } catch (error) {
  //     console.log({ error });
  //   } finally {
  //     loaderDispatch({ type: "READY" });
  //   }
  // };

  const handleOpenInfo = ({ ...info }) => {
    setInfo(info);
    setOpenInfo(true);
  };

  const getOrders = async (e) => {
    try {
      loaderDispatch({ type: "LOAD" });
      const { status, response } = await adminServices.getOrders({
        token: user.token,
        limit: rowsPerPage,
        page: page + 1,
        filter,
        query: e?.target?.value
      });
      if (status === 200) {
        setOrders(response.docs);
        setTotalDocs(response.totalDocs);
      }
    } catch (error) {
      console.log({ error });
    } finally {
      loaderDispatch({ type: "READY" });
    }
  };
  const addToNfc = async (_id) => {
    try {
      loaderDispatch({ type: "LOAD" });
      const { status, response } = await adminServices.nfcComplete({
        token: user.token,
        orderId: _id
      });
      if (status === 200) {
        setMessage(response.message);
      }
      getOrders();
    } catch (error) {
      console.log({ error });
    } finally {
      loaderDispatch({ type: "READY" });
      setOpenMessage(true);
    }
  }
  const handleCardClose = () => {
    // reset();
    setOpenCard(false);
  };

  useEffect(() => {
    getOrders();
  }, [rowsPerPage, page, filter]);

  const [tableData, setTableData] = useState([])

  const tableColumns = [
    {
      name: "ref",
      label: "Referencia",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "date",
      label: "Fecha",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "name",
      label: "Nombre",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "paymentMethod",
      label: "Forma de pago",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "credits",
      label: "Créditos",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "type",
      label: "Tipo",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "ammount",
      label: "Monto",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "changeStatus",
      label: "Aprobar / Rechazar",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "info",
      label: "Info.",
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
    viewColumns: false,
    elevation: 2,
    download: false,
    textLabels: {
      body: {
        noMatch: "Sorry, no matching records found",
        toolTip: "Sort",
        columnHeaderTooltip: column => `Sort for ${column.label}`,
        textAlign: 'center'
      },
    }
  };

  useEffect(() => {
    const auxData = []
    orders.map(({
      payment,
      date,
      user,
      amount,
      status,
      fee,
      wallet,
      credits,
      _id,
      nfcQrStatus
    }) => {
      auxData.push({
        ref: payment.ref,
        date: new Date(date).toLocaleDateString("es-VE"),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        paymentMethod: payment.type,
        credits: credits,
        type: wallet ? "Inscripcion" : "Recarga",
        ammount: `${amount.toFixed(2)} ${payment.type === "bss" ? "Bs" : "$"}`,
        changeStatus:
          nfcQrStatus === "in_process" ?
            <Typography>Pendiente de Recarga</Typography>
            :
            nfcQrStatus === "completed" ?
              <Typography>Recarga Completa</Typography>
              :
              status === "pendding" ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                  }}
                >
                  <IconButton aria-label="aprobar" onClick={() => {
                    approveOrder(_id);
                  }}>
                    <CheckBoxIcon sx={{ color: "#008F39" }} />
                  </IconButton>
                  <IconButton aria-label="cancelar" onClick={() => rejectOrder(_id)}>
                    <CancelIcon sx={{ color: '#CB3234' }} />
                  </IconButton>
                </Box>
              ) : (
                FILTERS[status]
              ),
        info: <IconButton
          onClick={() =>
            handleOpenInfo({
              credits,
              amount,
              wallet,
              fee,
              payment,
              user
            })
          }
        >
          <VisibilityIcon />
        </IconButton>


      })
    })
    setTableData(auxData)
  }, [orders])

  return (
    <Box
      component="main"
      sx={{
        py: 6,
        px: 5,
        maxWidth: 1250,
        m: "auto",
        minHeight: "calc(100vh - 214px)",
      }}
    >
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
            maxWidth: 450,
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
              Cédula
            </Font>
            <Font family="brightsight" variant="h4">
              V-{info?.user?.document}
            </Font>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Font family="brightsight" variant="h4">
              Teléfono
            </Font>
            <Font family="brightsight" variant="h4">
              {info?.user?.phone}
            </Font>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Font family="brightsight" variant="h4">
              Creditos
            </Font>
            <Font family="brightsight" variant="h4">
              {info?.credits} $
            </Font>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
          </Box>
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
      {/* <Modal
        open={openCard}
        onClose={handleCardClose}
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
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            p: 3,
            gap: 4,
            position: "relative",
          }}
          onSubmit={handleSubmit((data) => approveOrder(orderId, data))}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: "50%",
              minWidth: 0,
              p: 3,
              width: 20,
              height: 20,
              position: "absolute",
              top: -20,
              right: -20,
            }}
            onClick={() => setOpenCard(false)}
          >
            X
          </Button>
          <Font family="brother" variant="h3" align="center">
            Asociar tarjeta a usuario
          </Font>
          <TextField
            placeholder="Serial de la tarjeta"
            InputProps={{
              sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
            }}
            inputProps={{
              ...register("walletCode", {
                required: "Ingrese el serial de la tarjeta",
              }),
            }}
            FormHelperTextProps={{ sx: { fontFamily: "Lato, sans-serif" } }}
            helperText={errors.walletCode?.message}
            error={errors.walletCode}
          />
          <Button
            color="primary"
            variant="contained"
            size="large"
            sx={{ fontFamily: "Lato, sans-serif" }}
            type="submit"
          >
            Asignar
          </Button>
        </Paper>
      </Modal> */}
      <Font family="brother" variant="h2" align="center">
        Ordenes
      </Font>
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <TextField
          //   label="Buscar"
          onChange={getOrders}
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          flexFlow: "wrap",
        }}
      >
        <Button
          color="primary"
          variant={filter === "pendding" ? "contained" : "outlined"}
          sx={{
            fontFamily: "Lato, sans-serif",
            borderRadius: 25,
            minWidth: 80,
          }}
          onClick={() => setFilter("pendding")}
        >
          Pendientes APRO
        </Button>
        <Button
          color="primary"
          variant={filter === "approved" ? "contained" : "outlined"}
          sx={{
            fontFamily: "Lato, sans-serif",
            borderRadius: 25,
            minWidth: 80,
          }}
          onClick={() => setFilter("approved")}
        >
          Aprobadas
        </Button>
        <Button
          color="primary"
          variant={filter === "rejected" ? "contained" : "outlined"}
          sx={{
            fontFamily: "Lato, sans-serif",
            borderRadius: 25,
            minWidth: 80,
          }}
          onClick={() => setFilter("rejected")}
        >
          Rechazadas
        </Button>
        <Button
          color="primary"
          variant={filter === "in_process" ? "contained" : "outlined"}
          sx={{
            fontFamily: "Lato, sans-serif",
            borderRadius: 25,
            minWidth: 80,
          }}
          onClick={() => setFilter("in_process")}
        >
          Pendientes Recarga
        </Button>
        <Button
          color="primary"
          variant={filter === "completed" ? "contained" : "outlined"}
          sx={{
            fontFamily: "Lato, sans-serif",
            borderRadius: 25,
            minWidth: 80,
          }}
          onClick={() => setFilter("completed")}
        >
          Recargas Procesadas
        </Button>
        <Button
          color="primary"
          variant={"contained"}
          sx={{
            fontFamily: "Lato, sans-serif",
            borderRadius: 25,
            minWidth: 80,
          }}
          onClick={exportOrders}
        >
          Exportar
        </Button>
      </Box>
      {/*  <TableContainer component={Paper} sx={{ my: 4 }}>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Ref</TableCell>
              <TableCell align="center">Fecha</TableCell>
              <TableCell align="center">Nombre</TableCell>
              {//  <TableCell align="center">Cedula</TableCell>
              //<TableCell align="center">Teléfono</TableCell> 
              }
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Forma de pago</TableCell>
              <TableCell align="center">Créditos</TableCell>
              <TableCell align="center">Tipo</TableCell>
              <TableCell align="center">Monto</TableCell>
              <TableCell align="center">Aprobar / Rechazar</TableCell>
              <TableCell align="center">Información</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loaderState.isLoading &&
              orders.map(
                (
                  {
                    payment,
                    date,
                    user,
                    amount,
                    status,
                    fee,
                    wallet,
                    credits,
                    _id,
                    nfcQrStatus
                  },
                  index
                ) => (
                  <TableRow key={index}>
                    <TableCell align="center">{payment.ref}</TableCell>
                    <TableCell align="center">
                      {new Date(date).toLocaleDateString("es-VE")}
                    </TableCell>
                    <TableCell align="center">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    {// <TableCell align="center">
                      //{user.document}
                    //</TableCell>
                    //<TableCell align="center">{user.phone}</TableCell> 
                  }
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell align="center">{payment.type}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      {credits}
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      {wallet ? "Inscripcion" : "Recarga"}
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      {amount.toFixed(2)} {payment.type === "bss" ? "Bs" : "$"}
                    </TableCell>
                    <TableCell align="center">
                      {status === "pendding" ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 1,
                          }}
                        >

                          <IconButton aria-label="aprobar" onClick={() => {
                            // if (wallet) {
                            //   setOrderId(_id);
                            //   return setOpenCard(true);
                            // }
                            approveOrder(_id);
                          }}>
                            <CheckBoxIcon sx={{ color: "#008F39" }} />
                          </IconButton>

                          <IconButton aria-label="cancelar" onClick={() => rejectOrder(_id)}>
                            <CancelIcon sx={{ color: '#CB3234' }} />
                          </IconButton>
                        </Box>
                      ) : (
                        FILTERS[status]
                      )}
                      {
                        nfcQrStatus === "in_process" && <Typography>Pendiente de Recarga</Typography>
                      }
                      {
                        nfcQrStatus === "completed" && <Typography>Recarga Completa</Typography>
                      }
                    </TableCell>

                    <TableCell align="center">
                      {
                        <IconButton
                          onClick={() =>
                            handleOpenInfo({
                              credits,
                              amount,
                              wallet,
                              fee,
                              payment,
                              user
                            })
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                      }
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
        {loaderState.isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          !Boolean(orders.length) && (
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
          rowsPerPageOptions={[10, 25, 50, 100, 250, 1000, totalDocs && { label: "All", value: totalDocs },]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Ordenes por página"
        />
      </TableContainer> */}
        <Spinner loading={loaderState.isLoading} />
      <TableContainer component={Paper} sx={{ my: 4, width: '100%' }}>
        <MUIDataTable
          columns={tableColumns}
          data={tableData}
          options={options}
        />
        <TablePagination
          component="div"
          count={totalDocs}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100, 250, 1000, totalDocs && { label: "All", value: totalDocs },]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Ordenes por página"
        />
      </TableContainer>

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

Ordenes.getLayout = function getLayout(page) {
  return <Layout user={page.props.user}>{page}</Layout>;
};
