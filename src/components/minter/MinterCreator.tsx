import { Typography } from "@mui/material";
import * as React from "react";
import { Ship } from "@/components/minter/Minter";
import minterOptions, { MinterVariant } from "@/config/minterOptions";

const MinterCreator: React.FunctionComponent<{ ship: Ship; setShip: any }> = ({
  ship,
  setShip,
}) => {
  return (
    <div className="minter-creator">
      <div className="minter-creator_column">
        <Typography
          variant={"h4"}
          sx={{ fontWeight: "500" }}
          component={"span"}
        >
          Body
        </Typography>
        <Typography
          variant={"h4"}
          sx={{ fontWeight: "500" }}
          component={"span"}
        >
          Skin
        </Typography>
        <Typography
          variant={"h4"}
          sx={{ fontWeight: "500" }}
          component={"span"}
        >
          Weapon
        </Typography>
        <Typography
          variant={"h4"}
          sx={{ fontWeight: "500" }}
          component={"span"}
        >
          Booster
        </Typography>
      </div>
      <div className="minter-creator_column">
        <div className="minter-creator_options">
          {minterOptions.body.variants.map((variant: MinterVariant, index: number) => (
            <div
              className={`minter-creator_button ${
                index === ship.body ? "active" : ""
              }`}
              key={index}
            >
              { /* Name can be displayed with: variant.name */ }
              <img
                src={minterOptions.body.getPath(index)}
                onClick={() => setShip({ ...ship, body: index })}
              />
            </div>
          ))}
        </div>
        <div className="minter-creator_options">
          {minterOptions.skin.variants.map((variant: MinterVariant, index: number) => (
            <div
              className={`minter-creator_button ${
                index === ship.skin ? "active" : ""
              }`}
              key={index}
            >
              { /* Name can be displayed with: variant.name */ }
              <img
                src={minterOptions.skin.getPath(index)}
                onClick={() => setShip({ ...ship, skin: index })}
              />
            </div>
          ))}
        </div>
        <div className="minter-creator_options">
          {minterOptions.weapon.variants.map((variant: MinterVariant, index: number) => (
            <div
              className={`minter-creator_button ${
                index === ship.weapon ? "active" : ""
              }`}
              key={index}
            >
              { /* Name can be displayed with: variant.name */ }
              <img
                src={minterOptions.weapon.getPath(index)}
                onClick={() => setShip({ ...ship, weapon: index })}
              />
            </div>
          ))}
        </div>
        <div className="minter-creator_options">
          {minterOptions.booster.variants.map((variant: MinterVariant, index: number) => (
            <div
              className={`minter-creator_button ${
                index === ship.booster ? "active" : ""
              }`}
              key={index}
            >
              { /* Name can be displayed with: variant.name */ }
              <img
                src={minterOptions.booster.getPath(index)}
                onClick={() => setShip({ ...ship, booster: index })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinterCreator;
/**/
