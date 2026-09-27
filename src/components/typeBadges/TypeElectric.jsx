import electricBadge from "../../assets/badges/13.png"
import electricBadgeSmall from "../../assets/badges/small/13.png"
import styles from "./Badges.module.css"

export const TypeElectricBadge = ({small}) => (
    <div key="Electric">
        <img src={small ? electricBadgeSmall : electricBadge} alt="Electric" className={styles.badge}/>
    </div>
)