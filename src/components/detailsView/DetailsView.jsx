import { useGetPokemonById } from "../../hooks/useGetPokemonById";
import { useNavigate, useSearchParams } from "react-router"
import { typeIndex } from "../typeBadges/typeIndex";
import styles from "./DetailsView.module.css";
import { ImageWithLoader } from "./ImageWithLoader";
import pokeballSpin from "../../assets/animations/pokeball_spin.json"
import pokeballLines from "../../assets/animations/pokeball_lines.json"
import { LoadingScreen } from "../loadingScreen/LoadingScreen";


const MAX_STAT_VALUE = 255 // approximate ceiling for base stats, used to scale bar width

const STAT_LABELS = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Special Attack",
    "special-defense": "Special Defense",
    speed: "Speed",
}

function getAllSprites(sprites) {
    if (!sprites) return []

    const candidates = [
        { label: "Front", url: sprites.front_default },
        { label: "Shiny", url: sprites.front_shiny },
        { label: "Front (female)", url: sprites.front_female },
        { label: "Shiny (female)", url: sprites.front_shiny_female },
        { label: "Back", url: sprites.back_default },
        { label: "Back Shiny", url: sprites.back_shiny },
        { label: "Back (female)", url: sprites.back_female },
        { label: "Back Shiny (Female)", url: sprites.back_shiny_female },
        { label: "Official Artwork", url: sprites.other?.["official-artwork"]?.front_default },
        { label: "Home", url: sprites.other?.home?.front_default },
        { label: "Dream World", url: sprites.other?.dream_world?.front_default },
    ]

    // filter out any that are null/missing, since availability varies per Pokémon
    return candidates.filter((s) => s.url)
}

export const DetailsView = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const pokemonId = searchParams.get("id");
    const { data: pokemon, isLoading, error, refetch } = useGetPokemonById(pokemonId)

    if (isLoading) {
        return <LoadingScreen />
    }

    if (error || !pokemon) {
        return (
            <>
                <button onClick={() => navigate("/")} className={styles.backButton}>Back</button>
                <button onClick={() => refetch()} className={styles.backButton}>Retry</button>
                <p>There was a problem loading Pokémon data, please try again.</p>
            </>
        )
    }

    const sprites = getAllSprites(pokemon.sprites)
    const mainSprite = pokemon.sprites?.other?.["official-artwork"]?.front_default
        ?? pokemon.sprites?.front_default
        ?? sprites[0]?.url

    return (
        <>
            <button onClick={() => navigate("/")} className={styles.backButton}>Back</button>

            <h1 className={styles.title}>{pokemon.name}</h1>

            {/* Main Sprite */}
            {mainSprite && (
                <ImageWithLoader
                    src={mainSprite}
                    alt={pokemon.name}
                    animationData={pokeballSpin}
                    className={styles.mainSpriteWrapper}
                    imgClassName={styles.mainSprite}
                />
            )}

           {/* Alt Sprites */}
            <section>
                <h2>Sprites</h2>
                {sprites.length === 0 ? (
                    <p>No available sprites.</p>
                ) : (
                    <div className={styles.spritesGrid}>
                        {sprites.map((sprite) => (
                            <div key={sprite.label} className={styles.spriteItem}>
                                <ImageWithLoader
                                    src={sprite.url}
                                    alt={`${pokemon.name} - ${sprite.label}`}
                                    animationData={pokeballLines}
                                    className={styles.spriteImageWrapper}
                                    imgClassName={styles.spriteImage}
                                    variant="alternative"
                                />
                                <div className={styles.spriteLabel}>{sprite.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2>Types</h2>
                <div className={styles.typesRow}>
                    {pokemon.types.map(({ type }) => {
                        const typeId = Number(type.url.match(/\/(\d+)\/?$/)[1])
                        return (
                            <span key={type.name}>
                                {typeIndex[typeId]?.default}
                            </span>
                        )
                    })}
                </div>
            </section>

            {/* Skills */}
            <section>
                <h2>Skills</h2>
                <ul className={styles.abilitiesList}>
                    {pokemon.abilities.map(({ ability, is_hidden }) => (
                        <li key={ability.name} className={styles.abilityItem}>
                            {ability.name}{is_hidden && " (hidden)"}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Stats */}
            <section>
                <h2>Stats</h2>
                {pokemon.stats.map(({ stat, base_stat }) => (
                    <div key={stat.name} className={styles.statRow}>
                        <div className={styles.statHeader}>
                            <span>{STAT_LABELS[stat.name] ?? stat.name}</span>
                            <span>{base_stat}</span>
                        </div>
                        <div className={styles.statBarTrack}>
                            <div
                                className={styles.statBarFill}
                                style={{ width: `${Math.min((base_stat / MAX_STAT_VALUE) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </section>

            {/* Physical data */}
            <section>
                <h2>Physical Data</h2>
                <p>Height: {(pokemon.height / 10).toFixed(1)} m</p>
                <p>Weight: {(pokemon.weight / 10).toFixed(1)} kg</p>
            </section>
        </>
    )
}