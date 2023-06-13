import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#FECC1D",
    },
    secondary: {
      main: "#000",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: ["Raleway", "Gotham", "Lato"].join(","),
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: "Raleway, sans-serif",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: Gotham;
          src: url("/fonts/Gotham/GothamBold.ttf");
          format: ("ttf");
          font-display: swap;
        }
        @font-face {
          font-family: Raleway;
          src: url("/fonts/Raleway/Raleway-Regular.ttf");
          format: ("ttf");
          font-display: swap;
        }
        @font-face {
          font-family: Lato;
          src: url("/fonts/Lato/Lato-Regular.ttf");
          format: ("ttf");
          font-display: swap;
        }
      `,
    },
  },
});

export default theme;
