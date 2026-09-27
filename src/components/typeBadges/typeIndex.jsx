import { TypeNormalBadge } from "./TypeNormal.jsx";
import { TypeFightingBadge } from "./TypeFighting.jsx";
import { TypeFlyingBadge } from "./TypeFlying.jsx";
import { TypePoisonBadge } from "./TypePoison.jsx";
import { TypeGroundBadge } from "./TypeGround.jsx";
import { TypeRockBadge } from "./TypeRock.jsx";
import { TypeBugBadge } from "./TypeBug.jsx";
import { TypeGhostBadge } from "./TypeGhost.jsx";
import { TypeSteelBadge } from "./TypeSteel.jsx";
import { TypeFireBadge } from "./TypeFire.jsx";
import { TypeWaterBadge } from "./TypeWater.jsx";
import { TypeGrassBadge } from "./TypeGrass.jsx";
import { TypeElectricBadge } from "./TypeElectric.jsx";
import { TypePsychicBadge } from "./TypePsychic.jsx";
import { TypeIceBadge } from "./TypeIce.jsx";
import { TypeDragonBadge } from "./TypeDragon.jsx";
import { TypeDarkBadge } from "./TypeDark.jsx";
import { TypeFairyBadge } from "./TypeFairy.jsx";

export const typeIndex = {
    1: {
        default: <TypeNormalBadge />,
        small: <TypeNormalBadge small/>
    },
    2: {
        default: <TypeFightingBadge />,
        small: <TypeFightingBadge small/>
    },
    3: {
        default: <TypeFlyingBadge />,
        small: <TypeFlyingBadge small/>
    },
    4: {
        default: <TypePoisonBadge />,
        small: <TypePoisonBadge small/>
    },
    5: {
        default: <TypeGroundBadge />,
        small: <TypeGroundBadge small/>
    },
    6: {
        default: <TypeRockBadge />,
        small: <TypeRockBadge small/>
    },
    7: {
        default: <TypeBugBadge />,
        small: <TypeBugBadge small/>
    },
    8: {
        default: <TypeGhostBadge />,
        small: <TypeGhostBadge small/>
    },
    9: {
        default: <TypeSteelBadge />,
        small: <TypeSteelBadge small/>
    },
    10: {
        default: <TypeFireBadge />,
        small: <TypeFireBadge small/>
    },
    11: {
        default: <TypeWaterBadge />,
        small: <TypeWaterBadge small/>
    },
    12: {
        default: <TypeGrassBadge />,
        small: <TypeGrassBadge small/>
    },
    13: {
        default: <TypeElectricBadge />,
        small: <TypeElectricBadge small/>
    },
    14: {
        default: <TypePsychicBadge />,
        small: <TypePsychicBadge small/>
    },
    15: {
        default: <TypeIceBadge />,
        small: <TypeIceBadge small/>
    },
    16: {
        default: <TypeDragonBadge />,
        small: <TypeDragonBadge small/>
    },
    17: {
        default: <TypeDarkBadge />,
        small: <TypeDarkBadge small/>
    },
    18: {
        default: <TypeFairyBadge />,
        small: <TypeFairyBadge small/>
    }
}

export const typeNameIndex = {
    normal: 1,
    fighting: 2,
    flying: 3,
    poison: 4,
    ground: 5,
    rock: 6,
    bug: 7,
    ghost: 8,
    steel: 9,
    fire: 10,
    water: 11,
    grass: 12,
    electric: 13,
    psychic: 14,
    ice: 15,
    dragon: 16,
    dark: 17,
    fairy: 18,
}

export const typenames = Object.keys(typeNameIndex).map(
    (name) => name[0].toUpperCase() + name.slice(1),
)