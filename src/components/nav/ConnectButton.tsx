import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as UserService from "@/services/redux/user/user.action";
import * as MinterService from "@/services/redux/minter/minter.action";
import LotteryAbi from "@/hardhat/artifacts/contracts/Lottery.sol/Lottery.json";

//@ts-ignore
import { useEthers } from "@usedapp/core";
import CustomButton from "@/components/utils/CustomButton";
import PolygonChainInfo from "@/config/polygonChain.config";
import { Contract, ethers, utils } from "ethers";
const ConnectButton: React.FunctionComponent = () => {
  const connected = useSelector((state: any) => state.user.connected);
  const stateAccount = useSelector((state: any) => state.user.account);
  const dispatch = useDispatch();
  const { activateBrowserWallet, deactivate, account, chainId, library } =
    useEthers();

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  function handleDisconnectWallet() {
    deactivate();
  }

  const handleChainConnection = async () => {
    try {
      const params = [
        {
          chainId: PolygonChainInfo.hexChaindId,
          chainName: PolygonChainInfo.name,
          rpcUrls: [PolygonChainInfo.rpcUrl],
          blockExplorerUrls: [PolygonChainInfo.blockExplorer],
        },
      ];
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: params,
      });
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: PolygonChainInfo.hexChaindId }],
      });
    } catch (switchError) {
      console.log(switchError);
    }
  };

  useEffect(() => {
    if (chainId !== PolygonChainInfo.chainId) {
      handleChainConnection();
    }
    if (account) {
      dispatch(UserService.connect(account, chainId ?? ""));
      const signer = library?.getSigner();
      dispatch(
        MinterService.setContract(
          new Contract(
            PolygonChainInfo.contractAddress,
            new utils.Interface(LotteryAbi.abi),
            signer
          )
        )
      );
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
