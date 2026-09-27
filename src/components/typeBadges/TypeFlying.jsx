import flyingBadge from "../../assets/badges/3.png"
import flyingBadgeSmall from "../../assets/badges/small/3.png"
import styles from "./Badges.module.css"

export const TypeFlyingBadge = ({small}) => (
    <div key="Flying">
        <img src={small ? flyingBadgeSmall : flyingBadge} alt="Flying" className={styles.badge}/>
    </div>
)