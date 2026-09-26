import { Lottie } from "lottie-react"
import spinningPokeball from "../../assets/animations/pokeball_spin.json"
import styles from "./loadingScreen.module.css"

export const LoadingScreen = () => {
    return (
        <div className={styles.spinnerContainer}>
            <Lottie src={spinningPokeball} className={styles.spinner} autoplay loop />
            <p>Loading...</p>
        </div>
    )
}