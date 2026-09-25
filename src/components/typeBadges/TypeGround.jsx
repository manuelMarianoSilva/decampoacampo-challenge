import groundBadge from "../../assets/badges/5.png"
import groundBadgeSmall from "../../assets/badges/small/5.png"
import styles from "./Badges.module.css"

export const TypeGroundBadge = ({small}) => (
    <img src={small ? groundBadgeSmall : groundBadge} alt="Ground" className={styles.badge}/>
)