import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#36013f",
    },
    secondary: {
      main: "#FF00FF",
    },
    background: {
      default: "#141414",
      paper: "#3d3d3d",
    },
    info: {
      main: "#8663c7",
    },
  },
  typography: {
    h1: {
      fontFamily: "Orbitron",
    },
    h2: {
      fontFamily: "Orbitron",
    },
    h3: {
      fontFamily: "Orbitron",
    },
    h4: {
      fontFamily: "Orbitron",
    },
    h5: {
      fontFamily: "Orbitron",
    },
    h6: {
      fontFamily: "Orbitron",
    },
    subtitle1: {
      fontFamily: "Raleway",
    },
    subtitle2: {
      fontFamily: "Raleway",
    },
    body1: {
      fontFamily: "Raleway",
    },
    body2: {
      fontFamily: "Raleway",
    },
    fontFamily: "Raleway",
    button: {
      fontFamily: "Orbitron",
      fontSize: "0.8rem",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          position: "absolute",
          top: "0",
          width: "100%",
          zIndex: "9999",
        },
      },
    },
  },
});
