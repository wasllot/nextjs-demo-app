import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { getUserMetrics } from '../../services/users'

export default function UserMetrics({ options, payload }) {
    const [userMetrics, setUsersMetrics] = useState(null)
    useEffect(() => {
        (async () => {
            const { response } = await getUserMetrics(payload)
            setUsersMetrics(response)
            console.log(response, 'gy')
        })()
    }, [payload])

    const userMetricsColumns = [
        {
            name: "totalUsers",
            label: "Usuarios Totales",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "totalBalance",
            label: "Saldo Total",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "userWihBalance",
            label: "Con Creditos",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "userWihOutBalance",
            label: "Con Saldo 0",
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: "totalUnPaidBalance",
            label: "Saldo por Recargar",
            options: {
                filter: false,
                sort: false,
            },
        },
    ]
    return (
        <MUIDataTable
            title={"Informacion de usuarios"}
            data={[userMetrics] || []}
            columns={userMetricsColumns}
            options={options}
        />
    )
}
