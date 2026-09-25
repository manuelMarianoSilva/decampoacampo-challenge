import { useGetPokemonsPaginatedQuery } from "../services/pokemonApi.js"
import { PAGE_SIZE } from "../utils/constants.js"
import { useState, useEffect } from "react"

export const useGetPokemonsPaginated = () => {
  const [offset, setOffset] = useState(0)
  const [items, setItems] = useState([])
  const [hasMore, setHasMore] = useState(true)

  const { data, isLoading, isFetching, error } = useGetPokemonsPaginatedQuery({
    limit: PAGE_SIZE,
    offset,
  })

  useEffect(() => {
    if (!data) return
    setItems((prev) => {
      const seen = new Set(prev.map((p) => p.name))
      const newOnes = data.results.filter((p) => !seen.has(p.name))
      return [...prev, ...newOnes]
    })
    setHasMore(Boolean(data.next))
  }, [data])

  const fetchNextPage = () => {
    if (hasMore && !isFetching) {
      setOffset((prev) => prev + PAGE_SIZE)
    }
  }

  return { items, isLoading, isFetching, error, hasMore, fetchNextPage }
}