import PolygonChainInfo from "@/config/polygonChain.config";
import { Contract } from "@ethersproject/contracts";
import { PayloadAction } from "@reduxjs/toolkit";
import { ethers, utils } from "ethers";
import { MinterAction, MinterState } from "./minter.interface";
import LotteryAbi from "@/hardhat/artifacts/contracts/Lottery.sol/Lottery.json";

const provider = new ethers.providers.Web3Provider((window as any).ethereum);
const signer = provider.getSigner();
const initialState: MinterState = {
  state: 0,
  contract: new Contract(
    PolygonChainInfo.contractAddress,
    new utils.Interface(LotteryAbi.abi),
    signer
  ),
};

const minterReducer = (
  state = initialState,
  action: PayloadAction<any>
): MinterState => {
  switch (action.type) {
    case MinterAction.SET_STATE:
      return { ...state, state: action.payload };
    default:
      return state;
  }
};

export default minterReducer;
