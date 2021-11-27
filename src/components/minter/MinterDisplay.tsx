import { Typography } from "@mui/material";
import * as React from "react";
import { Ship } from "./Minter";
import minterOptions from "./minterOptions.json";

const MinterDisplay: React.FunctionComponent<{ ship: Ship }> = ({ ship }) => {
  console.log(ship);
  console.log(minterOptions);
  return (
    <div className="minter-display">
      <img className="body" src={`${minterOptions.body[ship.body]}`} />
      <img className="skin" src={`${minterOptions.skin[ship.skin]}`} />
      <img className="weapon" src={`${minterOptions.weapon[ship.weapon]}`} />
      {ship.booster !== undefined ? (
        <img
          className="booster"
          src={`${minterOptions.booster[ship.booster]}`}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default MinterDisplay;
