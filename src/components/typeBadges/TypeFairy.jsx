import fairyBadge from "../../assets/badges/18.png"
import fairyBadgeSmall from "../../assets/badges/small/18.png"
import styles from "./Badges.module.css"

export const TypeFairyBadge = ({ small }) => (
    <img src={small ? fairyBadgeSmall : fairyBadge} alt="Fairy" className={styles.badge} />
)