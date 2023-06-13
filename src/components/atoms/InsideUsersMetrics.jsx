import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { getAdminTotalRegisterAndTopUpBalance } from '../../services/commerce'

export default function InsideUsersMetrics({ options, payload }) {

    const [insideUsers, setInsideUsers] = useState(null)
    useEffect(() => {
        (async () => {
            const { response } = await getAdminTotalRegisterAndTopUpBalance(payload)
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
            setInsideUsers(response.map((i) => {
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
    }, [payload])

    const insideUsersColumns = [
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
    ]

    return (
        <MUIDataTable
            title={"Informacion de usuarios internos"}
            data={insideUsers || []}
            columns={insideUsersColumns}
            options={options}
        />
    )
}
