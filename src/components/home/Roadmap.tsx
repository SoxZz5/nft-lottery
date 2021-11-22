import { Typography } from "@mui/material";
import * as React from "react";

const Roadmap: React.FunctionComponent = () => {
  return (
    <div className="full-height" id="roadmap">
      <Typography
        variant={"h5"}
        component={"h2"}
        sx={{ ml: "2rem", mt: "5rem" }}
      >
        ROADMAP EVENTS
      </Typography>
    </div>
  );
};

export default Roadmap;
