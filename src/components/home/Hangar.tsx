import { Typography } from "@mui/material";
import * as React from "react";

const Hangar: React.FunctionComponent = () => {
  return (
    <div className="full-height hangar" id="hangar">
      <Typography
        variant={"h5"}
        component={"h2"}
        sx={{ ml: "2rem", mt: "10rem" }}
      >
        SPACE HANGAR
      </Typography>
    </div>
  );
};

export default Hangar;
