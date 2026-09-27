import { useIsOnline } from "../../hooks/useIsOnline"
import styles from "./OnlineIndicator.module.css"

export const OnlineIndicator = ({ dataStatus }) => {
  const isOnline = useIsOnline()

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