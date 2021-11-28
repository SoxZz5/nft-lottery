import React from "react";
import ReactDOM from "react-dom";
import App from "@/App";
import "@/assets/styles/global.scss";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/services/mui/createTheme";
import { ChainId, DAppProvider } from "@usedapp/core";
import PolygonChainInfo from "@/config/polygonChain.config";

const DappConfig = {
  readOnlyChainId: PolygonChainInfo.chainId,
  readOnlyUrls: {
    [PolygonChainInfo.chainId]: PolygonChainInfo.rpcUrl,
  },
};

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={DappConfig}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
