import { useRef, useEffect, useLayoutEffect } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useDispatch, useSelector } from "react-redux"
import { useGetPokemonsPaginated } from "../../hooks/useGetPokemonsPaginated"
import { ListItem } from "../listItem/ListItem"
import { ROW_HEIGHT } from "../../utils/constants"
import { LoadingScreen } from "../loadingScreen/LoadingScreen"
import { LoadingMoreItems } from "../loadingMoreItems/LoadingMoreItems"
import { scrollPositionSaved } from "../../store/pokemonListSlice"
import styles from "./PokemonList.module.css"

const MAX_RESTORE_ATTEMPTS = 30 // ~0.5s at 60fps before giving up

export const PokemonList = () => {
  const { items, isLoading, isFetching, error, hasMore, fetchNextPage } =
    useGetPokemonsPaginated()

  const dispatch = useDispatch()
  const savedScrollTop = useSelector((state) => state.pokemonList.scrollTop)

  const parentRef = useRef(null)
  const hasRestoredScroll = useRef(false)
  const isRestoringRef = useRef(savedScrollTop > 0)
  const restoreAttemptRef = useRef(0)

  const rowVirtualizer = useVirtualizer({
    count: hasMore ? items.length + 1 : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 15,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  useLayoutEffect(() => {
    const el = parentRef.current
    if (!el) return

    if (savedScrollTop <= 0) {
      hasRestoredScroll.current = true
      isRestoringRef.current = false
      return
    }

    const attemptId = ++restoreAttemptRef.current
    hasRestoredScroll.current = false
    isRestoringRef.current = true

    let frameId
    let attempts = 0

    const tryRestore = () => {
      const currentEl = parentRef.current
      if (!currentEl) return

      const maxScroll = currentEl.scrollHeight - currentEl.clientHeight
      attempts += 1
      const givingUp = attempts >= MAX_RESTORE_ATTEMPTS

      if (maxScroll >= savedScrollTop || givingUp) {
        currentEl.scrollTop = savedScrollTop
        const settled = currentEl.scrollTop === savedScrollTop

        if (attemptId === restoreAttemptRef.current) {
          hasRestoredScroll.current = true
          isRestoringRef.current = false
        }

        if (!settled) {
          dispatch(scrollPositionSaved(currentEl.scrollTop))
        }
        return
      }

      frameId = requestAnimationFrame(tryRestore)
    }

    tryRestore()

    return () => {
      cancelAnimationFrame(frameId)
      if (attemptId === restoreAttemptRef.current) {
        hasRestoredScroll.current = false
        isRestoringRef.current = false
      }
    }
  }, [dispatch, savedScrollTop])
  const lastSavedAt = useRef(0)
  const handleScroll = () => {
    if (isRestoringRef.current) return // ignore scroll events fired by our own restore attempts
    const now = Date.now()
    if (now - lastSavedAt.current < 250) return
    lastSavedAt.current = now
    dispatch(scrollPositionSaved(parentRef.current.scrollTop))
  }

  useEffect(() => {
    return () => {
      if (!parentRef.current || isRestoringRef.current) return
      dispatch(scrollPositionSaved(parentRef.current.scrollTop))
    }
  }, [dispatch])

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1]
    if (!lastItem) return
    if (lastItem.index >= items.length - 1 && hasMore && !isFetching) {
      fetchNextPage()
    }
  }, [virtualItems, items.length, hasMore, isFetching, fetchNextPage])

  if (isLoading && items.length === 0) {
    return <LoadingScreen />
  }

  if (error && items.length === 0) {
    return <>Something really bad happened</>
  }

  return (
    <div ref={parentRef} className={styles.scrollContainer} onScroll={handleScroll}>
      <div
        className={styles.spacer}
        style={{ "--total-size": `${rowVirtualizer.getTotalSize()}px` }}
      >
        {virtualItems.map((virtualRow) => {
          const isLoaderRow = virtualRow.index > items.length - 1
          const pokemon = items[virtualRow.index]

          return (
            <div
              key={virtualRow.key}
              className={styles.row}
              style={{
                "--row-size": `${virtualRow.size}px`,
                "--row-start": `${virtualRow.start}px`,
              }}
            >
              {isLoaderRow ? (
                hasMore && (<LoadingMoreItems />)
              ) : (
                <ListItem pokemon={pokemon} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}