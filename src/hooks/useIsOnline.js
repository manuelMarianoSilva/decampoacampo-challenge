import { useEffect, useState } from "react"

export const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  )

  useEffect(() => {
    const updateConnection = () => setIsOnline(navigator.onLine)
    window.addEventListener("online", updateConnection)
    window.addEventListener("offline", updateConnection)
    return () => {
      window.removeEventListener("online", updateConnection)
      window.removeEventListener("offline", updateConnection)
    }
  }, [])

  return isOnline
}