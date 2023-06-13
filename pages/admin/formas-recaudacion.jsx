import { Grid, Paper, Typography } from "@mui/material";
import { withIronSessionSsr } from "iron-session/next";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { session } from "../../lib/session";
import { Layout } from "../../src/components/molecules";
import { getAdminsTotalPaymentMethod, getTotalGeneratePaymentMethod } from "../../src/services/commerce";


export default function UsersMetricsContainer() {

    const [userMetrics, setUsersMetrics] = useState(null)
    useEffect(() => {
        (async () => {
            const { response: r1 } = await getTotalGeneratePaymentMethod()
            const { response: r2 } = await getAdminsTotalPaymentMethod()

            setUsersMetrics([...r2.map((i) => {
                return {
                    name: i?.admin ? `${i?.admin?.firstName} ${i?.admin?.lastName}` : 'N/A',
                    creditsZelle: i.creditsZelle,
                    creditsTotal: i.creditsTotal,
                    creditsPdv: i.creditsPdv,
                    creditsCourtesy: i.creditsCourtesy,
                    creditsCash: i.creditsCash,
                    creditsBss: i.creditsBss,

                }
            }), {
                name: '[Total]',
                ...r1
            }])
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
                        name: "creditsZelle",
                        label: "Zelle",
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
                    }, {
                        name: "creditsPdv",
                        label: "PDV",
                        options: {
                            filter: false,
                            sort: false,
                        },
                    }, {
                        name: "creditsCourtesy",
                        label: "Cortesia",
                        options: {
                            filter: false,
                            sort: false,
                        },
                    }, {
                        name: "creditsCash",
                        label: "CASH",
                        options: {
                            filter: false,
                            sort: false,
                        },
                    }, {
                        name: "creditsBss",
                        label: "BSS",
                        options: {
                            filter: false,
                            sort: false,
                        },
                    },
                ]}
                data={userMetrics || []}
                title='Formas de Recaudacion'
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
