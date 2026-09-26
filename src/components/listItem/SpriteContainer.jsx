import pokeball from "../../assets/animations/pokeball_rotation.json";
import pokeballDefault from "../../assets/images/International_Pokémon_logo.svg"; // your fallback image
import { useState } from "react";
import styles from "./ListItem.module.css"
import { Lottie } from "lottie-react";

export const SpriteContainer = ({id, name}) => {    
    const [status, setStatus] = useState("loading"); // "loading" | "loaded" | "error"
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    return (
        <div className={styles.imageWrapper}>
            {status === "loading" && (
                <div className={styles.imagePlaceholder}>
                    <Lottie src={pokeball} autoplay loop />
                </div>
            )}

            {status === "error" ? (
                <img
                    src={pokeballDefault}
                    alt={`No image available for ${name}`}
                    className={styles.imageWrapper}
                />
            ) : (
                <img
                    src={spriteUrl}
                    alt={`Image of ${name}`}
                    onLoad={() => setStatus("loaded")}
                    onError={() => setStatus("error")}
                    className={status === "loaded" ? styles.imageVisible : styles.imageHidden}
                />
            )}
        </div>
    )
}