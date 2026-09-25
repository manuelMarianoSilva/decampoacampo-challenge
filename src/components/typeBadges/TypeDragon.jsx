import dragonBadge from "../../assets/badges/16.png"
import dragonBadgeSmall from "../../assets/badges/small/16.png"
import styles from "./Badges.module.css"

export const TypeDragonBadge = ({small}) => (
    <img src={small ? dragonBadgeSmall : dragonBadge} alt="Dragon" className={styles.badge}/>
)