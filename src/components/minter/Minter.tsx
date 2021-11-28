import CustomButton from "../utils/CustomButton";
import { Typography } from "@mui/material";
import * as React from "react";
import MinterCreator from "@/components/minter/MinterCreator";
import MinterDisplay from "@/components/minter/MinterDisplay";
import {
  useContractCall,
  useContractFunction,
  useEtherBalance,
  useEthers,
} from "@usedapp/core";
import LotteryContract from "@/hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import { Interface } from "@ethersproject/abi";
import { useEffect, useState } from "react";
import { BigNumber, ethers, utils } from "ethers";
import maticIcon from "@/assets/images/icons/matic.png";
import PolygonChainInfo from "@/config/polygonChain.config";
import { useSelector } from "react-redux";

export type Ship = {
  body: number;
  skin: number;
  weapon: number;
  booster: number;
};

const Minter: React.FunctionComponent = () => {
  const minterStore = useSelector((state: any) => state.minter);
  const userStore = useSelector((state: any) => state.user);
  const [curShip, setCurShip] = React.useState<Ship>({
    body: 0,
    skin: 0,
    weapon: 0,
    booster: 0,
  });
  const [priceDisplay, setPriceDisplay] = React.useState<string>("");
  const [priceUsdDisplay, setPriceUsdDisplay] = React.useState<string>("");
  const priceFeed: any = useContractCall({
    abi: new Interface(LotteryContract.abi),
    address: PolygonChainInfo.contractAddress,
    method: "getPriceToParticipate",
    args: [],
  });
  const pricedUsd: any = useContractCall({
    abi: new Interface(LotteryContract.abi),
    address: PolygonChainInfo.contractAddress,
    method: "entryPriceUsd",
    args: [],
  });
  const { account, activateBrowserWallet } = useEthers();
  const userEtherBalance = useEtherBalance(account);
  const userEtherDisplay = userEtherBalance
    ? utils.formatEther(BigNumber.from(userEtherBalance.toString())).slice(0, 5)
    : "";
  const mintActive = minterStore.state === 2;
  const mintFunc = minterStore.contract.participate;
  const mintSpaceShip = (): void => {
    if (userStore.connected) {
      const shipMintable = [
        [
          curShip.body.toString(),
          curShip.skin.toString(),
          curShip.weapon.toString(),
          curShip.booster.toString(),
        ],
      ];
      try {
        console.log(`[[${shipMintable.toString()}]]`);
        mintFunc(`[${shipMintable.toString()}]`);
      } catch (error: any) {
        console.log(error, shipMintable);
      }
    } else {
      activateBrowserWallet();
    }
  };
  /*const mintFunc = useContractFunction(
    {
      abi: new Interface(LotteryContract.abi),
      address: PolygonChainInfo.contractAddress,
    },
    "participate"
  );*/
  useEffect(() => {
    if (priceFeed) {
      setPriceDisplay(
        utils.formatEther(BigNumber.from(priceFeed.toString())).slice(0, 5)
      );
    }
  }, [priceFeed]);
  useEffect(() => {
    if (pricedUsd) {
      setPriceUsdDisplay(pricedUsd.toString());
    }
  }, [pricedUsd]);

  return (
    <div
      className="minter full-height"
      id="minter"
      style={{
        background: `url("/images/mint-launching.png")`,
        backgroundSize: "cover",
        backgroundPositionY: "100%",
      }}
    >
      <div className="minter_header">
        <Typography
          variant={"h4"}
          component={"h2"}
          sx={{
            ml: "2rem",
            mt: "6.5rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          MINT YOUR SPACESHIP
        </Typography>
        <Typography
          variant={"subtitle1"}
          component={"h3"}
          sx={{
            ml: "auto",
            mt: "6.5rem",
            mr: "2rem",
            fontSize: "2rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {userEtherDisplay ? (
            <span>
              You have : {userEtherDisplay}
              {""}
              <img
                className="matic-icon"
                src={maticIcon}
                style={{ marginLeft: "0.5rem", marginTop: "0.5rem" }}
              />
            </span>
          ) : (
            "Not Connected"
          )}{" "}
        </Typography>
        <Typography
          variant={"subtitle1"}
          component={"h3"}
          sx={{
            ml: "auto",
            mt: "6.5rem",
            mr: "2rem",
            fontSize: "2rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          Unit Price : {priceDisplay}{" "}
          <img
            className="matic-icon"
            src={maticIcon}
            style={{ marginLeft: "0.5rem", marginTop: "0.5rem" }}
          />
        </Typography>
      </div>
      <div className="minter_calculator">
        <MinterDisplay ship={curShip} />
        <MinterCreator ship={curShip} setShip={setCurShip} />
      </div>
      <div className="minter_validator">
        <div className="minter_validator-left" />
        <div className="minter_validator-right">
          {mintActive ? (
            <CustomButton onClick={mintSpaceShip}>Mint</CustomButton>
          ) : (
            <CustomButton>Coming Soon</CustomButton>
          )}
          <Typography
            variant={"h4"}
            sx={{
              fontWeight: "500",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            component={"span"}
          >
            {priceDisplay}{" "}
            <img
              className="matic-icon"
              src={maticIcon}
              style={{ marginLeft: "1rem", marginRight: "2rem" }}
            />{" "}
            |
          </Typography>
          <Typography
            variant={"h4"}
            sx={{ fontWeight: "500", fontSize: "2rem", ml: "2rem" }}
            component={"span"}
          >
            {priceUsdDisplay} $
          </Typography>
        </div>
      </div>
      <div className="minter_disclaimer">
        <Typography variant={"subtitle1"} component={"h2"} color={"white"}>
          You can mint as many ships as you want until the countdown. The more
          ships you have,
          <br /> the better your chances of becoming one of the 3 great heroes
          of this adventure.
          <br /> By the way,{" "}
          <span className="secondary-text">
            100% of the ships revenues will be donated*
          </span>{" "}
          to <a href="#">the associations</a>.
        </Typography>
      </div>
    </div>
  );
};

export default Minter;
