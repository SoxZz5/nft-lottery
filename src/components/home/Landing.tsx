import Countdown from "../landing/Countdown";
import * as React from "react";
import { Typography } from "@mui/material";

const Landing: React.FunctionComponent = () => {
  return (
    <div className="landing full-height" id="landing">
      <div className="landing_solar">
        <Typography
          variant={"h4"}
          sx={{ mb: "1rem", mt: "2rem" }}
          component={"h1"}
          color={"white"}
          fontWeight={"bold"}
        >
          Take part of the only one
          <br /> space caritative mission
        </Typography>
        <Countdown />
      </div>
      <div className="landing_subtitle">
        <div className="landing_subtitle-text">
          <Typography variant={"subtitle1"} component={"h2"} color={"white"}>
            Craft your own NFT spaceship to participate in the first
          </Typography>
        </div>
        <div className="landing_subtitle-text">
          <Typography
            variant={"subtitle1"}
            sx={{ ml: "0.75rem" }}
            component={"h2"}
            color={"white"}
          >
            <span className="secondary-text">blockchain charity raffle </span>
            to save humanity.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Landing;
