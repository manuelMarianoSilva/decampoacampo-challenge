
import { useEffect, useRef, useState } from "react";
import { Lottie } from "lottie-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import star from "../../assets/animations/starburst.json";
import { favoriteToggled, MAX_FAVORITES } from "../../store/favoritesSlice";
import styles from "./FavoriteButton.module.css";

const favoriteFrame = 21;
const segmentEnd = favoriteFrame + 1;

export const FavoriteButton = ({ pokemonId, pokemonName }) => {
  const lottieRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const dispatch = useDispatch();
  const isFavorite = useSelector((state) =>
    state.favorites.ids.includes(pokemonId),
  );
  const favoriteCount = useSelector((state) => state.favorites.ids.length);
  const capitalizedPokemonName =
    pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
  const isFavoriteRef = useRef(isFavorite);

  useEffect(() => {
    isFavoriteRef.current = isFavorite;
  }, [isFavorite]);

  const handleClick = (event) => {
    event.stopPropagation();

    const isAddingFavorite = !isFavorite;
    if (isAddingFavorite && favoriteCount >= MAX_FAVORITES) {
      toast("You can only select six favourite Pokémon");
      return;
    }

    if (isAnimating) return;

    const animation = lottieRef.current;
    if (animation) {
      setIsAnimating(true);
      animation.playSegments(
        isAddingFavorite ? [0, segmentEnd] : [segmentEnd, 0],
      );
    }

    dispatch(favoriteToggled(pokemonId));
    
    if (!isFavorite) {
      toast(`${capitalizedPokemonName} is a favorite now!!!`);
    } else {
      toast(`You've just removed ${capitalizedPokemonName} from your favorites. We're sad to see it go.`);
    }
  };

  const handleAnimationReady = () => {
    const animation = lottieRef.current;
    if (!animation) return;

    animation.seek(isFavoriteRef.current ? favoriteFrame : 0);
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);

    const animation = lottieRef.current;
    if (!animation) return;

    animation.seek(isFavoriteRef.current ? favoriteFrame : 0);
  };

  const tooltipText = isFavorite ? "Remove from favorites" : "Add to favorites";
  
  return (
    <button
      type="button"
      onClick={handleClick}
      className={styles.favoriteButton}
      aria-label={tooltipText}
      aria-pressed={isFavorite}
      data-tooltip={tooltipText}
    >
      <Lottie
        lottieRef={lottieRef}
        src={star}
        autoplay={false}
        loop={false}
        subscriptions={{
          ready: handleAnimationReady,
          complete: handleAnimationComplete,
        }}
        className={styles.star}
      />
    </button>
  );
};