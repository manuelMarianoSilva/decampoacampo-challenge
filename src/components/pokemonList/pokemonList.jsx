import { useRef, useEffect } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useGetPokemonsPaginated } from "../../hooks/useGetPokemonsPaginated"
import { ListItem } from "../listItem/ListItem"
import { ROW_HEIGHT } from "../../utils/constants"
import { LoadingScreen } from "../loadingScreen/LoadingScreen"
import { LoadingMoreItems } from "../loadingMoreItems/LoadingMoreItems"
import styles from "./PokemonList.module.css"


export const PokemonList = () => {
  const { items, isLoading, isFetching, error, hasMore, fetchNextPage } =
    useGetPokemonsPaginated()

  const parentRef = useRef(null)

  const rowVirtualizer = useVirtualizer({
    count: hasMore ? items.length + 1 : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1]
    if (!lastItem) return
    if (lastItem.index >= items.length - 1 && hasMore && !isFetching) {
      fetchNextPage()
    }
  }, [virtualItems, items.length, hasMore, isFetching, fetchNextPage])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return <>Something really bad happened</>
  }

  return (
    <div ref={parentRef} className={styles.scrollContainer} >
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