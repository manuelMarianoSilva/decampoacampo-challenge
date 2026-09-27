import { Lottie } from "lottie-react";
import { typeIndex } from "../typeBadges/typeIndex.jsx";
import loader from "../../assets/animations/blue_line_loader.json"
import styles from "./ListItem.module.css"
import { useElementalTypes } from "../../hooks/useElementalTypes";

export const TypeBadges = ({id}) => {
    const { allTypes, isLoading } = useElementalTypes()
    const pokemonTypes = allTypes?.[id];

    if (isLoading || !pokemonTypes || pokemonTypes.length === 0) {
        return (
            <Lottie src={loader} autoplay loop className={styles.lineLoader}/>
        )
    }
    
    return (
        <div className={styles.badgeContainer}>
            {pokemonTypes?.map((idx) => (
                <span key={`type-idx-${idx}`}>{typeIndex?.[idx].default}</span>
            ))}
        </div>
    )
}