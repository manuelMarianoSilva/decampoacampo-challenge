import darkBadge from "../../assets/badges/17.png"
import darkBadgeSmall from "../../assets/badges/small/17.png"
import styles from "./Badges.module.css"

export const TypeDarkBadge = ({small}) => (
    <div key="Dark">
        <img src={small ? darkBadgeSmall : darkBadge} alt="Dark" className={styles.badge}/>
    </div>
)