import { Lottie } from "lottie-react"
import bulbasaur from "../../assets/animations/001 Bulbasaur.json"
import styles from "./LoadingMoreItems.module.css"

export const LoadingMoreItems = () => {
    return (
        <div className={styles.frameContainer}>
            <span className={styles.textContainer}>Loading more...</span>
            <div className={styles.animationContainer}>
                <Lottie src={bulbasaur} autoplay loop />
            </div>
        </div>
    )
}