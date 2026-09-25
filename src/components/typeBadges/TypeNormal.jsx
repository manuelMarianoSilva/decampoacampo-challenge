import normalBadge from "../../assets/badges/1.png"
import normalBadgeSmall from "../../assets/badges/small/1.png"
import styles from "./Badges.module.css"

export const TypeNormalBadge = ({small}) => (
    <img src={small ? normalBadgeSmall : normalBadge} alt="Normal" className={styles.badge}/>
)