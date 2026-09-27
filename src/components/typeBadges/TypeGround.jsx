import groundBadge from "../../assets/badges/5.png"
import groundBadgeSmall from "../../assets/badges/small/5.png"
import styles from "./Badges.module.css"

export const TypeGroundBadge = ({small}) => (
    <div key="Ground">
        <img src={small ? groundBadgeSmall : groundBadge} alt="Ground" className={styles.badge}/>
    </div>
)