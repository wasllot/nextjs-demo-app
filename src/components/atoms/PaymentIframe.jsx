import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
// import { base, urls } from "src/constants";

//import { reservationsService } from "src/services";


//Mui materials
import { Grid } from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
  } from "@mui/material";
import Spinner from "./spinner";

export default function PaymentIframe({ currency, reserveToken }) {

    const [loading, setLoading] = useState(false)
    //const [isTokenValid, setIsTokenValid] = useState(false)
    const [showPopup, setShowPopup] = useState(false)
    const router = useRouter()

    useEffect(() => {
        window.addEventListener('message', getMessage)
    }, [])


    function getMessage(e) {
        const data = e.data
        //console.log(data)

        if (data.type === 'loading') {

            setLoading(data.response.loading)

        }

        else if (data.type === 'response') {
            if (data.status === 200) {

                //console.log(data.response.paymentStatus)

                //setPaymentStatus(data.response.paymentStatus)

                //console.log(data.response.paymentStatus)


                //console.log('pago exitoso')
                if(data.response.paymentStatus === 'approved'){
                 router.push({
                    pathname:'/thankyou',
                    query:{ token : `${reserveToken}` },
                    as: '/thankyou'
                }) }
                else if(data.response.paymentStatus === 'pending'){
                    router.push({
                        pathname:'/boletos/checkout/pending',
                        query:{ token : `${reserveToken}` },
                    }) 
                }

            }
            else if(data.status === 400){
                //console.log(data.state.error.message)
            }

            else {
                //console.log(data.state.error.message)
                setLoading(false)
                setOpenIframe(true)

            }
        } else if (data.type === 'back') {
            props.goback()
        }

    }

    let iframestyle = {
        width: '100%',
        minHeight: '786px',
        height: 'auto',

        marginTop: '0px',
        border: 'none',
        /* backgroundColor: 'white', */



    }

    const [renderIframe, setRenderIframe] = useState(iframestyle)



    //console.log(reserveToken)



    return (


        <div style={{ width: '100%' }} >
            <Spinner loading={loading} />

            
                <Dialog open={showPopup} onClose={() => { setShowPopup(false) }}>
                    <Grid container>
                        <Grid item xs={12} sx={{ textAlign: "end", marginRight: "10px" }}>
                            {/* <CloseIcon onClick={() => setIsDialogInicioOpen(false)} /> */}
                        </Grid>
                        <Grid item xs={12}>
                            <DialogTitle sx={{ textAlign: "center" }}>
                                Fallo en la reservación
                            </DialogTitle>
                        </Grid>

                        <DialogContent>
                            <DialogContentText>
                                No se ha podio verificar tu reserva. Porfavor vuelva a la pagina anterior e intente de nuevo.
                            </DialogContentText>
                        </DialogContent>
                    </Grid>
                </Dialog>
                
                <iframe src={`https://api.b9ticketing.com/api/v1?r=${reserveToken}&currency=${currency}`}
                    style={renderIframe}></iframe>
            
        </div>
    )

}

