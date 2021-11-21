import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import ConnectButton from "./ConnectButton";

const NavBar: React.FunctionComponent = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Button>LOGO</Button>
          <Button sx={{ ml: "auto" }}>About</Button>
          <Button sx={{ ml: "2rem" }}>Mint</Button>
          <Button sx={{ ml: "2rem" }}>Hangar</Button>
          <Button sx={{ ml: "2rem" }}>Roadmap</Button>
          <Button sx={{ ml: "2rem", mr: "2rem" }}>Team</Button>
          <ConnectButton>Connect Wallet</ConnectButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
