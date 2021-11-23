import { Typography } from "@mui/material";
import * as React from "react";

const Minter: React.FunctionComponent = () => {
  return (
    <div className="minter full-height" id="minter">
      <div className="minter_header">
        <Typography
          variant={"h5"}
          component={"h2"}
          sx={{ ml: "2rem", mt: "5rem" }}
        >
          MINT YOUR SPACESHIP
        </Typography>
        <Typography
          variant={"subtitle1"}
          component={"h3"}
          sx={{ ml: "auto", mt: "5rem", mr: "2rem" }}
        >
          Unit Price : x $
        </Typography>
      </div>
    </div>
  );
};

export default Minter;
