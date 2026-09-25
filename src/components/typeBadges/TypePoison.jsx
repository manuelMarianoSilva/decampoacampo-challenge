import poisonBadge from "../../assets/badges/4.png"
import poisonBadgeSmall from "../../assets/badges/small/4.png"
import styles from "./Badges.module.css"

export const TypePoisonBadge = ({small}) => (
    <img src={small ? poisonBadgeSmall : poisonBadge} alt="Poison" className={styles.badge}/>
)