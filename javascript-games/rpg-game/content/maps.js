import { OutsideLeft } from "./maps/OutsideLeft.js";
import { Home } from "./maps/Home.js";
import { OutsideBottom } from "./maps/OutsideBottom.js";
import { OutsideRight } from "./maps/OutsideRight.js";
import { Mansion } from "./maps/Mansion.js";
import { LocalShop } from "./maps/LocalShop.js";
import { OldManHouse } from "./maps/OldManHouse.js";
import { SocialClubRoom } from "./maps/SocialClubRoom.js";
import { Arena } from "./maps/Arena.js";
import { MediumHouse } from "./maps/MediumHouse.js";
import { SmallHouse } from "./maps/SmallHouse.js";
import { BigHouse } from "./maps/BigHouse.js";
import { SmallShop } from "./maps/SmallShop.js";
import { BramblePath } from "./maps/BramblePath.js";
import { MillbrookCrossing } from "./maps/MillbrookCrossing.js";
import { EmberlightTunnels } from "./maps/EmberlightTunnels.js";

export class Maps {
  constructor() {
    this.maps = {
      OutsideLeft,
      Home,
      OutsideBottom,
      OutsideRight,

      Mansion,
      OldManHouse,
      SocialClubRoom,
      SmallHouse,
      MediumHouse,
      BigHouse,
      Arena,

      SmallShop,
      LocalShop,

      BramblePath,
      MillbrookCrossing,
      EmberlightTunnels,
    };
  }
}
