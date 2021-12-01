interface MinterOptions {
  body: MinterPart;
  skin: MinterPart;
  weapon: MinterPart;
  booster: MinterPart;
}

class MinterPart {
  name: string; // Used for OpenSea "trait_type"
  basePath: string;
  variants: Array<MinterVariant>;
  
  constructor(_name: string, _basePath: string, _variants: Array<MinterVariant>) {
    this.basePath = _basePath;
    this.name = _name;
    this.variants = _variants;
  }
  
  getPath(index: number): string {
    return `${this.basePath}${index + 1}.png`;
  }
}

interface MinterVariant {
  name: string;
}

const options: MinterOptions = {
  body: new MinterPart("Body", "/images/layers/body/body_", 
  [
    { name: "Bird" },
    { name: "Dart" },
    { name: "Bomber" },
    { name: "Hawk" },
    { name: "Cobra" }
  ]),
  skin: new MinterPart("Skin", "/images/layers/skin/skin_", 
  [
    { name: "Candy" },
    { name: "Angel" },
    { name: "Bat" },
    { name: "Nightmare" },
    { name: "Cadillac" }
  ]),
  weapon: new MinterPart("Weapon", "/images/layers/weapon/weapon_", 
  [
    { name: "Hearts" },
    { name: "Torpedos" },
    { name: "Inferno" },
    { name: "Electromines" },
    { name: "Phasers" }
  ]),
  booster: new MinterPart("Booster", "/images/layers/booster/booster_", 
  [
    { name: "Aerozine" },
    { name: "Hydrazine" },
    { name: "Hydrogen" },
    { name: "Dinitrogen" },
    { name: "Oxygen" }
  ])
};
export default options;
export type { MinterPart, MinterVariant };