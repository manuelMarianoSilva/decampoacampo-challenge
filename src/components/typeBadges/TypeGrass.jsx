import grassBadge from "../../assets/badges/12.png"
import grassBadgeSmall from "../../assets/badges/small/12.png"
import styles from "./Badges.module.css"

export const TypeGrassBadge = ({small}) => (
    <img src={small ? grassBadgeSmall : grassBadge} alt="Grass" className={styles.badge}/>
)