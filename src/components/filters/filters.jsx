import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router"
import { TOTAL_GENERATIONS } from "../../utils/constants"
import { typenames } from "../typeBadges/typeIndex"
import styles from "./filters.module.css"

const readFilters = (searchParams) => ({
	name: searchParams.get("name") ?? "",
	type: searchParams.get("type") ?? "",
	generation: searchParams.get("generation") ?? "",
})

export const Filters = ({ onFiltersChange }) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [filters, setFilters] = useState(() => readFilters(searchParams))
	const filtersRef = useRef(filters)
	const searchParamsRef = useRef(searchParams)
	const nameDebounceRef = useRef(null)

	useEffect(() => {
		const currentParams = new URLSearchParams(searchParams)
		if (currentParams.toString() === searchParamsRef.current.toString()) return

		searchParamsRef.current = currentParams
		clearTimeout(nameDebounceRef.current)
		const nextFilters = readFilters(currentParams)
		filtersRef.current = nextFilters
		setFilters(nextFilters)
	}, [searchParams])

	useEffect(() => () => clearTimeout(nameDebounceRef.current), [])

	const updateSearchParam = (name, value) => {
		const nextSearchParams = new URLSearchParams(searchParamsRef.current)
		if (value) {
			nextSearchParams.set(name, value)
		} else {
			nextSearchParams.delete(name)
		}

		searchParamsRef.current = nextSearchParams
		setSearchParams(nextSearchParams, { replace: true })
	}

	const handleChange = (event) => {
		const { name, value } = event.target
		const nextFilters = { ...filtersRef.current, [name]: value }
		filtersRef.current = nextFilters
		setFilters(nextFilters)
		onFiltersChange?.(nextFilters)

		if (name === "name") {
			clearTimeout(nameDebounceRef.current)
			nameDebounceRef.current = setTimeout(() => {
				updateSearchParam("name", filtersRef.current.name)
			}, 300)
		} else {
			updateSearchParam(name, value)
		}
	}

	return (
		<div className={styles.filters}>
			<label className={styles.control}>
				<span>Name</span>
				<input
					type="search"
					name="name"
					value={filters.name ?? ""}
					onChange={handleChange}
					placeholder="Search Pokemon"
				/>
			</label>

			<label className={styles.control}>
				<span>Type</span>
				<select name="type" value={filters.type} onChange={handleChange}>
					<option value="">All types</option>
					{typenames.map((typeName) => (
						<option key={typeName} value={typeName.toLowerCase()}>
							{typeName}
						</option>
					))}
				</select>
			</label>

			<label className={styles.control}>
				<span>Generation</span>
				<select
					name="generation"
					value={filters.generation}
					onChange={handleChange}
				>
					<option value="">All generations</option>
					{Array.from({ length: TOTAL_GENERATIONS }, (_, index) => index + 1).map(
						(generation) => (
							<option key={generation} value={generation}>
								{generation}
							</option>
						),
					)}
				</select>
			</label>
		</div>
	)
}
