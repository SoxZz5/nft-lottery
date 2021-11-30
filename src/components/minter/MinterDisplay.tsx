import * as React from "react";
import { Ship } from "@/components/minter/Minter";
import minterOptions from "@/config/minterOptions";

const MinterDisplay: React.FunctionComponent<{ ship: Ship }> = ({ ship }) => {
  return (
    <div className="minter-display">
      <img className="body" src={`${minterOptions.body.getPath(ship.body)}`} />
      <img className="skin" src={`${minterOptions.skin.getPath(ship.skin)}`} />
      <img className="weapon" src={`${minterOptions.weapon.getPath(ship.weapon)}`} />
      {ship.booster !== undefined ? (
        <img
          className="booster"
          src={`${minterOptions.booster.getPath(ship.booster)}`}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default MinterDisplay;
