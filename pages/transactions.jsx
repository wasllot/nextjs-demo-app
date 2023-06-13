import { useEffect, useState } from "react";
import { Grid, styled, Divider, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Paper, TablePagination } from "@mui/material";
import { withIronSessionSsr } from "iron-session/next";
import { session } from "../lib/session";
import { Footer } from "../src/components/molecules";
import { Link, Spinner } from "../src/components/atoms";
import { userServices } from "../src/services";
import moment from "moment";

export default function Transaction({ token }) {
  const [transactions, setTransactions] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getDocs() {
      /* try {
        setIsLoading(true);
        const { status, response } = await userServices.getTransactions({ token, page, limit, query: "" });
        setIsLoading(false);
        if (status === 200) { */
          setTransactions(response.docs);
          setLimit(response.limit);
          setCount(response.totalDocs);
          setPage(response.page);
       /*  }
      } catch (e) {
        console.log(e);
      } */
    }
    getDocs();
  }, [token, limit, page]);

  return (
    <Grid container sx={{ backgroundColor: "transparent" }} justifyContent="center">
      <Spinner loading={isLoading} />
     
      <Grid item xs={12} md={12} container justifyContent="center" sx={{ zIndex: 2, margin: 0, minHeight: "calc(100vh - 425px)" }}>
   
        <Grid item md={12} xs={12}>
          <TableContainer component={Paper} sx={{ borderRadius: "10px", minHeight: "31vh" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Tipo</StyledTableCell>
                  <StyledTableCell align="center">Monto</StyledTableCell>
                  <StyledTableCell align="center">Usuario</StyledTableCell>
                  <StyledTableCell align="center">Fecha</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell align="center">{row.description}</StyledTableCell>
                    <StyledTableCell align="center">${row.amount}</StyledTableCell>
                    <StyledTableCell align="center">{row.commerce ? row.commerce.name.toUpperCase() : row.from.firstName.toUpperCase()}</StyledTableCell>
                    <StyledTableCell align="center">{moment(new Date(row.createdAt)).local().format("DD-MM-YYYY HH:mm")}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            labelRowsPerPage="Registros por página"
            component="div"
            count={count}
            labelDisplayedRows={({ from, to, count }) => {
              return `${from}–${to} de ${count !== -1 ? count : `más qué ${to}`}`;
            }}
            onRowsPerPageChange={(e) => {
              setLimit(e.target.value);
            }}
            onPageChange={(e, page) => {
              setPage(page + 1);
            }}
            page={page - 1}
            rowsPerPage={limit}
            rowsPerPageOptions={[10, 20, 50, 100]}
            sx={[
              (theme) => ({
                color: theme.palette.secondary.main,
                [theme.breakpoints.down("xs")]: {
                  position: "absolute",
                  bottom: 0,
                },
              }),
            ]}
          />
        </Grid>
      </Grid>
      
    </Grid>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0E1727",
    color: theme.palette.common.white,
    fontFamily: "Lato, sans-serif",
    fontSize: 14,
    fontWeight: "400",

  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
    fontFamily: "BrightSight, sans-serif",
    fontWeight: "bold",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
 export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
  const cookie = req.session.user;
  if (!cookie) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const { token } = cookie;
  return {
    props: {
      token,
    },
  };
}, session.user); 
