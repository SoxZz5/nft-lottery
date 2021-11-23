import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Link from "@mui/material/Link";
import ConnectButton from "./ConnectButton";
import { useLocation } from "react-router-dom";

const NavBar: React.FunctionComponent = () => {
  const location = useLocation();
  const isActive = (menu: string): any => {
    if (location.hash === menu) {
      return "active";
    }
    return "";
  };
  return (
    <AppBar className="main-menu" color="transparent">
      <div className="main-menu_menu">
        <Link
          sx={{ ml: "10rem" }}
          href="#landing"
          className={`${isActive("#landing")}`}
          underline="none"
        >
          About
        </Link>
        <Link
          sx={{ ml: "4rem" }}
          href="#minter"
          className={`${isActive("#minter")}`}
          underline="none"
        >
          Mint
        </Link>
        <Link
          sx={{ ml: "4rem" }}
          href="#hangar"
          className={`${isActive("#hangar")}`}
          underline="none"
        >
          Hangar
        </Link>
        <Link
          sx={{ ml: "4rem" }}
          href="#roadmap"
          className={`${isActive("#roadmap")}`}
          underline="none"
        >
          Roadmap
        </Link>
        <Link
          sx={{ ml: "4rem" }}
          href="#team"
          className={`${isActive("#team")}`}
          underline="none"
        >
          Team
        </Link>
      </div>
      <ConnectButton>Connect Wallet</ConnectButton>
    </AppBar>
  );
};

export default NavBar;
