import { Typography } from "@mui/material";
import { lineHeight } from "@mui/system";
import * as React from "react";
import shipImg from "@/assets/images/ship-workspace.png";
import genesisA from "@/assets/images/genesis/ship_a.png";
import genesisB from "@/assets/images/genesis/ship_b.png";
import genesisC from "@/assets/images/genesis/ship_c.png";
import genesisD from "@/assets/images/genesis/ship_d.png";
import genesisE from "@/assets/images/genesis/ship_e.png";

type RoadmapEl = {
  title: string;
  desc: string;
};

const Roadmap: React.FunctionComponent = () => {
  const roadmap: RoadmapEl[] = [
    {
      title: "End Development",
      desc: "We need to end the development the application development to make the space a better place to be :)",
    },
    {
      title: "Minting Period",
      desc: "You can craft as many ships as you want. Each one represents a raffle ticket for the adventure time.",
    },
    { title: "Tombola Preparation", desc: "" },
    { title: "Adventure Time", desc: "" },
    { title: "Results", desc: "" },
    { title: "Release of fund to associations", desc: "" },
  ];
  return (
    <div
      className="full-height roadmap"
      id="roadmap"
      style={{
        background: `url("/images/roadmap-bg.png")`,
        backgroundSize: "cover",
        backgroundPositionY: "25%",
        backgroundPositionX: "50%",
      }}
    >
      <div className="roadmap-overlay">
        <img src={genesisA} className="genesis-a" />
        <img src={genesisB} className="genesis-b" />
        <img src={genesisC} className="genesis-c" />
        <img src={genesisD} className="genesis-d" />
        <img src={genesisE} className="genesis-e" />
      </div>
      <img src={shipImg} className="roadmap-ship" />
      <Typography
        variant={"h4"}
        component={"h2"}
        sx={{ ml: "4rem", mt: "6.5rem" }}
      >
        ROADMAP EVENTS
      </Typography>
      <div className="roadmap-content">
        {roadmap.map((el: RoadmapEl, index: number) => {
          return (
            <div
              className="roadmap-content_element"
              key={index}
              style={{ marginLeft: index % 2 ? "33%" : "0" }}
            >
              <Typography
                variant={"h5"}
                component={"h2"}
                sx={{ fontSize: "2rem", fontWeight: "700", mb: "0.75rem" }}
              >
                <span className="color-red">{index + 1} |</span> {el.title}
              </Typography>
              <Typography
                variant={"subtitle1"}
                component={"span"}
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  lineHeight: "1.5rem",
                }}
              >
                {el.desc !== "" ? el.desc : "Coming Soon"}
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
