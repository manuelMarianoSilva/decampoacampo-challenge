import { useState } from "react";
import { Lottie } from "lottie-react";
import styles from "./ListItem.module.css";
import star from "../../assets/animations/Star.json";
import { FavoriteButton } from "../favoriteButton/FavoriteButton";
import pokeball from "../../assets/animations/Pokeball rotation animation.json"

export const ListItem = ({ pokemon }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const id = pokemon?.url.match(/\/pokemon\/(\d+)\//)?.[1];
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    return (
        <div className={styles.listRow}>
            <span className={styles.fontPokemon}>{pokemon.name}</span>
            <div className={styles.imageWrapper}>
                {!imageLoaded && (
                    <div className={styles.imagePlaceholder}>
                        <Lottie src={pokeball} autoplay loop/>
                    </div>
                )}
                <img
                    src={spriteUrl}
                    alt={`Image of ${pokemon.name}`}
                    onLoad={() => setImageLoaded(true)}
                    className={imageLoaded ? styles.imageVisible : styles.imageHidden}
                />
            </div>
            <FavoriteButton />
        </div>
    );
};