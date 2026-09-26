import { useState } from "react";
import { Lottie } from "lottie-react";
import styles from "./ListItem.module.css";
import { FavoriteButton } from "../favoriteButton/FavoriteButton";
import { SpriteContainer } from "./SpriteContainer";
import { typeIndex } from "../typeBadges/typeIndex";
import { TypeBadges } from "./TypeBadges";
import { useNavigate } from "react-router";


export const ListItem = ({ pokemon }) => {
    const navigate = useNavigate()
    const id = pokemon?.url.match(/\/pokemon\/(\d+)\//)?.[1];

    return (
        <div className={styles.listRow} key={`pokemon-id-${id}`} onClick={() => navigate(`/details?id=${id}`)}>
            <div>
                <input type="checkbox" />
            </div>
            <div className={styles.nameAndBadgesContainer}>
                <span className={styles.fontPokemon}>{id} - {pokemon.name}</span>
                <TypeBadges id={id}/>
            </div>
            <SpriteContainer id={id} name={pokemon.name} />
            <FavoriteButton />
        </div>
    );
};