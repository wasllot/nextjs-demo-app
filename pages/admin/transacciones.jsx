import { useState, useEffect, useReducer } from "react";
import { Font } from "../../src/components/atoms";
import { Layout } from "../../src/components/molecules";
import { withIronSessionSsr } from "iron-session/next";
import { session } from "../../lib/session";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MUIDataTable from "mui-datatables";
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
	CircularProgress, Typography, IconButton
} from "@mui/material";
import { adminServices, userServices } from "../../src/services";
import { useRouter } from "next/router";
import InfoModal from "../../src/components/atoms/InfoModal";

const FILTERS = {
	approved: "Aprobada",
	reject: "Rechazada",
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

export default function Transacciones({ user }) {
	const [filter, setFilter] = useState("pendding");
	const [transactions, setTransactions] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(50);
	const [totalDocs, setTotalDocs] = useState(0);
	const [openInfo, setOpenInfo] = useState(false);
	const [modalInfo, setModalInfo] = useState({})
	const [loaderState, loaderDispatch] = useReducer(reducer, {
		loadingQueue: 0,
		isLoading: false,
	});
	const router = useRouter()

	const [userBalance, setUserBalance] = useState({})

	console.log({ transactions });

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const formatName = (firstName, lastName) => {
		return `${firstName?.charAt().toUpperCase() + firstName?.toLowerCase().slice(1)} ${lastName?.charAt().toUpperCase() + lastName?.toLowerCase().slice(1)
			}`;
	};

	const handleOpenInfo = (modalStatus, from, to, commerce, ammount, createdAt, nfcSystemId ) =>{
		setOpenInfo(modalStatus)
		setModalInfo({from, to, commerce, ammount, createdAt, nfcSystemId} )
	}

	const getTransactions = async (e) => {
		try {
			loaderDispatch({ type: "LOAD" });
			const { status, response } = await adminServices.getTransactions({
				token: user.token,
				limit: rowsPerPage,
				page: page + 1,
				query: e?.target?.value,
			});
			if (status === 200) {
				console.log({ response });
				setTransactions(response.docs);
				setTotalDocs(response.totalDocs);
			}
		} catch (error) {
			console.log({ error });
		} finally {
			loaderDispatch({ type: "READY" });
		}
	};

	const getUserTransactions = async (e) => {
		try {
			loaderDispatch({ type: "LOAD" });
			const { status, response } = await adminServices.getUserTransactions({
				token: user.token,
				limit: rowsPerPage,
				page: page + 1,
				userId: router.query.userId
			});
			if (status === 200) {
				//console.log({ response });
				setTransactions(response.docs);
				setTotalDocs(response.totalDocs);
			}
		} catch (error) {
			console.log({ error });
		} finally {
			loaderDispatch({ type: "READY" });
		}
		try {
			loaderDispatch({ type: "LOAD" });
			const { status, response } = await userServices.getBalance({ id: router.query.userId });
			if (status === 200) {
				// console.log({ response });
				setUserBalance(response)
			}
		} catch (error) {
			console.log({ error });
		} finally {
			loaderDispatch({ type: "READY" });
		}
	};

	const getCommerceTransactions = async (e) => {
		try {
			loaderDispatch({ type: "LOAD" });
			const { status, response } = await adminServices.getCommerceTransactions({
				token: user.token,
				limit: rowsPerPage,
				page: page + 1,
				commerceId: router.query.commerceId
			});
			if (status === 200) {
				//console.log({ response });
				setTransactions(response.docs);
				setTotalDocs(response.totalDocs);
			}
		} catch (error) {
			console.log({ error });
		} finally {
			loaderDispatch({ type: "READY" });
		}
	};

	const exportTransaction = async () => {
		try {
			loaderDispatch({ type: "LOAD" });
			const { response } = await adminServices.exportTransactions();
			var blob = new Blob([response], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			var link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.download = "transaciones.xlsx";
			link.click();
			window.URL.revokeObjectURL(link.href);
		} catch (error) {
			console.log({ error });
		} finally {
			loaderDispatch({ type: "READY" });
		}
	}
	useEffect(() => {
		Object.entries(router.query).length === 0 ?
			getTransactions()
			:
			router.query.userId && getUserTransactions();
		router.query.commerceId && getCommerceTransactions();

	}, [rowsPerPage, page, filter, router.query.userId]);

	const [tableData, setTableData] = useState([])

	useEffect(() => {
		const dataRender = []
		console.log("🚀 ~ file: transacciones.jsx:203 ~ transactions?.map ~ transactions", transactions)

		transactions?.map((tx) => dataRender.push({
			date: new Date(tx.createdAt).toLocaleDateString("es-VE"),
			name: <a
				style={{ cursor: 'pointer', color: 'red', textDecoration: 'underline' }}
				onClick={() => router.push(`/admin/transacciones?userId=${tx.from.userRoll === 'user' ? tx.from._id : tx.to?._id}`)}>
				{tx.from.userRoll === 'user' ?
					formatName(tx.from?.firstName, tx.from?.lastName)
					:
					formatName(tx.to?.firstName, tx.to?.lastName)
				}
			</a>,
			description: tx.description,
			ammount: tx.from.userRoll === 'user' ? `- ${tx.amount}$` : `+ ${tx.amount}$`,
			nfcId: tx.nfcSystemId || 'N/A',
			showDetails:
				<IconButton
					onClick={() =>
						handleOpenInfo(true, tx.from, tx.to, tx.commerce, tx.from.userRoll === 'user' ? `- ${tx.amount}$` : `+ ${tx.amount}$`, tx.createdAt, tx.nfcSystemId )
					}
				>
					<VisibilityIcon />
				</IconButton>


		}))

		setTableData(dataRender)
	}, [transactions])

	const columns = [
		{
			name: "date",
			label: "Fecha",
			options: {
				filter: true,
				sort: true,
			},
		},
		{
			name: "nfcId",
			label: "NFC Id",
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
				sort: false,
			},
		},
		{
			name: "description",
			label: "Descripción",
			options: {
				filter: false,
				sort: false,
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
			name: "showDetails",
			label: "Detalles",
			options: {
				filter: false,
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
		elevation: 0,
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
			<InfoModal openInfo={openInfo} setOpenInfo={setOpenInfo} info={modalInfo} />

			{router.query.userId || router.query.commerceId ?
				<IconButton aria-label="volver" onClick={() => router.back() /* router.push(router.query.redirected? '/admin/usuarios' : '/admin/transacciones') */}>
					<ArrowBackIosNewIcon sx={{ marginRight: '10px' }} />
					Volver
				</IconButton>
				: <></>}
			<Font family="brother" variant="h3" align="center">
				Transacciones
			</Font>
			<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
				<TextField
					//   label="Buscar"
					// onChange={findOrders}
					placeholder="Buscar"
					onChange={getTransactions}
					InputProps={{
						sx: { fontFamily: "Lato, sans-serif", borderRadius: 25 },
					}}
					//   InputLabelProps={{
					//     sx: { fontFamily: "Lato, sans-serif" },
					//   }}
					size="small"
				/>
			</Box>
			<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
				{userBalance.user && router.query.userId &&
					<Typography variant="h5" mr={3} >{`Saldo ${formatName(userBalance?.user?.firstName, userBalance?.user?.lastName)}: $${parseFloat(userBalance.balance).toFixed(2)}`}</Typography>}
				<Button
					color="primary"
					variant={filter === "pendding" ? "contained" : "outlined"}
					sx={{
						fontFamily: "Lato, sans-serif",
						borderRadius: 25,
						minWidth: 80,
					}}
					onClick={exportTransaction}
				>
					Exportar
				</Button>
			</Box>
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
				!Boolean(transactions.length) && (
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
				labelRowsPerPage="Transacciones por página"
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

Transacciones.getLayout = function getLayout(page) {
	return <Layout user={page.props.user}>{page}</Layout>;
};
