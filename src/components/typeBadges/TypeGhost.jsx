import ghostBadge from "../../assets/badges/8.png"
import ghostBadgeSmall from "../../assets/badges/small/8.png"
import styles from "./Badges.module.css"

export const TypeGhostBadge = ({small}) => (
    <img src={small ? ghostBadgeSmall : ghostBadge} alt="Ghost" className={styles.badge}/>
)