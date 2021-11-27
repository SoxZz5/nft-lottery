import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./assets/styles/global.scss";
import { ThemeProvider } from "@mui/material";
import { theme } from "./services/mui/createTheme";
import { ChainId, DAppProvider } from "@usedapp/core";

const DappConfig = {
  readOnlyChainId: ChainId.Mainnet,
  /*readOnlyUrls: {
    [ChainId.Mainnet]: `${import.meta.env.MUMBAI_RPC_URL}`,
  },*/
};

console.log("START APP WITH", DappConfig);

//listReactFiles(__dirname).then((files: any) => console.log(files));

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
