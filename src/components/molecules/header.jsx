import { Grid } from "@mui/material";

export default function Header(){

    return (
        <Grid container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
            backgroundColor:"#04002F",
            height:"90px",
            padding: "20px 40px",
            marginBottom: "250px",

        }}>
        <Grid
        component={"img"}
        src="/back-9-w.svg"
        alt="Back9"
        sx={[{ zIndex: 2, width: "156px" }]}
      />
      

        </Grid>
    );
 
}