import { Typography } from "@mui/material";
import * as React from "react";

const Hangar: React.FunctionComponent = () => {
  return (
    <div className="full-height" id="hangar">
      <Typography
        variant={"h5"}
        component={"h2"}
        sx={{ ml: "2rem", mt: "5rem" }}
      >
        SPACE HANGAR
      </Typography>
    </div>
  );
};

export default Hangar;
