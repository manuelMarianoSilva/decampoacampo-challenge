import { useState } from "react";
import styles from "./DetailsView.module.css";
import { Lottie } from "lottie-react";

export const ImageWithLoader = ({ src, alt, animationData, className, imgClassName, variant = "main" }) => {
    const wrapperClass = variant === "main" ? styles.wrapperMain : styles.wrapperSecondary;
    const [isLoaded, setIsLoaded] = useState(false);    

    return (
        <div className={wrapperClass}>
            {!isLoaded && (
                <Lottie
                    src={animationData}
                    loop
                    autoplay
                    style={{ width: "100%", height: "100%" }}
                />
            )}
            <img
                src={src}
                alt={alt}
                className={imgClassName}
                onLoad={() => setIsLoaded(true)}
                style={{ display: isLoaded ? "block" : "none" }}
            />
        </div>
    );
};