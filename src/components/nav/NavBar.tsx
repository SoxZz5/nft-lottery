import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const NavBar: React.FunctionComponent = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Button sx={{ ml: "4rem" }}>LOGO</Button>
          <Button sx={{ ml: "auto" }}>Roadmap</Button>
          <Button sx={{ ml: "2rem" }}>Gallery</Button>
          <Button variant="outlined" sx={{ ml: "2rem", mr: "4rem" }}>
            Connect Wallet
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
