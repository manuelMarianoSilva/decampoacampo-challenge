import { useRef, useEffect, useLayoutEffect } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router"
import { useGetPokemonsPaginated } from "../../hooks/useGetPokemonsPaginated"
import { useElementalTypes } from "../../hooks/useElementalTypes"
import { useGetGenerations } from "../../hooks/useGetGenerations"
import { ListItem } from "../listItem/ListItem.jsx"
import { PAGE_SIZE, ROW_HEIGHT } from "../../utils/constants"
import { LoadingScreen } from "../loadingScreen/LoadingScreen.jsx"
import { LoadingMoreItems } from "../loadingMoreItems/LoadingMoreItems.jsx"
import { Filters } from "../filters/filters.jsx"
import { typeNameIndex } from "../typeBadges/typeIndex.jsx"
import { scrollPositionSaved } from "../../store/pokemonListSlice"
import sad_pikachu from "../../assets/images/sad_pikachu.png"
import confused_psyduck from "../../assets/images/confused_psyduck.png"
import scared_ash from "../../assets/images/scared_ash.png"
import styles from "./PokemonList.module.css"

export const PokemonList = () => {
  const { items, offset, isLoading, isFetching, error, hasMore, fetchNextPage } =
    useGetPokemonsPaginated()
  const [searchParams] = useSearchParams()
  const filters = {
    name: searchParams.get("name") ?? "",
    type: searchParams.get("type") ?? "",
    generation: searchParams.get("generation") ?? "",
  }
  const { allTypes, isLoading: typesLoading, error: typesError } =
    useElementalTypes()
  const {
    generations,
    isLoading: generationsLoading,
    error: generationsError,
  } = useGetGenerations({ skip: !filters.generation })
  const typeId = typeNameIndex[filters.type]
  const filterIndexLoading = Boolean(
    (filters.type && typesLoading) || (filters.generation && generationsLoading),
  )
  const filterIndexError = (filters.type && typesError) || (filters.generation && generationsError)
  const indexesReady = !filterIndexLoading && !filterIndexError
  const normalizedName = filters.name.trim().toLowerCase()
  const filteredItems = indexesReady
    ? items.filter((pokemon) => {
        if (normalizedName && !pokemon.name.toLowerCase().includes(normalizedName)) {
          return false
        }

        const pokemonId = Number(pokemon.url.match(/\/pokemon\/(\d+)\//)?.[1])
        if (filters.type && (!typeId || !allTypes?.[pokemonId]?.includes(typeId))) {
          return false
        }
        if (
          filters.generation &&
          Number(generations?.[pokemonId]) !== Number(filters.generation)
        ) {
          return false
        }

        return true
      })
    : []

  const dispatch = useDispatch()
  const savedScrollTop = useSelector((state) => state.pokemonList.scrollTop)

  const parentRef = useRef(null)
  const isRestoringRef = useRef(savedScrollTop > 0)
  const filterKey = `${filters.name}\u0000${filters.type}\u0000${filters.generation}`
  const previousFilterKeyRef = useRef(filterKey)
  const filtersChanged = previousFilterKeyRef.current !== filterKey

  const rowVirtualizer = useVirtualizer({
    count: indexesReady ? filteredItems.length + (hasMore ? 1 : 0) : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 15,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  useLayoutEffect(() => {
    const el = parentRef.current
    if (!el) return

    if (filtersChanged) {
      previousFilterKeyRef.current = filterKey
      isRestoringRef.current = false
      el.scrollTop = 0
      if (savedScrollTop !== 0) dispatch(scrollPositionSaved(0))
      return
    }

    if (savedScrollTop <= 0) {
      isRestoringRef.current = false
      return
    }

    isRestoringRef.current = true
    const maxScroll = el.scrollHeight - el.clientHeight

    if (maxScroll >= savedScrollTop || !hasMore && !isFetching) {
      el.scrollTop = savedScrollTop
      isRestoringRef.current = false

      if (el.scrollTop !== savedScrollTop) {
        dispatch(scrollPositionSaved(el.scrollTop))
      }
    }
  }, [dispatch, savedScrollTop, items.length, hasMore, isFetching, filtersChanged, filterKey])

  useEffect(() => {
    const el = parentRef.current
    if (
      filtersChanged ||
      savedScrollTop <= 0 ||
      !el ||
      !hasMore ||
      isFetching ||
      items.length < offset + PAGE_SIZE
    ) {
      return
    }

    const maxScroll = el.scrollHeight - el.clientHeight
    if (maxScroll < savedScrollTop) fetchNextPage()
  }, [filtersChanged, savedScrollTop, items.length, offset, hasMore, isFetching, fetchNextPage])

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
    if (!indexesReady || isRestoringRef.current) return
    const lastItem = virtualItems[virtualItems.length - 1]
    if (!lastItem) return
    if (lastItem.index >= filteredItems.length - 1 && hasMore && !isFetching) {
      fetchNextPage()
    }
  }, [filtersChanged, indexesReady, virtualItems, filteredItems.length, hasMore, isFetching, fetchNextPage])

  return (
    <div className={styles.view}>
      <section className={styles.filterSection} aria-label="Pokemon list filters">
        <Filters />
      </section>

      {/* The scrollable container for the virtualized list. Ideally this would be a separate component,
      particulary the error handling screens. Something for my todo list I guess.  */}
      <div ref={parentRef} className={styles.scrollContainer} onScroll={handleScroll}>
        {isLoading && items.length === 0 ? (
          <LoadingScreen />
        ) : error && items.length === 0 ? (
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem"}}>
            <img src={scared_ash} alt="Scared Ash" style={{height: "260px"}}/>
            <>Something really bad happened, Ash is scared!</>
          </div>
        ) : filterIndexLoading ? (
          <LoadingScreen />
        ) : filterIndexError ? (
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem"}}>
            <img src={confused_psyduck} alt="Confused Psyduck" style={{height: "260px"}}/>
            <>Psyduck is confused, filter data could not be loaded. Please try again.</>
          </div>
        ) : filteredItems.length === 0 && !hasMore ? (
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem"}}>
            <img src={sad_pikachu} alt="Sad Pikachu" style={{height: "260px"}} />
            No Pokémon match these filters, and that makes Pikachu sad.
          </div>
        ) : (
          <div
            className={styles.spacer}
            style={{ "--total-size": `${rowVirtualizer.getTotalSize()}px` }}
          >
            {virtualItems.map((virtualRow) => {
              const isLoaderRow = virtualRow.index >= filteredItems.length
              const pokemon = filteredItems[virtualRow.index]

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
        )}
      </div>
    </div>
  )
}