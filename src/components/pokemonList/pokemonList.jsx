import { useRef, useEffect, useLayoutEffect, useMemo } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useGetPokemonsPaginated } from "../../hooks/useGetPokemonsPaginated"
import { useElementalTypes } from "../../hooks/useElementalTypes"
import { useGetGenerations } from "../../hooks/useGetGenerations"
import { ListItem } from "../listItem/ListItem.jsx"
import { PAGE_SIZE, ROW_HEIGHT } from "../../utils/constants"
import { LoadingScreen } from "../loadingScreen/LoadingScreen.jsx"
import { LoadingMoreItems } from "../loadingMoreItems/LoadingMoreItems.jsx"
import { Filters } from "../filters/filters.jsx"
import { typeNameIndex } from "../typeBadges/typeIndex.jsx"
import { dataSourceReset, scrollPositionSaved } from "../../store/pokemonListSlice"
import sad_pikachu from "../../assets/images/sad_pikachu.png"
import confused_psyduck from "../../assets/images/confused_psyduck.png"
import scared_ash from "../../assets/images/scared_ash.png"
import styles from "./PokemonList.module.css"

export const PokemonList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const listHasItems = useSelector((state) => state.pokemonList.items.length > 0)
  const listHadItemsAtMount = useRef(listHasItems)

  useLayoutEffect(() => {
    dispatch(dataSourceReset(listHadItemsAtMount.current))
  }, [dispatch])

  const {
    items,
    offset,
    isLoading,
    isFetching,
    error,
    hasMore,
    fetchNextPage,
    refetchData,
  } = useGetPokemonsPaginated()
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
  } = useGetGenerations()
  const typeId = useMemo(() => typeNameIndex[filters.type], [filters.type])
  const filterIndexLoading = Boolean(
    (filters.type && typesLoading) || (filters.generation && generationsLoading),
  )
  const filterIndexError = (filters.type && typesError) || (filters.generation && generationsError)
  const indexesReady = !filterIndexLoading && !filterIndexError
  const normalizedName = useMemo(
    () => filters.name.trim().toLowerCase(),
    [filters.name],
  )
  const filteredItems = useMemo(() => {
    if (!indexesReady) return []

    return items.filter((pokemon) => {
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
  }, [indexesReady, items, normalizedName, filters.type, filters.generation, typeId, allTypes, generations])

  const savedScrollTop = useSelector((state) => state.pokemonList.scrollTop)
  const favoriteCount = useSelector((state) =>
    state.favorites.ids.filter(Boolean).length,
  )

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
        <div className={styles.filterBar}>
          <Filters />
        </div>
      </section>

      {/* The scrollable container for the virtualized list. Ideally this would be a separate component,
      particulary the error handling screens. Something for my todo list I guess.  */}
      <div ref={parentRef} className={styles.scrollContainer} onScroll={handleScroll}>
        {isLoading && items.length === 0 ? (
          <LoadingScreen />
        ) : error && items.length === 0 ? (
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem"}}>
            <img src={scared_ash} alt="Scared Ash" style={{height: "260px", width: "260px"}}/>
            <>Something really bad happened, Ash is scared!</>
            <button onClick={() => refetchData()}>Retry</button>
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

      <footer className={styles.actionFooter}>
        <div className={styles.actionButtons}>
          <button
            type="button"
            className={styles.actionButton}
            disabled={favoriteCount === 0}
            onClick={() => window.location.href = "/favorites"}
          >
            See Favorites
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => navigate("/compare")}
          >
            Compare Pokémon
          </button>
        </div>
      </footer>
    </div>
  )
}

export const PokemonListRoute = () => {
  const cacheHydrated = useSelector((state) => state.pokemonList.cacheHydrated)

  return cacheHydrated ? <PokemonList /> : <LoadingScreen />
}