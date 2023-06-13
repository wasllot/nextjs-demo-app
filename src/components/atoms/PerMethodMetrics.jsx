import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { getAdminsTotalPaymentMethod, getTotalGeneratePaymentMethod } from '../../services/commerce'

export default function PerMethodMetrics({ options, payload }) {
    const [perMethodMetrics, setPerMethodMetrics] = useState(null)
    useEffect(() => {
        (async () => {
            const { response: r1 } = await getTotalGeneratePaymentMethod(payload)
            const { response: r2 } = await getAdminsTotalPaymentMethod(payload)

            setPerMethodMetrics([...r2.map((i) => {
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
                name: <strong>{'TOTAL'}</strong>,
                ...r1
            }])
        })()
    }, [payload])

    const perMethodColumns = [
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
    ]

    return (
        <MUIDataTable
            title={"Recaudo por método de pago"}
            data={perMethodMetrics || []}
            columns={perMethodColumns}
            options={options}
        />
    )
}
