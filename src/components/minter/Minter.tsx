import CustomButton from "../utils/CustomButton";
import { Typography } from "@mui/material";
import * as React from "react";
import MinterCreator from "./MinterCreator";
import MinterDisplay from "./MinterDisplay";

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
  return (
    <div className="minter full-height" id="minter">
      <div className="minter_header">
        <Typography
          variant={"h4"}
          component={"h2"}
          sx={{ ml: "2rem", mt: "6.5rem" }}
        >
          MINT YOUR SPACESHIP
        </Typography>
        <Typography
          variant={"subtitle1"}
          component={"h3"}
          sx={{ ml: "auto", mt: "6.5rem", mr: "2rem" }}
        >
          Unit Price : x $
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
            sx={{ fontWeight: "500" }}
            component={"span"}
          >
            0.034 BNB |
          </Typography>
          <Typography
            variant={"subtitle1"}
            sx={{ fontWeight: "500", fontSize: "2rem", ml: "2rem" }}
            component={"span"}
          >
            25$
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
