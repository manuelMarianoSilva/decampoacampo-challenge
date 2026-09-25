import fireBadge from "../../assets/badges/10.png"
import fireBadgeSmall from "../../assets/badges/small/10.png"
import styles from "./Badges.module.css"

export const TypeFireBadge = ({small}) => (
    <img src={small ? fireBadgeSmall : fireBadge} alt="Fire" className={styles.badge}/>
)