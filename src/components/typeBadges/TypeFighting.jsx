import fightingBadge from "../../assets/badges/2.png"
import fightingBadgeSmall from "../../assets/badges/small/2.png"
import styles from "./Badges.module.css"

export const TypeFightingBadge = ({small}) => (
    <img src={small ? fightingBadgeSmall : fightingBadge} alt="Fighting" className={styles.badge}/>
)