import * as React from "react";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useContractCall } from "@usedapp/core";
import { Interface } from "ethers/lib/utils";
import LotteryContract from "@/hardhat/artifacts/contracts/Lottery.sol/Lottery.json";
import LotteryState from "@/config/lotteryState";
import PolygonChainInfo from "@/config/polygonChain.config";
import { BigNumber } from "@ethersproject/bignumber";
import moment from "moment";
import { useDispatch } from "react-redux";
import * as MinterService from "@/services/redux/minter/minter.action";

const Countdown: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  let stateFeed: Array<number> = [];
  let periods: Array<BigNumber> = [];
  if (PolygonChainInfo.contractAddress !== "") {
    stateFeed = useContractCall({
      abi: new Interface(LotteryContract.abi),
      address: PolygonChainInfo.contractAddress,
      method: "getState",
      args: [],
    }) as Array<number>;
    periods = useContractCall({
      abi: new Interface(LotteryContract.abi),
      address: PolygonChainInfo.contractAddress,
      method: "periods",
      args: [],
    }) as Array<BigNumber>;
  }
  const [curState, setCurState] = useState("Coming soon");
  const [curEnd, setCurEnd] = useState(moment().valueOf());
  const [countdownActive, setCountdownActive] = useState(false);
  useEffect(() => {
    if (stateFeed && stateFeed.length > 0) {
      setCurState(LotteryState[stateFeed[0]]);
      dispatch(MinterService.setState(stateFeed[0]));
      if (stateFeed[0] >= 2 && stateFeed[0] < 6) {
        let now = new Date().getTime();
        let difference = Math.abs(curEnd - now);
        if (!countdownActive && difference > 0) setCountdownActive(true);
      }
    }
  }, [stateFeed]);
  useEffect(() => {
    if (periods && periods.length > 0) {
      setCurEnd(moment.unix(periods[1].toNumber()).valueOf());
    }
  }, [periods]);
  const calculateTimeLeft = () => {
    let now = moment().valueOf();
    let difference = Math.abs(curEnd - now);
    let timeLeft: any = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
      if (timeLeft.days < 10) timeLeft.days = `0${timeLeft.days}`;
      if (timeLeft.hours < 10) timeLeft.hours = `0${timeLeft.hours}`;
      if (timeLeft.minutes < 10) timeLeft.minutes = `0${timeLeft.minutes}`;
      if (timeLeft.seconds < 10) timeLeft.seconds = `0${timeLeft.seconds}`;
    } else {
      if (countdownActive) setCountdownActive(false);
    }

    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft()) as any;

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents: any = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <Typography
        key={interval.slice(0, 1)}
        variant={"h4"}
        color={"white"}
        fontWeight={"bold"}
      >
        {timeLeft[interval]} {interval.slice(0, 1) !== "s" ? ` : ` : ""}
      </Typography>
    );
  });
  return (
    <div className={`landing_countdown ${countdownActive ? "" : "notActive"}`}>
      <Typography variant={"h4"} color={"white"} fontWeight={"bold"}>
        {curState}
      </Typography>
      {countdownActive ? (
        <div>
          {timerComponents.length ? (
            timerComponents
          ) : (
            <Typography variant={"h4"} color={"white"} fontWeight={"bold"}>
              Time's up!
            </Typography>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Countdown;
