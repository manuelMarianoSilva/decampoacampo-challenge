import iceBadge from "../../assets/badges/15.png"
import iceBadgeSmall from "../../assets/badges/small/15.png"
import styles from "./Badges.module.css"

export const TypeIceBadge = ({small}) => (
    <div key="Ice">
        <img src={small ? iceBadgeSmall : iceBadge} alt="Ice" className={styles.badge}/>
    </div>
)