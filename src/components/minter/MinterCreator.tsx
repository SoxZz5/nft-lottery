import { Typography } from "@mui/material";
import * as React from "react";
import { Ship } from "@/components/minter/Minter";
import minterOptions from "@/components/minter/minterOptions.json";

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
          {minterOptions.body.map((body: string, index: number) => (
            <div
              className={`minter-creator_button ${
                index === ship.body ? "active" : ""
              }`}
              key={index}
            >
              <img
                src={body}
                onClick={() => setShip({ ...ship, body: index })}
              />
            </div>
          ))}
        </div>
        <div className="minter-creator_options">
          {minterOptions.skin.map((skin: string, index: number) => (
            <div
              className={`minter-creator_button ${
                index === ship.skin ? "active" : ""
              }`}
              key={index}
            >
              <img
                src={skin}
                onClick={() => setShip({ ...ship, skin: index })}
              />
            </div>
          ))}
        </div>
        <div className="minter-creator_options">
          {minterOptions.weapon.map((weapon: string, index: number) => (
            <div
              className={`minter-creator_button ${
                index === ship.weapon ? "active" : ""
              }`}
              key={index}
            >
              <img
                src={weapon}
                onClick={() => setShip({ ...ship, weapon: index })}
              />
            </div>
          ))}
        </div>
        <div className="minter-creator_options">
          {minterOptions.booster.map((booster: string, index: number) => (
            <div
              className={`minter-creator_button ${
                index === ship.booster ? "active" : ""
              }`}
              key={index}
            >
              <img
                src={booster}
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
