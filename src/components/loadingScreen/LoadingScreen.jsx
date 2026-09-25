import { Lottie } from "lottie-react"
import spinningPokeball from "../../assets/animations/Pokeball.json"
import styles from "./loadingScreen.module.css"

export const LoadingScreen = () => {
    return (
        <div className={styles.spinnerContainer}>
            <Lottie src={spinningPokeball} className={styles.spinner} autoplay loop />
            <p>Loading...</p>
        </div>
    )
}