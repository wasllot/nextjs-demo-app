import { Box, Paper } from '@mui/material';
import moment from 'moment/moment';
import React, { useState } from 'react'
import Button from './button';
import Font from './font';
import Modal from './modal';

export default function InfoModal({ info, openInfo, setOpenInfo }) {
    const { from, to, commerce, ammount, createdAt, nfcSystemId } = info
    console.log("🚀 ~ file: InfoModal.jsx:10 ~ InfoModal ~ info", info)
    return (
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
                    width: 450,
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
                        Fecha:
                    </Font>
                    <Font family="brightsight" variant="h4">
                        {`${moment(createdAt).format("DD-MM-YYYY")}`}

                    </Font>
                </Box>
                {nfcSystemId &&
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Font family="brightsight" variant="h4">
                        NFC Id:
                    </Font>
                    <Font family="brightsight" variant="h4">
                        {`${nfcSystemId}`}

                    </Font>
                </Box>}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Font family="brightsight" variant="h4">
                        De:
                    </Font>
                    <Font family="brightsight" variant="h4">
                        {`${from?.firstName}`} <br/> {from?.lastName}

                    </Font>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Font family="brightsight" variant="h4">
                        De:
                    </Font>
                    <Font family="brightsight" variant="h4">
                        {`${from?.firstName} ${from?.lastName}`}

                    </Font>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Font family="brightsight" variant="h4">
                        Para:
                    </Font>
                    <Font family="brightsight" variant="h4">
                        {`${to?.firstName} ${to?.lastName}`}
                    </Font>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Font family="brightsight" variant="h4">
                        Comercio
                    </Font>
                    <Font family="brightsight" variant="h4">
                        {`${commerce?.name}`}
                    </Font>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Font family="brightsight" variant="h4">
                        Monto
                    </Font>
                    <Font family="brightsight" variant="h4">
                        {ammount}
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
    )
}
