import { useState } from "react";
import { Lottie } from "lottie-react";
import styles from "./ListItem.module.css";
import star from "../../assets/animations/Star.json";
import { FavoriteButton } from "../favoriteButton/FavoriteButton";
import { useGetPokemonByIdQuery } from "../../services/pokemonApi";
import { SpriteContainer } from "./SpriteContainer";
import { useGetPokemonById } from "../../hooks/useGetPokemonById";
import { typeIndex } from "../typeBadges/typeIndex";
import { TypeBadges } from "./TypeBadges";

export const ListItem = ({ pokemon }) => {

    const id = pokemon?.url.match(/\/pokemon\/(\d+)\//)?.[1];
    const { data, isLoading, isFetching, error } = useGetPokemonById(id)

    // const types = data?.types.map(type => type.type.url.match(/\/(\d+)\/?$/)[1]);


    return (
        <div className={styles.listRow} key={`pokemon-id-${id}`}>
            <div>
                <input type="checkbox" />
            </div>
            <div className={styles.nameAndBadgesContainer}>
                <span className={styles.fontPokemon}>{id} - {pokemon.name}</span>
                <TypeBadges data={data}/>
            </div>
            <SpriteContainer id={id} name={pokemon.name} />
            <FavoriteButton />
        </div>
    );
};