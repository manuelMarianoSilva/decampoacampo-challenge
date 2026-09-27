import { useGetPokemonsPaginatedQuery } from "../services/pokemonApi.js"
import { PAGE_SIZE } from "../utils/constants.js"
import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { pageAppended, nextPageRequested } from "../store/pokemonListSlice"

export const useGetPokemonsPaginated = () => {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.pokemonList.items)
  const offset = useSelector((state) => state.pokemonList.offset)
  const hasMore = useSelector((state) => state.pokemonList.hasMore)

  const { data, isLoading, isFetching, error } = useGetPokemonsPaginatedQuery({
    limit: PAGE_SIZE,
    offset,
  })

  // Avoid re-dispatching pageAppended for a page we've already merged —
  // relevant right after rehydration, when `offset` already points past 0.
  const mergedOffsetRef = useRef(-1)

  useEffect(() => {
    if (!data) return
    if (mergedOffsetRef.current === offset) return
    mergedOffsetRef.current = offset
    dispatch(pageAppended({ results: data.results, hasNext: Boolean(data.next) }))
  }, [data, offset, dispatch])

  const fetchNextPage = () => {
    if (hasMore && !isFetching) {
      dispatch(nextPageRequested(PAGE_SIZE))
    }
  }

  return { items, isLoading, isFetching, error, hasMore, fetchNextPage }
}