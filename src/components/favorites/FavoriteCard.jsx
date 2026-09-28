import { useDraggable } from "@dnd-kit/core";
import { useNavigate } from "react-router-dom";
import { useGetPokemonById } from "../../hooks/useGetPokemonById";
import { typeIndex } from "../typeBadges/typeIndex.jsx";
import styles from "./FavoriteCard.module.css";

export const FavoriteCard = ({
    pokemonId,
    slotIndex,
    generation,
    didDragRef,
}) => {
    const { data: pokemon, isLoading, error } = useGetPokemonById(pokemonId);
    const navigate = useNavigate();
    const { attributes, isDragging, listeners, setNodeRef, transform } =
        useDraggable({
            id: `favorite-pokemon-${pokemonId}`,
            data: { pokemonId, sourceSlot: slotIndex },
        });

    const openDetails = () => {
        navigate(`/details?id=${pokemonId}`, { state: { from: "/favorites" } });
    };

    const handleClick = (event) => {
        if (didDragRef.current) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        openDetails();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !isDragging) {
            event.preventDefault();
            if (!didDragRef.current) openDetails();
            return;
        }

        listeners?.onKeyDown?.(event);
    };

    const cardProps = {
        ref: setNodeRef,
        ...attributes,
        ...listeners,
        role: "link",
        tabIndex: 0,
        "aria-label": `Open ${pokemon?.name ?? `Pokémon ${pokemonId}`} details; hold to move`,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        style: {
            transform: transform
                ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
                : undefined,
            opacity: isDragging ? 0.55 : 1,
            zIndex: isDragging ? 2 : undefined,
        },
    };

    if (isLoading) {
        return (
            <article {...cardProps} className={styles.card}>
                <span className={styles.status}>Loading Pokémon...</span>
            </article>
        );
    }

    if (error || !pokemon) {
        return (
            <article {...cardProps} className={styles.card}>
                <span className={styles.status}>Pokémon data unavailable</span>
            </article>
        );
    }

    const sprite =
        pokemon.sprites?.front_default ??
        pokemon.sprites?.other?.["official-artwork"]?.front_default;

    return (
        <article {...cardProps} className={styles.card}>
            <div className={styles.spriteFrame}>
                {sprite ? (
                    <img
                        className={styles.sprite}
                        src={sprite}
                        alt={`${pokemon.name} sprite`}
                    />
                ) : (
                    <span className={styles.status}>No sprite available</span>
                )}
            </div>
            <h2 className={styles.name}>{pokemon.name}</h2>
            <p className={styles.generation}>
                {generation ? `Generation ${generation}` : "Generation unavailable"}
            </p>
            <div className={styles.types} aria-label="Types">
                {pokemon.types.map(({ type }) => {
                    const typeId = Number(type.url.match(/\/(\d+)\/?$/)?.[1]);
                    const badge = typeIndex[typeId]?.small;
                    return badge ? <span key={type.name} title={type.name}>
                        {badge}
                    </span> : null;
                })}
            </div>
        </article>
    );
};
