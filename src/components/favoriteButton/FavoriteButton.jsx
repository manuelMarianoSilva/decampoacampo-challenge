// import { useRef, useState } from "react";
// import { Lottie } from "lottie-react";
// import star from "../../assets/animations/Star.json"
// import styles from "./FavoriteButton.module.css"

// export const FavoriteButton = () => {
//   const lottieRef = useRef(null);
//   const [isPlayingForward, setIsPlayingForward] = useState(true);

//   const handleClick = () => {
//     if (isPlayingForward) {
//       // Play forward from current point to the end
//       lottieRef.current.setDirection(1);
//       lottieRef.current.play();
//     } else {
//       // Play backward from current point to the start
//       lottieRef.current.setDirection(-1);
//       lottieRef.current.play();
//     }
//     setIsPlayingForward(!isPlayingForward);
//   };

//   return (
//     <button onClick={handleClick} className={styles.favoriteButton} data-tooltip={"Add to Favorites"}>
//       <Lottie
//         lottieRef={lottieRef}
//         src={star}
//         autoplay={false}
//         loop={false}
//         className={styles.star}
//         onComplete={() => setIsAni}
//       />
//       </button>
//   );
// }

import { useRef, useState } from "react";
import { Lottie } from "lottie-react";
import star from "../../assets/animations/Star.json";
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