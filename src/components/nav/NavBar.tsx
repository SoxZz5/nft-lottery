import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import ConnectButton from "./ConnectButton";

const NavBar: React.FunctionComponent = () => {
  return (
    <AppBar className="main-menu" position="static" color="transparent">
      <Toolbar>
        <Button>LOGO</Button>
        <Button sx={{ ml: "auto" }} href="#lading">
          About
        </Button>
        <Button sx={{ ml: "4rem" }} href="#minter">
          Mint
        </Button>
        <Button sx={{ ml: "4rem" }} href="#hangar">
          Hangar
        </Button>
        <Button sx={{ ml: "4rem" }} href="#roadmap">
          Roadmap
        </Button>
        <Button sx={{ ml: "4rem", mr: "2rem" }} href="#team">
          Team
        </Button>
        <ConnectButton>Connect Wallet</ConnectButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
