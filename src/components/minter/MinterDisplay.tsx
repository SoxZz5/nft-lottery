import * as React from "react";
import { Ship } from "@/components/minter/Minter";
import minterOptions from "@/components/minter/minterOptions.json";

const MinterDisplay: React.FunctionComponent<{ ship: Ship }> = ({ ship }) => {
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
