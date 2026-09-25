import bugBadge from "../../assets/badges/7.png"
import bugBadgeSmall from "../../assets/badges/small/7.png"
import styles from "./Badges.module.css"

export const TypeBugBadge = ({small}) => (
    <img src={small ? bugBadgeSmall : bugBadge} alt="Bug" className={styles.badge}/>
)