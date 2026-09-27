import { useIsOnline } from "../../hooks/useIsOnline"
import { useSelector } from "react-redux"
import styles from "./OnlineIndicator.module.css"

export const OnlineIndicator = () => {
  const isOnline = useIsOnline()
  const { hasCachedData, hasFreshData } = useSelector(
    (state) => state.pokemonList.dataSource,
  )
  const dataStatus = hasCachedData && hasFreshData
    ? { label: "Mixed data", variant: "mixed" }
    : hasFreshData
      ? { label: "Fresh online data", variant: "fresh" }
      : hasCachedData
        ? { label: "Cached data", variant: "cached" }
        : { label: "List data not loaded", variant: "loading" }

  return (
    <div
      className={styles.connectionStatus}
      role="status"
      aria-live="polite"
      aria-label={`Connection ${isOnline ? "online" : "offline"}. ${dataStatus.label}.`}
    >
      <span
        className={`${styles.statusItem} ${isOnline ? styles.online : styles.offline}`}
      >
        {isOnline ? "Online" : "Offline"}
      </span>
      <span className={`${styles.statusItem} ${styles[dataStatus.variant]}`}>
        {dataStatus.label}
      </span>
    </div>
  )
}