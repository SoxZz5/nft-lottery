import { Typography } from "@mui/material";
import * as React from "react";

const Hangar: React.FunctionComponent = () => {
  return (
    <div
      className="full-height hangar"
      id="hangar"
      style={{ background: `url("/images/hangar.png")` }}
    >
      <Typography
        variant={"h4"}
        component={"h2"}
        sx={{ ml: "4rem", mt: "6.5rem" }}
      >
        SPACE HANGAR
      </Typography>
    </div>
  );
};

export default Hangar;
