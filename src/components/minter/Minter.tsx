import CustomButton from "../utils/CustomButton";
import { Typography } from "@mui/material";
import * as React from "react";
import MinterCreator from "@/components/minter/MinterCreator";
import MinterDisplay from "@/components/minter/MinterDisplay";
import { useContractCall, useEthers } from "@usedapp/core";
import LotteryContract from "@/hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import { Interface } from "@ethersproject/abi";
import { useEffect, useState } from "react";
import { BigNumber, utils } from "ethers";
import maticIcon from "@/assets/images/icons/matic.png";

export type Ship = {
  body: number;
  skin: number;
  weapon: number;
  booster?: number;
  shield?: number;
};

const Minter: React.FunctionComponent = () => {
  const [curShip, setCurShip] = React.useState<Ship>({
    body: 0,
    skin: 0,
    weapon: 0,
    booster: 0,
  });
  const [priceDisplay, setPriceDisplay] = React.useState<string>("");
  const priceFeed: any = useContractCall({
    abi: new Interface(LotteryContract.abi),
    address: "0x8b17cfc20c6abef886e5d93a70b17d2f3bb28615",
    method: "getPriceToParticipate",
    args: [],
  });
  useEffect(() => {
    if (priceFeed) {
      setPriceDisplay(
        utils.formatEther(BigNumber.from(priceFeed.toString())).slice(0, 5)
      );
    }
  }, [priceFeed]);

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
        <div className="minter_validator-right">
          <CustomButton>Coming Soon</CustomButton>
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
            19 $cam Coin
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
