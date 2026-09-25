import steelBadge from "../../assets/badges/9.png"
import steelBadgeSmall from "../../assets/badges/small/9.png"
import styles from "./Badges.module.css"

export const TypeSteelBadge = ({small}) => (
    <img src={small ? steelBadgeSmall : steelBadge} alt="Steel" className={styles.badge}/>
)