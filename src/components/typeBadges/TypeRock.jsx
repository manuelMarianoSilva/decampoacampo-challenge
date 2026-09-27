import rockBadge from "../../assets/badges/6.png"
import rockBadgeSmall from "../../assets/badges/small/6.png"
import styles from "./Badges.module.css"

export const TypeRockBadge = ({small}) => (
    <div key="Rock">
        <img src={small ? rockBadgeSmall : rockBadge} alt="Rock" className={styles.badge}/>
    </div>
)