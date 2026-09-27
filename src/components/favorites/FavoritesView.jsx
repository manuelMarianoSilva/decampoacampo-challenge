import { useSelector } from "react-redux";

export const FavoritesView = () => {
    const favoriteIds = useSelector((state) => state.favorites.ids);

    return (
        <div>
            <h1>Favorites</h1>
                <ul>
                    {favoriteIds.map((id) => (
                        <li key={id}>Pokémon ID: {id}</li>
                    ))}
                </ul>
        </div>
    );
}