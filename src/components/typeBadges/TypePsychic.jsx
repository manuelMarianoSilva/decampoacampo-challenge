import psychicBadge from "../../assets/badges/14.png"
import psychicBadgeSmall from "../../assets/badges/small/14.png"
import styles from "./Badges.module.css"

export const TypePsychicBadge = ({small}) => (
    <img src={small ? psychicBadgeSmall : psychicBadge} alt="Psychic" className={styles.badge}/>
)