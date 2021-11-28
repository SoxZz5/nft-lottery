import Countdown from "@/components/landing/Countdown";
import * as React from "react";
import { Typography } from "@mui/material";

const Landing: React.FunctionComponent = () => {
  return (
    <div className="landing full-height" id="landing">
      <div className="landing_solar">
        <div className="landing_solar-content">
          <Typography
            variant={"h4"}
            sx={{ mb: "1rem" }}
            component={"h1"}
            color={"white"}
            fontWeight={"bold"}
          >
            Take part of the only one
            <br /> space caritative mission
          </Typography>
          <Countdown />
        </div>
      </div>
      <div className="landing_info">
        <Typography
          variant={"h5"}
          component={"h3"}
          color={"white"}
          fontWeight={"bold"}
        >
          NFT contract :
        </Typography>
        <Typography variant={"subtitle1"} color={"white"}>
          Coming Soon
        </Typography>
        <Typography
          variant={"h5"}
          component={"h3"}
          color={"white"}
          fontWeight={"bold"}
        >
          Team wallet :
        </Typography>
        <Typography variant={"subtitle1"} color={"white"}>
          Coming Soon
        </Typography>
      </div>
      <div className="landing_subtitle">
        <div className="landing_subtitle-text">
          <Typography variant={"subtitle1"} component={"h2"} color={"white"}>
            Craft your own NFT spaceship to participate in the first
          </Typography>
        </div>
        <div className="landing_subtitle-text">
          <Typography variant={"subtitle1"} component={"h2"} color={"white"}>
            <span className="secondary-text">blockchain charity raffle </span>
            to save humanity.
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Landing;
