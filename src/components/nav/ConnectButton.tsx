import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as UserService from "@/services/redux/user/user.action";
//@ts-ignore
import { useEthers } from "@usedapp/core";
import CustomButton from "@/components/utils/CustomButton";
import PolygonChainInfo from "@/config/polygonChain.config";
import { BigNumber } from "ethers";

const ConnectButton: React.FunctionComponent = () => {
  const connected = useSelector((state: any) => state.user.connected);
  const stateAccount = useSelector((state: any) => state.user.account);
  const dispatch = useDispatch();
  const { activateBrowserWallet, deactivate, account, chainId } = useEthers();

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  function handleDisconnectWallet() {
    deactivate();
  }

  useEffect(() => {
    if (account) {
      if (chainId !== PolygonChainInfo.chainId) {
        const eth: any = (window as any).ethereum;
        console.log(PolygonChainInfo.hexChaindId);
        eth
          .request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: PolygonChainInfo.hexChaindId,
                chainName: PolygonChainInfo.name,
                rpcUrls: [PolygonChainInfo.rpcUrl],
                blockExplorerUrls: [PolygonChainInfo.blockExplorer],
              },
            ],
          })
          .catch((error: any) => {
            console.log(error);
          });
      }
      dispatch(UserService.connect(account, chainId ?? ""));
    } else {
      dispatch(UserService.disconnect());
    }
  }, [account, chainId]);

  return !connected ? (
    <CustomButton variant="outlined" onClick={handleConnectWallet}>
      Connect wallet
    </CustomButton>
  ) : (
    <CustomButton variant="outlined">{`${stateAccount.slice(
      0,
      11
    )}...`}</CustomButton>
  );
};

export default ConnectButton;
