
import { useRef, useState } from "react";
import { Lottie } from "lottie-react";
import star from "../../assets/animations/starburst.json";
import styles from "./FavoriteButton.module.css";

export const FavoriteButton = () => {
  const lottieRef = useRef(null);
  const [isPlayingForward, setIsPlayingForward] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    lottieRef.current.setDirection(isPlayingForward ? "forward" : "reverse");
    lottieRef.current.play();
    setIsPlayingForward(!isPlayingForward);
  };

  return (
    <button
      onClick={handleClick}
      className={styles.favoriteButton}
      data-tooltip={isPlayingForward ? "Add to favorites" : "Remove from favorites"}
    >
      <Lottie
        lottieRef={lottieRef}
        src={star}
        autoplay={false}
        loop={false}
        subscriptions={{
          complete: () => setIsAnimating(false),
        }}
        className={styles.star}
      />
    </button>
  );
};