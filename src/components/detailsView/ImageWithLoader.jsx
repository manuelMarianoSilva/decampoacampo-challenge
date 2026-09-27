import { useState } from "react";
import styles from "./DetailsView.module.css";
import defaultFallbackImage from "../../assets/images/international-pokemon-logo.svg";
import { Lottie } from "lottie-react";

export const ImageWithLoader = ({ src, alt, animationData, className, imgClassName, variant = "main" }) => {
    const baseWrapperClass = variant === "main" ? styles.wrapperMain : styles.wrapperSecondary;
    const wrapperClass = className ? `${baseWrapperClass} ${className}` : baseWrapperClass;
    const [isLoaded, setIsLoaded] = useState(false);    
    const [isError, setIsError] = useState(false);

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
                src={isError ? defaultFallbackImage : src}
                alt={alt}
                className={imgClassName}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setIsError(true);
                    setIsLoaded(true);
                }} 
                style={{ display: isLoaded ? "block" : "none" }}
            />
        </div>
    );
};