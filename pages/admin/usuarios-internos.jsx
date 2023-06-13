import { Grid, Paper, Typography } from "@mui/material";
import { withIronSessionSsr } from "iron-session/next";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { session } from "../../lib/session";
import { Layout } from "../../src/components/molecules";
import { getAdminTotalRegisterAndTopUpBalance } from "../../src/services/commerce";


export default function UsersMetricsContainer() {

    const [userMetrics, setUsersMetrics] = useState(null)
    useEffect(() => {
        (async () => {
            const { response} = await getAdminTotalRegisterAndTopUpBalance()
            console.log(response)
            console.log(response.map((i) => {
                return {
                    name: i?.admin ? `${i?.admin?.firstName} ${i?.admin?.lastName}` : 'N/A',
                    totalTopUpBalance: i.totalTopUpBalance,
                    totalUsersRegisters: i.totalUsersRegisters,
                    totalCreditsUsersRegisters: i.totalCreditsUsersRegisters,
                    totalCreditsTopUpBalance: i.totalCreditsTopUpBalance,
                    creditsTotal: i.creditsTotal,

                }
            }))
            setUsersMetrics(response.map((i) => {
                return {
                    name: i?.admin ? `${i?.admin?.firstName} ${i?.admin?.lastName}` : 'N/A',
                    totalTopUpBalance: i.totalTopUpBalance,
                    totalUsersRegisters: i.totalUsersRegisters,
                    totalCreditsUsersRegisters: i.totalCreditsUsersRegisters,
                    totalCreditsTopUpBalance: i.totalCreditsTopUpBalance,
                    creditsTotal: i.creditsTotal,

                }
            }))
        })()
    }, [])

    return (
        <>
         <MUIDataTable
                columns={[
                    {
                        name: "name",
                        label: "Nombre",
                        options: {
                            filter: false,
                            sort: false,
                        },
                    },
                    {
                        name: "totalTopUpBalance",
                        label: "Recargas",
                        options: {
                            filter: false,
                            sort: false,
                        },
                    }, {
                        name: "totalUsersRegisters",
                        label: "Usuarios Inscritos",
                        options: {
                            filter: false,
                            sort: false,
                        },
                    }, {
                        name: "totalCreditsUsersRegisters",
                        label: "Creditos de Usuarios Insc",
                        options: {
                            filter: false,
                            sort: false,
                        },
                    }, {
                        name: "totalCreditsTopUpBalance",
                        label: "Total de Creditos en Recargas",
                        options: {
                            filter: false,
                            sort: false,
                        },
                    }, {
                        name: "creditsTotal",
                        label: "Total",
                        options: {
                            filter: false,
                            sort: false,
                        },
                    }
                ]}
                data={userMetrics || []}
                title='Usuarios Internos'
                options={{
                    tableId: 'asdfasfsadfasdf',
                    download: false,
                    filter: false,
                    expandableRows: false,
                    expandableRowsHeader: false,
                    search: false,
                    print: false,
                    selectableRowsHideCheckboxes: true,
                    pagination: false,
                    responsive: "vertical",
                    fixedSelectColumn: false,
                    elevation: 0,
                }}
            />
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
