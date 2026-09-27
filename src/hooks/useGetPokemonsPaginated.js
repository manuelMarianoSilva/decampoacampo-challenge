import { useGetPokemonsPaginatedQuery } from "../services/pokemonApi.js"
import {
  PAGE_SIZE,
  PERSISTED_PAGE_REVALIDATE_SECONDS,
} from "../utils/constants.js"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useIsOnline } from "./useIsOnline.js"
import {
  cachedPageObserved,
  freshPageReceived,
  nextPageRequested,
  pageAppended,
} from "../store/pokemonListSlice"

export const useGetPokemonsPaginated = () => {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.pokemonList.items)
  const offset = useSelector((state) => state.pokemonList.offset)
  const nextOffset = useSelector((state) => state.pokemonList.nextOffset)
  const hasMore = useSelector((state) => state.pokemonList.hasMore)
  const isOnline = useIsOnline()
  const { hasCachedData, hasFreshData } = useSelector(
    (state) => state.pokemonList.dataSource,
  )

  const {
    currentData,
    fulfilledTimeStamp,
    isLoading,
    isFetching,
    error,
    refetch: refetchData,
  } = useGetPokemonsPaginatedQuery(
    { limit: PAGE_SIZE, offset },
    { refetchOnMountOrArgChange: PERSISTED_PAGE_REVALIDATE_SECONDS },
  )
  const requestInFlightRef = useRef(false)
  const fulfilledTimeAtRequestStartRef = useRef(undefined)

  // Avoid re-dispatching pageAppended for a page we've already merged —
  // relevant right after rehydration, when `offset` already points past 0.
  const mergedOffsetRef = useRef(-1)
  const wasOnlineRef = useRef(isOnline)

  useEffect(() => {
    if (!currentData) return
    if (mergedOffsetRef.current === offset) return
    mergedOffsetRef.current = offset
    dispatch(pageAppended({
      results: currentData.results,
      hasNext: Boolean(currentData.next),
      offset,
    }))
  }, [currentData, offset, dispatch])

  useEffect(() => {
    if (isFetching) {
      if (!requestInFlightRef.current) {
        requestInFlightRef.current = true
        fulfilledTimeAtRequestStartRef.current = fulfilledTimeStamp
      }
      return
    }

    if (requestInFlightRef.current) {
      const requestSucceeded =
        currentData &&
        !error &&
        fulfilledTimeStamp !== fulfilledTimeAtRequestStartRef.current

      if (requestSucceeded) {
        dispatch(freshPageReceived())
      } else if (currentData) {
        dispatch(cachedPageObserved())
      }
      requestInFlightRef.current = false
      fulfilledTimeAtRequestStartRef.current = undefined
      return
    }

    if (currentData) dispatch(cachedPageObserved())
  }, [currentData, fulfilledTimeStamp, isFetching, error, dispatch])

  useEffect(() => {
    const hasReconnected = isOnline && !wasOnlineRef.current
    wasOnlineRef.current = isOnline
    if (hasReconnected && error && hasMore) refetchData()
  }, [isOnline, error, hasMore, refetchData])

  const dataStatus = (() => {
    if (isFetching && hasCachedData && items.length > 0) {
      return { label: "Mixed · updating", variant: "mixed" }
    }

    if (hasCachedData && hasFreshData) {
      return { label: "Mixed data", variant: "mixed" }
    }

    if (hasFreshData) {
      return { label: "Fresh online data", variant: "fresh" }
    }

    if (hasCachedData) {
      return { label: "Cached data", variant: "cached" }
    }

    if (isLoading || isFetching) {
      return { label: "Loading data", variant: "loading" }
    }

    return { label: error ? "Data unavailable" : "Waiting for data", variant: "unavailable" }
  })()
  const requestFailedWithVisibleData = Boolean(error && items.length > 0)
  if (requestFailedWithVisibleData) {
    dataStatus.label = `${dataStatus.label} · update failed`
  }

  const fetchNextPage = () => {
    if (hasMore && !isFetching && !error && nextOffset !== offset) {
      dispatch(nextPageRequested(nextOffset))
    }
  }

  return {
    items,
    offset,
    isLoading,
    isFetching,
    error,
    hasMore,
    fetchNextPage,
    dataStatus,
    refetchData,
  }
}