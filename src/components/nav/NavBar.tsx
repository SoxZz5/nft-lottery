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
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" sx={{ ml: "auto" }}>
            Roadmap
          </Button>
          <Button color="inherit">Gallery</Button>
          <Button color="inherit" sx={{ mr: "4rem" }}>
            Connect Wallet
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
