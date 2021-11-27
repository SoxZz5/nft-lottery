import { Typography } from "@mui/material";
import * as React from "react";

const Roadmap: React.FunctionComponent = () => {
  return (
    <div className="full-height roadmap" id="roadmap">
      <div className="roadmap-overlay" />
      <Typography
        variant={"h5"}
        component={"h2"}
        sx={{ ml: "2rem", mt: "10rem" }}
      >
        ROADMAP EVENTS
      </Typography>
    </div>
  );
};

export default Roadmap;
