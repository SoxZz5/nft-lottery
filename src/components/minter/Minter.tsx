import { Typography } from "@mui/material";
import * as React from "react";
import MinterDisplay from "./MinterDisplay";

type Ship = {
  body: string;
  skin: string;
  weapon: string;
  booster?: string;
  shield?: string;
};

const Minter: React.FunctionComponent = () => {
  const [curShip, setCurShip] = React.useState<Ship>({});
  return (
    <div className="minter full-height" id="minter">
      <div className="minter_header">
        <Typography
          variant={"h5"}
          component={"h2"}
          sx={{ ml: "2rem", mt: "10rem" }}
        >
          MINT YOUR SPACESHIP
        </Typography>
        <Typography
          variant={"subtitle1"}
          component={"h3"}
          sx={{ ml: "auto", mt: "10rem", mr: "2rem" }}
        >
          Unit Price : x $
        </Typography>
      </div>
      <div className="minter_calculator">
        <MinterDisplay />
      </div>
    </div>
  );
};

export default Minter;
