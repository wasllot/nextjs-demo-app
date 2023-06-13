import { AppBar, Box, Button, Drawer, IconButton, Link, Toolbar } from "@mui/material";
import NavList from "./navList";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Exit, UserIcon } from "../icons";
export default function Navbar() {
    const [open, setOpen]= useState(false)
    return(
        <>
        <AppBar position="static" alignItems= "center" sx={{backgroundColor: "#04002F", height:"83px"}}>
            <Toolbar sx={{height:"100%"}}>
                <Box
                component={"img"}
                sx={{
                width: "156px",
                marginTop:"10px",
                }}
                alt="Back9."
                src="/back-9-w.svg"
                />
                <IconButton  sx={{display: {xs:"flex", sm: "none"} , flexGrow:1, justifyContent:"right",color:"#FFF"}}>
                    <MenuIcon onClick={()=> setOpen(true)} />
                </IconButton>
                <Box sx={{display: {xs:"none", sm: "flex"}, flexGrow:1, justifyContent:"right", alignItems: "center"}}>
                    <Link component="a" href="/profile" underline="none" sx={{color: "#FFF", fontSize: "20px", fontFamily: "Raleway", paddingRight: "30px"}}>
                         Perfil  <UserIcon />
                    </Link>
                    <Link component="a" href="/login" underline="none" sx={{color: "#FFF", fontSize: "20px", fontFamily: "Raleway", paddingRight: "10%"}}>
                        Cerrar Sesión <Exit />
                    </Link>
                </Box>
            </Toolbar>
        </AppBar>
       
        <Drawer 
            open={open}
            anchor="right"
            onClose={()=>setOpen(false)}>
            <NavList /> 
        </Drawer>
       </>
    );
  
}
