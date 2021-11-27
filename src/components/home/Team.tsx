import { Typography } from "@mui/material";
import * as React from "react";

const Team: React.FunctionComponent = () => {
  return (
    <div className="full-height" id="team">
      <Typography
        variant={"h5"}
        component={"h2"}
        sx={{ ml: "2rem", mt: "10rem" }}
      >
        PROJECT TEAM
      </Typography>
    </div>
  );
};

export default Team;
