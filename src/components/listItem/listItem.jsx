import styles from "./listItem.module.css"

export const ListItem = ({pokemon}) => {
    console.log("roberto carlos", pokemon);
    
    const id = pokemon?.url.match(/\/pokemon\/(\d+)\//)[1];
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    return (
        <div key={pokemon.name} className={styles.listRow}>
            <span className={styles.fontPokemon}>{pokemon.name}</span>
            <img src={spriteUrl} />
        </div>
    )
}