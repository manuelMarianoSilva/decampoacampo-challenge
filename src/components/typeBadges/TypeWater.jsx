import waterBadge from "../../assets/badges/11.png"
import waterBadgeSmall from "../../assets/badges/small/11.png"
import styles from "./Badges.module.css"

export const TypeWaterBadge = ({small}) => (
    <img src={small ? waterBadgeSmall : waterBadge} alt="Water" className={styles.badge}/>
)